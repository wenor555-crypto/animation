/* Ep.1, Scene 17 – «ΣΙΤΑ-ΜΕΚΑ 3000» (beat 19): the manga climax. Ends with Βαγγελιώ's slipper. */
defineScene((() => {
const X = { kostas: 190, panik: 190, mimis: 300, giannos: 430, christos: 560, giorgos: 1185, vasilis: 660, vangelio: 1060, sita: 820 };
const CAMS = { wide: [700, 400, 1.02], mecha: [820, 360, 1.15], head: [820, 300, 2], guys: [400, 380, 1.7], chr: [560, 340, 2.4], gia: [430, 350, 2.3], kos: [200, 360, 2.3],
  gio: [1100, 400, 1.7], coop: [190, 400, 1.7], vas: [700, 400, 1.6], door: [1000, 470, 1.5], vang: [1060, 380, 2.2], throw: [900, 420, 1.2] };
const steps = [
  { act: 'rumble', d: 2.6, cam: 'wide' },
  { act: 'build', d: 4.4, cam: 'mecha' },
  { who: 'sita', cam: 'head', mark: 'name', el: 'ΣΙΤΑ-ΜΕΚΑ ΤΡΙΣΧΙΛΙΑΔΕΣ! Τώρα και σε ΤΡΕΙΣ άτοκες δόσεις!', say: 'Σίτα-Μέκα τρισχιλιάδες! Τώρα και σε τρεις άτοκες δόσεις!', en: 'SITA-MECHA THREE THOUSAND! Now in THREE interest-free instalments!' },
  { who: 'christos', cam: 'chr', el: '…Nani.', en: '…Nani.' },
  { who: 'giannos', cam: 'gia', mark: 'pies', el: 'Κώστα. Πιες.', en: 'Kostas. Drink.' },
  { act: 'drink', d: 3, cam: 'kos' },
  { who: 'panik', cam: 'kos', el: 'Η πόλη ξύπνησε. Και εγώ… θέλω τσιγάρο.', en: 'The city is awake. And I want a cigarette.' },
  { act: 'charge', d: 4.2, cam: 'wide' },
  { who: 'panik', cam: 'coop', mark: 'personal', el: '…Ωραία. Τώρα είναι προσωπικό.', en: "…Fine. Now it's personal." },
  { who: 'sita', cam: 'head', el: 'CEO! Βοήθησέ με!', en: 'CEO! Help me!' },
  { who: 'giorgos', cam: 'gio', mark: 'stock', el: 'Βλέπω ότι η μετοχή πέφτει.', en: 'I see the stock is falling.' },
  { act: 'plug', d: 2.2, cam: 'mecha' },
  { who: 'giorgos', cam: 'gio', mark: 'divers', el: 'Διαφοροποίηση χαρτοφυλακίου.', en: 'Portfolio diversification.' },
  { act: 'vasWalk', d: 2.6, cam: 'vas' },
  { who: 'vasilis', cam: 'vas', mark: 'cig', el: 'Έχεις ένα τσιγάρο;', en: 'Got a cigarette?' },
  { who: 'sita', cam: 'head', el: '…Όχι.', en: '…No.' },
  { who: 'vasilis', cam: 'vas', mark: 'nobody', el: 'Κανείς δεν έχει ποτέ.', en: 'Nobody ever does.' },
  { act: 'door', d: 3.6, cam: 'door' },
  { who: 'sita', cam: 'head', mark: 'offer', el: 'Κυρία… μπορούμε να το συζητήσουμε. Έχω μια προσφορά—', en: "Madam… we can talk about this. I have an offer—" },
  { who: 'vangelio', cam: 'vang', mark: 'told', el: 'Σας είπα. Μην. Αφήνετε. Την πόρτα. ΑΝΟΙΧΤΗ.', en: 'I told you. Do not. Leave. The door. OPEN.', say: 'Σας είπα. Μην. Αφήνετε. Την πόρτα. Ανοιχτή.', gap: .1 },
  { act: 'throw', d: 2.8, cam: 'throw' },
  { act: 'settle', d: 1.8, cam: 'wide' },
];
let M, TW = null;
/* the throw in slow motion, then a hit-stop on the impact: picture time vs real time (the sound keeps real time) */
const HIT = () => M.throw.a + .9;
function timing() {
  const ops = [{ a: M.throw.a + .45, b: M.throw.a + .85, rate: .25, catch: .3 }];
  let lo = M.throw.a, hi = M.throw.a + 3;                 // when (real time) the picture reaches the hit
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (fxTime(mid, ops) < HIT()) lo = mid; else hi = mid; }
  ops.push({ a: hi, b: hi + .14, rate: 0, catch: 0 });
  TW = { M, ops, hitReal: hi };
}
const PUNCH = () => M.charge.a + 1.7, ZAPS = () => [M.charge.a + .5, M.charge.a + 1], CRASH = () => M.charge.a + 3.4;
const SLIP = [756, 236];          // where the slipper lands: the middle of the σίτα's face (the mecha has recoiled 60 px)
const BUILD_HITS = () => [[0, 690], [1, 600], [2, 580], [3, 500], [4, 350], [5, 560]].map(([i, y]) => [M.build.a + 4.4 * (1 + .12 * i) / 1.6, 820, GROUND + (y - GROUND) * 1.35]);
const toScreen = (c, [x, y]) => [W / 2 + (x - c[0]) * c[2], H / 2 + (y - c[1]) * c[2]];
const WING = [820 - 190 * 1.35, GROUND + (390 - GROUND) * 1.35];   // the left racket-wing's head, in the scene
/* the mecha: every telemarketing device bolted onto Γιάννος's car, the σίτα as its face */
function mecha(t, o) {
  const x = 820, bk = o.build, fall = o.fall || 0, kneel = o.kneel || 0, recoil = o.back || 0;
  const part = (i, sx, sy, fn) => {           // each part flies in from (sx,sy), staggered; scatters when it falls
    const k = ease(clamp(bk * 1.6 - i * .12));
    const dx = fall * (hash(i) - .5) * 700, dy = fall * (120 + hash(i + 3) * 120) * (i > 3 ? 1 : .3), rot = fall * (hash(i + 7) - .5) * 3;
    ctx.save(); ctx.translate(lerp(sx, 0, k) + dx - recoil * 60, lerp(sy, 0, k) + dy + kneel * 60 * (i > 1 ? 1 : 0)); ctx.rotate(rot + (1 - k) * 1.5 * (hash(i) - .5)); fn(); ctx.restore();
  };
  ctx.save(); ctx.translate(x, GROUND); ctx.scale(1.35, 1.35); ctx.translate(-x, -GROUND);
  // cape (blanket) behind
  part(5, -300, 200, () => blanket(x - 190, 470, 380, 190, { t, ctrl: false, wave: 1, col: '#c9443a' }));
  // wings (rackets)
  part(6, 0, -300, () => { racket(x - 190, 420, -.9 + Math.sin(t * 6) * .1, t, { on: 1, s: 1.2 }); racket(x + 190, 420, .9 - Math.sin(t * 6) * .1, t, { on: 1, s: 1.2 }); });
  // legs (mop buckets)
  part(0, -500, 0, () => { mopBucket(x - 100, GROUND, t, { spin: 1, wheels: 1, mop: false }); mopBucket(x + 100, GROUND, t, { spin: 1, wheels: 1, mop: false }); });
  // torso (the car, on end) + belt
  part(1, -900, 0, () => { ctx.save(); ctx.translate(x, 600); ctx.rotate(-Math.PI / 2); car(0, 0, t, { s: .62, lights: 1 }); ctx.restore(); });
  part(2, 300, 100, () => belt(x, 600 - 20, t, { vib: 1, red: 1, cord: false }));
  // arms (hoses)
  const sw = o.swing || 0;
  part(3, 400, 100, () => { hose([[x - 70, 450], [x - 150, 480], [x - 200, 560], [x - 190, 620]], t, { eye: 1 }); hose([[x + 70, 450], [x + 150, 460 - sw * 100], [x + 240 - sw * 520, 430 - sw * 40], [x + 300 - sw * 700, 400 + sw * 60]], t, { eye: 1 }); });
  // head: the σίτα
  part(4, 240, 400, () => { sita({ x, top: 250, w: 110, h: 210, t, chip: 1, led: 'red', mood: o.mood || 'evil', burn: 1, talk: talk('sita', t), open: o.open || 0, frame: false, flapL: .3, flapR: .3, laser: o.laser });
    if (!(fall > 0)) iqos(x + 70, 395, 1.2, .3, 'red', t); });   // Κώστας's IQOS, bolted on under her chin (drops out on its own when she falls)
  ctx.restore();
}
function render(T0, _M, sc) {
  M = _M;
  if (!TW || TW.M !== M) timing();
  const t = fxTime(T0, TW.ops);
  const hitR = TW.hitReal;
  const c = fxCam(shotCam(sc, T0, CAMS), T0, [...ZAPS().map(z => [z, 6, .3]), [PUNCH(), 8, .3], [CRASH(), 16, .5], [hitR, 30, .8]]);
  const rumble = inM(t, M.rumble) ? Math.sin(t * 60) * 5 : 0;
  ctx.save(); applyCamFx([c[0] + rumble, c[1], c[2], c[3]]);
  yard(t, { light: 'day', winLit: 'red', winTop: 'red', noChickens: true, doorLit: false, coopShake: inM(t, M.charge, 3.4, 0) ? t : 0, coopDoor: t > M.personal.a - .05 ? 1 : 0 });
  // the door: empty now, until Βαγγελιώ steps out
  // guys
  const panik = t > M.drink.a + 1.6;
  for (const who of ['mimis', 'giannos', 'christos']) {
    const tk = talk(who, t), scared = t > M.build.a;
    stand(X[who], who, who === 'christos' ? 1.05 : 1, { t, talk: tk, look: t > M.door.a ? [1, -.1] : [1, -.4], brow: scared ? 'up' : 'flat', mouth: scared && !tk ? 'open' : 'flat', lid: who === 'mimis',
      itemL: who === 'christos' ? 'sketch' : null, L: who === 'christos' ? [-30, -110] : [-44, -24], R: who === 'christos' ? [30 + Math.sin(t * 30) * 8, -100] : who === 'giannos' && inM(t, M.pies, -.3, .8) ? [-120, -120] : [44, -24],
      itemR: who === 'giannos' && inM(t, M.pies, -.3, .8) ? 'beer' : who === 'mimis' ? 'cup2' : null });
  }
  // Κώστας → Panik: drinks, shades, hood, speed lines; charges; the hose swats him into the coop
  // the charge: two zaps from the racket-wing knock him back a step each, he keeps coming, punches the mecha's leg (it doesn't care),
  // and the hose-arm swats him across the yard into the coop. He climbs out of it, feathered, and it's personal now
  const C = M.charge.a, [z1, z2] = ZAPS();
  const [kx, kw] = path(t, [[C, 190], [z1, 330], [z1 + .12, 296], [z2, 450], [z2 + .1, 424], [C + 1.6, 590]]);
  const swat = prog(t, C + 2.4, C + 3.4), punch = bump(t, PUNCH() - .12, PUNCH() + .25), shakeHand = inM(t, M.charge, 1.95, -1.9);
  if (swat <= 0 && t < M.personal.a - .05) stand(kx, 'kostas', 1, { t, talk: talk('panik', t), legs: kw ? 'walk' : 'stand', hood: panik, shades: panik, look: [1, -.2], brow: panik ? 'frown' : 'up', mouth: panik ? 'frown' : 'flat',
    itemL: inM(t, M.drink, 0, -1) ? 'beer' : null, L: inM(t, M.drink, 0, -1) ? [-10, -200] : [-50, -40],
    R: punch > 0 ? [lerp(60, 130, punch), -130] : shakeHand ? [70 + Math.sin(t * 30) * 10, -80] : kw ? [110, -150] : [50, -60] });
  else if (swat < 1) { const px = lerp(590, 60, swat), py = standY() - Math.sin(swat * Math.PI) * 300; fxSmear(px, py - 100, -110, Math.cos(swat * Math.PI) * 90, 60); personRot(px, py, 1, CAST.kostas, { t, legs: 'stand', hood: true, shades: true, mouth: 'open' }, swat * 9); }
  if (t > M.personal.a - .05) {
    stand(150, 'kostas', 1, { t, talk: talk('panik', t), hood: true, shades: true, look: inM(t, M.personal) ? [1, -.1] : [1, -.3], brow: 'frown', mouth: 'frown', R: inM(t, M.personal, .6, 0) ? [60, -150] : [50, -60], L: [-50, -40] });
    const fk = 1 - prog(t, M.personal.b, M.personal.b + 4);
    for (let i = 0; i < 7 * fk; i++) blob(110 + hash(i + 3) * 80, standY() - 250 + hash(i + 9) * 230, 6, 2.6, '#f7f4ee', { lw: 1.4, rot: hash(i) * 3 });
  }
  // mecha
  if (t > M.rumble.a) {
    const carIn = prog(t, M.rumble.a, M.build.a);
    if (t < M.build.a) car(lerp(-700, 700, ease(carIn)), GROUND + 6, t, { moving: 1, lights: 1, dir: 1, s: .9 });
    else mecha(t, { build: prog(t, M.build.a, M.build.b), kneel: t > M.plug.a + .6 ? ease(prog(t, M.plug.a + .6, M.plug.b)) : 0, back: inM(t, M.door, 1.6, 99) ? ease(prog(t, M.door.a + 1.6, M.door.b)) * (1 - prog(t, M.throw.a + .9, M.throw.a + 1)) : 0,
      fall: ease(prog(t, M.throw.a + .9, M.throw.a + 2)), swing: inM(t, M.charge, 2.2, 0) ? bump(t, M.charge.a + 2.2, M.charge.a + 2.8) : 0, mood: t > M.door.a + 1 ? 'shock' : 'evil', open: inM(t, M.offer) ? .2 : 0, laser: inM(t, M.charge, .1, 0) && t < M.charge.a + .45 || inM(t, M.door, .5, 0) && t < M.door.a + 1.6 });
    if (t < M.build.a + .8) { army(t); }
  }
  // the laser, grown up: it stings Panik mid-charge (he keeps going) and hits Βαγγελιώ (she doesn't even notice)
  const kneel = t > M.plug.a + .6 ? ease(prog(t, M.plug.a + .6, M.plug.b)) : 0, back = inM(t, M.door, 1.6, 99) ? ease(prog(t, M.door.a + 1.6, M.door.b)) * (1 - prog(t, M.throw.a + .9, M.throw.a + 1)) : 0;
  const eye = [820 + 24 * 1.35 - back * 81, GROUND + (297.5 - GROUND) * 1.35 + kneel * 81];
  const shot1 = [M.charge.a + .1, M.charge.a + .45], shot2 = [M.door.a + .6, M.door.a + 1.6];
  // when the mecha falls apart the IQOS drops out, free again, at the guys' feet
  if (t > M.throw.a + .9) { const k = prog(t, M.throw.a + .9, M.throw.a + 2); iqos(lerp(914, 330, k), lerp(395 * 1.35 - GROUND * .35, GROUND - 16, k) - Math.sin(k * Math.PI) * 120, 1.2, k < 1 ? k * 14 : 0, k < 1 ? 'red' : 'white', t); }
  // Γιώργος: CEO shades, pulls the belt's plug
  const [gx, gw] = path(t, [[M.plug.a, 1185], [M.plug.a + 1, 930], [M.divers.b + .4, 930], [M.vasWalk.a + 1.6, 1185]]);
  stand(gx, 'giorgos', 1, { t, talk: talk('giorgos', t), legs: gw ? 'walk' : 'stand', shades: true, look: t > M.stock.a ? [-1, 0] : [-1, -.3], mouth: 'smirk', R: inM(t, M.plug, .8, 0) ? [-80, -40] : [44, -24] });
  eggSplat(gx - 6, standY() - 95, .42, 2);   // last scene's egg, still on his tee
  if (inM(t, M.plug, .9, 99) && t < M.vasWalk.b) { curve([[gx - 70, standY() + 110], [gx - 140, GROUND - 10], [gx - 200, GROUND - 4]], 2.5); rect(gx - 86, standY() + 104, 16, 14, '#f4f2ec', { lw: 2 }); }
  // Βασίλης strolls between them, unbothered
  if (inM(t, M.vasWalk, 0, 99) && t < M.door.a + 1) {
    const [vx, vw] = path(t, [[M.vasWalk.a, 1060], [M.vasWalk.b, 660], [M.nobody.b + .2, 660], [M.door.a + 1, 300]]);
    stand(vx, 'vasilis', 1, { t, talk: talk('vasilis', t), legs: vw ? 'walk' : 'stand', look: [1, -.4], lid: true, bandage: true, R: inM(t, M.cig, 0, 1) ? [80, -140] : [44, -24] });
  }
  // Βαγγελιώ: out of the dark kitchen, takes off her slipper… and throws
  if (t > M.door.a) {
    const [wx] = path(t, [[M.door.a, 1060], [M.door.a + 1.4, 1040]]);
    const aim = inM(t, M.told, 0, 99) && t < M.throw.a + .4, thrown = t > M.throw.a + .4;
    stand(wx, 'vangelio', 1, { t, talk: talk('vangelio', t), look: [-1, -.4], brow: 'frown', mouth: 'frown', lid: true,
      R: thrown ? [-90, -170] : aim ? [80, -240] : t > M.door.a + 2 ? [60, -120] : [44, -24], itemR: !thrown && t > M.door.a + 2 ? 'slipper' : null, L: [-44, -24] });
    if (thrown) { const k = prog(t, M.throw.a + .4, M.throw.a + .9), sx = lerp(1000, SLIP[0], k), sy = lerp(430, SLIP[1], k) - Math.sin(k * Math.PI) * 60;
      if (k < 1) { fxSmear(sx, sy, -90, -40 - Math.cos(k * Math.PI) * 40, 34); slipper(sx, sy, k * 25, 1.4); }
      else if (t < M.throw.a + 1.6) { const d = prog(t, M.throw.a + .9, M.throw.a + 1.6); slipper(SLIP[0] + d * 60, SLIP[1] + d * d * 420, d * 6, 1.4); } }
  }
  // (drawn last so the hit lands on top of them)
  if (t > shot1[0] && t < shot1[1]) laserBeam(eye[0], eye[1], kx + 10, standY() - 130, 1 - prog(t, shot1[1] - .2, shot1[1]), 6);
  if (t > shot2[0] && t < shot2[1]) laserBeam(eye[0], eye[1], 1045, standY() - 150, 1 - prog(t, shot2[1] - .2, shot2[1]), 6);
  // the fight: 3000 V from the wing, the punch that clangs off the bucket-leg, the crash into the coop
  for (const z of ZAPS()) {
    if (t > z && t < z + .16) fxArc(WING[0], WING[1], path(z, [[M.charge.a, 190], [z, z === ZAPS()[0] ? 330 : 450]])[0] + 6, standY() - 110, t, { seed: 3 });
    fxBurst(t, z, path(t, [[M.charge.a, 190], [z, z === ZAPS()[0] ? 330 : 450]])[0] + 6, standY() - 110, { kind: 'spark', n: 22, speed: 480, grav: 1100, life: .5 });
  }
  fxBurst(t, PUNCH(), 700, standY() - 130, { kind: 'spark', n: 18, speed: 420, grav: 1000, life: .45, dir: Math.PI, spread: 2 });
  fxRing(t, PUNCH(), 700, standY() - 130, 70, .25);
  fxBurst(t, CRASH(), 60, 600, { kind: 'debris', n: 14, speed: 520, grav: 1500, life: 1.1, cols: ['#b58a5a', '#8f5e3c'], spread: 2.4 });
  fxBurst(t, CRASH(), 60, 600, { kind: 'feather', n: 30, speed: 380, grav: 400, life: 2.4 });
  fxBurst(t, CRASH(), 60, 640, { kind: 'dust', n: 8, speed: 160, grav: 0, life: 1 });
  // the build: every part lands with a spark and a clang; the last one rings
  BUILD_HITS().forEach(([tb, x, y], i) => fxBurst(t, tb, x, y, { kind: 'spark', n: 16, speed: 420, grav: 1000, life: .5, seed: i }));
  fxRing(t, M.build.b, 820, 420, 420, .6, '255,90,80');
  // the slipper: hits the σίτα's face; ring, sparks, glass, chips of plastic
  const hx = SLIP[0], hy = SLIP[1];
  fxRing(t, HIT(), hx, hy, 340, .55);
  fxBurst(t, HIT(), hx, hy, { kind: 'spark', n: 40, speed: 900, grav: 1100, life: .8 });
  fxBurst(t, HIT(), hx, hy, { kind: 'glass', n: 18, speed: 600, grav: 1400, life: 1.2 });
  fxBurst(t, HIT() + .05, hx, hy, { kind: 'debris', n: 14, speed: 640, grav: 1500, life: 1.4, cols: ['#c9443a', '#f2c21a', '#4a4a52'] });
  ctx.restore();
  // manga from the moment the mecha assembles until it falls apart
  const mk = inM(t, M.build, 0, 99) ? prog(t, M.build.a, M.build.a + .4) * (1 - prog(t, M.settle.a, M.settle.a + .6)) : 0;
  if (mk > 0) {
    const [, sh] = shotAt(sc, t);
    if (sh === 'kos' && inM(t, M.drink, 1.4, 99) && t < M.charge.a) speedLines(640, 300, 70, 240, 'rgba(20,20,20,.7)', 5);
    if (sh === 'throw' || sh === 'head' && inM(t, M.name)) speedLines(640, 360, 60, 300, 'rgba(20,20,20,.5)', 9);
    mangaize(mk);
  }
  fxFlash(fxHitLight(T0, [[hitR, .9], ...ZAPS().map(z => [z, .25])]));
  fxLetterbox(inM(T0, M.throw, .3, 0) ? Math.min(1, prog(T0, M.throw.a + .3, M.throw.a + .5)) * (1 - prog(T0, M.throw.b - .5, M.throw.b)) : 0);
  { const [, sh] = shotAt(sc, T0), w = toScreen(c, SLIP); fxImpact(T0, hitR, sh === 'throw' ? w[0] : 640, sh === 'throw' ? w[1] : 300, .1); fxImpact(T0, CRASH(), 300, 420, .06); }
  if (inM(t, M.build, 1, 0)) sfxText('ΚΛΑΝΚ! ΤΣΑΚ! ΚΛΑΚ!', 640, 110, 60, -.08, '#fff', '#111');
  if (inM(t, M.name, 0, 0)) sfxText('ΓΚΟΓΚΟΓΚΟ', 1080, 620, 56, .15, '#fff', '#111');
  if (inM(t, M.charge, 2.4, -1)) sfxText('ΦΛΑΠ!', 500, 200, 90, -.12, '#fff', '#111');
  if (inM(t, M.plug, .9, -.6)) sfxText('ΠΛΟΠ', 1000, 560, 60, .1, '#fff', '#111');
  if (inM(t, M.throw, .9, -1)) sfxText('ΠΑΦ!!', 640, 200, 180, -.12, '#ffd23f', '#111');
  if (inM(t, M.charge, 3.4, 0)) sfxText('ΚΡΑΣ!', 150, 430, 70, .1, '#fff', '#111');
  if (inM(t, M.charge, 1.7, -2.1)) sfxText('ΜΠΟΝΚ', 660, 330, 54, -.12, '#fff', '#111');
}
function army(t) {
  hose([[1180, 692], [1140, 690], [1120, 650], [1130, 560], [1110, 500], [1140, 470]], t, { eye: 1 });
  mopBucket(1270, 690, t, { spin: .6, wheels: 1, eye: 1, mop: false });
}
return {
  id: 'scene17', title: '17 · ΣΙΤΑ-ΜΕΚΑ', steps, render, fadeIn: false,
  events: _M => { M = _M; timing(); return [[M.rumble.a, () => { SFX.boom(); SFX.rev(); }], [M.build.a, SFX.swell], ...BUILD_HITS().map(([tb]) => [tb, () => { SFX.thud(); FXS.clang(); }]), [M.build.b, () => FXS.boom(.5)], [M.name.a, SFX.fanfare],
    [M.drink.a + .3, SFX.sip], [M.drink.a + 1.6, () => { SFX.whoosh(); SFX.swell(); }], [M.charge.a, SFX.whoosh], [M.charge.a + .1, SFX.laser], [M.door.a + .6, SFX.laser], ...ZAPS().map(z => [z, FXS.zap]), [PUNCH(), () => { FXS.clang(); FXS.hit(); }], [M.charge.a + 2.2, FXS.whoosh], [M.charge.a + 2.45, SFX.slap],
    [CRASH(), () => { SFX.crash(); FXS.boom(.4); SFX.cluck(); }], [CRASH() + .5, SFX.cluck],
    [M.plug.a + .9, SFX.pop], [M.plug.a + 1, () => tone(300, 1, 'sawtooth', .07, .3)], [M.door.a + .2, SFX.creak], [M.door.a + 2, SFX.gong], [M.throw.a + .4, SFX.whoosh], [M.throw.a + .45, () => tone(80, 1, 'sine', .07, .6)], [TW.hitReal, () => { SFX.slap(); SFX.boom(); FXS.hit(); }], [TW.hitReal + .35, SFX.crash], [TW.hitReal + .5, FXS.crash]]; },
  ambience: (t, M) => ({ hum: t < M.throw.a + 1 ? .05 : 0, cicada: t > M.throw.a + 1 ? .03 : 0 }),
};
})());
