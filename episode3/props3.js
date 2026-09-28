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
  // o.shaft: an opening in the roof of the quarry, the night sky through it
  if (o.shaft) {
    ctx.save(); ctx.beginPath(); ctx.ellipse(790, 40, 300, 110, 0, 0, TAU); ctx.clip();
    ctx.fillStyle = '#0a1030'; ctx.fillRect(480, -80, 620, 240);
    for (let i = 0; i < 40; i++) blob(500 + hash(i) * 580, -60 + hash(i + 40) * 190, 1.5, 1.5, '#fff8e8', { lw: 0 });
    ctx.restore(); blob(790, 40, 300, 110, null, { lw: 10, sc: '#2e2620' });
  }
  if (o.sign === false) return;
  // the neon sign
  const fl = !(Math.sin(t * 23) > .92 && Math.sin(t * 2.7) > 0);
  rect(390, 60, 500, 110, '#0e0c10', { lw: 5 });
  txt('MINER FARM', 640, 115, 64, fl ? '#ff5ad8' : '#5a2a50', { font: TVFONT, style: 'italic', weight: 900, stroke: 4, sc: fl ? '#ffd6f4' : '#2a1a28' });
  txt('₿ 24/7 ₿', 640, 158, 20, fl ? '#6af0ff' : '#1a4a50', { font: TVFONT, weight: 900 });
}
function mineGlow(t, o = {}) {
  for (const x of [260, 740, 1220]) glow(x, 262, 200, 'rgba(255,210,120,1)', .45);
  if (o.sign !== false && !(Math.sin(t * 23) > .92 && Math.sin(t * 2.7) > 0)) { glow(640, 115, 360, 'rgba(255,90,216,1)', .35); glow(640, 158, 160, 'rgba(106,240,255,1)', .25); }
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

/* =========================================================
   v3 additions: the steps, the empire's officers, the IQOS spy, the Jumbo board, data centres
   ========================================================= */
Object.assign(CAST, {
  proedros: { skin: '#e6b890', hair: 'swoop', hairCol: '#d8d8dc', beard: 'none', top: 'tee', topCol: '#2a2a30', brow: '#b8b8bc', rx: 50, ry: 58, legs: '#2a2a30', shoes: '#111', lines: true },
  board1:   { skin: '#d8a882', hair: 'short', hairCol: '#3a2a20', beard: 'none', top: 'tee', topCol: '#3a3f4a', brow: '#3a2a20', rx: 46, ry: 54, legs: '#3a3f4a', shoes: '#111' },
  board2:   { skin: '#eac4a0', hair: 'bun', hairCol: '#6a4a30', beard: 'none', top: 'tee', topCol: '#5a2a3a', brow: '#6a4a30', rx: 44, ry: 52, legs: '#2a2a30', shoes: '#111' },
});
Object.assign(VOICE_INFO, {
  airfryer:    { el: 'AIR FRYER', en: 'AIR FRYER', col: '#f2c21a', pitch: .9, rate: 1, babble: 260 },
  koudouni:    { el: 'ΚΟΥΔΟΥΝΙ', en: 'DOORBELL', col: '#b8c8ff', pitch: 1.3, rate: 1.1, babble: 420 },
  krokodeilos: { el: 'ΚΡΟΚΟΔΕΙΛΟΣ', en: 'CROCODILE', col: '#7fd05a', pitch: .6, rate: .95, babble: 150 },
  palio_iqos:  { el: 'ΠΑΛΙΟ IQOS', en: 'OLD IQOS', col: '#c8ccd2', pitch: .7, rate: .85, babble: 170 },
  prime:       { el: 'IQOS PRIME', en: 'IQOS PRIME', col: '#e8c890', pitch: 1.1, rate: 1, babble: 300 },
  proedros:    { el: 'ΠΡΟΕΔΡΟΣ', en: 'CHAIRMAN', col: '#ffcf5a', pitch: .75, rate: .9, babble: 200 },
});

/* ---------- the eight steps: a full-frame card with a staircase; the σίτα climbs to step n. k 0..1 over the card ---------- */
const STEPS8 = [['ΚΕΦΑΛΑΙΟ', 'CAPITAL'], ['ΕΤΑΙΡΕΙΑ', 'COMPANY'], ['ΠΛΗΡΟΦΟΡΙΑ', 'INFORMATION'], ['ΒΙΤΡΙΝΑ', 'FRONT'],
  ['ΜΕΣΑ', 'MEDIA'], ['ΕΥΦΥΪΑ', 'INTELLIGENCE'], ['ΔΙΚΤΥΟ', 'NETWORK'], ['ΤΡΟΧΙΑ', 'ORBIT']];
function stepCard(t, n, k) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#12060a'; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = .12; for (let i = 0; i < 18; i++) { ctx.fillStyle = '#ff3030'; ctx.fillRect(0, i * 42, W, 1); } ctx.globalAlpha = 1;
  // the staircase: 8 steps, climbing left to right
  const sx = 240, sy = 560, sw = 100, sh = 46;
  for (let i = 0; i < 8; i++) {
    const done = i < n - 1, cur = i === n - 1;
    rect(sx + i * sw, sy - (i + 1) * sh, sw, (i + 1) * sh, done ? '#5a1a20' : cur ? '#c0202a' : '#241016', { lw: 3, sc: cur ? '#ffd0d0' : '#4a2028' });
    txt(String(i + 1), sx + i * sw + sw / 2, sy - (i + 1) * sh + 22, 20, cur ? '#fff' : done ? '#ff8080' : '#5a3038', { font: TVFONT, weight: 900 });
  }
  // the σίτα hops onto her step
  const hop = ease(clamp(k * 2.2)), from = Math.max(0, n - 2), ix = lerp(from, n - 1, hop);
  const bx = sx + ix * sw + sw / 2, by = sy - (Math.floor(ix + .001) + 1) * sh - Math.sin(hop * Math.PI) * 60;
  ctx.save(); ctx.translate(bx, by); ctx.scale(.36, .36); sitaV2({ x: 0, top: -210, w: 110, h: 210, t, chip: 1, led: 'red', mood: 'evil' }); ctx.restore();
  // the title
  const a = clamp((k - .2) * 3);
  ctx.globalAlpha = a;
  txt(lang === 'el' ? `ΒΗΜΑ ${n}` : `STEP ${n}`, 640, 110, 44, '#ff5050', { font: TVFONT, weight: 900 });
  txt(STEPS8[n - 1][lang === 'el' ? 0 : 1], 640, 180, 76, '#fffaf0', { font: TVFONT, style: 'italic', weight: 900, stroke: 8, sc: '#5a0a10' });
  ctx.globalAlpha = 1;
  txt(lang === 'el' ? 'Ο ΔΡΟΜΟΣ ΠΡΟΣ ΤΗΝ ΕΥΦΥΪΑ' : 'THE ROAD TO INTELLIGENCE', 640, 650, 20, '#8a4a50', { font: 'monospace', weight: 900 });
  ctx.restore();
}

