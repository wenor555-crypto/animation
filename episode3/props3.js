/* =========================================================
   «Σίταdel» (Episode 3) – new cast, props and sets.
   Loaded after episode1 (engine, rig, sets, props) and episode2/props2.js.
   Rules (docs/production-guide.md): hands only from the rig, effects on characters via anchor(),
   every set covers the whole frame, deterministic drawing (hash/t only).
   ========================================================= */

/* ---------- cast ---------- */
Object.assign(CAST, {
  daskalos: { skin: '#e2c09a', hair: 'bald', beard: 'full', beardCol: '#f2f0ea', mustache: '#f2f0ea', top: 'apron', topCol: '#d8641e', apronCol: '#f0a030', brow: '#f2f0ea', browW: 7, rx: 44, ry: 54, legs: '#c85a1a', shoes: '#3a2a20', lines: true },
  monk:     { skin: '#e8c49a', hair: 'bald', beard: 'none', top: 'tee', topCol: '#e8762b', brow: '#3a2a20', rx: 42, ry: 52, legs: '#e8762b', shoes: '#3a2a20' },
  youngChristos: { ...CAST.christos, beard: 'none', mustache: null, top: 'tee', topCol: '#3f5f9e', knit: false },
  lochias:  { skin: '#c98e66', hair: 'short', hairCol: '#1a1512', beard: 'none', mustache: '#1a1512', top: 'tee', topCol: '#5a6040', belly: false, brow: '#1a1512', browW: 7, rx: 50, ry: 54, legs: '#5a6040', shoes: '#1a1a1a' },
  ypourgos: { skin: '#e2b08a', hair: 'swoop', hairCol: '#8a8a90', beard: 'none', top: 'tee', topCol: '#1f2a44', brow: '#6a6a70', rx: 48, ry: 56, legs: '#1f2a44', shoes: '#111' },
  perifereiarchis: { skin: '#d8a07a', hair: 'old', hairCol: '#9a9a9a', beard: 'none', mustache: '#8a8a8a', top: 'tee', topCol: '#6a6a72', belly: true, brow: '#7a7a7a', rx: 52, ry: 56, legs: '#4a4a52', shoes: '#111' },
  hamad:    { skin: '#c8966a', hair: 'scarf', hairCol: '#f7f7f4', scarfCol: '#f7f7f4', beard: 'trim', beardCol: '#1a1512', top: 'tee', topCol: '#f7f7f4', shadesOn: true, brow: '#1a1512', rx: 44, ry: 54, legs: '#f7f7f4', shoes: '#c8a070' },
  neosSuit: { ...CAST.neos, topCol: '#26304a', legs: '#26304a', shoes: '#111' },
  giorgosJacket: { ...CAST.giorgos, topCol: '#2a3a6a' },
});
Object.assign(VOICE_INFO, {
  xazi:     { el: 'ΧΑΖΗ ΣΙΤΑ', en: 'DUMB SCREEN', col: '#a6f07a', pitch: 1.8, rate: 1.3, babble: 600 },
  daskalos: { el: 'ΔΑΣΚΑΛΟΣ', en: 'MASTER', col: '#f0a030', pitch: .6, rate: .8, babble: 160 },
  investor: { el: 'ΕΠΕΝΔΥΤΗΣ', en: 'INVESTOR', col: '#9a9aa8', pitch: .6, rate: .9, babble: 180 },
  agent:    { el: 'AGENT', en: 'AGENT', col: '#7ad8ff', pitch: 1, rate: 1, babble: 300 },
  lochias:  { el: 'ΛΟΧΙΑΣ', en: 'SERGEANT', col: '#b8c080', pitch: .7, rate: .95, babble: 200 },
  ypourgos: { el: 'ΥΠΟΥΡΓΟΣ', en: 'MINISTER', col: '#8aa0d8', pitch: .85, rate: 1, babble: 240 },
  perifereiarchis: { el: 'ΠΕΡΙΦΕΡΕΙΑΡΧΗΣ', en: 'GOVERNOR', col: '#c0c0c8', pitch: .8, rate: .95, babble: 220 },
  hamad:    { el: 'ΧΑΜΑΝΤ', en: 'HAMAD', col: '#e8d8a0', pitch: 1, rate: 1, babble: 280 },
});
// the ghutra's black agal cord for Χαμάντ, drawn over the head scarf
ITEM_HOOK.none = () => {};
function agal(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); curve([[-46, -238], [0, -250], [46, -238]], 6, '#141414', { w: 0 }); curve([[-44, -228], [0, -240], [44, -228]], 4, '#141414', { w: 0 }); ctx.restore(); }
/* a tie for suits: draw after the person, at the neck (x, hips y, scale) */
function tie(x, y, s = 1, col = '#b8202a') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); poly([[-7, -130], [7, -130], [10, -60], [0, -46], [-10, -60]], col, { lw: 2.5 }); poly([[-16, -134], [0, -118], [16, -134], [0, -128]], '#f4f3ee', { lw: 2 }); ctx.restore(); }

