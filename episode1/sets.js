/* =========================================================
   «Η Έξυπνη Σίτα» – shared sets
   The yard (Μήμης's house) in any light, the plastic table set,
   the door where the σίτα hangs, and simple interior helpers.
   World space is 1280×720; scenes move a camera over it.
   ========================================================= */
const GROUND = 690, SEAT = 560;
const POS = { giannos: 460, mimis: 640, giorgos: 820 };
const DOOR = { x: 1060, top: 482, w: 96, h: 210 };            // the σίτα hangs here

/* ---------- camera helpers ---------- */
function applyCam(c) { ctx.translate(W / 2, H / 2); ctx.scale(c[2], c[2]); ctx.translate(-c[0], -c[1]); }
/* cut-based camera: CAMS name → [x,y,zoom]; slow push-in inside each shot */
function shotCam(sc, t, CAMS, push = .008) {
  const [st, name] = shotAt(sc, t), c = CAMS[name] || CAMS.wide;
  return [c[0], c[1], c[2] * (1 + (t - st) * push)];
}
const camLerp = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

/* ---------- lighting (screen space, after the world is drawn) ---------- */
const LIGHT = {
  day: null,
  dusk: { col: '#ff9a5c', a: .35, dark: 'rgba(60,20,60,.18)' },
  night: { col: '#3a4a8a', a: .72, dark: 'rgba(5,8,25,.35)' },
  dawn: { col: '#ffc2a0', a: .25, dark: 'rgba(40,40,80,.1)' },
  red: { col: '#c02a2a', a: .55, dark: 'rgba(30,0,0,.35)' },
  blue: { col: '#7080c8', a: .5, dark: 'rgba(20,20,60,.18)' },
};
function applyLight(name, k = 1) {
  const L = LIGHT[name]; if (!L || k <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = L.a * k; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = L.col; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = k; ctx.fillStyle = L.dark; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
/* soft additive glow in world space (lamps, LEDs, fire) */
function glow(x, y, r, col, a = .6) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
function vignette(a = .5) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(640, 360, 250, 640, 360, 800); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}

/* ---------- yard pieces ---------- */
function acroSmall() {
  poly([[-100, 430], [0, 360], [60, 320], [130, 300], [200, 318], [290, 380], [380, 430]], '#b9a78e', { lw: 3.5, w: .5 });
  for (const [x, y] of [[60, 314], [130, 294], [200, 312]]) rect(x - 5, y - 12, 10, 12, '#a39179', { lw: 2 });
}
function figTree(x, y, t) {
  limb([[x, y], [x + 10, y - 120], [x - 20, y - 220]], 26, '#9a948a', { w: .6 });
  limb([[x + 8, y - 130], [x + 90, y - 210]], 14, '#9a948a', { w: .6 });
  for (const [bx, by, r] of [[-90, -240, 70], [0, -290, 90], [100, -250, 80], [-40, -200, 60], [60, -200, 64], [150, -200, 52]]) blob(x + bx + Math.sin(t + bx) * 2, y + by, r, r * .75, '#4f7a37', { lw: 4, w: 1.5 });
  for (let i = 0; i < 14; i++) blob(x - 120 + hash(i) * 280, y - 320 + hash(i + 3) * 160, 12, 8, '#6a9848', { lw: 0, rot: hash(i) * 3 });
  for (let i = 0; i < 5; i++) blob(x - 60 + hash(i + 11) * 180, y - 220 + hash(i + 13) * 60, 7, 8, '#6b3d5e', { lw: 2 });
}
function coop(x, y, doorOpen = 0, shake = 0) {
  ctx.save(); if (shake) ctx.translate(Math.sin(shake * 60) * 4 * (shake > 0), 0);
  poly([[x, y], [x + 190, y], [x + 190, y - 120], [x, y - 120]], '#b58a5a', { lw: 4 });
  poly([[x - 12, y - 120], [x + 202, y - 120], [x + 95, y - 170]], '#8f5e3c', { lw: 4 });
  ctx.save(); ctx.strokeStyle = 'rgba(40,40,40,.45)'; ctx.lineWidth = 1.2;
  for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.moveTo(x + 14 + i * 9, y - 104); ctx.lineTo(x + 14 + i * 9 + 30, y - 14); ctx.moveTo(x + 44 + i * 9, y - 104); ctx.lineTo(x + 14 + i * 9, y - 14); ctx.stroke(); }
  ctx.restore();
  rect(x + 14, y - 104, 162, 90, null, { lw: 3 });
  // little door on the right side
  rect(x + 150, y - 70, 34 * (1 - doorOpen) + 4, 70, doorOpen > .5 ? '#2a2018' : '#a07a4a', { lw: 3, w: .3 });
  if (doorOpen > 0) rect(x + 150 + 38 * (1 - doorOpen), y - 70, 30 * doorOpen, 70, '#a07a4a', { lw: 3, w: .3 });
  ctx.restore();
}
function chicken(x, y, t, seed, col = '#f3efe6', o = {}) {
  const peck = o.still ? 0 : Math.max(0, Math.sin(t * 2 + seed * 4)) > .8 ? 10 : 0, d = o.dir || 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(d * (o.s || 1), o.s || 1);
  blob(0, -18, 20, 15, col, { lw: 3, w: .5 });
  poly([[-18, -24], [-30, -38], [-24, -14]], col, { lw: 3, w: .4 });
  blob(16, -34 + peck, 9, 9, col, { lw: 3, w: .4 });
  blob(16, -45 + peck, 4, 4, '#d8392b', { lw: 0 });
  poly([[24, -34 + peck], [31, -31 + peck], [24, -29 + peck]], '#f2a33a', { lw: 2 });
  blob(18, -36 + peck, 1.6, 1.6, INK, { lw: 0 });
  if (o.goggles) { blob(18, -37 + peck, 5, 4, '#9ad0ff', { lw: 2 }); curve([[8, -38 + peck], [24, -38 + peck]], 2); }
  if (!o.noLegs) { curve([[-4, -4], [-4, 4]], 2.5); curve([[4, -4], [4, 4]], 2.5); }
  ctx.restore();
}
function feathers(x, y, t, n = 16, k = 1) {
  for (let i = 0; i < n; i++) { const a = hash(i) * TAU, r = 30 + hash(i + 4) * 160 * k; blob(x + Math.cos(a) * r + Math.sin(t * 3 + i) * 6, y + Math.sin(a) * r * .6 + k * 40 * hash(i + 2), 6, 3, '#f7f4ee', { lw: 1.5, rot: t * 2 + i }); }
}
function house(t, o = {}) {
  rect(760, 60, 800, 640, '#f3eee2', { lw: 4, w: .6 });
  rect(740, 42, 840, 22, '#c4643c', { lw: 4, w: .5 });
  for (let i = 0; i < 26; i++) curve([[748 + i * 32, 44], [748 + i * 32, 62]], 2, '#9c4a2a', { w: .3 });
  poly([[760, 640], [1560, 640], [1560, 700], [760, 700]], '#cfc4ae', { lw: 3.5, w: .5 });
  for (let i = 0; i < 12; i++) blob(790 + i * 66, 668, 26, 14, '#bfb39b', { lw: 2.5, w: .8 });
  // door (Greek blue frame, dark interior; lit at night)
  rect(1000, 470, 120, 222, '#3f74a6', { lw: 4, w: .4 });
  rect(1012, 482, 96, 210, o.doorLit ? '#e8c77a' : '#2a2420', { lw: 3, w: .4 });
  // bougainvillea
  for (let i = 0; i < 16; i++) blob(960 + hash(i) * 110 + Math.sin(t + i) * 1.5, 420 + hash(i + 4) * 70 - (i % 4) * 10, 20, 15, i % 3 ? '#d63f86' : '#b8306f', { lw: 2.5, w: 1 });
  for (let i = 0; i < 6; i++) blob(960 + hash(i + 20) * 110, 440 + hash(i + 24) * 60, 12, 8, '#4f7a37', { lw: 0 });
  // AC unit dripping
  rect(1200, 330, 130, 80, '#e9e9e4', { lw: 3.5, w: .4 }); blob(1250, 370, 28, 28, '#d2d2cc', { lw: 3 });
  for (let i = 0; i < 5; i++) curve([[1228 + i * 11, 346], [1228 + i * 11, 394]], 2, '#b8b8b2', { w: .2 });
  const dp = (t * .8) % 1; blob(1310, 412 + dp * 270, 3, 4, '#8fc5e0', { lw: 0 });
  blob(1310, 684, 20, 5, 'rgba(90,120,140,.3)', { lw: 0 });
  // lower window (living room), right of the door
  rect(1380, 470, 110, 120, o.winLit ? (o.winLit === 'red' ? '#d8403a' : '#e8c77a') : '#2a2420', { lw: 4, w: .4 });
  curve([[1435, 470], [1435, 590]], 3); curve([[1380, 530], [1490, 530]], 3);
  // pots (τενεκέδες) with basil & geranium
  for (const [px, col] of [[1140, '#d8392b'], [1190, '#4f7a37'], [950, '#e0527a']]) { rect(px - 20, 646, 40, 44, '#c8ccd0', { lw: 3, w: .4 }); for (let i = 0; i < 6; i++) blob(px - 16 + hash(i + px) * 32, 632 - hash(i + px + 1) * 24, 10, 8, i % 2 ? col : '#4f7a37', { lw: 2, w: .6 }); }
}
function windowFrame(t, shutK, lit) {
  rect(830, 170, 120, 130, lit ? (lit === 'red' ? '#d8403a' : '#e8c77a') : '#2a2420', { lw: 4, w: .4 });
  rect(820, 300, 140, 12, '#e3dccb', { lw: 3.5, w: .3 });
  for (const side of [-1, 1]) {
    const openX = side < 0 ? 830 - 62 : 950 + 2, closedX = side < 0 ? 830 : 890;
    const x0 = lerp(openX, closedX, shutK);
    rect(x0, 168, 60, 134, '#3d8a5a', { lw: 3.5, w: .4 });
    for (let i = 0; i < 9; i++) curve([[x0 + 6, 180 + i * 13], [x0 + 54, 180 + i * 13]], 2, '#2c6a44', { w: .2 });
  }
}
function clothesline(t) {
  curve([[240, 190], [500, 214], [760, 196]], 2.5, '#6a6a6a', { w: .3 });
  for (const [x, w, h, col] of [[300, 60, 80, '#e05a4a'], [380, 70, 60, '#f2d34a'], [470, 50, 90, '#6fa7d8'], [560, 80, 70, '#f4f3ee'], [660, 40, 50, '#b9477a']]) {
    const y = 200 + (x - 240) * .03 - Math.max(0, x - 500) * .06, sway = Math.sin(t * 1.5 + x) * 3;
    poly([[x, y], [x + w, y], [x + w + sway, y + h], [x + sway, y + h]], col, { lw: 3, w: .6 });
    for (const px of [x + 6, x + w - 6]) rect(px - 2, y - 6, 4, 10, '#a37a4a', { lw: 1.5, w: 0 });
  }
}
const SKY = {
  day: ['#9fd3ea', '#f1ecd6'], blue: ['#2a3470', '#c08aa0'], dusk: ['#5a4a8a', '#ffb070'], night: ['#0b1030', '#26305a'], dawn: ['#8aa6d6', '#ffd9b8'],
};
function sky(light, t) {
  const s = SKY[light] || SKY.day, g = ctx.createLinearGradient(0, -200, 0, 420); g.addColorStop(0, s[0]); g.addColorStop(1, s[1]);
  ctx.fillStyle = g; ctx.fillRect(-600, -500, 2800, 1000);
  if (light === 'night' || light === 'blue') {
    for (let i = 0; i < 70; i++) { const tw = .5 + .5 * Math.sin(t * 2 + i * 7); blob(-300 + hash(i) * 1900, -200 + hash(i + 50) * 480, 1.6 + tw, 1.6 + tw, '#fff8d8', { lw: 0, n: 6 }); }
    blob(1180, 20, 34, 34, '#fff6d6', { lw: 0, glow: '#fff6d6', gb: 40 });
  }
  if (light === 'dusk') blob(300, 380, 60, 60, '#ffcf6a', { lw: 0, glow: '#ff9a4a', gb: 80 });
}
/* the whole yard; o: { light, shut, winLit, doorLit, maria, noChickens, coopDoor, coopShake, fig } */
function yard(t, o = {}) {
  const light = o.light || 'day';
  sky(light, t);
  acroSmall();
  for (let i = 0; i < 9; i++) { limb([[-40 + i * 60, 440], [-40 + i * 60, 350]], 3, '#6a8a3a', { w: .5 }); blob(-40 + i * 60, 370, 22, 30, '#5f8a3a', { lw: 3, w: 1 }); blob(-30 + i * 60, 392, 7, 7, '#d8392b', { lw: 2 }); }
  rect(-400, 430, 1160, 270, '#ebe2cd', { lw: 4, w: .6 });
  rect(-410, 420, 1180, 16, '#d9ceb4', { lw: 3.5, w: .5 });
  clothesline(t);
  figTree(170, 690, t);
  coop(-80, 690, o.coopDoor || 0, o.coopShake || 0);
  house(t, o);
  windowFrame(t, o.shut ?? 0, o.winTop);
  poly([[-400, 690], [1600, 690], [1600, 800], [-400, 800]], '#d9d0bd', { lw: 0 });
  curve([[-400, 690], [1600, 690]], 4);
  curve([[300, 720], [360, 706], [420, 716]], 2, '#b8ad96');
  if (!o.noChickens) { chicken(40 + Math.sin(t * .3) * 30, 700, t, 1); chicken(250, 712, t, 2, '#b97a4a'); chicken(1340, 706, t, 3); }
}