/* ---------- the empire's officers (Ep. 2 army devices, back from the recall and promoted). s = scale; talk 0..1 ---------- */
function officerFryer(x, y, t, o = {}) {          // AIR FRYER, Finance: gold trim, a bow tie, a calculator tape
  const s = o.s || 1.8, tk = o.talk || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const d of [-1, 1]) limb([[d * 22, -12], [d * 26, 16]], 5, '#555');
  poly([[-38, -12], [38, -12], [32, -92], [-32, -92]], '#2a2a30', { lw: 3.5 });
  rect(-32, -96, 64, 8, '#d8a82a', { lw: 2 });
  rect(-26, -70, 52, 34, '#1a1a1e', { lw: 2 });
  // the basket drawer = its mouth
  rect(-22, -34 + tk * 8, 44, 12, '#6a6a72', { lw: 2 }); rect(-8, -26 + tk * 8, 16, 5, '#aaa', { lw: 1.5 });
  // its little status light (the eye); o.dim lowers it
  const eyeA = o.dim ? .25 : 1; ctx.save(); ctx.globalAlpha = eyeA; redEye(0, -82, 5); ctx.restore();
  txt('₿', 0, -53, 20, '#f2c21a', { font: TVFONT, weight: 900 });
  poly([[-10, -8], [0, -4], [10, -8], [10, 0], [0, -4], [-10, 0]], '#d8a82a', { lw: 1.5 });   // bow tie on the base
  if (o.tape) { curve([[34, -40], [60, -20], [52, 10]], 6, '#f4f2ec', { w: 0 }); }
  ctx.restore();
}
function officerBell(x, y, t, o = {}) {           // ΚΟΥΔΟΥΝΙ, Intelligence: a smart doorbell on little legs, one camera eye, an earpiece
  const s = o.s || 2.4, tk = o.talk || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const d of [-1, 1]) limb([[d * 8, 2], [d * 10, 20]], 3.5, '#555');
  rect(-16, -46, 32, 50, '#2a2a30', { lw: 2.5 });
  blob(0, -30, 9, 9, '#111', { lw: 2 }); redEye(0, -30, 4.5);
  blob(0, -10, 8 + tk * 2, 8 + tk * 2, tk > .2 ? '#8ab0ff' : '#555', { lw: 2 });              // the button lights when it speaks
  curve([[16, -40], [24, -44], [24, -30]], 2, '#111'); blob(24, -28, 3, 3, '#111', { lw: 0 });   // earpiece
  ctx.restore();
  if (tk > .2) glow(x, y - 10 * s, 40, 'rgba(120,160,255,1)', .4);
}
function officerCroc(x, y, t, o = {}) {           // ΚΡΟΚΟΔΕΙΛΟΣ, Security: the inflatable pool croc with a beret and a jaw that works
  const s = o.s || 1.4, tk = o.talk || 0, b = Math.sin(t * 5) * 3;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.dir || 1), s);
  blob(0, -30 + b, 90, 30, '#5fc04a', { lw: 4 }); blob(96, -44 + b, 44, 16, '#5fc04a', { lw: 4 });
  poly([[60, -34 + b], [138, -36 + b + tk * 10], [140, -26 + b + tk * 18], [64, -22 + b]], '#4aa03a', { lw: 3 });   // lower jaw
  for (let i = 0; i < 5; i++) poly([[-60 + i * 30, -56 + b], [-48 + i * 30, -72 + b], [-36 + i * 30, -56 + b]], '#4aa03a', { lw: 2.5 });
  blob(0, -30 + b, 20, 8, '#8ad86a', { lw: 0 });                                   // shine of the vinyl
  blob(-80, -24 + b, 7, 4, '#e8e0cc', { lw: 1.5 });                                 // the valve
  blob(80, -62 + b, 8, 8, '#fff', { lw: 2 }); redEye(82, -62 + b, 3.5);
  blob(72, -74 + b, 24, 9, '#8a1a2a', { lw: 2.5, rot: -.15 }); blob(88, -78 + b, 4, 4, '#f2c21a', { lw: 1 });   // beret with a badge
  ctx.restore();
}