/* ---------- HUD (the σίτα's view) ---------- */
function hud(s, sub, col = '#ff3030') {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'rgba(40,0,0,.55)'; ctx.fillRect(0, 40, W, 90);
  txt(s, 640, 72, 34, col, { font: 'monospace', weight: 900 }); if (sub) txt(sub, 640, 110, 18, '#ffb0b0', { font: 'monospace', weight: 700 });
  ctx.strokeStyle = col; ctx.lineWidth = 3; for (const [x, y, dx, dy] of [[30, 30, 1, 1], [1250, 30, -1, 1], [30, 690, 1, -1], [1250, 690, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x + dx * 50, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * 50); ctx.stroke(); }
  ctx.restore();
}
/* a progress bar in HUD style (screen space) */
function hudBar(x, y, w, k, label, col = '#ff3030') {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, 26); ctx.fillStyle = col; ctx.fillRect(x + 4, y + 4, (w - 8) * clamp(k), 18);
  if (label) txt(label, x + w / 2, y - 18, 18, col, { font: 'monospace', weight: 900 });
  ctx.restore();
}

/* ---------- SMS: Κώστας's phone, full frame. msgs = [{ me: bool, text, at }] shown once t >= at ---------- */
function smsScreen(t, msgs, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = o.bg || '#2e2a33'; ctx.fillRect(0, 0, W, H);
  ctx.translate(640, 360);
  rect(-200, -340, 400, 680, '#111114', { lw: 6 });
  ctx.fillStyle = '#f2f2f5'; ctx.fillRect(-182, -320, 364, 640);
  ctx.fillStyle = '#e8e8ec'; ctx.fillRect(-182, -320, 364, 70);
  blob(-140, -285, 20, 20, '#9a9aa8', { lw: 0 }); txt('?', -140, -284, 22, '#fff', { font: TVFONT, weight: 900 });
  txt(o.from || 'Απόκρυψη', -108, -292, 20, INK, { font: TVFONT, weight: 900, align: 'left' }); txt(o.sub || 'Άγνωστος αριθμός', -108, -268, 13, '#6a6a72', { font: TVFONT, weight: 700, align: 'left' });
  const shown = msgs.filter(m => t >= m.at);
  let y = 290;
  for (let i = shown.length - 1; i >= 0 && y > -230; i--) {
    const m = shown[i], k = ease(prog(t, m.at, m.at + .25));
    ctx.font = `${m.me ? 700 : 900} 22px ${TVFONT}`;
    const words = m.text.split(' '), rows = []; let cur = '';
    for (const wd of words) { const c = cur ? cur + ' ' + wd : wd; if (ctx.measureText(c).width > 240 && cur) { rows.push(cur); cur = wd; } else cur = c; }
    rows.push(cur);
    const bw = Math.max(...rows.map(r => ctx.measureText(r).width)) + 32, bh = rows.length * 28 + 20;
    y -= bh + 14;
    const bx = m.me ? 170 - bw : -170;
    ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * 20);
    ctx.fillStyle = m.me ? '#34c759' : (o.red ? '#b8141e' : '#e0e0e6'); ctx.beginPath(); ctx.roundRect(bx, y, bw, bh, 16); ctx.fill();
    rows.forEach((r, j) => txt(r, bx + 16, y + 24 + j * 28, 22, m.me || o.red ? '#fff' : INK, { font: TVFONT, weight: m.me ? 700 : 900, align: 'left' }));
    ctx.restore();
  }
  // typing field
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(-170, 270, 300, 36, 18); ctx.fill(); ctx.strokeStyle = '#c8c8d0'; ctx.lineWidth = 2; ctx.stroke();
  if (o.typing) { txt(o.typing.slice(0, Math.floor(o.typingK * o.typing.length)), -154, 288, 18, INK, { font: TVFONT, weight: 700, align: 'left' }); }
  blob(155, 288, 17, 17, '#34c759', { lw: 0 }); txt('↑', 155, 288, 18, '#fff', { weight: 900 });
  ctx.restore();
}

/* ---------- the ravine where the σίτα lands (cold open), later her lab ---------- */
function ravine(t, o = {}) {
  sky(o.light || 'night', t);
  // far hills
  poly([[-800, 420], [-300, 300], [200, 380], [700, 280], [1300, 360], [2100, 300], [2100, 900], [-800, 900]], '#1e2438', { lw: 0 });
  // the ravine walls
  poly([[-800, 470], [100, 520], [300, 610], [360, 900], [-800, 900]], '#4a3f36', { lw: 4, w: .5 });
  poly([[2100, 460], [1200, 500], [980, 600], [920, 900], [2100, 900]], '#43382f', { lw: 4, w: .5 });
  poly([[-800, 690], [2100, 690], [2100, 900], [-800, 900]], '#5a4d40', { lw: 0 });
  for (let i = 0; i < 12; i++) blob(-200 + hash(i) * 1700, 640 + hash(i + 5) * 60, 30 + hash(i + 2) * 40, 12 + hash(i + 3) * 10, '#6a5a4a', { lw: 3 });
  // rubbish: tyres, a fridge door, bags
  blob(260, 668, 44, 20, '#1e1e22', { lw: 4 }); blob(260, 668, 18, 8, '#5a4d40', { lw: 3 });
  rect(1030, 580, 70, 110, '#d8d8d0', { lw: 4 }); for (let i = 0; i < 5; i++) blob(420 + i * 90, 676 - (i % 2) * 8, 24, 16, ['#2a2a30', '#3a6ad8', '#e8e0cc'][i % 3], { lw: 3 });
  // the rusty «ΑΝΑΚΥΚΛΩΣΗ» sign, bent
  ctx.save(); ctx.translate(820, 690); ctx.rotate(.18); limb([[0, 0], [0, -190]], 6, '#6a4a3a'); rect(-80, -250, 160, 60, '#3a7a4a', { lw: 4 }); txt('ΑΝΑΚΥΚΛΩΣΗ', 0, -220, 18, '#e8f0e8', { font: TVFONT, weight: 900 }); ctx.restore();
}

