/* Ep.2, Scene 12 – «Συμβούλιο πολέμου»: inside the chicken coop. The hens from Ep. 1, veterans now (goggles).
   Μίμης wants war, Γιώργος is scared, Γιάννος tries to be logical. Κώστας eats a κουλούρι in the corner.
   Γιώργος calls the minister; Γιάννος would rather be conquered by σίτες than vote Νέα Δημοκρατία. */
defineScene((() => {
const X = { mimis: 330, giorgos: 560, giannos: 800, kostas: 1060 };
const CAMS = { wide: [660, 400, 1.05], mim: [330, 380, 2.1], gio: [560, 380, 2.1], gia: [800, 380, 2.1], kos: [1060, 420, 2.1], gioC: [560, 370, 2.8], two: [680, 400, 1.55], hens: [640, 250, 1.8] };
const steps = [
  { act: 'open', d: 2.6, cam: 'wide' },
  { act: 'hens', d: 1.6, cam: 'hens' },
  { who: 'mimis', cam: 'mim', el: 'Εντάξει. Πόλεμος.', en: 'Right. War.' },
  { who: 'mimis', cam: 'mim', el: 'Θα τις γαμήσω όλες. Μία-μία. Τη φριτέζα πρώτη.', en: "I'll fuck them all up. One by one. The air fryer first." },
  { who: 'giorgos', cam: 'gio', el: 'Ή… φεύγουμε. Έχω ένα θείο στην Αυστραλία.', en: 'Or… we leave. I have an uncle in Australia.' },
  { who: 'giannos', cam: 'gia', el: 'Κανείς δεν φεύγει.', en: 'Nobody leaves.' },
  { who: 'giorgos', cam: 'gio', mark: 'call', el: 'Τότε παίρνω τηλέφωνο. Έχω γνωστούς στον χώρο.', en: "Then I'm making a call. I know people in the field." },
  { act: 'dial', d: 1.8, cam: 'gioC' },
  { who: 'giorgos', cam: 'gioC', mark: 'min', el: 'Κύριε υπουργέ; Γιώργος. Χρειαζόμαστε ενισχύσεις στο Λέχαιο. Ρομπότ. Πολλά.', en: 'Minister? Giorgos. We need reinforcements in Lechaio. Robots. Lots.' },
  { who: 'giorgos', cam: 'gioC', el: 'Σε αντάλλαγμα… σας ψηφίζει όλο το χωριό.', en: 'In exchange… the whole village votes for you.' },
  { who: 'giorgos', cam: 'two', el: 'Όλο. Ο παπάς, το καφενείο, οι κότες.', en: 'All of it. The priest, the café, the chickens.' },
  { who: 'giorgos', cam: 'two', mark: 'yes', el: 'Λέει ναι!', en: 'He says yes!' },
  { who: 'giannos', cam: 'gia', mark: 'nd', el: 'Προτιμώ να με κατακτήσουν οι σίτες παρά να ψηφίσω Νέα Δημοκρατία.', en: "I'd rather be conquered by the σίτες than vote New Democracy." },
  { act: 'beat', d: 1, cam: 'gio' },
  { who: 'giorgos', cam: 'gioC', mark: 'back', el: '…Κύριε υπουργέ; Θα σας πάρω πίσω.', en: "…Minister? I'll call you back." },
  { who: 'mimis', cam: 'mim', el: 'Άρα πόλεμος.', en: 'So: war.' },
  { who: 'giannos', cam: 'gia', el: 'Άρα πόλεμος. Αλλά με σχέδιο.', en: 'So: war. But with a plan.' },
  { who: 'giannos', cam: 'two', mark: 'bag', el: 'Έχω μερικά πράγματα στην τσάντα.', en: 'I have a few things in my bag.' },
  { who: 'mimis', cam: 'mim', mark: 'fig', el: 'Κι εγώ έχω μια συκιά.', en: 'And I have a fig tree.' },
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
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  coopInside(t);
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const onPhone = t > M.dial.a && t < M.back.b;
  const gtk = talk('giorgos', t);
  stand(X.mimis, 'mimis', 1, { t, talk: talk('mimis', t), look: la('mimis', [1, 0]), lid: true, brow: 'frown', mouth: 'flat', R: talk('mimis', t) ? [80, -120 + Math.sin(t * 8) * 10] : [44, -24], L: [-44, -24] });
  stand(X.giorgos, 'giorgos', 1, { t, talk: gtk, look: onPhone ? [.3, -.2] : la('giorgos', [1, 0]), brow: inM(t, M.nd) || inM(t, M.beat) ? 'worry' : 'up', mouth: inM(t, M.yes) ? 'smile' : 'smirk',
    R: onPhone ? (inM(t, M.yes) ? [80, -140] : [48, -196]) : gesture(t, gtk), itemR: onPhone ? 'phone' : null, L: inM(t, M.yes) ? [-100, -230] : [-44, -24] });
  stand(X.giannos, 'giannos', 1, { t, talk: talk('giannos', t), look: la('giannos', [-1, 0]), brow: inM(t, M.nd) ? 'frown' : 'flat', mouth: 'flat', R: inM(t, M.bag, .3, 99) ? [70, -60] : gesture(t, talk('giannos', t)), itemR: inM(t, M.bag, .3, 99) ? 'bag' : null });
  person(X.kostas, SEAT + 20, 1, CAST.kostas, { t, legs: 'seat', look: la('kostas', [-1, .2]), lid: true, mouth: Math.sin(t * 4) > 0 ? 'open' : 'flat', L: [-40, -140 + Math.max(0, Math.sin(t * 1.2)) * 50], itemL: 'koulouri', R: [44, -30] });
  ctx.restore();
  applyLight('dusk', .6);
  if (inM(t, M.nd, .3, 0)) sfxText('ΝΕΑ ΔΗΜΟΚΡΑΤΙΑ', X.giannos, 110, 30, -.08, '#fff');
  vignette(.35);
}
return {
  id: 'scene12', title: '12 · Συμβούλιο πολέμου', steps, render,
  events: M => [[M.hens.a, SFX.cluck], [M.dial.a + .2, () => { for (let i = 0; i < 10; i++) tone(700 + (i % 3) * 200, .06, 'sine', .04, 1, i * .14); }], [M.dial.a + 1.4, () => tone(425, .5, 'sine', .04)],
    [M.yes.a, SFX.cluck], [M.nd.b, () => { SFX.cluck(); tone(200, .6, 'sine', .05, .6); }], [M.fig.b, SFX.drums]],
  ambience: () => ({ cricket: .02 }),
};
})());
