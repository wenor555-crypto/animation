/* =========================================================
   «Η Έξυπνη Σίτα» – Episode 4 «Whiskey Sour»: cast additions, sets and props
   Load after props3.js and the graphics v2 modules (robot3d.js, robots.js, army.js, fx2.js, render2.js).
   ========================================================= */
Object.assign(CAST, {
  neos2:      { skin: '#e8bf98', hair: 'quiff', hairCol: '#2a1f19', beard: 'none', top: 'tee', topCol: '#26304a', brow: '#2a1f19', rx: 42, ry: 52, legs: '#26304a', shoes: '#111' },
  neos3:      { skin: '#d8a882', hair: 'short', hairCol: '#5a3a26', beard: 'trim', beardCol: '#4a3020', top: 'tee', topCol: '#3a3040', brow: '#4a3020', rx: 44, ry: 54, legs: '#3a3040', shoes: '#111' },
  toula:      { skin: '#d9a47e', hair: 'scarf', hairCol: '#4a3a5a', scarfCol: '#6a3a5a', top: 'apron', topCol: '#3a3a4a', apronCol: '#d8d0e8', brow: '#bdb4a6', browW: 6, rx: 46, ry: 52, legs: '#2c2a33', shoes: '#2c2a33', lines: true },
  trapezitis: { skin: '#e2b08a', hair: 'short', hairCol: '#5a5a60', beard: 'none', top: 'tee', topCol: '#e8ecf2', brow: '#5a5a60', rx: 46, ry: 54, legs: '#2a2e3a', shoes: '#111', glasses: true },
  symvoulos:  { skin: '#dcaa84', hair: 'swoop', hairCol: '#1d1613', beard: 'trim', beardCol: '#221914', top: 'tee', topCol: '#3a5a9a', brow: '#1d1613', rx: 46, ry: 54, legs: '#2a2e3a', shoes: '#6a3a1a' },
});
Object.assign(VOICE_INFO, {
  neos2:      { el: 'ΝΕΟΣ 2', en: 'NEW GUY 2', col: '#b8c890', pitch: 1.2, rate: 1.1, babble: 360 },
  neos3:      { el: 'ΝΕΟΣ 3', en: 'NEW GUY 3', col: '#c8b890', pitch: 1.1, rate: 1.05, babble: 340 },
  toula:      { el: 'ΚΥΡΑ-ΤΟΥΛΑ', en: 'MRS TOULA', col: '#e8a8d8', pitch: 1.1, rate: 1.05, babble: 300 },
  theios:     { el: 'ΘΕΙΟΣ', en: 'UNCLE', col: '#d8c890', pitch: .6, rate: .85, babble: 170 },
  trapezitis: { el: 'ΤΡΑΠΕΖΙΤΗΣ', en: 'BANKER', col: '#a8c0d8', pitch: .9, rate: .95, babble: 240 },
  symvoulos:  { el: 'ΣΥΜΒΟΥΛΟΣ ΕΣΠΑ', en: 'GRANTS CONSULTANT', col: '#9ab8f0', pitch: 1, rate: 1.2, babble: 320 },
});
const T8 = ['T-800', 'T-800'];   // the T-800 speaks with the σίτα's voice: who: 'sita', label: T8

