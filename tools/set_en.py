#!/usr/bin/env python3
"""Set the English subtitle of lines, found by their Greek text, in an episode's scene files.

  python3 tools/set_en.py episode1 translations.json      # {"<el text as written>": "<new en>", ...}

Touches only the  en: '…'  of the source line that has exactly that  el: '…'  (every such line, if the same
Greek line is said more than once). Prints what it changed and any Greek line it could not find.
"""
import json, re, sys
from pathlib import Path

STR = r"""('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")"""


def unq(tok):
    return tok[1:-1].replace("\\'", "'").replace('\\"', '"')


def js(s):
    if "'" not in s:
        return "'" + s + "'"
    if '"' not in s:
        return '"' + s + '"'
    return "'" + s.replace("'", "\\'") + "'"


def main(ep, table):
    root = Path(__file__).resolve().parent.parent / ep
    want = json.loads(Path(table).read_text(encoding='utf-8'))
    found = set()
    files = sorted((root / 'scenes').glob('*.js')) + sorted(root.glob('scene*.html'))
    for f in files:
        src = f.read_text(encoding='utf-8').split('\n'); changed = False
        for i, line in enumerate(src):
            m = re.search(r'\bel:\s*' + STR, line)
            if not m or unq(m.group(1)) not in want:
                continue
            el = unq(m.group(1)); new, n = re.subn(r'\ben:\s*' + STR, lambda _: 'en: ' + js(want[el]), line, count=1)
            if n and new != line:
                src[i] = new; changed = True; print(f'{f.name}:{i + 1}  {want[el]}')
            found.add(el)
        if changed:
            f.write_text('\n'.join(src), encoding='utf-8')
    missing = set(want) - found
    for el in missing:
        print('NOT FOUND:', el)
    sys.exit(1 if missing else 0)


if __name__ == '__main__':
    main(*sys.argv[1:3]) if len(sys.argv) >= 3 else sys.exit(__doc__)
