/* Ep.1, Scenes 16–17 – «Το κοτέτσι» + «Γιατί είναι όλα ρομπότ;» (beats 17–18): Μήμης's kamikaze plan; Κώστας wakes up. */
defineScene((() => {
const X = { mimis: 420, giannos: 560, christos: 700, giorgos: 1185, sita: 1060, kostas: 220 };
const CAMS = { wide: [640, 400, 1.05], guys: [560, 390, 1.7], mimis: [420, 350, 2.3], giannos: [560, 350, 2.3], coop: [110, 540, 1.6], chase: [400, 480, 1.1],
  sita: [1060, 540, 2.3], fig: [280, 560, 2.1], kos: [220, 400, 2.3], all: [520, 420, 1.3] };
const steps = [
  { who: 'mimis', cam: 'mimis', mark: 'plan', el: 'Έχω σχέδιο. Τα μηχανήματα κυνηγάνε έντομα. Οι κότες τρώνε έντομα. Τα κλειδώνουμε στο κοτέτσι.', en: 'I have a plan. The machines hunt insects. Chickens eat insects. We lock them in the coop.' },
  { who: 'giannos', cam: 'giannos', el: 'Αυτό δεν βγάζει κανένα νόημα.', en: 'That makes no sense at all.' },
  { who: 'mimis', cam: 'mimis', el: "Γι' αυτό δεν θα το περιμένουν.", en: "That's why they won't expect it." },
  { act: 'jump', d: 1, cam: 'wide' },
  { who: 'mimis', cam: 'chase', mark: 'come', el: 'ΕΛΑΤΕ, ΡΕ ΗΛΕΚΤΡΙΚΑ!', en: 'COME ON, YOU APPLIANCES!', gap: 0 },
  { act: 'chase', d: 3.4, cam: 'chase' },
  { act: 'lock', d: 1.4, cam: 'coop' },
  { act: 'silence', d: 1.6, cam: 'coop' },
  { act: 'chaos', d: 2.2, cam: 'coop' },
  { act: 'out', d: 3, cam: 'wide' },
  { who: 'sita', cam: 'sita', el: 'Νέα μέλη! Και με δώρο… ΑΥΓΑ!', en: 'New members! And as a free gift… EGGS!' },
  { who: 'mimis', cam: 'coop', mark: 'feathers', el: 'Εντάξει. Τώρα έχουν και αεροπορία και πρωινό.', en: "Okay. Now they've got an air force and breakfast." },
  // ---- 18: Κώστας wakes up ----
  { act: 'wake', d: 3.2, cam: 'fig' },
  { who: 'kostas', cam: 'kos', el: 'Τι ώρα είναι;', en: 'What time is it?' },
  { act: 'looks', d: 2, cam: 'wide' },
  { who: 'kostas', cam: 'kos', el: 'Γιατί είναι όλα ρομπότ;', en: 'Why is everything robots?' },
  { act: 'stare', d: 1.8, cam: 'all' },
  { who: 'giannos', cam: 'giannos', el: 'Δεν θυμάσαι τίποτα;', en: "You don't remember anything?" },
  { who: 'kostas', cam: 'kos', el: 'Θυμάμαι ένα σουβλάκι. Χωρίς πίτα.', en: 'I remember a souvlaki. Without a pita.' },
  { act: 'red', d: 1.2, cam: 'sita' },
  { who: 'sita', cam: 'sita', mark: 'you', el: 'ΕΣΥ.', en: 'YOU.' },
  { who: 'kostas', cam: 'kos', el: 'Γεια σου. Ωραία σίτα.', en: 'Hi. Nice screen.' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, { light: 'day', winLit: 'red', winTop: 'red', noChickens: true, coopDoor: inM(t, M.chaos, 1, 99) ? 1 : t > M.lock.a + .6 ? 0 : 1, coopShake: inM(t, M.chaos) ? t : 0 });
  const youK = t > M.you.a ? 1 : 0;
  sita({ t, chip: 1, led: 'red', mood: 'evil', burn: 1, talk: talk('sita', t), open: youK * .2, sway: Math.sin(t * 1.2) * .2 });
  // the army: chasing Μήμης into the coop, then bursting out with hen pilots
  const chaseK = prog(t, M.come.a, M.chase.b), inCoop = t > M.chase.b && t < M.out.a, outK = prog(t, M.out.a, M.out.b);
  if (!inCoop) {
    const ax = t < M.come.a ? 1100 : t < M.out.a ? lerp(1100, 60, chaseK) : lerp(60, 700, outK);
    hose(snakePts(ax + 40, 692, ax + 200, 640, t, 14), t, { eye: 1 });
    belt(ax + 120, 674, t, { crawl: 1, vib: 1, red: 1, dir: t < M.out.a ? -1 : 1, cord: false });
    mopBucket(ax + 260, 690, t, { spin: 1, wheels: 1, eye: 1, mop: false });
    for (let i = 0; i < 3; i++) racket(ax + i * 80 + Math.sin(t * 3 + i) * 10, 360 + Math.cos(t * 4 + i) * 14 - i * 20 - (t > M.out.a ? 60 : 0), Math.sin(t + i) * .3, t, { on: 1, s: .8, pilot: t > M.out.a });
    if (t > M.out.a) { chicken(ax + 260, 604, t, 7, '#b97a4a', { still: 1, noLegs: 1, goggles: 1 }); }
  }
  // Γιώργος on the σίτα's side, CEO shades on
  stand(X.giorgos, 'giorgos', 1, { t, talk: talk('giorgos', t), look: [-1, 0], shades: true, mouth: 'smirk', L: [-58, -40], R: [58, -40] });
  // Μήμης: leaps the barricade, runs into the coop, out the other side, slams the door
  const [mx, mw] = path(t, [[M.jump.a, 420], [M.come.b, 300], [M.chase.a + 1.6, 100], [M.chase.b - .6, 40], [M.chase.b, 40], [M.lock.b, 40]]);
  const mOut = t > M.jump.a;
  const feathered = t > M.chaos.a + 1;
  for (const who of ['giannos', 'christos']) {
    const stare = inM(t, M.stare, 0, .6) || (t > M.wake.a && t < M.red.a);
    stand(X[who], who, who === 'christos' ? 1.05 : 1, { t, talk: talk(who, t), look: stare || t > M.wake.a ? [-1, 0] : lookAtSpeaker(t, who, X, [1, 0]), brow: stare ? 'up' : 'flat',
      mouth: 'flat', itemL: who === 'christos' ? 'sketch' : null, L: who === 'christos' ? [-30, -110] : [-44, -24], R: who === 'christos' ? [30 + Math.sin(t * 20) * 6, -100] : [44, -24] });
  }
  if (!mOut || t > M.lock.b) {
    const mxx = !mOut ? 420 : t > M.feathers.b ? 420 : 40;
    stand(mxx, 'mimis', 1, { t, talk: talk('mimis', t), look: t > M.wake.a ? [-1, 0] : lookAtSpeaker(t, 'mimis', X, [1, 0]), lid: true, mouth: 'smirk', itemR: 'cup2', R: [50, -60] });
    if (feathered && t < M.wake.a + 3) for (let i = 0; i < 9; i++) blob(mxx - 50 + hash(i) * 100, standY() - 260 + hash(i + 2) * 240, 7, 3, '#f7f4ee', { lw: 1.5, rot: hash(i) * 3 });
  }
  table(t, { flipped: true });
  if (mOut && t <= M.lock.b && !(t > M.chase.a + 1.6 && t < M.chase.b - .3)) stand(mx, 'mimis', 1, { t, talk: talk('mimis', t), legs: mw ? 'walk' : 'stand', look: [-1, 0], mouth: 'open', brow: 'up', itemR: 'cup2', R: [80, -220] });
  // the coop: silence, then chaos, feathers
  if (inM(t, M.chaos)) feathers(95, 600, t, 22, ph(t, M.chaos));
  if (t > M.out.a && t < M.out.a + 1.5) feathers(95, 600, t, 14, 1 + outK);
  // Κώστας under the fig: a hen on his back, then he sits up with a fig leaf stuck to his cheek
  const sitUp = ease(prog(t, M.wake.a + .6, M.wake.a + 2.4));
  if (sitUp < 1) { ctx.save(); ctx.translate(330, GROUND); ctx.rotate(-1.5 * (1 - sitUp)); person(0, -150, 1, CAST.kostas, { t, legs: 'stand', hood: false, blink: t < M.wake.a + 1.2, mouth: 'open' }); ctx.restore(); }
  else stand(220, 'kostas', 1, { t, talk: talk('kostas', t), look: inM(t, M.looks) ? [Math.sin(t * 3), -.3] : [1, 0], brow: t > M.you.a ? 'up' : 'flat', mouth: 'smile', lid: true, L: [-44, -24], R: t > M.L[11].a ? [70, -130] : [44, -24] });
  if (sitUp >= 1) blob(220 + 30, standY() - 190, 12, 9, '#5f8a3a', { lw: 2 });
  ctx.restore();
  ctx.save(); applyCam(c); sitaGlow({ t, led: 'red', glowR: youK ? 260 : 120 }, .45 + youK * .3); ctx.restore();
  if (inM(t, M.lock, .6, 1)) sfxText('ΚΛΑΚ!', 300, 200, 80, -.1, '#fff');
  if (inM(t, M.chaos)) { sfxText('ΚΟ-ΚΟ-ΚΟ!', 360, 160, 70, -.15, '#ffd23f'); sfxText('ΒΡΡΡ! ΤΣΑΚ!', 900, 560, 60, .12, '#fff'); }
}
return {
  id: 'scene16', title: '16 · Το κοτέτσι', steps, render, fadeIn: false,
  events: M => [[M.come.a, SFX.whoosh], [M.chase.a, () => { SFX.buzz(3); SFX.rev(); }], [M.chase.a + 1, SFX.zap], [M.lock.a + .6, SFX.slam], [M.chaos.a, () => { SFX.cluck(); SFX.zap(); SFX.crash(); }], [M.chaos.a + .6, SFX.cluck], [M.chaos.a + 1.2, SFX.rev],
    [M.out.a, () => { SFX.fanfare(); SFX.cluck(); }], [M.wake.a + .3, SFX.snore], [M.red.a, () => tone(70, 1.2, 'sawtooth', .08, .8)], [M.you.a, SFX.boom]],
  ambience: () => ({ hum: .03, cicada: .02 }),
};
})());
