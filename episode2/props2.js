/* =========================================================
   «Τηλεφωνήστε Τώρα» (Episode 2) – new cast, props and sets.
   Loaded after episode1's engine.js / characters.js / sets.js / props.js, so everything there is available.
   ========================================================= */

/* ---------- new people ---------- */
// Γιώργος is doing his military service this episode: army fatigues throughout (a jacket over them for the fake ad)
CAST.giorgos = { ...CAST.giorgos, topCol: '#6b7048' };
Object.assign(CAST, {
  neos:      { skin: '#e8bf98', hair: 'short', hairCol: '#3a2a20', beard: 'none', top: 'tee', topCol: '#6b7048', brow: '#3a2a20', rx: 42, ry: 52, legs: '#6b7048', shoes: '#2d2a26' },
  odigos:    { skin: '#c98e66', hair: 'old', hairCol: '#4a3a30', beard: 'stubble', mustache: '#3a2a20', top: 'tee', topCol: '#2b6fb3', belly: true, brow: '#3a2a20', rx: 50, ry: 56, legs: '#3a3f4a', shoes: '#2a2a2a' },
  ypallilos: { skin: '#e4b48e', hair: 'short', hairCol: '#1e1714', beard: 'trim', beardCol: '#231a16', top: 'tee', topCol: '#00b4f1', brow: '#1e1714', rx: 44, ry: 54, legs: '#2e3440', shoes: '#e9e6df' },
  geros1:    { skin: '#c9926a', hair: 'old', hairCol: '#e8e4dc', beard: 'stubble', mustache: '#dcd8d0', top: 'tee', topCol: '#8a7a6a', belly: true, brow: '#d9d4c8', rx: 48, ry: 54, legs: '#4a4a52', shoes: '#2a2a2a' },
  presenter: { skin: '#f0b890', hair: 'swoop', hairCol: '#d8b04a', beard: 'none', top: 'tee', topCol: '#c02a4a', brow: '#a88030', rx: 46, ry: 54, legs: '#2a2a3a', shoes: '#111' },
  geros2:    { skin: '#d8a47c', hair: 'bald', beard: 'none', mustache: '#cfcac0', top: 'tee', topCol: '#f4f3ee', brow: '#cfcac0', rx: 46, ry: 56, legs: '#5a4a3a', shoes: '#2a2a2a' },
});
Object.assign(VOICE_INFO, {
  neos:      { el: 'ΝΕΟΣ', en: 'THE NEW GUY', col: '#b8c890', pitch: 1.2, rate: 1.1, babble: 360 },
  odigos:    { el: 'ΟΔΗΓΟΣ', en: 'DRIVER', col: '#7ab0e8', pitch: .8, rate: .95, babble: 220 },
  tv:        { el: 'ΤΗΛΕΟΡΑΣΗ', en: 'TV', col: '#ffb23a', pitch: 1.2, rate: 1.25, babble: 440 },
  ypallilos: { el: 'ΥΠΑΛΛΗΛΟΣ', en: 'CLERK', col: '#8fd8ff', pitch: 1, rate: .95, babble: 280 },
});