/* ---------- the table set ---------- */
function chair(x, o = {}) {
  ctx.save(); if (o.fallen) { ctx.translate(x, GROUND); ctx.rotate(o.fallen * 1.3); ctx.translate(-x, -GROUND); }
  poly([[x - 62, SEAT - 158], [x + 62, SEAT - 158], [x + 56, SEAT - 40], [x - 56, SEAT - 40]], '#efeadb', { lw: 4, w: .5 });
  for (let i = 0; i < 4; i++) curve([[x - 36 + i * 24, SEAT - 140], [x - 36 + i * 24, SEAT - 60]], 3, '#d7d0bb', { w: .3 });
  for (const side of [-1, 1]) limb([[x + side * 50, SEAT + 10], [x + side * 62, GROUND]], 8, '#efeadb', { w: .3 });
  ctx.restore();
}
function table(t, o = {}) {
  if (o.flipped) {        // on its side: a barricade
    poly([[340, GROUND], [940, GROUND], [940, GROUND - 130], [340, GROUND - 130]], '#f1ede2', { lw: 4, w: .6 });
    curve([[360, GROUND - 110], [920, GROUND - 110]], 2.5, '#d6d0c0'); curve([[360, GROUND - 20], [920, GROUND - 20]], 2.5, '#d6d0c0');
    for (const lx of [420, 860]) limb([[lx, GROUND - 130], [lx + 10, GROUND - 250]], 12, '#ece7da', { w: .3 });
    return;
  }
  for (const lx of [400, 880]) limb([[lx, 560], [lx - (lx < 640 ? 10 : -10), GROUND]], 12, '#ece7da', { w: .3 });
  poly([[370, 538], [910, 538], [928, 556], [352, 556]], '#f1ede2', { lw: 4, w: .5 });
  rect(352, 556, 576, 12, '#ddd7c7', { lw: 3.5, w: .4 });
  rect(610, 516, 30, 30, '#c9ced4', { lw: 3, w: .3 }); blob(625, 516, 15, 4, '#8a8f96', { lw: 2.5 });
  for (let i = 0; i < 3; i++) rect(616 + i * 6, 506 - i * 2, 3, 12, '#f2efe6', { lw: 1.2, w: 0 });
  rect(540, 526, 34, 20, '#e8e4dc', { lw: 2.5, w: .3 }); rect(540, 526, 34, 7, '#c0392b', { lw: 0 });
  rect(730, 528, 26, 18, '#1f3a5a', { lw: 2.5, w: .3 });
  rect(700, 534, 10, 12, '#e2b43c', { lw: 2, w: .2 });
  if (o.watermelon) { poly([[440, 530], [520, 530], [480, 500]], '#e8404a', { lw: 3 }); curve([[440, 530], [520, 530]], 5, '#4f8a3a'); for (let i = 0; i < 3; i++) blob(470 + i * 10, 518, 2, 3, INK, { lw: 0 }); }
}
/* seated trio around the table; S = { giannos:{...state}, mimis:{...}, giorgos:{...} } (missing = empty chair) */
function tableScene(t, S, o = {}) {
  for (const k in POS) chair(POS[k], { fallen: o.fallen && o.fallen[k] });
  for (const k in POS) if (S[k] && !(o.fallen && o.fallen[k])) person(POS[k], SEAT, 1, CAST[k], { ...S[k], part: 'legs' });
  for (const k in POS) if (S[k] && !(o.fallen && o.fallen[k])) person(POS[k], SEAT, 1, CAST[k], { ...S[k], part: 'body' });
  table(t, o);
  if (!o.noCups) { freddo(470, 540); freddo(836, 540); }
  for (const k in POS) if (S[k] && !(o.fallen && o.fallen[k])) person(POS[k], SEAT, 1, CAST[k], { ...S[k], part: 'arms' });
}
/* standing person with feet on the ground */
const standY = (s = 1) => GROUND - 150 * s;
function stand(x, who, s, st) { person(x, standY(s), s, CAST[who], { legs: 'stand', ...st }); }