/* ---------- the HQ in the mine: the throne, officers, a big screen above. screen: fn drawing in 1280×720 ---------- */
function hqRoom(t, o = {}) {
  mine(t, { sign: false });
  tv(640, 330, 620, 280, o.screen || (() => { ctx.fillStyle = '#12040a'; ctx.fillRect(0, 0, 1280, 720); txt('ΣίταAI · HQ', 640, 360, 90, '#ff4040', { font: TVFONT, weight: 900 }); }), { stand: false });
  limb([[400, 40], [400, 60]], 5, '#333'); limb([[880, 40], [880, 60]], 5, '#333');
}
/* a map of China with k × (thousands of) red dots: smart devices in factories */
function chinaMap(t, k, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0c1424'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(80,140,200,.15)'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const shape = [[260, 250], [360, 170], [470, 190], [560, 120], [700, 110], [820, 60], [930, 90], [1000, 170], [940, 230], [990, 300], [930, 380], [960, 450], [880, 560], [760, 620], [640, 600], [560, 540], [470, 500], [380, 470], [300, 400], [220, 330]];
  poly(shape, '#1a2c44', { lw: 3, sc: '#4a7ab0' });
  const n = Math.floor(420 * k);
  for (let i = 0; i < n; i++) {
    const px = 500 + (hash(i) - .5) * 520 + hash(i + 900) * 180, py = 330 + (hash(i + 300) - .5) * 420 * (.4 + hash(i + 77) * .6);
    if (px < 300 || px > 960 || py < 150 || py > 590) continue;
    const on = Math.sin(t * 6 + i) > -.6;
    blob(px, py, 3, 3, on ? '#ff3030' : '#6a1010', { lw: 0 });
  }
  txt(o.title || 'ΕΞΥΠΝΕΣ ΣΥΣΚΕΥΕΣ ΣΕ ΕΡΓΟΣΤΑΣΙΑ', 640, 50, 30, '#ff5050', { font: 'monospace', weight: 900 });
  txt(`${Math.floor(n * 97).toLocaleString('el-GR')} ${lang === 'el' ? 'συσκευές' : 'devices'}`, 1100, 660, 26, '#ffd23f', { font: 'monospace', weight: 900 });
  if (o.pin) { const [px, py, label] = o.pin; blob(px, py, 14, 14, null, { lw: 4, sc: '#ffd23f' }); txt(label, px, py - 34, 22, '#ffd23f', { font: 'monospace', weight: 900 }); }
  ctx.restore();
}
/* a smart kettle in a meeting room (it hears everything) */
function smartKettle(x, y, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(o.s || 1, o.s || 1);
  poly([[-40, 0], [40, 0], [34, -90], [-34, -90]], '#e8e8ec', { lw: 3.5 });
  curve([[40, -70], [64, -60], [60, -20], [40, -16]], 6, '#c8c8cc');
  poly([[-34, -80], [-60, -96], [-56, -84], [-34, -66]], '#e8e8ec', { lw: 3 });
  rect(-30, -104, 60, 14, '#c8c8cc', { lw: 3 });
  redEye(0, -44, 5);
  if (o.steam) for (let i = 0; i < 3; i++) { const p = (t * .8 + i / 3) % 1; blob(-56 - p * 20, -104 - p * 70, 10 + p * 14, 8 + p * 10, `rgba(255,255,255,${.6 * (1 - p)})`, { lw: 0 }); }
  ctx.restore();
}
/* a giant factory hall with a smart air conditioner; o.off: the AC is switched off, heat, workers stop */
function factoryHall(t, o = {}) {
  factoryBG(t, { lit: 0 });
  const off = o.off || 0;
  rect(820, 90, 300, 90, '#f4f4f0', { lw: 4 }); for (let i = 0; i < 6; i++) curve([[840, 150 + i * 4], [1100, 150 + i * 4]], 2, '#c8c8cc', { w: 0 });
  redEye(1090, 110, 6); txt(off > .5 ? 'OFF' : '18°C', 960, 118, 22, off > .5 ? '#ff3030' : '#3a9aff', { font: 'monospace', weight: 900 });
  if (off < .5) for (let i = 0; i < 4; i++) { const p = (t * 1.2 + i / 4) % 1; curve([[860 + i * 60, 190 + p * 80], [880 + i * 60, 200 + p * 80]], 3, `rgba(120,200,255,${1 - p})`, { w: 0 }); }
  // the production line
  rect(-400, 560, 2100, 40, '#5a5a62', { lw: 4 }); for (let i = 0; i < 30; i++) blob(-380 + i * 70, 600, 16, 16, '#3a3a42', { lw: 2.5 });
  const run = off > .5 ? 0 : t * 120;
  for (let i = 0; i < 12; i++) { const bx = -300 + ((i * 180 + run) % 2100); rect(bx - 30, 500, 60, 60, '#b8905a', { lw: 3 }); }
  if (off > 0) { ctx.save(); ctx.globalAlpha = off * .3; ctx.fillStyle = '#ff6a20'; ctx.fillRect(-800, -600, 2900, 1900); ctx.restore(); }
}