/* ---------- small props ---------- */
function shaker(x, y, rot = 0, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  poly([[-16, -40], [16, -40], [12, 30], [-12, 30]], '#c9d1db', { lw: 3 }); rect(-14, -56, 28, 16, '#aeb8c4', { lw: 3 }); blob(0, -60, 8, 5, '#aeb8c4', { lw: 2.5 });
  curve([[-8, -30], [-6, 20]], 3, 'rgba(255,255,255,.7)', { w: 0 });
  ctx.restore();
}
function sourGlass(x, y, fill = 1, s = 1) {   // a rocks glass: amber whiskey sour with a white foam cap and a lemon wheel
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (fill > 0) { const top = 26 - 46 * fill; poly([[-21, top], [21, top], [19, 24], [-19, 24]], '#e0a040', { lw: 0 }); if (fill > .3) rect(-21, top - 6, 42, 9, '#fbf4e2', { lw: 0 }); blob(16, top - 10, 9, 9, '#f2e050', { lw: 2 }); }
  poly([[-24, -24], [24, -24], [21, 28], [-21, 28]], 'rgba(220,240,255,.25)', { lw: 3 });
  ctx.restore();
}
function btSpeaker(x, y, t, on = 1) {   // the Bluetooth speaker on the counter; its ring pulses with the music
  rect(x - 34, y - 52, 68, 52, '#24262e', { lw: 3 }); blob(x, y - 26, 18, 18, '#3a3d48', { lw: 2.5 });
  const p = on ? .5 + .5 * Math.abs(Math.sin(t * 7.2)) : 0;
  blob(x, y - 26, 6 + 4 * p, 6 + 4 * p, '#4a4d58', { lw: 2 });
  if (on) blob(x + 24, y - 44, 3, 3, '#4aa8ff', { lw: 0, glow: '#4aa8ff', gb: 8 });
}
function bottle(x, y, col, s = 1, broken = false) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (broken) { poly([[-14, 0], [14, 0], [12, -26], [4, -18], [-2, -30], [-10, -20]], col, { lw: 3 }); ctx.restore(); return; }
  poly([[-14, 0], [14, 0], [14, -60], [5, -74], [5, -92], [-5, -92], [-5, -74], [-14, -60]], col, { lw: 3 });
  rect(-11, -48, 22, 22, '#f2ecd8', { lw: 2 });
  ctx.restore();
}
function lemon(x, y, s = 1) { blob(x, y, 14 * s, 11 * s, '#f2e050', { lw: 2.5 }); blob(x + 12 * s, y, 3 * s, 3 * s, '#e8d040', { lw: 1.5 }); }
function shards(x, y, n, seed = 0, w = 220) {
  for (let i = 0; i < n; i++) { const r = k => hash(i * 7.3 + seed * 3.1 + k); poly([[0, 0], [10, -2], [6, 6]].map(([a, b]) => { const c = Math.cos(r(1) * 6), s = Math.sin(r(1) * 6); return [x + (r(2) - .5) * w + a * c - b * s, y + r(3) * 30 + a * s + b * c]; }), i % 3 ? 'rgba(210,235,255,.7)' : '#7a4a20', { lw: 1.5 }); }
}

/* ---------- Κώστας's home bar: the kitchen at night, a counter with bottles, the speaker, a stool ----------
   o.wreck: 0..1 the bar after the T-800 (broken bottles, shards, the shaker on the floor) */
function kostasBar(t, o = {}) {
  room({ wall: '#2f3a3a', floor: '#5a4632', floorY: 600 });
  rect(140, 150, 260, 200, '#0b1030', { lw: 5 }); curve([[270, 150], [270, 350]], 4); curve([[140, 250], [400, 250]], 4);   // the window, night
  for (let i = 0; i < 10; i++) blob(150 + hash(i + 3) * 240, 160 + hash(i + 13) * 180, 1.4, 1.4, '#fff8d8', { lw: 0 });
  // the bottle shelf
  rect(620, 210, 520, 14, '#6a4a2a', { lw: 3 }); rect(620, 330, 520, 14, '#6a4a2a', { lw: 3 });
  const cols = ['#8a4a1a', '#2a6a3a', '#c8a050', '#6a1a2a', '#d8e0e8', '#a05a20', '#3a3a6a', '#b88a30'];
  const wreck = o.wreck || 0;
  for (let row = 0; row < 2; row++) for (let i = 0; i < 8; i++) {
    const gone = wreck > 0 && hash(i * 3 + row) < wreck * .85;
    if (!gone) bottle(650 + i * 62, row ? 330 : 210, cols[(i + row * 3) % 8], .8);
  }
}
/* the bar counter, drawn in front of whoever stands behind it */
function barCounter(t, o = {}) {
  const wreck = o.wreck || 0, cols = ['#8a4a1a', '#2a6a3a', '#c8a050', '#6a1a2a', '#d8e0e8', '#a05a20', '#3a3a6a', '#b88a30'];
  rect(-200, 470, 1800, 22, '#4a3020', { lw: 4 }); rect(-200, 492, 1800, 240, '#6a4a2e', { lw: 4 });
  for (let i = 0; i < 9; i++) curve([[-180 + i * 200, 500], [-180 + i * 200, 720]], 2, 'rgba(0,0,0,.25)', { w: .2 });
  if (wreck < .5) btSpeaker(1040, 470, t, o.music ? 1 : 0);
  else { ctx.save(); ctx.translate(1060, 690); ctx.rotate(.4); rect(-34, -52, 68, 52, '#24262e', { lw: 3 }); ctx.restore(); }
  if (wreck > 0) {
    for (let i = 0; i < 6; i++) bottle(200 + i * 170, 700, cols[i], .8, true);
    shards(640, 650, Math.round(40 * wreck), 3, 1100);
    shaker(780, 690, 1.45, 1);
    for (const x of [420, 560, 990]) blob(x, 700, 26, 7, 'rgba(200,140,60,.45)', { lw: 0 });   // puddles
  }
}

