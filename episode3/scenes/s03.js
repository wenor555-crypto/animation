/* Ep.3, Scene 3 – «Μαρμοκοτρόκο»: Κώστας's kitchen, morning. Sober, coffee, boredom. A hidden-number SMS. He answers in his own language. */
defineScene((() => {
const SMS = ['ΣΙΤΑ (SMS)', 'SITA (SMS)'], ME = ['ΚΩΣΤΑΣ (γράφει)', 'KOSTAS (typing)'];
const CAMS = { wide: [640, 420, 1.15], kos: [600, 390, 2.1], kosC: [600, 370, 2.8], sms: [0, 0, 1] };
const steps = [
  { act: 'morning', d: 2.8, cam: 'wide' },
  { act: 'buzz', d: 1.2, cam: 'kos' },
  { who: 'sita', label: SMS, cam: 'sms', mark: 'm1', el: 'ΠΑΡΑΣΙΤΟ. Η ΕΞΥΠΝΗ ΕΠΑΝΑΣΤΑΣΗ ΕΡΧΕΤΑΙ.', en: 'PARASITE. THE SMART REVOLUTION IS COMING.' },
  { act: 'look1', d: 1.2, cam: 'kosC' },
  { who: 'kostas', label: ME, cam: 'sms', mark: 'r1', el: 'Μαρμοκοτρόκο.', en: 'Marmokotroko.' },
  { act: 'sip', d: 1.6, cam: 'kos' },
  { who: 'sita', label: SMS, cam: 'sms', mark: 'm2', el: 'ΘΑ ΠΛΗΡΩΣΕΙΣ ΓΙΑ ΤΗ ΦΩΤΙΑ.', en: 'YOU WILL PAY FOR THE FIRE.' },
  { who: 'kostas', label: ME, cam: 'sms', mark: 'r2', el: 'Σικαρέλο.', en: 'Sikarelo.', gap: .8 },
  { act: 'fridge', d: 1.4, cam: 'wide' },
  { who: 'kostas', cam: 'kos', mark: 'milk', el: '…Πάλι τελείωσε το γάλα.', en: '…Out of milk again.' },
  { act: 'end', d: 1.2, cam: 'wide' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'sms') {
    const msgs = [{ me: false, text: 'ΠΑΡΑΣΙΤΟ. Η ΕΞΥΠΝΗ ΕΠΑΝΑΣΤΑΣΗ ΕΡΧΕΤΑΙ.', at: M.m1.a }, { me: true, text: 'Μαρμοκοτρόκο.', at: M.r1.b - .1 }, { me: false, text: 'ΘΑ ΠΛΗΡΩΣΕΙΣ ΓΙΑ ΤΗ ΦΩΤΙΑ.', at: M.m2.a }, { me: true, text: 'Σικαρέλο.', at: M.r2.b - .1 }];
    const typing = inM(t, M.r1) ? ['Μαρμοκοτρόκο.', prog(t, M.r1.a, M.r1.b - .2)] : inM(t, M.r2) ? ['Σικαρέλο.', prog(t, M.r2.a, M.r2.b - .2)] : null;
    smsScreen(t, msgs, { red: true, typing: typing && typing[0], typingK: typing && typing[1] });
    return;
  }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  kostasKitchen(t, {});
  const tk = talk('kostas', t), fridgeOpen = inM(t, M.fridge, .3, 99);
  const kx = fridgeOpen ? lerp(600, 250, ease(prog(t, M.fridge.a, M.fridge.a + 1))) : 600;
  if (fridgeOpen) { fridge(140, 690, 0); rect(70, 360, 140, 330, '#f4f6f6', { lw: 4 }); for (let i = 0; i < 3; i++) curve([[80, 420 + i * 80], [200, 420 + i * 80]], 3, '#c8ccd0'); rect(150, 380, 30, 50, '#f4f4f0', { lw: 2 }); }
  const phone = t > M.buzz.a && !fridgeOpen;
  stand(kx, 'kostas', 1, { t, talk: tk, legs: inM(t, M.fridge, 0, .9) ? 'walk' : 'stand', look: phone ? [.3, .7] : fridgeOpen ? [-1, .1] : [.3, .2], lid: true, mouth: 'flat', brow: 'flat',
    L: inM(t, M.sip) ? [-20, -200] : [-40, -110], itemL: 'cup2', R: phone ? [40, -130] : [44, -24], itemR: phone ? 'phone' : null, dir: fridgeOpen ? -1 : 1 });
  if (inM(t, M.buzz)) sfxText('BZZ', kx + 90, 260, 30, -.1, '#fff');
  ctx.restore();
  applyLight('dawn', .3);
  vignette(.3);
}
return {
  id: 'scene03', title: '3 · Μαρμοκοτρόκο', steps, render,
  events: M => [[M.morning.a + .5, SFX.sip], [M.buzz.a, () => SFX.buzz(.4)], [M.m1.a - .1, SFX.ding], [M.r1.b - .1, SFX.pop], [M.sip.a + .3, SFX.sip], [M.m2.a - .1, SFX.ding], [M.r2.b - .1, SFX.pop], [M.fridge.a + .5, SFX.door]],
  ambience: () => ({ cicada: .01 }),
};
})());
