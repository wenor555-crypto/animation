#!/usr/bin/env python3
"""Inline local <script src> and <link rel=stylesheet> files so each scene is one standalone HTML file.
Also embeds recorded dialogue: audio/<sceneNN>/<line number, 2 digits>.(mp3|wav|ogg|m4a)
(e.g. audio/scene02/07.mp3 = the 7th line of scene 2). Lines with a clip play it instead of
the placeholder TTS, and the timeline waits for each clip to finish.
Usage: python3 build.py  -> writes dist/<scene>.html for every scene*.html here."""
import base64, json, pathlib, re
MIME = {'.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4'}
here = pathlib.Path(__file__).parent
(here / 'dist').mkdir(exist_ok=True)
for page in sorted(here.glob('scene*.html')):
    html = page.read_text(encoding='utf-8')
    html = re.sub(r'<script src="([^":/]+\.js)"></script>',
                  lambda m: '<script>\n' + (here / m.group(1)).read_text(encoding='utf-8') + '\n</script>', html)
    html = re.sub(r'<link rel="stylesheet" href="([^":/]+\.css)">',
                  lambda m: '<style>\n' + (here / m.group(1)).read_text(encoding='utf-8') + '\n</style>', html)
    scene_id = page.stem.split('-')[0]
    clips = {}
    for f in sorted((here / 'audio' / scene_id).glob('*')) if (here / 'audio' / scene_id).is_dir() else []:
        if f.suffix.lower() in MIME:
            clips[f'{scene_id}/{f.stem}'] = f'data:{MIME[f.suffix.lower()]};base64,' + base64.b64encode(f.read_bytes()).decode()
    if clips:
        html = html.replace('<script>', '<script>window.CLIPS = ' + json.dumps(clips) + ';</script>\n<script>', 1)
        print(f'  {len(clips)} voice clips embedded')
    (here / 'dist' / page.name).write_text(html, encoding='utf-8')
    print('built', page.name)
