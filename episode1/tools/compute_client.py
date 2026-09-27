#!/usr/bin/env python3
"""Tiny client for the ComputeNode service (a remote box that renders the MP4).

Reads REMOTE_API_URL and REMOTE_API_TOKEN from the environment (never hard-code or print them).
Every request sends  Authorization: Bearer <token>  and  ngrok-skip-browser-warning: 1.

Usage:
  python3 episode1/tools/compute_client.py health
  python3 episode1/tools/compute_client.py run 'shell command' [--cwd DIR] [--timeout S]   # wait for the result
  python3 episode1/tools/compute_client.py job 'shell command' [--cwd DIR]                 # start in the background, print its id
  python3 episode1/tools/compute_client.py status JOB_ID [--tail N]                        # state + last N lines of output
  python3 episode1/tools/compute_client.py jobs
  python3 episode1/tools/compute_client.py kill JOB_ID
  python3 episode1/tools/compute_client.py put LOCAL_FILE REMOTE_PATH
  python3 episode1/tools/compute_client.py get REMOTE_PATH LOCAL_FILE
"""
import json, os, sys, urllib.error, urllib.parse, urllib.request


def base():
    url, tok = os.environ.get('REMOTE_API_URL'), os.environ.get('REMOTE_API_TOKEN')
    if not url or not tok:
        sys.exit('Set REMOTE_API_URL and REMOTE_API_TOKEN in the environment first.')
    return url.rstrip('/'), tok


def call(method, path, body=None, raw=None, timeout=120, stream_to=None):
    url, tok = base()
    headers = {'Authorization': f'Bearer {tok}', 'ngrok-skip-browser-warning': '1'}
    data = None
    if body is not None:
        data, headers['Content-Type'] = json.dumps(body).encode(), 'application/json'
    elif raw is not None:
        data, headers['Content-Type'] = raw, 'application/octet-stream'
    r = urllib.request.Request(url + path, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(r, timeout=timeout) as resp:
            if stream_to:
                n = 0
                with open(stream_to, 'wb') as f:
                    while chunk := resp.read(1 << 20):
                        f.write(chunk); n += len(chunk)
                return n
            out = resp.read()
    except urllib.error.HTTPError as e:
        sys.exit(f'HTTP {e.code} on {method} {path}: {e.read().decode(errors="replace")[:500]}')
    except urllib.error.URLError as e:
        sys.exit(f'cannot reach the ComputeNode service ({method} {path}): {e.reason}')
    try:
        return json.loads(out)
    except ValueError:
        return out.decode(errors='replace')


def opt(args, name, default=None):
    if name in args:
        i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return v
    return default


def show(x):
    print(x if isinstance(x, str) else json.dumps(x, indent=2, ensure_ascii=False))


def main():
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    cmd = a.pop(0)
    cwd, tail, tmo = opt(a, '--cwd'), opt(a, '--tail', '50'), opt(a, '--timeout')
    if cmd == 'health':
        show(call('GET', '/health', timeout=30))
    elif cmd in ('run', 'job'):
        body = {'cmd': a[0]}
        if cwd: body['cwd'] = cwd
        if cmd == 'job': body['background'] = True
        if tmo: body['timeout'] = int(tmo)
        show(call('POST', '/run' if cmd == 'run' else '/jobs', body, timeout=int(tmo or 600) + 30))
    elif cmd == 'status':
        show(call('GET', f'/jobs/{a[0]}?tail={int(tail)}'))
    elif cmd == 'jobs':
        show(call('GET', '/jobs'))
    elif cmd == 'kill':
        show(call('POST', f'/jobs/{a[0]}/kill'))
    elif cmd == 'put':
        with open(a[0], 'rb') as f:
            show(call('PUT', '/file?path=' + urllib.parse.quote(a[1]), raw=f.read(), timeout=600))
    elif cmd == 'get':
        n = call('GET', '/file?path=' + urllib.parse.quote(a[0]), timeout=1800, stream_to=a[1])
        print(f'saved {a[1]} ({n} bytes)')
    else:
        sys.exit(f'unknown command {cmd!r}\n' + __doc__)


if __name__ == '__main__':
    main()
