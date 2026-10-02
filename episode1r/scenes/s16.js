/* Ep.1, Scenes 16–17 – «Το κοτέτσι» + «Γιατί είναι όλα ρομπότ;» (beats 17–18): Μίμης's kamikaze plan; Κώστας wakes up. */
defineScene((() => {
const X = { mimis: 420, giannos: 560, christos: 700, giorgos: 1185, sita: 1060, kostas: 220 };
const CAMS = { wide: [640, 400, 1.05], guys: [560, 390, 1.7], mimis: [420, 350, 2.3], giannos: [560, 350, 2.3], coop: [110, 540, 1.6], chase: [400, 480, 1.1],
  sita: [1060, 540, 2.3], fig: [280, 560, 2.1], kos: [220, 400, 2.3], all: [520, 420, 1.3],
  sky: [700, 250, 1.15], raid: [650, 420, 1.06], gio: [1150, 400, 2], chr: [690, 380, 2.2], mim2: [150, 420, 1.6] };
const steps = [
  { who: 'mimis', cam: 'mimis', mark: 'plan', el: 'Έχω σχέδιο. Τα μηχανήματα κυνηγάνε παράσιτα. Εγώ είμαι το μεγαλύτερο παράσιτο. Τα τραβάω στο κοτέτσι και τα κλειδώνουμε.', en: "I've got a plan. The machines hunt parasites. I'm the biggest parasite there is. I lure them into the coop and we lock them in." },
  { who: 'giannos', cam: 'giannos', el: 'Αυτό είναι αυτοκτονία.', en: "That's suicide." },
  { who: 'mimis', cam: 'mimis', el: "Γι' αυτό δεν θα το περιμένουν.", en: "That's why they won't expect it." },
  { act: 'jump', d: 1, cam: 'wide' },
  { who: 'mimis', cam: 'chase', mark: 'come', el: 'ΕΛΑΤΕ ΕΔΩ, ΠΟΥΤΑΝΑΚΙΑ! ΓΑΜΩ ΤΟ AI ΣΑΣ!', en: 'COME HERE, YOU LITTLE BITCHES! FUCK YOUR AI!', say: 'Ελάτε εδώ, πουτανάκια! Γαμώ το έι άι σας!', gap: 0 },
  { act: 'chase', d: 3.4, cam: 'chase' },
  { act: 'lock', d: 1.4, cam: 'coop' },
  { act: 'silence', d: 1.6, cam: 'coop' },
  { act: 'chaos', d: 2.2, cam: 'coop' },
  { act: 'out', d: 3, cam: 'wide' },
  // the air force's first sortie: up, round, and down on the barricade with eggs
  { act: 'climb', d: 1.4, cam: 'sky' },
  { who: 'giannos', cam: 'guys', mark: 'down', el: 'Κάτω!', en: 'Get down!' },
  { act: 'raid', d: 3.6, cam: 'raid' },
  { who: 'giorgos', cam: 'gio', mark: 'share', el: 'Ε! Εγώ είμαι μέτοχος!', en: "Hey! I'm a shareholder!" },
  { act: 'pass2', d: 1.8, cam: 'wide' },
  { who: 'christos', cam: 'chr', mark: 'drawl', el: 'Αυτό το ζωγραφίζω.', en: "I'm drawing this." },
  { who: 'sita', cam: 'sita', el: 'Νέα μέλη! Και με δώρο… ΑΥΓΑ!', en: 'New members! And as a free gift… EGGS!', say: 'Νέα μέλη! Και με δώρο… αυγά!' },
  { who: 'mimis', cam: 'mim2', mark: 'feathers', el: 'Εντάξει. Τώρα έχουν και αεροπορία και πρωινό.', en: "Okay. Now they've got an air force and breakfast." },
  // ---- 18: Κώστας wakes up ----
  { act: 'wake', d: 3.2, cam: 'fig' },
  { who: 'kostas', cam: 'kos', el: 'Τι ώρα είναι;', en: 'What time is it?' },
  { act: 'looks', d: 2, cam: 'wide' },
  { who: 'kostas', cam: 'kos', el: 'Γιατί είναι όλα ρομπότ;', en: 'Why is everything robots?' },
  { act: 'stare', d: 1.8, cam: 'all' },
  { who: 'giannos', cam: 'giannos', el: 'Δεν θυμάσαι τίποτα;', en: "You don't remember anything?" },
  { who: 'kostas', cam: 'kos', mark: 'pockets', el: 'Θυμάμαι μια μπύρα. …Πού είναι το IQOS μου;', en: 'I remember a beer. …Where is my IQOS?' },
  { act: 'red', d: 1.2, cam: 'sita' },
  { who: 'sita', cam: 'sita', mark: 'you', el: 'ΕΣΥ.', en: 'YOU.', say: 'Εσύ.' },
  { who: 'kostas', cam: 'kos', mark: 'hi', el: 'Γεια σου. Ωραία σίτα.', en: 'Hi. Nice screen door.' },
];
let M, PREP = null;
/* the hen air force: three racket-planes with hen pilots. Before the sortie they hover with the army (rest);
   climb: up and away to the right; raid: a diving pass right→left over the barricade, dropping eggs; pass2: back in from the left to rest */
const LANE = [{ D: 0, H: 215 }, { D: .35, H: 250 }, { D: .7, H: 270 }], VX = -560, EGG_VX = -330, G = 1500;
function rest(i, t, ax) { return [ax + i * 80 + Math.sin(t * 3 + i) * 10, 360 + Math.cos(t * 4 + i) * 14 - i * 20 - (t > M.out.a ? 60 : 0)]; }
function raidAt(i, t) {
  const { D, H } = LANE[i], d = t - M.raid.a - D;
  return [1400 + VX * d, lerp(110, H, ease(clamp(d / .55))) + Math.sin(t * 5 + i) * 6];
}
/* where each plane is (null = off screen) and its tilt */
function plane(i, t) {
  if (t < M.climb.a) return null;
  if (t < M.climb.b) { const [x0, y0] = rest(i, M.climb.a, 700), k = ease(prog(t, M.climb.a + i * .12, M.climb.b)); return [lerp(x0, 1450 + i * 60, k), lerp(y0, -60 - i * 30, k * k), .45 * Math.min(1, k * 4)]; }
  if (t < M.raid.a) return null;
  if (t < M.raid.b + .4) { const [x, y] = raidAt(i, t); return x > -220 && x < 1500 ? [x, y, -.4 + .25 * clamp((t - M.raid.a - LANE[i].D) / .55)] : null; }
  if (t < M.pass2.a) return null;
  const [rx, ry] = rest(i, t, 920), e = ease(prog(t, M.pass2.a + i * .15, M.pass2.b - .3 + i * .1));
  if (e <= 0) return null;
  return [lerp(-200, rx, e), lerp(140, ry - 130, e) - Math.sin(e * Math.PI) * 60, .35 * (1 - e)];
}
/* the eggs: aimed at a spot, released from the plane so a real fall (inherited speed + gravity) lands there */
function prep() {
  const T = [[0, 600, GROUND - 122, 'table'], [0, 250, GROUND - 6, 'ground'], [1, 1178, standY() - 95, 'gio'], [1, 820, GROUND - 100, 'table'],
    [2, 440, GROUND - 72, 'table'], [2, 120, GROUND - 5, 'ground']];
  const eggs = T.map(([i, xL, yL, on], n) => {
    let y0 = LANE[i].H, tr = 0, x0 = 0, dt = 0;
    for (let it = 0; it < 6; it++) { dt = Math.sqrt(2 * Math.max(10, yL - y0) / G); x0 = xL - EGG_VX * dt; tr = M.raid.a + LANE[i].D + (x0 - 1400) / VX; y0 = raidAt(i, tr)[1] + 18; }
    return { i, n, xL, yL, on, x0, y0, tr, tL: tr + dt };
  });
  const zaps = [[0, M.raid.a + 1.25], [2, M.raid.a + 1.95]].map(([i, tz]) => { const [x, y] = raidAt(i, tz); return { i, tz, x, y, tx: x - 40, ty: GROUND - 130 }; });
  PREP = { M, eggs, zaps, shake: [...eggs.map(e => [e.tL, e.on === 'gio' ? 7 : 4, .3]), ...zaps.map(z => [z.tz, 8, .35]), [M.lock.a + .6, 6, .3]], light: zaps.map(z => [z.tz, .3]) };
}
function render(t, _M, sc) {
  M = _M;
  if (!PREP || PREP.M !== M) prep();
  const { eggs, zaps } = PREP;
  const c = fxCam(shotCam(sc, t, CAMS), t, PREP.shake);
  const [, shot] = shotAt(sc, t);
  ctx.save(); applyCamFx(c);
  yard(t, { light: 'day', winLit: 'red', winTop: 'red', noChickens: true, coopDoor: inM(t, M.chaos, 1, 99) ? 1 : t > M.lock.a + .6 ? 0 : 1, coopShake: inM(t, M.chaos) ? t : 0 });
  for (const e of eggs) if (e.on === 'ground' && t > e.tL) eggSplat(e.xL, e.yL, .8, e.n);
  const youK = t > M.you.a ? 1 : 0;
  sita({ t, chip: 1, led: 'red', mood: 'evil', burn: 1, talk: talk('sita', t), open: youK * .2, sway: Math.sin(t * 1.2) * .2 });
  iqos(1030, GROUND - 16, 1.1, 0, 'red', t);   // Κώστας's IQOS, on her side since last night
  // the army: chasing Μίμης into the coop, then bursting out with hen pilots
  const chaseK = prog(t, M.come.a, M.chase.b), inCoop = t > M.chase.b && t < M.out.a, outK = prog(t, M.out.a, M.out.b);
  if (!inCoop) {
    const ax = t < M.come.a ? 1100 : t < M.out.a ? lerp(1100, 60, chaseK) : lerp(60, 700, outK);
    hose(snakePts(ax + 40, 692, ax + 200, 640, t, 14), t, { eye: 1 });
    belt(ax + 120, 674, t, { crawl: 1, vib: 1, red: 1, dir: t < M.out.a ? -1 : 1, cord: false });
    mopBucket(ax + 260, 690, t, { spin: 1, wheels: 1, eye: 1, mop: false });
    if (t < M.climb.a) for (let i = 0; i < 3; i++) { const [rx, ry] = rest(i, t, ax); racket(rx, ry, Math.sin(t + i) * .3, t, { on: 1, s: .8, pilot: t > M.out.a }); }
    if (t > M.out.a) { chicken(ax + 260, 604, t, 7, '#b97a4a', { still: 1, noLegs: 1, goggles: 1 }); }
  }
  // Γιώργος on the σίτα's side, CEO shades on. He doesn't duck: an egg on the chest is an insult, not a threat
  const gioHit = eggs.find(e => e.on === 'gio').tL, brush = inM(t, M.pass2, 0, -.8);
  stand(X.giorgos, 'giorgos', 1, { t, talk: talk('giorgos', t), look: inM(t, M.share) ? [-.6, -.8] : t > gioHit && t < M.share.a ? [-.2, .7] : [-1, 0], shades: true,
    brow: t > gioHit && t < M.pass2.b ? 'frown' : 'flat', mouth: t > gioHit && t < M.pass2.b ? 'frown' : 'smirk',
    L: [-58, -40], R: inM(t, M.share) ? [70, -250] : brush ? [10 + Math.sin(t * 22) * 14, -100] : [58, -40] });
  if (t > gioHit) eggSplat(X.giorgos - 6, standY() - 95, .55 * (1 - .25 * prog(t, M.pass2.a, M.pass2.a + .8)), 2);
  // Μίμης: leaps the barricade, runs into the coop, out the other side, slams the door
  const [mx, mw] = path(t, [[M.jump.a, 420], [M.come.b, 300], [M.chase.a + 1.6, 100], [M.chase.b - .6, 40], [M.chase.b, 40], [M.lock.b, 40]]);
  const mOut = t > M.jump.a;
  const feathered = t > M.chaos.a + 1;
  // Γιάννος and Χρήστος duck behind the barricade for the raid (legs clipped at the ground: they're crouching behind the table)
  const dip = ease(prog(t, M.down.a + .15, M.down.a + .45)) * (1 - ease(prog(t, M.pass2.a + .3, M.pass2.a + .8))) * 175;
  for (const who of ['giannos', 'christos']) {
    const stare = inM(t, M.stare, 0, .6) || (t > M.wake.a && t < M.red.a);
    const raidLook = dip > 1 ? [.7, -.7] : inM(t, M.drawl) ? [1, -.5] : null;
    const st = { t, talk: talk(who, t), look: raidLook || (stare || t > M.wake.a ? [-1, 0] : lookAtSpeaker(t, who, X, [1, 0])), brow: stare || dip > 1 ? 'up' : 'flat',
      mouth: dip > 1 ? 'open' : 'flat', itemL: who === 'christos' ? 'sketch' : null, L: who === 'christos' ? [-30, -110] : [-44, -24],
      R: who === 'christos' ? [30 + Math.sin(t * (inM(t, M.drawl, -.5, 1) ? 34 : 20)) * 6, -100] : inM(t, M.down) ? [90, -200] : [44, -24] };
    const s = who === 'christos' ? 1.05 : 1;
    if (dip > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-2000, -2000, 5000, GROUND + 2000); ctx.clip(); person(X[who], standY(s) + dip, s, CAST[who], { legs: 'stand', ...st }); ctx.restore(); }
    else stand(X[who], who, s, st);
  }
  if (!mOut || t > M.lock.b) {
    const mxx = !mOut ? 420 : t > M.feathers.b ? 420 : 40;
    stand(mxx, 'mimis', 1, { t, talk: talk('mimis', t), look: t > M.wake.a ? [-1, 0] : inM(t, M.raid) || inM(t, M.down) ? [.7, -.6] : lookAtSpeaker(t, 'mimis', X, [1, 0]), lid: true, mouth: 'smirk', itemR: 'cup2', R: [50, -60] });
    if (feathered && t < M.wake.a + 3) for (let i = 0; i < 9; i++) blob(mxx - 50 + hash(i) * 100, standY() - 260 + hash(i + 2) * 240, 7, 3, '#f7f4ee', { lw: 1.5, rot: hash(i) * 3 });
  }
  table(t, { flipped: true });
  for (const e of eggs) if (e.on === 'table' && t > e.tL) eggSplat(e.xL, e.yL, .85, e.n);
  // every device locks on to the biggest pest: laser dots gather on his chest while he shouts
  if (inM(t, M.come, .4, 0)) for (let i = 0; i < 4; i++) { const k = ease(prog(t, M.come.a + .4 + i * .25, M.come.a + 1.4 + i * .25)); laserDot(lerp(mx + (hash(i) - .5) * 500, mx - 6 + (i % 2) * 12, k), lerp(standY() - 300 + hash(i + 4) * 200, standY() - 130 + (i >> 1) * 14, k), k, 4); }
  if (mOut && t <= M.lock.b && !(t > M.chase.a + 1.6 && t < M.chase.b - .3)) stand(mx, 'mimis', 1, { t, talk: talk('mimis', t), legs: mw ? 'walk' : 'stand', look: [-1, 0], mouth: 'open', brow: 'up', itemR: 'cup2', R: [80, -220] });
  // the coop: silence, then chaos, feathers
  if (inM(t, M.chaos)) feathers(95, 600, t, 22, ph(t, M.chaos));
  if (t > M.out.a && t < M.out.a + 1.5) feathers(95, 600, t, 14, 1 + outK);
  // Κώστας under the fig: a hen on his back, then he sits up with a fig leaf stuck to his cheek
  const sitUp = ease(prog(t, M.wake.a + .6, M.wake.a + 2.4));
  if (sitUp < 1) { ctx.save(); ctx.translate(330, GROUND); ctx.rotate(-1.5 * (1 - sitUp)); person(0, -150, 1, CAST.kostas, { t, legs: 'stand', hood: false, blink: t < M.wake.a + 1.2, mouth: 'open' }); ctx.restore(); }
  else stand(220, 'kostas', 1, { t, talk: talk('kostas', t), look: inM(t, M.looks) ? [Math.sin(t * 3), -.3] : [1, 0], brow: t > M.you.a ? 'up' : 'flat', mouth: 'smile', lid: true, R: t > M.hi.a ? [70, -130] : inM(t, M.pockets, .8, 0) ? [36 + Math.sin(t * 14) * 8, -50] : [44, -24], L: inM(t, M.pockets, .8, 0) ? [-36 - Math.sin(t * 14) * 8, -50] : [-44, -24] });
  if (sitUp >= 1) figLeaf(262, standY() - 166, -.35, .8);
  // the planes, their feathers, the zaps and the eggs in flight
  for (let i = 0; i < 3; i++) {
    const p = plane(i, t); if (!p) continue;
    const [x, y, rot] = p, fast = inM(t, M.raid) || inM(t, M.climb);
    if (fast) fxSmear(x + (inM(t, M.raid) ? 30 : -20), y - 20, inM(t, M.raid) ? -160 : 120, inM(t, M.raid) ? 0 : -60, 26);
    racket(x, y, rot, t, { on: 1, s: inM(t, M.raid) ? 1.05 : .8, pilot: 1 });
  }
  for (let i = 0; i < 3; i++) fxEmit(t, M.raid.a + LANE[i].D + .2, M.raid.b, .16, ts => raidAt(i, ts)[0], ts => raidAt(i, ts)[1] - 10, { kind: 'feather', n: 2, speed: 80, grav: 300, life: 2.2, seed: i * 11 });
  for (const z of zaps) if (t > z.tz && t < z.tz + .2) { fxArc(z.x, z.y - 20, z.tx, z.ty, t, { seed: z.i }); }
  for (const z of zaps) fxBurst(t, z.tz, z.tx, z.ty, { kind: 'spark', n: 26, speed: 520, grav: 1200, life: .6, spread: 2.6 });
  for (const e of eggs) {
    if (t > e.tr && t < e.tL) { const d = t - e.tr; egg(e.x0 + EGG_VX * d, e.y0 + .5 * G * d * d, d * 6, 1.35); }
    fxBurst(t, e.tL, e.xL, e.yL - 6, { kind: 'drop', n: 12, speed: 320, grav: 1400, life: .55, spread: 2.4, col: '#ffb81c', seed: e.n });
    fxBurst(t, e.tL, e.xL, e.yL - 6, { kind: 'debris', n: 7, speed: 260, grav: 1500, life: .6, spread: 2.6, cols: ['#f6efe0'], size: .5, seed: e.n + 20 });
  }
  ctx.restore();
  ctx.save(); applyCamFx(c); sitaGlow({ t, led: 'red', glowR: youK ? 260 : 120 }, .45 + youK * .3); ctx.restore();
  fxFlash(fxHitLight(t, PREP.light));
  if (shot === 'wide' || shot === 'raid') fxForeground(t, 'left', { blur: 8 });
  if (shot === 'wide' || shot === 'sky') fxRays(1180, -40, t, .12);
  fxLetterbox(inM(t, M.raid) ? Math.min(1, prog(t, M.raid.a, M.raid.a + .3)) * (1 - prog(t, M.raid.b - .3, M.raid.b)) : 0);
  if (inM(t, M.lock, .6, 1)) sfxText('ΚΛΑΚ!', 300, 200, 80, -.1, '#fff');
  if (inM(t, M.chaos)) { sfxText('ΚΟ-ΚΟ-ΚΟ!', 360, 160, 70, -.15, '#ffd23f'); sfxText('ΒΡΡΡ! ΤΣΑΚ!', 900, 560, 60, .12, '#fff'); }
  if (inM(t, M.raid, 1, -1.6)) sfxText('ΠΛΑΤΣ!', 560, 150, 70, -.1, '#ffd23f');
  if (inM(t, M.raid, 1.9, -.9)) sfxText('ΤΖΖΖ!', 860, 170, 60, .12, '#9ad8ff');
}
return {
  id: 'scene16', title: '16 · Το κοτέτσι', steps, render, fadeIn: false,
  events: _M => { M = _M; prep(); return [[M.come.a, SFX.whoosh], [M.chase.a, () => { SFX.buzz(3); SFX.rev(); }], [M.chase.a + 1, SFX.zap], [M.lock.a + .6, SFX.slam], [M.chaos.a, () => { SFX.cluck(); SFX.zap(); SFX.crash(); }], [M.chaos.a + .6, SFX.cluck], [M.chaos.a + 1.2, SFX.rev],
    [M.out.a, () => { SFX.fanfare(); SFX.cluck(); }], [M.climb.a, () => { fxScore(6, 150, .8); FXS.whoosh(); }], [M.down.a, () => FXS.riser(1.2)],
    ...[0, 1, 2].map(i => [M.raid.a + LANE[i].D + 1.3, FXS.whoosh]), [M.raid.a + .2, SFX.cluck],
    ...PREP.eggs.map(e => [e.tL, () => { FXS.thud(); noise(.18, .3, 2200, 1.2, 'bandpass'); }]),
    [M.raid.a + 1.25, FXS.zap], [M.raid.a + 1.95, FXS.zap], [M.pass2.a + .3, () => { FXS.whoosh(); SFX.cluck(); }], [M.wake.a + .3, SFX.snore], [M.red.a, () => tone(70, 1.2, 'sawtooth', .08, .8)], [M.you.a, SFX.boom]]; },
  ambience: () => ({ hum: .03, cicada: .02 }),
};
})());
