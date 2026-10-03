/* Ep.4, Scene 12 – «Η φτηνή στολή»: Μίμης's yard, dusk. A build montage: an oil barrel, a baking tray, a leaf blower, a
   motorbike helmet with a phone taped on. The agent: 14% survival (15 with the glove). The test: the blower lifts him for
   two seconds; then into the fig tree. Βασίλης: «Δημητράκι. Ο φίλος σου είναι στη συκιά.» Μίμης, from inside: «Το ξέρω.» */
defineScene((() => {
const AG = ['AGENT (κινητό)', 'AGENT (phone)'];
const CAMS = { yard: [640, 420, 1.05], gia: [560, 380, 2], bench: [540, 470, 1.7], fig: [200, 420, 1.6], vas: [1000, 380, 2.1] };
const steps = [
  { act: 'build', d: 3.2, cam: 'bench' },
  { who: 'giannos', cam: 'gia', mark: 'list', el: 'Βαρέλι λαδιού. Ταψί. Φυσητήρας. Κράνος.', en: 'Oil barrel. Baking tray. Leaf blower. Helmet.' },
  { who: 'agent', label: AG, cam: 'gia', mark: 'p14', el: 'Πιθανότητα επιβίωσης: δεκατέσσερα τοις εκατό.', en: 'Chance of survival: fourteen percent.' },
  { who: 'giannos', cam: 'gia', el: 'Με το γάντι;', en: 'With the glove?' },
  { who: 'agent', label: AG, cam: 'gia', mark: 'p15', el: 'Δεκαπέντε.', en: 'Fifteen.' },
  { act: 'test', d: 4.2, cam: 'yard' },
  { who: 'vasilis', cam: 'vas', mark: 'tree', el: 'Δημητράκι. Ο φίλος σου είναι στη συκιά.', en: 'Dimitraki. Your friend is in the fig tree.' },
  { who: 'mimis', label: ['ΜΙΜΗΣ (από μέσα)', 'MIMIS (from inside)'], cam: 'vas', mark: 'know', el: 'Το ξέρω.', en: 'I know.' },
  { act: 'end', d: 1.4, cam: 'fig' },
];
let M;
const GX = 560;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, { light: 'dusk' });
  // the workbench and what's left on it
  rect(380, 590, 300, 16, '#8a6a3a', { lw: 3 }); limb([[400, 606], [400, 690]], 6, '#6a4a2a'); limb([[660, 606], [660, 690]], 6, '#6a4a2a');
  const worn = prog(t, M.build.a + .4, M.list.b);   // the parts move from the bench onto him
  rect(720, 560, 70, 130, '#3a5a8a', { lw: 4 }); for (const y of [585, 660]) curve([[720, y], [790, y]], 3, '#2a3a5a', { w: 0 }); txt('Faraday', 755, 625, 11, '#fff', { font: TVFONT, weight: 900 });   // the oil barrel
  // the test flight: up 2 s on the blower, then a curve into the fig tree
  const k = t - M.test.a, fly = t > M.test.a && t < M.tree.a + 99;
  let x = GX, y = standY(1), fall = 0, pose = { v2: { feet: [[-30, 146], [34, 146]], lean: .06 }, R: [56, -30], L: [-30, -10] }, blower = 0;
  if (fly) {
    const up = clamp(k / .5), drift = clamp((k - 2.2) / 1.2);
    blower = k < 2.4 ? 1 : 0;
    x = lerp(GX, 200, ease(drift)); y = standY(1) - 200 * up * (1 - drift * .4) - Math.sin(k * 6) * 6 * (1 - drift);
    pose = { ...POSE2.jump(.6), R: [90, -150], L: [-90, -140] };
    if (k > 3.4) { x = 200; y = standY(1) - 260; fall = -.6; pose = { ...POSE2.fallBack(.6), R: [100, -190], L: [-110, -170] }; }
  }
  if (t > M.test.a + 3.4) figTree(170, 690, t);   // he's in it: the leaves over him (yard draws the tree first)
  person(x, y, 1, CAST.giannos, { t, talk: talk('giannos', t), legs: 'stand', look: fly ? [.2, -.6] : t < M.list.a ? [-.3, .6] : [.4, -.1], brow: fly && k > 2.2 ? 'worry' : 'down', mouth: fly && k > 2.2 ? 'o' : 'flat', ...pose, noShadow: fly });
  if (worn > .2) inBody(x, y, 1, 1, pose.v2, () => suitFront(t, {}));
  if (worn > .5) { ctx.save(); ctx.globalCompositeOperation = 'destination-over'; inBody(x, y, 1, 1, pose.v2, suitBack); ctx.restore(); }
  if (worn < .9) { blob(470, 580, 30, 12, '#c8ccd2', { lw: 3 }); }   // the tray, before
  if (worn < .5) { rect(540, 552, 60, 36, '#e8762b', { lw: 3 }); }   // the blower, before
  if (t > M.test.a + 3.4) { for (let i = 0; i < 6; i++) blob(150 + hash(i) * 120, 400 + hash(i + 5) * 80, 22, 14, '#5a9a4a', { lw: 2.5 }); }   // more leaves in front of him
  if (blower) { const n = L2S([-72, 46], x, y, 1, 1, pose.v2); glow(n[0], n[1] + 14, 46, 'rgba(255,200,140,1)', .7); fxBurst(t, Math.floor(t * 20) / 20, n[0], n[1] + 6, { kind: 'smoke', n: 6, speed: 220, dir: Math.PI / 2, spread: .7, life: .5, seed: 9 }); }
  stand(1000, 'vasilis', 1, { t, talk: talk('vasilis', t), dir: -1, look: t > M.test.a + 3 ? [-.8, -.4] : [-.4, 0], brow: 'flat', mouth: 'flat', R: [44, -40], L: [-40, -30], itemL: 'cup2' });
  ctx.restore();
  applyLight('dusk', .35);
  vignette(.3);
}
return {
  id: 'scene12', title: '12 · Η φτηνή στολή', steps, render,
  events: M => [[M.build.a + .3, SFX.clacks], [M.build.a + 1.6, SFX.thud], [M.test.a, () => SND2.sfx('leafblower_die', .7, { rate: 1.3 })], [M.test.a + .2, () => SND2.sfx('whoosh', .7)],
    [M.test.a + 2.4, () => SND2.sfx('leafblower_die', .9)], [M.test.a + 3.4, () => SND2.sfx('body_fall', .8)], [M.test.a + 3.5, SFX.crash]],
  ambience: () => ({ cicada: .012 }),
};
})());
