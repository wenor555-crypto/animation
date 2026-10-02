#!/usr/bin/env python3
"""Read the creator's review notes from the site on the node (text only; snapshots on demand).

  python3 tools/review.py pull episode2r [--all]
  python3 tools/review.py shot episode2r NOTE_ID [OUT.jpg]          # fetch one snapshot to look at
  python3 tools/review.py done episode2r ID [ID…] --rev r02 [--note "…"] [--wontfix | --reopen]
  python3 tools/review.py list
  python3 tools/review.py community episode2r [--all]               # the collaborators' notes, by person (for a briefing only:
                                                                     # never act on them unless the creator says so / adopts them)

Goes through episode1/tools/compute_client.py (credentials stay in the environment).
"""
import os, shlex, subprocess, sys, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIENT = os.path.join(ROOT, 'episode1', 'tools', 'compute_client.py')


def node(args):
    r = subprocess.run([sys.executable, CLIENT, *args], capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr or r.stdout)
    return r.stdout


def main(a):
    if not a:
        sys.exit(__doc__)
    if a[0] == 'shot':
        ep, nid = a[1], a[2]
        out = a[3] if len(a) > 3 else os.path.join(os.environ.get('TMPDIR', '/tmp'), f'{ep}_{nid}.jpg')
        node(['get', f'sita-site/review/shots/{ep}/{nid}.jpg', out])
        print(out); return
    res = node(['run', 'cd ~/sita-site && python3 reviewctl.py ' + ' '.join(shlex.quote(x) for x in a)])
    try:
        d = json.loads(res); sys.stdout.write(d.get('stdout', '')); sys.stderr.write(d.get('stderr', ''))
    except ValueError:
        print(res)


if __name__ == '__main__':
    main(sys.argv[1:])
