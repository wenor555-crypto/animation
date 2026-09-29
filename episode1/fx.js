/* =========================================================
   «Η Έξυπνη Σίτα» – the effects layer (from the Episode 2 remake on)
   Everything here is a pure function of time: a particle's position is computed from its spawn time,
   never simulated frame by frame, so any frame can be rendered alone (the QA's NONDET check stays clean).
   Load after engine.js / characters.js / sets.js.
   World-space helpers draw with the current camera; screen-space ones (flash, impact, foreground) reset it.
   ========================================================= */

const fxr = (i, s = 0) => hash(i * 12.9898 + s * 78.233 + 1.7);

/* ---------- particles ----------
   fxBurst(t, t0, x, y, o): n particles thrown from (x, y) at t0.
   o: n, speed, dir (radians, default up), spread (radians), grav (px/s²), drag, life (s), size, col, seed,
      kind: 'spark' | 'ember' | 'debris' | 'smoke' | 'chip' | 'feather' | 'dust' | 'glass' | 'drop' | 'tile' */
function fxBurst(t, t0, x, y, o = {}) {
  const dt = t - t0, life = o.life || 1;
  if (dt < 0 || dt > life * 1.05) return;
  const n = o.n || 24, sp = o.speed ?? 420, grav = o.grav ?? 900, dir = o.dir ?? -Math.PI / 2, spread = o.spread ?? Math.PI * 2;
  const seed = (o.seed || 0) + Math.floor(t0 * 97), kind = o.kind || 'spark', drag = o.drag ?? 2.2, size = o.size || 1;
  ctx.save();
  if (kind === 'spark' || kind === 'ember') ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const li = life * (.45 + .55 * fxr(i, seed + 2));
    if (dt > li) continue;
    const k = dt / li, a = dir + (fxr(i, seed) - .5) * spread, v = sp * (.3 + .7 * fxr(i, seed + 1));
    const d = (1 - Math.exp(-drag * dt)) / drag;                      // distance with air drag
    const g = kind === 'smoke' ? -grav * .08 : kind === 'feather' ? grav * .05 : grav;
    const px = x + Math.cos(a) * v * d, py = y + Math.sin(a) * v * d + .5 * g * dt * dt;
    const vx = Math.cos(a) * v * Math.exp(-drag * dt), vy = Math.sin(a) * v * Math.exp(-drag * dt) + g * dt;
    const r = fxr(i, seed + 3);
    if (kind === 'spark') {
      const L = .035, w = (2.8 * (1 - k) + .6) * size;
      ctx.strokeStyle = o.col || `rgba(255,${Math.round(230 - 150 * k)},${Math.round(120 - 110 * k)},${1 - k * .6})`;
      ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - vx * L, py - vy * L); ctx.stroke();
    } else if (kind === 'ember') {
      ctx.fillStyle = `rgba(255,${Math.round(180 - 120 * k)},60,${1 - k})`;
      ctx.beginPath(); ctx.arc(px + Math.sin(t * 9 + i) * 4, py, (2.4 - k * 1.6) * size, 0, TAU); ctx.fill();
    } else if (kind === 'smoke') {
      const rr = (18 + 70 * k) * size * (.6 + .8 * r);
      ctx.globalAlpha = (o.alpha ?? .55) * (1 - k) * Math.min(1, dt * 8);
      ctx.fillStyle = o.col || (r > .5 ? '#5a5652' : '#77726c');
      ctx.beginPath(); ctx.arc(px, py, rr, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    } else if (kind === 'dust') {
      ctx.globalAlpha = .6 * (1 - k); ctx.fillStyle = o.col || '#cbb896';
      ctx.beginPath(); ctx.ellipse(px, py, (14 + 50 * k) * size, (8 + 22 * k) * size, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    } else {
      // solid bits that tumble: debris, chips, feathers, glass, drops, tiles
      ctx.save(); ctx.translate(px, py); ctx.rotate((r - .5) * 20 * dt + r * 6);
      const s = size * (.6 + .8 * r);
      if (kind === 'feather') { ctx.rotate(Math.sin(t * 5 + i) * .8); blob(0, 0, 9 * s, 3.5 * s, '#f6f2e8', { lw: 1.4 }); }
      else if (kind === 'chip') { blob(0, 0, 7 * s, 5 * s, '#f2c230', { lw: 1.4 }); }
      else if (kind === 'glass') { ctx.globalAlpha = 1 - k * .5; poly([[-6 * s, 0], [0, -8 * s], [5 * s, 3 * s]], 'rgba(200,235,255,.85)', { lw: 1 }); }
      else if (kind === 'drop') { ctx.globalAlpha = 1 - k; blob(0, 0, 3.5 * s, 5 * s, o.col || '#e8b43a', { lw: 0 }); }
      else if (kind === 'tile') { poly([[-9 * s, -5 * s], [9 * s, -5 * s], [7 * s, 5 * s], [-7 * s, 5 * s]], '#c4643c', { lw: 1.6 }); }
      else { const c = o.cols ? o.cols[i % o.cols.length] : o.col || '#4a4a52'; poly([[-7 * s, -4 * s], [6 * s, -6 * s], [8 * s, 5 * s], [-5 * s, 6 * s]], c, { lw: 1.6 }); }
      ctx.restore();
    }
  }
  ctx.restore();
}
/* a steady stream: a small burst every `every` seconds between t0 and t1 */
function fxEmit(t, t0, t1, every, x, y, o = {}) {
  const life = o.life || 1;
  const first = Math.max(0, Math.floor((t - life - t0) / every)), last = Math.floor((Math.min(t, t1) - t0) / every);
  for (let j = first; j <= last; j++) {
    const ts = t0 + j * every;
    const px = typeof x === 'function' ? x(ts) : x, py = typeof y === 'function' ? y(ts) : y;
    fxBurst(t, ts, px, py, { ...o, seed: (o.seed || 0) + j * 7 });
  }
}