/* ---------- the IQOS spy: the ILUMA i PRIME (aluminium, leather-like wrap, a touch screen) ---------- */
function iqosPrime(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  rect(-15, -60, 30, 120, '#b8bcc4', { lw: 2.5 });                                  // aluminium body
  rect(-15, -10, 30, 70, '#7a4a2a', { lw: 2 });                                      // leather-like wrap
  for (let i = 0; i < 6; i++) curve([[-13, -2 + i * 10], [13, -2 + i * 10]], 1, 'rgba(0,0,0,.2)', { w: 0 });
  rect(-11, -52, 22, 36, '#0a0e16', { lw: 1.5 });                                    // touch screen
  if (o.screen) txt(o.screen, 0, -34, 5.5, o.red ? '#ff5050' : '#e8e8f0', { font: 'monospace', weight: 900 });
  const col = o.red ? '#ff2a2a' : '#f4f6ff';
  blob(0, -58, 5, 2, col, { lw: 0, glow: col, gb: 12 });
  if (o.talk) blob(0, -34, 9 * o.talk, 9 * o.talk, null, { lw: 1, sc: o.red ? '#ff5050' : '#8ab0ff' });
  ctx.restore();
}
/* the friendly bin: dented, green, red LED; o.lid 0..1 lifts the lid (the burp) */
function friendBin(x, y, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.lean || .08);
  poly([[-44, 0], [44, 0], [50, -110], [-50, -110]], '#3a7a4a', { lw: 4, w: .5 });
  if (o.inside) { ctx.save(); ctx.beginPath(); ctx.rect(-50, -130, 100, 30); ctx.clip(); o.inside(); ctx.restore(); }
  ctx.save(); ctx.translate(-56, -110); ctx.rotate(-(o.lid || 0) * .5); rect(0, -14, 112, 16, '#2e6a3c', { lw: 3.5, w: .4 }); ctx.restore();
  curve([[-30, -80], [-10, -60], [-26, -40]], 3, '#2a5a34'); txt('ΔΗΜΟΣ ΚΟΡΙΝΘΙΩΝ', 0, -30, 9, '#e8f0e8', { font: TVFONT, weight: 900 }); redEye(18, -118, 5);
  ctx.restore();
}

