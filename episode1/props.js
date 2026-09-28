/* =========================================================
   «Η Έξυπνη Σίτα» – props & the σίτα rig
   ========================================================= */

/* ---------- THE ΣΙΤΑ ----------
   Two black mesh panels with a magnetic seam = its mouth (9 magnet pairs = teeth).
   After the upgrade a green chip is taped to the seam; its LED is the σίτα's single eye.
   st: { t, talk 0..1, open 0..1 (extra mouth), led 'off'|'green'|'red', mood 'happy'|'evil'|'sad'|'shock',
         flapL/flapR 0..1 (bottom corners lift like hands), sway, chip, burn 0..1, smoke 0..1,
         x, top, w, h (default: the yard door), frame (draw its own door frame), part 'L'|'R' }  */
function sita(st = {}) {
  const cx = st.x ?? DOOR.x, top = st.top ?? DOOR.top, w = st.w ?? DOOR.w, h = st.h ?? DOOR.h, t = st.t || 0;
  const bottom = top + h, m0 = top + h * .40, m1 = top + h * .80;
  const open = clamp((st.talk || 0) * .9 + (st.open || 0));
  const pass = clamp(st.pass || 0);
  const gap = y => ((y > m0 && y < m1) ? open * w * .30 * Math.sin(Math.PI * (y - m0) / (m1 - m0)) : 0) + pass * w * .44 * (.55 + .45 * (y - top) / h);
  const sway = y => (st.sway || 0) * Math.pow((y - top) / h, 1.6) * 14;
  if (st.frame) { rect(cx - w / 2 - 12, top - 12, w + 24, h + 12, '#3f74a6', { lw: 4, w: .4 }); rect(cx - w / 2, top, w, h, st.inside || '#2a2420', { lw: 3, w: .4 }); }
  // inside of the mouth
  if (open > .02) blob(cx + sway((m0 + m1) / 2), (m0 + m1) / 2, w * .30 * open + 2, (m1 - m0) / 2, '#120c10', { lw: 0, w: .5 });
  const N = 16;
  for (const side of [-1, 1]) {
    if (st.part && st.part !== (side < 0 ? 'L' : 'R')) continue;
    const flap = side < 0 ? (st.flapL || 0) : (st.flapR || 0), outer = cx + side * w / 2;
    const P = [[outer + sway(top), top]];
    for (let i = 0; i <= N; i++) { const y = top + h * i / N; P.push([cx + side * (1.5 + gap(y)) + sway(y), y]); }
    P.push([outer - side * flap * 26 + sway(bottom), bottom - flap * 80]);
    P.push([outer + sway(bottom - 100), bottom - 100]);
    // mesh body
    ctx.save(); ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
    ctx.fillStyle = 'rgba(24,24,28,.84)'; ctx.fill(); ctx.clip();
    ctx.strokeStyle = 'rgba(150,150,160,.28)'; ctx.lineWidth = 1;
    for (let y = top; y < bottom; y += 5) { ctx.beginPath(); ctx.moveTo(cx - w, y); ctx.lineTo(cx + w, y + 2); ctx.stroke(); }
    for (let x = cx - w; x < cx + w; x += 5) { ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x + 3, bottom); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 3;
    for (let k = 1; k <= 3; k++) { const x = cx + side * w / 2 * k / 4; ctx.beginPath(); ctx.moveTo(x + sway(top), top); ctx.lineTo(x + sway(bottom), bottom); ctx.stroke(); }
    ctx.restore();
    poly(P, null, { lw: 5, sc: '#0c0c0e', w: .5 });
    // magnets along the seam (teeth)
    for (let i = 0; i < 9; i++) {
      const y = top + 16 + i * (h - 32) / 8, x = cx + side * (1.5 + gap(y)) + sway(y);
      rect(x + (side < 0 ? -9 : 1), y - 5, 8, 10, '#c9ccd2', { lw: 2, w: .2 });
    }
  }
  // burn hole
  if (st.burn) {
    const by = top + h * .6, r = 26 * st.burn;
    blob(cx - 18 + sway(by), by, r, r * .8, '#0a0a0a', { lw: 3, sc: '#ff7a2a', w: 2.5, glow: st.smoke ? '#ff6a2a' : null, gb: 10 });
    blob(cx - 18 + sway(by), by, r * .6, r * .5, '#2a2420', { lw: 0, w: 2 });
  }
  if (st.smoke) for (let i = 0; i < 7; i++) { const p = (t * .35 + i / 7) % 1; blob(cx - 10 + Math.sin(p * 7 + i) * 18, top + h * .6 - p * 220, 8 + p * 26, 8 + p * 22, `rgba(120,120,125,${.45 * (1 - p) * st.smoke})`, { lw: 0 }); }
  // chip + LED eye
  if (st.chip || st.led) {
    const ey = top + h * .2 + (st.eyeY || 0), sx = sway(ey) - (pass > .05 ? gap(ey) + 16 : 0);
    rect(cx - 14 + sx, ey - 12, 28, 24, '#2f8a4a', { lw: 2.5, w: .3 });
    rect(cx - 20 + sx, ey - 4, 40, 9, 'rgba(60,60,66,.9)', { lw: 1.5, w: .4 });           // μονωτική ταινία
    for (let i = 0; i < 4; i++) curve([[cx - 12 + i * 7 + sx, ey + 12], [cx - 12 + i * 7 + sx, ey + 17]], 1.5, '#d8c060', { w: .1 });
    // the 5 mW laser diode Γιάννος taped next to the chip
    rect(cx + 15 + sx, ey + 2, 9, 7, '#2a2a30', { lw: 1.5, w: .1 }); blob(cx + 24 + sx, ey + 5.5, 2, 2, st.laser ? '#ff3030' : '#7a2a2a', { lw: 0, glow: st.laser ? '#ff2020' : null, gb: 10 });
    const led = st.led || 'off', col = led === 'red' ? '#ff2a2a' : led === 'green' ? '#44ff7a' : '#335';
    const on = led !== 'off' && !(st.flicker && Math.sin(t * 40) > .2);
    blob(cx + sx, ey - 1, 7, 7, on ? col : '#2a2a33', { lw: 2.5, glow: on ? col : null, gb: 22 });
    if (on) blob(cx - 2 + sx, ey - 3, 2, 2, 'rgba(255,255,255,.8)', { lw: 0 });
    // "brow" made of tape: gives the σίτα an expression
    const mood = st.mood || 'happy', b = { happy: [-4, -4, 0], evil: [4, -6, 1], sad: [-6, 4, 0], shock: [-8, -8, 0] }[mood];
    curve([[cx - 16 + sx, ey - 16 + b[0]], [cx - 3 + sx, ey - 14 + b[1] + (b[2] ? 6 : 0)]], 4, '#9aa0a8', { w: .2 });
    curve([[cx + 3 + sx, ey - 14 + b[1] + (b[2] ? 6 : 0)], [cx + 16 + sx, ey - 16 + b[0]]], 4, '#9aa0a8', { w: .2 });
  }
}
/* glow pass for the LED, to draw AFTER applyLight so it pops at night */
function sitaGlow(st = {}, a = .7) {
  if (!st.led || st.led === 'off') return;
  const cx = st.x ?? DOOR.x, top = st.top ?? DOOR.top, h = st.h ?? DOOR.h, ey = top + h * .2 + (st.eyeY || 0);
  const on = !(st.flicker && Math.sin((st.t || 0) * 40) > .2); if (!on) return;
  glow(cx, ey - 1, st.glowR || 120, st.led === 'red' ? 'rgba(255,40,40,1)' : 'rgba(70,255,120,1)', a);
  blob(cx, ey - 1, 5, 5, st.led === 'red' ? '#ff7a7a' : '#aaffc4', { lw: 0 });
}
/* the box it came in */
function sitaBox(x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.open) { poly([[-70, -46], [-70, -46 - 50 * o.open], [-4, -46 - 60 * o.open], [-4, -46]], '#ddd6c6', { lw: 3.5, w: .4 }); }
  rect(-70, -46, 140, 92, '#e9e4d8', { lw: 4, w: .5 });
  rect(-64, -40, 58, 80, '#2a2a30', { lw: 2.5, w: .3 });
  for (let i = 0; i < 6; i++) curve([[-60 + i * 9, -38], [-60 + i * 9, 38]], 1.2, '#6a6a72', { w: .1 });
  blob(-40, -10, 6, 6, '#f3d38a', { lw: 1.5 }); blob(-24, -6, 5, 5, '#f3d38a', { lw: 1.5 });
  txt('ΕΞΥΠΝΗ', 32, -20, 17, '#e8392b', { font: TVFONT, style: 'italic', weight: 900 });
  txt('ΣΙΤΑ', 32, 2, 22, '#e8392b', { font: TVFONT, style: 'italic', weight: 900 });
  txt('ΜΑΓΝΗΤΙΚΗ', 32, 24, 10, '#231a2e', { font: TVFONT, weight: 900 });
  if (o.label) { ctx.save(); ctx.rotate(-.08); rect(-10, 10, 70, 34, '#fff', { lw: 2, w: .2 }); txt(o.label, 25, 20, 8, INK, { font: TVFONT, weight: 900 }); txt('▮▮▯▮▯▮▮▯▮', 25, 34, 9, INK, { font: TVFONT }); ctx.restore(); }
  ctx.restore();
}

