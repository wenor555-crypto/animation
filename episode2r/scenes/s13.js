/* Ep.2 remake, Scene 13 – «Συμβούλιο πολέμου»: inside the chicken coop. The hens from Ep. 1, veterans now (goggles).
   Μίμης wants war, Γιώργος wants to negotiate (everything has a price), Γιάννος tries to be logical. Κώστας eats a κουλούρι in the corner.
   Γιώργος video-calls the minister (we see him: robots for the whole village's votes, «Οι κότες ψηφίζουν;»); Γιάννος would rather be conquered by σίτες than vote Νέα Δημοκρατία. */
defineScene((() => {
const X = { mimis: 330, giorgos: 560, giannos: 800, kostas: 1060 };
const CAMS = { wide: [660, 400, 1.05], mim: [330, 380, 2.1], gio: [560, 380, 2.1], gia: [800, 380, 2.1], kos: [1060, 420, 2.1], gioC: [560, 370, 2.8], two: [680, 400, 1.55], hens: [640, 250, 1.8], vid: [0, 0, 1] };
const steps = [
  { act: 'open', d: 2.6, cam: 'wide' },
  { act: 'hens', d: 1.6, cam: 'hens' },
  { who: 'mimis', cam: 'mim', el: 'Εντάξει. Πόλεμος. Θα τις γαμήσω όλες. Μία-μία.', en: "Right. War. I'll fuck them all up. One by one." },
  { who: 'giorgos', cam: 'gio', el: 'Ή… διαπραγματευόμαστε. Όλα έχουν μια τιμή.', en: 'Or… we negotiate. Everything has a price.' },
  { who: 'giannos', cam: 'gia', el: 'Δεν διαπραγματεύεσαι με air fryers.', en: "You don't negotiate with air fryers." },
  { who: 'giorgos', cam: 'gio', mark: 'call', el: 'Εγώ διαπραγματεύομαι με όλους. Έχω γνωστούς στον χώρο.', en: 'I negotiate with everyone. I know people in the field.' },
  { act: 'dial', d: 1.8, cam: 'gioC' },
  { who: 'giorgos', cam: 'gioC', mark: 'min', el: 'Κύριε υπουργέ; Γιώργος. Χρειαζόμαστε ενισχύσεις στο Λέχαιο. Ρομπότ. Πολλά.', en: 'Minister? Giorgos. We need reinforcements in Lechaio. Robots. Lots.' },
  { who: 'ypourgos', cam: 'vid', mark: 'party', el: 'Γιώργο μου. Και τι θα πάρει το κόμμα;', en: 'My dear Giorgos. And what does the party get?' },
  { who: 'giorgos', cam: 'two', el: 'Όλο το χωριό. Ο παπάς, το καφενείο, οι κότες.', en: 'The whole village. The priest, the café, the chickens.' },
  { who: 'ypourgos', cam: 'vid', mark: 'hens2', el: 'Οι κότες ψηφίζουν;', en: 'Do the chickens vote?' },
  { who: 'giorgos', cam: 'gioC', mark: 'yes', el: 'Αν τους το ζητήσουμε ευγενικά.', en: 'If we ask them nicely.' },
  { who: 'giannos', cam: 'gia', mark: 'nd', el: 'Προτιμώ να με κατακτήσουν οι σίτες παρά να ψηφίσω Νέα Δημοκρατία.', en: "I'd rather be conquered by the σίτες than vote New Democracy." },
  { act: 'beat', d: 1, cam: 'gio' },
  { who: 'giorgos', cam: 'gioC', mark: 'back', el: '…Κύριε υπουργέ; Θα σας πάρω πίσω.', en: "…Minister? I'll call you back." },
  { who: 'mimis', cam: 'mim', el: 'Άρα πόλεμος.', en: 'So: war.' },
  { who: 'giannos', cam: 'gia', el: 'Άρα πόλεμος. Αλλά με σχέδιο.', en: 'So: war. But with a plan.' },
  { who: 'mimis', cam: 'two', mark: 'fig', el: 'Εσύ έχεις την τσάντα σου. Εγώ έχω μια συκιά.', en: 'You have your bag. I have a fig tree.' },
  { act: 'end', d: 1.6, cam: 'wide' },
];
let M;
function coopInside(t) {
  ctx.fillStyle = '#b58a5a'; ctx.fillRect(-600, -400, 2600, 1100);
  for (let i = -6; i < 30; i++) curve([[i * 70, -400], [i * 70, 700]], 3, '#9a7048', { w: .5 });
  // wire-mesh window with dusk light
  rect(420, 120, 440, 160, '#ffb070', { lw: 5 }); ctx.save(); ctx.strokeStyle = 'rgba(40,40,40,.5)'; ctx.lineWidth = 1.2; for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.moveTo(420 + i * 16, 120); ctx.lineTo(420 + i * 16 + 60, 280); ctx.moveTo(480 + i * 16, 120); ctx.lineTo(420 + i * 16, 280); ctx.stroke(); } ctx.restore();
  // perches with the veteran hens
  for (const y of [300, 380]) limb([[-100, y], [1500, y]], 8, '#8a6040');
  for (let i = 0; i < 9; i++) chicken(80 + i * 150, i % 2 ? 300 : 380, t, i, ['#f3efe6', '#b97a4a', '#e8dcc4'][i % 3], { goggles: i % 3 === 0, still: inM(t, M.hens) });
  // straw floor, crates
  poly([[-600, 690], [2000, 690], [2000, 800], [-600, 800]], '#d8b870', { lw: 0 });
  for (let i = 0; i < 40; i++) curve([[hash(i) * 1600 - 200, 700 + hash(i + 1) * 60], [hash(i) * 1600 - 180, 694 + hash(i + 1) * 60]], 2, '#b8984a', { w: .2 });
  rect(1000, 600, 130, 90, '#a07a4a', { lw: 3.5 });
  // the war map: a feed sack with a chalk plan
  rect(120, 420, 150, 110, '#e8dcc0', { lw: 3 }); curve([[140, 470], [180, 440], [220, 480], [250, 450]], 2.5, '#c0202a'); txt('✕', 230, 505, 20, '#c0202a', { weight: 900 });
}
/* the video call, seen on Γιώργος's phone: the minister in his office, flag and portrait behind him */
function videoCall(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#2a2230'; ctx.fillRect(0, 0, W, H);
  rect(380, 20, 520, 680, '#111', { lw: 6 });
  ctx.save(); ctx.beginPath(); ctx.rect(396, 60, 488, 600); ctx.clip();
  ctx.fillStyle = '#d8d0c0'; ctx.fillRect(396, 60, 488, 600);
  rect(420, 90, 120, 160, '#c8b08a', { lw: 3 }); rect(430, 100, 100, 140, '#8a7a6a', { lw: 0 });            // a portrait
  rect(760, 90, 90, 60, '#fff', { lw: 2 }); for (let i = 0; i < 5; i++) rect(760, 90 + i * 12, 90, 6, '#3f74a6', { lw: 0 }); rect(760, 90, 36, 32, '#3f74a6', { lw: 0 });   // flag
  rect(396, 540, 488, 120, '#5a3a22', { lw: 3 });                                                             // desk
  person(640, 720, 1.5, CAST.ypourgos, { t, talk: talk('ypourgos', t), legs: 'stand', mouth: 'smile', brow: inM(t, M.hens2) ? 'up' : 'flat', look: [0, .1], noShadow: true });
  tie(640, 720, 1.5);
  ctx.restore();
  txt('ΥΠΟΥΡΓΟΣ · VIDEO', 640, 44, 18, '#9a9aa8', { font: 'monospace', weight: 900 });
  blob(640, 690, 22, 22, '#e8392b', { lw: 0 });
  ctx.restore();
  vignette(.35);
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'vid') return videoCall(t);
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  coopInside(t);
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const onPhone = t > M.dial.a && t < M.back.b;
  const gtk = talk('giorgos', t);
  stand(X.mimis, 'mimis', 1, { t, talk: talk('mimis', t), look: la('mimis', [1, 0]), lid: true, brow: 'frown', mouth: 'flat', R: talk('mimis', t) ? [80, -120 + Math.sin(t * 8) * 10] : [44, -24], L: [-44, -24] });
  stand(X.giorgos, 'giorgos', 1, { t, talk: gtk, look: onPhone ? [.3, -.2] : la('giorgos', [1, 0]), brow: inM(t, M.nd) || inM(t, M.beat) ? 'worry' : 'up', mouth: inM(t, M.yes) || inM(t, M.party) ? 'smile' : 'smirk',
    R: onPhone ? [90, -170] : gesture(t, gtk), itemR: onPhone ? 'phone' : null, L: [-44, -24] });   // video call: the phone held out in front
  stand(X.giannos, 'giannos', 1, { t, talk: talk('giannos', t), look: la('giannos', [-1, 0]), brow: inM(t, M.nd) ? 'frown' : 'flat', mouth: 'flat', R: gesture(t, talk('giannos', t)) });
  person(X.kostas, SEAT + 20, 1, CAST.kostas, { t, legs: 'seat', look: la('kostas', [-1, .2]), lid: true, mouth: Math.sin(t * 4) > 0 ? 'open' : 'flat', L: [-40, -140 + Math.max(0, Math.sin(t * 1.2)) * 50], itemL: 'koulouri', R: [44, -30] });
  ctx.restore();
  applyLight('dusk', .6);
  if (inM(t, M.nd, .3, 0)) sfxText('ΝΕΑ ΔΗΜΟΚΡΑΤΙΑ', X.giannos, 110, 30, -.08, '#fff');
  vignette(.35);
}
return {
  id: 'scene13', title: '13 · Συμβούλιο πολέμου', steps, render,
  events: M => [[M.hens.a, SFX.cluck], [M.dial.a + .2, () => { for (let i = 0; i < 10; i++) tone(700 + (i % 3) * 200, .06, 'sine', .04, 1, i * .14); }], [M.dial.a + 1.4, () => tone(425, .5, 'sine', .04)],
    [M.yes.a, SFX.cluck], [M.nd.b, () => { SFX.cluck(); tone(200, .6, 'sine', .05, .6); }], [M.fig.b, SFX.drums]],
  ambience: () => ({ cricket: .02 }),
};
})());