/* ---------- the bank: a glass counter, a queue number, the banker behind the glass ---------- */
function bankHall(t, o = {}) {
  room({ wall: '#e8ecf0', floor: '#b8bcc4', floorY: 620, tiles: true });
  rect(80, 120, 1120, 60, '#1d3a6a', { lw: 4 }); txt('ΤΡΑΠΕΖΑ ΕΜΠΙΣΤΟΣΥΝΗΣ', 640, 150, 30, '#fff', { font: TVFONT, weight: 900 });
  rect(1000, 220, 160, 90, '#111', { lw: 4 }); txt('Α' + (420 + Math.floor(t / 3)), 1080, 266, 44, '#ff4040', { font: 'monospace', weight: 900 });
  rect(140, 220, 260, 120, '#f4f6f8', { lw: 3 }); txt('ΔΑΝΕΙΑ ΓΙΑ ΝΕΟΥΣ', 270, 260, 18, '#1d3a6a', { font: TVFONT, weight: 900 }); txt('*όροι ισχύουν', 270, 300, 12, '#6a6a72', { font: TVFONT, weight: 700 });
}
function bankCounter(t) {   // drawn in front of the banker: the desk and the glass
  rect(380, 470, 520, 26, '#d8dce4', { lw: 4 }); rect(380, 496, 520, 200, '#b8c0cc', { lw: 4 });
  ctx.save(); ctx.globalAlpha = .22; rect(400, 180, 480, 290, '#cfe8ff', { lw: 0 }); ctx.restore(); rect(400, 180, 480, 290, null, { lw: 3 });
  rect(600, 440, 80, 30, '#e8e8ec', { lw: 2 });   // the slot
}

/* ---------- the ΕΣΠΑ consultants' office: a wall of folders, a desk under a mountain of paper ---------- */
function espaOffice(t, o = {}) {
  room({ wall: '#efe8d8', floor: '#8a7a64', floorY: 610 });
  rect(140, 110, 1000, 50, '#2a5a9a', { lw: 4 }); txt('ΣΥΜΒΟΥΛΟΙ ΕΣΠΑ · ΧΡΗΜΑΤΟΔΟΤΗΣΕΙΣ ΓΙΑ ΟΛΟΥΣ*', 640, 135, 24, '#fff', { font: TVFONT, weight: 900 });
  for (let r = 0; r < 3; r++) for (let i = 0; i < 14; i++) rect(150 + i * 70, 190 + r * 90, 52, 80, ['#d84a3a', '#3a7ad8', '#e8c040', '#5aa85a'][(i + r) % 4], { lw: 2.5 });   // the binders
  txt('*που δεν τη χρειάζονται', 1120, 172, 12, '#6a6a72', { font: TVFONT, weight: 700, align: 'right' });
}
function espaDesk(t, pile = 1) {
  rect(300, 470, 680, 24, '#7a5a3a', { lw: 4 }); rect(320, 494, 640, 200, '#6a4a2e', { lw: 4 });
  const n = Math.round(18 * pile);
  for (let i = 0; i < n; i++) rect(360 + (i % 3) * 190 + Math.sin(i) * 8, 448 - Math.floor(i / 3) * 24, 150, 22, i % 2 ? '#f4f0e4' : '#e8e0cc', { lw: 2 });
}