/* ---------- the telemarketing army ---------- */
function hose(pts, t, o = {}) {
  limb(pts, 13, o.col || '#3aa04a', { w: .6 });
  // ridges
  for (let i = 1; i < pts.length - 1; i++) { const p = pts[i]; blob(p[0], p[1], 5, 5, 'rgba(255,255,255,.25)', { lw: 0 }); }
  const a = pts[pts.length - 2], b = pts[pts.length - 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  ctx.save(); ctx.translate(b[0], b[1]); ctx.rotate(ang);
  rect(-4, -11, 26, 22, '#d8b24a', { lw: 3, w: .3 }); rect(20, -7, 14, 14, '#b9b9c2', { lw: 3, w: .3 });
  if (o.eye) { blob(10, -4, 4, 4, '#ff3030', { lw: 1.5, glow: '#ff3030', gb: 12 }); }
  ctx.restore();
}
/* snake path helper: from (x0,y0) waving to (x1,y1) */
function snakePts(x0, y0, x1, y1, t, amp = 18, n = 9, ph = 0) {
  const P = []; for (let i = 0; i <= n; i++) { const k = i / n; P.push([lerp(x0, x1, k) + Math.sin(k * 7 + t * 5 + ph) * amp * Math.sin(k * Math.PI) * (y1 !== y0 ? 1 : 0), lerp(y0, y1, k) + Math.sin(k * 6 + t * 5 + ph) * amp * Math.sin(k * Math.PI)]); }
  return P;
}
function repeller(x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rect(-26, -40, 52, 80, '#f4f2ec', { lw: 3.5, w: .4 });
  blob(0, -6, 16, 16, '#d8d6cf', { lw: 3 }); for (let i = 0; i < 3; i++) blob(0, -6, 12 - i * 4, 12 - i * 4, null, { lw: 1.5, sc: '#9a988f' });
  txt('ULTRA', 0, 20, 8, '#2a6fb3', { font: TVFONT, weight: 900 }); txt('SONIC', 0, 29, 8, '#2a6fb3', { font: TVFONT, weight: 900 });
  const on = o.on; blob(16, -30, 4, 4, on ? (o.red ? '#ff3030' : '#44ff7a') : '#555', { lw: 1.5, glow: on ? (o.red ? '#ff3030' : '#44ff7a') : null, gb: 10 });
  if (o.prongs) { rect(-10, 40, 5, 14, '#c9c9c9', { lw: 1.5 }); rect(5, 40, 5, 14, '#c9c9c9', { lw: 1.5 }); }
  ctx.restore();
}
function socket(x, y) { rect(x - 22, y - 22, 44, 44, '#f4f2ec', { lw: 3, w: .3 }); blob(x - 8, y, 3, 5, INK, { lw: 0 }); blob(x + 8, y, 3, 5, INK, { lw: 0 }); }
function bulb(x, y, col, on = 1, len = 60) {
  curve([[x, y - len], [x, y - 12]], 2.5);
  rect(x - 8, y - 16, 16, 12, '#8a8a8a', { lw: 2, w: .2 });
  blob(x, y + 6, 15, 17, on ? col : '#e8e4d8', { lw: 3, w: .3 });
}
function bulbGlow(x, y, col, a = .6) { glow(x, y + 6, 180, col, a); }
function blanket(x, y, w, h, o = {}) {
  const t = o.t || 0, P = [];
  for (let i = 0; i <= 8; i++) P.push([x + w * i / 8, y + Math.sin(i + t * 2) * 3 * (o.wave || 0)]);
  for (let i = 8; i >= 0; i--) P.push([x + w * i / 8, y + h + Math.sin(i * 1.3 + t * 2) * 4 * (o.wave || 0)]);
  poly(P, o.col || '#c9443a', { lw: 3.5, w: .6 });
  ctx.save(); ctx.globalAlpha = .35; for (let i = 1; i < 6; i++) { curve([[x + w * i / 6, y + 4], [x + w * i / 6, y + h - 4]], 3, '#f2e6c8', { w: .5 }); } for (let j = 1; j < 4; j++) curve([[x + 4, y + h * j / 4], [x + w - 4, y + h * j / 4]], 3, '#f2e6c8', { w: .5 }); ctx.restore();
  if (o.ctrl !== false) {
    const cx = o.ctrlX ?? x + w + 20, cy = o.ctrlY ?? y + h / 2;
    curve([[x + w, y + h / 2], [cx, cy]], 2.5);
    rect(cx - 16, cy - 22, 32, 44, '#f4f2ec', { lw: 3, w: .3 }); rect(cx - 11, cy - 16, 22, 14, '#1a1a1a', { lw: 0 });
    txt(o.level ?? '9', cx, cy - 9, 11, '#ff3a2a', { font: TVFONT, weight: 900 }); txt('MAX', cx, cy + 10, 7, INK, { font: TVFONT, weight: 900 });
  }
  if (o.heat) for (let i = 0; i < 5; i++) { const p = (t * .6 + i / 5) % 1; curve([[x + w * (.15 + i * .17), y - p * 50], [x + w * (.15 + i * .17) + 6, y - 12 - p * 50], [x + w * (.15 + i * .17), y - 24 - p * 50]], 2.5, `rgba(255,255,255,${.6 * (1 - p) * o.heat})`, { w: .3 }); }
}
function pillow(x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  poly([[-70, 10], [-70, -10], [-50, -24], [-20, -16], [10, -26], [40, -18], [70, -14], [70, 12], [40, 18], [0, 16], [-40, 18]], '#eef3f6', { lw: 3.5, w: .5, smooth: true });
  for (let i = 0; i < 6; i++) blob(-50 + i * 20, 0, 3, 2, 'rgba(120,160,190,.4)', { lw: 0 });
  if (o.led) blob(56, -6, 4, 4, '#ff3030', { lw: 1.5, glow: '#ff3030', gb: 10 });
  ctx.restore();
}
function belt(x, y, t, o = {}) {
  const hump = o.crawl ? Math.max(0, Math.sin(t * 6)) * 26 : 0, vib = o.vib ? Math.sin(t * 90) * 2 : 0;
  ctx.save(); ctx.translate(x + vib, y); ctx.scale(o.dir || 1, 1); ctx.rotate(o.rot || 0);
  limb([[-80, 0], [-30, -hump * .5], [0, -hump], [30, -hump * .5], [80, 0]], 16, '#e8d6e6', { w: .5 });
  rect(-26, -hump - 16, 52, 30, '#7a5aa8', { lw: 3, w: .3 });
  txt('VIBRO', 0, -hump - 1, 10, '#fff', { font: TVFONT, weight: 900 });
  blob(18, -hump - 10, 3, 3, o.red ? '#ff3030' : '#44ff7a', { lw: 1, glow: o.red ? '#ff3030' : '#44ff7a', gb: 8 });
  // cord + plug trailing behind
  if (o.cord !== false) { curve([[-80, 0], [-120, 10], [-160, 2], [-200, 8]], 2.5); rect(-216, 0, 16, 14, '#f4f2ec', { lw: 2, w: .2 }); }
  ctx.restore();
}
function mopBucket(x, y, t, o = {}) {
  const spin = o.spin || 0, ang = t * spin * 30;
  ctx.save(); ctx.translate(x, y);
  if (o.wheels) for (const wx of [-36, 36]) { blob(wx, 4, 11, 11, '#2a2a2e', { lw: 3 }); curve([[wx + Math.cos(ang) * 8, 4 + Math.sin(ang) * 8], [wx - Math.cos(ang) * 8, 4 - Math.sin(ang) * 8]], 2, '#9a9a9a'); }
  poly([[-50, -80], [50, -80], [40, 0], [-40, 0]], '#3a8ad8', { lw: 4, w: .5 });
  poly([[-52, -86], [52, -86], [50, -76], [-50, -76]], '#2a6ab0', { lw: 3, w: .3 });
  // spinner basket
  blob(10, -86, 30, 8, '#e8e8ea', { lw: 3 });
  for (let i = 0; i < 6; i++) { const a = ang + i; curve([[10 + Math.cos(a) * 26, -86 + Math.sin(a) * 6], [10 + Math.cos(a) * 26, -92 + Math.sin(a) * 6]], 2, '#8a8a8a', { w: .1 }); }
  if (o.mop !== false) { limb([[10, -90], [30, -240]], 5, '#c9c9c9', { w: .3 }); for (let i = 0; i < 9; i++) curve([[10, -92], [10 + Math.cos(ang + i) * 24, -96 + Math.sin(ang + i) * 6]], 3, '#f0ead8', { w: .5 }); }
  if (spin > .5) for (let i = 0; i < 8; i++) { const a = ang * .5 + i * .8, r = 40 + ((t * 3 + i * .3) % 1) * 80; blob(10 + Math.cos(a) * r, -86 + Math.sin(a) * r * .4, 3, 3, 'rgba(140,120,90,.7)', { lw: 0 }); }
  if (o.eye) blob(-28, -50, 5, 5, '#ff3030', { lw: 1.5, glow: '#ff3030', gb: 12 });
  ctx.restore();
}
function racket(x, y, rot, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(o.s || 1, o.s || 1);
  rect(-7, 10, 14, 60, '#f2c21a', { lw: 3, w: .3 }); blob(0, 44, 3, 3, o.on ? '#ff3030' : '#555', { lw: 1 });
  blob(0, -30, 34, 44, 'rgba(30,60,120,.12)', { lw: 5, sc: '#f2c21a', w: .5 });
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, -30, 32, 42, 0, 0, TAU); ctx.clip();
  ctx.strokeStyle = o.on ? 'rgba(120,200,255,.9)' : 'rgba(80,80,90,.7)'; ctx.lineWidth = 1.5;
  for (let i = -40; i <= 40; i += 7) { ctx.beginPath(); ctx.moveTo(i, -80); ctx.lineTo(i, 20); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-40, i - 30); ctx.lineTo(40, i - 30); ctx.stroke(); }
  ctx.restore();
  if (o.on) for (let i = 0; i < 3; i++) { const a = hash(i + Math.floor(t * 12)) * TAU; curve([[Math.cos(a) * 30, -30 + Math.sin(a) * 40], [Math.cos(a) * 44, -30 + Math.sin(a) * 54]], 2.5, '#9ad8ff', { w: 2 }); }
  if (o.pilot) chicken(0, -12, t, 5, '#f3efe6', { s: .7, still: true, noLegs: true, goggles: true });
  ctx.restore();
}
function racketGlow(x, y, a = .4) { glow(x, y - 30, 90, 'rgba(90,180,255,1)', a); }
function tv(x, y, w, h, screen, o = {}) {
  rect(x - w / 2 - 10, y - h - 10, w + 20, h + 20, '#1c1c20', { lw: 4, w: .4 });
  ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y - h, w, h); ctx.clip();
  ctx.fillStyle = '#0a0a10'; ctx.fillRect(x - w / 2, y - h, w, h);
  if (screen) { ctx.translate(x - w / 2, y - h); ctx.scale(w / 1280, h / 720); screen(); }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = .12; ctx.fillStyle = '#fff'; for (let yy = y - h; yy < y; yy += 4) ctx.fillRect(x - w / 2, yy, w, 1); ctx.restore();
  if (o.stand !== false) { rect(x - 30, y + 10, 60, 30, '#1c1c20', { lw: 3 }); rect(x - 120, y + 40, 240, 16, '#1c1c20', { lw: 3 }); }
}
function decoder(x, y, o = {}) {
  rect(x - 70, y - 22, 140, 22, '#26262c', { lw: 3, w: .3 });
  txt('NOVA', x - 40, y - 11, 9, '#9aa0a8', { font: TVFONT, weight: 900 });
  blob(x + 50, y - 11, 3.5, 3.5, o.hacked ? '#ff3030' : '#44ff7a', { lw: 1, glow: o.hacked ? '#ff3030' : '#44ff7a', gb: 10 });
}
function car(x, y, t, o = {}) {
  const b = o.moving ? Math.sin(t * 20) * 1.5 : 0, d = o.dir || 1;
  ctx.save(); ctx.translate(x, y + b); ctx.scale(d * (o.s || 1), o.s || 1);
  blob(0, 4, 190, 10, 'rgba(0,0,0,.25)', { lw: 0 });
  poly([[-180, -10], [-176, -60], [-110, -70], [-70, -118], [60, -118], [110, -70], [176, -60], [184, -10]], o.col || '#b9c0c8', { lw: 4.5, w: .6, smooth: false });
  poly([[-62, -110], [-2, -110], [-2, -72], [-100, -72]], '#9cc5d6', { lw: 3.5, w: .4 });
  poly([[8, -110], [56, -110], [98, -72], [8, -72]], '#9cc5d6', { lw: 3.5, w: .4 });
  if (o.passengers) o.passengers();
  curve([[-176, -40], [182, -40]], 2.5, 'rgba(0,0,0,.25)');
  rect(-176, -50, 18, 14, '#f9d46a', { lw: 2.5 });
  rect(164, -50, 18, 14, o.lights ? '#fffbe0' : '#e8e8e8', { lw: 2.5 });
  txt('ΚΚΝ-1984', -10, -22, 10, INK, { font: TVFONT, weight: 900 });
  const ang = -t * (o.moving ? 14 : 0);
  for (const wx of [-110, 110]) { blob(wx, -8, 30, 30, '#2b2a2e', { lw: 4, w: .5 }); blob(wx, -8, 13, 13, '#c9c9c9', { lw: 3, w: .4 }); curve([[wx + Math.cos(ang) * 11, -8 + Math.sin(ang) * 11], [wx - Math.cos(ang) * 11, -8 - Math.sin(ang) * 11]], 2.5); }
  ctx.restore();
  if (o.lights) { const hx = x + d * 180 * (o.s || 1); glow(hx, y - 43 * (o.s || 1), 160, 'rgba(255,250,210,1)', .55); }
}
function mouse(x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  blob(0, 0, 18, 11, '#9a9aa2', { lw: 2.5 }); blob(16, -4, 9, 8, '#9a9aa2', { lw: 2.5 }); blob(12, -12, 6, 6, '#e8b0b8', { lw: 2 });
  curve([[-18, 2], [-34, 8], [-44, 0]], 2, '#c08a90');
  if (o.sleep) { curve([[18, -6], [24, -6]], 2); txt('z', 34, -26, 12, INK); } else blob(21, -6, 1.8, 1.8, INK, { lw: 0 });
  ctx.restore();
}
function cat(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  blob(0, 0, 26, 20, '#e0a050', { lw: 3 }); blob(0, -30, 20, 17, '#e0a050', { lw: 3 });
  poly([[-16, -40], [-12, -58], [-4, -44]], '#e0a050', { lw: 3 }); poly([[16, -40], [12, -58], [4, -44]], '#e0a050', { lw: 3 });
  eye(-7, -32, 6, 0, 0, false, { pr: 2 }); eye(7, -32, 6, 0, 0, false, { pr: 2 });
  ctx.restore();
}
function trashBin(x, y) {
  poly([[-44, 0], [44, 0], [50, -110], [-50, -110]].map(p => [p[0] + x, p[1] + y]), '#3a7a4a', { lw: 4, w: .5 });
  rect(x - 56, y - 124, 112, 16, '#2e6a3c', { lw: 3.5, w: .4 });
  txt('ΔΗΜΟΣ ΚΟΡΙΝΘΙΩΝ', x, y - 60, 9, '#e8f0e8', { font: TVFONT, weight: 900 });
}
function flame(x, y, s, t, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < 4; i++) { const k = 1 - i * .22, fl = Math.sin(t * 20 + i) * 4; poly([[x - 20 * s * k, y], [x - 12 * s * k + fl, y - 30 * s * k], [x + fl, y - 70 * s * k], [x + 12 * s * k - fl, y - 30 * s * k], [x + 20 * s * k, y]], ['#e8392b', '#ff7a2a', '#ffb23a', '#fff0a0'][i], { lw: i ? 0 : 3, w: 2 }); }
  ctx.restore(); glow(x, y - 30 * s, 120 * s, 'rgba(255,140,40,1)', .5 * a);
}
/* full-frame close-up of Γιάννος's laptop: rows = [[text, colour?], ...] typed out with k (0..1) */
function laptopScreen(rows, k = 1, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#9aa0aa'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#12161f'; ctx.beginPath(); ctx.roundRect(60, 40, 1160, 640, 18); ctx.fill();
  ctx.fillStyle = '#1e2533'; ctx.fillRect(60, 40, 1160, 48); ctx.beginPath(); ctx.roundRect(60, 40, 1160, 48, [18, 18, 0, 0]); ctx.fill();
  for (const [i, c] of [['#ff5f57', 0], ['#febc2e', 1], ['#28c840', 2]].map(([c, i]) => [i, c])) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(94 + i * 26, 64, 8, 0, TAU); ctx.fill(); }
  txt(o.title || 'agent — sita-firmware', 640, 64, 18, '#9aa7bd', { font: 'monospace', weight: 700 });
  const total = rows.reduce((a, r) => a + r[0].length, 0); let left = Math.floor(total * k), y = 140;
  ctx.textAlign = 'left';
  for (const [s, col] of rows) {
    if (left <= 0) break;
    const shown = s.slice(0, left); left -= s.length;
    ctx.font = `700 ${o.size || 30}px monospace`; ctx.fillStyle = col || '#d8e2f0'; ctx.textBaseline = 'middle'; ctx.fillText(shown, 110, y);
    y += (o.size || 30) * 1.7;
  }
  if (Math.floor(BOIL / 3) % 2) { ctx.fillStyle = '#d8e2f0'; ctx.fillRect(110, y - 18, 16, 32); }
  if (o.extra) o.extra();
  ctx.restore();
}