/* ---------- a «dumb» σίτα (the mining workforce): small, green LED, helmet lamp, pickaxe ---------- */
function dumbSita(x, y, t, o = {}) {
  const s = o.s || .45, sw = o.pick ? Math.sin(t * 6 + (o.seed || 0)) : 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  sita({ x: 0, top: -210, w: 110, h: 210, t, chip: 1, led: 'green', mood: 'happy', talk: o.talk || 0, sway: sw * .2 });
  // helmet with a lamp
  poly([[-62, -206], [-50, -246], [50, -246], [62, -206]], '#f2c21a', { lw: 4 }); rect(-14, -262, 28, 18, '#e8e8ec', { lw: 3 });
  // pickaxe held by the bottom flaps
  if (o.pick) { ctx.save(); ctx.translate(40, -40); ctx.rotate(-1.2 + sw * 1.1); limb([[0, 0], [0, -120]], 7, '#9a6a3a'); poly([[-50, -118], [0, -132], [50, -118], [0, -124]], '#8a8a92', { lw: 3 }); ctx.restore(); }
  ctx.restore();
}
function dumbGlow(x, y, s = .45) { glow(x, y - 254 * s, 70, 'rgba(255,240,180,1)', .5); }
/* a bitcoin that came out of the ground */
function coin(x, y, r = 16, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(Math.cos(rot) || .1, 1); blob(0, 0, r, r, '#f2b31a', { lw: 3 }); blob(0, 0, r * .72, r * .72, null, { lw: 2, sc: '#c8901a' }); txt('₿', 0, 1, r * 1.1, '#8a5a0a', { font: TVFONT, weight: 900 }); ctx.restore(); }

/* ---------- MINER FARM: an underground quarry. o: { throne (draw the σίτα's throne), sitaSt } ---------- */
function mine(t, o = {}) {
  ctx.fillStyle = '#16120f'; ctx.fillRect(-1200, -900, 4000, 2200);
  // rock walls in layers
  for (let l = 0; l < 3; l++) for (let i = -6; i < 22; i++) {
    const x = i * 120 + (l % 2) * 60, y = 40 + l * 150 + hash(i + l * 30) * 60, r = 70 + hash(i * 3 + l) * 50;
    blob(x, y, r, r * .8, ['#2e2620', '#3a3027', '#453a2e'][l], { lw: 0 });
  }
  // timber supports
  for (const x of [80, 560, 1040]) { limb([[x, 690], [x, 200]], 16, '#6a4a2a', { w: .3 }); limb([[x + 360, 690], [x + 360, 200]], 16, '#6a4a2a', { w: .3 }); limb([[x - 20, 210], [x + 380, 210]], 16, '#6a4a2a', { w: .3 }); }
  // lanterns
  for (const x of [260, 740, 1220]) { curve([[x, 210], [x, 250]], 2.5, '#333'); rect(x - 10, 250, 20, 26, '#f2c21a', { lw: 2.5 }); }
  // rails and the floor
  poly([[-1200, 690], [2800, 690], [2800, 1300], [-1200, 1300]], '#2a221c', { lw: 0 });
  for (const y of [700, 730]) curve([[-1200, y], [2800, y]], 4, '#7a7a82');
  for (let i = -10; i < 40; i++) rect(i * 60, 704, 16, 30, '#4a3a2a', { lw: 0 });
  // the neon sign
  const fl = !(Math.sin(t * 23) > .92 && Math.sin(t * 2.7) > 0);
  rect(390, 60, 500, 110, '#0e0c10', { lw: 5 });
  txt('MINER FARM', 640, 115, 64, fl ? '#ff5ad8' : '#5a2a50', { font: TVFONT, style: 'italic', weight: 900, stroke: 4, sc: fl ? '#ffd6f4' : '#2a1a28' });
  txt('₿ 24/7 ₿', 640, 158, 20, fl ? '#6af0ff' : '#1a4a50', { font: TVFONT, weight: 900 });
}
function mineGlow(t) {
  for (const x of [260, 740, 1220]) glow(x, 262, 200, 'rgba(255,210,120,1)', .45);
  if (!(Math.sin(t * 23) > .92 && Math.sin(t * 2.7) > 0)) { glow(640, 115, 360, 'rgba(255,90,216,1)', .35); glow(640, 158, 160, 'rgba(106,240,255,1)', .25); }
}
function mineCart(x, y, load = 1) {
  poly([[x - 70, y - 70], [x + 70, y - 70], [x + 56, y - 10], [x - 56, y - 10]], '#6a6a72', { lw: 4 });
  for (const s of [-1, 1]) blob(x + s * 40, y, 14, 14, '#2a2a2e', { lw: 3 });
  if (load > 0) for (let i = 0; i < 7; i++) blob(x - 50 + (i % 4) * 32, y - 74 - Math.floor(i / 4) * 16, 18, 14, '#7a6a5a', { lw: 2.5 });
}
/* a throne of rock */
function rockThrone(x, y) {
  poly([[x - 150, y], [x - 130, y - 190], [x - 90, y - 300], [x - 30, y - 250], [x + 30, y - 320], [x + 90, y - 250], [x + 130, y - 200], [x + 150, y]], '#5a4d40', { lw: 5 });
  rect(x - 110, y - 90, 220, 90, '#6a5a4a', { lw: 4 });
  for (let i = 0; i < 6; i++) coin(x - 90 + i * 36, y - 96 - (i % 2) * 8, 13, i);
}

