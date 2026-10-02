#!/usr/bin/env python3
"""Site for «Η Έξυπνη Σίτα»: the public series page (latest rendered revision of every episode, watch or download the MP4)
and the private review tool (watch the draft HTML and drop notes on the frame while it plays).

Standard library only. Binds 127.0.0.1; the public hostname reaches it through the Cloudflare tunnel.

  python3 server.py [--port 8790]

Folders (env overrides):
  SITA_RENDER  ~/sita-render   dist/<ep>.html = drafts for review
  SITA_SITE    ~/sita-site     releases/<slug>/rNN.{mp4,html,json,jpg}, review/<ep>.jsonl, review/shots/<ep>/<id>.jpg,
                               drafts/<ep>/vNN.{html,json} (every draft that ever landed in dist/, kept for review),
                               secret.json (review passphrase + cookie key, mode 600, created on first run),
                               users.json (the collaborators' accounts), review/<ep>.community.jsonl (their notes)

Roles: the owner (accounts in secret.json, set with reviewctl.py passwd) and collaborators (free sign-up with Google or
email + password, listed in users.json, blockable by the owner). Collaborators see every draft and revision and write notes
into their own log, which the owner sees as a separate lane. Claude's work list (reviewctl.py pull) is the owner's log only:
a collaborator's note becomes work only when the owner adopts it.
"""
import base64, hashlib, hmac, html, json, mimetypes, os, re, secrets, shutil, sys, threading, time, urllib.parse, urllib.request
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


def pw_hash(pw, salt):
    return hashlib.pbkdf2_hmac('sha256', pw.encode(), bytes.fromhex(salt), 200_000).hex()


def check_login(name, pw):
    """Named accounts ("users": {name: {salt, hash}}, set with reviewctl.py passwd) if there are any, else the shared passphrase."""
    s = secret()
    if s.get('users'):
        u = s['users'].get(name)
        return bool(u) and hmac.compare_digest(pw_hash(pw, u['salt']), u['hash'])
    return bool(s.get('passphrase')) and hmac.compare_digest(pw.encode(), s['passphrase'].encode())


def load_users():
    p = SITE / 'users.json'
    try:
        return json.loads(p.read_text()) if p.exists() else {}
    except ValueError:
        return {}


def save_users(u):
    p = SITE / 'users.json'; tmp = p.with_suffix('.tmp')
    tmp.write_text(json.dumps(u, ensure_ascii=False, indent=1)); tmp.chmod(0o600); tmp.replace(p)


def find_user(email):
    email = email.strip().lower()
    return next((u for u in load_users().values() if u.get('email') == email), None)


def new_user(email, name, provider, pw=None):
    with LOCK:
        us = load_users()
        uid = secrets.token_hex(6)
        u = {'id': uid, 'email': email.strip().lower(), 'name': clean_name(name) or email.split('@')[0][:30], 'provider': provider,
             'created': time.strftime('%Y-%m-%dT%H:%M:%S'), 'status': 'active', 'toured': False}
        if pw:
            u['salt'] = secrets.token_hex(16); u['hash'] = pw_hash(pw, u['salt'])
        us[uid] = u; save_users(us)
        return u


def update_user(uid, **kw):
    with LOCK:
        us = load_users()
        if uid in us:
            us[uid].update(kw); save_users(us)


def clean_name(s):
    return re.sub(r'[\x00-\x1f<>]', '', str(s or '')).strip()[:30]


EMAIL = re.compile(r'^[^@\s]{1,64}@[^@\s]{1,190}\.[^@\s]{2,24}$')
_HITS = {}


def too_many(ip, what, n=8, per=600):
    """a few tries per IP and action in a 10-minute window (sign-up, login, Google)"""
    now = time.time(); k = (ip, what)
    with LOCK:
        h = [x for x in _HITS.get(k, []) if now - x < per]; h.append(now); _HITS[k] = h
    return len(h) > n


def owner_for(email):
    """The owner account an email signs in as (site.json "owner_emails": {email: owner name}), else None."""
    m = site_cfg().get('owner_emails', {})
    if isinstance(m, list):
        m = {e: 'ceo' for e in m}
    return {k.lower(): v for k, v in m.items()}.get((email or '').strip().lower())


def google_verify(token):
    """Verify a Google Identity Services ID token with Google's tokeninfo endpoint. Returns (email, name) or None."""
    cid = site_cfg().get('google_client_id')
    if not cid or not re.match(r'^[A-Za-z0-9._-]{20,2000}$', token or ''):
        return None
    try:
        with urllib.request.urlopen('https://oauth2.googleapis.com/tokeninfo?id_token=' + urllib.parse.quote(token), timeout=8) as r:
            d = json.loads(r.read())
    except (OSError, ValueError):
        return None
    if d.get('aud') != cid or d.get('iss') not in ('accounts.google.com', 'https://accounts.google.com') or int(d.get('exp', 0)) < time.time() \
            or str(d.get('email_verified')).lower() != 'true' or not d.get('email'):
        return None
    return d['email'].lower(), d.get('name') or d.get('given_name') or d['email'].split('@')[0]


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


_HASH = {}


def dist_hash(f):
    """sha1 (10 hex) of a draft, cached by path, mtime and size so a 6 MB page isn't hashed on every request."""
    st = f.stat(); k = (str(f), st.st_mtime, st.st_size)
    if k not in _HASH:
        _HASH[k] = hashlib.sha1(f.read_bytes()).hexdigest()[:10]
    return _HASH[k]


def drafts(ep):
    """Every kept revision of a draft, oldest first: [{n, build, ts, size}]."""
    d = SITE / 'drafts' / ep
    out = []
    for f in d.glob('v*.json') if d.is_dir() else []:
        try:
            out.append(json.loads(f.read_text()))
        except (OSError, ValueError):
            pass
    return sorted(out, key=lambda m: m['n'])