/* the σίτα's laser: a thin red beam (k 0..1 fades it), a dot where it lands, and the «τσσπ» puff */
function laserBeam(x1, y1, x2, y2, k = 1, w = 3) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = k; ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = 'rgba(255,40,40,.35)'; ctx.lineWidth = w * 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.strokeStyle = '#ff5050'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
  laserDot(x2, y2, k);
}
function laserDot(x, y, k = 1, r = 5) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = k; blob(x, y, r, r, '#ff3030', { lw: 0, glow: '#ff2020', gb: 16 }); blob(x, y, r * .4, r * .4, '#fff0f0', { lw: 0 }); ctx.restore();
}
function zapPuff(x, y, k) {             // k 0..1 after the hit
  if (k <= 0 || k >= 1) return;
  for (let i = 0; i < 5; i++) blob(x + Math.cos(i * 1.3) * 14 * k, y - 10 * k - Math.sin(i * 1.3) * 10 * k, 5 + 8 * k, 5 + 7 * k, `rgba(90,90,95,${.6 * (1 - k)})`, { lw: 0 });
  if (k < .3) blob(x, y, 10, 10, '#ffd23f', { lw: 0, glow: '#ff8a2a', gb: 20 });
}
/* where the σίτα's diode is, for a σίτα hung on DOOR (or given x/top/h like the mecha head) */
function sitaEye(st = {}) { const cx = st.x ?? DOOR.x, top = st.top ?? DOOR.top, h = st.h ?? DOOR.h; return [cx + 24, top + h * .2 + 5.5]; }