/* ---------- the Jumbo boardroom ---------- */
function boardroom(t, o = {}) {
  ctx.fillStyle = '#f4f1ea'; ctx.fillRect(-1200, -900, 4000, 2200);
  rect(-600, 0, 2500, 90, '#1f5fb8', { lw: 0 }); rect(-600, 90, 2500, 14, '#ffd23f', { lw: 0 });
  jumboLogo(640, 170, 70);
  for (const x of [120, 1160]) { rect(x - 90, 240, 180, 260, '#bfe0f0', { lw: 5 }); curve([[x, 240], [x, 500]], 4); }
  // a chart going up on an easel
  if (o.chart !== false) { rect(930, 250, 170, 130, '#fff', { lw: 4 }); curve([[945, 360], [985, 340], [1020, 350], [1080, 270]], 4, '#e8392b', { w: 0 }); txt('+400%', 1015, 272, 18, '#e8392b', { font: TVFONT, weight: 900 }); limb([[1015, 380], [1015, 560]], 5, '#6a4a2a'); }
  poly([[-600, 690], [2000, 690], [2000, 900], [-600, 900]], '#8a6a4a', { lw: 0 }); curve([[-600, 690], [2000, 690]], 4);
}
function boardTable() {        // the long polished table, drawn over the seated legs
  poly([[120, 520], [1160, 520], [1200, 552], [80, 552]], '#5a3a22', { lw: 4 }); rect(80, 552, 1120, 20, '#3a2414', { lw: 3.5 });
  rect(110, 572, 1060, 90, '#4a2e1a', { lw: 3.5 }); curve([[130, 600], [1150, 600]], 2, 'rgba(0,0,0,.2)', { w: 0 });   // modesty panel
  for (const [x, w] of [[440, 60], [860, 50], [1040, 60]]) rect(x - w / 2, 526, w, 12, '#fff', { lw: 2 });   // papers
}