/* ---------- hand-held props (see ITEM_HOOK in characters.js) ---------- */
function bowDraw(x, y, side, pull = 0) {           // a fig-branch bow, strung with washing line
  ctx.save(); ctx.translate(x, y);
  curve([[-6 * side, -54], [10 * side, 0], [-6 * side, 54]], 7, '#8a6a4a', { w: .3 });
  curve([[-6 * side, -54], [-6 * side - pull * 30 * side, 0], [-6 * side, 54]], 1.6, '#e8e4dc', { w: 0 });
  for (const yy of [-40, -14, 22]) blob(6 * side, yy, 5, 3, '#6fa04a', { lw: 1.2 });   // fig leaves still on it
  ctx.restore();
}
function arrow(x, y, rot, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  curve([[-40, 0], [36, 0]], 3, '#c8b070', { w: 0 }); poly([[36, -5], [48, 0], [36, 5]], '#6a6a6a', { lw: 2 });
  poly([[-40, 0], [-50, -6], [-44, 0], [-50, 6]], '#e05a4a', { lw: 1.5 });
  ctx.restore();
}
function jammer(x, y, t, on = 1) {                 // a microwave with an antenna and a car battery
  rect(x - 30, y - 22, 60, 38, '#e8e8e8', { lw: 3, w: .3 }); rect(x - 24, y - 16, 34, 26, '#2a2a30', { lw: 2 });
  blob(x + 20, y - 8, 3, 3, on ? '#ff3030' : '#555', { lw: 0, glow: on ? '#ff3030' : null, gb: 10 });
  curve([[x + 20, y - 22], [x + 26, y - 50]], 2.5, '#555'); blob(x + 26, y - 52, 4, 4, '#555', { lw: 1.5 });
  if (on) for (let i = 1; i < 4; i++) { const r = ((t * 60 + i * 12) % 36); ctx.save(); ctx.globalAlpha = 1 - r / 36; curve([[x + 26 - r * .7, y - 52 - r * .7], [x + 26, y - 52 - r], [x + 26 + r * .7, y - 52 - r * .7]], 2, '#7ac8ff', { w: 0 }); ctx.restore(); }
}
function magnetCannon(x, y, rot = 0) {              // a pipe with the old σίτα's nine magnet pairs in rings
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  rect(-20, -10, 80, 20, '#6a6a72', { lw: 3, w: .2 });
  for (let i = 0; i < 9; i++) rect(-14 + i * 8, -13, 5, 26, i % 2 ? '#e05a4a' : '#3a6ad8', { lw: 1.2 });
  ctx.restore();
}
function racketGun(x, y, rot, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); curve([[0, 0], [0, -90]], 5, '#b88a5a'); racket(0, -110, 0, t, { on: 1, s: .7 }); ctx.restore(); }
function tray(x, y, side) { ctx.save(); ctx.translate(x, y); blob(0, 0, 10 * 3.2, 38, '#c8ccd2', { lw: 3.5, w: .3 }); blob(0, 0, 26, 30, '#b0b4ba', { lw: 1.5 }); ctx.restore(); }
function koulouri(x, y) { ctx.save(); ctx.translate(x, y); blob(0, 0, 16, 16, '#c8883a', { lw: 3 }); blob(0, 0, 7, 7, 'rgba(0,0,0,0)', { lw: 2.5 }); for (let i = 0; i < 8; i++) blob(Math.cos(i) * 11, Math.sin(i) * 11, 1.4, 1, '#f4ecd0', { lw: 0 }); ctx.restore(); }
Object.assign(ITEM_HOOK, {
  bow: (h, side, st) => bowDraw(h[0] + side * 6, h[1] - 6, side, st.pull || 0),
  jammer: (h, side, st, t) => jammer(h[0] + side * 10, h[1] - 12, t, st.jamOn ?? 1),
  magnet: (h, side) => magnetCannon(h[0] - 10, h[1] - 6, side > 0 ? 0 : Math.PI),
  racketGun: (h, side, st, t) => racketGun(h[0], h[1] + 20, side * .25, t),
  tray: (h, side) => tray(h[0] + side * 20, h[1] - 20, side),
  koulouri: h => koulouri(h[0], h[1] - 10),
  phoneUp: h => phone(h[0], h[1] - 20),
  bigPhone: h => { ctx.save(); ctx.translate(h[0], h[1] - 18); rect(-10, -18, 20, 36, '#1b1b1f', { lw: 2.5, w: .2 }); rect(-8, -15, 16, 28, '#e8392b', { lw: 0 }); ctx.restore(); },
  clipboard: h => { rect(h[0] - 18, h[1] - 50, 36, 48, '#b88a5a', { lw: 2.5 }); rect(h[0] - 14, h[1] - 44, 28, 38, '#f4f2ec', { lw: 1.5 }); for (let i = 0; i < 4; i++) curve([[h[0] - 10, h[1] - 38 + i * 8], [h[0] + 10, h[1] - 38 + i * 8]], 1.2, '#888', { w: 0 }); },
  bag: h => { rect(h[0] - 24, h[1] - 6, 48, 40, '#4a5a3a', { lw: 3, w: .3 }); curve([[h[0] - 14, h[1] - 6], [h[0], h[1] - 20], [h[0] + 14, h[1] - 6]], 3, '#3a4a2a'); },
  cigPack: h => { rect(h[0] - 10, h[1] - 26, 20, 28, '#f4f2ec', { lw: 2 }); rect(h[0] - 10, h[1] - 26, 20, 8, '#c0392b', { lw: 0 }); },
  storyboard: h => { rect(h[0] - 36, h[1] - 60, 72, 56, '#fbf8ef', { lw: 3 }); for (let i = 0; i < 4; i++) rect(h[0] - 32 + (i % 2) * 34, h[1] - 56 + Math.floor(i / 2) * 26, 30, 22, null, { lw: 1.5 }); },
});

/* ---------- the Jumbo logo and truck ---------- */
const JUMBO_COLS = ['#00b4f1', '#8dc63f', '#ef59a1', '#f68b1f', '#bd1a8d'];
function jumboLogo(x, y, size) {
  const L = 'JUMBO', step = size * .62;
  for (let i = 0; i < 5; i++) {
    const lx = x + (i - 2) * step, ly = y + Math.sin(i * 1.7) * size * .04;
    txt(L[i], lx, ly, size, JUMBO_COLS[i], { font: 'Comfortaa, sans-serif', weight: 900, stroke: size * .16, sc: '#ffffff' });
  }
}
/* o: { dir 1|-1, door 0..1 (rear door open), moving, s, lights, hazard } — x is the middle of the truck, y the road */
function jumboTruck(x, y, t, o = {}) {
  const d = o.dir || 1, s = o.s || 1, b = o.moving ? Math.sin(t * 18) * 1.5 : 0;
  ctx.save(); ctx.translate(x, y + b); ctx.scale(d * s, s);
  blob(0, 6, 380, 14, 'rgba(0,0,0,.25)', { lw: 0 });
  // cargo box
  rect(-360, -300, 540, 270, '#f7f7f4', { lw: 5, w: .6 });
  rect(-360, -300, 540, 18, JUMBO_COLS[0], { lw: 0 }); rect(-360, -48, 540, 18, JUMBO_COLS[4], { lw: 0 });
  ctx.save(); ctx.scale(d, 1); jumboLogo(-90 * d, -165, 110); ctx.restore();
  // cab
  poly([[180, -30], [180, -230], [290, -230], [340, -150], [350, -30]], '#f4f4f0', { lw: 5, w: .5, smooth: false });
  poly([[200, -212], [282, -212], [320, -150], [200, -150]], '#9cc5d6', { lw: 3.5, w: .3 });
  rect(180, -120, 170, 14, JUMBO_COLS[1], { lw: 0 });
  rect(338, -70, 16, 18, o.lights ? '#fffbe0' : '#e8e8e8', { lw: 2.5 });
  if (o.hazard && Math.sin(t * 8) > 0) { blob(-356, -60, 8, 8, '#ffb23a', { lw: 0, glow: '#ff9a2a', gb: 20 }); blob(344, -40, 7, 7, '#ffb23a', { lw: 0, glow: '#ff9a2a', gb: 20 }); }
  // rear door (swings open on the left end)
  if (o.door > 0) { ctx.save(); ctx.translate(-360, -165); ctx.scale(1 - o.door * .9, 1); rect(-4, -135, 30, 270, '#e8e8e4', { lw: 4 }); ctx.restore();
    rect(-356, -296, 10, 262, o.inside || '#1a0a0a', { lw: 0 }); }
  for (const wx of [-270, -170, 250]) { blob(wx, -22, 36, 36, '#2b2a2e', { lw: 4, w: .5 }); blob(wx, -22, 15, 15, '#c9c9c9', { lw: 3 }); const a = -t * (o.moving ? 12 : 0); curve([[wx + Math.cos(a) * 13, -22 + Math.sin(a) * 13], [wx - Math.cos(a) * 13, -22 - Math.sin(a) * 13]], 2.5); }
  ctx.restore();
  if (o.lights) glow(x + d * 350 * s, y - 60 * s, 170, 'rgba(255,250,210,1)', .5);
}

