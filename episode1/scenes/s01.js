/* =========================================================
   Ep.1, Scene 1 – Cold open (script beat 1). Ported from scene01-cold-open.html.
   ========================================================= */
defineScene((() => {
/* =========================================================
   ELEMENTS
   ========================================================= */
function mosquito(x, y, s, t, facing = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * facing, s);
  const flap = Math.sin(t * 90);
  ctx.save(); ctx.globalAlpha = .45;
  blob(-2, -10 - flap * 4, 16, 6, '#dfe9f2', { lw: 1.5, rot: -.5 - flap * .3 });
  blob(4, -9 + flap * 4, 15, 6, '#dfe9f2', { lw: 1.5, rot: -.9 + flap * .3 });
  ctx.restore();
  for (const [a, b, c, d] of [[-6, 2, -16, 18], [0, 3, -4, 20], [5, 2, 12, 19], [-4, 2, -20, 10], [4, 2, 20, 12], [8, 1, 24, 6]]) curve([[a, b], [(a + c) / 2, b + 4], [c, d]], 1.5, INK, { w: .3 });
  blob(-10, 0, 13, 4.5, '#5a4b45', { lw: 2, rot: .2 });
  blob(6, -1, 6, 5, '#4a3d38', { lw: 2 });
  blob(13, -2, 4.5, 4.5, '#3b302c', { lw: 2 });
  blob(15, -4, 1.8, 1.8, '#ff4a3a', { lw: 0 });
  curve([[16, 0], [26, 6]], 1.6, INK, { w: .2 });
  ctx.restore();
}
function acrocorinth(storm) {
  // Ακροκόρινθος: the big rock with the castle walls on top
  poly([[120, 350], [200, 300], [260, 250], [330, 205], [400, 180], [470, 176], [540, 196], [600, 232], [690, 290], [780, 350]], '#b9a78e', { lw: 4, w: .6 });
  poly([[300, 350], [360, 262], [420, 232], [470, 250], [520, 290], [560, 350]], '#ab9a82', { lw: 0, w: .6 });
  // walls & towers
  ctx.save(); ctx.strokeStyle = '#8a7a66'; ctx.lineWidth = 3; ctx.beginPath();
  const wall = [[330, 206], [360, 196], [390, 184], [430, 178], [470, 176], [510, 186], [545, 198], [575, 216]];
  wall.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] - 8) : ctx.moveTo(p[0], p[1] - 8)); ctx.stroke(); ctx.restore();
  for (const [x, y] of [[360, 190], [430, 172], [510, 180], [575, 210]]) poly([[x - 7, y], [x + 7, y], [x + 7, y - 16], [x - 7, y - 16]], '#a39179', { lw: 2.5 });
}
function olive(x, y, s) {
  limb([[x, y], [x - 6 * s, y - 24 * s], [x + 4 * s, y - 44 * s]], 7 * s, '#76593c', { w: .5 });
  for (const [bx, by, rx, ry] of [[-22, -54, 24, 14], [22, -52, 26, 15], [0, -66, 32, 18]]) blob(x + bx * s, y + by * s, rx * s, ry * s, '#8b9a52', { lw: 3, w: .8 });
  blob(x - 6 * s, y - 70 * s, 14 * s, 7 * s, '#a4b266', { lw: 0 });
}
function pole(x, y) {
  limb([[x, y], [x, y - 190]], 7, '#7a5a3c', { w: .4 });
  curve([[x - 22, y - 180], [x + 22, y - 180]], 5, '#6a4a30', { w: .4 });
}
function pharmacy(x, y, t) {
  poly([[x, y], [x + 190, y], [x + 190, y - 120], [x, y - 120]], '#f1ede3', { lw: 4 });
  poly([[x - 6, y - 120], [x + 196, y - 120], [x + 196, y - 132], [x - 6, y - 132]], '#d9d3c4', { lw: 3.5 });
  poly([[x + 20, y], [x + 70, y], [x + 70, y - 76], [x + 20, y - 76]], '#8fb7c2', { lw: 3.5 });
  poly([[x + 95, y - 40], [x + 170, y - 40], [x + 170, y - 90], [x + 95, y - 90]], '#8fb7c2', { lw: 3.5 });
  poly([[x + 20, y - 76], [x + 70, y - 76], [x + 64, y - 96], [x + 26, y - 96]], '#2e9a57', { lw: 3 });
  txt('ΦΑΡΜΑΚΕΙΟ', x + 95, y - 106, 15, '#2e9a57', { font: TVFONT });
  // LED cross on a bracket: alternates cross / temperature, like every Greek pharmacy
  limb([[x + 190, y - 150], [x + 226, y - 150]], 4, '#9a9a9a', { w: .3 });
  ctx.save(); ctx.translate(x + 246, y - 150);
  poly([[-40, -40], [40, -40], [40, 40], [-40, 40]], '#1d1d1d', { lw: 3.5 });
  ctx.shadowColor = '#3dff6e'; ctx.shadowBlur = 16; ctx.fillStyle = '#3dff6e';
  if (Math.floor(t / 1.6) % 2 === 0) { ctx.fillRect(-10, -32, 20, 64); ctx.fillRect(-32, -10, 64, 20); }
  else { ctx.font = `900 30px ${TVFONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('38°', 0, 2); }
  ctx.restore();
}
function dog(x, y, t) {
  const br = 1 + Math.sin(t * 2.2) * .035, tw = (t > 14.2 && t < 14.7) ? Math.sin((t - 14.2) * 40) * 10 : 0;
  const F = '#c9a26a', Fd = '#a9844f';
  blob(x, y + 26, 90, 10, 'rgba(40,30,20,.25)', { lw: 0 });
  limb([[x - 44, y + 10], [x - 70, y + 20], [x - 92, y + 22]], 9, F, { w: .5 });
  limb([[x + 40, y + 10], [x + 64, y + 22], [x + 88, y + 24]], 9, F, { w: .5 });
  curve([[x - 72, y - 2], [x - 94, y - 8 + tw], [x - 110, y - 4 + tw]], 7, INK, { w: .4 }); SEED--;
  curve([[x - 72, y - 2], [x - 94, y - 8 + tw], [x - 110, y - 4 + tw]], 3, F, { w: .4 });
  ctx.save(); ctx.translate(x, y); ctx.scale(1, br);
  blob(0, 0, 76, 25, F, { lw: 4, w: .8 });
  blob(-10, 8, 44, 10, '#e2c795', { lw: 0 });
  ctx.restore();
  limb([[x - 30, y + 14], [x - 50, y + 26], [x - 72, y + 30]], 9, Fd, { w: .5 });
  limb([[x + 30, y + 14], [x + 52, y + 28], [x + 76, y + 30]], 9, Fd, { w: .5 });
  blob(x + 84, y - 4, 27, 21, F, { lw: 4, w: .8 });
  blob(x + 108, y + 4, 16, 11, '#b88f5a', { lw: 3.5, w: .6 });
  blob(x + 122, y + 1, 4.5, 3.5, INK, { lw: 0 });
  poly([[x + 70, y - 20], [x + 88, y - 30], [x + 92, y - 10]], Fd, { lw: 3 });
  curve([[x + 84, y - 6], [x + 92, y - 3], [x + 99, y - 6]], 3);
  // the fly
  const fx = x + 20 + Math.sin(t * 3) * 3, fy = y - 26;
  blob(fx, fy, 4, 3, INK, { lw: 0 }); blob(fx - 2, fy - 4, 4, 2, 'rgba(220,230,240,.8)', { lw: 1, rot: -.4 });
}
function truck(x, y, t) {
  const b = Math.sin(t * 22) * 1.5;
  ctx.save(); ctx.translate(x, y + b);
  blob(0, 58, 190, 10, 'rgba(40,30,20,.25)', { lw: 0 });
  // bed
  poly([[20, -20], [190, -20], [190, 36], [20, 36]], '#e9e7e2', { lw: 4.5, w: .6 });
  // cargo: the box
  ctx.save(); ctx.rotate(Math.sin(t * 11) * .015);
  poly([[50, -20], [170, -20], [170, -96], [50, -96]], '#c9995a', { lw: 4, w: .6 });
  curve([[50, -80], [170, -80]], 2.5, '#9d7440', { w: .3 });
  txt('JUMBO', 110, -62, 24, '#1f5bb8', { font: TVFONT, weight: 900 });
  txt('ΕΞΥΠΝΗ ΣΙΤΑ', 110, -36, 15, '#231a2e', { font: TVFONT, weight: 900 });
  // discount sticker
  ctx.save(); ctx.translate(160, -96); ctx.rotate(.3);
  const pts = []; for (let i = 0; i < 18; i++) { const r = i % 2 ? 18 : 26, a = i / 18 * TAU; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
  poly(pts, '#e8392b', { lw: 3, w: .4 }); txt('-50%', 0, 1, 13, '#fff', { font: TVFONT, weight: 900 });
  ctx.restore(); ctx.restore();
  // cab
  poly([[-170, 36], [20, 36], [20, -60], [-40, -60], [-80, -104], [-140, -104], [-160, -56], [-176, -44], [-176, 20]], '#f2f0ea', { lw: 4.5, w: .6 });
  poly([[-76, -96], [-136, -96], [-148, -60], [-44, -60]], '#9cc5d6', { lw: 3.5, w: .5 });
  curve([[-92, -96], [-92, -60]], 3.5);
  // driver: μπάρμπας with cap, elbow out, cigarette
  blob(-68, -74, 16, 16, '#d9a882', { lw: 3.5 });
  poly([[-86, -84], [-52, -84], [-50, -94], [-84, -96]], '#2f5f8a', { lw: 3 }); poly([[-86, -84], [-100, -82], [-86, -88]], '#2f5f8a', { lw: 2.5 });
  curve([[-72, -64], [-60, -64]], 3, '#c9c9c9');
  limb([[-60, -56], [-40, -50], [-24, -56]], 8, '#d9a882', { w: .4 });
  curve([[-22, -60], [-12, -64]], 3, '#f4f4f4', { w: .2 });
  for (let i = 0; i < 3; i++) { const p = (t * .8 + i / 3) % 1; blob(-10 + p * 40, -70 - p * 40, 4 + p * 8, 4 + p * 8, `rgba(200,200,200,${.5 * (1 - p)})`, { lw: 0 }); }
  // details
  poly([[-176, 0], [-164, 0], [-164, -14], [-176, -14]], '#f5d76e', { lw: 3 });
  poly([[-120, -30], [-100, -30], [-100, -24], [-120, -24]], '#aaa', { lw: 2 });
  curve([[-40, 36], [-40, -52]], 2.5, '#bdbbb4');
  poly([[-178, 20], [-150, 20], [-150, 36], [-178, 36]], '#bdbbb4', { lw: 3 });
  for (const wx of [-120, 130]) {
    const rot = -t * 14;
    blob(wx, 40, 27, 27, '#2b2a2e', { lw: 4, w: .5 });
    blob(wx, 40, 12, 12, '#c9c9c9', { lw: 3, w: .4 });
    curve([[wx + Math.cos(rot) * 10, 40 + Math.sin(rot) * 10], [wx - Math.cos(rot) * 10, 40 - Math.sin(rot) * 10]], 2.5);
  }
  ctx.restore();
}
function landscape(t) {
  const g = ctx.createLinearGradient(0, -100, 0, 360);
  g.addColorStop(0, '#a9d7ea'); g.addColorStop(.7, '#e5ecdc'); g.addColorStop(1, '#f6ecd0');
  ctx.fillStyle = g; ctx.fillRect(-400, -300, 2100, 700);
  blob(1060, 90, 46, 46, '#fffbe6', { lw: 0, glow: '#fff4b0', gb: 60 });
  // Γεράνεια, far and hazy
  poly([[700, 350], [860, 270], [980, 300], [1100, 250], [1260, 300], [1500, 350]], '#b9c6cf', { lw: 0, w: .5 });
  acrocorinth();
  // sea strip with a lazy wave
  poly([[-400, 340], [1700, 340], [1700, 372], [-400, 372]], '#5fb0c7', { lw: 0 });
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) { const wx = ((i * 260 + t * 22) % 1700) - 300; ctx.beginPath(); ctx.moveTo(wx, 356); ctx.quadraticCurveTo(wx + 20, 350, wx + 40, 356); ctx.stroke(); }
  ctx.restore();
  // κάμπος
  poly([[-400, 368], [1700, 368], [1700, 520], [-400, 520]], '#d8c07a', { lw: 0 });
  for (let r = 0; r < 4; r++) for (let i = 0; i < 16; i++) blob(-180 + i * 110 + (r % 2) * 55, 392 + r * 26, 14 + r * 3, 8 + r * 2, r % 2 ? '#6f8a3e' : '#7f9848', { lw: 0, w: .5 });
  curve([[-400, 368], [1700, 368]], 3, '#9d8a58');
  olive(90, 505, 1.3); olive(260, 500, 1); olive(1210, 505, 1.2);
  pharmacy(900, 512, t);
  // road
  poly([[-400, 512], [1700, 512], [1700, 640], [-400, 640]], '#5d5b60', { lw: 0 });
  curve([[-400, 512], [1700, 512]], 4); curve([[-400, 640], [1700, 640]], 4);
  ctx.save(); ctx.fillStyle = '#e9e2c8'; for (let i = -6; i < 30; i++) ctx.fillRect(i * 70, 574, 38, 5); ctx.restore();
  poly([[-400, 640], [1700, 640], [1700, 760], [-400, 760]], '#cdb372', { lw: 0 });
  for (let i = 0; i < 20; i++) curve([[-200 + i * 95, 668 + hash(i) * 40], [-190 + i * 95, 652 + hash(i) * 40]], 3, '#8f8a4a', { w: .5 });
  // heat shimmer
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2;
  for (let k = 0; k < 5; k++) { ctx.beginPath(); for (let x = -400; x <= 1700; x += 20) { const yy = 500 - k * 10 + Math.sin(x * .03 + t * 5 + k) * 3; x === -400 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); }
  ctx.restore();
  pole(640, 516); pole(-60, 516); pole(1340, 516);
  ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 2;
  for (const dy of [0, 10]) { ctx.beginPath(); ctx.moveTo(-60, 336 + dy); ctx.quadraticCurveTo(290, 380 + dy, 640, 336 + dy); ctx.quadraticCurveTo(990, 380 + dy, 1340, 336 + dy); ctx.stroke(); }
  ctx.restore();
}

/* =========================================================
   TIMELINE
   ========================================================= */
const LINES = [
  { a: 4.6, b: 9.2, who: 'narrator', nosub: true, el: 'Λέχαιο. Αύγουστος. Τριάντα οχτώ βαθμοί υπό σκιά.', en: 'Lechaio. August. Thirty-eight degrees in the shade.' },
  { a: 10.6, b: 15.4, who: 'narrator', nosub: true, el: 'Η ανθρωπότητα δεν ήξερε ότι το τέλος της πλησίαζε…', en: 'Humanity had no idea its end was near…' },
  { a: 18.6, b: 22.4, who: 'narrator', nosub: true, el: '…και ότι θα ερχόταν σε έκπτωση.', en: '…or that it would arrive on sale.' },
];
const CAMK = [[0, 640, 380, 1.05], [4, 640, 380, 1.05], [9.8, 640, 400, 1], [15.8, 610, 575, 1.9], [16.8, 600, 530, 1.5], [22.6, 560, 470, 1.2], [40, 560, 470, 1.2]];
function cam(t) {
  let i = 0; while (i < CAMK.length - 2 && t >= CAMK[i + 1][0]) i++;
  const a = CAMK[i], b = CAMK[i + 1], k = ease(clamp((t - a[0]) / (b[0] - a[0])));
  return { x: lerp(a[1], b[1], k), y: lerp(a[2], b[2], k), z: lerp(a[3], b[3], k) };
}
const truckX = t => lerp(1700, -600, prog(t, 16.6, 23.2));
function mosqPath(t) {   // screen-space flight in the black opening
  return { x: 640 + Math.sin(t * 1.3) * 420 + Math.sin(t * 5.1) * 40, y: 360 + Math.sin(t * 2.1) * 120 + Math.cos(t * 6.3) * 30, s: 1.4 + Math.sin(t * .9) * .5, f: Math.cos(t * 1.3) > 0 ? 1 : -1 };
}

function drawWorld(t) {
  const c = cam(t);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y);
  landscape(t);
  const tx = truckX(t); if (tx < 1650 && tx > -550) {     // far lane, behind the dog
    ctx.save(); ctx.translate(tx, 522); ctx.scale(.8, .8); truck(0, 0, t); ctx.restore();
    for (let i = 0; i < 8; i++) { const p = ((t * 2 + i / 8) % 1); blob(tx + 160 + p * 140, 560 - p * 30, 8 + p * 22, 6 + p * 15, `rgba(215,195,150,${.55 * (1 - p)})`, { lw: 0 }); }
  }
  dog(600, 604, t);
  ctx.restore();
}
function mangaFlash(t) {
  const k = prog(t, 23.9, 24.25);
  ctx.fillStyle = '#f4f1ea'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#231a2e';
  for (let y = 0; y < H; y += 9) for (let x = (y / 9) % 2 ? 4 : 0; x < W; x += 9) { const d = Math.hypot(x - 640, y - 360) / 700; ctx.beginPath(); ctx.arc(x, y, 1.1 + d * 2.2, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = '#231a2e';
  for (let i = 0; i < 70; i++) { const a = hash(i) * TAU, r0 = 170 + hash(i + 9) * 90; ctx.lineWidth = 1 + hash(i + 3) * 4; ctx.beginPath(); ctx.moveTo(640 + Math.cos(a) * r0, 360 + Math.sin(a) * r0); ctx.lineTo(640 + Math.cos(a) * 900, 360 + Math.sin(a) * 900); ctx.stroke(); }
  ctx.fillStyle = '#f4f1ea'; ctx.beginPath(); ctx.arc(640, 360, 170, 0, TAU); ctx.fill();
  ctx.save(); ctx.filter = 'grayscale(1) contrast(1.6)'; mosquito(640, 360, 7, t, -1); ctx.restore();
  ctx.save(); ctx.translate(900, 170); ctx.rotate(-.18); ctx.scale(1 + k * .15, 1 + k * .15);
  txt('ΖΖΖ!', 0, 0, 130, '#f4f1ea', { font: TVFONT, style: 'italic', weight: 900, stroke: 16, sc: '#231a2e' });
  ctx.restore();
  ctx.lineWidth = 14; ctx.strokeStyle = '#231a2e'; ctx.strokeRect(7, 7, W - 14, H - 14);
}
function titleCard(t) {
  ctx.fillStyle = '#d7c69b'; ctx.fillRect(0, 0, W, H);
  const k = back(prog(t, 24.4, 25.5));
  const panel = (x0, side) => {
    ctx.save(); ctx.translate(x0, 0);
    ctx.fillStyle = 'rgba(28,26,30,.93)'; ctx.fillRect(0, 0, 640, H);
    ctx.strokeStyle = 'rgba(120,120,125,.55)'; ctx.lineWidth = 2;
    for (let x = 12; x < 640; x += 14) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + Math.sin(t * 2 + x) * 1.5, H); ctx.stroke(); }
    ctx.fillStyle = '#0d0c0e'; ctx.fillRect(side > 0 ? 626 : 0, 0, 14, H); ctx.fillRect(0, 0, 640, 18); ctx.fillRect(0, H - 18, 640, 18);
    for (let i = 0; i < 9; i++) { ctx.fillStyle = '#5b5b62'; ctx.fillRect(side > 0 ? 626 : 0, 50 + i * 72, 14, 22); }
    ctx.restore();
  };
  const flap = Math.max(0, Math.sin((t - 25.5) * 3)) * 10 * (1 - prog(t, 25.5, 28));
  panel(lerp(-660, 0 - flap, k), 1); panel(lerp(1300, 640 + flap, k), -1);
  if (t > 25.35) {
    const p = back(prog(t, 25.6, 26.3));
    ctx.save(); ctx.translate(640, 330); ctx.rotate(-.05); ctx.scale(p, p);
    const pts = []; for (let i = 0; i < 32; i++) { const r = i % 2 ? 250 : 300, a = i / 32 * TAU; pts.push([Math.cos(a) * r * 1.5, Math.sin(a) * r * .75]); }
    poly(pts, '#ffd23f', { lw: 7, w: .8 });
    txt('Η ΕΞΥΠΝΗ', 0, -52, 92, '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 14, sc: '#fff' });
    txt('ΣΙΤΑ', 0, 50, 132, '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 16, sc: '#fff' });
    ctx.restore();
  }
  if (t > 26.6) {
    ctx.save(); ctx.globalAlpha = prog(t, 26.6, 27.2); ctx.translate(640, 560);
    poly([[-150, -26], [150, -26], [140, 26], [-160, 26]], '#231a2e', { lw: 0 });
    txt(lang === 'el' ? 'ΕΠΕΙΣΟΔΙΟ 1' : 'EPISODE 1', 0, 0, 30, '#fff', { font: TVFONT, style: 'italic', weight: 900 });
    ctx.restore();
  }
}
function drawSubs(t) {
  const L = LINES.find(l => t >= l.a && t < l.b); if (!L) return;
  const s = lang === 'el' ? L.el : L.en;
  ctx.font = 'italic 700 30px "Noto Sans", sans-serif';
  const w = ctx.measureText(s).width + 56, a = Math.min(prog(t, L.a, L.a + .25), 1 - prog(t, L.b - .25, L.b));
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(15,12,18,.72)';
  ctx.beginPath(); ctx.roundRect(640 - w / 2, 628, w, 54, 12); ctx.fill();
  txt(s, 640, 656, 30, '#fffaf0', { font: TVFONT, style: 'italic' });
  ctx.restore();
}
function render(t) {
  SEED = 0; BOIL = Math.floor(t * 8);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < 4.3) {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const m = mosqPath(t); ctx.save(); ctx.globalAlpha = .85; mosquito(m.x, m.y, m.s, t, m.f); ctx.restore();
  } else if (t < 23.9) {
    drawWorld(t);
    const fade = 1 - prog(t, 4.3, 6.2);
    if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
    if (t > 22.8) { const p = prog(t, 22.8, 23.9), s = lerp(1, 9, p * p); mosquito(lerp(1100, 640, p), lerp(200, 360, p), s, t, -1); }
  } else if (t < 24.25) mangaFlash(t);
  else titleCard(t);
  drawSubs(t);
  const out = prog(t, 32.4, 33.6);
  if (out > 0) { ctx.fillStyle = `rgba(0,0,0,${out})`; ctx.fillRect(0, 0, W, H); }
}


return {
  id: 'scene01', title: '1 · Cold open', dur: 34, poster: 25.8, lines: LINES, render,
  events: [[16.9, SFX.rev], [23.9, () => { SFX.slap(); SFX.boom(); }], [25.45, SFX.clack], [25.9, SFX.jingle]],
  ambience: t => ({ mosq: t < 4.3 ? .06 : t > 22.6 && t < 23.9 ? .09 : t < 22.6 ? .006 : 0, cicada: t > 4.3 && t < 23.9 ? .035 : 0 }),
};
})());
