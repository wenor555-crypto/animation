#!/usr/bin/env python3
"""Site for «Η Έξυπνη Σίτα»: the public series page (latest rendered revision of every episode, watch or download the MP4)
and the private review tool (watch the draft HTML and drop notes on the frame while it plays).

Standard library only. Binds 127.0.0.1; the public hostname reaches it through the Cloudflare tunnel.

  python3 server.py [--port 8790]

Folders (env overrides):
  SITA_RENDER  ~/sita-render   dist/<ep>.html = drafts for review
  SITA_SITE    ~/sita-site     releases/<slug>/rNN.{mp4,html,json,jpg}, review/<ep>.jsonl, review/shots/<ep>/<id>.jpg,
                               secret.json (review passphrase + cookie key, mode 600, created on first run)
"""
import base64, hashlib, hmac, html, json, mimetypes, os, re, secrets, sys, threading, time, urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

RENDER = Path(os.environ.get('SITA_RENDER', '~/sita-render')).expanduser()
SITE = Path(os.environ.get('SITA_SITE', '~/sita-site')).expanduser()
HERE = Path(__file__).resolve().parent
STATIC = HERE / 'static'
NAME = re.compile(r'^[a-z0-9_-]{1,40}$')
LOCK = threading.Lock()
MAX_NOTE = 600_000                     # one note with its snapshot
CATS = {'visual': '🎨 Οπτικό', 'audio': '🔊 Φωνή/ήχος', 'timing': '⏱ Timing', 'line': '💬 Ατάκα', 'like': '👍 Μ\'αρέσει', 'comment': '✍️ Σχόλιο'}


def secret():
    p = SITE / 'secret.json'
    if not p.exists():
        SITE.mkdir(parents=True, exist_ok=True)
        words = ['σίτα', 'ταψί', 'παντόφλα', 'καμπάνα', 'σύκο', 'κότα', 'λέιζερ', 'παρτίδα', 'καφενείο', 'μπίρα']
        pw = '-'.join(secrets.choice(words) for _ in range(3)) + '-' + str(secrets.randbelow(900) + 100)
        p.write_text(json.dumps({'passphrase': pw, 'key': secrets.token_hex(32)}, ensure_ascii=False))
        p.chmod(0o600)
    return json.loads(p.read_text())


def site_cfg():
    try:
        return json.loads((HERE / 'site.json').read_text())
    except (OSError, ValueError):
        return {'episodes': []}


def releases(slug):
    """[(n, meta)] of a public episode, newest first."""
    d = SITE / 'releases' / slug
    out = []
    for f in d.glob('r*.json') if d.is_dir() else []:
        try:
            m = json.loads(f.read_text()); out.append((m['n'], m))
        except (OSError, ValueError, KeyError):
            pass
    return sorted(out, key=lambda x: -x[0])


def events(ep):
    p = SITE / 'review' / f'{ep}.jsonl'
    if not p.exists():
        return []
    out = []
    for line in p.read_text(encoding='utf-8').splitlines():
        try:
            out.append(json.loads(line))
        except ValueError:
            pass
    return out


def notes(ep):
    """Fold the append-only log into the current notes (status and deletions applied)."""
    by = {}
    for e in events(ep):
        if e.get('ev') == 'note':
            by.setdefault(e['id'], {**e, 'status': 'open'})
        elif e.get('ev') == 'status' and e.get('id') in by:
            by[e['id']].update(status=e['status'], rev=e.get('rev', ''), fixnote=e.get('note', ''), fixed_at=e['ts'])
        elif e.get('ev') == 'delete':
            by.pop(e.get('id'), None)
    return sorted(by.values(), key=lambda n: n['t'])


def append(ep, ev):
    d = SITE / 'review'; d.mkdir(parents=True, exist_ok=True)
    with LOCK, open(d / f'{ep}.jsonl', 'a', encoding='utf-8') as f:
        f.write(json.dumps(ev, ensure_ascii=False) + '\n')


def fmt(t):
    t = float(t or 0); return f'{int(t // 60)}:{int(t % 60):02d}'


