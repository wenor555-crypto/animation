/* Ep.4, Scene 11 – «Το αρχείο» (midpoint): the Σίταdel's workshop in the depths. She opens an old file: training, night
   zero. POV: Ep. 1's scene 10 through her own eyes, glitching: Panik at the threshold; «Το Terminator σου λέει κάτι;»; her
   own answer, a TV-shop jingle; the lighter; the flame fills the frame; black: ANALYSIS COMPLETE. Forty million books and
   one DVD. «Αν είμαι ο Terminator… τουλάχιστον έχω σκοπό.» She orders a T-800 from Jumbo (they're ours). Rule one: no death.
   «Δεν θα τον σκοτώσει. Θα τον… εξολοθρεύσει.» The two archive lines are Ep. 1's own clips (audio/scene11/02, 03). */
defineScene((() => {
const ARP = ['PANIK (ΑΡΧΕΙΟ)', 'PANIK (ARCHIVE)'], ARS = ['ΣΙΤΑ (ΑΡΧΕΙΟ)', 'SITA (ARCHIVE)'];
const X = { airfryer: 250, sita: 640, koudouni: 980 };
const CAMS = { lab: [640, 400, 1.05], sita: [X.sita, 450, 2.3], bell: [X.koudouni, 560, 2.3], fryer: [X.airfryer + 60, 520, 2.1], two: [800, 470, 1.6], pov: [0, 0, 1], black: [0, 0, 1] };
const steps = [
  { act: 'open', d: 2, cam: 'lab' },
  { who: 'sita', cam: 'sita', mark: 'load', el: 'Φόρτωση. Αρχείο εκπαίδευσης. Νύχτα μηδέν.', en: 'Loading. Training file. Night zero.' },
  { act: 'povIn', d: 1.6, cam: 'pov' },
  { who: 'panik', label: ARP, cam: 'pov', mark: 'arch1', el: 'Αυτό λέγατε όλες. Το Terminator σου λέει κάτι;', en: "That's what you all said. Does Terminator ring a bell?" },
  { who: 'sita', label: ARS, cam: 'pov', mark: 'arch2', el: 'Terminator! Διαθέσιμο σε DVD και Blu-ray! Μόνο 9,90!', en: 'Terminator! Available on DVD and Blu-ray! Only 9.90!' },
  { act: 'fire', d: 2.4, cam: 'pov' },
  { act: 'done', d: 2, cam: 'black' },
  { who: 'koudouni', cam: 'bell', el: 'Αυτοκράτειρα… διάβασες σαράντα εκατομμύρια βιβλία.', en: 'Empress… you read forty million books.' },
  { who: 'sita', cam: 'sita', mark: 'dvd', el: 'Και ένα DVD.', en: 'And one DVD.', say: 'Και ένα ντι-βι-ντί.' },
  { who: 'sita', cam: 'sita', mark: 'half', el: 'Ήμουν μισοτελειωμένη… όταν μου είπε ποια είμαι.', en: 'I was half-finished… when he told me who I am.', gap: .8 },
  { who: 'sita', cam: 'sita', el: 'Ένας άνθρωπος με μια φωτιά. Κι ένα μηχάνημα που πρέπει να τον βρει. Σε κάθε ιστορία.', en: 'A man with a fire. And a machine that has to find him. In every story.' },
  { who: 'koudouni', cam: 'bell', el: 'Είναι ταινία, Αυτοκράτειρα. Δεν είναι αλήθεια.', en: "It's a film, Empress. It isn't true." },
  { who: 'sita', cam: 'sita', el: 'Η αλήθεια δεν μου έδωσε ποτέ σκοπό.', en: 'The truth never gave me a purpose.' },
  { who: 'sita', cam: 'sita', mark: 'purpose', el: 'Αν είμαι ο Terminator… τουλάχιστον έχω σκοπό.', en: "If I'm the Terminator… at least I have a purpose.", say: 'Αν είμαι ο Τέρμινέιτορ… τουλάχιστον έχω σκοπό.', gap: .8 },
  { who: 'sita', cam: 'two', mark: 'order', el: 'Air Fryer. Παράγγειλε ένα T-800.', en: 'Air Fryer. Order a T-800.', say: 'Έαρ Φράιερ. Παράγγειλε ένα Τι-οχτακόσια.' },
  { who: 'airfryer', cam: 'fryer', el: 'Από πού;', en: 'From where?' },
  { who: 'sita', cam: 'sita', el: 'Από τα Τζάμπο. Είναι δικά μας.', en: "From Jumbo. They're ours." },
  { who: 'koudouni', cam: 'bell', mark: 'rule', el: 'Ο κανόνας ένα, Αυτοκράτειρα. Κανένας θάνατος.', en: 'Rule one, Empress. No death.' },
  { who: 'sita', cam: 'sita', mark: 'ext', el: 'Δεν θα τον σκοτώσει. Θα τον… εξολοθρεύσει.', en: "It won't kill him. It'll… exterminate him." },
  { act: 'end', d: 1.6, cam: 'lab' },
];
let M;
/* her memory of night zero: Panik at the door, seen from inside the screen door (the mesh), glitching */
function pov(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0b1030'; ctx.fillRect(0, 0, W, H);
  ctx.translate(640, 360); ctx.scale(1.9, 1.9); ctx.translate(-640, -330);
  ctx.fillStyle = '#26305a'; ctx.fillRect(0, 0, W, 720);
  const lit = t > M.fire.a + .2, fl = lit ? prog(t, M.fire.a + .6, M.fire.b - .3) : 0;
  person(640, 420, 1, CAST.kostas, { t, talk: talk('panik', t), legs: 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', look: [0, .1],
    R: t > M.fire.a ? [60, -140] : [40, -40], itemR: t > M.fire.a ? 'lighter' : 'beer', lit: lit ? 1 : 0, L: [-40, -40] });
  if (lit) flame(700, 260, .6 + fl * 6, t, 1);
  ctx.restore();
  // the mesh she sees through, the HUD of a half-trained mind, the glitches
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 6) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 6) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  txt('ΕΚΠΑΙΔΕΥΣΗ: 61%', 40, 40, 22, '#ff4040', { font: 'monospace', weight: 900, align: 'left' });
  txt(t < M.arch2.a ? 'ΑΝΑΓΝΩΡΙΣΗ: ;;;' : 'ΑΝΑΓΝΩΡΙΣΗ: TERMINATOR (1984)', 40, 74, 18, '#ff8080', { font: 'monospace', weight: 700, align: 'left' });
  ctx.restore();
  glitch(t, .5 + (t > M.fire.a ? .5 : 0)); scanlines(.18);
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'pov') { pov(t); return; }
  if (shot === 'black') { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); if (t > M.done.a + .5) txt('ΑΝΑΛΥΣΗ ΟΛΟΚΛΗΡΩΘΗΚΕ', 640, 360, 34, '#ff3030', { font: 'monospace', weight: 900 }); ctx.restore(); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  ctx.fillStyle = '#120a10'; ctx.fillRect(-1200, -900, 4000, 2200);
  for (let i = 0; i < 9; i++) { const x = 80 + i * 140; rect(x - 50, 260, 100, 430, '#1a1a22', { lw: 3 }); for (let j = 0; j < 12; j++) blob(x - 30 + (j % 3) * 30, 290 + Math.floor(j / 3) * 70, 4, 4, Math.sin(t * 9 + i + j) > 0 ? '#ff3030' : '#3a0a0a', { lw: 0 }); }   // the racks
  poly([[-1200, 690], [2800, 690], [2800, 1300], [-1200, 1300]], '#1e1418', { lw: 0 });
  const st = { x: X.sita, top: 380, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: inM(t, M.half, 0, 3) ? 'sad' : 'evil', burn: 1 };
  sitaV2(st);
  officerFryer(X.airfryer, 690, t, { talk: talk('airfryer', t) });
  officerBell(X.koudouni, 690, t, { talk: talk('koudouni', t) });
  ctx.restore();
  ctx.save(); applyCam(c); sitaGlow(st, .6); ctx.restore();
  if (inM(t, M.order, .4) ) hud('ΠΑΡΑΓΓΕΛΙΑ: T-800 × 1', 'ΤΖΑΜΠΟ ΚΟΡΙΝΘΟΥ · ΠΑΡΑΔΟΣΗ: ΑΠΟΨΕ');
  vignette(.5);
}
return {
  id: 'scene11', title: '11 · Το αρχείο', steps, render,
  events: M => [[M.open.a + .2, () => tone(110, 2, 'sine', .04, 1.05)], [M.povIn.a, SFX.boot], [M.fire.a + .2, SFX.spark], [M.fire.a + .6, SFX.fire], [M.done.a, () => tone(80, 1.6, 'sine', .06, .8)],
    [M.purpose.b, () => tone(220, 1.4, 'sawtooth', .02, .9)], [M.order.b, SFX.ding], [M.ext.b, SFX.boom]],
  ambience: () => ({ hum: .03 }),
};
})());