def snapshot(ep):
    """Keep the draft now in dist/ as the next revision vNN if its content is new. Returns all revisions."""
    f = RENDER / 'dist' / f'{ep}.html'
    if not f.exists() or any(m['build'] == dist_hash(f) for m in drafts(ep)):
        return drafts(ep)
    with LOCK:
        ds = drafts(ep); d = SITE / 'drafts' / ep; d.mkdir(parents=True, exist_ok=True)
        tmp = d / '.incoming.html'; shutil.copyfile(f, tmp)
        h = hashlib.sha1(tmp.read_bytes()).hexdigest()[:10]          # hash the copy: the upload may have changed under us
        if any(m['build'] == h for m in ds):
            tmp.unlink(); return ds
        n = (ds[-1]['n'] if ds else 0) + 1
        tmp.rename(d / f'v{n:02d}.html')
        meta = {'n': n, 'build': h, 'ts': time.strftime('%d/%m/%Y %H:%M', time.localtime(f.stat().st_mtime)), 'size': f.stat().st_size}
        (d / f'v{n:02d}.json').write_text(json.dumps(meta, ensure_ascii=False))
        return ds + [meta]


def review_eps():
    names = {f.stem for f in (RENDER / 'dist').glob('*.html')} | {d.name for d in (SITE / 'drafts').glob('*') if d.is_dir()}
    return sorted(n for n in names if NAME.match(n))


def logname(ep, com):
    return f'{ep}{"" if not com else ".general" if com == "general" else ".community"}.jsonl'


def events(ep, com=False):
    p = SITE / 'review' / logname(ep, com)
    if not p.exists():
        return []
    out = []
    for line in p.read_text(encoding='utf-8').splitlines():
        try:
            out.append(json.loads(line))
        except ValueError:
            pass
    return out


def notes(ep, com=False):
    """Fold the append-only log into the current notes (status and deletions applied). com=True: the collaborators' log."""
    by, ver = {}, {m['build']: m['n'] for m in drafts(ep)}
    for e in events(ep, com):
        if e.get('ev') == 'note':
            by.setdefault(e['id'], {**e, 'status': 'open', 'ver': ver.get(e.get('build')), **({'community': True} if com else {})})
        elif e.get('ev') == 'adopted' and e.get('id') in by:
            by[e['id']]['adopted'] = e.get('as')
        elif e.get('ev') == 'vote' and e.get('id') in by:
            by[e['id']].setdefault('votes', {})[e['voter']] = e['v']
        elif e.get('ev') == 'status' and e.get('id') in by:
            by[e['id']].update(status=e['status'], rev=e.get('rev', ''), fixnote=e.get('note', ''), fixed_at=e['ts'])
        elif e.get('ev') == 'delete':
            by.pop(e.get('id'), None)
    return sorted(by.values(), key=lambda n: n['t'])


def general(ep):
    """The episode's general discussion (not tied to a moment): posts with their votes, deletions applied."""
    by, ver = {}, {m['build']: m['n'] for m in drafts(ep)}
    for e in events(ep, 'general'):
        if e.get('ev') == 'post':
            by.setdefault(e['id'], {**e, 'ver': ver.get(e.get('build'))})
        elif e.get('ev') == 'vote' and e.get('id') in by:
            by[e['id']].setdefault('votes', {})[e['voter']] = e['v']
        elif e.get('ev') == 'delete':
            by.pop(e.get('id'), None)
    return list(by.values())


def scored(n, voter):
    """a note/post as the API shows it: the score and this viewer's own vote, not who voted"""
    vs = n.get('votes', {})
    return {**{k: v for k, v in n.items() if k not in ('ev', 'votes')}, 'score': sum(vs.values()), 'up': sum(v > 0 for v in vs.values()),
            'down': sum(v < 0 for v in vs.values()), 'mine': vs.get(voter, 0)}


def append(ep, ev, com=False):
    d = SITE / 'review'; d.mkdir(parents=True, exist_ok=True)
    with LOCK, open(d / logname(ep, com), 'a', encoding='utf-8') as f:
        f.write(json.dumps(ev, ensure_ascii=False) + '\n')


def fmt(t):
    t = float(t or 0); return f'{int(t // 60)}:{int(t % 60):02d}'


def esc(s):
    return html.escape(str(s or ''))


def asset(name):
    """/static/<name>?v=<mtime>: a new URL whenever the file changes, so Cloudflare and browsers never serve a stale copy"""
    try:
        return f'/static/{name}?v={int((STATIC / name).stat().st_mtime)}'
    except OSError:
        return f'/static/{name}'


