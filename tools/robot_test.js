/* Robot tests (graphics v2, docs/production-guide.md): a structured robot must hold together in every pose and view.
   node tools/robot_test.js lab/dist/episode-robot.html OUTDIR [MODEL=T800] [N=240]
   1. attachment: N random poses × random views; the robot's silhouette must be ONE connected shape
      (a part that floats loose makes a second island). Failures are saved as images.
   2. silhouettes: the named poses in 3 views, as black shapes on white (a sheet image to read by eye), plus checks:
      the punch hand reaches clearly outside the torso; the crouch is markedly lower than idle.
   3. walk: no foot sliding. Over a cycle, the planted foot (the lowest) must move backwards at a steady speed relative
      to the pelvis; the residual (skate) must stay under 2.5 px at the lab scale. Prints the walk speed to use in scenes. */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [page, out, MODEL = 'T800', N = '240'] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await pg.goto('file://' + path.resolve(page), { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof R3 !== 'undefined' && window.EPISODE, null, { timeout: 60000 });
  const res = await pg.evaluate(([MODEL, N]) => {
    const M = eval(MODEL), cvs = document.getElementById('c'), c2 = cvs.getContext('2d');
    let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const R = (a, b) => a + (b - a) * rnd();
    const S = .6, X = 640, GROUND = 640;
    function drawAlone(o) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
      const base = { x: X, y: 0, s: S, pitch: .14, ...o }; const low = R3.lowestY(M, base);
      R3.draw(M, { ...base, y: GROUND - low });
      return { ...base, y: GROUND - low };
    }
    function mask(step = 2) {
      const w = cvs.width, h = cvs.height, d = c2.getImageData(0, 0, w, h).data, mw = Math.floor(w / step), mh = Math.floor(h / step), m = new Uint8Array(mw * mh);
      for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) m[y * mw + x] = d[((y * step) * w + x * step) * 4 + 3] > 40 ? 1 : 0;
      return { m, mw, mh };
    }
    function islands({ m, mw, mh }) {
      const lab = new Int32Array(mw * mh), sizes = []; let id = 0; const st = [];
      for (let i = 0; i < m.length; i++) {
        if (!m[i] || lab[i]) continue;
        id++; let n = 0; st.push(i); lab[i] = id;
        while (st.length) { const j = st.pop(); n++; const x = j % mw, y = (j / mw) | 0;
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= mw || yy >= mh) continue; const k = yy * mw + xx; if (m[k] && !lab[k]) { lab[k] = id; st.push(k); } } }
        sizes.push(n);
      }
      return sizes.filter(n => n > 12);   // ignore specks (glints, anti-aliasing)
    }
    function randomPose() {
      const p = {};
      p.chest = [R(-.35, .5), R(-.6, .6), R(-.15, .15)]; p.head = [R(-.4, .4), R(-1, 1), 0]; p.waist = [R(-.2, .2), R(-.3, .3), 0];
      for (const [s, x] of [['l', -1], ['r', 1]]) {
        p[s + 'Sh'] = [R(-2, 1), R(-.4, .4), x * R(.05, 1.3)]; p[s + 'Elb'] = [R(-2.2, 0), 0, 0]; p[s + 'Jaw'] = [R(-1.1, 0), 0, 0];
        p[s + 'Hip'] = [R(-1.5, .7), 0, x * R(0, .35)]; p[s + 'Knee'] = [R(0, 2.3), 0, 0]; p[s + 'Ank'] = [R(-.9, .9), 0, 0];
      }
      return p;
    }
    const out = { attach: { n: 0, fail: [] }, sil: {}, walk: {} };
    // 1. attachment
    for (let i = 0; i < N; i++) {
      const pose = randomPose(), yaw = R(-Math.PI, Math.PI);
      drawAlone({ pose, yaw, t: i * .1 });
      const isl = islands(mask());
      out.attach.n++;
      if (isl.length !== 1) out.attach.fail.push({ i, yaw: +yaw.toFixed(2), islands: isl, img: cvs.toDataURL('image/png'), pose });
    }
    out.attach.fail = out.attach.fail.slice(0, 6).concat(out.attach.fail.length > 6 ? [{ more: out.attach.fail.length - 6 }] : []);
    // 2. silhouettes: a sheet of black shapes
    const names = ['idle', 'crouch', 'guard', 'punch', 'hit', 'scan'], yaws = [0, -.75, -Math.PI / 2];
    const sheet = document.createElement('canvas'); sheet.width = 6 * 300; sheet.height = 3 * 420; const sx = sheet.getContext('2d');
    sx.fillStyle = '#fff'; sx.fillRect(0, 0, sheet.width, sheet.height);
    const heights = {};
    names.forEach((n, i) => yaws.forEach((yaw, j) => {
      drawAlone({ pose: M.P[n], yaw });
      const d = c2.getImageData(0, 0, cvs.width, cvs.height); let top = 1e9;
      for (let y = 0; y < cvs.height; y += 2) { for (let x = 0; x < cvs.width; x += 2) if (d.data[(y * cvs.width + x) * 4 + 3] > 40) { top = Math.min(top, y); break; } if (top < 1e9) break; }
      if (j === 0) heights[n] = GROUND * 1.5 - top;
      const tmp = document.createElement('canvas'); tmp.width = cvs.width; tmp.height = cvs.height; const tx = tmp.getContext('2d');
      tx.drawImage(cvs, 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = '#000'; tx.fillRect(0, 0, tmp.width, tmp.height);
      sx.drawImage(tmp, 960 - 450, 300, 900, 750, i * 300, j * 420, 300, 250 * 420 / 250 * .6);
    }));
    out.sil.sheet = sheet.toDataURL('image/png');
    out.sil.crouchRatio = +(heights.crouch / heights.idle).toFixed(2);
    { const o = { x: X, y: 400, s: S, pitch: .14, yaw: -.75, pose: M.P.punch }, W8 = R3.solve(M, o.pose, o);
      const hand = R3.point(M, o, 'rWr', [0, -24, 0]), chestL = R3.point(M, o, 'chest', [-79, 64, 0]), chestR = R3.point(M, o, 'chest', [79, 64, 0]);
      const lo = Math.min(chestL[0], chestR[0]), hi = Math.max(chestL[0], chestR[0]);
      out.sil.punchReach = +Math.max(lo - hand[0], hand[0] - hi).toFixed(1); }
    // 3. walk: foot sliding
    if (M.walk) {
      const o = { x: X, y: 400, s: S, pitch: 0, yaw: -Math.PI / 2 }, samples = [];
      for (let k = 0; k < 240; k++) {
        const ph = k / 240 * Math.PI * 2, pose = M.walk(ph), oo = { ...o, pose };
        const fl = R3.point(M, oo, 'lAnk', [0, -28, 10]), fr = R3.point(M, oo, 'rAnk', [0, -28, 10]);
        const planted = fl[1] >= fr[1] ? fl : fr, pel = R3.point(M, oo, 'pelvis');
        samples.push({ ph, x: planted[0] - pel[0], y: planted[1], side: fl[1] >= fr[1] ? 'l' : 'r' });
      }
      // speed: fit the planted foot's x against phase within stance runs (ignoring the switch frames)
      let num = 0, den = 0, run = [];
      const runs = []; for (let i = 0; i < samples.length; i++) { if (i && samples[i].side !== samples[i - 1].side) { runs.push(run); run = []; } run.push(samples[i]); } runs.push(run);
      for (const r of runs) { const core = r.slice(3, -3); if (core.length < 6) continue; const mx = core.reduce((a, s) => a + s.ph, 0) / core.length, my = core.reduce((a, s) => a + s.x, 0) / core.length; for (const s of core) { num += (s.ph - mx) * (s.x - my); den += (s.ph - mx) ** 2; } }
      const slope = num / den; let worst = 0;
      for (const r of runs) { const core = r.slice(3, -3); if (core.length < 6) continue; const x0 = core[0].x - slope * core[0].ph; for (const s of core) worst = Math.max(worst, Math.abs(s.x - (x0 + slope * s.ph))); }
      out.walk = { pxPerRadian: +(-slope).toFixed(2), unitsPerRadian: +(-slope / S).toFixed(2), skatePx: +worst.toFixed(2) };
    }
    return out;
  }, [MODEL, +N]);
  for (const [i, f] of res.attach.fail.entries()) if (f.img) { fs.writeFileSync(path.join(out, `attach_fail_${i}.png`), Buffer.from(f.img.split(',')[1], 'base64')); delete f.img; }
  fs.writeFileSync(path.join(out, 'silhouettes.png'), Buffer.from(res.sil.sheet.split(',')[1], 'base64')); delete res.sil.sheet;
  const ok = { attach: res.attach.fail.length === 0, crouch: res.sil.crouchRatio < .8, punch: res.sil.punchReach > 20, walk: !res.walk.skatePx || res.walk.skatePx < 2.5 };
  console.log(JSON.stringify({ ...res, ok, errors: errs.slice(0, 3) }, null, 1));
  if (Object.values(ok).some(v => !v) || errs.length) process.exitCode = 1;
  await b.close();
})();
