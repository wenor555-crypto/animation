#!/usr/bin/env python3
"""Generate placeholder dialogue with ElevenLabs.

Reads the API key from the ELEVENLABS_API_KEY environment variable (never hard-code it).
For every scene*.html, it takes the LINES array (who + Greek text) and writes
audio/<sceneNN>/<line number>.mp3. Then run build.py to embed the clips into dist/.

Usage:
  python3 tools/gen_voices.py            # all scenes, skips clips that already exist
  python3 tools/gen_voices.py scene02    # one scene
  python3 tools/gen_voices.py --list     # list the voices on your account (to fill VOICES below)
"""
import json, os, pathlib, re, sys, urllib.request

HERE = pathlib.Path(__file__).resolve().parent.parent
API = 'https://api.elevenlabs.io/v1'
MODEL = 'eleven_multilingual_v2'   # speaks Greek

# character -> ElevenLabs voice_id. Fill these in after `--list` (or after designing voices).
VOICES = {
    'narrator': '', 'giannos': '', 'mimis': '', 'giorgos': '', 'christos': '', 'kostas': '',
    'vasilis': '', 'vangelio': '', 'maria': '', 'myrsini': '', 'sita': '',
}
# per-character delivery: lower stability = more expressive
SETTINGS = {'default': {'stability': .4, 'similarity_boost': .8, 'style': .35},
            'sita': {'stability': .25, 'similarity_boost': .8, 'style': .8}}


def req(path, body=None, accept='application/json'):
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        sys.exit('Set ELEVENLABS_API_KEY in the environment first.')
    r = urllib.request.Request(API + path, data=json.dumps(body).encode() if body else None,
                               headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': accept})
    with urllib.request.urlopen(r, timeout=120) as resp:
        return resp.read()


def scene_lines(page):
    html = page.read_text(encoding='utf-8')
    block = html[html.index('const LINES = ['):]
    block = block[:block.index('];')]
    return [(m.group(1), m.group(2).replace("\\'", "'"))
            for m in re.finditer(r"who:\s*'([^']+)',\s*el:\s*'((?:[^'\\]|\\.)*)'", block)]


def main():
    if '--list' in sys.argv:
        for v in json.loads(req('/voices'))['voices']:
            print(v['voice_id'], '|', v['name'], '|', v.get('labels', {}))
        return
    only = [a for a in sys.argv[1:] if a.startswith('scene')]
    for page in sorted(HERE.glob('scene*.html')):
        sid = page.stem.split('-')[0]
        if only and sid not in only or 'const LINES' not in page.read_text(encoding='utf-8'):
            continue
        out = HERE / 'audio' / sid
        out.mkdir(parents=True, exist_ok=True)
        for i, (who, text) in enumerate(scene_lines(page), 1):
            f = out / f'{i:02d}.mp3'
            if f.exists():
                continue
            vid = VOICES.get(who)
            if not vid:
                print(f'skip {sid}/{i:02d} ({who}): no voice_id set'); continue
            audio = req(f'/text-to-speech/{vid}', {'text': text.replace('«', '').replace('»', ''), 'model_id': MODEL,
                                                   'voice_settings': SETTINGS.get(who, SETTINGS['default'])}, 'audio/mpeg')
            f.write_bytes(audio)
            print('wrote', f.relative_to(HERE))


if __name__ == '__main__':
    main()