/* ---------- interiors ---------- */
function room(o = {}) {
  const wall = o.wall || '#e9dcc4', floor = o.floor || '#b88a5a', fy = o.floorY ?? 560;
  ctx.fillStyle = wall; ctx.fillRect(-600, -400, 2600, fy + 400);
  if (o.stripe) { ctx.fillStyle = o.stripe; ctx.fillRect(-600, fy - 150, 2600, 150); curve([[-600, fy - 150], [2000, fy - 150]], 3, 'rgba(0,0,0,.3)'); }
  ctx.fillStyle = floor; ctx.fillRect(-600, fy, 2600, 800);
  if (o.tiles) { ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 2; for (let i = -10; i < 40; i++) { ctx.beginPath(); ctx.moveTo(i * 70, fy); ctx.lineTo(i * 70 - 200, fy + 300); ctx.stroke(); } for (let j = 1; j < 6; j++) { ctx.beginPath(); ctx.moveTo(-600, fy + j * j * 12); ctx.lineTo(2000, fy + j * j * 12); ctx.stroke(); } }
  curve([[-600, fy], [2000, fy]], 4);
}
function doorway(x, y, w = 140, h = 300, inside = '#2a2420', open = 1) {
  rect(x - w / 2 - 10, y - h - 10, w + 20, h + 10, '#f4f1ea', { lw: 4, w: .4 });
  rect(x - w / 2, y - h, w, h, inside, { lw: 3, w: .4 });
  if (open < 1) rect(x - w / 2, y - h, w * (1 - open), h, '#c9a57a', { lw: 3, w: .4 });
}
function frameText(s, x, y, size = 22, col = '#fff') { txt(s, x, y, size, col, { font: TVFONT, style: 'italic', weight: 900, stroke: size / 4 }); }
/* on-screen caption for montages (screen space) */
function caption(s, a = 1, y = 70) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
  ctx.font = `italic 900 34px ${TVFONT}`; const w = ctx.measureText(s).width + 50;
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(640 - w / 2 + 12, y - 26); ctx.lineTo(640 + w / 2 + 12, y - 26); ctx.lineTo(640 + w / 2 - 12, y + 26); ctx.lineTo(640 - w / 2 - 12, y + 26); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  txt(s, 640, y + 1, 34, '#e8392b', { font: TVFONT, style: 'italic', weight: 900 });
  ctx.restore();
}