/* ---------- explosion: flash, fireball, shock ring, sparks, debris, smoke column. s = size ---------- */
function fxExplosion(t, t0, x, y, s = 1, o = {}) {
  const dt = t - t0; if (dt < 0 || dt > 3.2) return;
  fxBurst(t, t0 + .05, x, y - 20 * s, { kind: 'smoke', n: 16, speed: 160 * s, grav: 400, life: 3, size: 1.4 * s, seed: 3 });
  fxBurst(t, t0, x, y, { kind: 'debris', n: o.debrisN ?? 18, speed: 700 * s, spread: Math.PI * 1.1, grav: 1400, life: 1.6, size: 1.2 * s, cols: o.cols, seed: 5 });
  // fireball
  if (dt < 1.1) {
    // the fireball: dark smoky rim, orange body, a hot yellow-white core that shrinks (normal blending, so it keeps its colour on light sets)
    const k = dt / 1.1;
    ctx.save();
    for (const [layer, col, rs, al] of [[0, '#3a2a24', 1.15, .8], [1, '#e8502a', 1, .95], [2, '#ffa23a', .75, 1], [3, '#fff0a0', .45, 1]]) {
      if (layer === 3 && k > .35) continue;
      if (layer === 2 && k > .7) continue;
      ctx.globalAlpha = al * (1 - k * (layer ? 1 : .6));
      ctx.fillStyle = col; ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * TAU + fxr(i, 9), r = (38 + 34 * fxr(i, 4)) * s * (.35 + k * 1.1) * rs, d = 44 * s * Math.sqrt(k) * rs;
        const cx = x + Math.cos(a) * d, cy = y - 20 * s + Math.sin(a) * d * .7 - k * 50 * s;
        ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, TAU);
      }
      ctx.fill();
    }
    ctx.restore();
  }
  fxRing(t, t0, x, y, 260 * s, .45);
  fxBurst(t, t0, x, y, { kind: 'spark', n: 40, speed: 1100 * s, grav: 1200, life: .9, size: 1.2, seed: 7 });
  fxBurst(t, t0 + .1, x, y - 30 * s, { kind: 'ember', n: 26, speed: 300 * s, grav: -80, life: 2.2, seed: 8 });
  if (dt < .06) glow(x, y, 220 * s, 'rgba(255,240,200,1)', .8 * (1 - dt / .06));
  glow(x, y - 20 * s, 260 * s, 'rgba(255,140,40,1)', .7 * Math.max(0, 1 - dt / 1.2));
}
/* the expanding shock ring */
function fxRing(t, t0, x, y, R = 240, dur = .45, col = '255,255,255') {
  const k = (t - t0) / dur; if (k < 0 || k > 1) return;
  const e = 1 - (1 - k) * (1 - k);
  ctx.save(); ctx.strokeStyle = `rgba(${col},${(1 - k) * .8})`; ctx.lineWidth = 14 * (1 - k) + 1;
  ctx.beginPath(); ctx.ellipse(x, y, R * e, R * e * .55, 0, 0, TAU); ctx.stroke(); ctx.restore();
}
/* how bright the frame should flash for a list of hits [[t0, strength]] (use with fxFlash) */
function fxHitLight(t, hits) { let a = 0; for (const [t0, s] of hits) { const d = t - t0; if (d >= 0 && d < .35) a = Math.max(a, s * (1 - d / .35) ** 2); } return a; }
function fxFlash(a, col = '255,244,220') {
  if (a <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${col},${Math.min(1, a) * .55})`; ctx.fillRect(0, 0, W, H); ctx.restore();
}

/* ---------- laser: glow layers, white core, flicker; sparks and smoke where it lands ---------- */
function fxBeam(x1, y1, x2, y2, t, o = {}) {
  const w = o.width || 1, fl = .85 + .15 * Math.sin(t * 90) * Math.sin(t * 37);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [lw, a, col] of [[44, .12, '255,40,40'], [22, .28, '255,60,50'], [9, .7, '255,90,80'], [3.5, 1, '255,245,240']]) {
    ctx.strokeStyle = `rgba(${col},${a * fl})`; ctx.lineWidth = lw * w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  ctx.restore();
  glow(x1, y1, 60 * w, 'rgba(255,60,60,1)', .8);
  if (o.hit !== false) {
    glow(x2, y2, 90 * w, 'rgba(255,120,60,1)', .8);
    const tt = Math.floor(t * 30) / 30;
    fxBurst(t, tt, x2, y2, { kind: 'spark', n: 10, speed: 520, spread: Math.PI * 1.2, grav: 1400, life: .4, seed: 31 });
    fxBurst(t, tt - 1 / 30, x2, y2, { kind: 'spark', n: 10, speed: 520, spread: Math.PI * 1.2, grav: 1400, life: .4, seed: 32 });
  }
}
/* the charge-up before a shot: particles converging on (x, y), a growing core, a lens flare. k 0..1 */
function fxCharge(t, x, y, k, col = '255,60,60') {
  if (k <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 40; i++) {
    const p = (t * 1.6 + fxr(i, 2)) % 1, a = fxr(i, 1) * TAU, r = (1 - p) * 220 * (.5 + fxr(i, 3));
    ctx.strokeStyle = `rgba(${col},${p * k})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.lineTo(x + Math.cos(a) * (r + 22), y + Math.sin(a) * (r + 22)); ctx.stroke();
  }
  ctx.restore();
  glow(x, y, 30 + 120 * k, `rgba(${col},1)`, .5 + .5 * k);
  fxFlare(x, y, k);
}
/* anamorphic lens flare: a horizontal streak and a few ghosts */
function fxFlare(x, y, a = 1, col = '255,120,110') {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(x - 500, y, x + 500, y); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(.5, `rgba(255,230,230,${.7 * a})`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.fillRect(x - 500, y - 3 * a, 1000, 6 * a);
  for (const [d, r, al] of [[-.6, 30, .15], [-1.1, 14, .2], [.5, 22, .12]]) { ctx.fillStyle = `rgba(${col},${al * a})`; ctx.beginPath(); ctx.arc(x + d * (x - 640), y + d * (y - 360), r, 0, TAU); ctx.fill(); }
  ctx.restore();
}
/* a burn mark that stays: pts along the path the beam swept, up to fraction k */
function fxScorch(pts, k = 1, o = {}) {
  const n = Math.floor(pts.length * clamp(k)); if (n < 2) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [lw, col] of [[o.w || 26, 'rgba(30,20,15,.35)'], [(o.w || 26) * .45, 'rgba(20,12,8,.7)']]) {
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); pts.slice(0, n).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
  }
  // the freshest part still glows
  const [hx, hy] = pts[n - 1]; if (o.hot !== false && k < 1) glow(hx, hy, 50, 'rgba(255,120,40,1)', .6);
  ctx.restore();
}

