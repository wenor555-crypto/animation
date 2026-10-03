/* =========================================================
   «Η Έξυπνη Σίτα» – robot models (structured, see robot3d.js and docs/production-guide.md «Graphics v2»)
   Every machine: a skeleton first, then the appliances bound to the bones as armour, visible joints, pistons and
   cables. Poses are data (joint rotations); the same model draws the model sheet and the animation.
   Load after robot3d.js.
   ========================================================= */

/* ---------- materials ---------- */
const RMAT = {
  joint: { col: '#4a515c', spec: .5 },
  steel: { col: '#aeb8c4', spec: .9 },
  chrome: { col: '#c9d1db', spec: 1 },
  white: { col: '#eef0f2' },
  cream: { col: '#dcd8cc' },
  boiler: { col: '#f1f1ee' },
  grey: { col: '#5d6470' },
  hose: { col: '#6a7280' },
  dehum: { col: '#c9cfd6' },
  black: { col: '#2a2c33', spec: .35 },
  vac: { col: '#1f2126', spec: .3 },
};

/* the red faction glow (the σίτα's machines): a soft additive disc */
/* drawn from one pre-rendered sprite (a gradient per call cost ~0.1 ms, and a swarm makes hundreds of them) */
let _redGlowSprite = null;
function redGlow(x, y, r, k = 1) {
  if (!_redGlowSprite) {
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,70,50,.85)'); gr.addColorStop(.35, 'rgba(255,40,30,.35)'); gr.addColorStop(1, 'rgba(255,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); _redGlowSprite = c;
  }
  if (k <= 0 || r <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; redGlowRaw(x, y, r, k); ctx.restore();
}
/* the same without save/restore: for batches drawn inside one 'lighter' block (a swarm's LEDs) */
function redGlowRaw(x, y, r, k = 1) {
  if (k <= 0 || r <= 0) return;
  if (!_redGlowSprite) { redGlow(x, y, r, 0.0001); }
  ctx.globalAlpha = Math.min(1, k); ctx.drawImage(_redGlowSprite, x - r, y - r, r * 2, r * 2);
}

