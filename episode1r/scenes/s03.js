/* Ep.1, Scene 3 – «Κλείνει μόνη της» (script beat 3): Βασίλης reads the box, installs the σίτα. */
defineScene((() => {
const X = { giannos: 460, mimis: 640, giorgos: 820, vasilis: 960 };
const CAMS = {
  wide: [640, 360, 1], three: [640, 430, 1.35], giannos: [460, 370, 2.1], mimis: [640, 370, 2.1], giorgos: [820, 370, 2.1],
  vasilis: [960, 380, 1.9], vclose: [960, 330, 2.8], door: [1030, 520, 1.9], velcro: [1010, 470, 3.4], thumb: [995, 480, 4.6], two: [760, 420, 1.3],
  box: [962, 418, 3.6], light: [985, 318, 3.4],
};
const steps = [
  // insert: the box itself, open, with the little bag of spare parts tucked in at the side (Ep. 2 needs it)
  { act: 'boxins', d: 2.2, cam: 'box' },
  { who: 'vasilis', cam: 'vasilis', el: '«Έξυπνη σίτα! Εύκολη τοποθέτηση χωρίς ειδικό! Εννιά ζευγάρια ισχυροί μαγνήτες! Είκοσι πινέζες! Δώδεκα αυτοκόλλητα βέλκρο!»', en: '"Smart screen door! Easy installation, no technician! Nine pairs of powerful magnets! Twenty pins! Twelve adhesive velcro strips!"' },
  { who: 'giannos', cam: 'giannos', el: 'Και ποιο είναι το έξυπνο;', en: "And what's smart about it?" },
  { who: 'vasilis', cam: 'vasilis', el: 'Κλείνει μόνη της.', en: 'It closes by itself.' },
  { who: 'giannos', cam: 'giannos', el: 'Κι η πόρτα του ψυγείου κλείνει μόνη της. Δεν τη λέμε έξυπνη.', en: "The fridge door closes by itself too. We don't call it smart." },
  { who: 'vasilis', cam: 'vclose', el: 'Γιατί δεν την είδες στην τηλεόραση.', en: "Because you didn't see it on TV." },
  { act: 'speechless', d: 2.2, cam: 'giannos' },
  { act: 'm1', d: 1.9, cam: 'velcro' },       // velcro, crooked
  { act: 'm2', d: 1.9, cam: 'velcro' },       // velcro stuck to his finger
  { act: 'm3', d: 1.6, cam: 'thumb' },        // pin into the thumb
  { who: 'vasilis', cam: 'thumb', el: 'Άου.', en: 'Ow.', gap: .5 },
  { act: 'looks', d: 1.2, cam: 'vclose' },
  { who: 'vasilis', cam: 'vclose', el: 'Δημητράκι. Έχεις ένα τσιγάρο;', en: 'Dimitraki. Got a cigarette?' },
  { act: 'throw', d: 3.4, cam: 'two' },
  { act: 'light', d: 1.6, cam: 'light' },     // the lighter, close: first drag, a happy cloud
  { who: 'vasilis', cam: 'door', el: 'Άντε. Πολιτισμός.', en: 'There we go. Civilization.', gap: .2 },
  { act: 'through', d: 3.2, cam: 'door' },
];
let M;
function vasilisState(t) {
  // position: by the table → at the door for the install → through the door
  let [x, walking] = path(t, [[0, 960], [M.m1.a - .01, 960], [M.m1.a, 905], [M.through.a + .4, 905], [M.through.a + 2.2, 1062]]);
  const inside = t > M.through.a + 1.4;
  const reading = t < M.L[0].b;
  let L = [-60, -110], R = [60, -110], item = null, box = reading || t < M.speechless.b;
  if (t >= M.m1.a) { box = false; L = [-40, -30]; R = t < M.m3.b ? [128, -56] : [44, -24]; }
  if (t >= M.L[4].b && t < M.throw.a + 1.2 && t > M.m3.b) R = [40, -150];
  if (t >= M.throw.a + 1.2) { R = inM(t, M.light) ? [56, -168] : [30, -160]; item = 'cig'; }
  if (inside) walking = true;
  return { x, walking, L, R, item, box, inside };
}
function drawVasilis(t) {
  const v = vasilisState(t), hips = standY(1);
  if (v.inside && t > M.through.a + 2.6) return;
  person(v.x, hips, 1, CAST.vasilis, {
    t, talk: talk('vasilis', t), legs: v.walking ? 'walk' : 'stand', L: v.L, R: v.R, itemR: v.item, bandage: t > M.m3.b,
    look: t < M.L[0].b ? [0, .9] : t >= M.m1.a && t < M.m3.b + .5 ? [.8, -.6] : t > M.looks.a && t < M.throw.a ? [-.9, .2] : [-.5, .2],
    lid: t > M.L[4].a, mouth: t > M.throw.a + 1.4 ? 'smile' : 'flat', dir: 1,
  });
  if (v.box) {
    if (t < M.speechless.b) sparePartsBag(v.x + 44, hips - 172, .16, 1.2);   // tucked in beside the folded screen, sticking out on the right
    sitaBox(v.x, hips - 110, 1, { open: t < M.L[0].b ? .55 : 0 });
  }
  // the lighter and the first drag
  if (inM(t, M.light)) {
    const k = prog(t, M.light.a, M.light.a + .5);
    if (t < M.light.a + .9) fxFire(v.x + 52, hips - 172, .22, t, Math.min(1, k * 3) * (1 - prog(t, M.light.a + .7, M.light.a + .9)));
    fxBurst(t, M.light.a + .95, v.x + 70, hips - 196, { kind: 'smoke', n: 6, speed: 60, grav: 300, life: 1.4, size: .28, alpha: .35, dir: -1.2, spread: .8 });
  }
  // smoke puff after "Πολιτισμός"
  if (t > M.L[7].a && t < M.through.a + 1) for (let i = 0; i < 4; i++) { const p = prog(t, M.L[7].a + i * .1, M.L[7].a + 1.6 + i * .1); if (p > 0 && p < 1) blob(v.x + 30 + p * 80, hips - 190 - p * 60, 10 + p * 40, 8 + p * 30, `rgba(225,225,225,${.6 * (1 - p)})`, { lw: 0 }); }
}
function drawSitaInstall(t) {
  if (t < M.m1.a) return;
  // m1/m2: only a velcro strip; m3: left panel crooked; after the throw both panels hang and CLAK together
  if (t < M.m3.a) {
    ctx.save(); ctx.translate(1030, 488); ctx.rotate(t < M.m2.a ? .25 : 0);
    rect(-30, -5, 60, 10, '#f4f2ea', { lw: 2.5, w: .3 }); ctx.restore();
    return;
  }
  const hung = prog(t, M.throw.a + 1.8, M.throw.a + 2.2);
  const closeK = ease(prog(t, M.throw.a + 2.2, M.throw.a + 2.5));
  const passing = t > M.through.a + .6 && t < M.through.a + 2.4;
  const open = passing ? 0 : (1 - closeK) * hung * .4, pass = passing ? bump(t, M.through.a + .6, M.through.a + 2.4) : 0;
  ctx.save(); ctx.translate(1060, 482); ctx.rotate(.03); ctx.translate(-1060, -482);
  sita({ t, open, pass, part: hung > 0 ? null : 'L', sway: t > M.through.b - .8 ? Math.sin(t * 6) * .4 : 0 });
  ctx.restore();
}
function drawHands(t) {           // extreme close-ups for the install montage
  if (t < M.m1.a || t > M.m3.b + 1.8) return;
  const k = t < M.m2.a ? prog(t, M.m1.a, M.m1.a + .8) : 1;
  if (t < M.m2.a) {
    limb([[957, 424], [1000, 440], [lerp(990, 1026, k), 492]], 12, CAST.vasilis.skin); ctx.save(); ctx.translate(lerp(990, 1026, k), 488); ctx.rotate(.25); rect(-24, -5, 48, 10, '#f4f2ea', { lw: 2.5, w: .3 }); ctx.restore();
  } else if (t < M.m3.a) {
    const pull = prog(t, M.m2.a + .4, M.m2.a + 1.4);
    limb([[957, 424], [995, 450], [1010 - pull * 30, 494 + pull * 16]], 12, CAST.vasilis.skin);
    ctx.save(); ctx.translate(1010 - pull * 30, 494 + pull * 20); ctx.rotate(-.5); rect(-18, -4, 36, 8, '#f4f2ea', { lw: 2.5, w: .3 }); ctx.restore();
  } else {
    // thumb + pin
    const push = ease(prog(t, M.m3.a + .3, M.m3.a + .9));
    limb([[957, 424], [975, 460], [985, 478]], 14, CAST.vasilis.skin);
    blob(990, 474, 10, 7, CAST.vasilis.skin, { lw: 3 });
    ctx.save(); ctx.translate(1000 - push * 8, 464 + push * 6); ctx.rotate(.7);
    blob(0, 0, 7, 7, '#e8392b', { lw: 2 }); curve([[0, 0], [-12, 0]], 2, '#9a9a9a'); ctx.restore();
    if (t > M.m3.a + .9) blob(988, 478, 3, 3, '#c0202a', { lw: 0 });
  }
}
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, {});
  if (vasilisState(t).inside) drawVasilis(t);
  drawSitaInstall(t);
  const throwK = prog(t, M.throw.a + .2, M.throw.a + 1);
  const S = {
    giannos: { t, talk: talk('giannos', t), look: lookAtSpeaker(t, 'giannos', X, [1, 0]), itemR: 'cig', R: [48, -30],
      mouth: inM(t, M.speechless, .4, -.6) ? 'open' : 'flat', brow: inM(t, M.speechless) ? 'up' : 'flat' },
    mimis: { t, talk: talk('mimis', t), look: [0, .1], lid: true, mouth: 'smirk', itemR: 'cup', itemL: 'cig',
      R: [44, -20], L: throwK > 0 && throwK < 1 ? lerp2([-40, -26], [120, -140], bump(t, M.throw.a + .2, M.throw.a + 1)) : [-40, -26] },
    giorgos: { t, talk: talk('giorgos', t), look: lookAtSpeaker(t, 'giorgos', X, [1, -.2]), mouth: 'smirk' },
  };
  tableScene(t, S);
  // the cigarette pack flying from Μίμης to Βασίλης
  if (throwK > 0 && throwK < 1) { const x = lerp(600, 990, throwK), y = lerp(460, 380, throwK) - Math.sin(throwK * Math.PI) * 120; ctx.save(); ctx.translate(x, y); ctx.rotate(throwK * 9); rect(-17, -10, 34, 20, '#e8e4dc', { lw: 2.5 }); rect(-17, -10, 34, 7, '#c0392b', { lw: 0 }); ctx.restore(); }
  if (!vasilisState(t).inside) drawVasilis(t);
  drawHands(t);
  // the mosquito that sneaks in with him
  if (t > M.through.a) { const p = prog(t, M.through.a + .3, M.through.a + 2.2); mosquito(lerp(1180, 1062, p), lerp(420, 560, p), 1.6, t); }
  for (let i = 0; i < 8; i++) mosquito(640 + Math.sin(t * (1.1 + i * .13) + i) * 380, 330 + Math.cos(t * (1.7 + i * .1) + i * 2) * 110, .9, t);
  ctx.restore();
  const [, sh] = shotAt(sc, t);
  dayGrade(t);
  if (sh === 'two') { fxRays(1200, -60, t, .1); fxForeground(t, 'left', { blur: 9 }); }
  if (sh === 'giannos' || sh === 'vasilis' || sh === 'vclose') fxForeground(t, sh === 'giannos' ? 'left' : 'right', { blur: 12 });
  if (t > M.throw.a + 2.2 && t < M.throw.a + 2.7) sfxText('ΚΛΑΚ!', 900, 200, 60);
  if (t > M.through.a + 2.3 && t < M.through.a + 2.8) sfxText('ΚΛΑΚ!', 900, 200, 60);
}
return {
  id: 'scene03', title: '3 · Κλείνει μόνη της', steps, render, fadeIn: false, fadeOut: false, start: .2,
  events: M => [[M.m1.a + .5, SFX.creak], [M.m2.a + .8, SFX.pop], [M.m3.a + .85, SFX.pop], [M.throw.a + .3, SFX.whoosh], [M.throw.a + 1.1, SFX.slap],
    [M.throw.a + 1.3, () => tone(2200, .15, 'square', .03)], [M.light.a + .1, () => { noise(.12, .3, 3000, 2, 'bandpass'); tone(2600, .08, 'square', .02); }], [M.light.a + .3, () => noise(.6, .12, 600, .8, 'lowpass')],
    [M.boxins.a + .2, () => noise(.4, .15, 1500, 1, 'bandpass')], [M.throw.a + 2.2, SFX.clack], [M.through.a + .8, SFX.door], [M.through.a + 2.3, SFX.clack]],
  ambience: () => ({ cicada: .03, mosq: .004 }),
};
})());
