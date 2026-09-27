#!/usr/bin/env python3
"""Generate placeholder dialogue with ElevenLabs.

Reads the API key from the ELEVENLABS_API_KEY environment variable (never hard-code it).
For every scene*.html and scenes/*.js, it takes the spoken lines (who + Greek text, in order)
and writes audio/<sceneNN>/<line number>.mp3. Then run build.py to embed the clips into dist/.

Usage:
  python3 tools/gen_voices.py            # all scenes, skips clips that already exist
  python3 tools/gen_voices.py scene02    # one scene
  python3 tools/gen_voices.py --count    # characters still to generate vs. your quota (no API cost)
  python3 tools/gen_voices.py --list     # list the voices on your account (to fill VOICES below)
"""
import json, os, pathlib, re, sys, urllib.request

HERE = pathlib.Path(__file__).resolve().parent.parent
API = 'https://api.elevenlabs.io/v1'
MODEL = 'eleven_multilingual_v2'   # speaks Greek

# character -> ElevenLabs voice_id. Fill these in after `--list` (or after designing voices).
VOICES = {
    'narrator': 'nPczCjzI2devNBz1zQrb',  # Brian: deep, resonant (trailer V.O.)
    'giannos': 'iP95p4xoKVk53GoZ742B',   # Chris: charming, down-to-earth (the plan-maker)
    'mimis': 'N2lVS1w4EtoT3dr4eOWO',     # Callum: husky trickster (deadpan kamikaze)
    'giorgos': 'cjVigY5qzO86Huf0OWal',   # Eric: smooth, trustworthy, classy (the charmer)
    'christos': 'bIHbv24MWmeRgasZH58o',  # Will: relaxed, chill (laid-back mangaka)
    'kostas': 'SOYHLrjzK2X1ezoPC6cr',    # Harry: rough (Κώστας)
    'panik': 'SOYHLrjzK2X1ezoPC6cr',     # Harry again, delivered harder (Κώστας as Panik)
    'vasilis': 'pqHfZKP75CvOlQylNhV4',   # Bill: old, wise, balanced (zero-fucks calm)
    'vangelio': 'pFZP5JQG7iQjIQuC4Bku',  # Lily: velvety, confident (iron-hand mother)
    'maria': 'FGY2WhTYpPnrIDTdsKH5',     # Laura: quirky, sassy
    'myrsini': 'hpp4J3VqNfWAUOO0d1Us',   # Bella: bright, warm (the nice hostess)
    'sita': 'EXAVITQu4vr4xnSDxMaL',      # Sarah: entertainment/TV (hyper TV-shop presenter)
}
# per-character delivery: lower stability = more expressive
SETTINGS = {'default': {'stability': .4, 'similarity_boost': .8, 'style': .35},
            'sita': {'stability': .25, 'similarity_boost': .8, 'style': .8},
            'panik': {'stability': .3, 'similarity_boost': .8, 'style': .7},
            'narrator': {'stability': .55, 'similarity_boost': .8, 'style': .4}}
FORMAT = 'mp3_44100_64'   # small files: the whole episode is embedded in one HTML page


def req(path, body=None, accept='application/json'):
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        sys.exit('Set ELEVENLABS_API_KEY in the environment first.')
    r = urllib.request.Request(API + path, data=json.dumps(body).encode() if body else None,
                               headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': accept})
    with urllib.request.urlopen(r, timeout=120) as resp:
        return resp.read()


STR = r"""(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")"""


def scene_lines(page):
    """Spoken lines in order: one per source line that has both  who: '…'  and  el: '…'  (either quote style)."""
    src = page.read_text(encoding='utf-8')
    if page.suffix == '.html':
        src = src[src.index('const LINES = ['):]
        src = src[:src.index('];')]
    out = []
    for line in src.splitlines():
        w = re.search(r"\bwho:\s*'([^']+)'", line)
        e = re.search(r"\bel:\s*" + STR, line)
        if w and e:
            text = e.group(1) if e.group(1) is not None else e.group(2)
            out.append((w.group(1), text.replace("\\'", "'").replace('\\"', '"')))
    return out


def scene_files():
    """(scene id, file) for every scene; scenes/*.js files declare their id as  id: 'sceneNN'."""
    out = {}
    for page in sorted(HERE.glob('scene*.html')):
        if 'const LINES' in page.read_text(encoding='utf-8'):
            out.setdefault(page.stem.split('-')[0], page)
    for js in sorted((HERE / 'scenes').glob('*.js')):
        m = re.search(r"id:\s*'(scene\d+)'", js.read_text(encoding='utf-8'))
        if m:
            out[m.group(1)] = js
    return sorted(out.items())


def clean(text):
    return text.replace('«', '').replace('»', '')


def main():
    if '--list' in sys.argv:
        for v in json.loads(req('/voices'))['voices']:
            print(v['voice_id'], '|', v['name'], '|', v.get('labels', {}))
        return
    only = [a for a in sys.argv[1:] if a.startswith('scene')]
    todo = []
    for sid, page in scene_files():
        if only and sid not in only:
            continue
        for i, (who, text) in enumerate(scene_lines(page), 1):
            f = HERE / 'audio' / sid / f'{i:02d}.mp3'
            if not f.exists():
                todo.append((sid, i, who, text, f))
    if '--count' in sys.argv:
        n = sum(len(clean(t)) for *_, t, _ in todo)
        print(f'{len(todo)} clips / {n} characters to generate')
        sub = json.loads(req('/user/subscription'))
        print(f"quota: {sub['character_count']} / {sub['character_limit']} used this period")
        return
    for sid, i, who, text, f in todo:
        vid = VOICES.get(who)
        if not vid:
            print(f'skip {sid}/{i:02d} ({who}): no voice_id set'); continue
        f.parent.mkdir(parents=True, exist_ok=True)
        audio = req(f'/text-to-speech/{vid}?output_format={FORMAT}',
                    {'text': clean(text), 'model_id': MODEL, 'voice_settings': SETTINGS.get(who, SETTINGS['default'])}, 'audio/mpeg')
        f.write_bytes(audio)
        print('wrote', f.relative_to(HERE))


if __name__ == '__main__':
    main()