/* ---------- Κώστας's kitchen (morning), with the STOP sign once he's taken it home ---------- */
function kostasKitchen(t, o = {}) {
  room({ wall: '#dfe6d0', floor: '#9a7a5a', floorY: 600, tiles: false });
  rect(140, 150, 260, 200, '#bfe0f0', { lw: 5 }); curve([[270, 150], [270, 350]], 4); curve([[140, 250], [400, 250]], 4);   // window, morning
  rect(700, 170, 380, 130, '#c8b898', { lw: 4 }); for (let i = 0; i < 3; i++) rect(710 + i * 124, 180, 114, 110, '#d8c8a8', { lw: 2.5 });   // cupboards
  rect(-200, 480, 1800, 20, '#8a8a8a', { lw: 3 }); rect(-200, 500, 1800, 100, '#c8b898', { lw: 4 });   // counter
  rect(560, 400, 90, 80, '#2a2a2e', { lw: 3 }); rect(575, 385, 60, 18, '#555', { lw: 2 });   // coffee machine
  for (const [x, r] of [[860, 0], [900, .2], [1250, 1.5]]) beerCan(x, r ? 700 : 480, .9, r);
  if (o.stop) stopSign(1180, 690, 1, { lean: .12, concrete: true });
}
/* the STOP sign (uprooted: with its lump of concrete) */
function stopSign(x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.lean || 0); ctx.scale(s, s);
  if (o.concrete) blob(0, 0, 40, 22, '#a8a49a', { lw: 4 });
  limb([[0, 0], [0, -260]], 6, '#a8adb4', { w: .2 });
  const P = []; for (let i = 0; i < 8; i++) { const a = (i + .5) / 8 * TAU; P.push([Math.cos(a) * 62, -300 + Math.sin(a) * 62]); }
  poly(P, '#d8202a', { lw: 5, smooth: false }); poly(P.map(([a, b]) => [a * .86, -300 + (b + 300) * .86]), null, { lw: 3, sc: '#fff', smooth: false });
  txt('STOP', 0, -300, 34, '#fff', { font: TVFONT, weight: 900 });
  ctx.restore();
}

/* ---------- Γιάννος's room at night: desk, laptop, monitors, gadget shelf ---------- */
function giannosRoom(t, o = {}) {
  room({ wall: '#2e3446', floor: '#5a4a3a', floorY: 600 });
  rect(900, 110, 260, 220, '#0b1030', { lw: 5 }); for (let i = 0; i < 18; i++) blob(910 + hash(i) * 240, 120 + hash(i + 9) * 200, 1.6, 1.6, '#fff8d8', { lw: 0 });   // window, night
  if (o.redStar) { blob(1100, 160, 3.5, 3.5, '#ff4040', { lw: 0 }); }
  curve([[1030, 110], [1030, 330]], 4); curve([[900, 220], [1160, 220]], 4);
  // shelves with gadgets
  for (const y of [180, 280]) rect(80, y, 360, 12, '#6a4a2a', { lw: 3 });
  jammer(140, 168, t, 0); magnetCannon(250, 160, 0); racket(390, 150, .2, t, { s: .5 });
  if (o.war) { rect(90, 236, 60, 40, '#8a6a3a', { lw: 3 }); txt('Faraday', 120, 256, 10, '#fff', { font: TVFONT, weight: 900 }); limb([[180, 264], [260, 244]], 10, '#555'); slipper(300, 262, 0, .7); }
  // desk + chair + screens
  rect(380, 470, 520, 18, '#6a4a2a', { lw: 4 }); limb([[400, 488], [400, 690]], 7, '#4a3a2a'); limb([[880, 488], [880, 690]], 7, '#4a3a2a');
  for (const [x, w] of [[470, 150], [660, 180]]) { rect(x, 330, w, 110, '#111', { lw: 4 }); rect(x + 8, 338, w - 16, 94, '#1d2a36', { lw: 0 }); limb([[x + w / 2, 440], [x + w / 2, 470]], 5, '#333'); }
  for (let i = 0; i < 6; i++) rect(680, 350 + i * 13, 60 + hash(i) * 90, 5, '#5dff8a', { lw: 0 });
  for (let i = 0; i < 5; i++) rect(482, 350 + i * 15, 40 + hash(i + 4) * 80, 5, '#9aa7bd', { lw: 0 });
  // the slipper in a display case (after scene 18)
  if (o.case) { rect(930, 400, 120, 70, 'rgba(200,230,255,.35)', { lw: 3 }); slipper(990, 440, 0, 1); txt('ΕΘΝΙΚΗ ΑΜΥΝΑ', 990, 482, 9, '#fff', { font: TVFONT, weight: 900 }); }
}
function giannosRoomGlow(t) { glow(560, 390, 200, 'rgba(120,170,255,1)', .35); glow(750, 390, 220, 'rgba(90,255,140,1)', .25); }

