#!/usr/bin/env python3
"""Inline local <script src> and <link rel=stylesheet> files so each page is one standalone HTML file.
Also embeds recorded dialogue: audio/<sceneNN>/<line number, 2 digits>.(mp3|wav|ogg|m4a)
(e.g. audio/scene02/07.mp3 = the 7th line of scene 2), plus each MP3's exact duration
(window.CLIP_DUR) so step-based scenes can lay out their timeline from the real voices.
Lines with a clip play it instead of the placeholder TTS, and the timeline waits for each clip.
Usage: python3 build.py  -> writes dist/<page>.html for every scene*.html and episode*.html here."""
import base64, json, pathlib, re, sys
MIME = {'.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4'}
here = pathlib.Path(__file__).parent
(here / 'dist').mkdir(exist_ok=True)

BITRATES = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]   # MPEG-1 layer III
RATES = {3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000]}


def mp3_duration(data):
    """Sum the frames of an MPEG audio file (layer III)."""
    i, dur = 0, 0.0
    if data[:3] == b'ID3':
        i = 10 + ((data[6] << 21) | (data[7] << 14) | (data[8] << 7) | data[9])
    while i + 4 <= len(data):
        if data[i] != 0xFF or (data[i + 1] & 0xE0) != 0xE0:
            i += 1; continue
        ver, br_i, sr_i, pad = (data[i + 1] >> 3) & 3, data[i + 2] >> 4, (data[i + 2] >> 2) & 3, (data[i + 2] >> 1) & 1
        if ver == 1 or br_i in (0, 15) or sr_i == 3:
            i += 1; continue
        sr = RATES[ver][sr_i]
        if ver == 3:
            br, spf = BITRATES[br_i], 1152
        else:
            br, spf = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160][br_i], 576
        size = (spf // 8 * br * 1000) // sr + pad
        dur += spf / sr
        i += max(size, 1)
    return round(dur, 3)


def inline(html):
    html = re.sub(r'<script src="([^":]+\.js)"></script>',
                  lambda m: '<script>\n' + (here / m.group(1)).read_text(encoding='utf-8') + '\n</script>', html)
    return re.sub(r'<link rel="stylesheet" href="([^":/]+\.css)">',
                  lambda m: '<style>\n' + (here / m.group(1)).read_text(encoding='utf-8') + '\n</style>', html)


sys.path.insert(0, str(here.resolve().parent / 'tools'))
from level_voices import levels                             # every clip at the same loudness unless meant loud/soft
LEVELS, _held = levels(here, quiet=False) if (here / 'audio').is_dir() else ({}, [])
pages = sorted(here.glob('scene*.html')) + sorted(here.glob('episode*.html'))
for page in pages:
    html = inline(page.read_text(encoding='utf-8'))
    ids = sorted(set(re.findall(r"id:\s*'(scene\d+)'", html)) | {page.stem.split('-')[0]})
    clips, durs = {}, {}
    for sid in ids:
        d = here / 'audio' / sid
        for f in sorted(d.glob('*')) if d.is_dir() else []:
            if f.suffix.lower() in MIME:
                key = f'{sid}/{f.stem}'
                clips[key] = f'data:{MIME[f.suffix.lower()]};base64,' + base64.b64encode(f.read_bytes()).decode()
                if f.suffix.lower() == '.mp3':
                    durs[key] = mp3_duration(f.read_bytes())
    head = f'<script>window.CLIP_DUR = {json.dumps(durs)};</script>\n'
    for var, sub in (('SFXCLIPS', 'sfx'), ('MUSICCUES', 'music/cues')):   # sound v2: recorded effects and music cues
        d = here / sub
        found = {f.stem: f'data:audio/mpeg;base64,' + base64.b64encode(f.read_bytes()).decode() for f in sorted(d.glob('*.mp3'))} if d.is_dir() else {}
        if found:
            head += f'<script>window.{var} = ' + json.dumps(found) + ';</script>\n'
    if clips and LEVELS:                                    # voice levels (tools/level_voices.py): gain in dB per clip
        head += '<script>window.CLIP_GAIN = ' + json.dumps({k: LEVELS[k] for k in clips if LEVELS.get(k)}) + ';</script>\n'
    if clips:
        head += '<script>window.CLIPS = ' + json.dumps(clips) + ';</script>\n'
        print(f'  {len(clips)} voice clips embedded')
    html = html.replace('<script>', head + '<script>', 1)
    (here / 'dist' / page.name).write_text(html, encoding='utf-8')
    print('built', page.name, f'({len(html) // 1024} KB)')