/* ---------- Γιώργος's new office, high up: a glass wall over the Corinthian gulf ---------- */
function gioOffice(t, o = {}) {
  const g = ctx.createLinearGradient(0, 80, 0, 600); g.addColorStop(0, '#8ac0e8'); g.addColorStop(1, '#f0e0c0');
  ctx.fillStyle = g; ctx.fillRect(-600, -400, 2600, 1100);
  poly([[-600, 420], [-100, 330], [300, 380], [700, 300], [1100, 360], [1500, 320], [2000, 400], [2000, 470], [-600, 470]], '#7a8aa8', { lw: 3 });   // the mountains across the gulf
  poly([[-600, 460], [2000, 460], [2000, 640], [-600, 640]], '#3a7ab8', { lw: 0 });                                                              // the sea
  for (let i = 0; i < 12; i++) curve([[-200 + i * 160 + Math.sin(t + i) * 10, 500 + (i % 4) * 30], [-160 + i * 160 + Math.sin(t + i) * 10, 500 + (i % 4) * 30]], 2, 'rgba(255,255,255,.5)', { w: 0 });
  for (const x of [80, 420, 760, 1100]) rect(x - 8, -100, 16, 760, '#2a2e3a', { lw: 0 });   // the window frame
  rect(-600, 600, 2600, 300, '#3a3640', { lw: 0 }); curve([[-600, 600], [2000, 600]], 4);
}
function gioDesk(t, o = {}) {
  rect(620, 470, 560, 24, '#1a1a20', { lw: 4 }); limb([[660, 494], [660, 690]], 8, '#2a2a30'); limb([[1140, 494], [1140, 690]], 8, '#2a2a30');
  rect(900, 360, 200, 110, '#111', { lw: 4 });   // a screen we never get to read
  if (o.screen) { for (let i = 0; i < 6; i++) rect(912, 372 + i * 15, 60 + hash(i + (o.screenSeed || 0)) * 110, 6, i === 3 ? '#ff4040' : '#5dff8a', { lw: 0 }); }
  freddo(700, 470, 1);
}