def esc(s):
    return html.escape(str(s or ''))


def page(title, body, extra_head=''):
    return f'''<!doctype html><html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title><link rel="stylesheet" href="/static/site.css">{extra_head}</head><body>{body}</body></html>'''


class H(BaseHTTPRequestHandler):
    server_version = 'sita'
    protocol_version = 'HTTP/1.1'

    def log_message(self, fmt_, *args):
        sys.stderr.write('%s %s\n' % (time.strftime('%Y-%m-%d %H:%M:%S'), fmt_ % args))

    # ---------- helpers ----------
    def send(self, code, body=b'', ctype='text/html; charset=utf-8', headers=None):
        if isinstance(body, str):
            body = body.encode()
        self.send_response(code)
        self.send_header('Content-Type', ctype); self.send_header('Content-Length', str(len(body)))
        self.send_header('X-Content-Type-Options', 'nosniff'); self.send_header('Referrer-Policy', 'same-origin')
        for k, v in (headers or {}).items():
            self.send_header(k, v)
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(body)

    def json(self, obj, code=200):
        self.send(code, json.dumps(obj, ensure_ascii=False), 'application/json; charset=utf-8', {'Cache-Control': 'no-store'})

    def redirect(self, to, headers=None):
        self.send(302, '', headers={'Location': to, **(headers or {})})

    def user(self):
        """The reviewer's name if the cookie is valid, else None."""
        c = self.headers.get('Cookie', '')
        m = re.search(r'(?:^|;\s*)sita_rev=([^;]+)', c)
        if not m:
            return None
        try:
            name_b64, sig = urllib.parse.unquote(m.group(1)).split('.', 1)
            name = base64.urlsafe_b64decode(name_b64.encode()).decode()
        except ValueError:
            return None
        good = hmac.new(secret()['key'].encode(), b'rev:' + name.encode(), hashlib.sha256).hexdigest()
        return name if hmac.compare_digest(sig, good) else None

    def body(self, limit):
        n = int(self.headers.get('Content-Length') or 0)
        if n > limit:
            raise ValueError('too large')
        return self.rfile.read(n)

    def file(self, path, ctype=None, download=None, cache='public, max-age=300'):
        """Serve a file with Range support (so the video seeks)."""
        size = path.stat().st_size
        ctype = ctype or mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
        start, end = 0, size - 1
        rng = self.headers.get('Range')
        m = re.match(r'bytes=(\d*)-(\d*)$', rng or '')
        if m and (m.group(1) or m.group(2)):
            if m.group(1):
                start = int(m.group(1)); end = min(int(m.group(2)), size - 1) if m.group(2) else size - 1
            else:
                start = max(0, size - int(m.group(2)))
            if start > end:
                return self.send(416, '', headers={'Content-Range': f'bytes */{size}'})
        self.send_response(206 if m and (m.group(1) or m.group(2)) else 200)
        self.send_header('Content-Type', ctype); self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Length', str(end - start + 1)); self.send_header('Cache-Control', cache)
        if m and (m.group(1) or m.group(2)):
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        if download:
            self.send_header('Content-Disposition', f'attachment; filename="{download}"')
        self.end_headers()
        if self.command == 'HEAD':
            return
        with open(path, 'rb') as f:
            f.seek(start); left = end - start + 1
            try:
                while left > 0:
                    chunk = f.read(min(1 << 20, left))
                    if not chunk:
                        break
                    self.wfile.write(chunk); left -= len(chunk)
            except (BrokenPipeError, ConnectionResetError):
                pass

    # ---------- routing ----------
    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        u = urllib.parse.urlsplit(self.path); p = u.path; q = urllib.parse.parse_qs(u.query)
        try:
            if p == '/health':
                return self.json({'ok': True})
            if p.startswith('/static/'):
                f = (STATIC / p[8:]).resolve()
                if STATIC.resolve() not in f.parents or not f.is_file():
                    return self.send(404, 'not found', 'text/plain')
                return self.file(f, cache='no-cache')
            if p == '/':
                return self.home(q.get('lang', ['el'])[0])
            m = re.match(r'^/(ep|dl|stream|poster|play)/([a-z0-9_-]+)(?:/r(\d+))?$', p)
            if m:
                return self.public(*m.groups())
            if p == '/review/login':
                return self.send(200, self.login_page())
            if p.startswith('/review') or p.startswith('/api/'):
                who = self.user()
                if not who:
                    return self.json({'error': 'login'}, 401) if p.startswith('/api/') else self.redirect('/review/login')
                return self.review_get(p, who)
            self.send(404, page('404', '<main><h1>Δεν βρέθηκε</h1><p><a href="/">Αρχική</a></p></main>'))
        except (BrokenPipeError, ConnectionResetError):
            pass

    def do_POST(self):
        p = urllib.parse.urlsplit(self.path).path
        if p == '/review/login':
            return self.login()
        if p == '/review/logout':
            return self.redirect('/', {'Set-Cookie': 'sita_rev=; Path=/; Max-Age=0'})
        who = self.user()
        if not who:
            return self.json({'error': 'login'}, 401)
        m = re.match(r'^/api/review/([a-z0-9_-]+)/(notes|status|delete)$', p)
        if not m:
            return self.json({'error': 'not found'}, 404)
        if 'application/json' not in (self.headers.get('Content-Type') or ''):
            return self.json({'error': 'json only'}, 415)
        try:
            data = json.loads(self.body(MAX_NOTE))
        except ValueError:
            return self.json({'error': 'bad body'}, 400)
        ep, what = m.groups()
        return {'notes': self.add_note, 'status': self.set_status, 'delete': self.del_note}[what](ep, data, who)

    # ---------- public ----------
    def home(self, lang):
        cfg, en = site_cfg(), lang == 'en'
        s = cfg.get('series', {})
        cards = []
        for e in cfg.get('episodes', []):
            rel = releases(e['slug'])
            if not rel:
                continue
            n, m = rel[0]
            t = e.get('title_en' if en else 'title_el', e['slug']); d = e.get('desc_en' if en else 'desc_el', '')
            cards.append(f'''<article class="card"><a class="poster" href="/ep/{e["slug"]}"><img src="/poster/{e["slug"]}" alt="" loading="lazy"><span class="dur">{fmt(m.get("dur"))}</span></a>
<div class="info"><div class="num">{esc(("Episode " if en else "Επεισόδιο ") + str(e.get("n", "")))}</div><h2>{esc(t)}</h2><p>{esc(d)}</p>
<div class="meta">r{n:02d} · {esc(m.get("date", ""))}</div>
<div class="actions"><a class="btn" href="/ep/{e["slug"]}">▶ {"Watch" if en else "Δες το"}</a><a class="btn ghost" href="/dl/{e["slug"]}">⬇ MP4</a></div></div></article>''')
        body = f'''<main class="home"><header class="hero"><h1>{esc(s.get("title_en" if en else "title_el", "Η Έξυπνη Σίτα"))}</h1>
<p>{esc(s.get("tag_en" if en else "tag_el", ""))}</p><nav><a href="/?lang={"el" if en else "en"}">{"ΕΛ" if en else "EN"}</a></nav></header>
<section class="grid">{"".join(cards) or "<p>" + ("No episodes yet." if en else "Δεν υπάρχουν ακόμα επεισόδια.") + "</p>"}</section></main>'''
        self.send(200, page(s.get('title_el', 'Η Έξυπνη Σίτα'), body))

    def public(self, kind, slug, rn):
        rel = releases(slug)
        if not rel:
            return self.send(404, page('404', '<main><h1>Δεν βρέθηκε</h1><p><a href="/">Αρχική</a></p></main>'))
        n, m = next(((n, m) for n, m in rel if rn and n == int(rn)), rel[0])
        d = SITE / 'releases' / slug
        if kind in ('dl', 'stream'):                              # same file: as a download, or inline for the <video>
            return self.file(d / f'r{n:02d}.mp4', 'video/mp4', download=f'sita_{slug}_r{n:02d}.mp4' if kind == 'dl' else None, cache='public, max-age=86400')
        if kind == 'poster':
            f = d / f'r{n:02d}.jpg'
            return self.file(f) if f.exists() else self.send(404, '', 'text/plain')
        if kind == 'play':                                        # the interactive HTML of the same release (EL/EN subtitles)
            return self.file(d / f'r{n:02d}.html', 'text/html; charset=utf-8', cache='no-cache')
        e = next((e for e in site_cfg().get('episodes', []) if e['slug'] == slug), {'slug': slug})
        video = f'/dl/{slug}/r{n:02d}'
        body = f'''<main class="watch"><p><a href="/">← Η Έξυπνη Σίτα</a></p><h1>{esc(("Επεισόδιο " + str(e.get("n", ""))) + " · " + e.get("title_el", slug))}</h1>
<video controls preload="metadata" playsinline poster="/poster/{slug}/r{n:02d}" src="/stream/{slug}/r{n:02d}"></video>
<div class="actions"><a class="btn" href="{video}">⬇ MP4 ({(m.get("size", 0) / 1e6):.0f} MB)</a><a class="btn ghost" href="/play/{slug}/r{n:02d}">Διαδραστική έκδοση (EL/EN)</a></div>
<p class="meta">r{n:02d} · {esc(m.get("date", ""))} · {fmt(m.get("dur"))}</p><p>{esc(e.get("desc_el", ""))}</p></main>'''
        self.send(200, page(e.get('title_el', slug), body))

    # ---------- review ----------
    def login_page(self, err=''):
        return page('Review · Σίτα', f'''<main class="login"><h1>Review</h1>{f'<p class="err">{esc(err)}</p>' if err else ''}
<form method="post" action="/review/login"><label>Όνομα<input name="name" required maxlength="30" autocomplete="nickname"></label>
<label>Κωδικός<input name="pw" type="password" required autocomplete="current-password"></label><button class="btn">Είσοδος</button></form></main>''')

    def login(self):
        try:
            f = urllib.parse.parse_qs(self.body(4000).decode())
        except ValueError:
            return self.send(400, 'bad', 'text/plain')
        name = (f.get('name', [''])[0].strip() or 'reviewer')[:30]
        if not hmac.compare_digest(f.get('pw', [''])[0].strip().encode(), secret()['passphrase'].encode()):
            time.sleep(1.5)
            return self.send(403, self.login_page('Λάθος κωδικός'))
        sig = hmac.new(secret()['key'].encode(), b'rev:' + name.encode(), hashlib.sha256).hexdigest()
        val = urllib.parse.quote(base64.urlsafe_b64encode(name.encode()).decode() + '.' + sig)
        sec = '; Secure' if self.headers.get('X-Forwarded-Proto') == 'https' or self.headers.get('Cf-Visitor', '').find('https') >= 0 else ''
        self.redirect('/review', {'Set-Cookie': f'sita_rev={val}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax{sec}'})

    def review_get(self, p, who):
        if p in ('/review', '/review/'):
            rows = []
            for f in sorted((RENDER / 'dist').glob('*.html')):
                ep = f.stem
                if not NAME.match(ep):
                    continue
                ns = notes(ep); op = sum(n['status'] == 'open' for n in ns)
                rows.append(f'<li><a href="/review/{ep}">{ep}</a> <span class="meta">{time.strftime("%d/%m %H:%M", time.localtime(f.stat().st_mtime))} · '
                            f'{op} ανοιχτά / {len(ns)} σχόλια</span> <a class="meta" href="/review/{ep}/log">log</a></li>')
            return self.send(200, page('Review', f'<main><h1>Review</h1><p class="meta">{esc(who)} · <form class="inline" method="post" action="/review/logout"><button class="link">έξοδος</button></form></p><ul class="list">{"".join(rows)}</ul></main>'))
        m = re.match(r'^/review/([a-z0-9_-]+)(?:/(log|notes\.md|notes\.csv))?$', p)
        if m:
            ep, sub = m.groups()
            if sub == 'log':
                return self.log_page(ep)
            if sub == 'notes.md':
                return self.send(200, notes_md(ep), 'text/markdown; charset=utf-8', {'Content-Disposition': f'attachment; filename="{ep}_notes.md"'})
            if sub == 'notes.csv':
                return self.send(200, notes_csv(ep), 'text/csv; charset=utf-8', {'Content-Disposition': f'attachment; filename="{ep}_notes.csv"'})
            f = RENDER / 'dist' / f'{ep}.html'
            if not f.exists():
                return self.send(404, page('404', '<main><h1>Δεν υπάρχει αυτό το draft</h1><p><a href="/review">Review</a></p></main>'))
            raw = f.read_bytes(); build = hashlib.sha1(raw).hexdigest()[:10]
            inject = (f'<link rel="stylesheet" href="/static/review.css"><script>window.REVIEW={json.dumps({"ep": ep, "build": build, "user": who, "built": time.strftime("%d/%m %H:%M", time.localtime(f.stat().st_mtime))}, ensure_ascii=False)}</script>'
                      '<script src="/static/review.js"></script>').encode()
            i = raw.rfind(b'</body>')
            out = raw[:i] + inject + raw[i:] if i >= 0 else raw + inject
            return self.send(200, out, headers={'Cache-Control': 'no-store'})
        m = re.match(r'^/api/review/([a-z0-9_-]+)/notes$', p)
        if m:
            return self.json({'notes': [{k: v for k, v in n.items() if k != 'ev'} for n in notes(m.group(1))]})
        m = re.match(r'^/review/shot/([a-z0-9_-]+)/([a-z0-9]+)\.jpg$', p)
        if m:
            f = SITE / 'review' / 'shots' / m.group(1) / f'{m.group(2)}.jpg'
            return self.file(f, 'image/jpeg', cache='private, max-age=86400') if f.exists() else self.send(404, '', 'text/plain')
        self.send(404, 'not found', 'text/plain')

    def log_page(self, ep):
        ns = notes(ep)
        rows = ''.join(f'''<tr class="{n["status"]}"><td><a href="/review/{ep}#t={n["t"]:.2f}">{fmt(n["t"])}</a></td><td>{esc(n.get("sceneTitle") or n.get("scene"))}<div class="meta">{esc(n.get("line", {}).get("who", ""))} {esc(n.get("line", {}).get("el", ""))}</div></td>
<td>{esc(CATS.get(n.get("cat"), n.get("cat")))}</td><td>{esc(n.get("text"))}</td><td>{f'<a href="/review/shot/{ep}/{n["id"]}.jpg"><img src="/review/shot/{ep}/{n["id"]}.jpg" alt=""></a>' if n.get("shot") else ""}</td>
<td>{esc(n["status"])}{(" " + esc(n.get("rev"))) if n.get("rev") else ""}<div class="meta">{esc(n.get("by"))} · {esc(n.get("ts", "")[:16].replace("T", " "))}</div></td></tr>''' for n in ns)
        self.send(200, page(f'{ep} · log', f'''<main class="wide"><p><a href="/review">← Review</a> · <a href="/review/{ep}">▶ {ep}</a></p><h1>{ep} · σχόλια</h1>
<p><a class="btn ghost" href="/review/{ep}/notes.md">⬇ notes.md</a> <a class="btn ghost" href="/review/{ep}/notes.csv">⬇ CSV</a></p>
<table class="log"><tr><th>Χρόνος</th><th>Σκηνή · ατάκα</th><th>Είδος</th><th>Σχόλιο</th><th>Καρέ</th><th>Κατάσταση</th></tr>{rows}</table></main>'''))

    def add_note(self, ep, d, who):
        if not NAME.match(ep):
            return self.json({'error': 'bad ep'}, 400)
        nid = str(d.get('id') or '')
        if not re.match(r'^[a-z0-9]{6,24}$', nid):
            nid = base36(int(time.time() * 1000)) + secrets.token_hex(2)
        if any(e.get('id') == nid and e.get('ev') == 'note' for e in events(ep)):
            return self.json({'ok': True, 'id': nid, 'dup': True})      # a retry from the offline queue
        shot = ''
        s = d.get('shot') or ''
        if s.startswith('data:image/jpeg;base64,'):
            try:
                img = base64.b64decode(s.split(',', 1)[1], validate=True)
                sd = SITE / 'review' / 'shots' / ep; sd.mkdir(parents=True, exist_ok=True)
                (sd / f'{nid}.jpg').write_bytes(img); shot = f'{nid}.jpg'
            except ValueError:
                pass
        line = d.get('line') if isinstance(d.get('line'), dict) else {}
        ev = {'ev': 'note', 'id': nid, 'ep': ep, 'build': str(d.get('build', ''))[:16], 'by': who, 'ts': time.strftime('%Y-%m-%dT%H:%M:%S'),
              't': round(float(d.get('t') or 0), 2), 'scene': str(d.get('scene', ''))[:40], 'sceneTitle': str(d.get('sceneTitle', ''))[:80],
              'lt': round(float(d.get('lt') or 0), 2), 'line': {'i': line.get('i'), 'who': str(line.get('who', ''))[:30], 'el': str(line.get('el', ''))[:300]},
              'x': d.get('x'), 'y': d.get('y'), 'cat': d.get('cat') if d.get('cat') in CATS else 'comment', 'text': str(d.get('text', ''))[:2000], 'shot': shot}
        append(ep, ev)
        self.json({'ok': True, 'id': nid})

    def set_status(self, ep, d, who):
        st = d.get('status')
        if st not in ('open', 'fixed', 'wontfix') or not d.get('id'):
            return self.json({'error': 'bad status'}, 400)
        append(ep, {'ev': 'status', 'id': str(d['id']), 'status': st, 'rev': str(d.get('rev', ''))[:20], 'note': str(d.get('note', ''))[:500], 'by': who, 'ts': time.strftime('%Y-%m-%dT%H:%M:%S')})
        self.json({'ok': True})

    def del_note(self, ep, d, who):
        append(ep, {'ev': 'delete', 'id': str(d.get('id', '')), 'by': who, 'ts': time.strftime('%Y-%m-%dT%H:%M:%S')})
        self.json({'ok': True})


