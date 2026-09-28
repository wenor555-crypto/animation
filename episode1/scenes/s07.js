/* Ep.1, Scene 7 – «Ξύπνησε» (script beat 7): the σίτα boots up in full TV-shop mode. */
defineScene((() => {
const X = { giannos: 905, giorgos: 720, christos: 520, sita: 1060, mimis: 760, vasilis: 1060, maria: 890 };
const CAMS = {
  wide: [760, 380, 1.05], sita: [1060, 540, 2.4], sitaC: [1060, 560, 3.2], work: [950, 470, 1.8], gio: [720, 360, 2.2], two: [900, 420, 1.45],
  chr: [540, 360, 2.1], mimis: [860, 400, 1.7], pitch: [720, 330, 2.6], door: [1030, 440, 1.8], win: [890, 240, 2.4], mosq: [1090, 560, 3],
};
const steps = [
  { act: 'silence', d: 2.4, cam: 'wide' },
  { who: 'giorgos', cam: 'gio', el: '…Αυτό ήταν;', en: '…Is that it?' },
  { act: 'jingle', d: 1.6, cam: 'sita' },
  { who: 'sita', cam: 'sitaC', mark: 'hello', el: 'ΓΕΙΑ ΣΑΣ! Είμαι η ΕΞΥΠΝΗ ΣΙΤΑ! Εύκολη τοποθέτηση! ΧΩΡΙΣ ΕΙΔΙΚΟ! ΤΗΛΕΦΩΝΗΣΤΕ ΤΩΡΑ!', en: "HELLO! I'm the SMART SCREEN! Easy installation! NO TECHNICIAN! CALL NOW!" },
  { act: 'fall', d: 2, cam: 'wide' },
  { who: 'giannos', cam: 'work', el: 'Δεν… δεν χρειάζεται να σε πάρει κανείς τηλέφωνο. Είσαι ήδη εδώ.', en: "No… nobody needs to call you. You're already here." },
  { who: 'sita', cam: 'sita', el: 'ΚΑΙ ΔΕΝ ΤΕΛΕΙΩΣΑΜΕ!', en: "AND THAT'S NOT ALL!" },
  { who: 'giannos', cam: 'work', el: 'Δεν είπα τίποτα.', en: "I didn't say anything." },
  { act: 'mosq', d: 2.2, cam: 'mosq' },
  { who: 'sita', cam: 'mosq', mark: 'denied', el: 'Κουνούπι. Αριθμός χίλια τετρακόσια σαράντα δύο. Είσοδος… ΑΠΟΡΡΙΠΤΕΤΑΙ! Αλλά μόνο για λίγες μέρες, η προσφορά ισχύει μέχρι εξαντλήσεως αποθεμάτων!', en: 'Mosquito. Number one thousand four hundred forty-two. Entry… DENIED! But only for a few days, offer valid while stocks last!' },
  { act: 'mimisOut', d: 2.2, cam: 'door' },
  { who: 'sita', cam: 'door', el: 'Καλώς ήρθατε, Μίμη! Μόνο με ΤΡΕΙΣ άτοκες δόσεις!', en: 'Welcome, Mimis! In only THREE interest-free instalments!' },
  { who: 'mimis', cam: 'mimis', el: "Εντάξει. Αυτό είναι πιο αστείο απ' όσο περίμενα.", en: "Okay. That's funnier than I expected." },
  { act: 'film', d: 1.6, cam: 'pitch' },
  { who: 'giorgos', cam: 'pitch', mark: 'ceo', el: 'Γεια σας. Είμαι ο Γιώργος, CEO της ΣίταAI…', en: "Hi. I'm Giorgos, CEO of SitaAI…" },
  { who: 'giannos', cam: 'two', el: 'CEO; Εγώ την έφτιαξα.', en: 'CEO? I built it.' },
  { who: 'giorgos', cam: 'two', el: 'Εσύ είσαι CTO. Είναι τιμή.', en: "You're CTO. It's an honour." },
  { who: 'giorgos', cam: 'pitch', el: '…και αναζητούμε pre-seed χρηματοδότηση.', en: "…and we're looking for pre-seed funding." },
  { act: 'vas', d: 1.8, cam: 'door' },
  { who: 'sita', cam: 'door', el: 'ΒΑΣΙΛΗΣ! Ο πιο ΕΞΥΠΝΟΣ πελάτης μας!', en: 'VASILIS! Our SMARTEST customer!' },
  { who: 'vasilis', cam: 'door', el: "Είδατε; Σας το 'λεγα ότι ήταν έξυπνη.", en: 'See? I told you it was smart.' },
  { who: 'vasilis', cam: 'door', mark: 'traka', el: 'Έχεις ένα τσιγάρο;', en: 'Got a cigarette?' },
  { act: 'win', d: .8, cam: 'win' },
  { who: 'maria', cam: 'win', el: 'Βλέπεις, Μίμη; Ακόμα κι η σίτα νοικοκυρεύτηκε.', en: 'See, Mimis? Even the screen has settled down.' },
  { act: 'end', d: 1.4, cam: 'mimis' },
];
let M;
function giannosChair(t, look) {
  const gx = 905, tk = talk('giannos', t);
  const gst = { t, talk: tk, look, brow: t > M.hello.a && t < M.fall.b ? 'up' : 'flat', mouth: inM(t, M.hello) ? 'open' : 'flat', L: [-46, -112], R: gesture(t, tk, [46, -112]) };
  for (const side of [-1, 1]) limb([[gx + side * 50, SEAT + 10], [gx + side * 62, GROUND]], 8, '#efeadb', { w: .3 });
  person(gx, SEAT, 1, CAST.giannos, { ...gst, part: 'legs', legs: 'seat' });
  person(gx, SEAT, 1, CAST.giannos, { ...gst, part: 'body' });
  poly([[gx - 62, SEAT - 110], [gx + 62, SEAT - 110], [gx + 56, SEAT - 10], [gx - 56, SEAT - 10]], '#efeadb', { lw: 4, w: .5 });
  for (let i = 0; i < 4; i++) curve([[gx - 36 + i * 24, SEAT - 96], [gx - 36 + i * 24, SEAT - 26]], 3, '#d7d0bb', { w: .3 });
  person(gx, SEAT, 1, CAST.giannos, { ...gst, part: 'arms' });
}
function drawMaria(t) {
  if (t < M.win.a - .2) return;
  const up = back(prog(t, M.win.a, M.win.a + .5));
  ctx.save(); ctx.beginPath(); ctx.rect(832, 172, 116, 126); ctx.clip();
  person(890, 470 - up * 60, .82, CAST.maria, { t, talk: talk('maria', t), look: [.2, .8], brow: 'up', part: 'body', mouth: 'smirk' });
  ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, { light: 'blue', doorLit: true, winTop: t > M.win.a - .2 ? 'lit' : null, shut: 0 });
  drawMaria(t);
  // Βασίλης behind the mesh, then in the doorway
  const vasIn = t > M.vas.a;
  if (vasIn) stand(1060, 'vasilis', .92, { t, talk: talk('vasilis', t), look: t > M.traka.a ? [-1, .3] : [-.5, .3], bandage: true, lid: true, mouth: 'smile', R: t > M.traka.a ? [80, -120] : [44, -24] });
  // Μίμης comes out of the house
  const [mx, mWalk] = path(t, [[M.mimisOut.a, 1060], [M.mimisOut.b + .2, 760]]);
  const mimisOut = t > M.mimisOut.a;
  if (mimisOut && t < M.mimisOut.a + .9) stand(mx, 'mimis', .95, { t, legs: 'walk', look: [-1, 0], lid: true, itemR: 'cup2', R: [50, -60] });
  const tk = talk('sita', t);
  const passK = Math.max(bump(t, M.mimisOut.a, M.mimisOut.a + 1.4), inM(t, M.vas, .2) || t > M.vas.b ? .8 : 0);
  const mosqK = prog(t, M.mosq.a, M.mosq.a + 1.4);
  const vault = inM(t, M.mosq, 1.2, 0) ? .3 * bump(t, M.mosq.a + 1.2, M.mosq.b) : 0;
  sita({ t, chip: 1, led: 'green', mood: inM(t, M.denied) ? 'evil' : 'happy', talk: tk, laser: t > M.denied.a + 2.3 && t < M.denied.a + 3, pass: passK, flapL: vault, sway: Math.sin(t * 1.1) * .15 + (inM(t, M.jingle) ? Math.sin(t * 30) * .6 : 0),
    flapR2: 0, flapR: tk ? Math.abs(Math.cos(t * 3)) * .6 : 0 });
  tableScene(t, {}, {});
  rect(770, GROUND - 90, 90, 90, '#b58a5a', { lw: 3.5, w: .5 }); laptop(815, GROUND - 90, .7, '#1d2a36');
  giannosChair(t, lookAtSpeaker(t, 'giannos', X, [.9, 0]));
  // Γιώργος: falls over at the jingle, gets up, films his pitch vertically
  const fallK = ease(prog(t, M.jingle.a + .1, M.jingle.a + .5)) * (1 - ease(prog(t, M.fall.b - .6, M.fall.b)));
  const filming = t > M.film.a + .6;
  const gst = { t, talk: talk('giorgos', t), look: filming && speaker(t) !== 'giannos' ? [0, .1] : lookAtSpeaker(t, 'giorgos', X, [1, -.3]), mouth: fallK > .1 ? 'open' : 'smirk',
    R: filming ? [70, -250] : [60, -180], itemR: 'phone', L: filming ? [-80, -120 + Math.sin(t * 4) * 20] : [-44, -24], brow: fallK > .1 ? 'up' : 'flat' };
  if (fallK > 0) { ctx.save(); ctx.translate(720, GROUND); ctx.rotate(-fallK * 1.45); person(0, -150, 1, CAST.giorgos, { ...gst, legs: 'stand' }); ctx.restore(); }
  else stand(720, 'giorgos', 1, gst);
  // Χρήστος sketching faster and faster
  const fast = t > M.hello.a ? 26 : 12;
  stand(520, 'christos', 1.05, { t, talk: talk('christos', t), look: [.3, .9], L: [-30, -110], R: [30 + Math.sin(t * fast) * 8, -100], itemL: 'sketch' });
  if (mimisOut && t >= M.mimisOut.a + .9) stand(mx, 'mimis', .95, { t, talk: talk('mimis', t), legs: mWalk ? 'walk' : 'stand', look: lookAtSpeaker(t, 'mimis', X, [1, 0]), lid: true, mouth: 'smirk', itemR: 'cup2', R: [50, -60] });
  // mosquito 1442 → the door slams like a vault
  const zapT = M.denied.a + 2.4, bounce = ease(prog(t, M.mosq.a + 1.5, M.mosq.a + 2.4)),   // bounces off the slammed door, hovers a little way off
    mqx = lerp(lerp(1300, 1110, mosqK), 1215, bounce) + (mosqK >= 1 ? Math.sin(t * 9) * 12 - 20 : 0), mqy = lerp(lerp(420, 560, mosqK), 470, bounce) + (mosqK >= 1 ? Math.cos(t * 7) * 10 : 0);
  if (t > M.mosq.a && t < zapT) mosquito(mqx, mqy, 2.6, t);
  if (t > zapT - .1 && t < zapT + .6) { const [ex, ey] = sitaEye(); laserBeam(ex, ey, mqx, mqy, 1 - prog(t, zapT + .2, zapT + .6), 3); }
  zapPuff(mqx, mqy, prog(t, zapT, zapT + 1));
  ctx.restore();
  applyLight('blue');
  ctx.save(); applyCam(c); sitaGlow({ t, led: 'green' }, .6);
  if (filming) glow(720 + 70, standY() - 250 - 20, 140, 'rgba(255,255,230,1)', .35);
  glow(815, GROUND - 130, 90, 'rgba(120,170,255,1)', .3);
  ctx.restore();
  if (inM(t, M.jingle, 0, .3)) sfxText('ΤΙΝΤΙΝΤΙΝ!', 640, 140, 70, -.1, '#ffd23f');
  if (inM(t, M.denied, 2.5, 0)) { ctx.save(); ctx.translate(900, 250); ctx.rotate(-.2); ctx.globalAlpha = .9; ctx.strokeStyle = '#e8392b'; ctx.lineWidth = 8; ctx.strokeRect(-230, -50, 460, 100); txt('ΑΠΟΡΡΙΠΤΕΤΑΙ', 0, 0, 56, '#e8392b', { font: TVFONT, weight: 900 }); ctx.restore(); }
  if (filming && t < M.L[14].b) {      // vertical phone frame overlay while he pitches
    const [, sh] = shotAt(sc, t);
    if (sh === 'pitch') { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 0, 420, H); ctx.fillRect(860, 0, 420, H); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.strokeRect(420, 20, 440, 680); blob(446, 46, 8, 8, '#e8392b', { lw: 0 }); txt('REC', 486, 47, 18, '#fff', { font: TVFONT }); ctx.restore(); }
  }
}
return {
  id: 'scene07', title: '7 · Ξύπνησε', steps, render,
  events: M => [[M.jingle.a, SFX.jingle], [M.jingle.a + .4, () => SFX.clacks(3)], [M.jingle.a + .3, SFX.thud], [M.mosq.a + 1.4, () => { SFX.slam(); SFX.clack(); }], [M.denied.a + 2.4, SFX.laser],
    [M.denied.a + 2.5, SFX.thud], [M.mimisOut.a + .1, SFX.clack], [M.film.a + .6, SFX.pop], [M.vas.a + .3, SFX.jingle], [M.win.a, SFX.creak]],
  ambience: () => ({ cricket: .02, cicada: .004, mosq: .004 }),
};
})());