/* ---------- phone screen close-up (full frame): incoming call ---------- */
function phoneScreen(t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = o.bg || '#2a2430'; ctx.fillRect(0, 0, W, H);
  const shake = o.ring ? Math.sin(t * 60) * 6 : 0;
  ctx.translate(640 + shake, 360);
  rect(-190, -330, 380, 660, '#111114', { lw: 6, w: .3 });
  const g = ctx.createLinearGradient(0, -310, 0, 310); g.addColorStop(0, '#1b2a44'); g.addColorStop(1, '#0a0f1c'); ctx.fillStyle = g; ctx.fillRect(-172, -310, 344, 620);
  txt(o.label || 'Εισερχόμενη κλήση', 0, -230, 20, '#9aa7bd', { font: TVFONT, weight: 700 });
  txt(o.number || '+86 755 8888 1442', 0, -170, 30, '#ffffff', { font: TVFONT, weight: 900 });
  txt(o.sub || 'Shenzhen, Κίνα', 0, -130, 18, '#9aa7bd', { font: TVFONT, weight: 700 });
  if (o.count) txt(`${o.count} αναπάντητες`, 0, -90, 18, '#ff6a6a', { font: TVFONT, weight: 900 });
  if (!o.inCall) { blob(-90, 210, 40, 40, '#e8392b', { lw: 3 }); blob(90, 210, 40, 40, '#28c840', { lw: 3 }); txt('✕', -90, 210, 30, '#fff', { weight: 900 }); txt('✆', 90, 212, 30, '#fff', { weight: 900 }); }
  else { txt(o.timer || '00:03', 0, -90, 22, '#28c840', { font: TVFONT, weight: 900 }); blob(0, 210, 40, 40, '#e8392b', { lw: 3 }); txt('✕', 0, 210, 30, '#fff', { weight: 900 }); }
  if (o.ring) for (let i = 0; i < 3; i++) { const r = ((t * 200 + i * 60) % 180); ctx.save(); ctx.globalAlpha = (1 - r / 180) * .5; ctx.strokeStyle = '#28c840'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(90, 210, 40 + r * .6, 0, TAU); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}

/* ---------- the Shenzhen factory (from Ep. 1's last scene) ---------- */
function factoryBG(t, o = {}) {
  ctx.fillStyle = o.red ? '#4a1a1e' : '#b8c0c8'; ctx.fillRect(-800, -600, 2900, 1900);
  const lit = o.lit ?? 0;
  for (let r = 0; r < 3; r++) for (let i = -8; i < 16; i++) {
    const x = i * 120 + (r % 2) * 60, y = 100 + r * 160, on = hash(i * 7 + r) < lit;
    ctx.save(); ctx.translate(x, y); ctx.scale(.5, .5); sita({ x: 0, top: 0, w: 110, h: 210, t, chip: on ? 1 : 0, led: on ? 'red' : 'off', mood: 'evil', frame: true, open: o.klak ? .15 : 0 }); ctx.restore();
  }
  txt('工厂 · ΕΡΓΟΣΤΑΣΙΟ · SHENZHEN', 640, 40, 26, o.red ? '#ffb0b0' : '#5a6068', { font: TVFONT, weight: 900 });
  rect(-800, 560, 2900, 40, '#4a4a52', { lw: 4 });
  for (let i = -20; i < 40; i++) blob(i * 60 - (t * 80) % 60, 600, 14, 14, '#2a2a30', { lw: 3 });
}
function factoryGlow(t, lit) { for (let r = 0; r < 3; r++) for (let i = -8; i < 16; i++) if (hash(i * 7 + r) < lit) glow(i * 120 + (r % 2) * 60, 100 + r * 160 + 21, 30, 'rgba(255,40,40,1)', .55); }

/* ---------- the army: cheap Chinese "smart" junk with red LED eyes ---------- */
function redEye(x, y, r = 4) { blob(x, y, r, r, '#ff2a2a', { lw: 1.2, glow: '#ff2020', gb: 12 }); }
function airFryer(x, y, t, o = {}) {
  const w = Math.sin(t * 9 + x) * (o.walk ? 12 : 0);
  if (!o.noLegs) for (const s of [-1, 1]) limb([[x + s * 22, y - 12], [x + s * 26 + w * s, y + 16]], 5, '#555');
  poly([[x - 38, y - 12], [x + 38, y - 12], [x + 32, y - 92], [x - 32, y - 92]], o.col || '#2a2a30', { lw: 3.5, w: .4 });
  rect(x - 26, y - 70, 52, 34, '#1a1a1e', { lw: 2 }); rect(x - 10, y - 30, 20, 8, '#888', { lw: 2 });
  redEye(x, y - 82, 5);
  if (o.pop) { for (let i = 0; i < 6; i++) blob(x + Math.cos(i) * 30 * o.pop, y - 60 - Math.sin(i) * 30 * o.pop, 6, 3, '#f2c230', { lw: 1.5 }); }   // chips everywhere
}
function robotVac(x, y, t, o = {}) {
  blob(x, y - 10, 46, 14, '#3a3a42', { lw: 3.5 }); blob(x, y - 18, 40, 10, '#4a4a52', { lw: 2 });
  if (o.gun) { rect(x - 4, y - 44, 8, 24, '#555', { lw: 2 }); rect(x - 2, y - 48, 34, 7, '#555', { lw: 2 }); }   // tank turret (a Dyson knock-off nozzle)
  redEye(x + 26, y - 18, 4);
}
function selfieDrone(x, y, t, o = {}) {
  ctx.save(); ctx.translate(x, y); if (o.fall) ctx.rotate(o.fall * 3);
  rect(-16, -6, 32, 12, '#e8e8ec', { lw: 2.5 });
  for (const s of [-1, 1]) { curve([[s * 16, -2], [s * 30, -6]], 2.5); blob(s * 32, -10, 14, 3, 'rgba(120,120,130,.6)', { lw: 1, rot: t * 40 }); }
  redEye(0, 2, 3); ctx.restore();
}
function massageGun(x, y, t, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  rect(-8, -10, 16, 44, '#2a2a30', { lw: 2.5 }); rect(-8, -26, 54, 20, '#2a2a30', { lw: 2.5 });
  blob(52 + Math.sin(t * 60) * 5, -16, 8, 8, '#555', { lw: 2 }); redEye(6, -16, 3); ctx.restore();
}
function inflatableCroc(x, y, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(o.dir || 1, 1);
  const b = Math.sin(t * 5) * 4;
  blob(0, -30 + b, 90, 30, '#5fc04a', { lw: 4, w: .6 }); blob(96, -40 + b, 44, 18, '#5fc04a', { lw: 4, w: .5 });
  for (let i = 0; i < 5; i++) poly([[-60 + i * 30, -56 + b], [-48 + i * 30, -72 + b], [-36 + i * 30, -56 + b]], '#4aa03a', { lw: 2.5 });
  blob(80, -58 + b, 8, 8, '#fff', { lw: 2 }); redEye(82, -58 + b, 3.5);
  curve([[64, -30 + b], [130, -34 + b]], 2.5);
  ctx.restore();
}
function smartBell(x, y, t) { rect(x - 14, y - 40, 28, 44, '#2a2a30', { lw: 2.5 }); blob(x, y - 10, 8, 8, '#555', { lw: 2 }); redEye(x, y - 28, 5); }

/* ---------- ΣΙΤΑ v2: steel frame, rivets, a bigger laser, and a sticker ---------- */
function sitaV2(st = {}) {
  const cx = st.x ?? DOOR.x, top = st.top ?? DOOR.top, w = st.w ?? DOOR.w, h = st.h ?? DOOR.h;
  sita({ ...st, frame: false });
  ctx.save(); ctx.lineJoin = 'round';
  rect(cx - w / 2 - 14, top - 14, w + 28, h + 20, null, { lw: 10, sc: '#7a7f88', w: .2 });
  for (let i = 0; i < 6; i++) for (const s of [-1, 1]) blob(cx + s * (w / 2 + 7), top + 10 + i * h / 6, 3.5, 3.5, '#c8ccd2', { lw: 1.5 });
  const [ex, ey] = sitaEye(st);
  rect(ex - 8, ey - 9, 26, 18, '#3a3a42', { lw: 2.5 }); blob(ex + 18, ey, 5, 5, st.laser ? '#ff3030' : '#7a2a2a', { lw: 1.5, glow: st.laser ? '#ff2020' : null, gb: 16 });
  ctx.save(); ctx.translate(cx - w / 2 + 6, top + h - 40); ctx.rotate(-.12); rect(0, 0, 70, 24, '#ffd23f', { lw: 2 }); txt('ΑΝΤΙΠΑΝΤΟΦΛΙΚΗ', 35, 7, 6.5, INK, { font: TVFONT, weight: 900 }); txt('ΘΩΡΑΚΙΣΗ', 35, 16, 6.5, INK, { font: TVFONT, weight: 900 }); ctx.restore();
  ctx.restore();
}
function sitaV2Eye(st = {}) { const [ex, ey] = sitaEye(st); return [ex + 18, ey]; }

/* ---------- the IQOS, unmasked: a tiny assassin mecha ----------
   torso = the pocket charger, head = the LED ring, sword = a TEREA stick. o: { k 0..1 transform, swing, dir } */
function iqosMecha(x, y, t, o = {}) {
  const k = o.k ?? 1, d = o.dir || 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(d, 1);
  if (k < 1) { iqos(0, -30 * (1 - k), 1.3, 0, 'red', t); iqosCharger(30 * k, -20, 1.1); ctx.restore(); return; }
  for (const s of [-1, 1]) limb([[s * 8, -20], [s * 14 + Math.sin(t * 14) * 6 * s, 0]], 4, '#4a5058');
  rect(-15, -64, 30, 46, '#4a5058', { lw: 3, w: .2 });
  blob(0, -76, 12, 10, '#3a3f46', { lw: 2.5 }); redEye(0, -76, 4);
  const sw = o.swing || 0;
  ctx.save(); ctx.translate(14, -50); ctx.rotate(-1.1 + sw * 2.2);
  limb([[0, 0], [16, 0]], 3.5, '#4a5058'); rect(16, -3, 54, 6, '#efe6cf', { lw: 2 }); rect(16, -3, 10, 6, '#c8a24a', { lw: 0 });
  ctx.restore();
  ctx.restore();
}

/* ---------- village sets ---------- */
function villageStreet(t, o = {}) {            // Ep. 1 scene 9's street, in any light
  const light = o.light || 'day';
  sky(light, t);
  for (const [x, w, h, col] of [[-420, 300, 260, '#e8dcc4'], [-100, 260, 220, '#efe4cf'], [180, 220, 280, '#e2d6bd'], [1180, 360, 300, '#efe4cf'], [1560, 300, 240, '#e8dcc4']]) {
    rect(x, 520 - h, w, h, col, { lw: 4, w: .6 }); rect(x - 8, 520 - h - 14, w + 16, 16, '#b8603a', { lw: 3.5, w: .4 });
    rect(x + w * .3, 520 - h * .7, 50, 60, o.redWindows ? '#8a2020' : '#2a2420', { lw: 3, w: .3 });
  }
  poly([[-600, 520], [2400, 520], [2400, 800], [-600, 800]], '#4a484e', { lw: 0 });
  rect(-600, 520, 3000, 22, '#9a968c', { lw: 3, w: .3 });
  ctx.save(); ctx.fillStyle = '#d8d0b0'; for (let i = -8; i < 36; i++) ctx.fillRect(i * 90, 650, 50, 6); ctx.restore();
  if (o.pole !== false) { limb([[640, 700], [640, 150]], 12, '#8a7458', { w: .4 }); limb([[640, 170], [700, 150], [720, 160]], 5, '#555', { w: .3 });
    poly([[700, 160], [744, 160], [736, 176], [708, 176]], '#3a3a40', { lw: 3 }); blob(722, 180, 12, 6, o.redLamp ? '#ff3030' : o.lamp ? '#fff6c0' : '#555', { lw: 2 }); }
}
/* the καφενείο: a low white building, a TV on the wall under the awning, tables and old men */
function kafeneio(t, o = {}) {
  sky(o.light || 'day', t);
  rect(-200, 220, 1700, 480, '#f1ebdc', { lw: 4, w: .6 });
  rect(-220, 200, 1740, 30, '#c4643c', { lw: 4, w: .5 });
  poly([[-200, 250], [1500, 250], [1460, 330], [-160, 330]], '#3f7fb3', { lw: 4, w: .4 });           // awning
  for (let i = 0; i < 17; i++) curve([[-190 + i * 100, 250], [-150 + i * 100, 330]], 2, 'rgba(255,255,255,.5)', { w: 0 });
  rect(420, 150, 440, 60, '#f4f1ea', { lw: 4 }); txt('ΚΑΦΕΝΕΙΟ «Η ΠΑΡΕΑ»', 640, 180, 30, '#3f7fb3', { font: TVFONT, weight: 900 });
  doorway(1150, 690, 150, 300, '#2a2420', 1);
  tv(640, 470, 300, 170, o.screen, { stand: false });
  poly([[-600, 690], [2000, 690], [2000, 800], [-600, 800]], '#d9d0bd', { lw: 0 }); curve([[-600, 690], [2000, 690]], 4);
  for (const tx of [240, 1040]) { rect(tx - 70, 590, 140, 12, '#f4f1ea', { lw: 3 }); limb([[tx, 600], [tx, 690]], 5, '#c8c0b0'); }
}
/* the church with its bell tower; o.bell 0..1 swing, o.red, o.helmet (bell missing: it's on the mecha) */
function bellTower(x, y, t, o = {}) {
  rect(x - 170, y - 260, 340, 260, '#f4f1ea', { lw: 4, w: .6 });
  poly([[x - 190, y - 260], [x + 190, y - 260], [x, y - 360]], '#c4643c', { lw: 4 });
  doorway(x, y, 90, 150, '#5a3a2a', 1);
  rect(x + 90, y - 560, 110, 300, '#f4f1ea', { lw: 4, w: .5 });                       // the tower
  poly([[x + 80, y - 560], [x + 210, y - 560], [x + 145, y - 640]], '#c4643c', { lw: 4 });
  curve([[x + 145, y - 640], [x + 145, y - 680]], 4); curve([[x + 130, y - 666], [x + 160, y - 666]], 4);   // cross
  rect(x + 110, y - 530, 70, 90, o.red ? '#5a0a0a' : '#2a2a3a', { lw: 3 });              // the bell arch
  if (!o.helmet) { const sw = Math.sin(t * 6) * (o.bell || 0) * .5; ctx.save(); ctx.translate(x + 145, y - 525); ctx.rotate(sw);
    poly([[-20, 10], [20, 10], [28, 52], [-28, 52]], '#c8a24a', { lw: 3 }); blob(0, 56, 5, 5, '#8a6a2a', { lw: 2 }); ctx.restore(); }
}
/* tiled rooftops seen from above-ish, for the chase */
function rooftops(t, o = {}) {
  sky(o.light || 'dusk', t);
  for (let i = -3; i < 12; i++) {
    const x = i * 220, y = 430 + hash(i) * 80;
    poly([[x, y], [x + 200, y], [x + 200, 800], [x, 800]], '#e8dcc4', { lw: 4, w: .5 });
    poly([[x - 12, y], [x + 212, y], [x + 100, y - 70]], '#c4643c', { lw: 4, w: .5 });
    for (let k = 0; k < 6; k++) curve([[x + k * 36, y - 4], [x + 100 + (k - 2.5) * 10, y - 60]], 2, '#9c4a2a', { w: .2 });
  }
}
/* the new mecha: the Jumbo truck on end as its torso, the army as its limbs, the church bell as its helmet */
function mecha2(t, o = {}) {
  const x = o.x ?? 820, bk = o.build ?? 1, fall = o.fall || 0;
  const part = (i, sx, sy, fn) => {
    const k = ease(clamp(bk * 1.6 - i * .12));
    const dx = fall * (hash(i) - .5) * 900, dy = fall * (200 + hash(i + 3) * 200), rot = fall * (hash(i + 7) - .5) * 3;
    ctx.save(); ctx.translate(lerp(sx, 0, k) + dx, lerp(sy, 0, k) + dy); ctx.rotate(rot + (1 - k) * (hash(i) - .5) * 1.5); fn(); ctx.restore();
  };
  ctx.save(); ctx.translate(x, GROUND); ctx.scale(o.s || 1, o.s || 1); ctx.translate(-x, -GROUND);
  part(0, -500, 0, () => { robotVac(x - 110, GROUND, t, { gun: 1 }); robotVac(x + 110, GROUND, t, { gun: 1 }); for (const s of [-1, 1]) limb([[x + s * 110, GROUND - 20], [x + s * 90, GROUND - 170]], 16, '#4a4a52'); });
  part(1, -900, 0, () => { ctx.save(); ctx.translate(x, GROUND - 330); ctx.rotate(-Math.PI / 2); ctx.scale(.42, .42); jumboTruck(0, 360, t, {}); ctx.restore(); });
  part(2, 500, 100, () => { for (const s of [-1, 1]) { limb([[x + s * 100, GROUND - 420], [x + s * 190, GROUND - 330], [x + s * 220, GROUND - 240]], 14, '#4a4a52'); airFryer(x + s * 230, GROUND - 200, t, { noLegs: 1 }); } });
  part(3, 0, -500, () => { sitaV2({ x, top: GROUND - 640, w: 110, h: 210, t, chip: 1, led: 'red', mood: o.mood || 'evil', burn: 1, talk: o.talk || 0, laser: o.laser, frame: false }); });
  part(4, 300, -600, () => { ctx.save(); ctx.translate(x, GROUND - 660); poly([[-60, 10], [60, 10], [70, -60], [-70, -60]], '#c8a24a', { lw: 4 }); blob(0, -66, 12, 8, '#8a6a2a', { lw: 3 }); ctx.restore(); });   // bell helmet
  ctx.restore();
}
function mecha2Eye(o = {}) { const x = o.x ?? 820, s = o.s || 1; const [ex, ey] = sitaV2Eye({ x, top: GROUND - 640, w: 110, h: 210 }); return [x + (ex - x) * s, GROUND + (ey - GROUND) * s]; }

/* ---------- τηλεπώληση: a full 1280×720 TV-shop frame (use as a tv() screen or full frame) ----------
   o: { title, sub, price, product(), bg:[top,bottom], banner (bottom strip text), red (the σίτα's revolution version) } */
function starburst(x, y, r, col, s1, s2, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3) * .08);
  const P = []; for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, rr = i % 2 ? r * .78 : r; P.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
  poly(P, col, { lw: 5, w: .5, smooth: false });
  if (s1) txt(s1, 0, s2 ? -r * .2 : 0, r * .42, '#fff', { font: TVFONT, style: 'italic', weight: 900, stroke: r * .07 });
  if (s2) txt(s2, 0, r * .3, r * .24, '#fff', { font: TVFONT, style: 'italic', weight: 900, stroke: r * .05 });
  ctx.restore();
}
function tvShop(t, o = {}) {
  const [c0, c1] = o.bg || (o.red ? ['#3a0a10', '#c0202a'] : ['#ffd23f', '#ff7a1a']);
  const g = ctx.createLinearGradient(0, 0, 0, 720); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(0, 0, 1280, 720);
  ctx.save(); ctx.translate(640, 380); ctx.rotate(t * .25); ctx.fillStyle = o.red ? 'rgba(255,60,60,.16)' : 'rgba(255,255,255,.2)';
  for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1500, -200); ctx.lineTo(1500, 200); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  if (o.product) o.product();
  if (o.title) txt(o.title, 640, 90, o.titleSize || 64, o.red ? '#ff3030' : '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 12, sc: '#fff' });
  if (o.sub) txt(o.sub, 640, 158, 34, '#fff', { font: TVFONT, style: 'italic', weight: 900, stroke: 7, sc: INK });
  if (o.price) starburst(1060, 330, 120, o.red ? '#8a0a10' : '#e8392b', o.price, o.price2, t);
  if (o.banner !== '') {
    rect(0, 610, 1280, 110, o.red ? '#1a0406' : '#e8392b', { lw: 0 });
    const flash = Math.floor(t * 3) % 2;
    txt(o.banner || 'ΤΗΛΕΦΩΝΗΣΤΕ ΤΩΡΑ!', 640, 646, 44, flash ? '#ffd23f' : '#fff', { font: TVFONT, style: 'italic', weight: 900, stroke: 8, sc: INK });
    txt(o.number || '801 11 8888 · +86 755 8888 1442', 640, 694, 24, '#fff', { font: TVFONT, weight: 900 });
  }
  if (o.red) for (let i = 0; i < 3; i++) redEye(120 + i * 30, 40, 7);
  if (o.live) { rect(40, 30, 110, 40, '#e8392b', { lw: 3 }); txt('● LIVE', 95, 50, 22, '#fff', { font: TVFONT, weight: 900 }); }
}
/* the smart beach chair (it's the σίτα's: red LED on the armrest). open 0..1 */
function beachChair(x, y, open = 1, t = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(o.dir || 1, 1);
  const k = ease(clamp(open)), back = lerp(-.1, -1.05, k), seat = lerp(-1.5, 0, k);
  // legs
  limb([[-50, 0], [lerp(-20, 30, k), -60 * k - 20 * (1 - k)]], 7, '#c8ccd2', { w: .2 });
  limb([[50, 0], [lerp(20, -30, k), -60 * k - 20 * (1 - k)]], 7, '#c8ccd2', { w: .2 });
  // seat
  ctx.save(); ctx.translate(0, -62); ctx.rotate(seat * .3);
  poly([[-58, 0], [58, 0], [54, 12], [-54, 12]], '#2a8ad8', { lw: 3.5 });
  for (let i = 0; i < 5; i++) rect(-50 + i * 22, 1, 10, 10, '#f4f3ee', { lw: 0 });
  ctx.restore();
  // back
  ctx.save(); ctx.translate(-54, -58); ctx.rotate(back);
  rect(0, -12, 130, 24, '#2a8ad8', { lw: 3.5 }); for (let i = 0; i < 5; i++) rect(8 + i * 24, -10, 12, 20, '#f4f3ee', { lw: 0 });
  ctx.restore();
  // armrest with the LED
  rect(20, -96, 44, 10, '#c8ccd2', { lw: 2.5 }); redEye(56, -91, 3.5);
  ctx.restore();
}
/* Κώστας's couch */
function sofa(x, y, col = '#7a5a8a') {
  rect(x - 200, y - 150, 400, 90, col, { lw: 4, w: .5 });
  rect(x - 220, y - 70, 440, 70, col, { lw: 4, w: .5 });
  for (const s of [-1, 1]) rect(x + s * 200 - 30, y - 110, 60, 110, col, { lw: 4, w: .5 });
  for (const s of [-1, 1]) curve([[x + s * 70, y - 140], [x + s * 70, y - 76]], 2.5, 'rgba(0,0,0,.25)');
}
/* the fridge in Μίμης's kitchen with Βαγγελιώ's note */
function fridge(x, y, noteK = 1) {
  rect(x - 70, y - 330, 140, 330, '#eef0ee', { lw: 4, w: .5 }); curve([[x - 70, y - 210], [x + 70, y - 210]], 3);
  rect(x + 48, y - 300, 8, 60, '#b8bcc0', { lw: 2 }); rect(x + 48, y - 180, 8, 80, '#b8bcc0', { lw: 2 });
  for (const [mx, my, c] of [[x - 40, y - 290, '#e8392b'], [x + 10, y - 280, '#2a8ad8'], [x - 30, y - 120, '#ffd23f']]) blob(mx, my, 8, 8, c, { lw: 2 });
  if (noteK > 0) { ctx.save(); ctx.translate(x - 20, y - 170); ctx.rotate(-.06); rect(-40, -34, 80, 72, '#fff8d8', { lw: 2.5 }); for (let i = 0; i < 5; i++) curve([[-32, -20 + i * 12], [lerp(-32, 30, noteK) - i * 4, -20 + i * 12]], 1.8, '#3a4a8a', { w: .8 }); blob(0, -34, 6, 6, '#e8392b', { lw: 2 }); ctx.restore(); }
}
/* the world map for the chain montage: a dot travels from Λέχαιο to Shenzhen (k 0..1) */
function signalMap(t, k, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0c1424'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(80,140,200,.15)'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // crude continents
  poly([[120, 200], [300, 150], [420, 190], [460, 300], [380, 360], [300, 340], [240, 420], [160, 360]], '#1f3a5a', { lw: 2, sc: '#4a7ab0' });          // Europe
  poly([[300, 380], [420, 380], [470, 470], [430, 620], [360, 640], [310, 520]], '#1f3a5a', { lw: 2, sc: '#4a7ab0' });                                    // Africa
  poly([[440, 150], [700, 110], [1000, 130], [1160, 220], [1120, 330], [1000, 380], [900, 440], [780, 400], [640, 360], [500, 300]], '#1f3a5a', { lw: 2, sc: '#4a7ab0' });  // Asia
  const A = [330, 320], B = [1010, 360], mid = [670, 150];
  const q = (u) => [lerp(lerp(A[0], mid[0], u), lerp(mid[0], B[0], u), u), lerp(lerp(A[1], mid[1], u), lerp(mid[1], B[1], u), u)];
  ctx.strokeStyle = 'rgba(255,60,60,.8)'; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath();
  for (let i = 0; i <= 40 * k; i++) { const p = q(i / 40); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.setLineDash([]);
  const p = q(k); blob(p[0], p[1], 9, 9, '#ff3030', { lw: 0, glow: '#ff2020', gb: 24 });
  blob(A[0], A[1], 6, 6, '#ffd23f', { lw: 0 }); txt('ΛΕΧΑΙΟ', A[0], A[1] + 26, 20, '#ffd23f', { font: TVFONT, weight: 900 });
  blob(B[0], B[1], 6, 6, '#ffd23f', { lw: 0 }); txt('深圳 SHENZHEN', B[0], B[1] + 26, 20, '#ffd23f', { font: TVFONT, weight: 900 });
  if (o.back) { const r = q(1 - o.back); rect(r[0] - 22, r[1] - 14, 44, 28, '#c9995a', { lw: 2.5 }); }
  ctx.restore();
}
/* shipping paperwork on screen (full frame): two orders merging into one parcel */
function orderSheet(t, rows, k = 1, stamp = 0) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#3a3440'; ctx.fillRect(0, 0, W, H);
  rect(240, 40, 800, 640, '#fbf8ef', { lw: 5 });
  txt('ΔΕΛΤΙΟ ΑΠΟΣΤΟΛΗΣ · 发货单', 640, 100, 34, INK, { font: TVFONT, weight: 900 });
  const n = Math.floor(rows.length * k + .001);
  rows.slice(0, n).forEach(([a, b, col], i) => { txt(a, 300, 170 + i * 50, 24, '#5a5a66', { font: TVFONT, weight: 700, align: 'left' }); txt(b, 980, 170 + i * 50, 24, col || INK, { font: TVFONT, weight: 900, align: 'right' }); curve([[300, 192 + i * 50], [980, 192 + i * 50]], 1.2, '#d0ccc0', { w: 0 }); });
  if (stamp > 0) { ctx.save(); ctx.translate(840, 610); ctx.rotate(-.12); ctx.globalAlpha = clamp(stamp * 2); const s = lerp(2, 1, ease(clamp(stamp * 2))); ctx.scale(s, s); rect(-160, -44, 320, 88, null, { lw: 7, sc: '#c0202a' }); txt('ΙΔΙΟ ΔΕΜΑ', 0, 0, 50, '#c0202a', { font: TVFONT, weight: 900 }); ctx.restore(); }
  ctx.restore();
}
/* the Jumbo Κορίνθου loading dock */
function jumboStore(t, o = {}) {
  sky(o.light || 'day', t);
  rect(-400, 180, 2200, 520, '#f4f4f0', { lw: 4, w: .5 });
  rect(-400, 180, 2200, 40, JUMBO_COLS[0], { lw: 3 });
  jumboLogo(760, 280, 110);
  for (let i = 0; i < 3; i++) { rect(120 + i * 380, 400, 280, 290, '#6a6e76', { lw: 4 }); for (let j = 0; j < 9; j++) curve([[124 + i * 380, 410 + j * 30], [396 + i * 380, 410 + j * 30]], 2, '#565a62', { w: 0 }); }
  poly([[-600, 690], [2000, 690], [2000, 800], [-600, 800]], '#9a968c', { lw: 0 }); curve([[-600, 690], [2000, 690]], 4);
}
/* a shipping container, red LED in the lock */
function container(x, y, t, o = {}) {
  rect(x - 260, y - 240, 520, 240, o.col || '#c0392b', { lw: 5, w: .5 });
  for (let i = 0; i < 16; i++) curve([[x - 250 + i * 32, y - 232], [x - 250 + i * 32, y - 8]], 2.5, 'rgba(0,0,0,.25)', { w: .3 });
  txt('SHENZHEN EXPRESS 深圳', x, y - 200, 22, '#fff', { font: TVFONT, weight: 900 });
  if (o.label) { rect(x + 120, y - 140, 110, 60, '#fff', { lw: 2.5 }); txt(o.label, x + 175, y - 110, 12, INK, { font: TVFONT, weight: 900 }); }
  redEye(x - 220, y - 110, 5);
}

/* the plastic table with anyone at it: list = [[x, who, state], ...] (like tableScene, any cast/positions) */
function tableOf(t, list, o = {}) {
  for (const [x] of list) chair(x);
  for (const [x, who, st] of list) person(x, SEAT, 1, CAST[who], { ...st, part: 'legs', legs: 'seat' });
  for (const [x, who, st] of list) person(x, SEAT, 1, CAST[who], { ...st, part: 'body' });
  table(t, o);
  if (o.cups) for (const cx of o.cups) freddo(cx, 540);
  for (const [x, who, st] of list) person(x, SEAT, 1, CAST[who], { ...st, part: 'arms' });
}
