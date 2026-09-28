/* Ep.2, Scene 21 – «Νύχτα στην αυλή»: everyone wrecked. Κώστας, sober again, remembers nothing. He pulls out a pack of normal
   cigarettes. Βασίλης appears out of nowhere: «Έχεις ένα τσιγάρο;» Κώστας gives him one. «…Επιτέλους. Κάποιος έχει.» */
defineScene((() => {
const X = { giannos: 460, mimis: 640, giorgos: 820, kostas: 1000, vasilis: 1180, neos: 250 };
const CAMS = { wide: [700, 420, 1.1], kos: [1000, 380, 2.1], gia: [470, 400, 2.1], mim: [640, 400, 2.1], gio: [820, 400, 2.1], two: [1090, 400, 1.7], vas: [1150, 380, 2.1], neo: [300, 420, 2], cig: [1090, 380, 2.8] };
const steps = [
  { act: 'open', d: 3, cam: 'wide' },
  { who: 'kostas', cam: 'kos', el: 'Τι έγινε;', en: 'What happened?' },
  { who: 'giannos', cam: 'gia', el: 'Δεν θέλεις να ξέρεις.', en: "You don't want to know." },
  { who: 'kostas', cam: 'kos', el: 'Πού είναι το IQOS μου;', en: "Where's my IQOS?" },
  { who: 'mimis', cam: 'mim', el: 'Στον κάδο.', en: 'In the bin.' },
  { who: 'kostas', cam: 'kos', mark: 'belongs', el: '…Εκεί ανήκει.', en: '…That’s where it belongs.', gap: .7 },
  { act: 'pack', d: 2.2, cam: 'kos' },
  { act: 'appear', d: 1.4, cam: 'two' },
  { who: 'vasilis', cam: 'vas', mark: 'ask', el: 'Έχεις ένα τσιγάρο;', en: 'Got a cigarette?' },
  { act: 'give', d: 2.6, cam: 'cig' },
  { who: 'vasilis', cam: 'vas', mark: 'finally', el: '…Επιτέλους. Κάποιος έχει.', en: '…Finally. Somebody has one.' },
  { act: 'smoke', d: 1.6, cam: 'two' },
  { who: 'giorgos', cam: 'gio', el: 'Γιάννο… λέω να κάνουμε rebrand.', en: "Giannos… I'm thinking we rebrand." },
  { who: 'giannos', cam: 'gia', el: 'Λέω να πας σκοπιά.', en: "I'm thinking you go on guard duty." },
  { who: 'neos', cam: 'neo', mark: 'other', el: 'Την κάνει ένας άλλος νέος.', en: 'Another new guy is doing it.' },
  { act: 'end', d: 2.4, cam: 'wide' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, { light: 'night', doorLit: true, noChickens: true });
  // the aftermath: an arrow in the coop, a burnt patch, the tray dented, feathers
  arrow(60, 600, -.4, 1); blob(740, 700, 90, 10, 'rgba(30,20,20,.4)', { lw: 0 });
  feathers(640, 640, t, 12, .6);
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  tableOf(t, [
    [X.giannos, 'giannos', { t, talk: talk('giannos', t), look: la('giannos', [1, .1]), lid: true, brow: 'flat', mouth: 'flat', bandage: true }],
    [X.mimis, 'mimis', { t, talk: talk('mimis', t), look: la('mimis', [1, .1]), lid: true, mouth: 'flat', L: [-44, -40], itemL: 'bow' }],
    [X.giorgos, 'giorgos', { t, talk: talk('giorgos', t), look: la('giorgos', [-1, 0]), brow: 'worry', mouth: 'flat', L: [-50, -40], itemL: 'tray' }],
  ], { cups: [470, 836] });
  const hasPack = t > M.pack.a + .4, lit = t > M.give.a + 1.4;
  stand(X.kostas, 'kostas', 1, { t, talk: talk('kostas', t), look: t > M.appear.a ? [1, 0] : la('kostas', [-1, .1]), lid: true, mouth: 'flat', brow: 'flat',
    R: inM(t, M.give) ? [110, -110] : hasPack ? [60, -110] : [44, -24], itemR: hasPack && !inM(t, M.give, 1, 99) ? 'cigPack' : null, L: t > M.smoke.a ? [-30, -170] : [-44, -24], itemL: t > M.smoke.a ? 'cig' : null });
  if (t > M.appear.a) { const [vx, vw] = path(t, [[M.appear.a, 1500], [M.appear.b, X.vasilis]]);
    stand(vx, 'vasilis', 1, { t, talk: talk('vasilis', t), legs: vw ? 'walk' : 'stand', look: [-1, 0], lid: true, mouth: inM(t, M.finally, .6, 99) ? 'smile' : 'flat', dir: -1,
      R: inM(t, M.give) ? [-110, -110] : lit ? [-30, -170] : [44, -24], itemR: lit ? 'cig' : null }); }
  if (inM(t, M.give, 1, 1.6)) { lighter(X.kostas + 110, standY() - 110, 1); }
  // Γιώργος's new guy, sitting on the coop steps
  person(X.neos, SEAT + 30, .95, CAST.neos, { t, talk: talk('neos', t), legs: 'seat', look: la('neos', [1, 0]), brow: 'up', mouth: 'smile' });
  ctx.restore();
  applyLight('night', .9);
  ctx.save(); applyCam(c); glow(1060, 580, 300, 'rgba(255,220,140,1)', .25);
  if (t > M.give.a + 1) glow(X.vasilis - 30, standY() - 170, 40, 'rgba(255,120,40,1)', .7);
  if (t > M.smoke.a) glow(X.kostas - 30, standY() - 170, 40, 'rgba(255,120,40,1)', .7);
  ctx.restore();
  vignette(.45);
}
return {
  id: 'scene21', title: '21 · Νύχτα στην αυλή', steps, render,
  events: M => [[M.pack.a + .4, () => noise(.3, .1, 3000, 1, 'bandpass')], [M.give.a + 1, () => { SFX.spark(); noise(.4, .1, 2500, .5, 'bandpass', .1); }], [M.finally.b, () => noise(1.2, .06, 900, .5, 'bandpass')]],
  ambience: () => ({ cricket: .04, mosq: .004 }),
};
})());
