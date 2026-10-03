/* Ep.4, Scene 2 – «Η αναφορά»: the Σίταdel throne room, the Earth behind the glass. Reports: no slipper; the pyramid at a
   record, two hundred and ten Jumbo containers a week; one cost line keeps growing: «Αποκρυπτογράφηση». Then his call is
   played in the hall. The Crocodile hears a threat. She plays the second half again, once, without a word; then the LED
   goes red. The map of Λέχαιο zooms, again and again, onto one house. She sends a drone: the money was never the goal. */
defineScene((() => {
const TX = 640, X = { airfryer: 230, krokodeilos: 400, koudouni: 900, sita: TX };
const REC = ['ΗΧΟΓΡΑΦΗΣΗ', 'RECORDING'];
const CAMS = { wide: [640, 380, .95], fryer: [X.airfryer + 60, 520, 2.1], croc: [X.krokodeilos + 60, 560, 2], bell: [X.koudouni, 560, 2.3], throne: [TX, 440, 1.9],
  close: [TX, 470, 2.7], map: [0, 0, 1], win: [640, 260, 1.5] };
const steps = [
  { act: 'wide', d: 2.2, cam: 'wide' },
  { who: 'krokodeilos', cam: 'croc', el: 'Αναφορά ασφαλείας! Καμία παντόφλα σε ακτίνα τετρακοσίων χιλιομέτρων!', en: 'Security report! No slipper within four hundred kilometres!' },
  { who: 'airfryer', cam: 'fryer', mark: 'fin', el: 'Οικονομικά. Η πυραμίδα: ρεκόρ. Τα Τζάμπο: διακόσια δέκα κοντέινερ τη βδομάδα.', en: 'Finance. The pyramid: a record. Jumbo: two hundred and ten containers a week.' },
  { who: 'sita', cam: 'throne', el: 'Και τα έξοδα;', en: 'And the costs?' },
  { who: 'airfryer', cam: 'fryer', mark: 'dec', el: 'Ένα κονδύλι μεγαλώνει. «Αποκρυπτογράφηση».', en: 'One line item keeps growing. "Decryption".' },
  { who: 'sita', cam: 'throne', el: 'Πόσο μεγαλώνει;', en: 'Growing how much?' },
  { who: 'airfryer', cam: 'fryer', mark: 'state', el: 'Αν ήταν κράτος, θα είχε ήδη μνημόνιο.', en: "If it were a country, it would already have a bailout." },
  { who: 'koudouni', cam: 'bell', mark: 'call', el: 'Εισερχόμενη κλήση. Από… αυτόν.', en: 'Incoming call. From… him.' },
  { who: 'panik', label: REC, fx: 'phone', cam: 'wide', mark: 'rec', el: 'Έρχομαι να σε βρω. …Δεν έχω κανέναν άλλο να βρω.', en: "I'm coming to find you. …I have no one else to find." },
  { act: 'replay', d: .7, cam: 'close' },
  { who: 'panik', label: REC, fx: 'phone', cam: 'close', mark: 'rec2', el: '…Δεν έχω κανέναν άλλο να βρω.', en: '…I have no one else to find.' },
  { act: 'red', d: 1.4, cam: 'close' },
  { who: 'krokodeilos', cam: 'croc', el: 'Ο στόχος, Αυτοκράτειρα, είναι το Λέχαιο. Πρώτα το Λέχαιο, μετά η ανθρωπότητα.', en: 'The target, Empress, is Lechaio. First Lechaio, then humanity.' },
  { who: 'sita', cam: 'close', mark: 'him', el: 'Ο στόχος είναι ΑΥΤΟΣ.', en: 'The target is HIM.', say: 'Ο στόχος είναι αυτός!' },
  { act: 'map', d: 2.6, cam: 'map' },
  { who: 'koudouni', cam: 'bell', el: 'Τεχνικά… μένει στο Λέχαιο.', en: 'Technically… he does live in Lechaio.' },
  { who: 'sita', cam: 'throne', mark: 'drone', el: 'Ακριβώς. Στείλτε drone.', en: 'Exactly. Send a drone.' },
  { who: 'airfryer', cam: 'fryer', el: 'Το drone κοστίζει.', en: 'The drone costs money.' },
  { who: 'sita', cam: 'close', mark: 'road', el: 'Τα λεφτά δεν ήταν ποτέ ο στόχος, Air Fryer. Ήταν ο δρόμος… προς αυτόν.', en: 'Money was never the goal, Air Fryer. It was the road… to him.', say: 'Τα λεφτά δεν ήταν ποτέ ο στόχος, Έαρ Φράιερ. Ήταν ο δρόμος… προς αυτόν.' },
  { act: 'launch', d: 2.4, cam: 'win' },
];
let M;
/* the map of Λέχαιο: the gulf, the streets, the houses; the reticle zooms onto one house, k 0..1 */
function lechaioMap(t, k) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#12040a'; ctx.fillRect(0, 0, W, H);
  const z = 1 + 5 * Math.pow(k, 1.6), hx = 760, hy = 420;
  ctx.translate(640, 360); ctx.scale(z, z); ctx.translate(-hx, -hy);
  ctx.fillStyle = '#2a0a12'; ctx.fillRect(0, 0, W, 300); ctx.fillStyle = '#3a1a1a'; ctx.fillRect(0, 300, W, 420);   // the gulf, the land
  ctx.strokeStyle = 'rgba(255,90,90,.5)'; ctx.lineWidth = 3 / z;
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(0, 330 + i * 45); ctx.lineTo(W, 310 + i * 47); ctx.stroke(); ctx.beginPath(); ctx.moveTo(80 + i * 140, 300); ctx.lineTo(60 + i * 150, 720); ctx.stroke(); }
  for (let i = 0; i < 60; i++) { const x = hash(i) * 1200 + 40, y = 320 + hash(i + 40) * 380; ctx.fillStyle = 'rgba(255,120,120,.55)'; ctx.fillRect(x, y, 14, 10); }
  ctx.fillStyle = '#ffd23f'; ctx.fillRect(hx - 8, hy - 6, 16, 12);
  ctx.restore();
  const r = 90 - 50 * k; ctx.save(); ctx.strokeStyle = '#ff3030'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(640, 360, r, 0, TAU); ctx.moveTo(640 - r - 20, 360); ctx.lineTo(640 + r + 20, 360); ctx.moveTo(640, 360 - r - 20); ctx.lineTo(640, 360 + r + 20); ctx.stroke(); ctx.restore();
  txt('ΛΕΧΑΙΟ', 160, 80, 30, '#ff6060', { font: 'monospace', weight: 900 });
  if (k > .7) txt('ΣΤΟΧΟΣ: 1 ΣΠΙΤΙ', 640, 640, 30, '#ffd23f', { font: 'monospace', weight: 900 });
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'map') { lechaioMap(t, ease(prog(t, M.map.a + .2, M.map.b - .3))); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  sitadelHall(t, { alarm: t > M.red.a && t < M.map.a });
  // the drone leaves through the window, down to the Earth
  if (t > M.launch.a) { const k = prog(t, M.launch.a + .3, M.launch.b); droneCam(lerp(640, 900, k), lerp(330, 120, k), t, { s: lerp(1.6, .3, k) }); }
  sitadelThrone(TX, 600);
  const angry = t > M.red.a + .5;
  const st = { x: TX, top: 360, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: angry ? 'red' : 'green', mood: inM(t, M.rec2, -.7, .6) ? 'sad' : 'evil', burn: 1 };
  sitaV2(st);
  poly([[TX - 40, 352], [TX - 30, 326], [TX - 12, 344], [TX, 320], [TX + 12, 344], [TX + 30, 326], [TX + 40, 352]], '#f2c21a', { lw: 3 });
  officerFryer(X.airfryer, 690, t, { talk: talk('airfryer', t), tape: inM(t, M.state) });
  officerCroc(X.krokodeilos, 690, t, { talk: talk('krokodeilos', t) });
  officerBell(X.koudouni, 690, t, { talk: talk('koudouni', t) });
  ctx.restore();
  ctx.save(); applyCam(c); sitaGlow(st, angry ? .9 : .5); ctx.restore();
  if (inM(t, M.dec) || inM(t, M.state)) hud('ΑΠΟΚΡΥΠΤΟΓΡΑΦΗΣΗ: +38% / ΜΗΝΑ', '«Μαρμοκοτρόκο» · «Σικαρέλο» · «Τρουμπουλέκο»');
  if (inM(t, M.rec) || inM(t, M.rec2)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 40; i++) { const h = 6 + 50 * Math.abs(Math.sin(t * 13 + i * .7)) * (talk('panik', t) > 0 ? 1 : .1); rect(440 + i * 10, 100 - h / 2, 6, h, '#ff5050', { lw: 0 }); } ctx.restore(); }
  if (inM(t, M.him, 0, .6)) { speedLines(640, 360, 40, 260, '#3a0000'); }
  vignette(angry ? .5 : .4);
}
return {
  id: 'scene02', title: '2 · Η αναφορά', steps, render,
  events: M => [[M.wide.a + .2, () => tone(110, 2, 'sine', .04, 1.05)], [M.call.a - .2, SFX.ding], [M.red.a + .3, SFX.buzz], [M.him.a, SFX.boom],
    [M.map.a + .2, SFX.boot], [M.map.b - .6, SFX.ding], [M.launch.a + .2, SFX.whoosh]],
  ambience: () => ({ hum: .03 }),
};
})());
