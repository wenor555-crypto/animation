// Frame QA for an episode page: finds drawing mistakes before a render.
//   node tools/qa.js episode3/episode3.html [outdir] [fps]      exit code 1 if anything is left that isn't in <episode>/qa-allow.json
// It wraps the rig while the page renders every frame (default 8 fps = the old boil rate) and reports:
//   DUP   the same character (or the same body part) drawn twice at almost the same place in one frame (double hands / bodies)
//   HAND  a loose skin-coloured blob drawn next to a character but outside the rig (a hand drawn by the scene on top of the rig's)
//   DOT   a small coloured dot drawn outside the rig on top of a character (stray marks, LEDs, laser dots, sparks)
//   GAP   part of the frame that nothing paints (the canvas is cleared to magenta for the check)
//   NONDET a frame that renders differently depending on what was rendered before it (state leaking between frames)
// Consecutive frames with the same finding are merged into one span; each span gets a crop image for review.
// Intended cases go in <episode folder>/qa-allow.json: [{ "scene": "scene14", "kind": "DOT", "fill": "#ff3030", "t0": 29, "t1": 36, "why": "laser dots on the gang" }]
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const page = path.resolve(process.argv[2]), out = process.argv[3] || 'qa-out', fps = +(process.argv[4] || 8);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e).slice(0, 300)));
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await pg.goto('file://' + page); await pg.waitForTimeout(1200);
  await pg.evaluate(() => {
    const R = typeof RES === 'number' ? RES : 1;
    const skin = new Set(Object.values(CAST).map(c => c.skin.toLowerCase()));
    const nameOf = c => Object.keys(CAST).find(k => CAST[k] === c) || (Object.keys(CAST).find(k => CAST[k].skin === c.skin && CAST[k].hair === c.hair) || '?') + '*';
    const pt = (x, y) => { const m = ctx.getTransform(); return [(m.a * x + m.c * y + m.e) / R, (m.b * x + m.d * y + m.f) / R]; };
    const sc = () => { const m = ctx.getTransform(); return Math.hypot(m.a, m.b) / R; };
    window.QA = { frame: null, depth: 0, seq: 0 }; window.CLEAR_COL = '#ff00ff';
    const sm = document.createElement('canvas'); sm.width = 320; sm.height = 180; QA.small = sm.getContext('2d', { willReadFrequently: true });
    const P = person;
    window.person = function (x, y, s, c, st = {}) {
      const F = QA.frame;
      if (F) {
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
        const [cx, cy] = pt(0, -60), k = sc(), part = st.part || 'all';
        const a = pt(-60, -290), z = pt(60, 10);
        F.people.push({ seq: QA.seq++, who: nameOf(c), part, x: cx, y: cy, k, box: [Math.min(a[0], z[0]), a[1], Math.max(a[0], z[0]), z[1]] });
        ctx.restore();
      }
      QA.depth++; try { return P.apply(this, arguments); } finally { QA.depth--; }
    };
    const B = blob;
    window.blob = function (x, y, rx, ry, fill, o = {}) {
      const F = QA.frame;
      if (F && !QA.depth && typeof fill === 'string' && !o.noqa) {
        const [px, py] = pt(x, y), r = Math.max(Math.abs(rx), Math.abs(ry)) * sc();
        F.blobs.push({ seq: QA.seq++, x: px, y: py, r, fill: fill.toLowerCase(), skin: skin.has(fill.toLowerCase()), glow: !!o.glow });
      }
      return B.apply(this, arguments);
    };
  });
  const scenes = await pg.evaluate(() => EPISODE.scenes.map(s => [s.id, s.off, s.dur]));
  const findings = [];
  for (const [id, off, dur] of scenes) {
    const res = await pg.evaluate(([off, dur, fps]) => {
      const out = [];
      for (let t = 0; t < dur; t += 1 / fps) {
        QA.frame = { people: [], blobs: [] }; FLAP = off + t; renderAt(off + t); const F = QA.frame; QA.frame = null;
        { const g = QA.small; g.drawImage(document.getElementById('c'), 0, 0, 320, 180); const d = g.getImageData(0, 0, 320, 180).data; let n = 0, sx = 0, sy = 0;
          for (let i = 0; i < d.length; i += 4) if (d[i] > 235 && d[i + 1] < 30 && d[i + 2] > 235) { n++; sx += (i / 4) % 320; sy += ((i / 4) / 320) | 0; }
          if (n > 3) out.push({ kind: 'GAP', t, who: '-', what: n + ' px', x: sx / n * 4, y: sy / n * 4 }); }
        const inside = (p, b, m = 0) => b.x > p.box[0] - m && b.x < p.box[2] + m && b.y > p.box[1] - m && b.y < p.box[3] + m;
        // DUP: same character + overlapping part, drawn twice close together
        const cover = p => p.part === 'all' ? ['legs', 'body', 'arms'] : [p.part];
        for (let i = 0; i < F.people.length; i++) for (let j = i + 1; j < F.people.length; j++) {
          const a = F.people[i], c = F.people[j];
          if (a.who !== c.who || Math.hypot(a.x - c.x, a.y - c.y) > 60 * a.k) continue;
          const both = cover(a).filter(p => cover(c).includes(p));
          if (both.length) out.push({ kind: 'DUP', t, who: a.who, what: both.join('+'), x: a.x, y: a.y });
        }
        // HAND / DOT: loose blobs over a character (only visible ones: people who are on screen)
        for (const bl of F.blobs) {
          if (bl.x < -20 || bl.x > 1300 || bl.y < -20 || bl.y > 740) continue;
          const over = F.people.find(p => p.part !== 'legs' && p.seq < bl.seq && inside(p, bl, bl.skin ? 30 : 0));   // drawn ON TOP of the character
          if (!over) continue;
          if (bl.skin && bl.r > 6 && bl.r < 40) out.push({ kind: 'HAND', t, who: over.who, x: bl.x, y: bl.y, fill: bl.fill });
          else if (!bl.skin && bl.r < 14) out.push({ kind: 'DOT', t, who: over.who, x: bl.x, y: bl.y, fill: bl.fill + (bl.glow ? ' glow' : '') });
        }
      }
      return out;
    }, [off, dur, fps]);
    // merge into spans: same kind/who/fill, gaps up to 2 samples
    const spans = [];
    for (const f of res) {
      const key = f.kind + f.who + (f.kind === 'GAP' ? '' : (f.fill || f.what));
      const s = spans.find(s => s.key === key && f.t - s.t1 <= 2.5 / fps && Math.hypot(f.x - s.x, f.y - s.y) < 150);
      if (s) { s.t1 = f.t; s.n++; } else spans.push({ key, kind: f.kind, who: f.who, what: f.what || f.fill, t0: f.t, t1: f.t, x: f.x, y: f.y, n: 1, scene: id });
    }
    for (const s of spans) findings.push(s);
    process.stdout.write(`${id} ${spans.length} spans\n`);
  }
  // determinism: the same frames rendered in order and then shuffled must match
  const nondet = await pg.evaluate(() => {
    const d = EPISODE.dur, ts = Array.from({ length: 24 }, (_, i) => (i + .37) / 24 * d), shot = t => { FLAP = t; renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', .6); };
    const a = ts.map(shot), order = ts.map((_, i) => i).sort((x, y) => Math.sin(x * 91.7) - Math.sin(y * 91.7)), bad = [];
    for (const i of order) if (shot(ts[i]) !== a[i]) { const s = EPISODE.scenes.find(s => ts[i] >= s.off && ts[i] < s.off + s.dur); bad.push({ scene: s.id, t: ts[i] - s.off }); }
    return bad;
  });
  for (const n of nondet) findings.push({ kind: 'NONDET', scene: n.scene, who: '-', what: 'differs when seeked', t0: n.t, t1: n.t, x: 640, y: 360, n: 1 });
  // allow-list
  let allow = []; const dir = path.dirname(page), allowDir = path.basename(dir) === 'dist' ? path.dirname(dir) : dir;   // dist/ pages use the episode's list
  try { allow = JSON.parse(fs.readFileSync(path.join(allowDir, 'qa-allow.json'), 'utf8')); } catch (e) {}
  for (const f of findings) f.allowed = allow.some(a => a.scene === f.scene && (!a.kind || a.kind === f.kind) && (!a.fill || (f.what || '').startsWith(a.fill)) && (!a.who || a.who === f.who) && f.t0 >= (a.t0 ?? 0) && f.t1 <= (a.t1 ?? 1e9));
  // crops for review
  let i = 0;
  for (const s of findings.filter(f => !f.allowed)) {
    const [off] = scenes.find(x => x[0] === s.scene).slice(1);
    const url = await pg.evaluate(([t, x, y]) => {
      renderAt(t); const c = document.getElementById('c'), R = c.width / 1280, o = document.createElement('canvas'); o.width = 320; o.height = 240;
      const g = o.getContext('2d'); g.drawImage(c, (x - 80) * R, (y - 60) * R, 160 * R, 120 * R, 0, 0, 320, 240);
      g.strokeStyle = '#f0f'; g.lineWidth = 2; g.beginPath(); g.arc(160, 120, 20, 0, 7); g.stroke(); return o.toDataURL('image/jpeg', .85);
    }, [off + s.t0, s.x, s.y]);
    s.crop = `${String(++i).padStart(3, '0')}_${s.scene}_${s.kind}.jpg`;
    fs.writeFileSync(path.join(out, s.crop), Buffer.from(url.split(',')[1], 'base64'));
    delete s.key;
  }
  fs.writeFileSync(path.join(out, 'qa.json'), JSON.stringify({ errors: errs, findings }, null, 1));
  const left = findings.filter(f => !f.allowed), by = k => left.filter(f => f.kind === k).length;
  console.log(`QA: ${left.length} open spans (DUP ${by('DUP')}, HAND ${by('HAND')}, DOT ${by('DOT')}, GAP ${by('GAP')}, NONDET ${by('NONDET')}), ${findings.length - left.length} allowed, page errors ${errs.length} -> ${out}/qa.json`);
  await b.close();
  process.exit(left.length || errs.length ? 1 : 0);
})();
