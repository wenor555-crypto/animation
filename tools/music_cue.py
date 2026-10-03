#!/usr/bin/env python3
"""Music cues (sound v2): cut excerpts from a track, with fades, loudness-normalised, mono 44.1 kHz.

  python3 tools/music_cue.py <episode dir>       # builds every <ep>/music/cues/<name>.mp3 from <ep>/music/cues.json

<ep>/music/cues.json: { "name": { "src": "whiskey_sour_full.mp3", "from": 58.9, "to": 80.5,
                                   "fadeIn": 0.05, "fadeOut": 0.8, "lufs": -20, "join": [[from, to], …] }, … }
"join" appends more segments (each crossfaded 0.3 s) after the first. The full source track stays out of git
(.gitignore); only the excerpts are committed and embedded by build.py as window.MUSICCUES.
"""
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def ffmpeg():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return 'ffmpeg'


def main(a):
    if not a:
        sys.exit(__doc__)
    ep = Path(a[0]) if Path(a[0]).is_absolute() else ROOT / a[0]
    spec = json.loads((ep / 'music' / 'cues.json').read_text(encoding='utf-8'))
    out = ep / 'music' / 'cues'; out.mkdir(parents=True, exist_ok=True)
    for name, c in spec.items():
        src = ep / 'music' / c['src']
        segs = [[c['from'], c['to']]] + c.get('join', [])
        inputs, filt = [], []
        for i, (f, t) in enumerate(segs):
            inputs += ['-ss', str(f), '-t', str(t - f), '-i', str(src)]
            filt.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=mono[s{i}]')
        chain = '[s0]'
        for i in range(1, len(segs)):
            filt.append(f'{chain}[s{i}]acrossfade=d=0.3[x{i}]'); chain = f'[x{i}]'
        total = sum(t - f for f, t in segs) - .3 * (len(segs) - 1)
        fo = c.get('fadeOut', .6)
        filt.append(f'{chain}afade=t=in:d={c.get("fadeIn", .05)},afade=t=out:st={max(0, total - fo):.3f}:d={fo},'
                    f'loudnorm=I={c.get("lufs", -20)}:TP=-1.5:LRA=11[o]')
        cmd = [ffmpeg(), '-y', '-hide_banner', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(filt), '-map', '[o]',
               '-ar', '44100', '-ac', '1', '-b:a', '128k', str(out / f'{name}.mp3')]
        subprocess.run(cmd, check=True)
        print('wrote', (out / f'{name}.mp3').relative_to(ROOT), f'{total:.1f} s')


if __name__ == '__main__':
    main(sys.argv[1:])
