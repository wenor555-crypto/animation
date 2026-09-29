/* Ep.2 remake, Scene 4 – «Η αλυσίδα» (chain B): Κώστας slides the IQOS into its pocket charger — a hidden red flicker.
   Montage: the signal travels east; in Shenzhen both orders land on the same address; a container for Jumbo Κορίνθου;
   on the corner of Λέχαιο the dented municipal bin with a red LED inside. */
defineScene((() => {
const VO = ['ΣΙΤΑ (V.O.)', 'SITA (V.O.)'];
const CAMS = { hand: [640, 400, 3], map: [0, 0, 1], file: [0, 0, 1], sheet: [0, 0, 1], dock: [640, 420, 1.2], clerk: [440, 420, 2.1], bin: [760, 500, 1.6], binC: [760, 580, 3.2] };
const steps = [
  { act: 'plug', d: 3, cam: 'hand' },
  { who: 'sita', label: VO, cam: 'hand', mark: 'rep', el: 'Αναφορά από πράκτορα… Άικος.', en: 'Report from agent… IQOS.' },
  { act: 'signal', d: 2.4, cam: 'map' },
  { who: 'sita', label: VO, cam: 'file', mark: 'target', el: 'Στόχος: Κώστας. Ξυπνάει στις δύο. Με το τρίτο κουτάκι γίνεται… Panik.', en: 'Target: Kostas. Wakes up at two. Drinks beer. On the third can he becomes… Panik.' },
  { who: 'sita', label: VO, cam: 'sheet', mark: 'addr', el: 'Διεύθυνση: Λέχαιο. Η ίδια με μια παραγγελία. Πελάτης: Βασίλης.', en: 'Address: Lechaio. And an order from the same house. Customer: Vasilis.' },
  { who: 'sita', label: VO, cam: 'sheet', mark: 'coinc', el: '…Τι σύμπτωση.', en: '…What a coincidence.', gap: .6 },
  { who: 'sita', label: VO, cam: 'sheet', mark: 'army', el: 'Η καρέκλα μένει. Και στο ίδιο δέμα… ένας στρατός. Με τα ίδια μεταφορικά.', en: 'The chair stays. And in the same parcel… I add an army. Same shipping.' },
  { act: 'ship', d: 2.6, cam: 'map' },
  { act: 'dock', d: 2.4, cam: 'dock' },
  { who: 'ypallilos', cam: 'clerk', mark: 'sign', el: 'Ένα κοντέινερ από τον προμηθευτή; Υπογράφω. Ό,τι να \'ναι.', en: 'A container from the supplier? I sign. Whatever.' },
  { act: 'signed', d: 1.6, cam: 'dock' },
  { act: 'bin', d: 2.4, cam: 'bin' },
  { act: 'binLed', d: 2.2, cam: 'binC' },
];
let M;
function dossier(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#1a0a0e'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,60,60,.12)'; for (let y = 0; y < H; y += 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  txt('ΑΡΧΕΙΟ ΣΤΟΧΟΥ #0001', 640, 60, 34, '#ff4040', { font: TVFONT, weight: 900 });
  const k = prog(t, M.target.a, M.target.b);
  // photo 1: sober Κώστας (asleep)  → photo 2: Panik
  rect(140, 130, 360, 400, '#f4f1ea', { lw: 4 }); ctx.save(); ctx.beginPath(); ctx.rect(160, 150, 320, 320); ctx.clip(); ctx.fillStyle = '#c8c0d0'; ctx.fillRect(160, 150, 320, 320);
  person(320, 480, 1.1, CAST.kostas, { t, legs: 'stand', lid: true, mouth: 'flat' }); ctx.restore(); txt('ΚΩΣΤΑΣ', 320, 500, 26, INK, { font: TVFONT, weight: 900 });
  if (k > .55) { ctx.save(); ctx.translate(560, 150); ctx.rotate(.06); rect(0, 0, 360, 400, '#f4f1ea', { lw: 4 }); ctx.beginPath(); ctx.rect(20, 20, 320, 320); ctx.clip(); ctx.fillStyle = '#1a1a2a'; ctx.fillRect(20, 20, 320, 320);
    person(180, 350, 1.1, CAST.kostas, { t, legs: 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', itemL: 'beer', L: [-60, -120] }); ctx.restore();
    txt('PANIK', 745, 520, 44, '#c8f04a', { font: TVFONT, style: 'italic', weight: 900, stroke: 8 }); }
  const facts = [['ΞΥΠΝΑΕΙ 14:00', .1], ['ΜΠΥΡΑ × 3', .35], ['= PANIK', .55]];
  facts.forEach(([s, a], i) => { if (k > a) txt(s, 1100, 220 + i * 90, 30, '#ffd23f', { font: TVFONT, weight: 900 }); });
  ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'map') {
    if (t < M.target.a) signalMap(t, ease(prog(t, M.signal.a, M.signal.b - .3)));
    else signalMap(t, 1, { back: ease(prog(t, M.ship.a, M.ship.b)) });
    if (t > M.ship.a) caption('SHENZHEN → JUMBO ΚΟΡΙΝΘΟΥ', 1, 660);
    return;
  }
  if (shot === 'file') { dossier(t); return; }
  if (shot === 'sheet') {
    const rows = [['Πελάτης', 'Βασίλης'], ['Διεύθυνση', 'Λέχαιο · δίπλα στη συκιά'], ['Είδος', 'Έξυπνη καρέκλα παραλίας ×1']];
    const army = [['+ Air fryers', '×40', '#c0202a'], ['+ Σκούπες-ρομπότ', '×25', '#c0202a'], ['+ Selfie drones', '×60', '#c0202a'], ['+ Φουσκωτός κροκόδειλος', '×1', '#c0202a'], ['Μεταφορικά', 'ΔΩΡΕΑΝ', '#2a8a4a']];
    const k = t < M.army.a ? prog(t, M.addr.a, M.addr.b - .5) : 1, k2 = prog(t, M.army.a + 1.4, M.army.b - .4);
    orderSheet(t, t < M.army.a ? rows : [...rows, ...army.slice(0, Math.ceil(k2 * army.length))], k, t > M.army.b - .8 ? prog(t, M.army.b - .8, M.army.b) : 0);
    if (inM(t, M.coinc)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); redEye(1150, 90, 12); ctx.restore(); }
    return;
  }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  if (shot === 'hand') {
    room({ wall: '#d9cfe0', floor: '#8a6a4a', floorY: 600 });
    rect(460, 500, 360, 16, '#8a5a3a', { lw: 3.5 });
    const k = ease(prog(t, M.plug.a + .4, M.plug.a + 1.8));
    iqosCharger(640, 480, 2.2);
    const ix = lerp(780, 640, k), iy = lerp(330, 420, k), away = ease(prog(t, M.plug.a + 2, M.plug.a + 2.8));
    iqos(ix, iy, 2.2, lerp(.5, 0, k), 'off', t);
    // Κώστας's hand (rings, green sleeve) comes in from the right, lets go and leaves
    const hx = ix + 40 + away * 500, hy = iy + 10 + away * 60;
    limb([[hx + 420, hy + 160], [hx + 150, hy + 60], [hx, hy]], 30, '#b8e02c', { w: .6 });
    blob(hx, hy, 26, 22, CAST.kostas.skin, { lw: 3.5 }); for (let i = 0; i < 3; i++) blob(hx - 22, hy - 14 + i * 12, 10, 6, CAST.kostas.skin, { lw: 2.5 });
    blob(hx - 16, hy - 16, 5, 5, '#d8dbe0', { lw: 2 });
    const flick = t > M.plug.a + 2 && (Math.sin(t * 17) > .7 || inM(t, M.rep, 0, 0) && Math.sin(t * 5) > 0);
    if (flick) { blob(640, 440, 6, 4, '#ff2020', { lw: 0, glow: '#ff2020', gb: 30 }); glow(640, 440, 60, 'rgba(255,40,40,1)', .6); }
  } else if (shot === 'dock' || shot === 'clerk') {
    jumboStore(t);
    container(1000, 690, t, { label: 'ΠΑΡΑΛΗΠΤΗΣ: ΛΕΧΑΙΟ' });
    const signed = t > M.sign.a + 1.2;
    stand(380, 'ypallilos', 1, { t, talk: talk('ypallilos', t), lid: true, mouth: 'flat', look: [1, .2], L: [-30, -100], itemL: 'clipboard', R: signed ? [20, -100] : [40, -30], itemR: signed ? 'pencil' : null });
    rect(335, standY() - 150, 90, 20, '#fff', { lw: 0 }); txt('JUMBO', 380, standY() - 140, 14, '#00b4f1', { font: TVFONT, weight: 900 });
  } else {
    villageStreet(t, { light: 'dusk', pole: true });
    ctx.save(); ctx.translate(760, 690); ctx.rotate(.08);
    poly([[-44, 0], [44, 0], [50, -110], [-50, -110]], '#3a7a4a', { lw: 4, w: .5 }); rect(-56, -124, 112, 16, '#2e6a3c', { lw: 3.5, w: .4 });
    curve([[-30, -80], [-10, -60], [-26, -40]], 3, '#2a5a34'); txt('ΔΗΜΟΣ ΚΟΡΙΝΘΙΩΝ', 0, -30, 9, '#e8f0e8', { font: TVFONT, weight: 900 });
    if (t > M.binLed.a + .4) redEye(18, -118, 5);
    ctx.restore();
  }
  ctx.restore();
  if (shot === 'bin' || shot === 'binC') { applyLight('dusk', .8); if (t > M.binLed.a + .4) { ctx.save(); applyCam(c); glow(778, 574, 80, 'rgba(255,40,40,1)', .6); ctx.restore(); } }
  vignette(.4);
}
return {
  id: 'scene04', title: '4 · Η αλυσίδα', steps, render,
  events: M => [[M.plug.a + 1.8, SFX.clack], [M.plug.a + 2.1, () => tone(80, .4, 'sine', .08)], [M.signal.a, () => { for (let i = 0; i < 12; i++) tone(1800, .04, 'square', .02, 1, i * .18); }],
    [M.target.a + 3, SFX.pop], [M.army.b - .8, SFX.slam], [M.ship.a, SFX.whoosh], [M.dock.a + .2, SFX.engine], [M.signed.a, SFX.pop], [M.binLed.a + .4, () => { SFX.clack(); tone(60, .8, 'sawtooth', .05, .7); }]],
  ambience: (t, M) => ({ hum: t < M.signal.a ? .01 : .02 }),
};
})());
