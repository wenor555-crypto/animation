#!/usr/bin/env python3
"""Inline local <script src> and <link rel=stylesheet> files so each scene is one standalone HTML file.
Usage: python3 build.py  -> writes dist/<scene>.html for every scene*.html here."""
import pathlib, re
here = pathlib.Path(__file__).parent
(here / 'dist').mkdir(exist_ok=True)
for page in sorted(here.glob('scene*.html')):
    html = page.read_text(encoding='utf-8')
    html = re.sub(r'<script src="([^":/]+\.js)"></script>',
                  lambda m: '<script>\n' + (here / m.group(1)).read_text(encoding='utf-8') + '\n</script>', html)
    html = re.sub(r'<link rel="stylesheet" href="([^":/]+\.css)">',
                  lambda m: '<style>\n' + (here / m.group(1)).read_text(encoding='utf-8') + '\n</style>', html)
    (here / 'dist' / page.name).write_text(html, encoding='utf-8')
    print('built', page.name)