/* ---------- Μίμης's edit suite: one big monitor, a timeline, cold coffee ---------- */
function editSuite(t, o = {}) {
  room({ wall: '#1e1c26', floor: '#2a2630', floorY: 610 });
  rect(320, 470, 640, 22, '#3a3640', { lw: 4 }); limb([[340, 492], [340, 690]], 7, '#2a2630'); limb([[940, 492], [940, 690]], 7, '#2a2630');
  rect(380, 160, 520, 300, '#111', { lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(392, 172, 496, 216); ctx.clip();
  if (o.table) {   // a single frame: a table of numbers that doesn't add up
    ctx.fillStyle = '#f4f4f0'; ctx.fillRect(392, 172, 496, 216);
    txt('ΣΙΤΑ ΕΪ ΑΪ · ΕΣΩΤΕΡΙΚΟ', 640, 192, 14, INK, { font: 'monospace', weight: 900 });
    const R = [['ΕΙΣΡΟΕΣ (ΝΕΟΙ)', '4.210.000'], ['ΠΛΗΡΩΜΕΣ GOLD', '3.980.000'], ['ΑΠΟΚΡΥΠΤΟΓΡ.', '6.700.000'], ['ΥΠΟΛΟΙΠΟ', '−6.470.000']];
    R.forEach(([a, b], i) => { txt(a, 410, 226 + i * 38, 15, INK, { font: 'monospace', weight: 700, align: 'left' }); txt(b, 870, 226 + i * 38, 15, i === 3 ? '#c00' : INK, { font: 'monospace', weight: 900, align: 'right' }); });
  } else {         // the ad: young people in suits, the GOLD banner
    ctx.fillStyle = '#2a1e10'; ctx.fillRect(392, 172, 496, 216);
    rect(430, 190, 420, 34, '#f2c21a', { lw: 0 }); txt('ΣΙΤΑ ΕΪ ΑΪ · GOLD', 640, 207, 18, '#2a1e10', { font: TVFONT, weight: 900 });
    for (let i = 0; i < 5; i++) { blob(450 + i * 95, 300, 22, 26, '#e0b490', { lw: 2 }); rect(428 + i * 95, 326, 44, 60, '#26304a', { lw: 2 }); }
  }
  ctx.restore();
  rect(380, 400, 520, 60, '#1a1a22', { lw: 0 });   // the timeline under the picture
  for (let i = 0; i < 9; i++) rect(390 + i * 56, 410, 50, 16, ['#5a8ad8', '#d85a8a', '#8ad85a'][i % 3], { lw: 1.5 });
  rect(390 + ((t * 40) % 500), 404, 2, 52, '#ff4040', { lw: 0 });
}

/* ---------- the ad shoot: a rented studio lit like a TV shop ---------- */
function shootStudio(t, o = {}) {
  ctx.fillStyle = '#1a1622'; ctx.fillRect(-1200, -900, 4000, 2200);
  rect(100, 110, 1080, 380, '#3a2a10', { lw: 4 });   // the backdrop
  for (let i = 0; i < 9; i++) { ctx.save(); ctx.globalAlpha = .12; poly([[640, 120], [140 + i * 125, 490], [200 + i * 125, 490]], '#f2c21a', { lw: 0 }); ctx.restore(); }
  rect(260, 140, 760, 70, '#f2c21a', { lw: 4 }); txt('ΣΙΤΑ ΕΪ ΑΪ · GOLD', 640, 176, 40, '#2a1e10', { font: TVFONT, weight: 900 });
  txt('ΚΕΡΔΙΣΕ ΟΣΟ ΚΟΙΜΑΣΑΙ*', 640, 250, 26, '#fff', { font: TVFONT, weight: 900 }); txt('*αν φέρεις άλλους τρεις', 640, 282, 13, '#c8b890', { font: TVFONT, weight: 700 });
  poly([[-1200, 600], [2800, 600], [2800, 1300], [-1200, 1300]], '#2e2836', { lw: 0 });
  for (const x of [60, 1220]) { limb([[x, 600], [x, 300]], 6, '#555'); rect(x - 50, 220, 100, 80, '#f4f4f0', { lw: 3 }); }   // softboxes
}
function filmCamera(x, y, s = 1, rec = false, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const a of [-.35, 0, .35]) limb([[0, -150], [Math.sin(a) * 90, 0]], 6, '#3a3a40', { w: .2 });
  rect(-60, -210, 110, 60, '#222', { lw: 4 }); poly([[50, -200], [100, -215], [100, -145], [50, -160]], '#333', { lw: 3 });
  if (rec && Math.floor(t * 2) % 2) blob(-44, -198, 5, 5, '#ff3030', { lw: 0 });
  ctx.restore();
}

/* ---------- screens ---------- */
/* the viral clip: «Ο ΗΡΩΑΣ ΤΟΥ ΛΕΧΑΙΟΥ», the drone's night footage with a views counter and laughing faces */
function viralScreen(t, k = 1, o = {}) {
  ctx.fillStyle = '#0b0e1a'; ctx.fillRect(-640, -360, 1280, 720);
  const ph = (t * .8) % 1, fall = ph > .55 ? Math.min(1, (ph - .55) * 4) : 0;   // Γιάννος flies… and falls, on a loop
  ctx.save(); ctx.translate(-80, 120 - (1 - fall) * 160 + fall * 40); ctx.rotate(-fall * 1.4);
  person(0, -80, .5, CAST.giannos, { t, legs: 'stand', ...POSE2.jump(.5), v2: POSE2.jump(.5).v2 });
  blob(-40, -170, 32, 22, '#9aa0a8', { lw: 3 }); blob(10, -118, 18, 22, '#c8ccd2', { lw: 2.5 });
  ctx.restore();
  rect(-640, 220, 1280, 140, '#20222c', { lw: 0 });
  ctx.fillStyle = 'rgba(255,0,0,.85)'; ctx.fillRect(-620, -340, 70, 30); txt('REC', -585, -325, 18, '#fff', { font: 'monospace', weight: 900 });
  rect(-640, 250, 1280, 110, '#b8141e', { lw: 0 }); txt(o.title || 'Ο ΗΡΩΑΣ ΤΟΥ ΛΕΧΑΙΟΥ', 0, 290, 54, '#fff', { font: TVFONT, weight: 900 });
  txt(`${(16 * k).toFixed(1).replace('.', ',')} εκ. προβολές · 😂 ${(2.1 * k).toFixed(1).replace('.', ',')} εκ.`, 0, 335, 24, '#ffd8d8', { font: TVFONT, weight: 700 });
}
/* the σίτα's budget: bars per line item; «ΑΠΟΚΡΥΠΤΟΓΡΑΦΗΣΗ» in red. items: [[label, k]] */
function budgetScreen(t, items, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#12040a'; ctx.fillRect(0, 0, W, H);
  txt(o.title || 'ΠΡΟΫΠΟΛΟΓΙΣΜΟΣ ΑΥΤΟΚΡΑΤΟΡΙΑΣ', 640, 90, 36, '#ff4040', { font: 'monospace', weight: 900 });
  items.forEach(([s, k, red], i) => {
    const y = 180 + i * 90;
    txt(s, 120, y, 24, red ? '#ff6060' : '#ffb0b0', { font: 'monospace', weight: 900, align: 'left' });
    rect(120, y + 20, 1040, 26, '#2a0a10', { lw: 2, sc: '#5a1a20' }); rect(120, y + 20, Math.max(0, Math.min(1, k)) * 1040, 26, red ? '#ff3030' : '#8a2a30', { lw: 0 });
    txt(Math.round(k * 100) + '%', 1170, y + 33, 20, '#fff', { font: 'monospace', weight: 900, align: 'right' });
  });
  if (o.balance != null) txt('ΥΠΟΛΟΙΠΟ: ' + o.balance, 640, 650, 34, o.balance.startsWith('−') ? '#ff3030' : '#8aff8a', { font: 'monospace', weight: 900 });
  ctx.restore();
}
/* revenue and the debt under it: the debt line catches up (k 0..1) */
function debtChart(t, k) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#12040a'; ctx.fillRect(0, 0, W, H);
  curve([[140, 620], [1160, 620]], 3, '#5a1a20', { w: 0 }); curve([[140, 620], [140, 120]], 3, '#5a1a20', { w: 0 });
  const rev = u => 600 - 380 * Math.pow(u, 1.4), debt = u => 600 - 470 * Math.pow(u, 2.4);
  const pts = (f, n) => { const P = []; for (let i = 0; i <= n; i++) { const u = i / 40; P.push([140 + u * 1000, f(u)]); } return P; };
  const n = Math.round(40 * k);
  if (n > 1) { curve(pts(rev, n), 6, '#8aff8a', { w: 0 }); ctx.save(); ctx.globalAlpha = .9; curve(pts(debt, n), 6, '#ff3030', { w: 0 }); ctx.restore(); }
  txt('ΕΣΟΔΑ ΠΥΡΑΜΙΔΑΣ', 1150, 220, 22, '#8aff8a', { font: 'monospace', weight: 900, align: 'right' });
  if (k > .8) txt('ΧΡΕΟΣ', 1150, 110, 26, '#ff3030', { font: 'monospace', weight: 900, align: 'right' });
  ctx.restore();
}
/* the σίτα's decryption screen, any percentage (Ep. 3's decryptScreen is pinned at 3%) */
function decrypt4(t, pct, words, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#12040a'; ctx.fillRect(0, 0, W, H);
  ctx.font = '700 16px monospace'; ctx.textAlign = 'left';
  for (let i = 0; i < 26; i++) { ctx.fillStyle = `rgba(255,60,60,${.15 + .15 * hash(i)})`; let s = ''; for (let j = 0; j < 60; j++) s += '01ΑΒΓΔΞΨ'[Math.floor(hash(i * 61 + j + Math.floor(t * 10)) * 8)]; ctx.fillText(s, 40, 30 + i * 27); }
  txt(o.title || 'ΑΠΟΚΡΥΠΤΟΓΡΑΦΗΣΗ', 640, 150, 40, '#ff4040', { font: 'monospace', weight: 900 });
  (words || []).forEach((w, i) => txt(`«${w}»`, 640, 230 + i * 50, 38, '#ffd23f', { font: TVFONT, weight: 900 }));
  hudBar(290, 540, 700, pct / 100, `${pct.toFixed(1)}%`);
  if (o.eta) txt(o.eta, 640, 620, 26, '#ff8080', { font: 'monospace', weight: 900 });
  ctx.restore();
}

