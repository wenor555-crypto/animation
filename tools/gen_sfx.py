#!/usr/bin/env python3
"""Sound effects with ElevenLabs sound generation (sound v2).

  python3 tools/gen_sfx.py <episode dir>          # generates every missing <ep>/sfx/<name>.mp3 from <ep>/sfx.json
  python3 tools/gen_sfx.py <episode dir> NAME …   # (re)generates these names
  python3 tools/gen_sfx.py <episode dir> --norm   # only re-normalises the existing clips

<ep>/sfx.json: { "name": { "prompt": "…", "dur": 1.5, "influence": 0.5 }, … }
Clips are cached by file existence (delete one to regenerate it). build.py embeds <ep>/sfx/*.mp3 as window.SFXCLIPS;
scenes play them with SND2.sfx(name). The API key comes from the environment and is never printed or written.
"""
import json, os, subprocess, sys, time, urllib.error, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def generate(prompt, dur, influence):
    body = json.dumps({'text': prompt, 'duration_seconds': dur, 'prompt_influence': influence}).encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation', data=body,
                                 headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return r.read()
        except (urllib.error.HTTPError, urllib.error.URLError) as e:
            if attempt == 4:
                raise SystemExit(f'sound generation failed: {getattr(e, "code", "")} {getattr(e, "reason", e)}')
            time.sleep(2 ** attempt * 2)


def main(a):
    if not a:
        sys.exit(__doc__)
    ep = Path(a[0]) if Path(a[0]).is_absolute() else ROOT / a[0]
    spec = json.loads((ep / 'sfx.json').read_text(encoding='utf-8'))
    out = ep / 'sfx'; out.mkdir(exist_ok=True)
    if '--norm' in a:
        for name, s in spec.items():
            if (out / f'{name}.mp3').exists():
                normalise(out / f'{name}.mp3', s.get('lufs', -18))
        return
    only = set(a[1:])
    for name, s in spec.items():
        f = out / f'{name}.mp3'
        if (only and name not in only) or (not only and f.exists()):
            continue
        f.write_bytes(generate(s['prompt'], s.get('dur', 1.5), s.get('influence', .5)))
        normalise(f, s.get('lufs', -18))
        print('wrote', f.relative_to(ROOT), f'({f.stat().st_size // 1024} KB)')


def normalise(f, lufs):
    """one loudness for every effect (scenes set the mix with SND2.sfx's vol); true peak under -1 dBFS"""
    try:
        import imageio_ffmpeg
        ff = imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        ff = 'ffmpeg'
    tmp = f.with_suffix('.tmp.mp3')
    subprocess.run([ff, '-y', '-hide_banner', '-loglevel', 'error', '-i', str(f), '-af', f'loudnorm=I={lufs}:TP=-1:LRA=11', '-ar', '44100', '-ac', '1', '-b:a', '128k', str(tmp)], check=True)
    tmp.replace(f)


if __name__ == '__main__':
    main(sys.argv[1:])
