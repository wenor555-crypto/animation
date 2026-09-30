#!/usr/bin/env python3
"""Publish a rendered episode on the site as its next revision (rNN). Called by render_ep.sh after COPIED_TO_VIDEO.

  python3 publish.py episode2r            # out/episode2r.mp4 + dist/episode2r.html -> releases/<slug>/rNN.*
  python3 publish.py episode1 --mp4 video/episode1.mp4
  python3 publish.py episode1 --poster                     # redo only the card image of the latest release

The slug comes from site.json ("aliases": the remake episode2r is published as episode2). Keeps the last KEEP revisions.
"""
import json, os, re, shutil, subprocess, sys, time
from pathlib import Path

RENDER = Path(os.environ.get('SITA_RENDER', '~/sita-render')).expanduser()
SITE = Path(os.environ.get('SITA_SITE', '~/sita-site')).expanduser()
HERE = Path(__file__).resolve().parent
KEEP = 3


def ffmpeg():
    if os.environ.get('FFMPEG'):
        return os.environ['FFMPEG']
    py = RENDER / 'venv' / 'bin' / 'python'
    try:
        return subprocess.check_output([str(py), '-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'], text=True).strip()
    except (OSError, subprocess.CalledProcessError):
        return shutil.which('ffmpeg') or 'ffmpeg'


def poster(ff, cfg, ep, stem, dur):
    """The card image: a frame with no subtitles, picked per episode in site.json "posters" (seconds), else 30% in."""
    at = cfg.get('posters', {}).get(ep, round(dur * .3, 1))
    subprocess.run([ff, '-hide_banner', '-loglevel', 'error', '-y', '-ss', str(at), '-i', str(stem.with_suffix('.mp4')), '-frames:v', '1', '-vf', 'scale=960:-2',
                    '-q:v', '4', str(stem.with_suffix('.jpg'))], check=False)


def main(argv):
    ep = argv[0]
    if not re.match(r'^[a-z0-9_-]{1,40}$', ep):
        sys.exit('bad episode name')
    cfg = json.loads((HERE / 'site.json').read_text())
    slug = cfg.get('aliases', {}).get(ep, ep)
    mp4 = Path(argv[argv.index('--mp4') + 1]) if '--mp4' in argv else RENDER / 'out' / f'{ep}.mp4'
    if not mp4.is_absolute():
        mp4 = RENDER / mp4
    page = RENDER / 'dist' / f'{ep}.html'
    if not mp4.exists() and '--poster' not in argv:
        sys.exit(f'no video at {mp4}')
    d = SITE / 'releases' / slug; d.mkdir(parents=True, exist_ok=True)
    if '--poster' in argv:                                    # only redo the card image of the latest release
        last = max((json.loads(f.read_text()) for f in d.glob('r*.json')), key=lambda m: m['n'])
        poster(ffmpeg(), cfg, last['ep'], d / f'r{last["n"]:02d}', last['dur']); print(f'poster {slug} r{last["n"]:02d}'); return
    have = [int(m.group(1)) for f in d.glob('r*.json') if (m := re.match(r'r(\d+)\.json$', f.name))]
    n = max(have, default=0) + 1
    stem = d / f'r{n:02d}'
    tmp = stem.with_suffix('.mp4.part')
    shutil.copyfile(mp4, tmp); tmp.rename(stem.with_suffix('.mp4'))
    if page.exists():
        shutil.copyfile(page, stem.with_suffix('.html'))
    ff = ffmpeg()
    info = subprocess.run([ff, '-hide_banner', '-i', str(mp4)], capture_output=True, text=True).stderr
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', info)
    dur = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3)) if m else 0
    poster(ff, cfg, ep, stem, dur)
    meta = {'n': n, 'ep': ep, 'slug': slug, 'dur': round(dur, 1), 'size': stem.with_suffix('.mp4').stat().st_size,
            'date': time.strftime('%d/%m/%Y'), 'ts': time.strftime('%Y-%m-%dT%H:%M:%S'), 'html': page.exists()}
    stem.with_suffix('.json').write_text(json.dumps(meta, ensure_ascii=False))   # written last: the site only lists complete releases
    for old in sorted(have)[:max(0, len(have) - (KEEP - 1))]:
        for f in d.glob(f'r{old:02d}.*'):
            f.unlink()
    print(f'PUBLISHED {slug} r{n:02d} ({meta["size"] / 1e6:.0f} MB, {dur / 60:.1f} min)')


if __name__ == '__main__':
    main(sys.argv[1:] or sys.exit(__doc__))