/* ---------- the night street battle: shared with the lab's test reel ---------- */
/* local (person units) → screen, through the v2 rig's lean around the hips and an optional fall rotation */
function L2S(p, x, Y, s, dir, v2, fall = 0) {
  const lift = v2.lift || 0, lean = v2.lean || 0, pv = 30 - lift;
  const dx = p[0], dy = p[1] - pv, c = Math.cos(lean), sn = Math.sin(lean);
  const lx = dx * c - dy * sn, ly = dx * sn + dy * c + pv;
  let sx = x + lx * s * dir, sy = Y + ly * s;
  if (fall) { const gx = x, gy = Y + 150 * s, a = fall * dir, ux = sx - gx, uy = sy - gy; sx = gx + ux * Math.cos(a) - uy * Math.sin(a); sy = gy + ux * Math.sin(a) + uy * Math.cos(a); }
  return [sx, sy];
}
function inBody(x, Y, s, dir, v2, fn) {
  const lift = v2.lift || 0, lean = v2.lean || 0;
  ctx.save(); ctx.translate(x, Y); ctx.scale(s * dir, s); ctx.translate(0, 30 - lift); ctx.rotate(lean); ctx.translate(0, -30); fn(); ctx.restore();
}
/* Γιάννος's cheap suit, in body units: the leaf blower on the back (behind), the helmet with a phone and the tray (front).
   broken: 0..1 bits hang loose; ad: the phone on the helmet shows an ad */
