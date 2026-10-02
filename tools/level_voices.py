#!/usr/bin/env python3
"""Voice levels: every dialogue clip plays at the same loudness, unless the line is meant to be loud or quiet.

  python3 tools/level_voices.py episode1r            # measure (cached) and print the report
  python3 tools/level_voices.py episode1r --check    # exit 1 if a clip can't reach its target (peak-limited)

ElevenLabs voices come out at very different levels (Γιάννος around -23 LUFS, Γιώργος around -11). Nothing is
re-encoded: each clip's integrated loudness (EBU R128) is measured once with ffmpeg and cached in
<episode>/audio/levels.json by the file's hash; build.py embeds the gains as window.CLIP_GAIN (dB), and the
engine plays each clip through a gain node, in the player and in the MP4 export alike.

Targets, by intent:
  normal  -16 LUFS
  loud    -13 LUFS   a shouted line: '!' or a word in CAPS (the same rule gen_voices uses), or  level: 'loud'
  soft    -21 LUFS   tag: '[whispers] ' (or any whisper/quiet/sleepy tag), or  level: 'soft'
  level: 'normal' on a line overrides the automatic choice.
The gain is kept within ±12 dB. The engine's dialogue bus has a fast peak limiter (-3 dBFS), so a quiet clip
brought up doesn't clip on its transients; a clip that would need more than 6 dB of limiting, or more than
12 dB of gain, is reported (and fails --check): regenerate it rather than squash it.
"""
import hashlib, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = {'normal': -16.0, 'loud': -13.0, 'soft': -21.0}
LIMIT, MAX_GAIN, MAX_SQUASH = -3.0, 12.0, 6.0
SOFT_TAG = re.compile(r'whisper|quiet|sleepy|softly|murmur', re.I)


def ffmpeg():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return 'ffmpeg'


def measure(f):
    """(integrated LUFS, true peak dBFS) of one clip."""
    r = subprocess.run([ffmpeg(), '-hide_banner', '-nostats', '-i', str(f), '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    i = re.findall(r'I:\s+(-?[\d.]+|-inf) LUFS', r); p = re.findall(r'Peak:\s+(-?[\d.]+|-inf) dBFS', r)
    num = lambda s: -99.0 if s == '-inf' else float(s)
    return (num(i[-1]) if i else -99.0), (num(p[-1]) if p else -99.0)


def intents(ep):
    """{clip key: 'normal'|'loud'|'soft'}. The line text per clip comes from audio/stt_report.json (written by gen_voices,
    so the numbering is exactly the clips'); a  level:  or a whisper  tag:  on the scene line that holds it overrides."""
    rep_f = ep / 'audio' / 'stt_report.json'
    rep = json.loads(rep_f.read_text(encoding='utf-8')) if rep_f.exists() else {}
    src = {}
    for js in sorted((ep / 'scenes').glob('*.js')) + sorted(ep.glob('scene*.html')):
        t = js.read_text(encoding='utf-8'); m = re.search(r"id:\s*'(scene\d+)'", t) or re.match(r'(scene\d+)', js.stem)
        if m:
            src.setdefault(m.group(1), []).extend(t.split('\n'))
    out = {}
    for key, r in rep.items():
        text, sid = r.get('text', ''), key.split('/')[0]
        probe = text[:40]
        who = re.compile(r"who:\s*'%s'" % re.escape(r.get('who', '')))
        cand = [l for l in src.get(sid, []) if probe and probe in l.replace("\\'", "'")]
        line = next((l for l in cand if who.search(l)), cand[0] if cand else '')
        lv = re.search(r"\blevel:\s*'(normal|loud|soft)'", line); tag = re.search(r"\btag:\s*'([^']*)'", line)
        if lv:
            k = lv.group(1)
        elif tag and SOFT_TAG.search(tag.group(1)):
            k = 'soft'
        elif '!' in text or any(w.isupper() and len(w) > 1 for w in re.findall(r'[Α-ΩΆ-Ώ]+', text)):
            k = 'loud'
        else:
            k = 'normal'
        out[key] = k
    return out


def levels(ep, quiet=True):
    """{clip key: gain dB} for every clip of the episode; measures only new or changed clips."""
    ep = Path(ep); audio = ep / 'audio'; cache_f = audio / 'levels.json'
    cache = json.loads(cache_f.read_text()) if cache_f.exists() else {}
    want = intents(ep); gains, report, _ = {}, [], False
    for f in sorted(audio.glob('scene*/*.mp3')):
        key = f'{f.parent.name}/{f.stem}'; h = hashlib.sha1(f.read_bytes()).hexdigest()[:16]
        c = cache.get(key)
        if not c or c.get('hash') != h:
            lufs, peak = measure(f); c = {'hash': h, 'lufs': lufs, 'peak': peak}
        intent = want.get(key, 'normal')
        if c['lufs'] <= -70:                                    # silence / a breath: leave it alone
            g = 0.0; held = False
        else:
            want_g = TARGET[intent] - c['lufs']; g = max(-MAX_GAIN, min(MAX_GAIN, want_g))
            held = abs(want_g - g) > .05 or c['peak'] + g - LIMIT > MAX_SQUASH
        c.update(intent=intent, gain=round(g, 2), held=held); cache[key] = c
        gains[key] = round(g, 2)
        if held:
            report.append(f'  {key}: {c["lufs"]:.1f} LUFS, peak {c["peak"]:.1f}, gain {g:+.1f} dB (target {TARGET[intent]:.0f}, {intent}): '
                          f'{"gain limit" if abs(TARGET[intent] - c["lufs"] - g) > .05 else "%.1f dB into the limiter" % (c["peak"] + g - LIMIT)}')
    cache = {k: cache[k] for k in sorted(cache) if (audio / (k + '.mp3')).exists()}
    text = json.dumps(cache, ensure_ascii=False, indent=0) + '\n'
    if not cache_f.exists() or cache_f.read_text() != text:
        cache_f.write_text(text)
    if not quiet and report:
        print('voice levels: %d clip(s) need a look:' % len(report)); print('\n'.join(report))
    return gains, report


def main(a):
    if not a:
        sys.exit(__doc__)
    ep = Path(a[0]) if Path(a[0]).is_absolute() else ROOT / a[0]
    gains, held = levels(ep, quiet=False)
    cache = json.loads((ep / 'audio' / 'levels.json').read_text())
    by = {}
    for k, c in cache.items():
        rep = json.loads((ep / 'audio' / 'stt_report.json').read_text()).get(k, {}) if (ep / 'audio' / 'stt_report.json').exists() else {}
        by.setdefault(rep.get('who', '?'), []).append((c['lufs'], c['lufs'] + c['gain'], c['intent']))
    print(f'{ep.name}: {len(gains)} clips')
    for who, v in sorted(by.items()):
        b = sorted(x[0] for x in v); after = sorted(x[1] for x in v if x[2] == 'normal')
        mid = lambda s: s[len(s) // 2] if s else float('nan')
        print(f'  {who:16s} n={len(v):3d}  before median {mid(b):6.1f}  after (normal lines) median {mid(after):6.1f}  '
              f'loud {sum(x[2] == "loud" for x in v)}  soft {sum(x[2] == "soft" for x in v)}')
    if '--check' in a and held:
        sys.exit(1)


if __name__ == '__main__':
    main(sys.argv[1:])
