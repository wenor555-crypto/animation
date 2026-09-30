// Render dist/episode1.html to an MP4:  node tools/export_mp4.js out.mp4 [fps] [seconds]   (PAGE=episode2.html for another episode)
// Frames come from the page itself (renderAt), the soundtrack from exportAudio() (offline Web Audio).
// Needs: npm i playwright-core, a Chromium (CHROME=path), and ffmpeg (pip install imageio-ffmpeg, or FFMPEG=path).
// Subtitles (SUBS env): 'soft' (default) = clean picture; the lines go to out.el.vtt / out.en.vtt (same timings as the player)
// and are also muxed into the MP4 as two selectable tracks (Greek default). 'burn' = the old way, Greek drawn into the picture.
const { chromium } = require('playwright-core');
const { spawn } = require('child_process'); const fs = require('fs');
const FF = process.env.FFMPEG || require('child_process').execSync('python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"').toString().trim();
const path = require('path'), HERE = path.resolve(__dirname, '..'), S = require('os').tmpdir();
(async () => {
  const out = process.argv[2], fps = +(process.argv[3] || 30), limit = process.argv[4] ? +process.argv[4] : null;
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const pg = await b.newPage({ viewport: { width: 1400, height: 1000 }, acceptDownloads: true });
  pg.on('pageerror', e => console.log('PAGEERR', String(e)));
  // Google Fonts through Node's fetch (which trusts the proxy CA), so the export uses the real fonts
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, async route => {
    try { const r = await fetch(route.request().url(), { headers: { 'user-agent': 'Mozilla/5.0 Chrome/140' } }); const body = Buffer.from(await r.arrayBuffer());
      await route.fulfill({ status: r.status, body, headers: { 'content-type': r.headers.get('content-type') || '', 'access-control-allow-origin': '*' } }); }
    catch (e) { console.log('font fetch failed', e.message); await route.abort(); }
  });
  await pg.goto('file://' + HERE + '/dist/' + (process.env.PAGE || 'episode1.html')); await pg.evaluate(() => Promise.all(['700 20px Comfortaa', '700 20px "Noto Sans"', 'italic 900 20px "Noto Sans"', 'italic 700 20px "Noto Sans"', '900 20px "Noto Sans"'].map(f => document.fonts.load(f)))); await pg.waitForTimeout(1500);
  console.log('fonts', await pg.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.style + ' ' + f.weight).join(', ')));
  const dur = limit || await pg.evaluate(() => EPISODE.dur);
  console.log('duration', dur.toFixed(1), 's');
  const SOFT = (process.env.SUBS || 'soft') !== 'burn';
  if (SOFT) {
    await pg.evaluate(() => { window.drawSubs = () => {}; });   // clean picture: the subtitles become tracks instead
    for (const lang of ['el', 'en']) {
      const vtt = await pg.evaluate(([lang, dur]) => {
        const ts = x => { const ms = Math.round(x * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`; };
        const esc = x => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const cues = [];
        for (const s of EPISODE.scenes) for (const L of s.lines) {
          if (L.nosub) continue;
          const a = s.off + L.a, b = Math.min(s.off + L.b, s.off + s.dur, dur); if (a >= dur || b <= a) continue;
          const V = voiceInfo(s, L.who), name = L.label ? L.label[lang === 'el' ? 0 : 1] : (lang === 'el' ? V.el : V.en);
          cues.push(`${cues.length + 1}\n${ts(a)} --> ${ts(b)}\n${name ? '<b>' + esc(name) + '</b>  ' : ''}${esc(lang === 'el' ? L.el : L.en)}\n`);
        }
        return 'WEBVTT\n\n' + cues.join('\n');
      }, [lang, dur]);
      fs.writeFileSync(out.replace(/\.mp4$/, '') + `.${lang}.vtt`, vtt);
    }
    console.log('subtitles', out.replace(/\.mp4$/, '') + '.{el,en}.vtt');
  }
  // 1) audio
  let t0 = Date.now();
  const b64 = await pg.evaluate(async () => { const blob = await exportAudio(); const buf = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000)); return btoa(s); });
  fs.writeFileSync(S + '/episode.wav', Buffer.from(b64, 'base64'));
  console.log('audio done', ((Date.now() - t0) / 1000).toFixed(0), 's');
  // 2) frames → ffmpeg
  const ff = spawn(FF, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-i', S + '/episode.wav',
    '-c:v', 'libx264', '-preset', 'medium', '-tune', 'animation', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.ceil(dur * fps), B = 30; t0 = Date.now();
  for (let i = 0; i < n; i += B) {
    const frames = await pg.evaluate(([i, B, n, fps]) => { const r = []; for (let k = i; k < Math.min(n, i + B); k++) { const t = k / fps; FLAP = t; renderAt(t); r.push(document.getElementById('c').toDataURL('image/jpeg', .93).split(',')[1]); } return r; }, [i, B, n, fps]);
    for (const f of frames) { if (!ff.stdin.write(Buffer.from(f, 'base64'))) await new Promise(r => ff.stdin.once('drain', r)); }
    if (i % (B * 60) === 0) console.log(`frame ${i}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  if (SOFT) {   // the two subtitle tracks into the file itself, so a downloaded MP4 can switch language in any player
    const base = out.replace(/\.mp4$/, ''), tmp = base + '.subs.mp4';
    const r = require('child_process').spawnSync(FF, ['-y', '-loglevel', 'error', '-i', out, '-i', base + '.el.vtt', '-i', base + '.en.vtt', '-map', '0:v', '-map', '0:a', '-map', '1', '-map', '2',
      '-c:v', 'copy', '-c:a', 'copy', '-c:s', 'mov_text', '-metadata:s:s:0', 'language=ell', '-metadata:s:s:0', 'title=Ελληνικά', '-metadata:s:s:1', 'language=eng',
      '-metadata:s:s:1', 'title=English', '-disposition:s:0', 'default', '-disposition:s:1', '0', '-movflags', '+faststart', tmp], { stdio: 'inherit' });
    if (r.status === 0) fs.renameSync(tmp, out); else console.log('SUBTITLE MUX FAILED (the MP4 has no subtitle tracks)');
  }
  console.log('done', out, ((Date.now() - t0) / 1000).toFixed(0), 's');
  await b.close();
})();