/* ---------- electricity and magnetism ---------- */
function fxArc(x1, y1, x2, y2, t, o = {}) {
  const seg = 10, j = o.jag || 26, tick = Math.floor(t * 24);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round';
  for (const [lw, a] of [[10, .25], [4, .6], [1.6, 1]]) {
    ctx.strokeStyle = `rgba(${o.col || '140,200,255'},${a})`; ctx.lineWidth = lw; ctx.beginPath();
    for (let i = 0; i <= seg; i++) {
      const k = i / seg, off = (i === 0 || i === seg) ? 0 : (fxr(i, tick + (o.seed || 0)) - .5) * j * 2;
      const px = lerp(x1, x2, k) + off * (y2 - y1) / Math.hypot(x2 - x1, y2 - y1 || 1), py = lerp(y1, y2, k) - off * (x2 - x1) / Math.hypot(x2 - x1, y2 - y1 || 1);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
  glow(x2, y2, 50, `rgba(${o.col || '140,200,255'},1)`, .7);
}
/* magnetic field: arcs rippling from (x, y) toward angle `dir` */
function fxMagField(x, y, t, dir = 0, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(dir); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 5; i++) {
    const p = (t * 1.8 + i / 5) % 1, r = 30 + p * 320;
    ctx.strokeStyle = `rgba(150,110,255,${(1 - p) * .7 * k})`; ctx.lineWidth = 5 * (1 - p) + 1;
    ctx.beginPath(); ctx.arc(0, 0, r, -.5, .5); ctx.stroke();
  }
  ctx.restore();
}

/* ---------- fire (better than the old flame): tongues, embers, smoke ---------- */
function fxFire(x, y, s, t, a = 1) {
  if (a <= 0) return;
  fxEmit(t, 0, 1e9, .12, x, y - 30 * s, { kind: 'smoke', n: 2, speed: 40, grav: 500, life: 2.2, size: .8 * s, alpha: .35 * a, spread: .6 });
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < 6; i++) {
    const ph = t * (6 + i) + i * 1.7, h = (60 + 30 * Math.sin(ph)) * s * (1 - i * .1), dx = (i - 2.5) * 10 * s;
    const cols = ['#e8392b', '#ff6a2a', '#ffa23a', '#ffd06a', '#fff2b0', '#ff8a3a'];
    poly([[x + dx - 16 * s, y], [x + dx - 6 * s + Math.sin(ph) * 6, y - h * .5], [x + dx + Math.sin(ph * 1.3) * 10 * s, y - h], [x + dx + 8 * s, y - h * .45], [x + dx + 16 * s, y]], cols[i], { lw: 0 });
  }
  ctx.restore();
  fxEmit(t, 0, 1e9, .2, x, y - 40 * s, { kind: 'ember', n: 2, speed: 90, grav: -160, life: 1.4, spread: 1 });
  glow(x, y - 40 * s, 160 * s, 'rgba(255,140,40,1)', .55 * a);
}