def page(title, body, extra_head=''):
    return f'''<!doctype html><html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title><link rel="stylesheet" href="{asset('site.css')}">{extra_head}</head><body>{body}</body></html>'''


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

    def ip(self):
        return self.headers.get('Cf-Connecting-Ip') or self.client_address[0]

    def cookie_for(self, name):
        sig = hmac.new(secret()['key'].encode(), b'rev:' + name.encode(), hashlib.sha256).hexdigest()
        val = urllib.parse.quote(base64.urlsafe_b64encode(name.encode()).decode() + '.' + sig)
        sec = '; Secure' if self.headers.get('X-Forwarded-Proto') == 'https' or self.headers.get('Cf-Visitor', '').find('https') >= 0 else ''
        return {'Set-Cookie': f'sita_rev={val}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax{sec}'}

    def me(self):
        """Who is signed in: {name, role: owner|community, uid, toured}, or None (no cookie, bad signature, blocked)."""
        n = self.user()
        if not n:
            return None
        if n.startswith('u:'):
            u = load_users().get(n[2:])
            if u and owner_for(u.get('email')):                     # the owner's own Google/email account: the same account as ceo
                return {'name': owner_for(u['email']), 'role': 'owner', 'uid': None, 'toured': True}
            if not u or u.get('status') != 'active':
                return None
            return {'name': u['name'], 'role': 'community', 'uid': u['id'], 'toured': bool(u.get('toured'))}
        return {'name': n, 'role': 'owner', 'uid': None, 'toured': True}

    def user(self):
        """The signed name in the cookie if valid, else None (owner names, or u:<id> for a collaborator)."""
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
                return self.public(*m.groups(), q.get('lang', ['el'])[0])
            m = re.match(r'^/subs/([a-z0-9_-]+)/r(\d+)\.(el|en)\.vtt$', p)            # a release's subtitle track (WebVTT)
            if m:
                f = SITE / 'releases' / m.group(1) / f'r{int(m.group(2)):02d}.{m.group(3)}.vtt'
                return self.file(f, 'text/vtt; charset=utf-8', cache='public, max-age=300') if f.exists() else self.send(404, '', 'text/plain')
            if p in ('/privacy', '/terms'):
                return self.send(200, self.legal(p[1:]))
            if p == '/review/login':
                return self.send(200, self.login_page())
            if p == '/review/signup':
                return self.send(200, self.signup_page())
            if p.startswith('/review') or p.startswith('/api/'):
                me = self.me()
                if not me:
                    return self.json({'error': 'login'}, 401) if p.startswith('/api/') else self.redirect('/review/login')
                return self.review_get(p, me)
            self.send(404, page('404', '<main><h1>Δεν βρέθηκε</h1><p><a href="/">Αρχική</a></p></main>'))
        except (BrokenPipeError, ConnectionResetError):
            pass

    def do_POST(self):
        p = urllib.parse.urlsplit(self.path).path
        if p == '/review/login':
            return self.login()
        if p == '/review/signup':
            return self.signup()
        if p == '/review/auth/google':
            return self.google()
        if p == '/review/logout':
            return self.redirect('/', {'Set-Cookie': 'sita_rev=; Path=/; Max-Age=0'})
        me = self.me()
        if not me:
            return self.json({'error': 'login'}, 401)
        if 'application/json' not in (self.headers.get('Content-Type') or ''):
            return self.json({'error': 'json only'}, 415)
        try:
            data = json.loads(self.body(MAX_NOTE) or b'{}')
        except ValueError:
            return self.json({'error': 'bad body'}, 400)
        if p == '/api/me/toured':
            if me['uid']:
                update_user(me['uid'], toured=True)
            return self.json({'ok': True})
        m = re.match(r'^/api/users/([a-f0-9]{12})/(block|unblock)$', p)
        if m:
            if me['role'] != 'owner':
                return self.json({'error': 'owner only'}, 403)
            update_user(m.group(1), status='blocked' if m.group(2) == 'block' else 'active')
            return self.json({'ok': True})
        m = re.match(r'^/api/review/([a-z0-9_-]+)/(notes|status|delete|adopt|post|unpost|vote)$', p)
        if not m:
            return self.json({'error': 'not found'}, 404)
        ep, what = m.groups()
        if not NAME.match(ep):
            return self.json({'error': 'bad ep'}, 400)
        if what in ('status', 'adopt') and me['role'] != 'owner':
            return self.json({'error': 'owner only'}, 403)
        return {'notes': self.add_note, 'status': self.set_status, 'delete': self.del_note, 'adopt': self.adopt,
                'post': self.add_post, 'unpost': self.del_post, 'vote': self.vote}[what](ep, data, me)

    # ---------- public ----------
    def studio_link(self, en):
        """The way in from the public site: the studio for whoever is signed in, else the invitation to join."""
        me = self.me()
        if me:
            return f'<a class="btn join" href="/review">🎬 {"Studio" if me["role"] == "community" else "Review"}</a>'
        return f'<a class="btn join" href="/review/signup">🎬 {"Be part of the production!" if en else "Γίνε μέρος της παραγωγής!"}</a>'

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
            cards.append(f'''<article class="card"><a class="poster" href="/ep/{e["slug"]}{"?lang=en" if en else ""}"><img src="/poster/{e["slug"]}" alt="" loading="lazy"><span class="dur">{fmt(m.get("dur"))}</span></a>
<div class="info"><div class="num">{esc(("Episode " if en else "Επεισόδιο ") + str(e.get("n", "")))}</div><h2>{esc(t)}</h2><p>{esc(d)}</p>
<div class="meta">r{n:02d} · {esc(m.get("date", ""))}</div>
<div class="actions"><a class="btn" href="/ep/{e["slug"]}{"?lang=en" if en else ""}">▶ {"Watch" if en else "Δες το"}</a><a class="btn ghost" href="/dl/{e["slug"]}">⬇ MP4</a></div></div></article>''')
        body = f'''<main class="home"><header class="hero"><h1>{esc(s.get("title_en" if en else "title_el", "Η Έξυπνη Σίτα"))}</h1>
<p>{esc(s.get("tag_en" if en else "tag_el", ""))}</p><nav>{self.studio_link(en)} <a href="/?lang={"el" if en else "en"}">{"ΕΛ" if en else "EN"}</a></nav></header>
<section class="grid">{"".join(cards) or "<p>" + ("No episodes yet." if en else "Δεν υπάρχουν ακόμα επεισόδια.") + "</p>"}</section></main>'''
        self.send(200, page(s.get('title_el', 'Η Έξυπνη Σίτα'), body))

    def public(self, kind, slug, rn, lang='el'):
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
        en = lang == 'en'
        if kind == 'play':                                        # the interactive HTML of the same release (EL/EN subtitles), with the full-screen controls
            raw = (d / f'r{n:02d}.html').read_bytes(); i = raw.rfind(b'</body>')
            js = f'<script src="{asset("player-fs.js")}"></script>'.encode()
            if en:
                js += b"<script>addEventListener('load',()=>setTimeout(()=>{const b=document.getElementById('lang');if(b&&b.textContent.trim()==='EN')b.click()},300))</script>"
            return self.send(200, raw[:i] + js + raw[i:] if i >= 0 else raw + js, headers={'Cache-Control': 'no-cache'})
        e = next((e for e in site_cfg().get('episodes', []) if e['slug'] == slug), {'slug': slug})
        L = (lambda el_, en_: en_ if en else el_)
        title = f'{L("Επεισόδιο", "Episode")} {e.get("n", "")} · {e.get("title_en" if en else "title_el", slug)}'
        subs = [x for x in ('el', 'en') if (d / f'r{n:02d}.{x}.vtt').exists()]
        tracks = ''.join(f'<track kind="subtitles" srclang="{x}" label="{"Ελληνικά" if x == "el" else "English"}" src="/subs/{slug}/r{n:02d}.{x}.vtt">' for x in subs)
        picker = (f'''<div class="subs" role="group" aria-label="{L("Υπότιτλοι", "Subtitles")}"><span>{L("Υπότιτλοι", "Subtitles")}</span>'''
                  + ''.join(f'<button data-l="{x}">{"ΕΛ" if x == "el" else "EN"}</button>' for x in subs) + f'<button data-l="off">{L("Χωρίς", "Off")}</button></div>'
                  + """<script>(()=>{const v=document.querySelector('video'),bs=[...document.querySelectorAll('.subs button')];
const set=l=>{for(const t of v.textTracks)t.mode=t.language===l?'showing':'disabled';bs.forEach(b=>b.classList.toggle('on',b.dataset.l===l));try{localStorage.setItem('sita-subs',l)}catch(e){}};
let l=new URLSearchParams(location.search).get('lang');if(!l){try{l=localStorage.getItem('sita-subs')}catch(e){}}set(l||'el');bs.forEach(b=>b.onclick=()=>set(b.dataset.l));})()</script>""") if subs else \
            f'<p class="meta">{L("Οι ελληνικοί υπότιτλοι είναι μέσα στην εικόνα. Για αγγλικούς: η διαδραστική έκδοση.", "Greek subtitles are burned into this version. For English, use the interactive version.")}</p>'
        body = f'''<main class="watch"><p class="topnav"><span><a href="/{"?lang=en" if en else ""}">← {L("Η Έξυπνη Σίτα", "The Smart Screen Door")}</a> · <a href="/ep/{slug}{"" if en else "?lang=en"}">{"ΕΛ" if en else "EN"}</a></span>{self.studio_link(en)}</p><h1>{esc(title)}</h1>
<video controls preload="metadata" playsinline poster="/poster/{slug}/r{n:02d}" src="/stream/{slug}/r{n:02d}">{tracks}</video>
{picker}
<div class="actions"><a class="btn" href="/dl/{slug}/r{n:02d}">⬇ MP4 ({(m.get("size", 0) / 1e6):.0f} MB{L(", υπότιτλοι ΕΛ/EN μέσα", ", EL/EN subtitles inside") if subs else ""})</a><a class="btn ghost" href="/play/{slug}/r{n:02d}{"?lang=en" if en else ""}">{L("Διαδραστική έκδοση", "Interactive version")}</a></div>
<p class="meta">r{n:02d} · {esc(m.get("date", ""))} · {fmt(m.get("dur"))}</p><p>{esc(e.get("desc_en" if en else "desc_el", ""))}</p></main>'''
        self.send(200, page(title, body))

    # ---------- review ----------
    def legal(self, which):
        mail = site_cfg().get('contact_email', '')
        if which == 'privacy':
            return page('Απόρρητο · Η Έξυπνη Σίτα', f'''<main><p><a href="/">← Η Έξυπνη Σίτα</a></p><h1>Πολιτική απορρήτου</h1>
<p>Η παρακολούθηση των επεισοδίων δεν χρειάζεται λογαριασμό και δεν κρατάμε στοιχεία για όσους απλώς βλέπουν.</p>
<p>Αν φτιάξεις λογαριασμό για να συμμετέχεις στην παραγωγή (με Google ή με email), κρατάμε:</p>
<ul><li>το email σου και το όνομα που θα φαίνεται στα σχόλιά σου (από τη Google μόνο αυτά τα δύο: δεν βλέπουμε ούτε αγγίζουμε τίποτα άλλο στον λογαριασμό σου),</li>
<li>τον κωδικό σου, μόνο ως κρυπτογραφικό hash (αν δεν μπεις με Google),</li><li>τα σχόλιά σου και το καρέ πάνω στο οποίο τα άφησες.</li></ul>
<p>Το όνομα και τα σχόλιά σου τα βλέπουν ο δημιουργός της σειράς και οι άλλοι συνεργάτες. Το email σου το βλέπει μόνο ο δημιουργός. Δεν πουλάμε, δεν μοιραζόμαστε και δεν χρησιμοποιούμε τα στοιχεία σου για διαφήμιση. Κρατάμε ένα μόνο cookie σύνδεσης.</p>
<p>Για να σβηστεί ο λογαριασμός και τα στοιχεία σου, γράψε στο <a href="mailto:{esc(mail)}">{esc(mail)}</a>.</p>
<h2>Privacy (English)</h2><p>Watching needs no account. If you sign up to take part (Google or email), we keep your email, display name, a password hash (email sign-up only) and your notes. Your name and notes are visible to the creator and other collaborators; your email only to the creator. Nothing is sold or shared. To delete your account, write to <a href="mailto:{esc(mail)}">{esc(mail)}</a>.</p></main>''')
        return page('Όροι · Η Έξυπνη Σίτα', f'''<main><p><a href="/">← Η Έξυπνη Σίτα</a></p><h1>Όροι χρήσης</h1>
<p>Τα επεισόδια της «Έξυπνης Σίτας» είναι δημιουργικό έργο του δημιουργού τους. Μπορείς να τα βλέπεις και να τα κατεβάζεις για προσωπική χρήση.</p>
<p>Το studio δείχνει εκδόσεις που δεν έχουν βγει ακόμα: μην τις αναδημοσιεύεις. Τα σχόλιά σου είναι προτάσεις· ο δημιουργός αποφασίζει τι θα αλλάξει και μπορεί να τα χρησιμοποιήσει ελεύθερα στην παραγωγή. Σεβόμαστε ο ένας τον άλλον: προσβλητικά σχόλια σβήνονται και ο λογαριασμός μπορεί να απενεργοποιηθεί.</p>
<p>Επικοινωνία: <a href="mailto:{esc(mail)}">{esc(mail)}</a></p>
<h2>Terms (English)</h2><p>The episodes are the creator's work; watch and download them for personal use. The studio shows unreleased drafts: please don't repost them. Notes are suggestions the creator may use freely. Abusive notes are removed and accounts may be blocked.</p></main>''')

    def google_block(self):
        cid = site_cfg().get('google_client_id')
        if not cid:
            return ''
        host = self.headers.get('Host', 'sita.justachillgame.com')
        return (f'''<script src="https://accounts.google.com/gsi/client" async></script>
<div id="g_id_onload" data-client_id="{esc(cid)}" data-login_uri="https://{esc(host)}/review/auth/google" data-ux_mode="redirect" data-auto_prompt="false"></div>
<div class="g_id_signin" data-type="standard" data-shape="pill" data-text="continue_with" data-size="large" data-locale="el"></div>
<p class="or">ή</p>''')

    def login_page(self, err=''):
        return page('Είσοδος · Σίτα', f'''<main class="login"><h1>Γίνε μέρος της παραγωγής</h1>
<p class="meta">Δες κάθε revision των επεισοδίων πριν βγουν και άφησε σχόλια πάνω στο καρέ.</p>{f'<p class="err">{esc(err)}</p>' if err else ''}
{self.google_block()}<form method="post" action="/review/login"><label>Email (ή όνομα χρήστη)<input name="name" required maxlength="254" autocomplete="username" autocapitalize="none"></label>
<label>Κωδικός<input name="pw" type="password" required autocomplete="current-password"></label><button class="btn">Είσοδος</button></form>
<p>Πρώτη φορά; <a href="/review/signup">Φτιάξε λογαριασμό</a></p></main>''')

    def signup_page(self, err='', f=None):
        f = f or {}
        v = lambda k: esc(f.get(k, [''])[0])
        return page('Λογαριασμός · Σίτα', f'''<main class="login"><h1>Γίνε μέρος της παραγωγής!</h1>
<p class="meta">Με λογαριασμό βλέπεις όλα τα revision στο studio και τα σχόλιά σου φτάνουν στον δημιουργό, με το όνομά σου.</p>{f'<p class="err">{esc(err)}</p>' if err else ''}
{self.google_block()}<form method="post" action="/review/signup"><label>Όνομα (φαίνεται στα σχόλιά σου)<input name="display" required maxlength="30" value="{v('display')}" autocomplete="nickname"></label>
<label>Email<input name="email" type="email" required maxlength="254" value="{v('email')}" autocomplete="email"></label>
<label>Κωδικός (τουλάχιστον 8 χαρακτήρες)<input name="pw" type="password" required minlength="8" autocomplete="new-password"></label>
<label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
<button class="btn">Δημιουργία λογαριασμού</button></form><p class="meta">Με την εγγραφή δέχεσαι τους <a href="/terms">όρους</a> και την <a href="/privacy">πολιτική απορρήτου</a>.</p><p>Έχεις ήδη; <a href="/review/login">Είσοδος</a></p></main>''')

    def form(self):
        try:
            return urllib.parse.parse_qs(self.body(8000).decode())
        except ValueError:
            return None

    def login(self):
        f = self.form()
        if f is None:
            return self.send(400, 'bad', 'text/plain')
        name = (f.get('name', [''])[0].strip() or 'reviewer')[:254]; pw = f.get('pw', [''])[0]
        if too_many(self.ip(), 'login', 12):
            return self.send(429, self.login_page('Πολλές προσπάθειες. Δοκίμασε ξανά σε λίγα λεπτά.'))
        if '@' in name:                                            # a collaborator (email + password)
            u = find_user(name)
            ok = u and u.get('hash') and hmac.compare_digest(pw_hash(pw, u['salt']), u['hash'])
            if ok and u.get('status') != 'active':
                return self.send(403, self.login_page('Ο λογαριασμός είναι απενεργοποιημένος.'))
            if ok:
                return self.redirect('/review', self.cookie_for(owner_for(name) or 'u:' + u['id']))
        elif check_login(name[:30], pw):                           # the owner
            return self.redirect('/review', self.cookie_for(name[:30]))
        time.sleep(1.5)
        return self.send(403, self.login_page('Λάθος στοιχεία'))

    def signup(self):
        f = self.form()
        if f is None:
            return self.send(400, 'bad', 'text/plain')
        g = lambda k: f.get(k, [''])[0].strip()
        if g('website'):                                           # the honeypot: bots fill every field
            return self.redirect('/')
        if too_many(self.ip(), 'signup', 5, 3600):
            return self.send(429, self.signup_page('Πολλές εγγραφές από εδώ. Δοκίμασε αργότερα.', f))
        email, name, pw = g('email').lower(), clean_name(g('display')), f.get('pw', [''])[0]
        err = 'Γράψε ένα όνομα.' if not name else 'Το email δεν φαίνεται σωστό.' if not EMAIL.match(email) else \
            'Αυτό το email ανήκει στον δημιουργό: μπες με Google ή ως ceo.' if owner_for(email) else \
            'Ο κωδικός θέλει τουλάχιστον 8 χαρακτήρες.' if len(pw) < 8 else 'Υπάρχει ήδη λογαριασμός με αυτό το email.' if find_user(email) else ''
        if err:
            return self.send(400, self.signup_page(err, f))
        u = new_user(email, name, 'password', pw)
        self.redirect('/review', self.cookie_for('u:' + u['id']))

    def google(self):
        f = self.form()
        if f is None:
            return self.send(400, 'bad', 'text/plain')
        c = self.headers.get('Cookie', ''); m = re.search(r'(?:^|;\s*)g_csrf_token=([^;]+)', c)
        if not m or m.group(1) != f.get('g_csrf_token', [''])[0]:  # Google's double-submit CSRF check
            return self.send(400, self.login_page('Η σύνδεση με Google απέτυχε (csrf). Δοκίμασε ξανά.'))
        if too_many(self.ip(), 'google', 20):
            return self.send(429, self.login_page('Πολλές προσπάθειες. Δοκίμασε ξανά σε λίγα λεπτά.'))
        got = google_verify(f.get('credential', [''])[0])
        if not got:
            return self.send(403, self.login_page('Η σύνδεση με Google απέτυχε.'))
        email, name = got
        if owner_for(email):                                       # the owner signing in with Google: the ceo account itself
            return self.redirect('/review', self.cookie_for(owner_for(email)))
        u = find_user(email) or new_user(email, name, 'google')
        if u.get('status') != 'active':
            return self.send(403, self.login_page('Ο λογαριασμός είναι απενεργοποιημένος.'))
        self.redirect('/review', self.cookie_for('u:' + u['id']))

    def review_get(self, p, me):
        owner, who = me['role'] == 'owner', me['name']
        if p == '/review/users':
            return self.users_page() if owner else self.send(403, page('403', '<main><h1>Μόνο για τον δημιουργό</h1></main>'))
        if p in ('/review', '/review/') and not owner:
            rows = []
            for ep in review_eps():
                ds = snapshot(ep)
                if not ds:
                    continue
                nc = len(notes(ep, True))
                vers = ' '.join(f'<a href="/review/{ep}/v{m["n"]}" title="{esc(m["ts"])}">v{m["n"]}</a>' for m in reversed(ds))
                rows.append(f'<li><a href="/review/{ep}">{ep}</a> <span class="meta">v{ds[-1]["n"]} · {esc(ds[-1]["ts"])} · {nc} σχόλια κοινότητας</span><div class="meta">Revisions: {vers}</div></li>')
            return self.send(200, page('Studio', f'''<main><p><a href="/">← Η Έξυπνη Σίτα</a></p><h1>Studio</h1><p class="meta">{esc(who)} · συνεργάτης ·
<form class="inline" method="post" action="/review/logout"><button class="link">έξοδος</button></form></p>
<p>Εδώ είναι τα επεισόδια όπως είναι στο εργαστήριο, με όλα τα revision. Άνοιξε ένα και πάτα πάνω στο καρέ για να αφήσεις σχόλιο.</p><ul class="list">{"".join(rows)}</ul></main>'''))
        if p in ('/review', '/review/'):
            rows, alias = [], site_cfg().get('aliases', {})
            for ep in review_eps():
                ds = snapshot(ep)
                if not ds:
                    continue
                ns = notes(ep); op = sum(n['status'] == 'open' for n in ns); nc = len(notes(ep, True))
                vers = ' '.join(f'<a href="/review/{ep}/v{m["n"]}" title="{esc(m["ts"])}">v{m["n"]}</a>' for m in reversed(ds))
                rels = ' '.join(f'<a href="/ep/{alias.get(ep, ep)}/r{n:02d}" title="{esc(m.get("date", ""))}">r{n:02d}</a>' for n, m in releases(alias.get(ep, ep)) if m.get('ep') == ep)
                rows.append(f'<li><a href="/review/{ep}">{ep}</a> <span class="meta">v{ds[-1]["n"]} · {esc(ds[-1]["ts"])} · {op} ανοιχτά / {len(ns)} σχόλια{f" · {nc} κοινότητας" if nc else ""}</span> '
                            f'<a class="meta" href="/review/{ep}/log">log</a><div class="meta">Drafts: {vers}{" · MP4: " + rels if rels else ""}</div></li>')
            return self.send(200, page('Review', f'<main><p><a href="/">← Η Έξυπνη Σίτα</a></p><h1>Review</h1><p class="meta">{esc(who)} · <a href="/review/users">χρήστες ({len(load_users())})</a> · <form class="inline" method="post" action="/review/logout"><button class="link">έξοδος</button></form></p><ul class="list">{"".join(rows)}</ul></main>'))
        m = re.match(r'^/review/([a-z0-9_-]+)(?:/v(\d+)|/(log|notes\.md|notes\.csv))?$', p)
        if m:
            ep, vn, sub = m.groups()
            if sub and not owner:
                return self.send(403, page('403', '<main><h1>Μόνο για τον δημιουργό</h1></main>'))
            if sub == 'log':
                return self.log_page(ep)
            if sub == 'notes.md':
                return self.send(200, notes_md(ep), 'text/markdown; charset=utf-8', {'Content-Disposition': f'attachment; filename="{ep}_notes.md"'})
            if sub == 'notes.csv':
                return self.send(200, notes_csv(ep), 'text/csv; charset=utf-8', {'Content-Disposition': f'attachment; filename="{ep}_notes.csv"'})
            ds = snapshot(ep)
            cur = next((m for m in ds if vn and m['n'] == int(vn)), ds[-1] if ds and not vn else None)
            if not cur:
                return self.send(404, page('404', '<main><h1>Δεν υπάρχει αυτό το draft</h1><p><a href="/review">Review</a></p></main>'))
            raw = (SITE / 'drafts' / ep / f'v{cur["n"]:02d}.html').read_bytes()
            info = {'ep': ep, 'build': cur['build'], 'ver': cur['n'], 'latest': ds[-1]['n'], 'built': cur['ts'], 'user': who, 'role': me['role'], 'uid': me['uid'], 'toured': me['toured'],
                    'versions': [{'n': m['n'], 'ts': m['ts']} for m in ds]}
            inject = (f'<link rel="stylesheet" href="{asset("review.css")}"><script>window.REVIEW={json.dumps(info, ensure_ascii=False)}</script>'
                      f'<script src="{asset("review.js")}"></script><script src="{asset("player-fs.js")}"></script>').encode()
            i = raw.rfind(b'</body>')
            out = raw[:i] + inject + raw[i:] if i >= 0 else raw + inject
            return self.send(200, out, headers={'Cache-Control': 'no-store'})
        m = re.match(r'^/api/review/([a-z0-9_-]+)/notes$', p)
        if m:
            ns = (notes(m.group(1)) if owner else []) + notes(m.group(1), True)
            return self.json({'notes': sorted((scored(n, voter(me)) for n in ns), key=lambda n: n['t'])})
        m = re.match(r'^/api/review/([a-z0-9_-]+)/general$', p)
        if m:
            return self.json({'posts': sorted((scored(n, voter(me)) for n in general(m.group(1))), key=lambda n: n['ts'], reverse=True)})
        m = re.match(r'^/review/shot/([a-z0-9_-]+)/([a-z0-9]+)\.jpg$', p)
        if m and not owner and m.group(2) not in {n['id'] for n in notes(m.group(1), True)}:
            return self.send(404, '', 'text/plain')
        if m:
            f = SITE / 'review' / 'shots' / m.group(1) / f'{m.group(2)}.jpg'
            return self.file(f, 'image/jpeg', cache='private, max-age=86400') if f.exists() else self.send(404, '', 'text/plain')
        self.send(404, 'not found', 'text/plain')

    def log_page(self, ep):
        ns = notes(ep)
        rows = ''.join(f'''<tr class="{n["status"]}"><td><a href="/review/{ep}{f'/v{n["ver"]}' if n.get("ver") else ''}#t={n["t"]:.2f}">{fmt(n["t"])}</a><div class="meta">{f'v{n["ver"]}' if n.get("ver") else ''}</div></td><td>{esc(n.get("sceneTitle") or n.get("scene"))}<div class="meta">{esc(n.get("line", {}).get("who", ""))} {esc(n.get("line", {}).get("el", ""))}</div></td>
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
        if any(e.get('id') == nid and e.get('ev') == 'note' for e in events(ep) + events(ep, True)):
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
        ev['by'] = who['name']
        com = who['role'] != 'owner'
        if com:
            ev['uid'] = who['uid']
        append(ep, ev, com)
        self.json({'ok': True, 'id': nid})

    def set_status(self, ep, d, who):
        who = who['name']; st = d.get('status')
        if st not in ('open', 'fixed', 'wontfix') or not d.get('id'):
            return self.json({'error': 'bad status'}, 400)
        append(ep, {'ev': 'status', 'id': str(d['id']), 'status': st, 'rev': str(d.get('rev', ''))[:20], 'note': str(d.get('note', ''))[:500], 'by': who, 'ts': time.strftime('%Y-%m-%dT%H:%M:%S')})
        self.json({'ok': True})

    def del_note(self, ep, d, who):
        nid, ts = str(d.get('id', '')), time.strftime('%Y-%m-%dT%H:%M:%S')
        mine = next((n for n in notes(ep, True) if n['id'] == nid), None)
        if who['role'] == 'owner':
            append(ep, {'ev': 'delete', 'id': nid, 'by': who['name'], 'ts': ts}, com=bool(mine))
        elif mine and mine.get('uid') == who['uid']:              # a collaborator deletes only their own notes
            append(ep, {'ev': 'delete', 'id': nid, 'by': who['name'], 'ts': ts}, com=True)
        else:
            return self.json({'error': 'not yours'}, 403)
        self.json({'ok': True})


    def add_post(self, ep, d, who):
        text = str(d.get('text', '')).strip()[:4000]
        if not text:
            return self.json({'error': 'empty'}, 400)
        if who['role'] != 'owner' and too_many(self.ip(), 'post', 30, 600):
            return self.json({'error': 'slow down'}, 429)
        nid = base36(int(time.time() * 1000)) + secrets.token_hex(2)
        append(ep, {'ev': 'post', 'id': nid, 'by': who['name'], 'uid': who['uid'], 'owner': who['role'] == 'owner', 'ts': time.strftime('%Y-%m-%dT%H:%M:%S'),
                    'kind': d.get('kind') if d.get('kind') in ('idea', 'comment', 'question') else 'comment', 'text': text, 'build': str(d.get('build', ''))[:16]}, 'general')
        self.json({'ok': True, 'id': nid})

    def del_post(self, ep, d, who):
        n = next((n for n in general(ep) if n['id'] == str(d.get('id', ''))), None)
        if not n:
            return self.json({'error': 'no such post'}, 404)
        if who['role'] != 'owner' and n.get('uid') != who['uid']:
            return self.json({'error': 'not yours'}, 403)
        append(ep, {'ev': 'delete', 'id': n['id'], 'by': who['name'], 'ts': time.strftime('%Y-%m-%dT%H:%M:%S')}, 'general')
        self.json({'ok': True})

    def vote(self, ep, d, who):
        """▲/▼ on a collaborator's note or a general post: one vote per person (the last one counts; 0 takes it back)"""
        v, nid, on = d.get('v'), str(d.get('id', '')), d.get('on')
        if v not in (1, -1, 0) or on not in ('note', 'post'):
            return self.json({'error': 'bad vote'}, 400)
        log = 'general' if on == 'post' else True
        if nid not in {n['id'] for n in (general(ep) if on == 'post' else notes(ep, True))}:
            return self.json({'error': 'no such item'}, 404)
        append(ep, {'ev': 'vote', 'id': nid, 'voter': voter(who), 'v': v, 'ts': time.strftime('%Y-%m-%dT%H:%M:%S')}, log)
        self.json({'ok': True})

    def adopt(self, ep, d, who):
        """The owner takes a collaborator's note into their own log (Claude's work list), credited to its author."""
        n = next((n for n in notes(ep, True) if n['id'] == str(d.get('id', ''))), None)
        if not n:
            return self.json({'error': 'no such note'}, 404)
        if n.get('adopted'):
            return self.json({'ok': True, 'id': n['adopted']})
        nid = base36(int(time.time() * 1000)) + secrets.token_hex(2)
        ev = {k: v for k, v in n.items() if k not in ('status', 'ver', 'community', 'uid', 'adopted', 'votes')}
        ev.update(id=nid, by=who['name'], ts=time.strftime('%Y-%m-%dT%H:%M:%S'), **{'from': n.get('by'), 'from_id': n['id']})
        if n.get('shot'):
            sd = SITE / 'review' / 'shots' / ep
            if (sd / n['shot']).exists():
                shutil.copyfile(sd / n['shot'], sd / f'{nid}.jpg'); ev['shot'] = f'{nid}.jpg'
        append(ep, ev)
        append(ep, {'ev': 'adopted', 'id': n['id'], 'as': nid, 'by': who['name'], 'ts': ev['ts']}, com=True)
        self.json({'ok': True, 'id': nid})

    def users_page(self):
        us = sorted(load_users().values(), key=lambda u: u.get('created', ''), reverse=True)
        cnt = {}
        for ep in review_eps():
            for n in notes(ep, True):
                cnt[n.get('uid')] = cnt.get(n.get('uid'), 0) + 1
        admins = {e for e in us_emails() if owner_for(e)}
        rows = ''.join(f'''<tr class="{esc(u.get('status'))}"><td>{esc(u.get('name'))}{' <b>· admin</b>' if u.get('email') in admins else ''}</td><td>{esc(u.get('email'))}</td><td>{esc(u.get('provider'))}</td><td>{esc(u.get('created', '')[:16].replace('T', ' '))}</td>
<td>{cnt.get(u['id'], 0)}</td><td>{esc(u.get('status'))} <button class="link" data-u="{esc(u['id'])}" data-a="{'unblock' if u.get('status') == 'blocked' else 'block'}">{'ενεργοποίηση' if u.get('status') == 'blocked' else 'μπλοκ'}</button></td></tr>''' for u in us)
        js = """<script>document.querySelectorAll('button[data-u]').forEach(b=>b.onclick=async()=>{if(!confirm(b.textContent+';'))return;
await fetch('/api/users/'+b.dataset.u+'/'+b.dataset.a,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});location.reload()})</script>"""
        self.send(200, page('Χρήστες', f'''<main class="wide"><p><a href="/review">← Review</a></p><h1>Συνεργάτες ({len(us)})</h1>
<table class="log"><tr><th>Όνομα</th><th>Email</th><th>Είσοδος</th><th>Από</th><th>Σχόλια</th><th>Κατάσταση</th></tr>{rows}</table></main>{js}'''))


def us_emails():
    return [u.get('email', '') for u in load_users().values()]


def voter(me):
    return 'u:' + me['uid'] if me.get('uid') else 'o:' + me['name']


def base36(n):
    s = ''
    while n:
        n, r = divmod(n, 36); s = '0123456789abcdefghijklmnopqrstuvwxyz'[r] + s
    return s or '0'


def notes_md(ep):
    out = [f'# {ep} · σχόλια', '']
    for n in notes(ep):
        mark = {'open': '[ ]', 'fixed': '[x]', 'wontfix': '[-]'}[n['status']]
        v = f' v{n["ver"]}' if n.get('ver') else ''
        ln = n.get('line', {})
        text = f' · {n["text"]}' if n.get('text') else ''
        said = f' _(ατάκα, {ln.get("who", "")}: «{ln["el"]}»)_' if ln.get('el') else ''
        rev = f' · {n["rev"]}' if n.get('rev') else ''
        when = n.get('ts', '')[:16].replace('T', ' ')
        out.append(f'- {mark} **{fmt(n["t"])}**{v} {n.get("sceneTitle") or n.get("scene")} · {CATS.get(n["cat"], n["cat"])}{text}{said} — {n.get("by")}, {when}{rev}')
    return '\n'.join(out) + '\n'


def notes_csv(ep):
    import csv, io
    b = io.StringIO(); w = csv.writer(b)
    w.writerow(['id', 'version', 'time', 'scene', 'line_who', 'line', 'category', 'text', 'x', 'y', 'by', 'at', 'status', 'rev', 'build'])
    for n in notes(ep):
        ln = n.get('line', {})
        w.writerow([n['id'], f'v{n["ver"]}' if n.get('ver') else '', fmt(n['t']), n.get('sceneTitle') or n.get('scene'), ln.get('who', ''), ln.get('el', ''), n['cat'], n.get('text', ''),
                    n.get('x'), n.get('y'), n.get('by'), n.get('ts'), n['status'], n.get('rev', ''), n.get('build', '')])
    return '﻿' + b.getvalue()


if __name__ == '__main__':
    port = int(sys.argv[sys.argv.index('--port') + 1]) if '--port' in sys.argv else 8790
    secret()
    print(f'sita site on 127.0.0.1:{port}  render={RENDER}  site={SITE}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', port), H).serve_forever()