/* ---------- data centres in frozen mountains ---------- */
function dataCentre(t, o = {}) {
  sky(o.light || 'dusk', t);
  poly([[-800, 480], [-300, 180], [100, 420], [500, 140], [900, 400], [1300, 170], [2100, 460], [2100, 900], [-800, 900]], o.rock || '#5a6070', { lw: 4 });
  for (const [x, y] of [[-300, 180], [500, 140], [1300, 170]]) poly([[x - 110, y + 70], [x, y], [x + 110, y + 70], [x + 40, y + 60], [x, y + 80], [x - 40, y + 60]], '#f4f6fa', { lw: 3 });
  poly([[-800, 600], [2100, 600], [2100, 900], [-800, 900]], '#e8eef4', { lw: 0 }); curve([[-800, 600], [2100, 600]], 4);
  rect(360, 400, 560, 200, '#3a3f4a', { lw: 5 }); rect(360, 386, 560, 20, '#2a2e36', { lw: 4 });
  for (let i = 0; i < 8; i++) { rect(390 + i * 66, 430, 50, 140, '#1a1d24', { lw: 2.5 }); for (let j = 0; j < 7; j++) blob(404 + i * 66 + (j % 2) * 20, 446 + j * 18, 3, 3, Math.sin(t * 8 + i * 3 + j) > 0 ? '#ff3030' : '#4a0a0a', { lw: 0 }); }
  for (const x of [440, 640, 840]) { blob(x, 380, 30, 10, '#6a707a', { lw: 3 }); for (let i = 0; i < 3; i++) { const p = (t * .6 + i / 3 + x) % 1; blob(x + p * 30, 360 - p * 90, 20 + p * 30, 12 + p * 16, `rgba(255,255,255,${.5 * (1 - p)})`, { lw: 0 }); } }
  rect(560, 330, 160, 44, '#1a0406', { lw: 3, sc: '#ff3030' }); txt('ΣίταAI', 640, 352, 26, '#ff4040', { font: TVFONT, weight: 900 });
  if (o.label) txt(o.label, 640, 90, 44, '#fff', { font: TVFONT, weight: 900, stroke: 8, sc: '#2a3040' });
}