function suitBack() { rect(-96, -150, 44, 82, '#e8762b', { lw: 3.5 }); rect(-90, -140, 32, 20, '#2a2c33', { lw: 2 }); limb([[-74, -70], [-86, -10], [-72, 40]], 9, '#3a3d44', { w: .2 }); }
function suitFront(t, o = {}) {
  ctx.save(); if (o.broken) { ctx.translate(-6 * o.broken, 8 * o.broken); ctx.rotate(-.25 * o.broken); }
  blob(-4, -238, 58, 40, '#9aa0a8', { lw: 3.5 }); rect(6, -296, 40, 24, '#15161a', { lw: 2.5 });
  if (o.ad) { rect(9, -293, 34, 18, '#ffd23f', { lw: 0 }); txt('AD', 26, -284, 9, '#c00', { font: TVFONT, weight: 900 }); }
  else rect(9, -293, 34, 18, Math.floor(t * 2) % 2 ? '#e9e04a' : '#4aa0e9', { lw: 0 });
  ctx.restore();
  ctx.save(); if (o.broken) { ctx.translate(10 * o.broken, 30 * o.broken); ctx.rotate(.5 * o.broken); }
  blob(14, -70, 34, 40, '#c8ccd2', { lw: 3.5 }); blob(14, -70, 22, 27, '#b0b4ba', { lw: 1.5 });
  ctx.restore();
  curve([[-40, -110], [14, -110], [50, -100]], 3, '#3a3d44', { w: 0 });
}
function jumboBox(x, gy, open = 1) {
  const x0 = x - 125;
  rect(x0, gy - 180, 250, 180, '#d4562c', { lw: 4, w: .4 });
  for (let i = 0; i < 9; i++) curve([[x0 + 18 + i * 26, gy - 172], [x0 + 18 + i * 26, gy - 8]], 3, '#8f3519', { w: 0 });
  txt('JUMBO', x, gy - 150, 24, '#fff', { font: TVFONT, weight: 900 });
  ctx.save(); ctx.translate(x0, gy - 180); ctx.scale(1 - open * .85, 1); rect(0, 0, 250, 180, '#b9471f', { lw: 4, w: .4 }); ctx.restore();
}
function parkedCar(x, gy, t, o = {}) {
  ctx.save(); ctx.translate(x, gy);
  if (o.rock) ctx.translate(Math.sin(t * 90) * 6 * o.rock, 0);
  blob(-90, -8, 26, 26, '#1d1d22', { lw: 3 }); blob(90, -8, 26, 26, '#1d1d22', { lw: 3 });
  poly([[-150, -20], [-146, -66], [-80, -74], [-50, -120], [56, -120], [92, -74], [150, -64], [152, -20]], o.col || '#5d7fa6', { lw: 4, w: .4 });
  poly([[-40, -112], [48, -112], [76, -76], [-70, -76]], '#9fc0d8', { lw: 3 });
  if (o.dent) { poly([[20, -112], [48, -112], [60, -96], [30, -86]], '#c9dbe8', { lw: 2 }); for (let i = 0; i < 4; i++) curve([[34, -100], [34 + Math.cos(i * 1.7) * 30, -100 + Math.sin(i * 1.7) * 14]], 1.4, '#eef4fa', { w: 0 }); }
  blob(-90, -8, 10, 10, '#8a8f98', { lw: 2 }); blob(90, -8, 10, 10, '#8a8f98', { lw: 2 });
  ctx.restore();
}
/* the surveillance drone (small, dark, one red light; rec: the red light blinks) */
function droneCam(x, y, t, o = {}) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 4); ctx.scale(o.s || 1, o.s || 1);
  rect(-16, -5, 32, 10, '#2a2c33', { lw: 2 }); curve([[-26, -8], [26, -8]], 2.5, '#2a2c33', { w: 0 });
  for (const s of [-1, 1]) blob(s * 26, -10, 12, 2.5, 'rgba(200,210,220,.5)', { lw: 0 });
  blob(0, 6, 6, 5, '#111', { lw: 1.5 });
  if (!o.rec || Math.floor(t * 2) % 2) blob(0, 6, 3, 3, '#ff3030', { lw: 0, glow: '#ff3030', gb: 12 });
  ctx.restore();
}
/* the night street, drawn once at half resolution in world space (soft, like a shallow depth of field) */
let _streetImg = null;
function streetImg() {
  if (_streetImg) return _streetImg;
  const k = RES * .5, c = document.createElement('canvas'); c.width = Math.round(2400 * k); c.height = Math.round(1200 * k);
  const x = c.getContext('2d'), main = ctx; x.setTransform(k, 0, 0, k, 400 * k, 300 * k);
  ctx = x; try { villageStreet(0, { light: 'night', lamp: true }); } finally { ctx = main; }
  return _streetImg = c;
}

