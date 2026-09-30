#!/usr/bin/env python3
"""Node-side helper for the review log (called through tools/review.py, never needs the passphrase).

  python3 reviewctl.py pull EP [--all]            compact table of the open notes (--all: every note)
  python3 reviewctl.py done EP ID [ID…] [--rev rNN] [--note TEXT] [--wontfix] [--reopen]
  python3 reviewctl.py list                        drafts and their open-note counts
  python3 reviewctl.py snapshot                    keep every new draft in dist/ as its next revision (run.sh does this every 5 minutes)
  python3 reviewctl.py passwd USER                 set a review account (password read from stdin, stored as a salted hash;
                                                   once an account exists the shared passphrase is dropped)
"""
import json, secrets, sys, time
from server import CATS, SITE, append, drafts, fmt, notes, pw_hash, review_eps, secret, snapshot


def opt(a, name, default=''):
    if name in a:
        i = a.index(name); v = a[i + 1]; del a[i:i + 2]; return v
    return default


def main(a):
    cmd = a.pop(0) if a else 'list'
    if cmd == 'list':
        for ep in review_eps():
            ds, ns = drafts(ep), notes(ep)
            print(f'{ep}: v{ds[-1]["n"] if ds else "-"} · {sum(n["status"] == "open" for n in ns)} open / {len(ns)}')
        return
    if cmd == 'snapshot':
        for ep in review_eps():
            snapshot(ep)
        return
    if cmd == 'pull':
        allof = '--all' in a
        ep = [x for x in a if not x.startswith('--')][0]
        ns = [n for n in notes(ep) if allof or n['status'] == 'open']
        print(f'# {ep}: {len(ns)} notes' + ('' if allof else ' open'))
        for n in ns:
            ln = n.get('line') or {}
            xy = f' @{n["x"]},{n["y"]}' if n.get('x') is not None else ''
            said = f' | {ln.get("who")}: «{ln.get("el")[:70]}»' if ln.get('el') else ''
            st = '' if n['status'] == 'open' else f' [{n["status"]} {n.get("rev", "")}]'
            print(f'{n["id"]} v{n.get("ver") or "?"} {fmt(n["t"])} {n["scene"]}+{n["lt"]:.1f}s {CATS.get(n["cat"], n["cat"])}{xy}{" shot" if n.get("shot") else ""}'
                  f' | {n.get("text") or "-"}{said} | {n["by"]} {n["ts"][5:16]}{st}')
        return
    if cmd == 'done':
        rev, note = opt(a, '--rev'), opt(a, '--note')
        st = 'wontfix' if '--wontfix' in a else 'open' if '--reopen' in a else 'fixed'
        ep, *ids = [x for x in a if not x.startswith('--')]
        have = {n['id'] for n in notes(ep)}
        for i in ids:
            if i not in have:
                print(f'skip {i}: no such note'); continue
            append(ep, {'ev': 'status', 'id': i, 'status': st, 'rev': rev, 'note': note, 'by': 'claude', 'ts': time.strftime('%Y-%m-%dT%H:%M:%S')})
            print(f'{i} -> {st} {rev}')
        return
    if cmd == 'passwd':
        user, pw = a[0], sys.stdin.readline().rstrip('\n')
        if not pw:
            sys.exit('empty password')
        s = secret(); salt = secrets.token_hex(16)
        s.setdefault('users', {})[user] = {'salt': salt, 'hash': pw_hash(pw, salt)}
        s.pop('passphrase', None)
        p = SITE / 'secret.json'; p.write_text(json.dumps(s, ensure_ascii=False)); p.chmod(0o600)
        print(f'account {user} set'); return
    sys.exit(__doc__)


if __name__ == '__main__':
    main(sys.argv[1:])
