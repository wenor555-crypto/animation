/* Ep.2 remake, Scene 18 – «Δόλωμα»: sunset. A can of beer on the table in front of Κώστας. He drinks, for the village.
   Manga transformation: hood, sunglasses, speed lines. Panik. */
defineScene((() => {
const X = { giannos: 460, kostas: 640, mimis: 820 };
const CAMS = { wide: [640, 420, 1.15], can: [640, 510, 3.2], gia: [470, 400, 2.1], kos: [640, 380, 2.2], kosC: [640, 360, 3], mim: [820, 400, 2.1], manga: [640, 360, 2.2] };
const steps = [
  { act: 'can', d: 2.6, cam: 'can' },
  { who: 'giannos', cam: 'gia', el: 'Κώστα. Πρέπει να πιεις.', en: 'Kostas. You have to drink.' },
  { who: 'kostas', cam: 'kos', el: 'Έξι το απόγευμα είναι. Δεν είμαι αλκοολικός.', en: "It's six in the evening. I'm not an alcoholic." },
  { who: 'mimis', cam: 'mim', el: 'Για το χωριό.', en: 'For the village.' },
  { act: 'look', d: 1.4, cam: 'kosC' },
  { who: 'kostas', cam: 'kosC', mark: 'toast', el: '…Για το χωριό.', en: '…For the village.' },
  { act: 'drink', d: 3, cam: 'kos' },
  { act: 'trans', d: 4.4, cam: 'manga' },
  { who: 'panik', cam: 'manga', mark: 'woke', el: 'Η πόλη… ξύπνησε.', en: 'The city… has woken.' },
  { who: 'mimis', cam: 'mim', el: 'Χωριό είναι.', en: "It's a village." },
  { who: 'panik', cam: 'kosC', mark: 'city', el: 'Για μένα είναι πόλη.', en: "To me it's a city." },
  { act: 'end', d: 1.6, cam: 'wide' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  const drank = t > M.drink.a + 2.2, hoodK = prog(t, M.trans.a + 1.4, M.trans.a + 2.4), shadesK = prog(t, M.trans.a + .4, M.trans.a + 1.4), pk = t > M.trans.a + 2.4;
  ctx.save(); applyCam(c);
  yard(t, { light: 'dusk' });
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const tk = talk('kostas', t) || talk('panik', t);
  const drinking = inM(t, M.drink, .4, -.4);
  const kst = { t, talk: tk, look: inM(t, M.look) ? [0, .8] : pk ? [0, 0] : la('kostas', [0, .3]), lid: !pk, brow: pk ? 'frown' : 'flat', mouth: pk ? 'frown' : 'flat',
    L: shadesK > 0 && shadesK < 1 ? [-10, -210] : hoodK > 0 && hoodK < 1 ? [-50, -260] : drinking ? [-20, -200] : inM(t, M.toast) ? [-60, -170] : [-50, -40], itemL: t > M.toast.a - .2 && t < M.trans.a + .4 ? 'beer' : pk ? 'beer' : null,
    shades: shadesK >= 1, hood: hoodK >= .6 };
  tableOf(t, [
    [X.giannos, 'giannos', { t, talk: talk('giannos', t), look: la('giannos', [1, 0]), brow: 'flat', mouth: 'flat', R: gesture(t, talk('giannos', t)) }],
    [X.kostas, 'kostas', kst],
    [X.mimis, 'mimis', { t, talk: talk('mimis', t), look: la('mimis', [-1, 0]), lid: true, mouth: 'flat' }],
  ], {});
  if (t < M.toast.a - .2) beerCan(610, 540, 1.2);                // the can, waiting on the table
  if (drinking) { ctx.save(); ctx.translate(640, SEAT - 200); for (let i = 0; i < 3; i++) blob(-12 + i * 8, 40 + Math.sin(t * 20 + i) * 2, 2, 3, '#fff', { lw: 0 }); ctx.restore(); }
  ctx.restore();
  applyLight('dusk', 1);
  if (inM(t, M.can)) { ctx.save(); applyCam(c); glow(610, 520, 60, 'rgba(255,220,140,1)', .5); ctx.restore(); sfxText('ΤΣΣΣ', 760, 250, 40, -.1, '#fff'); }
  if (inM(t, M.trans) || inM(t, M.woke)) {
    mangaize(1); speedLines(640, 300, 90, 170);
    if (t > M.trans.a + 2.4) sfxText('PANIK', 640, 600, 130, -.08, '#c8f04a', '#111');
  }
  if (inM(t, M.drink, 2.2, 0)) sfxText('ΚΡΑΤΣ', 800, 200, 50, .1, '#fff');
  vignette(.45);
}
return {
  id: 'scene18', title: '18 · Δόλωμα', steps, render,
  events: M => [[M.can.a + .6, SFX.hiss], [M.drink.a + .4, () => { SFX.sip(); SFX.sip(); }], [M.drink.a + 2.2, SFX.crash], [M.trans.a, () => { SFX.boom(); SFX.swell(); }], [M.trans.a + 1, SFX.whoosh], [M.trans.a + 2.4, () => { SFX.boom(); SFX.gong(); }]],
  ambience: () => ({ cicada: .01, cricket: .02 }),
};
})());
