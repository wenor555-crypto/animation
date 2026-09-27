/* Ep.1, Scene 9 – «Panik» (script beat 9): Κώστας walks home drunk and becomes Panik. Opens Act 2. */
defineScene((() => {
const CAMS = { card: [640, 360, 1], street: [640, 380, 1], kos: [0, 330, 2.2], pole: [640, 330, 1.9], poleC: [640, 300, 2.8], cat: [900, 560, 2.6], two: [770, 420, 1.6], house: [1100, 420, 1.5] };
const steps = [
  { act: 'card', d: 3.4, cam: 'card' },
  { act: 'walkin', d: 1.5, cam: 'street' },
  { who: 'kostas', cam: 'street', mark: 'sing', el: "«…κι αν μ' αγαπάς, κι αν σ' αγαπώωω…»", en: '"…and if you love me, and if I love youuu…"' },
  { who: 'kostas', cam: 'kos', mark: 'pita', el: 'Πού πήγε η πίτα σου, ρε φίλε; Σε παράτησε κι εσένα;', en: 'Where did your pita go, man? Did she leave you too?' },
  { act: 'car', d: 2.4, cam: 'street' },
  { who: 'kostas', cam: 'kos', el: 'ΝΑΙ, ΚΑΙ ΣΕΝΑ! ΝΑ ΠΛΗΡΩΣΕΙΣ ΤΟ ΤΕΛΟΣ ΚΥΚΛΟΦΟΡΙΑΣ!', en: 'YEAH, YOU TOO! PAY YOUR ROAD TAX!' },
  { act: 'ritual', d: 4.6, cam: 'pole' },
  { act: 'flash', d: .45, cam: 'poleC' },
  { who: 'panik', cam: 'poleC', el: 'Η πόλη κοιμάται.', en: 'The city sleeps.' },
  { who: 'panik', cam: 'poleC', el: 'Εγώ όχι.', en: 'I do not.', gap: .9 },
  { act: 'cat', d: 1.6, cam: 'cat' },
  { who: 'panik', cam: 'two', el: 'Κι εσύ τι κοιτάς; Είσαι στειρωμένος; ΔΕΝ ΝΟΜΙΖΩ.', en: 'And what are YOU looking at? Are you neutered? I DON\'T THINK SO.' },
  { act: 'turn', d: 3.2, cam: 'house' },
];
let M;
function street(t, flick) {
  const g = ctx.createLinearGradient(0, -200, 0, 460); g.addColorStop(0, '#0b1030'); g.addColorStop(1, '#2a3060');
  ctx.fillStyle = g; ctx.fillRect(-600, -400, 2600, 900);
  for (let i = 0; i < 60; i++) blob(-300 + hash(i) * 1900, -200 + hash(i + 50) * 420, 1.8, 1.8, '#fff8d8', { lw: 0, n: 6 });
  // houses along the road
  for (const [x, w, h, col] of [[-420, 300, 260, '#e8dcc4'], [-100, 260, 220, '#efe4cf'], [180, 220, 280, '#e2d6bd'], [1180, 360, 300, '#efe4cf']]) {
    rect(x, 520 - h, w, h, col, { lw: 4, w: .6 }); rect(x - 8, 520 - h - 14, w + 16, 16, '#b8603a', { lw: 3.5, w: .4 });
    rect(x + w * .3, 520 - h * .7, 50, 60, '#2a2420', { lw: 3, w: .3 });
  }
  // Μήμης's yard wall + the door with the green LED, far right
  rect(1180, 400, 360, 120, '#efe4cf', { lw: 0 });
  rect(1300, 380, 60, 140, '#3f74a6', { lw: 3.5, w: .3 }); rect(1308, 388, 44, 132, '#141418', { lw: 2.5, w: .3 });
  // road + pavement
  poly([[-600, 520], [2000, 520], [2000, 800], [-600, 800]], '#4a484e', { lw: 0 });
  rect(-600, 520, 2600, 22, '#9a968c', { lw: 3, w: .3 });
  ctx.save(); ctx.fillStyle = '#d8d0b0'; for (let i = -8; i < 30; i++) ctx.fillRect(i * 90, 650, 50, 6); ctx.restore();
  // ΔΕΗ pole + street lamp
  limb([[640, 700], [640, 150]], 12, '#8a7458', { w: .4 });
  limb([[640, 170], [700, 150], [720, 160]], 5, '#555', { w: .3 });
  poly([[700, 160], [744, 160], [736, 176], [708, 176]], '#3a3a40', { lw: 3 });
  blob(722, 180, 12, 6, flick ? '#fff6c0' : '#555', { lw: 2 });
  curve([[-600, 180], [640, 200], [2000, 170]], 2.5); curve([[-600, 196], [640, 214], [2000, 186]], 2.5);
  trashBin(900, 690);
}
function render(t, _M, sc) {
  M = _M;
  if (t < M.card.b) { actCard(ph(t, M.card), 'ΠΡΑΞΗ 2', 'PANIK', '«Η πόλη κοιμάται»'); return; }
  const flick = !(Math.sin(t * 23) > .7 && Math.sin(t * 3.1) > 0) || inM(t, M.ritual, 1.2, 99);
  // Κώστας zig-zags in from the left and stops under the lamp
  const [kx, walking] = path(t, [[M.walkin.a, -150], [M.car.a, 380], [M.ritual.a + .2, 380], [M.ritual.a + 1.4, 600], [M.cat.a, 600], [M.L[5].b, 700], [M.turn.a + .6, 720], [M.turn.b, 980]]);
  const cam = shotCam(sc, t, { ...CAMS, kos: [kx, 330, 2.2] }, .01);
  ctx.save(); applyCam(cam);
  street(t, flick);
  // the cat on the bin
  const catGone = prog(t, M.turn.a, M.turn.a + .8);
  if (catGone < 1) cat(900 + catGone * 200, 566 + catGone * 100, 1);
  const pk = t > M.ritual.a + 3.4, hoodK = prog(t, M.ritual.a + 2.4, M.ritual.a + 3.4), shadesK = prog(t, M.ritual.a + .8, M.ritual.a + 2.2);
  const tk = talk('kostas', t) || talk('panik', t);
  const st = { t, talk: tk, legs: walking ? 'walk' : 'stand', tilt: walking ? Math.sin(t * 3) * .12 : 0, look: t > M.cat.a - .3 && t < M.turn.a ? [1, .3] : t > M.turn.a ? [1, 0] : [-.2, .2],
    L: shadesK > 0 && shadesK < 1 ? [-10, -210] : hoodK > 0 && hoodK < 1 ? [-50, -260] : [-50, -40], R: inM(t, M.pita) ? [60, -130] : [50, -60],
    itemL: 'bottle', itemR: 'souvlaki', shades: shadesK >= 1, hood: hoodK >= .6, lid: !pk, brow: pk ? 'frown' : 'flat', mouth: inM(t, M.sing) ? 'open' : pk ? 'frown' : 'smile' };
  ctx.save(); ctx.translate(kx, standY()); ctx.rotate(walking ? Math.sin(t * 2.4) * .08 : 0); person(0, 0, 1, CAST.kostas, st); ctx.restore();
  // the car that honks
  const cx = lerp(1800, -700, prog(t, M.car.a, M.car.b));
  if (inM(t, M.car)) car(cx, 720, t, { moving: 1, lights: 1, dir: -1, col: '#c0392b' });
  ctx.restore();
  applyLight('night', .9);
  ctx.save(); applyCam(cam);
  if (flick) glow(722, 190, 380, 'rgba(255,230,160,1)', .45);
  glow(1330, 440, 60, 'rgba(70,255,120,1)', .5 + .3 * Math.sin(t * 3));
  if (inM(t, M.car)) glow(cx - 180, 677, 200, 'rgba(255,250,210,1)', .5);
  ctx.restore();
  vignette(.5);
  if (inM(t, M.flash)) {                 // one-frame manga freeze: PANIK
    mangaize(1); speedLines(640, 330, 70, 180);
    sfxText('PANIK', 640, 600, 120, -.08, '#c8f04a', '#111');
  }
  if (inM(t, M.car, .5, -.8)) sfxText('ΜΠΙΙΙΠ!', 900, 480, 50, .1, '#fff');
}
return {
  id: 'scene09', title: '9 · Panik', steps, render,
  events: M => [[M.card.a + .2, SFX.gong], [M.sing.a, () => drunkSing(.02, 2)], [M.car.a + .3, SFX.engine], [M.car.a + .8, SFX.honk], [M.ritual.a + 1.4, SFX.pop], [M.ritual.a + 2.8, SFX.whoosh], [M.flash.a, () => { SFX.boom(); SFX.swell(); }], [M.turn.a, SFX.cluck]],
  ambience: () => ({ cricket: .03 }),
};
})());
