/* Ep.4, Scene 16 – «Η μάχη» (Act 3 climax, graphics v2): Κώστας's street, night. No manga: raw, wide, ugly.
   1 The plan: Μίμης left, Γιάννος from above (for two seconds). The tray bounces the eye laser back; Μίμης's fig-wood arrow in
     the knee. «Κράτα!»
   2 Escalation: «Γειτονιά. Ενεργοποίηση.» Every house empties its smart appliances: vacuums in waves, drones, red bulbs,
     mosquito rackets. Hundreds. The cheap suit fails because there was no money: the blower chokes, he falls; the helmet
     phone freezes on an ad. «Μπορείς να την παραλείψεις σε πέντε δευτερόλεπτα.»
   3 The turn that isn't: Panik comes out with the third glass: «Η πόλη ξύπν—». The T-800 takes the glass and throws it.
     Μίμης charges with the tray: «ΓΙΑ ΤΟΝ ΚΩΣΤΑ!»; a toaster hand throws him onto a car (alarm). The T-800 goes into the
     kitchen: bottles, glass, the shaker on the floor. «Εξολόθρευση… ολοκληρώθηκε.» It leaves, the vacuums follow like dogs.
     Κώστας, sober again, on the doorstep: bitters from Thessaloniki. «Τουλάχιστον δεν μας είδε κανείς.» Above: the drone, REC. */