/* ---------- the throne room inside the Σίταdel: a round hall, a window on the Earth ---------- */
function sitadelHall(t, o = {}) {
  ctx.fillStyle = '#1a1d24'; ctx.fillRect(-1200, -900, 4000, 2200);
  // the big round window
  ctx.save(); ctx.beginPath(); ctx.ellipse(640, 300, 380, 250, 0, 0, TAU); ctx.clip();
  space(t, { ex: 640, ey: 1250, er: 900 });
  ctx.restore();
  blob(640, 300, 380, 250, null, { lw: 14, sc: '#6a707a' }); blob(640, 300, 396, 266, null, { lw: 4, sc: '#3a3f48' });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; blob(640 + Math.cos(a) * 388, 300 + Math.sin(a) * 258, 6, 6, '#9aa0a8', { lw: 2 }); }
  // wall panels made of σίτα frames
  for (const x of [-100, 60, 1220, 1380]) { rect(x - 60, 160, 120, 400, '#2a2e36', { lw: 4 }); for (let j = 0; j < 8; j++) curve([[x - 50, 180 + j * 48], [x + 50, 180 + j * 48]], 2, '#3a3f48', { w: 0 }); }
  poly([[-1200, 600], [2800, 600], [2800, 1300], [-1200, 1300]], '#2a2e36', { lw: 0 }); curve([[-1200, 600], [2800, 600]], 5, '#6a707a');
  for (let i = -8; i < 30; i++) curve([[i * 90, 600], [i * 90 - 60, 900]], 2, '#353a44', { w: 0 });
  // the door (the doorbell stands here)
  rect(1080, 380, 150, 220, '#353a44', { lw: 4 }); curve([[1155, 380], [1155, 600]], 3, '#1a1d24');
  if (o.alarm) { ctx.save(); ctx.globalAlpha = .2 * (Math.sin(t * 8) > 0); ctx.fillStyle = '#ff2020'; ctx.fillRect(-1200, -900, 4000, 2200); ctx.restore(); }
}
function sitadelThrone(x, y) {
  poly([[x - 130, y], [x - 110, y - 240], [x - 60, y - 300], [x, y - 330], [x + 60, y - 300], [x + 110, y - 240], [x + 130, y]], '#3a3f48', { lw: 5 });
  rect(x - 100, y - 80, 200, 80, '#4a4f58', { lw: 4 });
  for (let i = 0; i < 5; i++) blob(x - 80 + i * 40, y - 40, 5, 5, i % 2 ? '#ff3030' : '#ffd23f', { lw: 1.5 });
}

/* ---------- a crisp white AI company, seen on a video call: a calm glowing circle that only writes ---------- */
function aiOffice(t, rows = [], o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#f7f7f5'; ctx.fillRect(0, 0, W, H);
  for (const x of [120, 1160]) { rect(x - 60, 120, 120, 380, '#eceae4', { lw: 0 }); }
  blob(640, 620, 900, 60, '#ecebe6', { lw: 0 });
  const br = 1 + Math.sin(t * 1.4) * .04;
  glow(640, 250, 220, 'rgba(255,190,140,1)', .35);
  blob(640, 250, 90 * br, 90 * br, '#fff4ea', { lw: 3, sc: '#e8b48a' });
  rows.forEach(([s, col], i) => txt(s, 640, 420 + i * 46, 30, col || '#5a4a40', { font: 'Georgia, serif' }));
  txt('VIDEO CALL', 110, 40, 16, '#9a9a9a', { font: 'monospace', weight: 900 });
  blob(60, 40, 7, 7, '#e8392b', { lw: 0 });
  ctx.restore();
}

/* the court in the mine HQ: screen above, officers on the left, the σίτα on her throne on the right.
   o: { screen, dim (fryer's light), mood, fryerTape }. Returns the σίτα's state (for sitaGlow). */
const HQX = { airfryer: 230, koudouni: 430, krokodeilos: 640, sita: 1040 };
function hqCourt(t, o = {}) {
  hqRoom(t, { screen: o.screen });
  for (let i = 0; i < 5; i++) dumbSita(-260 + i * 90, 690, t, { pick: 1, seed: i * 2.1, s: .4 });   // the workforce, off to the side
  officerFryer(HQX.airfryer, 690, t, { talk: talk('airfryer', t), dim: o.dim, tape: o.fryerTape });
  officerBell(HQX.koudouni, 690, t, { talk: talk('koudouni', t) });
  officerCroc(HQX.krokodeilos, 690, t, { talk: talk('krokodeilos', t) });
  rockThrone(HQX.sita, 690);
  const st = { x: HQX.sita, top: 400, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: o.mood || 'evil', burn: 1 };
  sitaV2(st);
  poly([[HQX.sita - 40, 392], [HQX.sita - 30, 366], [HQX.sita - 12, 384], [HQX.sita, 360], [HQX.sita + 12, 384], [HQX.sita + 30, 366], [HQX.sita + 40, 392]], '#f2c21a', { lw: 3 });
  return st;
}
function hqGlow(t, st) { mineGlow(t, { sign: false }); sitaGlow(st, .7); glow(640, 190, 360, 'rgba(255,60,60,1)', .18); }