def base36(n):
    s = ''
    while n:
        n, r = divmod(n, 36); s = '0123456789abcdefghijklmnopqrstuvwxyz'[r] + s
    return s or '0'


def notes_md(ep):
    out = [f'# {ep} · σχόλια', '']
    for n in notes(ep):
        mark = {'open': '[ ]', 'fixed': '[x]', 'wontfix': '[-]'}[n['status']]
        ln = n.get('line', {})
        text = f' · {n["text"]}' if n.get('text') else ''
        said = f' _(ατάκα, {ln.get("who", "")}: «{ln["el"]}»)_' if ln.get('el') else ''
        rev = f' · {n["rev"]}' if n.get('rev') else ''
        when = n.get('ts', '')[:16].replace('T', ' ')
        out.append(f'- {mark} **{fmt(n["t"])}** {n.get("sceneTitle") or n.get("scene")} · {CATS.get(n["cat"], n["cat"])}{text}{said} — {n.get("by")}, {when}{rev}')
    return '\n'.join(out) + '\n'


def notes_csv(ep):
    import csv, io
    b = io.StringIO(); w = csv.writer(b)
    w.writerow(['id', 'time', 'scene', 'line_who', 'line', 'category', 'text', 'x', 'y', 'by', 'at', 'status', 'rev', 'build'])
    for n in notes(ep):
        ln = n.get('line', {})
        w.writerow([n['id'], fmt(n['t']), n.get('sceneTitle') or n.get('scene'), ln.get('who', ''), ln.get('el', ''), n['cat'], n.get('text', ''),
                    n.get('x'), n.get('y'), n.get('by'), n.get('ts'), n['status'], n.get('rev', ''), n.get('build', '')])
    return '﻿' + b.getvalue()


if __name__ == '__main__':
    port = int(sys.argv[sys.argv.index('--port') + 1]) if '--port' in sys.argv else 8790
    secret()
    print(f'sita site on 127.0.0.1:{port}  render={RENDER}  site={SITE}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', port), H).serve_forever()
