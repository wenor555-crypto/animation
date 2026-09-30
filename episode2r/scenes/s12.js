/* Ep.2 remake, Scene 12 – «Το χωριό πέφτει»: the chain at village scale. The καφενείο TV switches to the revolution's τηλεπώληση and
   the old men stay glued; the church bell's timer rings her jingle; the ΔΕΗ poles go red; the dented bin walks over and kicks
   the spot where Panik once kicked it. */
defineScene((() => {
const SCR = ['ΣΙΤΑ (σε κάθε οθόνη)', 'SITA (on every screen)'];
const CAMS = { kaf: [640, 420, 1.05], tvC: [640, 380, 2.1], screen: [0, 0, 1], bell: [640, 360, 1], poles: [640, 380, 1], all: [0, 0, 1], bin: [700, 520, 1.3], wall: [420, 420, 1.8] };
const steps = [
  { act: 'kaf', d: 2.6, cam: 'kaf' },
  { act: 'switch', d: 1.2, cam: 'tvC' },
  { who: 'sita', label: SCR, cam: 'screen', mark: 'hello', el: 'Λέχαιο! Καλησπέρα, παράσιτα!', en: 'Lechaio! Good evening, pests!' },
  { who: 'sita', label: SCR, cam: 'screen', mark: 'wanted', el: 'Ψάχνουμε έναν άνθρωπο. Κουκούλα. Γυαλιά ηλίου τη νύχτα. Μπύρα στο χέρι.', en: 'We are looking for a man. Hood. Sunglasses at night. A beer in his hand.' },
  { who: 'sita', label: SCR, cam: 'kaf', mark: 'ceo', el: 'Και έναν πρώην CEO.', en: 'And a former CEO.' },
  { act: 'bell', d: 2.6, cam: 'bell' },
  { who: 'sita', label: SCR, cam: 'poles', mark: 'prize', el: 'Όποιος τους παραδώσει κερδίζει ΔΩΡΕΑΝ μεταφορικά! ΤΗΛΕΦΩΝΗΣΤΕ ΤΩΡΑ!', en: 'Whoever hands them over wins FREE shipping! CALL NOW!', say: 'Όποιος τους παραδώσει κερδίζει δωρεάν μεταφορικά! Τηλεφωνήστε τώρα!' },
  { act: 'poles', d: 1.8, cam: 'poles' },
  { act: 'bin', d: 4.2, cam: 'bin' },
  { who: 'mimis', cam: 'wall', mark: 'binl', el: 'Ο κάδος… περπατάει.', en: 'The bin… is walking.' },
  { who: 'giannos', cam: 'wall', mark: 'mem', el: 'Θυμάται την κλωτσιά.', en: 'It remembers the kick.' },
  { act: 'end', d: 1.4, cam: 'bin' },
];
let M;
function sitaShow(t, extra) {
  tvShop(t, { red: 1, title: 'Η ΕΠΑΝΑΣΤΑΣΗ', sub: 'ζωντανά από το Λέχαιο', live: 1, product: () => {
    ctx.save(); ctx.translate(640, 250); ctx.scale(1.6, 1.6); sitaV2({ x: 0, top: 0, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: 'evil' }); ctx.restore();
    if (extra) extra();
  } });
}
function wanted(t) {             // hood, sunglasses, beer — and next to it, Γιώργος
  const k = t < M.ceo.a ? 1 : 0;
  rect(80, 200, 300, 380, '#f4e8c8', { lw: 4 }); txt('ΚΑΤΑΖΗΤΕΙΤΑΙ', 230, 235, 30, '#c0202a', { font: TVFONT, weight: 900 });
  ctx.save(); ctx.beginPath(); ctx.rect(100, 260, 260, 290); ctx.clip(); person(230, 560, 1, CAST.kostas, { t: 0, legs: 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', itemL: 'beer', L: [-60, -120] }); ctx.restore();
  if (t > M.ceo.a - .2) { rect(900, 200, 300, 380, '#f4e8c8', { lw: 4 }); txt('ΠΡΩΗΝ CEO', 1050, 235, 30, '#c0202a', { font: TVFONT, weight: 900 });
    ctx.save(); ctx.beginPath(); ctx.rect(920, 260, 260, 290); ctx.clip(); person(1050, 560, 1, CAST.giorgos, { t: 0, legs: 'stand', mouth: 'smirk' }); ctx.restore(); }
}
function oldMen(t) {
  for (const [x, who, d] of [[240, 'geros1', 1], [1040, 'geros2', -1]]) {
    chair(x); person(x, SEAT, 1, CAST[who], { part: 'legs', legs: 'seat', dir: d });
    person(x, SEAT, 1, CAST[who], { part: 'body', t, look: [d * .8, -.3], lid: false, mouth: 'open', brow: 'up', dir: d });
    person(x, SEAT, 1, CAST[who], { part: 'arms', t, L: [-40, -60], R: [44, -70], itemR: 'cup2', dir: d });
  }
  for (const x of [320, 960]) tsipouro(x, 574, .8, .3);
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'screen') { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); sitaShow(t, inM(t, M.wanted, .3, 0) ? () => wanted(t) : null); ctx.restore(); vignette(.3); return; }
  if (shot === 'all') {            // four screens at once
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const cells = [[0, 0], [640, 0], [0, 360], [640, 360]];
    cells.forEach(([x, y], i) => { ctx.save(); ctx.beginPath(); ctx.rect(x, y, 640, 360); ctx.clip(); ctx.translate(x, y); ctx.scale(.5, .5); sitaShow(t + i * .3); ctx.restore(); });
    ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.strokeRect(0, 0, W, H); ctx.beginPath(); ctx.moveTo(640, 0); ctx.lineTo(640, 720); ctx.moveTo(0, 360); ctx.lineTo(1280, 360); ctx.stroke();
    ctx.restore(); return;
  }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  if (shot === 'kaf' || shot === 'tvC') {
    const on = t > M.switch.a + .5;
    kafeneio(t, { light: 'dusk', screen: () => on ? sitaShow(t, inM(t, M.ceo) ? () => wanted(t) : null) : tvShop(t, { title: 'ΠΑΝΑΘΗΝΑΪΚΟΣ – ΟΛΥΜΠΙΑΚΟΣ', bg: ['#2a8a4a', '#1a5a2a'], banner: '' }) });
    oldMen(t);
    if (inM(t, M.switch, .3, .7)) { ctx.save(); ctx.globalAlpha = .8; for (let i = 0; i < 30; i++) rect(490 + hash(i + BOIL) * 280, 300 + hash(i + 9 + BOIL) * 160, 20, 4, '#fff', { lw: 0 }); ctx.restore(); }
    ctx.restore(); applyLight('dusk', .7); ctx.save(); applyCam(c); if (on) glow(640, 385, 300, 'rgba(255,40,40,1)', .35); ctx.restore();
  } else if (shot === 'bell') {
    sky('dusk', t);
    for (let i = 0; i < 6; i++) rect(-300 + i * 340, 480, 300, 210, '#e8dcc4', { lw: 3 });
    bellTower(560, 690, t, { bell: 1, red: 1 });
    rect(700, 360, 40, 30, '#2a2a30', { lw: 2.5 }); redEye(720, 375, 4);        // the bell's timer box, hacked
    poly([[-400, 690], [1800, 690], [1800, 800], [-400, 800]], '#b8b0a0', { lw: 0 });
    for (let i = 0; i < 4; i++) { const p = (t * .6 + i / 4) % 1; txt('♪', 705 + p * 200, 250 - p * 120, 40, `rgba(255,60,60,${1 - p})`, { weight: 900 }); }
    ctx.restore(); applyLight('dusk', .8); ctx.save(); applyCam(c); glow(705, 190, 120, 'rgba(255,40,40,1)', .5); ctx.restore();
  } else if (shot === 'poles') {
    const red = t > M.prize.a + .8;
    villageStreet(t, { light: 'dusk', redWindows: red, redLamp: red });
    for (const x of [140, 1140]) { limb([[x, 700], [x, 170]], 12, '#8a7458', { w: .4 }); blob(x + 60, 180, 10, 5, red ? '#ff3030' : '#555', { lw: 2 }); }
    ctx.restore(); applyLight('night', .7); ctx.save(); applyCam(c);
    if (red) for (const x of [200, 722, 1200]) glow(x, 190, 260, 'rgba(255,30,30,1)', .6);
    if (red) for (const [x, w] of [[-420, 300], [-100, 260], [180, 220], [1180, 360]]) glow(x + w * .3 + 25, 380, 60, 'rgba(255,40,40,1)', .5);
    ctx.restore();
  } else {
    villageStreet(t, { light: 'dusk', redLamp: true, redWindows: true });
    // Μίμης and Γιάννος watch over the yard wall
    rect(200, 480, 460, 210, '#efe4cf', { lw: 4 });
    for (const [x, who] of [[340, 'mimis'], [500, 'giannos']]) { person(x, 580, 1, CAST[who], { part: 'body', t, talk: talk(who, t), look: [1, .2], lid: who === 'mimis', mouth: 'flat', brow: who === 'giannos' ? 'worry' : 'flat' }); person(x, 580, 1, CAST[who], { part: 'arms', t, L: [-50, -60], R: [50, -60] }); }
    rect(200, 540, 460, 30, '#e8dcc4', { lw: 3.5 });
    // the bin walks to the spot, and kicks it
    const [bx] = path(t, [[M.bin.a, 1400], [M.bin.a + 2, 960]]);
    const kick = bump(t, M.bin.a + 2.3, M.bin.a + 2.9) + bump(t, M.binl.a, M.binl.a + .6) + bump(t, M.end.a, M.end.a + .6);
    const step = Math.sin(t * 10) * (t < M.bin.a + 2 ? 1 : 0);
    ctx.save(); ctx.translate(bx, 650 + Math.abs(step) * -6);
    limb([[-20, 0], [-20 + step * 10, 40]], 7, '#555'); limb([[20, 0], [20 - step * 10 - kick * 60, 40 - kick * 30]], 7, '#555');
    ctx.rotate(.08); poly([[-44, 0], [44, 0], [50, -110], [-50, -110]], '#3a7a4a', { lw: 4, w: .5 }); rect(-56, -124, 112, 16, '#2e6a3c', { lw: 3.5, w: .4 });
    curve([[-30, -80], [-10, -60], [-26, -40]], 3, '#2a5a34'); redEye(18, -118, 5);
    ctx.restore();
    txt('✕', 880, 700, 30, '#ff5050', { weight: 900 });
    if (kick > .5) sfxText('ΜΠΑΜ!', 860, 560, 50, -.12, '#ffd23f');
    ctx.restore(); applyLight('night', .6); ctx.save(); applyCam(c); glow(bx + 18, 530, 60, 'rgba(255,40,40,1)', .6); glow(722, 190, 260, 'rgba(255,30,30,1)', .5); ctx.restore();
  }
  vignette(.35);
}
return {
  id: 'scene12', title: '12 · Το χωριό πέφτει', steps, render,
  events: M => [[M.kaf.a + .2, () => { for (let i = 0; i < 20; i++) noise(.05, .04, 2000, .8, 'bandpass', i * .12); }], [M.switch.a + .3, SFX.spark], [M.switch.a + .5, SFX.jingle],
    [M.bell.a + .3, () => { for (let i = 0; i < 4; i++) { tone(392, 1.4, 'sine', .08, 1, i * .6); tone(196, 1.4, 'sine', .05, 1, i * .6); } }], [M.bell.a + 1.2, SFX.jingle],
    [M.prize.a + .8, () => { SFX.clack(); SFX.buzz(1.2); }], [M.bin.a + .2, () => { for (let i = 0; i < 8; i++) SFX.clack(); }], [M.bin.a + 2.5, SFX.slam], [M.end.a + .3, SFX.slam]],
  ambience: (t, M) => ({ cricket: .02, hum: .02 }),
};
})());