/* ---------- decals (drawn in the plane of a face; units = model units, v points down) ---------- */
const T8D = {
  fridgeFront(t, [hw, hh]) {
    curve([[-hw, -hh + 46], [hw, -hh + 46]], 2.4, INK, { w: 0 });                       // freezer line
    rect(hw - 22, -hh + 10, 9, 30, '#dfe5ec', { lw: 2 }); rect(hw - 22, -hh + 56, 9, 56, '#dfe5ec', { lw: 2 });   // handles
    rect(-hw + 16, -hh + 8, 40, 30, '#1d2a36', { lw: 2.2 });                              // ice dispenser
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; rect(-hw + 20, -hh + 12, 32, 22, 'rgba(90,170,255,.35)', { lw: 0 }); ctx.restore();
    txt('SITA', -hw + 36, -hh + 23, 9, '#9fd0ff', { font: TVFONT, weight: 900 });
    // souvenir fridge magnets (nine pairs of strong magnets, of course)
    const M = [['#e8392b', 'ΤΗΝΟΣ'], ['#ffd23f', 'ΠΙΤΣΑ'], ['#3a7bd5', 'ΛΕΧΑΙΟ'], ['#5fbf6a', '9,90€']];
    M.forEach(([c, s], i) => { const x = -hw + 30 + (i % 2) * 52, y = -hh + 66 + Math.floor(i / 2) * 26; ctx.save(); ctx.translate(x, y); ctx.rotate((i % 3 - 1) * .12); rect(-22, -9, 44, 18, c, { lw: 1.8 }); txt(s, 0, 0, 7, '#fff', { font: TVFONT, weight: 900 }); ctx.restore(); });
  },
  fridgeSide(t, [hw, hh]) { for (let i = 0; i < 5; i++) curve([[-hw + 10, -hh + 14 + i * 8], [-hw + 34, -hh + 14 + i * 8]], 2, '#7c8794', { w: 0 }); },
  washerFront(t, [hw, hh], o) {
    rect(-hw, -hh, hw * 2, 16, '#d9dde2', { lw: 2 });                                     // control strip
    blob(hw - 16, -hh + 8, 6, 6, '#9aa3ae', { lw: 1.6 }); rect(-hw + 8, -hh + 4, 22, 8, '#18222c', { lw: 1.4 });
    txt('1400', -hw + 19, -hh + 8, 5, '#7cf0a0', { font: TVFONT, weight: 900 });
    blob(-4, 8, 28, 28, '#c9d1db', { lw: 2.6 });                                          // the door ring
    blob(-4, 8, 21, 21, '#16202e', { lw: 2 });
    const sp = (o.t || 0) * 5;                                                            // the drum turns: a reactor
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) { const a = sp + i * TAU / 3; ctx.beginPath(); ctx.arc(-4, 8, 14, a, a + 1.4); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,80,60,.75)'; ctx.stroke(); }
    ctx.restore(); redGlow(-4, 8, 22, .6);
  },
  fryerFront(t, [hw, hh], o) {
    rect(-hw + 6, hh - 18, hw * 2 - 12, 9, '#3b3e47', { lw: 2 });                          // the basket handle
    blob(0, -6, 17, 17, '#0e0f13', { lw: 2.4 });                                            // the eye socket
    const blink = o.eye ?? 1;
    blob(0, -6, 10, 10 * blink + .5, '#ff3b2f', { lw: 0 }); redGlow(0, -6, 30, blink);
    rect(-hw + 6, -hh + 6, 18, 8, '#18222c', { lw: 1.2 }); txt('200°', -hw + 15, -hh + 10, 5, '#ff8a6a', { font: TVFONT, weight: 900 });
  },
  fryerTop(t, [hw, hh]) { blob(0, 0, 13, 13, '#4a4e58', { lw: 2 }); curve([[0, 0], [0, -10]], 2.4, '#d0d4da', { w: 0 }); },
  fryerSide(t, [hw, hh]) { for (let i = 0; i < 4; i++) rect(-14, -hh + 12 + i * 10, 28, 4, '#15161a', { lw: 0 }); },
  acFan(t, [hw, hh], o) {                                                                   // the air-conditioner unit on the shoulder
    blob(0, 2, hw * .8, hh * .8, '#2c3038', { lw: 2.2 });
    const a0 = (o.t || 0) * 9;
    for (let i = 0; i < 4; i++) { const a = a0 + i * TAU / 4; poly([[0, 2], [Math.cos(a) * hw * .7, 2 + Math.sin(a) * hh * .7], [Math.cos(a + .5) * hw * .55, 2 + Math.sin(a + .5) * hh * .55]], '#9aa3ae', { lw: 1.4 }); }
    for (let i = -2; i <= 2; i++) curve([[-hw * .78, 2 + i * hh * .3], [hw * .78, 2 + i * hh * .3]], 1.2, '#5a606b', { w: 0 });
  },
  acFront(t, [hw, hh]) { txt('INVERTER', 0, -hh + 9, 6, '#6b6f78', { font: TVFONT, weight: 900 }); },
  fridgeBack(t, [hw, hh]) {            // the condenser coil and the compressor
    rect(-hw + 14, -hh + 12, hw * 2 - 28, hh * 1.25, '#3b414c', { lw: 2 });
    for (let i = 0; i < 9; i++) curve([[-hw + 18, -hh + 18 + i * 9], [hw - 18, -hh + 18 + i * 9]], 2, '#8d96a3', { w: 0 });
    for (let i = 0; i < 7; i++) curve([[-hw + 24 + i * 18, -hh + 14], [-hw + 24 + i * 18, -hh + 14 + hh * 1.2]], 1.4, '#5a606b', { w: 0 });
    blob(0, hh - 22, 26, 16, '#22252c', { lw: 2.2 }); txt('R600a', 0, hh - 22, 6, '#9aa3ae', { font: TVFONT, weight: 900 });
  },
  washerBack(t, [hw, hh]) { rect(-hw + 10, -hh + 8, 30, 20, '#c9cfd6', { lw: 2 }); curve([[hw - 20, -hh + 14], [hw - 10, 0], [hw - 24, hh - 4]], 6, '#7d8693', { w: 0 }); },
  fryerBack(t, [hw, hh]) { for (let i = 0; i < 3; i++) rect(-18, -hh + 12 + i * 10, 36, 5, '#15161a', { lw: 0 }); curve([[0, hh - 10], [8, hh + 6]], 5, '#111', { w: 0 }); },
  vents(t, [hw, hh]) { for (let i = 0; i < 5; i++) curve([[-hw + 8, -hh + 12 + i * 9], [hw - 8, -hh + 12 + i * 9]], 2, '#3b414c', { w: 0 }); },
  dehumFront(t, [hw, hh]) {
    for (let i = 0; i < 6; i++) curve([[-hw + 8, -hh + 10 + i * 7], [hw - 8, -hh + 10 + i * 7]], 2, '#8d96a3', { w: 0 });
    rect(-hw + 10, hh - 34, hw * 2 - 20, 24, 'rgba(120,180,240,.55)', { lw: 2 });           // the water tank
    rect(-hw + 12, hh - 22, hw * 2 - 24, 10, 'rgba(70,140,230,.75)', { lw: 0 });
  },
  vacTop(t, [r]) {
    blob(0, 0, r * .62, r * .62, '#2c3038', { lw: 1.8 }); blob(0, -r * .3, 6, 6, '#ff3b2f', { lw: 0 }); redGlow(0, -r * .3, 12, .6);
    txt('HOME', 0, r * .25, 5, '#8a929e', { font: TVFONT, weight: 900 });
  },
  pressBottom(t, [hw, hh]) { rect(-hw + 4, -hh + 4, hw * 2 - 8, hh * 2 - 8, '#c9d1db', { lw: 1.6 }); for (let i = -2; i <= 2; i++) curve([[-hw + 8, i * 7], [hw - 8, i * 7]], 1.4, '#8d96a3', { w: 0 }); },
};

