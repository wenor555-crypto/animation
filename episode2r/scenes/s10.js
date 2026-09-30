/* Ep.2 remake, Scene 10 – «Παράδοση»: afternoon heatwave. A huge JUMBO truck squeezes through Λέχαιο's alleys and stops outside the house.
   The driver has the paperwork. The rear door opens by itself: first out jumps a beach chair, which unfolds itself, and Βασίλης sits.
   Behind it, red light: something much bigger moves inside the truck. Βασίλης doesn't even turn round. */
defineScene((() => {
const X = { vasilis: 300, mimis: 150, giannos: 440, odigos: 700 };
const CAMS = { wide: [640, 400, .9], truck: [760, 420, 1.05], drv: [640, 400, 1.9], vas: [330, 400, 2.1], mim: [170, 400, 2.1], gia: [440, 400, 2.1], group: [360, 420, 1.45], door: [520, 450, 1.6], chair: [440, 520, 1.9], red: [560, 430, 1.35] };
const steps = [
  { act: 'arrive', d: 5, cam: 'wide' },
  { act: 'stop', d: 1.4, cam: 'truck' },
  { act: 'out', d: 2, cam: 'truck' },
  { who: 'odigos', cam: 'drv', mark: 'sign', el: 'Παράδοση για Βασίλη. Υπογράψτε εδώ.', en: 'Delivery for Vasilis. Sign here.' },
  { who: 'vasilis', cam: 'vas', mark: 'cig', el: 'Ήρθε και το τσιγάρο;', en: 'Did the cigarette come too?' },
  { who: 'odigos', cam: 'drv', el: '…Τι τσιγάρο;', en: '…What cigarette?' },
  { who: 'vasilis', cam: 'vas', el: 'Κανείς δεν έχει ποτέ.', en: 'Nobody ever does.' },
  { who: 'mimis', cam: 'mim', el: 'Μπαμπά, τι παρήγγειλες;', en: 'Dad, what did you order?' },
  { who: 'vasilis', cam: 'vas', el: 'Μια καρέκλα παραλίας. Την έξυπνη.', en: 'A beach chair. The smart one.' },
  { who: 'giannos', cam: 'gia', el: 'Σε φορτηγό τριάντα τόνων;', en: 'In a thirty-tonne truck?' },
  { who: 'mimis', cam: 'group', el: 'Εγώ είπα από τα Jumbo, όχι από Temu…', en: 'I said from Jumbo, not from Temu…' },
  { act: 'door', d: 2.2, cam: 'door' },
  { act: 'jump', d: 2.6, cam: 'chair' },
  { act: 'sit', d: 2.2, cam: 'chair' },
  { who: 'vasilis', cam: 'chair', mark: 'mine', el: 'Η καρέκλα μου.', en: 'My chair.' },
  { act: 'redlight', d: 3.2, cam: 'red' },
  { who: 'mimis', cam: 'red', mark: 'both', el: '…Έφερε και παρέα.', en: '…She brought company.' },
  { act: 'end', d: 1.4, cam: 'red' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  villageStreet(t, { light: 'day', pole: false });
  // Μίμης's yard wall and gate on the left, the fig tree peeking over
  rect(-300, 470, 560, 220, '#efe4cf', { lw: 4 }); figTree(-60, 520, t); rect(-300, 460, 560, 20, '#e8dcc4', { lw: 3 });
  // the truck: squeezes in (scrapes the wall), stops; rear door opens by itself
  const tx = lerp(1900, 1000, ease(prog(t, M.arrive.a, M.arrive.b))) + (inM(t, M.arrive, 2.5, -1) ? Math.sin(t * 30) * 3 : 0);
  const doorK = ease(prog(t, M.door.a + .6, M.door.b));
  const inside = t > M.redlight.a ? `rgb(${140 + 60 * Math.sin(t * 5)},10,10)` : '#1a0a0a';
  jumboTruck(tx, GROUND + 10, t, { dir: 1, s: .95, door: doorK, moving: t < M.stop.a, lights: t < M.stop.b, inside });
  if (inM(t, M.arrive, 2.5, -1)) { sfxText('ΓΚΡΡΡ', 1300, 400, 40, .1, '#fff'); for (let i = 0; i < 6; i++) blob(1240 + hash(i + Math.floor(t * 8)) * 60, 560 + hash(i) * 60, 4, 4, '#efe4cf', { lw: 1.5 }); }
  // something big moving inside, red eyes blinking in the dark
  if (t > M.redlight.a) for (let i = 0; i < 7; i++) if (Math.sin(t * 3 + i * 1.7) > -.3) redEye(tx - 330 + 12 + (i % 2) * 8, GROUND - 250 + i * 30, 4);
  // the beach chair: jumps out of the truck and unfolds itself
  const jk = prog(t, M.jump.a, M.jump.a + 1.2), cx = lerp(tx - 330, 440, jk), cy = GROUND + 12 - Math.sin(jk * Math.PI) * 160;
  if (t > M.jump.a) beachChair(cx, cy, prog(t, M.jump.a + 1.3, M.jump.b), t, { dir: -1 });
  // people
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const seated = t > M.sit.a + 1.2, vx = seated ? 440 : lerp(X.vasilis, 440, ease(prog(t, M.sit.a, M.sit.a + 1.2)));
  if (seated) person(430, 600, 1, CAST.vasilis, { t, talk: talk('vasilis', t), legs: 'seat', lid: true, mouth: 'smile', look: [-.4, .1], L: [-60, -80], R: [60, -80] });
  else stand(vx, 'vasilis', 1, { t, talk: talk('vasilis', t), legs: inM(t, M.sit) ? 'walk' : 'stand', lid: true, mouth: 'flat', look: t > M.jump.a ? [1, .3] : la('vasilis', [1, 0]), R: t > M.sign.a + 1 && t < M.cig.b ? [70, -80] : [44, -24], itemR: t > M.sign.a + 1.6 && t < M.cig.b ? 'pencil' : null });
  stand(X.mimis, 'mimis', 1, { t, talk: talk('mimis', t), lid: true, mouth: 'flat', look: t > M.redlight.a ? [1, .1] : la('mimis', [1, 0]) });
  if (!seated) stand(X.giannos, 'giannos', 1, { t, talk: talk('giannos', t), mouth: 'flat', look: t > M.door.a ? [1, 0] : la('giannos', [1, 0]), brow: t > M.redlight.a ? 'worry' : 'flat', R: gesture(t, talk('giannos', t)) });
  else stand(560, 'giannos', 1, { t, talk: 0, mouth: 'flat', look: [1, 0], brow: 'worry', dir: 1 });
  if (t > M.out.a) {
    const [dx, dw] = path(t, [[M.out.a, tx + 260], [M.out.b, X.odigos], [M.door.a, X.odigos], [M.door.a + 1.2, 860]]);
    stand(dx, 'odigos', 1, { t, talk: talk('odigos', t), legs: dw ? 'walk' : 'stand', look: la('odigos', [-1, 0]), brow: 'flat', mouth: 'flat', dir: -1, L: [-40, -100], itemL: 'clipboard' });
  }
  ctx.restore();
  // heatwave shimmer + red spill from the truck
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .08; ctx.fillStyle = '#ffb040'; ctx.fillRect(0, 0, W, H); ctx.restore();
  if (t > M.redlight.a) { ctx.save(); applyCam(c); glow(tx - 330, GROUND - 150, 300, 'rgba(255,30,30,1)', .45 + .15 * Math.sin(t * 5)); ctx.restore(); }
  if (t < M.stop.a) sfxText('ΚΑΥΣΩΝΑΣ 41°C', 160, 60, 30, -.05, '#ffd23f');
  vignette(.3);
}
return {
  id: 'scene10', title: '10 · Παράδοση', steps, render,
  events: M => [[M.arrive.a + .2, SFX.engine], [M.arrive.a + 1.6, SFX.engine], [M.arrive.a + 2.6, () => { noise(1, .2, 1500, .5, 'bandpass'); }], [M.stop.a, SFX.hiss], [M.out.a + .2, SFX.door],
    [M.door.a + .6, SFX.creak], [M.jump.a + .2, SFX.whoosh], [M.jump.a + 1.2, SFX.thud], [M.jump.a + 1.4, SFX.clacks], [M.sit.a + 1.2, () => tone(200, .4, 'sine', .05, .8)],
    [M.redlight.a, () => { SFX.clack(); SFX.buzz(2); }], [M.redlight.a + 1.5, SFX.thud]],
  ambience: () => ({ cicada: .04 }),
};
})());