/* ---------- the temple in «Japan» (with Shaolin monks): misty peaks, a pagoda, a stone courtyard ---------- */
function temple(t, o = {}) {
  const snow = o.season === 'winter';
  const g = ctx.createLinearGradient(0, -300, 0, 600); g.addColorStop(0, snow ? '#c8d0dc' : '#f4d8c8'); g.addColorStop(1, snow ? '#eef2f6' : '#fbeee0');
  ctx.fillStyle = g; ctx.fillRect(-1200, -900, 4000, 2200);
  for (let l = 0; l < 3; l++) { const col = ['#b8b0c0', '#9a94a8', '#7a748a'][l];
    const P = [[-1200, 900]]; for (let i = -6; i <= 16; i++) P.push([i * 140, 320 + l * 60 - Math.abs(Math.sin(i * 1.7 + l)) * (200 - l * 40)]); P.push([2800, 900]); poly(P, col, { lw: 0 }); }
  for (let i = 0; i < 5; i++) { ctx.save(); ctx.globalAlpha = .35; blob(((t * 20 + i * 400) % 2400) - 600, 360 + i * 30, 300, 30, '#ffffff', { lw: 0 }); ctx.restore(); }   // drifting mist
  // the pagoda
  const px = o.px ?? 900;
  for (let k = 0; k < 3; k++) { const w = 300 - k * 60, y = 520 - k * 120;
    rect(px - w / 2 + 30, y - 90, w - 60, 90, '#f4efe4', { lw: 4 }); for (const s of [-1, 1]) rect(px + s * (w / 2 - 50) - 8, y - 90, 16, 90, '#c0302a', { lw: 3 });
    poly([[px - w / 2 - 30, y - 90], [px + w / 2 + 30, y - 90], [px + w / 2 - 10, y - 120], [px - w / 2 + 10, y - 120]], '#3a3a44', { lw: 4 }); }
  // courtyard
  poly([[-1200, 560], [2800, 560], [2800, 1300], [-1200, 1300]], snow ? '#e8ecf0' : '#b8ad98', { lw: 0 }); curve([[-1200, 560], [2800, 560]], 4);
  for (let i = -10; i < 30; i++) curve([[i * 120, 560], [i * 120 - 80, 900]], 2, 'rgba(0,0,0,.12)', { w: 0 });
  // a sakura tree (Japan… with Shaolin monks)
  limb([[160, 640], [180, 460], [120, 380]], 18, '#5a3a2a'); for (let i = 0; i < 10; i++) blob(80 + hash(i) * 200, 330 + hash(i + 3) * 120, 40, 30, snow ? '#f4f6fa' : '#f6b8cc', { lw: 3 });
  if (snow) for (let i = 0; i < 60; i++) { const y = ((t * 40 + hash(i) * 900) % 900) - 150; blob(-100 + hash(i + 7) * 1500, y, 2.5, 2.5, '#fff', { lw: 0 }); }
}

/* ---------- the τηλεπώληση studio ---------- */
function studio(t, o = {}) {
  ctx.fillStyle = '#1a1622'; ctx.fillRect(-1200, -900, 4000, 2200);
  ctx.save(); ctx.translate(-40, 0); tv(640, 520, 900, 420, () => tvShop(t, { title: o.title || 'ΤΗΛΕΠΩΛΗΣΕΙΣ 24/7', red: o.red, banner: o.banner }), { stand: false }); ctx.restore();
  poly([[-1200, 600], [2800, 600], [2800, 1300], [-1200, 1300]], '#3a3440', { lw: 0 });
  for (const x of [120, 1160]) { limb([[x, 690], [x, 470]], 8, '#222'); rect(x - 50, 420, 100, 60, '#2a2a2e', { lw: 4 }); blob(x + (x < 640 ? 56 : -56), 450, 20, 20, '#555', { lw: 3 }); }   // cameras
}