defineScene((() => {
const GY = 640, RS = .7, PS = .55, PY = GY - 150 * PS, CAR = 40, DOOR = 1080;
const AG = ['AGENT (κράνος)', 'AGENT (helmet)'];
const CAMS = { wide: [640, 380, 1], plan: [420, 440, 1.5], gia: [440, 430, 2.2], mim: [300, 470, 2.2], bot: [820, 330, 1.6], swarm: [640, 350, .95], fall: [560, 480, 1.7],
  lying: [520, 560, 2.2], door: [1000, 440, 1.8], pan: [980, 430, 2.4], punch: [640, 450, 1.6], car: [160, 480, 1.9], house: [960, 400, 1.3], step: [1050, 480, 2.2], up: [760, 200, 1.4] };
const steps = [
  { act: 'open', d: 2.4, cam: 'wide' },
  { who: 'giannos', cam: 'plan', mark: 'plan', el: 'Μίμη, εσύ αριστερά. Εγώ από πάνω.', en: "Mimis, you go left. I'll take the top." },
  { who: 'mimis', cam: 'mim', el: 'Εσύ πετάς;', en: 'You fly?' },
  { who: 'giannos', cam: 'gia', mark: 'two', el: 'Για δύο δευτερόλεπτα.', en: 'For two seconds.' },
  { act: 'fly', d: 5.4, cam: 'wide' },
  { who: 'mimis', cam: 'mim', mark: 'hold', el: 'Κράτα!', en: 'Hold on!' },
  { who: 'sita', label: T8, fx: 'phone', cam: 'bot', mark: 'summon', el: 'Γειτονιά. Ενεργοποίηση.', en: 'Neighbourhood. Activate.' },
  { act: 'swarm', d: 7.5, cam: 'swarm' },
  { who: 'mimis', cam: 'mim', el: 'Πόσες σκούπες έχει αυτό το χωριό;', en: 'How many vacuums does this village have?' },
  { who: 'giannos', cam: 'gia', mark: 'dad', el: 'Όλες τις αγόρασε ο πατέρας σου.', en: 'Your dad bought all of them.' },
  { act: 'choke', d: 2.8, cam: 'fall' },
  { who: 'agent', label: AG, cam: 'lying', mark: 'ad', el: 'Ο φυσητήρας τελείωσε. Το κράνος δείχνει διαφήμιση.', en: 'The blower is out. The helmet is showing an ad.' },
  { who: 'giannos', cam: 'lying', el: 'Κλείσ\' την!', en: 'Turn it off!' },
  { who: 'agent', label: AG, cam: 'lying', mark: 'skip', el: 'Μπορείς να την παραλείψεις σε πέντε δευτερόλεπτα.', en: 'You can skip it in five seconds.' },
  { act: 'door', d: 2.2, cam: 'door' },
  { who: 'panik', cam: 'pan', mark: 'wake', el: 'Η πόλη ξύπν—', en: 'The city wak—', say: 'Η πόλη ξύπ—' },
  { act: 'glass', d: 2, cam: 'door' },
  { who: 'panik', cam: 'pan', mark: 'mine', el: '…Το ποτήρι μου.', en: '…My glass.' },
  { act: 'charge', d: 1.8, cam: 'punch' },
  { who: 'mimis', cam: 'punch', mark: 'kostas', el: 'ΓΙΑ ΤΟΝ ΚΩΣΤΑ!', en: 'FOR KOSTAS!', say: 'Για τον Κώστα!', gap: .05 },
  { act: 'throw', d: 1.8, cam: 'punch' },
  { who: 'mimis', cam: 'car', mark: 'leg', el: '…Το πόδι μου.', en: '…My leg.' },
  { act: 'kitchen', d: 4.2, cam: 'house' },
  { who: 'sita', label: T8, fx: 'phone', cam: 'house', mark: 'done', el: 'Εξολόθρευση… ολοκληρώθηκε.', en: 'Extermination… complete.' },
  { act: 'away', d: 5, cam: 'wide' },
  { who: 'kostas', cam: 'step', mark: 'bitters', el: 'Είχα φέρει bitters από τη Θεσσαλονίκη.', en: 'I brought bitters from Thessaloniki.', say: 'Είχα φέρει μπίτερς από τη Θεσσαλονίκη.' },
  { who: 'giannos', label: ['ΓΙΑΝΝΟΣ (ξαπλωμένος)', 'GIANNOS (lying down)'], cam: 'lying', mark: 'nobody', el: 'Τουλάχιστον δεν μας είδε κανείς.', en: 'At least nobody saw us.' },
  { act: 'rec', d: 2.6, cam: 'up' },
];
const sm = (a, b, t) => ease(clamp((t - a) / (b - a)));
const SUMMON = { ...T800.P.scan, rSh: [-2.7, 0, .35], rElb: [-.25, 0, 0], head: [-.12, .3, 0] };
let M, SW = null, CH = null;

/* ---------- the T-800 ---------- */
function robotX(t) {
  if (t < M.wake.a) return 820;
  if (t < M.charge.a) return lerp(820, 900, sm(M.wake.a, M.glass.a + .3, t));
  if (t < M.kitchen.a) return 900;
  if (t < M.done.a) return lerp(900, DOOR, sm(M.kitchen.a, M.kitchen.a + 1.4, t));
  return lerp(DOOR, 1750, sm(M.away.a + .3, M.away.b + 4, t));
}
function robot(t) {
  const P = T800.P, x = robotX(t), v = (robotX(t + .05) - robotX(t - .05)) / .1;
  let pose = P.guard, yaw = -.6, rOpen = 0;
  if (t < M.fly.a) pose = P.idle;
  else if (t < M.summon.a) {
    const k = t - M.fly.a;
    pose = R3.blend(P.guard, P.hit, sm(2.2, 2.4, k) * (1 - sm(3, 3.6, k)));
    pose = R3.blend(pose, P.crouch, .28 * sm(4.4, 4.55, k) * (1 - sm(5, 5.6, k)));
  } else if (t < M.door.a) pose = R3.blend(SUMMON, P.guard, sm(M.swarm.a + 1, M.swarm.a + 1.6, t));
  else if (t < M.charge.a) { yaw = lerp(-.6, .7, sm(M.wake.a, M.wake.a + .5, t)); pose = R3.blend(P.guard, P.punch, .6 * sm(M.glass.a, M.glass.a + .3, t) * (1 - sm(M.glass.a + 1.2, M.glass.a + 1.6, t))); }
  else if (t < M.kitchen.a) {
    yaw = lerp(.7, -.6, sm(M.charge.a, M.charge.a + .5, t));
    const k = t - M.throw.a;
    pose = R3.blend(P.guard, P.hit, .35 * sm(-.5, 0, k) * (1 - sm(.12, .16, k)));
    pose = R3.blend(pose, P.punch, sm(.12, .3, k) * (1 - sm(.9, 1.5, k)));
    rOpen = sm(-.6, -.2, k) * (1 - sm(.3, .38, k));
  } else { yaw = Math.PI / 2; pose = P.idle; }
  if (Math.abs(v) > 2) pose = T800.walk(x / (T800.WALK_SPEED * RS), clamp(Math.abs(v) / 60));
  if (t > M.kitchen.a && t < M.done.a && Math.abs(v) <= 2) yaw = Math.PI / 2;
  const base = { x, y: 0, s: RS, pitch: .1, yaw, t, pose: T800.open(pose, 0, rOpen) };
  return { ...base, y: GY - R3.lowestY(T800, base), ground: GY, hidden: t > M.kitchen.a + 1.5 && t < M.done.a - .3 };
}
/* ---------- the people ---------- */
const STAND = { v2: { feet: [[-30, 146], [34, 146]], lean: .06 }, L: [-30, -10], R: [56, -30] };
const LYING = { v2: { feet: [[-14, 146], [30, 140]], lean: .05 }, L: [-70, -170], R: [90, -60] };
const GX = 560;
function giannos(t) {
  let x = 420, h = 0, pose = STAND, fall = 0, blower = 0, look = [.8, -.2];
  if (t > M.fly.a && t < M.choke.a + 1) {
    const k = t - M.fly.a, u = sm(0, 1.6, k);
    x = lerp(420, GX, u) - 34 * sm(2.1, 2.25, k) * (1 - sm(2.4, 3.2, k));
    h = 210 * u + Math.sin(t * 5) * 8 * u;
    blower = u;
    pose = { ...POSE2.jump(.5), R: [70, -110], L: [-70, -60] };
    if (t > M.choke.a) {
      const q = t - M.choke.a;
      h = (210 + (q < .8 ? Math.sin(q * 40) * 12 : 0)) * (1 - sm(.8, 1.5, q) ** 2);
      blower = q < .8 ? .5 + .5 * Math.sin(q * 50) : 0;
      if (q > .8) { pose = { ...POSE2.fallBack(Math.min(1, (q - .8) * 2)), R: [90, -170], L: [-110, -150] }; fall = -1.5 * sm(1.2, 1.6, q); }
      if (q > 1.5) pose = LYING;
    }
  } else if (t >= M.choke.a + 1) { x = GX; pose = LYING; fall = -1.5; look = [0, -1]; }
  if (t > M.swarm.a && t < M.choke.a) { look = [.4, -.6]; pose = { ...pose, R: [80 + 50 * Math.sin(t * 6), -90 - 40 * Math.cos(t * 6)] }; }
  return { x, Y: PY - h, s: PS, pose, fall, blower, look, h, broken: sm(M.choke.a + 1.3, M.choke.a + 1.8, t), ad: t > M.choke.a + 1.5 };
}
function mimis(t) {
  let x = 300, pose = STAND, pull = 0, fly = null, slump = 0, run = 0;
  if (t > M.fly.a + 2.6 && t < M.charge.a) {
    pose = POSE2.aim();
    const ph = t < M.summon.a ? t - M.fly.a - 2.6 : ((t - M.swarm.a) % 2.4 + 2.4) % 2.4;
    pull = t < M.summon.a ? sm(0, 1, ph) * (ph < 1.4 ? 1 : 0) : sm(.6, 1.6, ph) * (ph < 1.8 ? 1 : 0);
  }
  if (t >= M.charge.a && t < M.throw.a) { run = sm(M.charge.a, M.throw.a, t); x = lerp(300, 690, run); pose = { ...POSE2.run((t - M.charge.a) * 13), R: [80, -100], L: [40, -70] }; }
  else if (t >= M.throw.a && t < M.throw.a + 1.1) { fly = sm(M.throw.a + .3, M.throw.a + 1.1, t); }
  else if (t >= M.throw.a + 1.1) slump = 1;
  return { x, Y: PY, s: PS, pose, pull, fly, slump, run };
}
function panik(t) {
  if (t < M.door.a + .4) return null;
  const out = sm(M.door.a + .4, M.door.b, t), sober = t > M.away.a + 1.5;
  return { x: lerp(DOOR, 980, out), glass: t < M.glass.a + .5, sober, sit: t > M.away.a + 1.5 };
}
const arrows = () => { const L = [[M.fly.a + 4.0, 'knee', .4]]; for (let i = 0; i < 4; i++) L.push([M.swarm.a + 1.6 + i * 2.4, [520 + i * 170, 170 + hash(i * 3) * 160], .45]); return L; };
function bowHand(t) { const m = mimis(t); return L2S([150, -142], m.x, m.Y, m.s, 1, m.pose.v2); }
/* ---------- swarms ---------- */
function swarms() {
  if (SW) return SW;
  const s = M.swarm.a, home = M.away.a, gone = (t, p, i) => { const k = sm(home + hash(i) * 1.5, home + 3 + hash(i) * 2, t); return [lerp(p[0], 1800 + hash(i * 7) * 300, k), lerp(p[1], p[1] - 60 * k, k)]; };
  return SW = {
    vac: ARMY.swarm({ seed: 21, n: 150, kind: 'vac', t0: s, spread: 3, from: i => [i % 2 ? -160 - hash(i) * 260 : 1440 + hash(i) * 260, GY], to: (i, t) => gone(t, [300 + hash(i * 3) * 760, GY], i), dur: 3.4, size: [18, 50], band: [585, 705], wob: 10, killAt: i => i % 6 === 0 ? s + 4 + hash(i) * 8 : null }),
    bulb: ARMY.swarm({ seed: 22, n: 28, kind: 'bulb', t0: s + .8, spread: 2, from: i => [500 + hash(i * 3) * 700, -60], to: (i, t) => gone(t, [260 + hash(i * 9) * 900, 70 + hash(i * 4) * 200], i), dur: 2.2, size: [12, 22], hover: true, wob: 14, bulbK: (i, t) => .35 + .15 * Math.sin(t * 7 + i) }),
    drone: ARMY.swarm({ seed: 23, n: 110, kind: 'drone', t0: s + .4, spread: 2.4, from: i => [1450 + hash(i * 5) * 260, 60 + hash(i * 7) * 300], to: (i, t) => gone(t, [280 + hash(i * 11) * 900, 120 + hash(i * 13) * 330], i), dur: 2.8, size: [18, 52], hover: true, wob: 22, killAt: i => i % 5 === 0 ? s + 3.5 + hash(i * 2) * 9 : null }),
    racket: ARMY.swarm({ seed: 24, n: 30, kind: 'racket', t0: s + 1.2, spread: 2, from: i => [1400, 250 + hash(i) * 220], to: (i, t) => gone(t, [380 + hash(i * 17) * 380, 230 + hash(i * 19) * 200], i), dur: 2.4, size: [22, 42], hover: true, wob: 30, spin: 3, killAt: i => i % 4 === 0 ? s + 5 + hash(i * 5) * 7 : null }),
    follow: ARMY.swarm({ seed: 25, n: 36, kind: 'vac', t0: home, spread: .8, from: i => [DOOR, GY], to: (i, t) => [robotX(t - .5 - hash(i) * .8) - 90 - hash(i * 3) * 240, GY], dur: .9, size: [20, 40], band: [610, 690], wob: 6 }),
  };
}
const ZAPS = [[2.6, 3], [4.4, 8], [5.4, 21], [6.6, 33]];
const BLASTS = () => [[M.swarm.a + 3.0, 680, GY, .8], [M.swarm.a + 5.8, 980, GY - 10, 1.2]];
function choreo() {
  if (CH) return CH;
  return CH = FX2.choreo([{ t: M.fly.a + 2.2, kind: 'big', zoom: .1, stop: .1 }, { t: M.fly.a + 4.4, kind: 'hit' }, { t: M.summon.b, kind: 'tap' },
    { t: M.swarm.a + 3.0, kind: 'hit' }, { t: M.swarm.a + 5.8, kind: 'big', zoom: .1, stop: .1 }, { t: M.choke.a + 1.5, kind: 'hit' },
    { t: M.glass.a + 1.1, kind: 'tap' }, { t: M.throw.a + .3, kind: 'big', zoom: .15, stop: .14 }, { t: M.throw.a + 1.1, kind: 'hit' }]);
}
/* ---------- drawing ---------- */
function drawPerson(p, cast, t, back, front) {
  const v2 = p.pose.v2, go = () => {
    if (back) inBody(p.x, p.Y, p.s, 1, v2, back);
    person(p.x, p.Y, p.s, CAST[cast], { t, talk: talk(cast, t), legs: 'stand', look: p.look || [.8, -.1], brow: 'down', mouth: 'flat', ...p.pose, noShadow: p.h > 4 });
    if (front) inBody(p.x, p.Y, p.s, 1, v2, front);
  };
  if (p.fall) { ctx.save(); const gx = p.x, gy = p.Y + 150 * p.s; ctx.translate(gx, gy); ctx.rotate(p.fall); ctx.translate(-gx, -gy); go(); ctx.restore(); } else go();
  if (p.h > 4) { ctx.save(); ctx.globalAlpha = .2 * clamp(1 - p.h / 400); ctx.fillStyle = '#140f18'; ctx.beginPath(); ctx.ellipse(p.x, GY + 4, 40, 7, 0, 0, TAU); ctx.fill(); ctx.restore(); }
}
function drawMimis(m, t) {
  if (m.fly != null) {
    const k = m.fly, x = lerp(690, CAR + 150, k), y = lerp(PY, PY - 20, k) - Math.sin(k * Math.PI) * 200;
    ctx.save(); ctx.translate(x, y + 40 * PS); ctx.rotate(-k * TAU); ctx.translate(-x, -(y + 40 * PS));
    person(x, y, PS, CAST.mimis, { t, legs: 'stand', ...POSE2.fallBack(1), look: [-.5, -.5], mouth: 'o', noShadow: true }); ctx.restore(); return;
  }
  if (m.slump) { person(CAR + 150, PY, PS, CAST.mimis, { t, talk: talk('mimis', t), legs: 'stand', v2: { feet: [[70, 146], [118, 146]], lean: -.3, lift: -70 }, L: [-70, 20], R: [96, 60], look: [.3, .5], brow: 'down', mouth: 'o' }); return; }
  drawPerson(m, 'mimis', t, null, () => {
    if (m.run) { blob(80, -100, 34, 40, '#c8ccd2', { lw: 3.5 }); blob(80, -100, 22, 27, '#b0b4ba', { lw: 1.5 }); return; }
    if (m.pose === STAND) return;
    bowDraw(150, -142, 1, m.pull); if (m.pull > .05) arrow(150 - m.pull * 30 + 30, -142, 0, .8);
  });
}
function drawPanik(p, t, o) {
  const s = PS, Y = PY - 70 * s * 0;
  if (p.sit) {   // on the doorstep, sober, hood down
    person(p.x + 60, PY + 20, s, CAST.kostas, { t, talk: talk('kostas', t), legs: 'stand', v2: { feet: [[60, 146], [100, 146]], lean: .1, lift: -70 }, look: [-.3, .4], brow: 'flat', mouth: 'flat', L: [20, 30], R: [70, 20] });
    return;
  }
  const grab = t > M.glass.a + .3;
  person(p.x, Y, s, CAST.kostas, { t, talk: talk('panik', t), legs: 'stand', dir: -1, hood: true, shades: true, brow: 'frown', mouth: inM(t, M.mine) ? 'o' : 'frown', look: [-.8, -.3],
    R: grab ? [50, -120] : [60, -100], itemR: p.glass && !grab ? 'sour' : null, L: [-40, -30] });
}
function arrowsDraw(t, o) {
  for (const [t0, target, fl] of arrows()) {
    const k = (t - t0) / fl; if (k < 0) continue;
    const from = bowHand(t0), to = target === 'knee' ? R3.point(T800, robot(t0 + fl), 'lKnee', [0, 0, 30]) : target;
    const a = Math.atan2(to[1] - from[1], to[0] - from[0]);
    if (k <= 1) arrow(lerp(from[0], to[0], k), lerp(from[1], to[1], k) - Math.sin(k * Math.PI) * 30, a, .8);
    else if (target === 'knee' && !o.hidden) { const kp = R3.point(T800, o, 'lKnee', [0, 0, 30]); arrow(kp[0] - Math.cos(a) * 28, kp[1] - Math.sin(a) * 28, a, .8); }
  }
}
function houseFront(t) {   // Κώστας's front door on the pavement (the kitchen light spills out when it's open)
  rect(DOOR - 160, 300, 320, 240, '#e8dcc4', { lw: 4 }); rect(DOOR - 170, 286, 340, 18, '#b8603a', { lw: 3.5 });
  const open = t > M.door.a + .2 && t < M.away.b + 99 ? 1 : 0;
  rect(DOOR - 50, 380, 100, 160, open ? '#ffd890' : '#5a3a26', { lw: 4 });
  if (open) { rect(DOOR - 50, 380, 18, 160, '#5a3a26', { lw: 3 }); }
  rect(DOOR + 70, 360, 60, 60, '#2a2420', { lw: 3 });
}
function render(t0, _M, sc) {
  M = _M;
  const C2 = choreo(), t = C2.time(t0), base = shotCam(sc, t0, CAMS, .006), cam = C2.cam(t0, base), S = swarms();
  const o = robot(t), g = giannos(t), m = mimis(t), p = panik(t), W2S = q => [(q[0] - cam[0]) * cam[2] + 640, (q[1] - cam[1]) * cam[2] + 360];
  const eye = R3.point(T800, o, 'head', [0, 30, 33]), eyeOn = o.hidden ? 0 : clamp((eye[2] - R3.point(T800, o, 'head', [0, 30, 0])[2]) / 20);
  const world = fn => () => { ctx.save(); applyCamFx(cam); fn(); ctx.restore(); };
  const blasts = BLASTS(), beams = [];
  const gc = () => L2S([14, -70], g.x, g.Y, g.s, 1, g.pose.v2);
  if (t > M.fly.a + 1.6 && t < M.fly.a + 2.6) { beams.push([eye[0], eye[1], ...gc(), 1]); if (t > M.fly.a + 2.1) beams.push([...gc(), ...R3.point(T800, o, 'chest', [0, 64, 50]), 1.2]); }
  for (const [z, i] of ZAPS) { const a = M.swarm.a + z; if (t > a && t < a + .35 && t < M.choke.a) { const st = ARMY.state(S.drone, S.drone.units[i], t); if (st && !st.dead) beams.push([st.x, st.y, ...gc(), .45]); } }
  const lights = [{ x: 722, y: 180, r: 380, col: 'rgba(255,214,150,1)', k: .9, spill: 'rgba(255,200,120,.08)' }];
  if (eyeOn) lights.push({ x: eye[0], y: eye[1], r: 240, col: 'rgba(255,110,90,1)', k: .5 * eyeOn });
  for (const b of beams) lights.push({ x: b[2], y: b[3], r: 260 * b[4], col: 'rgba(255,120,90,1)', k: .9 });
  for (const b of blasts) { const l = FX2.explosionLight(t, ...b); if (l) lights.push(l); }
  if (g.blower > .1) { const n = L2S([-72, 46], g.x, g.Y, g.s, 1, g.pose.v2, g.fall); lights.push({ x: n[0], y: n[1], r: 160, col: 'rgba(255,190,120,1)', k: .5 * g.blower }); }
  if (t > M.door.a + .2) lights.push({ x: DOOR, y: 470, r: 260, col: 'rgba(255,210,140,1)', k: .7 });
  const alarm = t > M.throw.a + 1.1 && Math.floor(t * 3) % 2 === 0;
  if (alarm) lights.push({ x: CAR - 140, y: GY - 50, r: 200, col: 'rgba(255,170,60,1)', k: .7 });
  RV2.frame(t, {
    layers: [
      { name: 'bg', draw: world(() => ctx.drawImage(streetImg(), -400, -300, 2400, 1200)) },
      { name: 'mid', draw: world(() => { houseFront(t); parkedCar(CAR, GY, t, { dent: t > M.throw.a + 1.1, rock: t > M.throw.a + 1.1 && t < M.throw.a + 1.35 ? 1 - (t - M.throw.a - 1.1) / .25 : 0 }); }) },
      { name: 'act', draw: world(() => {
        if (t >= M.swarm.a) { ARMY.draw(S.bulb, t); ARMY.draw(S.vac, t); ARMY.draw(S.follow, t); }
        for (const b of blasts) FX2.explosionBody(t, ...b, { ground: GY, smoke: .8 });
        if (t > M.glass.a + 1.1) shards(820, GY + 10, 14, 5, 80);   // the thrown glass
        if (!o.hidden) R3.draw(T800, o);
        if (t > M.glass.a + .3 && t < M.glass.a + 1.1) { const hp = R3.point(T800, o, 'rWr', [0, -40, 0]), k = prog(t, M.glass.a + .7, M.glass.a + 1.1); sourGlass(lerp(hp[0], 820, k), lerp(hp[1], GY, k) - Math.sin(k * Math.PI) * 60, k > 0 ? .4 : 1, .5); }
        if (t >= M.swarm.a) { ARMY.draw(S.drone, t); ARMY.draw(S.racket, t); }
        if (p) drawPanik(p, t, o);
        drawMimis(m, t);
        drawPerson(g, 'giannos', t, suitBack, () => suitFront(t, { broken: g.broken, ad: g.ad }));
        arrowsDraw(t, o);
      }) },
    ],
    ambient: 'rgb(76,84,128)',
    lights: lights.map(l => { const q = W2S([l.x, l.y]); return { ...l, x: q[0], y: q[1], r: l.r * cam[2] }; }),
    emit: world(() => {
      if (eyeOn) redGlow(eye[0], eye[1], 36 * (1 + .3 * Math.sin(t * 9)), eyeOn);
      for (const b of beams) fxBeam(...b.slice(0, 4), t, { width: b[4] });
      if (t > M.summon.b && t < M.summon.b + 1.4) { const k = (t - M.summon.b) / 1.4, R = 60 + 1100 * k; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,50,40,${.7 * (1 - k)})`; ctx.lineWidth = 14 * (1 - k) + 2; ctx.beginPath(); ctx.ellipse(o.x, GY - 40, R, R * .3, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
      if (t >= M.swarm.a) for (const k of ['bulb', 'vac', 'drone', 'racket', 'follow']) ARMY.emit(S[k], t);
      for (const b of blasts) FX2.explosionEmit(t, ...b);
      if (g.blower > .1) { const n = L2S([-72, 46], g.x, g.Y, g.s, 1, g.pose.v2, g.fall); glow(n[0], n[1] + 14, 46 * g.blower, 'rgba(255,200,140,1)', .7); fxBurst(t, Math.floor(t * 20) / 20, n[0], n[1] + 6, { kind: 'smoke', n: 6, speed: 220, dir: Math.PI / 2, spread: .7, life: .5, seed: 9 }); }
      if (t > M.fly.a + 2.1 && t < M.fly.a + 2.5) { const q = gc(); glow(q[0], q[1], 80, 'rgba(255,240,220,1)', .9); }
      for (const [t1, target, fl] of arrows()) if (target !== 'knee' && t > t1 + fl && t < t1 + fl + .5) fxBurst(t, t1 + fl, target[0], target[1], { kind: 'spark', n: 16, speed: 300, life: .5, seed: t1 });
      if (t > M.fly.a + 4.4 && t < M.fly.a + 4.9) { const kp = R3.point(T800, o, 'lKnee', [0, 0, 30]); fxBurst(t, M.fly.a + 4.4, kp[0], kp[1], { kind: 'spark', n: 18, speed: 360, life: .5, seed: 5 }); }
      if (t > M.throw.a + .3 && t < M.throw.a + .7) { const hp = R3.point(T800, o, 'rWr', [0, -30, 0]); fxBurst(t, M.throw.a + .3, hp[0], hp[1], { kind: 'spark', n: 24, speed: 420, life: .4, seed: 6 }); }
      if (alarm) { glow(CAR - 146, GY - 44, 40, 'rgba(255,170,60,1)', .9); glow(CAR + 148, GY - 44, 16, 'rgba(255,60,40,1)', .6); }
      if (t > M.away.a) droneCam(760, 110, t, { s: 1.4, rec: true });
    }),
    bloom: 1.1, tint: ['#c8d4ff', '#e8d8ff'], vignette: .5, grain: .08,
    after: () => { if (t > M.rec.a) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(255,0,0,.85)'; ctx.fillRect(40, 40, 70, 30); txt('REC', 75, 55, 18, '#fff', { font: 'monospace', weight: 900 }); ctx.restore(); } },
  });
}
return {
  id: 'scene16', title: '16 · Η μάχη', steps, render, fade: false,
  events: M => {
    const E = [], at = (t, name, vol = 1, o = {}) => E.push([t, () => SND2.sfx(name, vol, o)]);
    at(M.fly.a, 'whoosh', .8); at(M.fly.a + 1.6, 'laser', .9); at(M.fly.a + 2.1, 'laser_hit', .9); at(M.fly.a + 2.2, 'metal_punch', 1);
    at(M.fly.a + 4.0, 'whoosh', .5, { rate: 1.6 }); at(M.fly.a + 4.4, 'metal_punch', .55, { rate: 1.5 }); at(M.summon.a, 'servo', .7); at(M.summon.b, 'zap', .9, { rate: .6 });
    at(M.swarm.a, 'vac_swarm', .8); at(M.swarm.a + .6, 'drone_swarm', .8);
    for (const [z] of ZAPS) at(M.swarm.a + z, 'laser', .45, { rate: 1.3 });
    at(M.swarm.a + 3, 'boom_small', 1); at(M.swarm.a + 5.8, 'boom_big', 1);
    at(M.choke.a, 'leafblower_die', 1); at(M.choke.a + 1.5, 'body_fall', 1);
    E.push([M.door.a + .2, SFX.door]); at(M.glass.a + .3, 'servo', .6, { rate: 1.3 }); at(M.glass.a + 1.1, 'glass_smash', .9);
    at(M.throw.a + .1, 'whoosh', .9, { rate: .8 }); at(M.throw.a + .3, 'metal_punch', 1); at(M.throw.a + 1.1, 'glass_smash', .8); at(M.throw.a + 1.15, 'body_fall', .7);
    for (let i = 0; i < 4; i++) at(M.kitchen.a + 1.8 + i * .5, 'glass_smash', .8 - i * .1, { rate: 1 + i * .08 });
    at(M.kitchen.a + 3.6, 'metal_punch', .4, { rate: 1.6 });
    for (let k = 0; k < 9; k++) at(M.away.a + .5 + k * Math.PI / 5.2, 'stomp', .5 * (1 - k / 12));
    return E;
  },
  ambience: () => ({ hum: .01 }),
};
})());