/* ---------- blocking helpers ---------- */
const ph = (t, m, a = 0, b = 0) => m ? prog(t, m.a + a, m.b + b) : 0;          // progress through a mark
const inM = (t, m, a = 0, b = 0) => !!m && t >= m.a + a && t < m.b + b;
function speaker(t) { const L = SCENE.lines.find(l => t >= l.a - .2 && t < l.b + .3); return L ? L.who : null; }
/* look from x toward whoever is speaking (X = { who: x }), else `rest` */
function lookAtSpeaker(t, me, X, rest = [0, .1]) {
  const s = speaker(t); if (!s || s === me || X[s] == null) return rest;
  return [clamp((X[s] - X[me]) / 150, -1, 1), .1];
}
/* piecewise position over time: keys [[t, x], ...] → [x, moving] */
function path(t, keys) {
  if (t <= keys[0][0]) return [keys[0][1], false];
  for (let i = 0; i < keys.length - 1; i++) { const [t0, x0] = keys[i], [t1, x1] = keys[i + 1]; if (t < t1) return [lerp(x0, x1, ease(prog(t, t0, t1))), x0 !== x1]; }
  return [keys[keys.length - 1][1], false];
}
/* arm positions (relative to hips) */
const ARM = {
  rest: [[-44, -24], [44, -24]], hips: [[-58, -40], [58, -40]], up: [[-60, -300], [60, -300]], shrug: [[-80, -130], [80, -130]],
  chest: [[-40, -90], [40, -90]], point: [[-44, -24], [110, -150]], wave: [[-44, -24], [90, -230]], face: [[-20, -170], [20, -170]],
};
/* a talking gesture for the right hand */
const gesture = (t, tk, base = [44, -24]) => tk > 0 ? [70 + Math.sin(t * 5) * 14, -90 + Math.sin(t * 7) * 16] : base;
/* act title card (screen space), k = 0..1 through its duration */
function actCard(k, num, title, sub) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#16111d'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 2;
  for (let x = 10; x < W; x += 14) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  const p = back(clamp(k * 3)), a = 1 - prog(k, .85, 1);
  ctx.globalAlpha = a; ctx.translate(640, 330); ctx.scale(p, p); ctx.rotate(-.04);
  txt(num, 0, -90, 40, '#ffd23f', { font: TVFONT, style: 'italic', weight: 900 });
  txt(title, 0, 10, 120, '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 14, sc: '#fff' });
  if (sub) txt(sub, 0, 110, 30, '#fffaf0', { font: TVFONT, style: 'italic', weight: 700 });
  ctx.restore();
}
/* a little synth band: klarino phrase in Hijaz, off-key drunk singing */
function klarino(vol = .03, delay = 0) {
  const sc = [0, 1, 4, 5, 7, 8, 11, 12], seq = [4, 5, 4, 3, 2, 1, 2, 3, 4, 3, 1, 0];
  seq.forEach((n, i) => { tone(392 * 2 ** (sc[n] / 12), .32, 'sawtooth', vol, 1.003, delay + i * .26); tone(392 * 2 ** (sc[n] / 12) * 2, .3, 'sine', vol * .4, 1, delay + i * .26); });
}
function drunkSing(vol = .04, delay = 0) {
  for (let i = 0; i < 10; i++) tone(220 * 2 ** ((Math.floor(Math.random() * 7) + (Math.random() < .3 ? .5 : 0)) / 12), .34, 'triangle', vol, .97 + Math.random() * .06, delay + i * .3);
}