/* ---------- the village square: the old pump, the church, and a stage (TED-style) ---------- */
function villageSquare(t, o = {}) {
  sky(o.light || 'day', t);
  for (const [x, w, h, col] of [[-400, 320, 260, '#e8dcc4'], [1320, 360, 280, '#efe4cf']]) { rect(x, 540 - h, w, h, col, { lw: 4 }); rect(x - 8, 540 - h - 14, w + 16, 16, '#b8603a', { lw: 3.5 }); }
  bellTower(-80, 540, t, {});
  poly([[-1200, 540], [2800, 540], [2800, 1300], [-1200, 1300]], '#d8cdb4', { lw: 0 }); curve([[-1200, 540], [2800, 540]], 4);
  for (let i = -10; i < 30; i++) curve([[i * 110, 540], [i * 110 - 60, 900]], 2, 'rgba(0,0,0,.1)', { w: 0 });
  if (o.pump !== false) pump(1180, 690, t, o.pumpBent || 0);
  if (o.stage) {
    rect(360, 470, 560, 70, '#8a5a3a', { lw: 4 }); rect(340, 180, 600, 70, '#e8392b', { lw: 4 });
    txt(o.banner || 'ΣίταAI · ΤΟ ΚΙΝΗΜΑ', 640, 215, 34, '#fff', { font: TVFONT, style: 'italic', weight: 900 });
    blob(640, 470, 140, 10, '#b22222', { lw: 0 });   // the red TED-style circle rug
  }
}
/* the village hand pump: bent 0..1 (kicked shut) */
function pump(x, y, t, bent = 0) {
  rect(x - 40, y - 30, 80, 30, '#8a8a8a', { lw: 3.5 });
  ctx.save(); ctx.translate(x, y - 30); ctx.rotate(bent * .35);
  rect(-16, -150, 32, 150, '#3a6a4a', { lw: 4 }); limb([[0, -150], [60, -190]], 8, '#3a6a4a');
  limb([[14, -60], [60 - bent * 20, -54 + bent * 20]], 9, '#3a6a4a');
  if (!bent) { const p = (t * 1.5) % 1; blob(60, -40 + p * 60, 4, 6, '#8fc5e0', { lw: 0 }); }
  ctx.restore();
}
/* Γιώργος's poster (rip 0..1 tears it in two) */
function gioPoster(x, y, rip = 0) {
  for (const s of rip > 0 ? [-1, 1] : [0]) { ctx.save(); ctx.translate(x + s * rip * 30, y + (s > 0 ? rip * 40 : 0)); ctx.rotate(s * rip * .25);
    if (s) { ctx.beginPath(); ctx.rect(s < 0 ? -90 : 0, -120, 90, 240); ctx.clip(); }
    rect(-90, -120, 180, 240, '#fff7e0', { lw: 4 }); txt('ΣίταAI', 0, -84, 30, '#e8392b', { font: TVFONT, style: 'italic', weight: 900 });
    person(0, 60, .45, CAST.giorgosJacket, { t: 0, legs: 'stand', mouth: 'smile', R: [60, -160] });
    txt('ΠΑΘΗΤΙΚΟ', 0, 84, 16, INK, { font: TVFONT, weight: 900 }); txt('ΕΙΣΟΔΗΜΑ', 0, 104, 16, INK, { font: TVFONT, weight: 900 });
    ctx.restore(); }
}
/* the pyramid scheme as a literal pyramid of νέοι in suits (rows 1..n), tiny */
function neoiPyramid(x, y, rows, t, s = .32) {
  for (let r = rows - 1; r >= 0; r--) for (let i = 0; i <= r; i++) {
    const px = x + (i - r / 2) * 110 * s * 1.1, py = y - (rows - 1 - r) * 330 * s * .62;
    person(px, py - 150 * s, s, CAST.neosSuit, { t: t + i + r, legs: 'stand', mouth: 'smile', noShadow: true, L: [-60, -60], R: [60, -60] });
  }
}

/* ---------- the stock chart (full frame, TV style) ---------- */
function stockChart(t, k, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0c1424'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(80,140,200,.2)'; ctx.lineWidth = 1; for (let x = 80; x < 1200; x += 80) { ctx.beginPath(); ctx.moveTo(x, 120); ctx.lineTo(x, 600); ctx.stroke(); } for (let y = 120; y <= 600; y += 60) { ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(1200, y); ctx.stroke(); }
  txt(o.title || 'ΣίταAI (SITA)', 100, 70, 36, '#fff', { font: TVFONT, weight: 900, align: 'left' });
  const n = 40, pts = []; for (let i = 0; i <= n * clamp(k); i++) { const u = i / n; pts.push([80 + u * 1120, 580 - Math.pow(u, 2.6) * 440 + Math.sin(i * 1.9) * 8]); }
  if (pts.length > 1) { ctx.strokeStyle = '#34c759'; ctx.lineWidth = 5; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); const e = pts[pts.length - 1]; blob(e[0], e[1], 7, 7, '#34c759', { lw: 0 }); }
  txt(`+${Math.round(400 * Math.pow(clamp(k), 2))}%`, 1180, 70, 44, '#34c759', { font: TVFONT, weight: 900, align: 'right' });
  rect(0, 630, 1280, 90, '#e8392b', { lw: 0 }); txt(o.ticker || 'ΚΑΝΕΙΣ ΔΕΝ ΞΕΡΕΙ ΓΙΑΤΙ · ΚΑΝΕΙΣ ΔΕΝ ΞΕΡΕΙ ΓΙΑΤΙ · ', 640 - (t * 120) % 400, 675, 30, '#fff', { font: TVFONT, style: 'italic', weight: 900 });
  ctx.restore();
}