/* ---------- camera ----------
   fxShake(t, hits): hits = [[t0, amplitude px, duration s], ...] → [dx, dy, rot] (a smooth, decaying wobble; trauma²) */
function fxShake(t, hits) {
  let tr = 0;
  for (const [t0, amp, dur = .5] of hits) { const d = t - t0; if (d >= 0 && d < dur) tr = Math.max(tr, amp * (1 - d / dur) ** 2); }
  if (!tr) return [0, 0, 0];
  const n = (f, p) => Math.sin(t * f + p) * .6 + Math.sin(t * f * 2.3 + p * 2) * .4;
  return [tr * n(53, 1), tr * n(47, 4), tr * .0015 * n(31, 7)];
}
/* the camera with the shake applied: c = [x, y, zoom] */
function fxCam(c, t, hits) { const [dx, dy, r] = fxShake(t, hits); return [c[0] - dx / c[2], c[1] - dy / c[2], c[2], r]; }
function applyCamFx(c) { ctx.translate(W / 2, H / 2); if (c[3]) ctx.rotate(c[3]); ctx.scale(c[2], c[2]); ctx.translate(-c[0], -c[1]); }
/* a crash zoom between two cameras over [a, b] (fast in, slow out) */
function fxCrash(t, a, b, c1, c2) { const k = clamp((t - a) / (b - a)); const e = 1 - Math.pow(1 - k, 4); return [lerp(c1[0], c2[0], e), lerp(c1[1], c2[1], e), lerp(c1[2], c2[2], e)]; }

