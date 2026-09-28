// Contact sheets for review before a render:  PAGE=file:///…/episode3/episode3.html node tools/sheets.js OUTDIR [scene03,scene07] [frames=12]
// One JPEG per scene (frames spread over the scene, local time on each), plus a sweep for page errors.
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async () => {
  const out = process.argv[2], only = process.argv[3] ? process.argv[3].split(',') : null, n = +(process.argv[4] || 12);
  const page = process.env.PAGE || 'file:///home/user/animation/episode2/episode2.html';
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e.stack || e).slice(0, 400)));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 200)); });
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await pg.goto(page); await pg.waitForTimeout(1500);
  const list = await pg.evaluate(() => EPISODE.scenes.map(s => [s.id, s.off, s.dur, s.lines.length]));
  console.log('total', (await pg.evaluate(() => EPISODE.dur)).toFixed(1), 's');
  for (const [id, off, dur, nl] of list) {
    console.log(id, dur.toFixed(1), 's', nl, 'lines');
    if (only && !only.includes(id)) continue;
    const url = await pg.evaluate(([off, dur, n]) => {
      const cols = 4, rows = Math.ceil(n / cols), tw = 320, th = 180, o = document.createElement('canvas'); o.width = cols * tw; o.height = rows * th;
      const g = o.getContext('2d'); g.font = '16px sans-serif';
      for (let i = 0; i < n; i++) { const t = off + (i + .5) / n * dur; renderAt(t); g.drawImage(document.getElementById('c'), (i % cols) * tw, Math.floor(i / cols) * th, tw, th); g.fillStyle = '#ff0'; g.fillText((t - off).toFixed(1), (i % cols) * tw + 4, Math.floor(i / cols) * th + 16); }
      return o.toDataURL('image/jpeg', .8);
    }, [off, dur, n]);
    fs.writeFileSync(`${out}/${id}.jpg`, Buffer.from(url.split(',')[1], 'base64'));
    for (let t = off; t < off + dur; t += .25) await pg.evaluate(t => renderAt(t), t);
  }
  console.log('pageerrors:', errs.length, [...new Set(errs)].slice(0, 8).join('\n'));
  await b.close();
})();
