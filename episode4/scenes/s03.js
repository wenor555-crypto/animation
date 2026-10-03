/* Ep.4, Scene 3 – «Καλημέρα»: Λέχαιο, morning. A drone with a red eye hovers over Κώστας's balcony. He comes out with
   coffee and a hangover, sees it, and waves at it like at a neighbour. */
defineScene((() => {
const KX = 560;
const CAMS = { wide: [660, 360, 1], drone: [930, 240, 2.4], kos: [KX, 300, 2.1], two: [720, 330, 1.4] };
const steps = [
  { act: 'out', d: 2.6, cam: 'wide' },
  { act: 'see', d: 1.6, cam: 'drone' },
  { who: 'kostas', cam: 'kos', mark: 'hi', el: 'Καλημέρα, κυρ-Μήτσο.', en: 'Morning, Mr Mitsos.' },
  { who: 'kostas', cam: 'two', mark: 'wife', el: 'Πες στη γυναίκα σου ότι δεν είδα τίποτα.', en: "Tell your wife I didn't see a thing." },
  { act: 'end', d: 1.8, cam: 'two' },
];
let M;
function balcony(t) {
  sky('day', t);
  poly([[-400, 300], [200, 250], [700, 300], [1300, 240], [1800, 300], [1800, 420], [-400, 420]], '#9ab08a', { lw: 3 });   // the hills
  rect(140, 160, 1040, 800, '#efe4cf', { lw: 4 });                                                                         // the house front
  rect(120, 140, 1080, 24, '#b8603a', { lw: 4 });
  rect(380, 210, 170, 330, '#6a4a2e', { lw: 4 }); rect(394, 224, 142, 150, '#bfe0f0', { lw: 3 });                          // the balcony door
  rect(820, 230, 180, 150, '#bfe0f0', { lw: 4 }); curve([[910, 230], [910, 380]], 3);                                     // a window
  for (const x of [790, 1030]) rect(x, 220, 26, 170, '#3f7a4a', { lw: 3 });                                                 // shutters
  rect(200, 540, 900, 22, '#d8d0c0', { lw: 4 });                                                                           // the balcony slab
  for (const x of [260, 1040]) { rect(x - 30, 470, 60, 70, '#c4643c', { lw: 3 }); blob(x, 455, 40, 26, '#5aa05a', { lw: 3 }); }   // pots of basil
}
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  balcony(t);
  const k = ease(prog(t, M.out.a, M.out.a + 1.6)), x = lerp(460, KX, k);
  const up = t > M.see.a;
  person(x, 540 - 150 * .95, .95, CAST.kostas, { legs: 'stand', t, talk: talk('kostas', t), look: up ? [.6, -.8] : [.2, .3], lid: true, brow: 'flat', mouth: inM(t, M.hi) ? 'smile' : 'flat',
    L: [-40, -110], itemL: 'coffee', R: inM(t, M.hi) ? [70 + Math.sin(t * 9) * 16, -250] : [44, -40] });
  for (let i = 0; i < 16; i++) limb([[220 + i * 56, 548], [220 + i * 56, 440]], 4, '#2a2a30', { w: 0 });   // the railing, in front of him
  curve([[200, 440], [1100, 440]], 7, '#2a2a30', { w: 0 });
  droneCam(930 + Math.sin(t * .7) * 20, 210 + Math.sin(t * 1.3) * 8, t, { s: 2.2 });
  if (inM(t, M.hi, .3) || inM(t, M.wife)) { blob(930 + Math.sin(t * .7) * 20 + 0, 210 + 12, 3, 3, '#ff3030', { lw: 0 }); }
  ctx.restore();
  ctx.save(); applyCam(c); glow(930 + Math.sin(t * .7) * 20, 222, 40, 'rgba(255,40,40,1)', .5); ctx.restore();
  applyLight('dawn', .25);
  vignette(.3);
}
return {
  id: 'scene03', title: '3 · Καλημέρα', steps, render,
  events: M => [[M.out.a + .2, SFX.door], [M.out.a + 1.4, SFX.sip], [M.see.a, () => SND2.sfx('drone_swarm', .25, { rate: 1.4 })], [M.wife.b, SFX.sip]],
  ambience: () => ({ cicada: .012 }),
};
})());
