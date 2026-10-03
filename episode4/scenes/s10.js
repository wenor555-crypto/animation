/* Ep.4, Scene 10 – «Δεσμευμένα»: Γιώργος's new office, high up, the Corinthian gulf behind the glass. Γιάννος asks for
   43 thousand. «Είναι δεσμευμένα. …Ακόμα.» (plant 2). «Είσαι μαλάκας.» «Δεν είμαι μαλάκας. Είμαι μακροπρόθεσμη επένδυση.»
   Γιάννος leaves. Γιώργος alone: a screen we can't read, one second of weight; then he smiles at the view. */
defineScene((() => {
const X = { giorgos: 760, giannos: 420 };
const CAMS = { wide: [640, 400, 1.05], gio: [X.giorgos, 380, 2.1], gia: [X.giannos, 380, 2.1], two: [590, 400, 1.5], screen: [1000, 410, 3], view: [640, 360, 1.15] };
const steps = [
  { act: 'enter', d: 2.2, cam: 'wide' },
  { who: 'giannos', cam: 'gia', el: 'Ωραίο γραφείο.', en: 'Nice office.' },
  { who: 'giorgos', cam: 'gio', el: 'Με θέα. Πάντα ήθελα γραφείο με θέα.', en: 'With a view. I always wanted an office with a view.' },
  { who: 'giannos', cam: 'gia', el: 'Πούλησες στα Τζάμπο το σαράντα τοις εκατό. Ξέρω πόσα πήρες.', en: 'You sold forty percent to Jumbo. I know how much you got.' },
  { who: 'giorgos', cam: 'gio', el: 'Ξέρεις πόσα γράφτηκαν. Δεν είναι το ίδιο.', en: "You know how much was reported. That's not the same." },
  { who: 'giannos', cam: 'gia', el: 'Θέλω σαράντα τρία. Για στολές. Για να μη χάσουμε.', en: "I want forty-three. For suits. So we don't lose." },
  { who: 'giorgos', cam: 'gio', mark: 'tied', el: 'Είναι δεσμευμένα.', en: "It's tied up." },
  { who: 'giannos', cam: 'gia', el: 'Τι πάει να πει δεσμευμένα;', en: 'What does tied up mean?' },
  { who: 'giorgos', cam: 'gio', el: 'Πάει να πει ότι δεν γίνεται.', en: "It means it can't be done." },
  { who: 'giorgos', cam: 'gio', mark: 'yet', el: '…Ακόμα.', en: '…Yet.', gap: .7 },
  { who: 'giannos', cam: 'two', el: 'Ακόμα; Πότε; Όταν έρθει να μας πάρει τα σπίτια;', en: 'Yet? When? When she comes to take our homes?' },
  { who: 'giorgos', cam: 'gio', el: 'Γιάννο. Εμπιστέψου με.', en: 'Giannos. Trust me.' },
  { who: 'giannos', cam: 'gia', mark: 'fear', el: 'Δεν φοβάμαι ότι θα χάσουμε, Γιώργο. Φοβάμαι ότι θα χάσουμε και θα φταίω εγώ. Εγώ την έφτιαξα.', en: "I'm not afraid we'll lose, Giorgos. I'm afraid we'll lose and it'll be my fault. I made her." },
  { who: 'giorgos', cam: 'gio', el: 'Κι εγώ την πούλησα. Ο καθένας με τη δουλειά του.', en: 'And I sold her. Everyone has their job.' },
  { who: 'giannos', cam: 'gia', mark: 'mal', el: 'Είσαι μαλάκας.', en: "You're an asshole." },
  { who: 'giorgos', cam: 'gio', mark: 'inv', el: 'Δεν είμαι μαλάκας. Είμαι μακροπρόθεσμη επένδυση.', en: "I'm not an asshole. I'm a long-term investment." },
  { act: 'leave', d: 2.2, cam: 'wide' },
  { act: 'screen', d: 1.2, cam: 'screen' },
  { act: 'weight', d: 1.6, cam: 'gio' },
  { act: 'view', d: 2.4, cam: 'view' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  gioOffice(t);
  gioDesk(t, { screen: t > M.leave.b, screenSeed: 7 });
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const alone = t > M.leave.b, smile = t > M.view.a + .4;
  stand(X.giorgos, 'giorgosJacket', 1, { t, talk: talk('giorgos', t), dir: -1, look: alone ? (inM(t, M.screen) || inM(t, M.weight) ? [.6, .4] : [.8, -.2]) : la('giorgos', [-.6, 0]),
    brow: inM(t, M.weight) ? 'worry' : 'up', mouth: inM(t, M.weight) ? 'flat' : smile || inM(t, M.inv) ? 'smile' : 'flat', R: gesture(t, talk('giorgos', t), [44, -40]), L: [-40, -30] });
  const lk = prog(t, M.leave.a, M.leave.b), gx = lerp(X.giannos, -260, ease(lk));
  if (gx > -220) stand(gx, 'giannos', 1, { t, talk: talk('giannos', t), legs: lk > 0 && lk < 1 ? 'walk' : 'stand', dir: lk > 0 ? -1 : 1, look: lk > 0 ? [-1, 0] : la('giannos', [.6, 0]),
    brow: t > M.fear.a ? 'down' : 'up', mouth: 'flat', R: gesture(t, talk('giannos', t), [44, -40]), L: [-40, -30] });
  ctx.restore();
  vignette(alone ? .35 : .25);
}
return {
  id: 'scene10', title: '10 · Δεσμευμένα', steps, render,
  events: M => [[M.yet.a - .2, () => tone(196, 1.2, 'sine', .04, .9)], [M.leave.b - .4, SFX.door], [M.screen.a + .1, () => tone(1200, .06, 'sine', .02, 1)]],
  ambience: () => ({ hum: .01 }),
};
})());
