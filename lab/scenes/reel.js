/* Lab: the T-800 battle test reel (≈ 47 s, graphics v2), for the creator's approval before Episode 4's production.
   Night, Κώστας's street. No manga: raw, wide and ugly (the rule: no ink, no hero poses).
     1. arrive  (9 s)  the Jumbo container opens, the T-800 assembles on its knee, rises, the eye lights up
     2. clash  (10 s)  Γιάννος flies in on a leaf blower, the tray bounces the eye laser back; Μίμης's arrow in the knee;
                       the T-800 raises an arm: «Γειτονιά. Ενεργοποίηση.» (a red wave)
     3. swarm  (16 s)  300+ smart appliances (vacuums, drones, bulbs, rackets), drone lasers, two blasts;
                       the blower chokes and Γιάννος falls
     4. throw  (12 s)  Μίμης charges with the tray as a shield; the toaster hand throws him onto a car;
                       the T-800 turns and walks away, the swarm following it like dogs
   Everything is a pure function of t (swarms closed-form, no state carried between frames). */
defineScene((() => {
const steps = [
  { act: 'arrive', d: 9, cam: 'all' },
  { act: 'clash', d: 10, cam: 'all' },
  { act: 'swarm', d: 16, cam: 'all' },
  { act: 'throw', d: 12, cam: 'all' },
];
const GY = 640, RS = .7, PS = .55, PY = GY - 150 * PS;   // ground, robot scale, person scale, person anchor y
const RX = 820, CONT = 1135, CAR = 150;
const sm = (a, b, t) => ease(clamp((t - a) / (b - a)));
const SUMMON = { ...T800.P.scan, rSh: [-2.7, 0, .35], rElb: [-.25, 0, 0], head: [-.12, .3, 0] };

/* ---------- the T-800 at time t ---------- */
function robotX(t, M) {
  const w = M.throw.a + 5;
  return t < w ? RX : RX + (t - w) * 5.2 * T800.WALK_SPEED * RS * clamp((t - w) / .4 + .3);
}
function robot(t, M) {
  const A = M.arrive.a, C = M.clash.a, S = M.swarm.a, Wt = M.throw.a, P = T800.P;
  let pose = P.idle, yaw = -.6, asm = null, rOpen = 0;
  if (t < C) {
    if (t < A + 6.4) asm = T800.assembly(sm(A + .4, A + 6.4, t), [560, -180, -120]);
    pose = R3.blend(P.crouch, P.idle, sm(A + 6.6, A + 8.2, t));
  } else if (t < S) {
    const k = t - C;
    pose = R3.blend(P.idle, P.guard, sm(1.2, 1.7, k));
    pose = R3.blend(pose, P.hit, sm(3.1, 3.3, k) * (1 - sm(3.9, 4.6, k)));                 // the laser bounced back
    pose = R3.blend(pose, P.crouch, .28 * sm(6.0, 6.15, k) * (1 - sm(6.6, 7.2, k)));       // the arrow in the knee
    pose = R3.blend(pose, SUMMON, sm(7.5, 8.2, k));
  } else if (t < Wt) {
    const k = t - S;
    pose = R3.blend(SUMMON, P.guard, sm(1.4, 2.0, k));
    pose = R3.blend(pose, P.punch, sm(9.1, 9.3, k) * (1 - sm(9.7, 10.3, k)));             // swats a racket
  } else {
    const k = t - Wt;
    pose = R3.blend(P.guard, P.hit, .35 * sm(1.3, 1.8, k) * (1 - sm(1.95, 2.0, k)));       // the wind-up
    pose = R3.blend(pose, P.punch, sm(1.95, 2.15, k) * (1 - sm(2.9, 3.6, k)));
    rOpen = sm(1.3, 1.7, k) * (1 - sm(2.1, 2.2, k));                                      // the toaster opens, slams
    pose = R3.blend(pose, P.idle, sm(3.6, 4.2, k));
    yaw = lerp(-.6, Math.PI / 2, sm(4.2, 5.0, k));
    if (k > 5) pose = R3.blend(P.idle, T800.walk((k - 5) * 5.2, clamp((k - 5) / .4)), clamp((k - 5) / .3));
  }
  const base = { x: robotX(t, M), y: 0, s: RS, pitch: .1, yaw, t, pose: T800.open(pose, 0, rOpen) };
  return { ...base, y: GY - R3.lowestY(T800, base), ground: GY, asm };
}

/* ---------- the people: Γιάννος (cheap suit) and Μίμης ---------- */
/* local (person units) → screen, through the v2 rig's lean around the hips and an optional fall rotation */
function L2S(p, x, Y, s, dir, v2, fall = 0) {
  const lift = v2.lift || 0, lean = v2.lean || 0, pv = 30 - lift;
  const dx = p[0], dy = p[1] - pv, c = Math.cos(lean), sn = Math.sin(lean);
  let lx = dx * c - dy * sn, ly = dx * sn + dy * c + pv;
  let sx = x + lx * s * dir, sy = Y + ly * s;
  if (fall) { const gx = x, gy = Y + 150 * s, a = fall * dir, ux = sx - gx, uy = sy - gy; sx = gx + ux * Math.cos(a) - uy * Math.sin(a); sy = gy + ux * Math.sin(a) + uy * Math.cos(a); }
  return [sx, sy];
}
function inBody(x, Y, s, dir, v2, fn) {
  const lift = v2.lift || 0, lean = v2.lean || 0;
  ctx.save(); ctx.translate(x, Y); ctx.scale(s * dir, s); ctx.translate(0, 30 - lift); ctx.rotate(lean); ctx.translate(0, -30); fn(); ctx.restore();
}
const LYING = { v2: { feet: [[-14, 146], [30, 140]], lean: .05 }, L: [-70, -170], R: [90, -60] };
const STAND = { v2: { feet: [[-30, 146], [34, 146]], lean: .06 }, L: [-30, -10], R: [56, -30] };
function giannos(t, M) {
  const C = M.clash.a, S = M.swarm.a;
  if (t < C) return null;
  let x = 470, h = 0, pose = STAND, fall = 0, blower = 0, look = [.8, -.2];
  const k = t - C;
  if (t < S) {
    const u = sm(.3, 2.2, k);
    x = lerp(-140, 470, u) - 34 * sm(3.0, 3.15, k) * (1 - sm(3.4, 4.2, k));
    h = (210 + Math.sin(u * Math.PI) * 50) * (1 - sm(6.5, 7.3, k)) + Math.sin(t * 5) * 8 * (1 - sm(6.5, 7.0, k));
    blower = 1 - sm(7.0, 7.4, k);
    if (h > 4) pose = { ...POSE2.jump(.5), R: [70, -110], L: [-70, -60] };
  } else if (t < M.throw.a) {
    const q = t - S, up = sm(2.0, 2.8, q), drop = sm(11.6, 12.3, q);
    x = lerp(470, 620, up) + Math.sin(q * 1.3) * 20 * up * (1 - drop);
    const sputter = q > 11 ? Math.sin(q * 40) * 10 * clamp((q - 11) * 2) : 0;
    h = (220 + Math.sin(q * 4) * 10 + sputter) * up * (1 - drop * drop);
    blower = up * (q < 11 ? 1 : q < 11.6 ? .5 + .5 * Math.sin(q * 50) : 0);
    look = [.4, -.6];
    if (h > 4) pose = { ...POSE2.jump(.6), R: [80 + 50 * Math.sin(q * 6), -90 - 40 * Math.cos(q * 6)], L: [-80, -70] };
    if (q > 11.6) { const f = sm(11.6, 12.35, q); pose = { ...POSE2.fallBack(Math.min(1, f * 1.4)), R: [90, -170], L: [-110, -150] }; fall = -1.5 * sm(12.0, 12.45, q); if (q > 12.3) pose = LYING; }
  } else { x = 620; pose = LYING; fall = -1.5; look = [0, -1]; }
  return { x, Y: PY - h, s: PS, dir: 1, pose, fall, blower, look, h };
}
function mimis(t, M) {
  const C = M.clash.a, S = M.swarm.a, Wt = M.throw.a;
  if (t < C) return null;
  let x = 250, pose = STAND, pull = 0, fly = null, slump = 0, run = 0;
  if (t < S) {
    const k = t - C;
    if (k > 4.2) { pose = POSE2.aim(); pull = sm(4.4, 5.4, k) * (k < 5.6 ? 1 : 0); }
  } else if (t < Wt) {
    const q = t - S, ph = ((q - 2) % 2.5 + 2.5) % 2.5;
    pose = POSE2.aim(); pull = q > 2 && q < 13 ? sm(.6, 1.8, ph) * (ph < 2 ? 1 : 0) : 0;
  } else {
    const k = t - Wt;
    if (k < 2.2) { run = sm(.4, 2.0, k); x = lerp(250, 640, run); const p = POSE2.run((k - .4) * 13); pose = k > .4 ? { ...p, R: [80, -100], L: [40, -70] } : STAND; }
    else if (k < 3.0) fly = sm(2.2, 3.0, k);
    else slump = 1;
  }
  return { x, Y: PY, s: PS, dir: 1, pose, pull, fly, slump, run };
}
/* Μίμης's arrows: [release time, from, target, flight time, hits the robot?] */
function arrows(M) {
  const L = [[M.clash.a + 5.6, 'knee', .4]];
  for (let i = 0; i < 4; i++) L.push([M.swarm.a + 4 + i * 2.5, [520 + i * 170, 170 + hash(i * 3) * 160], .45]);
  return L;
}
function bowHand(t, M) { const m = mimis(t, M); return m ? L2S([150, -142], m.x, m.Y, m.s, m.dir, m.pose.v2) : [0, 0]; }

/* ---------- props: the Jumbo container, a parked car ---------- */
function jumboBox(t, M) {
  const open = sm(M.arrive.a + .2, M.arrive.a + .9, t), x0 = CONT - 125;
  rect(x0, GY - 180, 250, 180, '#d4562c', { lw: 4, w: .4 });
  for (let i = 0; i < 9; i++) curve([[x0 + 18 + i * 26, GY - 172], [x0 + 18 + i * 26, GY - 8]], 3, '#8f3519', { w: 0 });
  txt('JUMBO', CONT, GY - 150, 24, '#fff', { font: TVFONT, weight: 900 });
  ctx.save(); ctx.translate(x0, GY - 180); ctx.scale(1 - open * .85, 1); rect(0, 0, 250, 180, '#b9471f', { lw: 4, w: .4 }); ctx.restore();   // the door swings out
}
function car(t, M) {
  const hitT = M.throw.a + 3.0, dent = t > hitT ? 1 : 0;
  ctx.save(); ctx.translate(CAR, GY);
  if (t > hitT && t < hitT + .25) ctx.translate(Math.sin((t - hitT) * 90) * 6 * (1 - (t - hitT) / .25), 0);   // the car rocks on the impact
  blob(-90, -8, 26, 26, '#1d1d22', { lw: 3 }); blob(90, -8, 26, 26, '#1d1d22', { lw: 3 });
  poly([[-150, -20], [-146, -66], [-80, -74], [-50, -120], [56, -120], [92, -74], [150, -64], [152, -20]], '#5d7fa6', { lw: 4, w: .4 });
  poly([[-40, -112], [48, -112], [76, -76], [-70, -76]], '#9fc0d8', { lw: 3 });
  if (dent) { poly([[20, -112], [48, -112], [60, -96], [30, -86]], '#c9dbe8', { lw: 2 }); for (let i = 0; i < 4; i++) curve([[34, -100], [34 + Math.cos(i * 1.7) * 30, -100 + Math.sin(i * 1.7) * 14]], 1.4, '#eef4fa', { w: 0 }); }
  blob(-90, -8, 10, 10, '#8a8f98', { lw: 2 }); blob(90, -8, 10, 10, '#8a8f98', { lw: 2 });
  ctx.restore();
}

/* ---------- swarms (built once from the scene times) ---------- */
let SW = null;
function swarms(M) {
  if (SW) return SW;
  const s = M.swarm.a, home = M.throw.a + 5, gone = (t, p, i) => { const k = sm(home + hash(i) * 1.5, home + 3 + hash(i) * 2, t); return [lerp(p[0], 1700 + hash(i * 7) * 300, k), lerp(p[1], p[1] - 60 * k, k)]; };
  SW = {
    vac: ARMY.swarm({ seed: 11, n: 150, kind: 'vac', t0: s, spread: 3, from: i => [i % 2 ? -160 - hash(i) * 260 : 1440 + hash(i) * 260, GY], to: (i, t) => gone(t, [300 + hash(i * 3) * 760, GY], i), dur: 3.4, size: [18, 50], band: [585, 705], wob: 10, killAt: i => i % 6 === 0 ? s + 4 + hash(i) * 8 : null }),
    bulb: ARMY.swarm({ seed: 12, n: 28, kind: 'bulb', t0: s + .8, spread: 2, from: i => [500 + hash(i * 3) * 700, -60], to: (i, t) => gone(t, [260 + hash(i * 9) * 900, 70 + hash(i * 4) * 200], i), dur: 2.2, size: [12, 22], hover: true, wob: 14, bulbK: (i, t) => .35 + .15 * Math.sin(t * 7 + i) }),
    drone: ARMY.swarm({ seed: 13, n: 110, kind: 'drone', t0: s + .4, spread: 2.4, from: i => [1450 + hash(i * 5) * 260, 60 + hash(i * 7) * 300], to: (i, t) => gone(t, [280 + hash(i * 11) * 900, 120 + hash(i * 13) * 330], i), dur: 2.8, size: [18, 52], hover: true, wob: 22, killAt: i => i % 5 === 0 ? s + 3.5 + hash(i * 2) * 9 : null }),
    racket: ARMY.swarm({ seed: 14, n: 30, kind: 'racket', t0: s + 1.2, spread: 2, from: i => [1400, 250 + hash(i) * 220], to: (i, t) => gone(t, [330 + hash(i * 17) * 360, 230 + hash(i * 19) * 200], i), dur: 2.4, size: [22, 42], hover: true, wob: 30, spin: 3, killAt: i => i % 4 === 0 ? s + 5 + hash(i * 5) * 7 : null }),
    follow: ARMY.swarm({ seed: 15, n: 36, kind: 'vac', t0: home, spread: .8, from: i => [CONT, GY], to: (i, t) => [robotX(t - .5 - hash(i) * .8, M) - 90 - hash(i * 3) * 240, GY], dur: .9, size: [20, 40], band: [610, 690], wob: 6 }),
  };
  return SW;
}
/* drone lasers at Γιάννος during the swarm: [start, unit index] */
const ZAPS = [[4.0, 3], [6.2, 8], [7.4, 21], [9.6, 33], [10.2, 47]];
const BLASTS = M => [[M.swarm.a + 5.0, 600, GY, .8], [M.swarm.a + 8.5, 980, GY - 10, 1.2]];

/* the street, drawn once at half resolution in world space (soft, like a shallow depth of field) and moved by the
   camera as an image: the camera never forces a redraw of the set */
let BG = null;
function streetImg() {
  if (BG) return BG;
  const k = RES * .5, c = document.createElement('canvas'); c.width = Math.round(2400 * k); c.height = Math.round(1200 * k);
  const x = c.getContext('2d'), main = ctx; x.setTransform(k, 0, 0, k, 400 * k, 300 * k);
  ctx = x; try { villageStreet(0, { light: 'night', lamp: true }); } finally { ctx = main; }
  return BG = c;
}
/* ---------- camera ---------- */
function camBase(t, M) {
  const A = M.arrive.a, C = M.clash.a, S = M.swarm.a, Wt = M.throw.a;
  // [time, [x, y, zoom], cut?]: eased between keys, a hard cut where the key says so
  const key = [[A, [640, 360, 1]], [A + 5, [700, 380, 1.02]], [A + 6.9, [770, 410, 1.15]],
    [A + 6.9, [820, 300, 2.3], 1], [A + 8.6, [820, 296, 2.45]],                              // close: the eye lights up
    [C + .2, [600, 370, 1], 1], [C + 7, [560, 360, 1.05]], [S + .5, [640, 350, .95], 1], [S + 11.2, [610, 360, 1]],
    [S + 11.2, [620, 470, 1.7], 1], [S + 12.8, [600, 520, 1.8]],                             // close: the blower dies, the fall
    [S + 12.8, [600, 360, 1], 1], [S + 16, [600, 360, 1]],
    [Wt + .2, [520, 390, 1.05], 1], [Wt + 1.7, [560, 420, 1.12]],
    [Wt + 1.7, [700, 450, 1.75], 1], [Wt + 2.6, [660, 450, 1.8]],                            // close: the toaster hand
    [Wt + 2.6, [420, 400, 1.08], 1], [Wt + 3.6, [420, 400, 1.08]], [Wt + 5, [760, 370, 1]], [Wt + 12, [1000, 370, 1]]];
  let i = 0; while (i < key.length - 1 && key[i + 1][0] <= t) i++;
  if (i >= key.length - 1) return key[key.length - 1][1];
  const [ta, a] = key[i], [tb, b, cut] = key[i + 1];
  if (cut) return a;
  const k = ease(clamp((t - ta) / (tb - ta)));
  return a.map((v, j) => lerp(v, b[j], k));
}
let CH = null;
function choreo(M) {
  if (CH) return CH;
  const C = M.clash.a, S = M.swarm.a, Wt = M.throw.a;
  return CH = FX2.choreo([{ t: C + 3.1, kind: 'big', zoom: .1, stop: .1 }, { t: C + 6.0, kind: 'hit' }, { t: C + 8.6, kind: 'tap' },
    { t: S + 5.0, kind: 'hit' }, { t: S + 8.5, kind: 'big', zoom: .1, stop: .1 }, { t: S + 12.35, kind: 'hit' },
    { t: Wt + 2.2, kind: 'big', zoom: .15, stop: .14 }, { t: Wt + 3.0, kind: 'hit' }]);
}

/* ---------- drawing ---------- */
function drawPerson(p, cast, t, extraBack, extraFront) {
  const v2 = p.pose.v2;
  const go = () => {
    if (extraBack) inBody(p.x, p.Y, p.s, p.dir, v2, extraBack);
    person(p.x, p.Y, p.s, CAST[cast], { t, legs: 'stand', look: p.look || [.8, -.1], brow: 'down', mouth: 'flat', ...p.pose, dir: p.dir, noShadow: p.h > 4 });
    if (extraFront) inBody(p.x, p.Y, p.s, p.dir, v2, extraFront);
  };
  if (p.fall) { ctx.save(); const gx = p.x, gy = p.Y + 150 * p.s; ctx.translate(gx, gy); ctx.rotate(p.fall * p.dir); ctx.translate(-gx, -gy); go(); ctx.restore(); }
  else go();
  if (p.h > 4) { ctx.save(); ctx.globalAlpha = .2 * clamp(1 - p.h / 400); ctx.fillStyle = '#140f18'; ctx.beginPath(); ctx.ellipse(p.x, GY + 4, 40, 7, 0, 0, TAU); ctx.fill(); ctx.restore(); }
}
function drawGiannos(g, t) {
  drawPerson(g, 'giannos', t,
    () => { rect(-96, -150, 44, 82, '#e8762b', { lw: 3.5 }); rect(-90, -140, 32, 20, '#2a2c33', { lw: 2 }); limb([[-74, -70], [-86, -10], [-72, 40]], 9, '#3a3d44', { w: .2 }); },   // the leaf blower, nozzle down
    () => {
      blob(-4, -238, 58, 40, '#9aa0a8', { lw: 3.5 }); rect(6, -296, 40, 24, '#15161a', { lw: 2.5 });                  // the motorbike helmet + the phone taped on it
      rect(9, -293, 34, 18, Math.floor(t * 2) % 2 ? '#e9e04a' : '#4aa0e9', { lw: 0 });
      blob(14, -70, 34, 40, '#c8ccd2', { lw: 3.5 }); blob(14, -70, 22, 27, '#b0b4ba', { lw: 1.5 });                  // the tray on the chest
      curve([[-40, -110], [14, -110], [50, -100]], 3, '#3a3d44', { w: 0 });                                           // the straps
    });
}
function drawMimis(m, t, M) {
  if (m.fly != null) {   // thrown: a spinning arc onto the car
    const k = m.fly, x = lerp(640, CAR + 150, k), y = lerp(PY, PY - 20, k) - Math.sin(k * Math.PI) * 200;
    ctx.save(); ctx.translate(x, y + 40 * PS); ctx.rotate(-k * TAU); ctx.translate(-x, -(y + 40 * PS));
    person(x, y, PS, CAST.mimis, { t, legs: 'stand', ...POSE2.fallBack(1), look: [-.5, -.5], mouth: 'o', noShadow: true });
    ctx.restore(); return;
  }
  if (m.slump) {   // slumped against the car, holding his leg
    person(CAR + 150, PY, PS, CAST.mimis, { t, legs: 'stand', v2: { feet: [[70, 146], [118, 146]], lean: -.3, lift: -70 }, L: [-70, 20], R: [96, 60], look: [.3, .5], brow: 'down', mouth: 'o' });
    return;
  }
  drawPerson(m, 'mimis', t, null, () => {
    if (m.run) { blob(80, -100, 34, 40, '#c8ccd2', { lw: 3.5 }); blob(80, -100, 22, 27, '#b0b4ba', { lw: 1.5 }); return; }   // the tray as a shield
    if (m.pose === STAND) return;
    bowDraw(150, -142, 1, m.pull);
    if (m.pull > .05) arrow(150 - m.pull * 30 + 30, -142, 0, .8);
  });
}
function drawArrows(t, M, o) {
  for (const [t0, target, fl] of arrows(M)) {
    const k = (t - t0) / fl; if (k < 0) continue;
    const from = bowHand(t0, M), to = target === 'knee' ? R3.point(T800, robot(t0 + fl, M), 'lKnee', [0, 0, 30]) : target;
    if (k <= 1) { const x = lerp(from[0], to[0], k), y = lerp(from[1], to[1], k) - Math.sin(k * Math.PI) * 30, a = Math.atan2(to[1] - from[1], to[0] - from[0]); arrow(x, y, a, .8); }
    else if (target === 'knee') { const kp = R3.point(T800, o, 'lKnee', [0, 0, 30]), a = Math.atan2(to[1] - from[1], to[0] - from[0]); arrow(kp[0] - Math.cos(a) * 28, kp[1] - Math.sin(a) * 28, a, .8); }   // stuck in the knee
  }
}
function render(t0, M) {
  const C2 = choreo(M), t = C2.time(t0), cam = C2.cam(t0, camBase(t0, M)), S = swarms(M);
  const o = robot(t, M), g = giannos(t, M), m = mimis(t, M), W2S = p => [(p[0] - cam[0]) * cam[2] + 640, (p[1] - cam[1]) * cam[2] + 360];
  const eye = R3.point(T800, o, 'head', [0, 30, 33]), eyeOn = (t > M.arrive.a + 7.2 ? 1 : 0) * clamp((eye[2] - R3.point(T800, o, 'head', [0, 30, 0])[2]) / 20);
  const C = M.clash.a, Sa = M.swarm.a, Wt = M.throw.a;
  const blasts = BLASTS(M);
  const world = fn => () => { ctx.save(); applyCamFx(cam); fn(); ctx.restore(); };
  // the beams of this frame: [x1, y1, x2, y2, width]
  const beams = [];
  if (g && t > C + 2.4 && t < C + 3.4) { const gc = L2S([14, -70], g.x, g.Y, g.s, 1, g.pose.v2); beams.push([eye[0], eye[1], gc[0], gc[1], 1]); if (t > C + 3.0) { const ch = R3.point(T800, o, 'chest', [0, 64, 50]); beams.push([gc[0], gc[1], ch[0], ch[1], 1.2]); } }
  if (g) for (const [z, i] of ZAPS) { const a = Sa + z; if (t > a && t < a + .35) { const st = ARMY.state(S.drone, S.drone.units[i], t); if (st && !st.dead) { const gc = L2S([14, -70], g.x, g.Y, g.s, 1, g.pose.v2); beams.push([st.x, st.y, gc[0], gc[1], .45]); } } }
  const lights = [{ x: 722, y: 180, r: 380, col: 'rgba(255,214,150,1)', k: .9, spill: 'rgba(255,200,120,.08)' }];
  if (eyeOn) lights.push({ x: eye[0], y: eye[1], r: 240, col: 'rgba(255,110,90,1)', k: .5 * eyeOn, spill: 'rgba(255,60,40,.08)' });
  for (const b of beams) lights.push({ x: b[2], y: b[3], r: 260 * b[4], col: 'rgba(255,120,90,1)', k: .9 });
  for (const b of blasts) { const l = FX2.explosionLight(t, ...b); if (l) lights.push(l); }
  if (g && g.blower > .1) { const n = L2S([-72, 46], g.x, g.Y, g.s, 1, g.pose.v2, g.fall); lights.push({ x: n[0], y: n[1], r: 160, col: 'rgba(255,190,120,1)', k: .5 * g.blower }); }
  if (t > Wt + 3.0 && Math.floor(t * 3) % 2 === 0) lights.push({ x: CAR - 140, y: GY - 50, r: 200, col: 'rgba(255,170,60,1)', k: .7 });   // the car alarm
  const flash = [M.arrive.a + 1.0, M.arrive.a + 3.4].reduce((a, f) => Math.max(a, t > f && t < f + .35 ? (1 - (t - f) / .35) * (Math.sin((t - f) * 60) > -.3 ? 1 : .3) : 0), 0);
  RV2.frame(t, {
    layers: [
      { name: 'bg', draw: world(() => ctx.drawImage(streetImg(), -400, -300, 2400, 1200)) },
      { name: 'mid', draw: world(() => { jumboBox(t, M); car(t, M); }) },
      { name: 'act', draw: world(() => {
        if (t >= Sa) { ARMY.draw(S.bulb, t); ARMY.draw(S.vac, t); ARMY.draw(S.follow, t); }
        for (const b of blasts) FX2.explosionBody(t, ...b, { ground: GY, smoke: .8 });
        R3.draw(T800, o);
        if (t >= Sa) { ARMY.draw(S.drone, t); ARMY.draw(S.racket, t); }   // over the robot, behind the people (faces stay clear)
        if (m) drawMimis(m, t, M);
        if (g) drawGiannos(g, t);
        drawArrows(t, M, o);
      }) },
    ],
    ambient: 'rgb(76,84,128)',
    lights: lights.map(l => { const p = W2S([l.x, l.y]); return { ...l, x: p[0], y: p[1], r: l.r * cam[2] }; }),
    emit: world(() => {
      if (eyeOn) redGlow(eye[0], eye[1], 36 * (1 + .3 * Math.sin(t * 9)), eyeOn);
      if (t > M.arrive.a + 7.2 && t < M.arrive.a + 7.6) redGlow(eye[0], eye[1], 140 * (1 - (t - M.arrive.a - 7.2) / .4), 1);
      for (const s of T800.snapTimes(M.arrive.a + .4, 6)) if (t > s.t && t < s.t + .3) fxBurst(t, s.t, RX + (hash(s.t) - .5) * 120, GY - 120 - hash(s.t * 3) * 120, { kind: 'spark', n: 10, speed: 260, life: .3, seed: s.t * 7 });
      for (const b of beams) fxBeam(...b.slice(0, 4), t, { width: b[4] });
      if (t > C + 8.6 && t < C + 10) { const k = (t - C - 8.6) / 1.4, R = 60 + 1100 * k; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,50,40,${.7 * (1 - k)})`; ctx.lineWidth = 14 * (1 - k) + 2; ctx.beginPath(); ctx.ellipse(o.x, GY - 40, R, R * .3, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
      if (t >= Sa) for (const k of ['bulb', 'vac', 'drone', 'racket', 'follow']) ARMY.emit(S[k], t);
      for (const b of blasts) FX2.explosionEmit(t, ...b);
      if (g && g.blower > .1) { const n = L2S([-72, 46], g.x, g.Y, g.s, 1, g.pose.v2, g.fall); glow(n[0], n[1] + 14, 46 * g.blower, 'rgba(255,200,140,1)', .7); fxBurst(t, Math.floor(t * 20) / 20, n[0], n[1] + 6, { kind: 'smoke', n: 6, speed: 220, dir: Math.PI / 2, spread: .7, life: .5, seed: 9 }); }
      if (g && t > C + 3.0 && t < C + 3.4) { const gc = L2S([14, -70], g.x, g.Y, g.s, 1, g.pose.v2); glow(gc[0], gc[1], 80, 'rgba(255,240,220,1)', .9); }
      for (const [t1, target, fl] of arrows(M)) if (target !== 'knee' && t > t1 + fl && t < t1 + fl + .5) fxBurst(t, t1 + fl, target[0], target[1], { kind: 'spark', n: 16, speed: 300, life: .5, seed: t1 });
      if (t > C + 6.0 && t < C + 6.5) { const kp = R3.point(T800, o, 'lKnee', [0, 0, 30]); fxBurst(t, C + 6.0, kp[0], kp[1], { kind: 'spark', n: 18, speed: 360, life: .5, seed: 5 }); }
      if (t > Wt + 2.2 && t < Wt + 2.6) { const hp = R3.point(T800, o, 'rWr', [0, -30, 0]); fxBurst(t, Wt + 2.2, hp[0], hp[1], { kind: 'spark', n: 24, speed: 420, life: .4, seed: 6 }); }
      if (t > Wt + 3.0) { const on = Math.floor(t * 3) % 2 === 0; if (on) { glow(CAR - 146, GY - 44, 40, 'rgba(255,170,60,1)', .9); glow(CAR + 148, GY - 44, 16, 'rgba(255,60,40,1)', .6); } }
      if (t > Wt + 3.0 && t < Wt + 3.4) fxBurst(t, Wt + 3.0, CAR + 40, GY - 100, { kind: 'spark', n: 20, speed: 300, life: .4, seed: 8, grav: 1200 });
      if (t > Wt + 6) { const dx = 700 + (t - Wt - 6) * 90; blob(dx, 90, 3, 3, Math.floor(t * 2) % 2 ? 'rgba(255,40,40,1)' : 'rgba(80,0,0,1)', { lw: 0 }); }   // the drone's REC light
    }),
    bloom: 1.1, tint: ['#c8d4ff', '#e8d8ff'], vignette: .5, grain: .08,
    after: () => {
      if (flash) fxFlash(flash * 1.4, '200,215,255');
      if (t > Wt + 6) { const dx = W2S([700 + (t - Wt - 6) * 90, 90]); selfieDroneLite(dx[0], dx[1], t); }
      const lab = t < C ? 'ΑΦΙΞΗ' : t < Sa ? 'ΣΧΕΔΙΟ' : t < Wt ? 'ΚΛΙΜΑΚΩΣΗ' : 'ΤΙΜΗΜΑ';
      txt('TEST REEL · ' + lab, 24, 30, 16, 'rgba(255,255,255,.7)', { font: TVFONT, weight: 900, align: 'left' });
    },
  });
}
/* the surveillance drone that films it all (small, dark, one red light) */
function selfieDroneLite(x, y, t) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 4);
  rect(-16, -5, 32, 10, '#2a2c33', { lw: 2 }); curve([[-26, -8], [26, -8]], 2.5, '#2a2c33', { w: 0 });
  for (const s of [-1, 1]) blob(s * 26, -10, 12, 2.5, 'rgba(200,210,220,.5)', { lw: 0 });
  if (Math.floor(t * 2) % 2) blob(0, 2, 3, 3, '#ff3030', { lw: 0, glow: '#ff3030', gb: 12 });
  ctx.restore();
}
function events(M) {
  const A = M.arrive.a, C = M.clash.a, S = M.swarm.a, Wt = M.throw.a, E = [];
  const at = (t, name, vol = 1, o = {}) => E.push([t, () => SND2.sfx(name, vol, o)]);
  at(A + 1.0, 'boom_small', .45, { rate: .55 }); at(A + 3.4, 'boom_small', .5, { rate: .5 });
  T800.snapTimes(A + .4, 6).forEach((s, i) => { if (i % 2 === 0) at(s.t, 'click_lock', .55, { rate: .9 + (i % 5) * .05 }); });
  at(A + 6.6, 'servo', .8); at(A + 7.2, 'zap', .5, { rate: .7 });
  at(C + .3, 'whoosh', .8); at(C + 2.4, 'laser', .9); at(C + 3.0, 'laser_hit', .9); at(C + 3.1, 'metal_punch', 1);
  at(C + 5.6, 'whoosh', .5, { rate: 1.6 }); at(C + 6.0, 'metal_punch', .55, { rate: 1.5 }); at(C + 7.5, 'servo', .7); at(C + 8.6, 'zap', .9, { rate: .6 });
  at(S, 'vac_swarm', .8); at(S + .6, 'drone_swarm', .8); at(S + 2, 'whoosh', .6);
  for (const [z] of ZAPS) at(S + z, 'laser', .45, { rate: 1.3 });
  for (const [t0] of arrows(M).slice(1)) at(t0, 'whoosh', .35, { rate: 1.7 });
  at(S + 5, 'boom_small', 1); at(S + 8.5, 'boom_big', 1); at(S + 9.3, 'metal_punch', .5, { rate: 1.3 });
  at(S + 11, 'leafblower_die', 1); at(S + 12.35, 'body_fall', 1);
  at(Wt + 1.9, 'whoosh', .9, { rate: .8 }); at(Wt + 2.2, 'metal_punch', 1); at(Wt + 3.0, 'glass_smash', .9); at(Wt + 3.05, 'body_fall', .7);
  at(Wt + 4.2, 'servo', .7);
  for (let k = 0; k < 11; k++) at(Wt + 5 + .3 + k * Math.PI / 5.2, 'stomp', .55 * (1 - k / 14));
  return E;
}
return { id: 'scene07', title: 'T-800 battle reel', steps, render, events, fade: false };
})());