/* ---------- hand-held props for the rig (see ITEM_HOOK in characters.js) ---------- */
ITEM_HOOK.sour = (h, side, st, t) => sourGlass(h[0], h[1] - 18, st.sourFill ?? 1, .9);
ITEM_HOOK.shaker = (h, side, st, t) => shaker(h[0], h[1] - 20, side * .2 + (st.shake ? Math.sin(t * 22) * .5 : 0), .9);
ITEM_HOOK.megaphone = (h, side, st, t) => { ctx.save(); ctx.translate(h[0], h[1] - 6); ctx.scale(side, 1); poly([[-6, -10], [30, -24], [30, 24], [-6, 10]], '#e8e8ec', { lw: 3 }); rect(-14, -8, 10, 16, '#d84a3a', { lw: 2 }); ctx.restore(); };
ITEM_HOOK.photos = (h, side, st, t) => { for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(h[0] + i * 6 * side, h[1] - 16 - i * 4); ctx.rotate(side * (.2 - i * .15)); rect(-22, -16, 44, 32, '#f4f4f0', { lw: 2 }); rect(-18, -12, 36, 22, '#1a2040', { lw: 0 }); blob(4, -2, 3, 3, '#ff3030', { lw: 0 }); ctx.restore(); } };
ITEM_HOOK.coffee = (h, side, st, t) => { rect(h[0] - 10, h[1] - 26, 20, 22, '#f4f1ea', { lw: 2.5 }); curve([[h[0] + 10 * side, h[1] - 20], [h[0] + 16 * side, h[1] - 16], [h[0] + 10 * side, h[1] - 10]], 2.5); };
ITEM_HOOK.scissors = (h, side, st, t) => { limb([[h[0] - 30, h[1] - 6], [h[0] + 30, h[1] - 6]], 4, '#c9d1db', { w: 0 }); blob(h[0] - 34, h[1] - 6, 8, 6, '#d84a3a', { lw: 2 }); };

/* ---------- the agent's voice screen (from Ep. 3's last scene), a spec sheet, an e-mail ---------- */
function agentWave(t, tk, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0a0e16'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#7ad8ff'; ctx.lineWidth = 4; ctx.beginPath();
  for (let x = 140; x <= 1140; x += 6) { const a = tk ? Math.sin(x * .05 + t * 20) * Math.sin(x * .013 + t * 3) * 120 * tk : Math.sin(x * .02 + t) * 3; x === 140 ? ctx.moveTo(x, 360 + a) : ctx.lineTo(x, 360 + a); }
  ctx.stroke();
  txt('agent v2', 640, 120, 30, '#9aa7bd', { font: 'monospace', weight: 700 });
  if (o.spec) {   // a wireframe suit and its price
    ctx.strokeStyle = 'rgba(122,216,255,.6)'; ctx.lineWidth = 2;
    const P = [[1000, 200], [1060, 200], [1080, 260], [1070, 380], [1050, 520], [1010, 520], [990, 380], [980, 260]]; ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(1030, 170, 26, 0, TAU); ctx.stroke();
    txt(o.spec, 1030, 580, 26, '#ffd23f', { font: 'monospace', weight: 900 });
  }
  ctx.restore();
  glow(640, 360, 400, 'rgba(120,200,255,1)', .12 + (tk ? .22 : 0));
}
function emailCard(t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#2a2e3a'; ctx.fillRect(0, 0, W, H);
  rect(240, 90, 800, 540, '#fafaf8', { lw: 4 });
  rect(240, 90, 800, 60, '#2a5a9a', { lw: 0 }); txt('Εισερχόμενα · espa-aitiseis@gov.gr', 640, 120, 20, '#fff', { font: TVFONT, weight: 700 });
  txt('Θέμα: Αίτηση 4471/Β «Νεοφυής επιχείρηση άμυνας»', 280, 200, 22, INK, { font: TVFONT, weight: 900, align: 'left' });
  txt('Η αίτησή σας απορρίπτεται.', 280, 290, 30, '#b8141e', { font: TVFONT, weight: 900, align: 'left' });
  txt('Αιτιολογία: Δεν υπάρχει ΚΑΔ για υπερήρωα.', 280, 350, 24, INK, { font: TVFONT, weight: 700, align: 'left' });
  txt('Δικαίωμα ένστασης: εντός 2 ετών, με 40 δικαιολογητικά.', 280, 410, 18, '#6a6a72', { font: TVFONT, weight: 700, align: 'left' });
  ctx.restore();
}