/* ---------- time: hit-stop and slow motion (animation time only; the sound keeps real time) ----------
   ops: [{ a, b, rate }]: between a and b the picture runs at `rate` (0 = freeze), then catches up over `catch` s */
function fxTime(t, ops) {
  let off = 0;
  for (const o of ops) {
    const c = o.catch ?? .25, lost = (o.b - o.a) * (1 - o.rate);
    if (t <= o.a) continue;
    if (t < o.b) { off += (t - o.a) * (1 - o.rate); continue; }
    if (t < o.b + c) { off += lost * (1 - (t - o.b) / c); continue; }
  }
  return t - off;
}

/* ---------- manga beats ---------- */
/* impact frame: 2–3 frames of inverted ink with radial lines, at t0 */
function fxImpact(t, t0, x = 640, y = 360, dur = .1) {
  const d = t - t0; if (d < 0 || d > dur) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = d < dur / 2 ? '#000' : '#fff';
  for (let i = 0; i < 70; i++) { const a = fxr(i, 5) * TAU, r0 = 60 + fxr(i, 6) * 160; ctx.lineWidth = 1 + fxr(i, 7) * 7; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * 1600, y + Math.sin(a) * 1600); ctx.stroke(); }
  ctx.restore();
}
/* motion smear behind something fast (world space) */
function fxSmear(x, y, vx, vy, w = 30, col = '255,255,255') {
  const g = ctx.createLinearGradient(x, y, x - vx, y - vy); g.addColorStop(0, `rgba(${col},.55)`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.save(); ctx.strokeStyle = g; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - vx, y - vy); ctx.stroke(); ctx.restore();
}
/* letterbox bars for the big moments (k 0..1) */
function fxLetterbox(k) { if (k <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; const h = 72 * k; ctx.fillRect(0, 0, W, h); ctx.fillRect(0, H - h, W, h); ctx.restore(); }

/* ---------- depth ---------- */
/* out-of-focus foreground (screen space): fig leaves or grass across a corner. side: 'left' | 'right' | 'bottom' */
function fxForeground(t, side = 'left', o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${o.blur ?? 7}px)`;
  const sway = Math.sin(t * 1.3) * 8;
  if (o.kind === 'grass') {
    for (let i = 0; i < 26; i++) { const x = (side === 'right' ? 900 : 0) + i * 15 + fxr(i) * 10, h = 90 + fxr(i, 2) * 110; ctx.strokeStyle = i % 3 ? '#3e5a26' : '#56742e'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, H + 10); ctx.quadraticCurveTo(x + sway, H - h * .6, x + sway * 2 + 10, H - h); ctx.stroke(); }
  } else {
    const bx = side === 'right' ? W + 40 : -40, by = side === 'bottom' ? H + 40 : -30, dir = side === 'right' ? -1 : 1;
    for (let i = 0; i < 9; i++) {
      const lx = bx + dir * (40 + fxr(i) * 240) + sway, ly = by + (side === 'bottom' ? -1 : 1) * (30 + fxr(i, 3) * 200);
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(fxr(i, 4) * 3); ctx.fillStyle = i % 2 ? '#2f4a22' : '#3d5e2a';
      ctx.beginPath(); ctx.ellipse(0, 0, 70, 38, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
  }
  ctx.filter = 'none'; ctx.restore();
}
/* god rays from a light source (screen space) */
function fxRays(x, y, t, a = .25, col = '255,230,170') {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) {
    const ang = .3 + i * .18 + Math.sin(t * .4 + i) * .03, L = 1400, w = .05 + fxr(i) * .05;
    const g = ctx.createLinearGradient(x, y, x + Math.cos(ang) * L, y + Math.sin(ang) * L); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang - w) * L, y + Math.sin(ang - w) * L); ctx.lineTo(x + Math.cos(ang + w) * L, y + Math.sin(ang + w) * L); ctx.fill();
  }
  ctx.restore();
}
/* heat haze / atmosphere: a warm gradient wash (screen space) */
function fxGrade(top, bottom, a = .25, mode = 'soft-light') {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = mode; ctx.globalAlpha = a;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bottom); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}

/* ---------- sound design ---------- */
const FXS = {
  boom: (s = 1) => { tone(70, .9 * s, 'sine', .22, .35); noise(.8 * s, .5, 600, .7, 'lowpass'); noise(.25, .3, 3000, .6, 'highpass'); },
  hit: () => { tone(140, .18, 'square', .1, .4); noise(.12, .35, 1800, 1, 'bandpass'); },
  clang: () => { for (const f of [620, 930, 1370, 2010]) tone(f, 1.1, 'triangle', .05, .98); noise(.08, .35, 4000, 1, 'highpass'); },
  zap: () => { for (let i = 0; i < 5; i++) tone(900 + i * 300, .06, 'sawtooth', .05, 1.6, i * .03); noise(.25, .15, 5000, 2, 'bandpass'); },
  laser: (d = 1) => { tone(420, d, 'sawtooth', .05, 1.02); tone(843, d, 'square', .025, .99); noise(d, .06, 2500, 3, 'bandpass'); },
  charge: (d = 1) => { tone(200, d, 'sawtooth', .05, 6); tone(400, d, 'sine', .04, 5); },
  whoosh: () => noise(.45, .35, 1200, .8, 'bandpass'),
  arrow: () => { noise(.25, .25, 3500, 4, 'bandpass'); tone(1800, .12, 'sine', .03, .5); },
  thud: () => { tone(90, .3, 'sine', .2, .5); noise(.15, .25, 400, .7, 'lowpass'); },
  crash: () => { noise(.7, .45, 1500, .5, 'lowpass'); for (let i = 0; i < 6; i++) tone(300 + i * 170, .15, 'square', .03, .6, i * .05); },
  riser: (d = 2) => { tone(110, d, 'sawtooth', .04, 4); noise(d, .08, 800, .7, 'bandpass'); },
};
/* the battle score: taiko-ish drums + a bass ostinato + hats, scheduled from one event. bpm, bars (4/4), intensity 0..1 */
function fxScore(bars = 8, bpm = 132, k = 1, delay = 0) {
  const b = 60 / bpm, bass = [55, 55, 65.4, 55, 73.4, 65.4, 55, 49];
  for (let i = 0; i < bars * 4; i++) {
    const at = delay + i * b;
    tone(60, .35, 'sine', .22 * k, .45, at);                          // kick on every beat
    if (i % 2) noise(.18, .22 * k, 1600, .8, 'bandpass', at);           // snare-ish on 2 and 4
    noise(.05, .06 * k, 8000, .7, 'highpass', at + b / 2);              // hats on the off-beats
    if (i % 4 === 3) tone(90, .5, 'triangle', .12 * k, .5, at + b * .75);  // a taiko flam into the bar
    tone(bass[(i >> 1) % bass.length], b * .9, 'sawtooth', .045 * k, 1, at);
  }
}
