/* Ep.1, Scene 9 – «Panik» (script beat 9): Κώστας walks home drunk, becomes Panik and kicks a bin over for no reason. Opens Act 2. */
defineScene((() => {
const CAMS = { card: [640, 360, 1], street: [640, 380, 1], kos: [0, 330, 2.2], pole: [640, 330, 1.9], poleC: [640, 300, 2.8], bin: [790, 470, 1.7], two: [800, 440, 1.6], kick: [850, 500, 1.5], house: [1100, 420, 1.5] };
const steps = [
  { act: 'card', d: 3.4, cam: 'card' },
  { act: 'walkin', d: 1.5, cam: 'street' },
  { who: 'kostas', cam: 'street', mark: 'sing', el: "«…κι αν μ' αγαπάς, κι αν σ' αγαπώωω…»", en: '"…and if you love me, and if I love youuu…"' },
  { who: 'kostas', cam: 'kos', mark: 'pita', el: 'Πού πήγε η πίτα σου, ρε φίλε; Σε παράτησε κι εσένα;', en: 'Where did your pita go, man? Did she leave you too?' },
  { act: 'car', d: 2.4, cam: 'street' },
  { who: 'kostas', cam: 'kos', mark: 'shout', el: 'ΝΑΙ ΡΕ! ΚΡΑΤΗΣΑ ΤΙΣ ΠΙΝΑΚΙΔΕΣ! ΘΑ ΤΟ ΣΠΑΣΩ!', en: 'YEAH, MAN! I KEPT THE PLATES! I\'LL SMASH IT!' },
  { act: 'ritual', d: 4.6, cam: 'pole' },
  { act: 'flash', d: .45, cam: 'poleC' },
  { who: 'panik', cam: 'poleC', el: 'Η πόλη κοιμάται.', en: 'The city sleeps.' },
  { who: 'panik', cam: 'poleC', el: 'Εγώ όχι.', en: 'I do not.', gap: .9 },
  { act: 'stare', d: 1.8, cam: 'bin' },
  { who: 'panik', cam: 'two', mark: 'dare', el: 'Κι εσύ τι κοιτάς; Είσαι στειρωμένος; ΔΕΝ ΝΟΜΙΖΩ.', en: 'And what are YOU looking at? Are you neutered? I DON\'T THINK SO.' },
  { act: 'kick', d: 2.2, cam: 'kick' },
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
  // Μίμης's yard wall + the door with the green LED, far right
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
}
// the municipal bin: kicked over for no reason at all (tips to the right, lid flies, rubbish spills)
function kickedBin(t) {
  const hit = M.kick.a + .55, tip = ease(prog(t, hit, hit + .5)), fly = prog(t, hit, hit + 1.1);
  ctx.save(); ctx.translate(950, 690); ctx.rotate(tip * 1.45 + (t > hit && t < hit + .15 ? Math.sin(t * 90) * .04 : 0)); ctx.translate(-50, 0);
  poly([[-44, 0], [44, 0], [50, -110], [-50, -110]], '#3a7a4a', { lw: 4, w: .5 });
  txt('ΔΗΜΟΣ ΚΟΡΙΝΘΙΩΝ', 0, -60, 9, '#e8f0e8', { font: TVFONT, weight: 900 });
  if (!fly) rect(-56, -124, 112, 16, '#2e6a3c', { lw: 3.5, w: .4 });
  ctx.restore();
  if (fly > 0) {                        // the lid spins off and clatters down the road
    const lx = 900 + fly * 360, ly = 566 - Math.sin(Math.min(fly, .6) / .6 * Math.PI) * 170 + Math.max(0, fly - .6) / .4 * 124;
    ctx.save(); ctx.translate(lx, ly); ctx.rotate(fly * 9); rect(-56, -8, 112, 16, '#2e6a3c', { lw: 3.5, w: .4 }); ctx.restore();
  }
  const sp = ease(prog(t, hit + .35, hit + 1));
  if (sp > 0) for (let i = 0; i < 9; i++) {  // rubbish
    const x = 1010 + sp * (30 + hash(i) * 190), y = 690 - hash(i + 9) * 18;
    i % 3 ? blob(x, y, 10 + hash(i + 3) * 10, 7 + hash(i + 4) * 5, ['#e8e0cc', '#c9a46a', '#8a9a70'][i % 3], { lw: 2.5 })
          : rect(x - 7, y - 16, 14, 18, '#c0392b', { lw: 2.5, w: .3 });
  }
}
function render(t, _M, sc) {
  M = _M;
  if (t < M.card.b) { actCard(ph(t, M.card), 'ΠΡΑΞΗ 2', 'PANIK', '«Η πόλη κοιμάται»'); return; }
  const flick = !(Math.sin(t * 23) > .7 && Math.sin(t * 3.1) > 0) || inM(t, M.ritual, 1.2, 99);
  // Κώστας zig-zags in from the left and stops under the lamp
  const [kx, walking] = path(t, [[M.walkin.a, -150], [M.car.a, 380], [M.ritual.a + .2, 380], [M.ritual.a + 1.4, 600], [M.stare.a + .4, 600], [M.stare.b, 760], [M.kick.b, 760], [M.turn.a + .4, 780], [M.turn.b, 1180]]);
  const cam = shotCam(sc, t, { ...CAMS, kos: [kx, 330, 2.2] }, .01);
  ctx.save(); applyCam(cam);
  street(t, flick);
  kickedBin(t);
  const pk = t > M.ritual.a + 3.4, hoodK = prog(t, M.ritual.a + 2.4, M.ritual.a + 3.4), shadesK = prog(t, M.ritual.a + .8, M.ritual.a + 2.2);
  const tk = talk('kostas', t) || talk('panik', t);
  const st = { t, talk: tk, legs: walking ? 'walk' : 'stand', tilt: walking ? Math.sin(t * 3) * .12 : 0, look: t > M.stare.a && t < M.turn.a ? [1, .25] : t > M.turn.a ? [1, 0] : inM(t, M.shout) ? [-1, 0] : [-.2, .2],
    kick: bump(t, M.kick.a + .25, M.kick.a + .85),
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
  if (inM(t, M.kick, .55, -.8)) sfxText('ΜΠΑΜ!', 800, 380, 70, -.12, '#ffd23f');
}
return {
  id: 'scene09', title: '9 · Panik', steps, render,
  events: M => [[M.card.a + .2, SFX.gong], [M.sing.a, () => drunkSing(.02, 2)], [M.car.a + .3, SFX.engine], [M.car.a + .8, SFX.honk], [M.ritual.a + 1.4, SFX.pop], [M.ritual.a + 2.8, SFX.whoosh], [M.flash.a, () => { SFX.boom(); SFX.swell(); }], [M.kick.a + .55, () => { SFX.slam(); SFX.crash(); }], [M.kick.a + 1.4, SFX.clacks]],
  ambience: () => ({ cricket: .03 }),
};
})());
