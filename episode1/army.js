/* =========================================================
   «Η Έξυπνη Σίτα» – armies and swarms (graphics v2, from Episode 4 on)
   Hundreds of the σίτα's machines in a frame. Each unit type is a small STRUCTURED model (robot3d.js); it is drawn
   once per view angle into a small canvas (an impostor) and reused, so a swarm costs a few hundred drawImage calls.
   A unit's whole life is a closed-form function of time: spawn, a path to its target with seeded wobble, an
   optional death (hit → spark, spin, fall, a dead dark husk on the ground). Nothing is simulated frame to frame,
   so any frame renders alone and the QA's NONDET check stays clean.
   Faction look: the σίτα's machines have red LEDs and cold metal (the humans are warm), for clarity in a melee.
   Load after robot3d.js and robots.js (uses redGlow, RMAT, T8D).
   ========================================================= */
const ARMY = (() => {
  /* ---------- unit models ---------- */
  const one = name => [{ name, at: [0, 0, 0] }];
  const M = {
    vac: { bones: one('b'), feet: [['b', [0, -8, 0]]], parts: [
      { id: 'body', bone: 'b', kind: 'cyl', r: 40, h: 14, mat: RMAT.vac, bands: [[0, '#8a929e']], bandW: 4, n: 22, decals: { top: T8D.vacTop } },
      { id: 'brushL', kind: 'cable', a: ['b', [-30, -4, 26]], b: ['b', [-46, -6, 40]], sag: 2, w: 3, col: '#9aa3ae' },
      { id: 'brushR', kind: 'cable', a: ['b', [30, -4, 26]], b: ['b', [46, -6, 40]], sag: 2, w: 3, col: '#9aa3ae' }] },
    drone: { bones: one('b'), feet: [['b', [0, -10, 0]]], parts: [
      { id: 'body', bone: 'b', kind: 'box', size: [40, 16, 44], mat: RMAT.black, decals: { front: (t, [hw, hh]) => { blob(0, 0, 6, 6, '#ff3b2f', { lw: 0 }); } } },
      { id: 'a1', bone: 'b', kind: 'box', size: [78, 6, 7], rot: [0, .785, 0], mat: RMAT.joint },
      { id: 'a2', bone: 'b', kind: 'box', size: [78, 6, 7], rot: [0, -.785, 0], mat: RMAT.joint },
      ...[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([x, z], i) => ({ id: 'r' + i, bone: 'b', kind: 'cyl', r: 17, h: 2, at: [x * 27, 6, z * 27], mat: { col: '#c9cfd6' }, n: 14, lw: 1.6 }))] },
    bulb: { bones: one('b'), feet: [['b', [0, -26, 0]]], parts: [
      { id: 'base', bone: 'b', kind: 'cyl', r: 10, h: 16, at: [0, -16, 0], mat: RMAT.chrome, bands: [[-4, '#7d8693'], [3, '#7d8693']], bandW: 2 },
      { id: 'glass', bone: 'b', kind: 'sphere', r: 22, at: [0, 12, 0], mat: { col: '#fff3c4', spec: .8 } }] },
    racket: { bones: one('b'), feet: [['b', [0, -60, 0]]], parts: [
      { id: 'handle', bone: 'b', kind: 'cyl', r: 6, h: 54, at: [0, -32, 0], mat: { col: '#e8c13a' }, n: 10 },
      { id: 'head', bone: 'b', kind: 'box', size: [74, 92, 6], at: [0, 42, 0], mat: { col: '#e8c13a' },
        decals: { front: (t, [hw, hh]) => { rect(-hw + 6, -hh + 6, hw * 2 - 12, hh * 2 - 12, '#1d2a36', { lw: 1.4 }); for (let i = -3; i <= 3; i++) { curve([[i * 9, -hh + 6], [i * 9, hh - 6]], 1, '#7fb8ff', { w: 0 }); curve([[-hw + 6, i * 11], [hw - 6, i * 11]], 1, '#7fb8ff', { w: 0 }); } } } }] },
  };
  /* ---------- impostors: one small canvas per (kind, yaw bucket, pitch bucket, dead) ---------- */
  const IMP = {}, YAWS = 12, PX = 1.6;   // impostors are drawn at 1.6× their base size for crisp downscaling
  function impostor(kind, yawB, dead) {
    const key = kind + '|' + yawB + '|' + (dead ? 1 : 0);
    if (IMP[key]) return IMP[key];
    const size = 220, c = document.createElement('canvas'); c.width = c.height = size;
    const x = c.getContext('2d'), main = ctx;
    ctx = x;
    try {
      ctx.save();
      R3.draw(M[kind], { x: size / 2, y: size / 2 + 10, s: PX, yaw: yawB / YAWS * TAU, pitch: .35, t: 0, ink: dead ? '#120d14' : INK });
      if (dead) { ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = 'rgba(25,18,24,.62)'; ctx.fillRect(0, 0, size, size); }
      ctx.restore();
    } finally { ctx = main; }
    return IMP[key] = c;
  }
  /* ---------- swarms ----------
     o: { seed, n, kind, t0 (start), spread (s over which units launch), from: [x, y] or (i) => [x, y],
          to: (i, t, u) => [x, y] where u = this unit's 0..1 journey, dur: travel time (s), size: [min, max] (screen px),
          wob: wobble amplitude (px), hover: true (flyers bob), ground: y (walkers stay on it), killAt: (i) => time | null,
          faces: 'target' | number (a fixed yaw) } */
  function swarm(o) {
    const S = { ...o, units: [] };
    for (let i = 0; i < o.n; i++) {
      const r = k => hash(i * 17.13 + (o.seed || 0) * 3.7 + k * 1.91);
      const depth = r(2);   // 0 far … 1 near
      S.units.push({ i, ts: o.t0 + r(1) * (o.spread ?? 1), size: lerp(o.size[0], o.size[1], depth), depth, gy: o.band ? lerp(o.band[0], o.band[1], depth) : o.ground, ph: r(3) * TAU, wf: .6 + r(4) * 1.4, td: o.killAt ? o.killAt(i) : null, r });
    }
    return S;
  }
  /* position of unit u at time t (before any death) */
  function at(S, u, t) {
    const from = typeof S.from === 'function' ? S.from(u.i) : S.from;
    const k = clamp((t - u.ts) / (S.dur || 2));
    const to = S.to(u.i, t, k), e = S.ease ? S.ease(k) : 1 - Math.pow(1 - k, 2.2);
    const wob = (S.wob ?? 18) * (S.hover ? 1 : .3);
    let x = lerp(from[0], to[0], e) + Math.sin(t * u.wf * 2.3 + u.ph) * wob;
    let y = lerp(from[1], to[1], e) + (S.hover ? Math.sin(t * u.wf * 3.1 + u.ph * 1.7) * wob * .6 : 0);
    if (u.gy != null && !S.hover) y = u.gy;
    return [x, y, k];
  }
  /* everything about one unit at time t: where, how big, which way, alive or falling or dead */
  function state(S, u, t) {
    if (t < u.ts) return null;
    if (u.td != null && t >= u.td) {
      const [x0, y0] = at(S, u, u.td), dt = t - u.td, g = u.gy ?? S.ground ?? 640;
      const fall = S.hover ? Math.min(g, y0 + 260 * dt + 900 * dt * dt) : y0;
      const x = x0 + (u.r(5) - .5) * 240 * Math.min(dt, .6);
      return { x, y: fall, s: u.size, yaw: u.r(6) * TAU + dt * 9 * (fall < g ? 1 : 0), dead: true, dt, landed: fall >= g };
    }
    const [x, y, k] = at(S, u, t);
    let yaw;
    if (typeof S.faces === 'number') yaw = S.faces;
    else { const [x2] = at(S, u, t + .05); yaw = x2 >= x ? -Math.PI / 2 : Math.PI / 2; if (Math.abs(x2 - x) < .3) yaw = S.idleYaw ?? .3; }
    if (S.spin) yaw += t * S.spin * (u.i % 2 ? 1 : -1);
    return { x, y, s: u.size, yaw, dead: false, k };
  }
  /* draw a swarm's bodies, back to front by size (small = far) */
  function draw(S, t) {
    const list = [];
    for (const u of S.units) { const st = state(S, u, t); if (st) list.push([u, st]); }
    list.sort((a, b) => a[1].s - b[1].s || a[1].y - b[1].y);
    for (const [u, st] of list) {
      const yb = ((Math.round(st.yaw / TAU * YAWS) % YAWS) + YAWS) % YAWS, img = impostor(S.kind, yb, st.dead);
      const w = st.s * 220 / (PX * 100);   // impostor canvas units → screen: a unit of `size` px is ~100 model units wide
      const gy = u.gy ?? S.ground;
      if ((gy != null && !S.hover) || st.landed) { ctx.save(); ctx.globalAlpha = .22; ctx.fillStyle = '#140f18'; ctx.beginPath(); ctx.ellipse(st.x, (st.landed ? st.y : gy) + 4, st.s * .45, st.s * .08, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      ctx.drawImage(img, st.x - w / 2, st.y - w / 2 - 10 * w / 220, w, w);
    }
  }
  /* the emissive pass: LED glows on the living, sparks and smoke at each death (call inside the emit layer) */
  function emit(S, t) {
    for (const u of S.units) {
      const st = state(S, u, t); if (!st) continue;
      if (!st.dead) {
        if (S.kind === 'bulb') { const hue = S.bulbCol ? S.bulbCol(u.i, t) : `rgba(255,${Math.floor(60 + 60 * Math.sin(t * 9 + u.ph))},50,1)`; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(st.x, st.y - st.s * .1, 0, st.x, st.y - st.s * .1, st.s * .9); g.addColorStop(0, hue); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(st.x, st.y - st.s * .1, st.s * .9, 0, TAU); ctx.fill(); ctx.restore(); }
        else redGlow(st.x, st.y - st.s * .05, st.s * .16, .35 + .25 * Math.sin(t * 7 + u.ph));
        if (S.kind === 'racket' && Math.sin(t * 5 + u.ph * 3) > .85) {   // a short crackle across the mesh, now and then
          ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(150,210,255,.9)'; ctx.lineWidth = 1.4; ctx.beginPath();
          const n = 6, x0 = st.x - st.s * .25, y0 = st.y - st.s * .3, tk = Math.floor(t * 24);
          for (let k = 0; k <= n; k++) { const xx = x0 + k / n * st.s * .5, yy = y0 + (hash(k * 7.1 + tk * 1.3 + u.i) - .5) * st.s * .18; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
          ctx.stroke(); ctx.restore();
        }
      } else if (st.dt < .6) {
        fxBurst(t, u.td, st.x, st.y, { kind: 'spark', n: 14, speed: 320, life: .5, seed: u.i * 3 });
      }
    }
  }
  /* screen points of the living units (for lasers, lights, aiming) */
  function alive(S, t) { const out = []; for (const u of S.units) { const st = state(S, u, t); if (st && !st.dead) out.push({ i: u.i, x: st.x, y: st.y, s: st.s }); } return out; }
  return { M, swarm, draw, emit, alive, state, impostor };
})();