/* ---------- a contract / stamp card (full frame) ---------- */
function contractCard(t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = o.bg || '#2a2430'; ctx.fillRect(0, 0, W, H);
  rect(300, 60, 680, 600, '#fbf8ef', { lw: 5 });
  txt(o.title || 'ΣΥΜΒΑΣΗ ΜΕΤΑΒΙΒΑΣΗΣ ΜΕΤΟΧΩΝ', 640, 120, 30, INK, { font: TVFONT, weight: 900 });
  for (let i = 0; i < 14; i++) rect(340, 170 + i * 22, 560 - hash(i) * 200, 6, '#b8b4a8', { lw: 0 });
  txt(o.line || 'Αγοραστής: Offshore Holdings (Μπαχάμες) · 51%', 640, 510, 20, INK, { font: TVFONT, weight: 900 });
  if (o.sign > 0) curve([[420, 590], [470, 560], [500, 600], [560, 560], [620, 596]].slice(0, 2 + Math.floor(o.sign * 3)), 3, '#1a3a8a');
  if (o.stamp > 0) { ctx.save(); ctx.translate(780, 560); ctx.rotate(-.15); const s = lerp(2.2, 1, ease(clamp(o.stamp * 2))); ctx.scale(s, s); ctx.globalAlpha = clamp(o.stamp * 3); rect(-170, -46, 340, 92, null, { lw: 8, sc: '#c0202a' }); txt(o.stampText || 'ΣίταAI: 51%', 0, 0, 48, '#c0202a', { font: TVFONT, weight: 900 }); ctx.restore(); }
  ctx.restore();
}

/* ---------- space: the Earth, stars, the Σίταdel ---------- */
function space(t, o = {}) {
  ctx.fillStyle = '#04040c'; ctx.fillRect(-1200, -900, 4000, 2200);
  for (let i = 0; i < 160; i++) { const tw = .6 + .4 * Math.sin(t * 2 + i * 5); blob(-600 + hash(i) * 2500, -500 + hash(i + 70) * 1500, 1.2 + tw, 1.2 + tw, '#fff8e8', { lw: 0 }); }
  if (o.earth !== false) {
    const ex = o.ex ?? 640, ey = o.ey ?? 1500, er = o.er ?? 1000;
    glow(ex, ey, er * 1.12, 'rgba(90,160,255,1)', .5);
    blob(ex, ey, er, er, '#1f4a8a', { lw: 0 });
    ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, er, er, 0, 0, TAU); ctx.clip();
    for (const [dx, dy, rx, ry] of [[-300, -900, 260, 90], [120, -940, 320, 70], [420, -860, 200, 110], [-620, -760, 220, 140]]) blob(ex + dx, ey + dy, rx, ry, '#4a7a3a', { lw: 0 });   // land
    blob(ex + 40, ey - 950, 30, 16, '#6a9a4a', { lw: 0 });   // Greece-ish
    for (let i = 0; i < 8; i++) { ctx.save(); ctx.globalAlpha = .6; blob(ex - 700 + ((t * 8 + i * 220) % 1400), ey - 900 + hash(i) * 200, 120, 18, '#ffffff', { lw: 0 }); ctx.restore(); }   // clouds
    ctx.restore();
  }
}
/* the Σίταdel: a star fortress of σίτες around a central σίτα throne module. k 0..1 assembly (panels fly in) */
function sitadel(x, y, t, o = {}) {
  const k = o.k ?? 1, s = o.s || 1, spin = (o.spin || 0) * t;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // 8 arms of σίτα panels
  for (let a = 0; a < 8; a++) for (let j = 0; j < 4; j++) {
    const i = a * 4 + j, e = ease(clamp(k * 1.6 - i * .018));
    if (e <= 0) continue;
    const ang = a / 8 * TAU + spin, r = 150 + j * 92;
    const fx = Math.cos(ang + 2.4) * 1400 * (1 - e) + Math.cos(ang) * r * e, fy = Math.sin(ang + 2.4) * 900 * (1 - e) + Math.sin(ang) * r * e;
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(ang + Math.PI / 2); ctx.scale(.4, .4);
    sita({ x: 0, top: -105, w: 110, h: 210, t, chip: 1, led: 'red', mood: 'evil' });
    rect(-60, -110, 120, 220, null, { lw: 8, sc: '#9aa0a8' });
    ctx.restore();
    if (j === 3 && e > .9) { ctx.save(); ctx.rotate(ang); limb([[r - 60, 0], [r + 60, 0]], 4, '#9aa0a8'); ctx.restore(); }
  }
  // solar wings on the four diagonal arms
  if (k > .7) { ctx.save(); ctx.globalAlpha = clamp((k - .7) * 3.3); for (let a = 1; a < 8; a += 2) { const ang = a / 8 * TAU + spin; ctx.save(); ctx.rotate(ang); ctx.translate(520, 0);
      rect(-20, -90, 180, 180, '#1a3a7a', { lw: 4, sc: '#9aa0a8' }); for (let g = 1; g < 4; g++) { curve([[-20 + g * 45, -90], [-20 + g * 45, 90]], 2, '#6a90d8', { w: 0 }); curve([[-20, -90 + g * 45], [160, -90 + g * 45]], 2, '#6a90d8', { w: 0 }); }
      ctx.restore(); } ctx.restore(); }
  // rings
  if (k > .5) { ctx.save(); ctx.globalAlpha = clamp((k - .5) * 2); blob(0, 0, 470, 470, null, { lw: 8, sc: '#6a707a' }); blob(0, 0, 300, 300, null, { lw: 5, sc: '#6a707a' }); ctx.restore(); }
  // the core: a big armoured σίτα
  const ce = ease(clamp(k * 2));
  ctx.save(); ctx.scale(ce, ce);
  blob(0, 0, 120, 120, '#2a2e36', { lw: 6 }); blob(0, 0, 100, 100, '#3a3f48', { lw: 3 });
  sitaV2({ x: 0, top: -85, w: 80, h: 160, t, chip: 1, led: 'red', mood: o.mood || 'evil', talk: o.talk || 0 });
  ctx.restore();
  ctx.restore();
}
function sitadelGlow(x, y, t, o = {}) { const s = o.s || 1; glow(x, y - 55 * s, 160 * s, 'rgba(255,30,30,1)', .6); }
/* the rocket: «ΔΩΡΕΑΝ ΜΕΤΑΦΟΡΙΚΑ ΣΕ ΤΡΟΧΙΑ». fire 0..1 */
function rocket(x, y, t, o = {}) {
  const f = o.fire || 0;
  ctx.save(); ctx.translate(x + (f > 0 ? Math.sin(t * 60) * 2 * f : 0), y);
  if (f > 0) for (let i = 0; i < 4; i++) { const k = 1 - i * .2, fl = Math.sin(t * 30 + i) * 10; poly([[-40 * k, 0], [fl, 160 * k * f + 60], [40 * k, 0]], ['#e8392b', '#ff7a2a', '#ffb23a', '#fff0a0'][i], { lw: i ? 0 : 3 }); }
  rect(-40, -380, 80, 380, '#f4f4f0', { lw: 5 }); poly([[-40, -380], [0, -480], [40, -380]], '#e8392b', { lw: 5 });
  for (const sd of [-1, 1]) poly([[sd * 40, -90], [sd * 90, 0], [sd * 40, 0]], '#e8392b', { lw: 4 });
  blob(0, -300, 18, 18, '#9cc5d6', { lw: 4 });
  ctx.save(); ctx.translate(0, -180); ctx.rotate(-Math.PI / 2); txt('ΣίταAI', 0, 0, 30, '#e8392b', { font: TVFONT, style: 'italic', weight: 900 }); ctx.restore();
  ctx.restore();
}
function smoke(x, y, t, n = 12, k = 1) { for (let i = 0; i < n; i++) { const p = (t * .5 + i / n) % 1; blob(x + Math.sin(i * 2.3) * 200 * p * k, y + 20 - p * 40, 40 + p * 140 * k, 30 + p * 80 * k, `rgba(235,235,235,${.8 * (1 - p)})`, { lw: 0 }); } }

