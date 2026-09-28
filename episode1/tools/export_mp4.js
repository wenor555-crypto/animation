// Render dist/episode1.html to an MP4:  node tools/export_mp4.js out.mp4 [fps] [seconds]   (PAGE=episode2.html for another episode)
// Frames come from the page itself (renderAt), the soundtrack from exportAudio() (offline Web Audio).
// Needs: npm i playwright-core, a Chromium (CHROME=path), and ffmpeg (pip install imageio-ffmpeg, or FFMPEG=path).
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
  console.log('done', out, ((Date.now() - t0) / 1000).toFixed(0), 's');
  await b.close();
})();
