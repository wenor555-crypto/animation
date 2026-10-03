/* Ep.4, Scene 6 – «Σαράντα τρεις χιλιάδες»: Γιάννος's room, night. Ep. 3's gadgets; the blessed slipper in its display
   case (not mentioned). He decides: suits, like Iron Man. The agent prices one. He has 212 euros: a glove. The left one. */
defineScene((() => {
const CAMS = { room: [640, 420, 1.1], gia: [600, 380, 2.1], screen: [0, 0, 1], case: [990, 440, 2.6] };
const steps = [
  { act: 'night', d: 2.2, cam: 'room' },
  { act: 'slipper', d: 1.4, cam: 'case' },
  { who: 'giannos', cam: 'gia', mark: 'suits', el: 'Agent. Θέλω στολές. Για όλους. Σαν Iron Man. Να αντέχουν λέιζερ.', en: 'Agent. I want suits. For everyone. Like Iron Man. Laser-proof.', say: 'Έιτζεντ. Θέλω στολές. Για όλους. Σαν Άιρον Μαν. Να αντέχουν λέιζερ.' },
  { who: 'agent', cam: 'screen', mark: 'price', el: 'Κατανοητό. Κόστος: σαράντα τρεις χιλιάδες ευρώ.', en: 'Understood. Cost: forty-three thousand euros.' },
  { who: 'giannos', cam: 'gia', el: 'Για όλους;', en: 'For everyone?' },
  { who: 'agent', cam: 'screen', el: 'Για μία.', en: 'For one.' },
  { who: 'giannos', cam: 'gia', mark: 'has', el: '…Έχω διακόσια δώδεκα.', en: '…I have two hundred and twelve.', gap: .8 },
  { who: 'agent', cam: 'screen', el: 'Με διακόσια δώδεκα μπορώ να σου φτιάξω ένα γάντι.', en: 'With two hundred and twelve I can make you a glove.' },
  { who: 'giannos', cam: 'gia', el: 'Ένα;', en: 'One?' },
  { who: 'agent', cam: 'screen', mark: 'left', el: 'Αριστερό.', en: 'The left one.', gap: .6 },
  { act: 'end', d: 1.8, cam: 'room' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'screen') { agentWave(t, talk('agent', t), { spec: t < M.has.a ? '43.000 €' : t < M.left.a ? '212 € → 1 ΓΑΝΤΙ' : '212 € → 1 ΓΑΝΤΙ (Α)' }); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  giannosRoom(t, { war: true, case: true });
  const typing = inM(t, M.night);
  person(600, SEAT + 30, 1, CAST.giannos, { t, talk: talk('giannos', t), legs: 'seat', look: inM(t, M.has) || t > M.left.b ? [.2, .7] : [.4, -.1], brow: t > M.has.a ? 'worry' : 'down', mouth: 'flat',
    R: typing ? [80 + Math.sin(t * 10) * 10, -70] : gesture(t, talk('giannos', t), [80, -60]), L: typing ? [-20 + Math.sin(t * 11) * 10, -70] : [-40, -60] });
  ctx.restore();
  applyLight('night', .55);
  ctx.save(); applyCam(c); giannosRoomGlow(t); ctx.restore();
  vignette(.45);
}
return {
  id: 'scene06', title: '6 · Σαράντα τρεις χιλιάδες', steps, render,
  events: M => [[M.night.a + .2, () => { for (let i = 0; i < 10; i++) tone(1400, .03, 'square', .02, 1, i * .1); }], [M.price.a - .2, () => tone(300, .4, 'sine', .04, 1.4)], [M.left.b, () => tone(180, .8, 'sine', .04, .7)]],
  ambience: () => ({ cricket: .02, hum: .02 }),
};
})());