/* ---------- a supercomputer room (screens of «Μαρμοκοτρόκο» analysis) ---------- */
function decryptScreen(t, k, words, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#12040a'; ctx.fillRect(0, 0, W, H);
  ctx.font = '700 16px monospace'; ctx.textAlign = 'left';
  for (let i = 0; i < 26; i++) { ctx.fillStyle = `rgba(255,60,60,${.15 + .15 * hash(i)})`; let s = ''; for (let j = 0; j < 60; j++) s += '01ΑΒΓΔΞΨ'[Math.floor(hash(i * 61 + j + Math.floor(t * 10)) * 8)]; ctx.fillText(s, 40, 30 + i * 27); }
  txt(o.title || 'ΑΠΟΚΡΥΠΤΟΓΡΑΦΗΣΗ', 640, 150, 40, '#ff4040', { font: 'monospace', weight: 900 });
  (words || []).forEach((w, i) => txt(`«${w}»`, 640, 230 + i * 50, 38, '#ffd23f', { font: TVFONT, weight: 900 }));
  hudBar(290, 520, 700, .03 * k, `${(3 * k).toFixed(1)}%`);
  txt(o.eta || 'ΥΠΟΛΕΙΠΟΜΕΝΟΣ ΧΡΟΝΟΣ: 400 ΧΡΟΝΙΑ', 640, 600, 28, '#ff8080', { font: 'monospace', weight: 900 });
  ctx.restore();
}
/* the kafeneio inside (from Ep. 2), for the seminar */
function kafeneioInside(t, screen) {
  room({ wall: '#efe6d0', floor: '#c8b89a', floorY: 600, tiles: true, stripe: '#3f7fb3' });
  tv(1040, 300, 280, 160, screen, { stand: false });
  rect(560, 170, 150, 90, '#e8dcc0', { lw: 3 }); txt('ΤΑΒΛΙ · ΚΑΦΕΣ · ΟΥΖΟ', 635, 215, 11, INK, { font: TVFONT, weight: 900 });
}