/* ---------- the T-800 (Ep. 4): built from Βασίλης-grade appliances ----------
   height ≈ 540 units (≈ 1.7× a person at the same scale); head ≈ 1/8 of the height (heroic) */
const T800 = (() => {
  const bones = [
    { name: 'pelvis', at: [0, 0, 0] },
    { name: 'waist', parent: 'pelvis', at: [0, 20, 0] },
    { name: 'chest', parent: 'waist', at: [0, 62, 0] },
    { name: 'neck', parent: 'chest', at: [0, 128, 0] },
    { name: 'head', parent: 'neck', at: [0, 18, 0] },
  ];
  for (const [s, x] of [['l', -1], ['r', 1]]) {
    bones.push(
      { name: s + 'Sh', parent: 'chest', at: [x * 96, 108, 0] },
      { name: s + 'Elb', parent: s + 'Sh', at: [0, -104, 0] },
      { name: s + 'Wr', parent: s + 'Elb', at: [0, -92, 0] },
      { name: s + 'Jaw', parent: s + 'Wr', at: [0, -14, -24] },
      { name: s + 'Hip', parent: 'pelvis', at: [x * 36, -12, 0] },
      { name: s + 'Knee', parent: s + 'Hip', at: [0, -122, 0] },
      { name: s + 'Ank', parent: s + 'Knee', at: [0, -114, 0] });
  }
  const parts = [
    { id: 'pelvis', bone: 'pelvis', kind: 'box', size: [86, 36, 52], at: [0, -4, 0], mat: RMAT.joint, decals: { front: T8D.vents } },
    { id: 'washer', bone: 'waist', kind: 'box', size: [100, 66, 80], at: [0, 31, 0], mat: RMAT.white, decals: { front: T8D.washerFront, back: T8D.washerBack } },
    { id: 'fridge', bone: 'chest', kind: 'box', size: [158, 128, 92], at: [0, 64, 0], mat: RMAT.steel, decals: { front: T8D.fridgeFront, left: T8D.fridgeSide, right: T8D.fridgeSide, back: T8D.fridgeBack } },
    { id: 'neck', bone: 'neck', kind: 'cyl', r: 14, h: 28, at: [0, 6, 0], mat: RMAT.chrome, bands: [[-6, '#8d96a3'], [4, '#8d96a3']], bandW: 3 },
    { id: 'head', bone: 'head', kind: 'box', size: [72, 68, 66], at: [0, 36, 2], mat: RMAT.black, decals: { front: T8D.fryerFront, top: T8D.fryerTop, left: T8D.fryerSide, right: T8D.fryerSide, back: T8D.fryerBack } },
    { id: 'cableA', kind: 'cable', a: ['chest', [-30, 124, -30]], b: ['head', [-22, 10, -26]], sag: 10, w: 5 },
    { id: 'cableB', kind: 'cable', a: ['chest', [34, 124, -34]], b: ['head', [24, 8, -28]], sag: 14, w: 4, col: '#7a2a24' },
  ];
  for (const [s, x] of [['l', -1], ['r', 1]]) {
    const out = x < 0 ? 'left' : 'right';
    parts.push(
      { id: s + 'ShBall', bone: s + 'Sh', kind: 'sphere', r: 26, mat: RMAT.joint },
      { id: s + 'Pauldron', bone: s + 'Sh', kind: 'box', size: [78, 58, 84], at: [x * 18, 6, 0], rot: [0, 0, x * -.24], mat: RMAT.cream, decals: { [out]: T8D.acFan, front: T8D.acFront }, zBias: 4 },
      { id: s + 'Upper', bone: s + 'Sh', kind: 'cyl', r: 18, h: 94, at: [0, -52, 0], mat: RMAT.hose, bands: [[-30, '#4f5662'], [-18, '#4f5662'], [-6, '#4f5662'], [6, '#4f5662'], [18, '#4f5662'], [30, '#4f5662']], bandW: 3 },
      { id: s + 'ElbBall', bone: s + 'Elb', kind: 'sphere', r: 19, mat: RMAT.joint },
      { id: s + 'Fore', bone: s + 'Elb', kind: 'box', size: [48, 84, 50], at: [0, -46, 0], mat: RMAT.grey, decals: { front: T8D.vents } },
      { id: s + 'WrBall', bone: s + 'Wr', kind: 'sphere', r: 13, mat: RMAT.joint },
      { id: s + 'Palm', bone: s + 'Wr', kind: 'box', size: [56, 16, 52], at: [0, -22, 0], mat: RMAT.black, decals: { bottom: T8D.pressBottom } },
      { id: s + 'Jaw', bone: s + 'Jaw', kind: 'box', size: [56, 14, 52], at: [0, -24, 24], mat: RMAT.black, decals: { top: T8D.pressBottom } },
      { id: s + 'HipBall', bone: s + 'Hip', kind: 'sphere', r: 21, mat: RMAT.joint },
      { id: s + 'Thigh', bone: s + 'Hip', kind: 'cyl', r: 31, h: 112, at: [0, -60, 0], mat: RMAT.boiler, bands: [[38, '#3a7bd5'], [-38, '#3a7bd5']], bandW: 5 },
      { id: s + 'KneeBall', bone: s + 'Knee', kind: 'sphere', r: 22, mat: RMAT.joint },
      { id: s + 'KneeGuard', bone: s + 'Knee', kind: 'box', size: [46, 40, 18], at: [0, -4, 26], mat: RMAT.steel, zBias: 3 },
      { id: s + 'Shin', bone: s + 'Knee', kind: 'box', size: [60, 104, 62], at: [0, -58, 0], mat: RMAT.dehum, decals: { front: T8D.dehumFront } },
      { id: s + 'AnkBall', bone: s + 'Ank', kind: 'sphere', r: 15, mat: RMAT.joint },
      { id: s + 'Foot', bone: s + 'Ank', kind: 'cyl', r: 44, h: 16, at: [0, -20, 10], mat: RMAT.vac, bands: [[0, '#8a929e']], bandW: 4, n: 22, decals: { top: T8D.vacTop } },
      { id: s + 'PistonLeg', kind: 'piston', a: [s + 'Hip', [x * 10, -24, -32]], b: [s + 'Knee', [x * 10, 30, -32]], w: 9 },
      { id: s + 'PistonArm', kind: 'piston', a: [s + 'Sh', [x * 6, -20, -18]], b: [s + 'Elb', [x * 6, 22, -22]], w: 7 },
    );
  }
  const feet = [['lAnk', [0, -28, 10]], ['rAnk', [0, -28, 10]]];  // the bottoms of the vacuum discs

  /* ---------- poses (radians; see robot3d.js: x = swing (− = forward for limbs hanging down), z = raise sideways) ---------- */
  const P = {
    idle: { lSh: [0, 0, -.14], rSh: [0, 0, .14], lElb: [-.25, 0, 0], rElb: [-.25, 0, 0], lHip: [0, 0, -.05], rHip: [0, 0, .05] },
    crouch: {   // the arrival: one knee and one fist on the ground, head down
      chest: [.42, 0, 0], head: [.35, 0, 0], lSh: [-.55, 0, -.25], lElb: [-.4, 0, 0], rSh: [.15, 0, .3], rElb: [-.6, 0, 0],
      lHip: [-1.35, 0, -.08], lKnee: [1.9, 0, 0], lAnk: [-.55, 0, 0], rHip: [.1, 0, .12], rKnee: [2.25, 0, 0], rAnk: [-.9, 0, 0] },
    guard: { chest: [.1, 0, 0], lSh: [-.9, 0, -.3], lElb: [-1.5, 0, 0], rSh: [-.6, 0, .3], rElb: [-1.7, 0, 0], lHip: [-.25, 0, -.1], lKnee: [.45, 0, 0], lAnk: [-.2, 0, 0], rHip: [.2, 0, .1], rKnee: [.3, 0, 0], rAnk: [-.1, 0, 0] },
    punch: { chest: [.18, -.35, 0], head: [0, .2, 0], lSh: [-.5, 0, -.3], lElb: [-1.6, 0, 0], rSh: [-1.55, 0, .05], rElb: [-.05, 0, 0], lHip: [-.35, 0, -.1], lKnee: [.5, 0, 0], lAnk: [-.15, 0, 0], rHip: [.3, 0, .1], rKnee: [.15, 0, 0] },
    hit: { chest: [-.32, .25, .1], head: [-.35, -.3, .1], lSh: [.5, 0, -.7], lElb: [-.5, 0, 0], rSh: [.6, 0, .8], rElb: [-.6, 0, 0], lHip: [.15, 0, -.12], lKnee: [.2, 0, 0], rHip: [-.2, 0, .15], rKnee: [.4, 0, 0] },
    scan: { head: [.05, .5, 0], chest: [0, .15, 0], lSh: [0, 0, -.2], rSh: [-.3, 0, .2], rElb: [-1.1, 0, 0] },
  };
  /* ---------- walk cycle by inverse kinematics ----------
     The feet are placed, not swung: in stance the planted ankle slides back at a constant speed relative to the pelvis
     (so with the root moving forward at WALK_SPEED the foot stays still on the ground: no skating), in swing it arcs
     forward. Two-bone IK in the leg's swing plane gives the hip and knee; the ankle keeps the foot level.
     WALK_SPEED: model units per radian of phase (multiply by the scale and the phase rate in the scene). */
  const THIGH = 122, SHIN = 114, STRIDE = 58, LIFT = 34, HIP_DROP = 222;
  function legIK(z, y) {   // ankle target (z forward, y up) relative to the hip → [hip rx, knee rx, ankle rx]
    let D = Math.hypot(z, y); D = Math.min(D, THIGH + SHIN - .5);
    const phi = Math.atan2(-z, -y);
    const al = Math.acos(clamp((THIGH * THIGH + D * D - SHIN * SHIN) / (2 * THIGH * D), -1, 1));
    const be = Math.acos(clamp((THIGH * THIGH + SHIN * SHIN - D * D) / (2 * THIGH * SHIN), -1, 1));
    const hip = phi - al, knee = Math.PI - be;
    return [hip, knee, -(hip + knee)];
  }
  function footAt(u, k) {   // u in [0,1): 0–.5 stance (front → back), .5–1 swing (back → front)
    if (u < .5) { const v = u / .5; return [STRIDE * k * (1 - 2 * v), -HIP_DROP]; }
    const v = (u - .5) / .5, e = ease(v);
    return [STRIDE * k * (2 * e - 1), -HIP_DROP + Math.sin(v * Math.PI) * LIFT * k];
  }
  function walk(ph, amt = 1) {
    const k = amt, u = ((ph / TAU) % 1 + 1) % 1, s = Math.sin(ph);
    const [lz, ly] = footAt(u, k), [rz, ry] = footAt((u + .5) % 1, k);
    const L = legIK(lz, ly), Rr = legIK(rz, ry);
    return {
      chest: [.06 * k, .08 * s * k, 0], head: [0, -.06 * s * k, 0],
      lHip: [L[0], 0, -.05], lKnee: [L[1], 0, 0], lAnk: [L[2], 0, 0],
      rHip: [Rr[0], 0, .05], rKnee: [Rr[1], 0, 0], rAnk: [Rr[2], 0, 0],
      lSh: [.32 * s * k, 0, -.14], rSh: [-.32 * s * k, 0, .14], lElb: [-.3 - .15 * Math.max(0, -s) * k, 0, 0], rElb: [-.3 - .15 * Math.max(0, s) * k, 0, 0],
    };
  }
  const WALK_SPEED = 2 * STRIDE / Math.PI;   // the stance foot travels 2·STRIDE in half a cycle (π radians)
  /* the hands are sandwich presses: open (0..1) adds to any pose */
  const open = (pose, l, r) => Object.assign({}, pose, { lJaw: [-1.1 * l, 0, 0], rJaw: [-1.1 * r, 0, 0] });

  /* assembly order (sc. 13): feet up to the head, each part locks onto the skeleton on a beat */
  const order = ['lFoot', 'rFoot', 'lAnkBall', 'rAnkBall', 'lShin', 'rShin', 'lKneeBall', 'rKneeBall', 'lKneeGuard', 'rKneeGuard', 'lThigh', 'rThigh', 'lHipBall', 'rHipBall', 'lPistonLeg', 'rPistonLeg',
    'pelvis', 'washer', 'fridge', 'lShBall', 'rShBall', 'lPauldron', 'rPauldron', 'lUpper', 'rUpper', 'lPistonArm', 'rPistonArm', 'lElbBall', 'rElbBall', 'lFore', 'rFore', 'lWrBall', 'rWrBall', 'lPalm', 'rPalm', 'lJaw', 'rJaw',
    'neck', 'cableA', 'cableB', 'head'];
  /* the assembly state at progress k (0..1): each part flies in from the container (off to one side) and snaps */
  /* from: where the container is, relative to the robot's pelvis, in model units; each part rises out of it on an arc */
  function assembly(k, from = [-760, -200, -120]) {
    const out = {}, n = order.length;
    order.forEach((id, i) => {
      const a = i / n * .85, kk = clamp((k - a) / .15);
      out[id] = { k: kk < 1 ? ease(kk) * .999 : 1, from: [from[0] + (i % 3 - 1) * 40, from[1] - (i % 4) * 20, from[2]], arc: 260 + (i % 5) * 40, spin: [(i % 2 ? 1 : -1) * 2.4, (i % 3) * 1.6, (i % 4 - 1.5) * 1.2] };
    });
    return out;
  }
  /* the time at which part i of the assembly snaps (for the click / spark sound and effect) */
  const snapTimes = (t0, dur) => order.map((id, i) => ({ id, t: t0 + (i / order.length * .85 + .15) * dur }));
  return { bones, parts, feet, P, walk, WALK_SPEED, legIK, open, order, assembly, snapTimes };
})();
