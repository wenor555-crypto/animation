/* =========================================================
   «Η Έξυπνη Σίτα» – structured robots (from Episode 4 on)
   A small pseudo-3D renderer for machines: a real skeleton (bones with local rotations), and parts bound to the
   bones (boxes, cylinders, spheres, pistons, cables) drawn with cel shading and ink. The same code draws every view
   (front, 3/4, profile, back) and every pose, so a model sheet and the animation can never disagree.
   Orthographic projection, painter's sort by depth. Everything is a pure function of its inputs (no state): the
   frame QA's NONDET check stays clean.
   Model space: x right, y UP, z towards the camera (a robot at yaw 0 faces the viewer). Units ≈ px at scale 1.
   Load after engine.js.
   ========================================================= */
const R3 = (() => {
  /* ---------- 3×3 matrices (row-major) ---------- */
  const I = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const rx = a => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, -s, 0, s, c]; };
  const ry = a => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 1, 0, -s, 0, c]; };
  const rz = a => { const c = Math.cos(a), s = Math.sin(a); return [c, -s, 0, s, c, 0, 0, 0, 1]; };
  const mm = (A, B) => [
    A[0] * B[0] + A[1] * B[3] + A[2] * B[6], A[0] * B[1] + A[1] * B[4] + A[2] * B[7], A[0] * B[2] + A[1] * B[5] + A[2] * B[8],
    A[3] * B[0] + A[4] * B[3] + A[5] * B[6], A[3] * B[1] + A[4] * B[4] + A[5] * B[7], A[3] * B[2] + A[4] * B[5] + A[5] * B[8],
    A[6] * B[0] + A[7] * B[3] + A[8] * B[6], A[6] * B[1] + A[7] * B[4] + A[8] * B[7], A[6] * B[2] + A[7] * B[5] + A[8] * B[8]];
  const mv = (A, v) => [A[0] * v[0] + A[1] * v[1] + A[2] * v[2], A[3] * v[0] + A[4] * v[1] + A[5] * v[2], A[6] * v[0] + A[7] * v[1] + A[8] * v[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  /* local joint rotation from a pose entry [x, y, z] (radians): R = Rz · Rx · Ry
     (x = swing forward/back, z = raise sideways, y = twist) */
  const euler = e => e ? mm(rz(e[2] || 0), mm(rx(e[0] || 0), ry(e[1] || 0))) : I;

  /* ---------- colour ---------- */
  const hex = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };
  const shadeCache = {};
  function tones(base) {             // [light, mid, dark, deep]
    return shadeCache[base] || (shadeCache[base] = [mix(base, '#ffffff', .22), base, mix(base, '#1a1420', .32), mix(base, '#1a1420', .55)]);
  }
  const LIGHT = norm([-.45, .7, .55]);

  /* ---------- skeleton ---------- */
  /* model.bones: [{ name, parent, at: [x,y,z] (joint position in the parent's frame at rest) }], parents first */
  function solve(model, pose = {}, opt = {}) {
    const W = {};
    for (const b of model.bones) {
      const P = b.parent ? W[b.parent] : { R: opt.rootR || I, p: opt.rootP || [0, 0, 0] };
      const R = mm(P.R, euler(pose[b.name]));
      W[b.name] = { R, p: b.parent ? add(P.p, mv(P.R, b.at)) : add(P.p, b.at || [0, 0, 0]) };
    }
    return W;
  }

  /* ---------- the view: model space → screen ---------- */
  function viewOf(o) {
    const V = mm(rx(o.pitch || 0), ry(o.yaw || 0)), s = o.s ?? 1, X = o.x ?? 640, Y = o.y ?? 400;
    return {
      V, s,
      proj: p => { const q = mv(V, p); return [X + q[0] * s, Y - q[1] * s, q[2]]; },
      dir: v => mv(V, v),
    };
  }

  /* ---------- geometry of the parts ---------- */
  const BOX_FACES = [   // [normal, U axis, V axis (V points DOWN on the face as drawn), name]
    [[0, 0, 1], [1, 0, 0], [0, -1, 0], 'front'], [[0, 0, -1], [-1, 0, 0], [0, -1, 0], 'back'],
    [[1, 0, 0], [0, 0, -1], [0, -1, 0], 'right'], [[-1, 0, 0], [0, 0, 1], [0, -1, 0], 'left'],
    [[0, 1, 0], [1, 0, 0], [0, 0, 1], 'top'], [[0, -1, 0], [1, 0, 0], [0, 0, -1], 'bottom']];

  /* world placement of a part: bone frame · part offset · part rotation (+ assembly fly-in) */
  function place(W, part, asm) {
    const B = W[part.bone];
    let R = part.rot ? mm(B.R, euler(part.rot)) : B.R, c = add(B.p, mv(B.R, part.at || [0, 0, 0]));
    if (asm) {
      const k = asm.k;
      if (k < 1) {   // fly in from `from` (relative to the final place) along an arc of height `arc`, spinning, and snap
        const e = 1 - k;
        c = add(add(c, scl(asm.from || [0, 400, 0], e)), [0, Math.sin(Math.PI * k) * (asm.arc ?? 0), 0]);
        R = mm(R, euler([asm.spin ? asm.spin[0] * e : 0, asm.spin ? asm.spin[1] * e : 0, asm.spin ? asm.spin[2] * e : 0]));
      }
    }
    return { R, c };
  }

  function faceShade(nv, mat, o) {
    const d = dot(norm(nv), LIGHT), T = tones(mat.col);
    let col = d > .55 ? T[0] : d > .12 ? T[1] : d > -.25 ? T[2] : T[3];
    return col;
  }

  /* rim light: o.rim = { dir: [x, y, z] (view space, pointing FROM the light), col, k } */
  function rimK(nv, o) {
    if (!o.rim) return 0;
    const d = dot(norm(nv), norm(scl(o.rim.dir, -1)));
    return d > .35 ? (o.rim.k ?? .55) * clamp((d - .35) / .4) : 0;
  }

  function quadPath(pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }

  function fillFace(pts, col, o, ink = true, lw = 2.4) {
    quadPath(pts); ctx.fillStyle = col; ctx.fill();
    if (ink) { ctx.lineJoin = 'round'; ctx.lineWidth = lw * (o.inkScale ?? 1); ctx.strokeStyle = o.ink || INK; ctx.stroke(); }
    else { ctx.lineWidth = .8; ctx.strokeStyle = col; ctx.stroke(); }   // hide seams between facets
  }

  /* a decal or detail drawn in the plane of a face: (u, v) in part units from the face centre, v down */
  function onFace(view, c, U, Vd, draw) {
    const o = view.proj(c), pu = view.proj(add(c, U)), pv = view.proj(add(c, Vd));
    ctx.save(); ctx.transform(pu[0] - o[0], pu[1] - o[1], pv[0] - o[0], pv[1] - o[1], o[0], o[1]); draw(); ctx.restore();
  }

  function emitBox(list, view, part, pl, o) {
    const [w, h, d] = part.size, hw = w / 2, hh = h / 2, hd = d / 2, mat = part.mat;
    for (const [n, u, v, name] of BOX_FACES) {
      const nw = mv(pl.R, n), nv = view.dir(nw);
      if (nv[2] <= 1e-3) continue;
      const half = name === 'front' || name === 'back' ? [hw, hh, hd] : name === 'right' || name === 'left' ? [hd, hh, hw] : [hw, hd, hh];
      const cw = add(pl.c, mv(pl.R, [n[0] * hw, n[1] * hh, n[2] * hd]));
      const Uw = mv(pl.R, scl(u, half[0])), Vw = mv(pl.R, scl(v, half[1]));
      const corners = [add(add(cw, scl(Uw, -1)), scl(Vw, -1)), add(add(cw, Uw), scl(Vw, -1)), add(add(cw, Uw), Vw), add(add(cw, scl(Uw, -1)), Vw)].map(view.proj);
      const z = view.proj(cw)[2] + (part.zBias || 0);
      list.push({ z, draw: () => {
        fillFace(corners, faceShade(nv, mat, o), o, true, part.lw || 2.4);
        const rk = rimK(nv, o); if (rk) { ctx.save(); ctx.globalAlpha = rk; ctx.globalCompositeOperation = 'screen'; quadPath(corners); ctx.fillStyle = o.rim.col; ctx.fill(); ctx.restore(); }
        if (mat.spec && nv[2] > .3) {   // a chrome glint: a soft diagonal band across the face
          ctx.save(); quadPath(corners); ctx.clip(); onFace(view, cw, mv(pl.R, u), mv(pl.R, v), () => {
            ctx.globalAlpha = .28 * mat.spec; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-half[0] * .2, -half[1] * 1.2); ctx.lineTo(half[0] * .25, -half[1] * 1.2); ctx.lineTo(-half[0] * .25, half[1] * 1.2); ctx.lineTo(-half[0] * .7, half[1] * 1.2); ctx.closePath(); ctx.fill(); }); ctx.restore();
        }
        const dec = part.decals && part.decals[name];
        if (dec) onFace(view, cw, mv(pl.R, u), mv(pl.R, v), () => dec(o.t || 0, half, o));
      } });
    }
  }

  /* a cylinder along its local y axis: faceted sides without inner ink, ink on the caps and on the silhouette edges */
  function emitCyl(list, view, part, pl, o) {
    const r = part.r, h = part.h, n = part.n || 18, mat = part.mat;
    const ax = mv(pl.R, [0, 1, 0]), top = add(pl.c, scl(ax, h / 2)), bot = add(pl.c, scl(ax, -h / 2));
    const ring = [];
    for (let i = 0; i < n; i++) { const a = i / n * TAU; ring.push(mv(pl.R, [Math.cos(a) * r, 0, Math.sin(a) * r])); }
    const vis = [], sides = [];
    for (let i = 0; i < n; i++) {
      const a = (i + .5) / n * TAU, nw = mv(pl.R, [Math.cos(a), 0, Math.sin(a)]), nv = view.dir(nw);
      vis.push(nv[2] > 0);
      if (nv[2] <= 0) continue;
      const j = (i + 1) % n, q = [add(top, ring[i]), add(top, ring[j]), add(bot, ring[j]), add(bot, ring[i])].map(view.proj);
      sides.push({ q, col: faceShade(nv, mat, o), rk: rimK(nv, o) });
    }
    const zc = view.proj(pl.c)[2] + (part.zBias || 0);
    const edges = [];
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; if (vis[i] !== vis[j]) edges.push([view.proj(add(top, ring[j])), view.proj(add(bot, ring[j]))]); }
    list.push({ z: zc, draw: () => {
      for (const s of sides) { fillFace(s.q, s.col, o, false); if (s.rk) { ctx.save(); ctx.globalAlpha = s.rk; ctx.globalCompositeOperation = 'screen'; quadPath(s.q); ctx.fillStyle = o.rim.col; ctx.fill(); ctx.restore(); } }
      if (part.bands) for (const [y0, col] of part.bands) {   // painted rings around the cylinder (labels, hose ribs)
        ctx.save(); ctx.lineWidth = (part.bandW || 6) * view.s; ctx.strokeStyle = col; ctx.beginPath();
        let started = false;
        for (let i = 0; i <= n; i++) { const k = i % n; if (!vis[k] && !vis[(k + n - 1) % n]) { started = false; continue; } const p = view.proj(add(add(pl.c, scl(ax, y0)), ring[k])); started ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); started = true; }
        ctx.stroke(); ctx.restore();
      }
      ctx.lineWidth = (part.lw || 2.4) * (o.inkScale ?? 1); ctx.strokeStyle = o.ink || INK; ctx.lineCap = 'round';
      for (const [a, b] of edges) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    } });
    for (const [cc, sgn, name] of [[top, 1, 'top'], [bot, -1, 'bottom']]) {
      const nv = view.dir(scl(ax, sgn));
      if (nv[2] <= 1e-3) continue;
      const pts = ring.map(v => view.proj(add(cc, v)));
      list.push({ z: view.proj(cc)[2] + (part.zBias || 0) + .01, draw: () => {
        fillFace(pts, faceShade(nv, mat, o), o, true, part.lw || 2.4);
        const dec = part.decals && part.decals[name];
        if (dec) onFace(view, cc, mv(pl.R, [1, 0, 0]), mv(pl.R, [0, 0, sgn]), () => dec(o.t || 0, [r, r], o));
      } });
    }
  }

  function emitSphere(list, view, part, pl, o) {
    const p = view.proj(pl.c), r = part.r * view.s, T = tones(part.mat.col);
    list.push({ z: p[2] + (part.zBias || 0), draw: () => {
      ctx.save();
      ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fillStyle = T[1]; ctx.fill();
      ctx.clip();
      ctx.beginPath(); ctx.arc(p[0] + r * .45, p[1] + r * .5, r * 1.05, 0, TAU); ctx.fillStyle = T[2]; ctx.fill();
      ctx.beginPath(); ctx.arc(p[0] - r * .32, p[1] - r * .36, r * .42, 0, TAU); ctx.fillStyle = T[0]; ctx.fill();
      if (part.mat.spec) { ctx.beginPath(); ctx.arc(p[0] - r * .35, p[1] - r * .4, r * .16, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fill(); }
      ctx.restore();
      ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.lineWidth = (part.lw || 2.4) * (o.inkScale ?? 1); ctx.strokeStyle = o.ink || INK; ctx.stroke();
    } });
  }

  /* a hydraulic piston between two bone-space points: dark sleeve + chrome rod */
  function emitPiston(list, view, part, W, o) {
    const A = add(W[part.a[0]].p, mv(W[part.a[0]].R, part.a[1])), B = add(W[part.b[0]].p, mv(W[part.b[0]].R, part.b[1]));
    const pa = view.proj(A), pb = view.proj(B), m = [lerp(pa[0], pb[0], .55), lerp(pa[1], pb[1], .55)];
    const w = (part.w || 9) * view.s;
    list.push({ z: (pa[2] + pb[2]) / 2 + (part.zBias || 0), draw: () => {
      ctx.save(); ctx.lineCap = 'round';
      const seg = (p, q, wd, col) => { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.lineWidth = wd + 4.4; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = wd; ctx.strokeStyle = col; ctx.stroke(); };
      seg(m, pb, w * .55, '#d7dde6'); seg(pa, m, w, '#3a3f49');
      ctx.restore();
    } });
  }

  /* a cable: a sagging curve between two bone-space points */
  function emitCable(list, view, part, W, o) {
    const A = add(W[part.a[0]].p, mv(W[part.a[0]].R, part.a[1])), B = add(W[part.b[0]].p, mv(W[part.b[0]].R, part.b[1]));
    const pa = view.proj(A), pb = view.proj(B), sag = (part.sag ?? 20) * view.s;
    const sway = part.sway ? Math.sin((o.t || 0) * 3 + (part.seed || 0)) * part.sway * view.s : 0;
    list.push({ z: (pa[2] + pb[2]) / 2 + (part.zBias || -2), draw: () => {
      ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(pa[0], pa[1]);
      ctx.quadraticCurveTo((pa[0] + pb[0]) / 2 + sway, (pa[1] + pb[1]) / 2 + sag, pb[0], pb[1]);
      ctx.lineWidth = (part.w || 5) * view.s + 3.6; ctx.strokeStyle = INK; ctx.stroke();
      ctx.lineWidth = (part.w || 5) * view.s; ctx.strokeStyle = part.col || '#2d2f36'; ctx.stroke(); ctx.restore();
    } });
  }

  /* ---------- draw a model ----------
     o: { x, y, s, yaw, pitch, t, pose, asm: { partId: { k, from, spin } }, hide: Set, rim, ink, ground (screen y) } */
  function draw(model, o = {}) {
    const W = solve(model, o.pose || {}, o), view = viewOf(o), list = [];
    for (const part of model.parts) {
      if (o.hide && o.hide.has(part.id)) continue;
      const asm = o.asm && part.id in o.asm ? o.asm[part.id] : null;
      if (asm && asm.k <= 0) continue;
      if (part.kind === 'piston') { emitPiston(list, view, part, W, o); continue; }
      if (part.kind === 'cable') { emitCable(list, view, part, W, o); continue; }
      const pl = place(W, part, asm);
      if (part.kind === 'box') emitBox(list, view, part, pl, o);
      else if (part.kind === 'cyl') emitCyl(list, view, part, pl, o);
      else if (part.kind === 'sphere') emitSphere(list, view, part, pl, o);
    }
    if (o.ground != null) {   // a soft contact shadow under the lowest point
      const pts = model.feet ? model.feet.map(f => view.proj(add(W[f[0]].p, mv(W[f[0]].R, f[1])))) : [];
      const xs = pts.map(p => p[0]); const cx = xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : o.x;
      const wd = xs.length ? Math.max(...xs) - Math.min(...xs) + 90 * view.s : 120;
      ctx.save(); ctx.globalAlpha = .28; ctx.fillStyle = '#140f18'; ctx.beginPath(); ctx.ellipse(cx, o.ground, wd / 2, 14 * view.s, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
    list.sort((a, b) => a.z - b.z);
    ctx.save(); for (const it of list) it.draw(); ctx.restore();
    return { W, view };
  }

  /* screen position of a bone-space point (for effects anchored to the robot: the eye glow, muzzle flashes, sparks) */
  function point(model, o, bone, local = [0, 0, 0]) {
    const W = solve(model, o.pose || {}, o), view = viewOf(o);
    return view.proj(add(W[bone].p, mv(W[bone].R, local)));
  }

  /* the screen y of the lowest foot point for a pose (so a walk can plant its feet on the ground) */
  function lowestY(model, o) {
    const W = solve(model, o.pose || {}, o), view = viewOf(o);
    let m = -1e9; for (const f of model.feet || []) m = Math.max(m, view.proj(add(W[f[0]].p, mv(W[f[0]].R, f[1])))[1]);
    return m;
  }

  /* blend two poses */
  function blend(a, b, k) {
    const out = {}, keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const n of keys) { const A = a[n] || [0, 0, 0], B = b[n] || [0, 0, 0]; out[n] = [lerp(A[0] || 0, B[0] || 0, k), lerp(A[1] || 0, B[1] || 0, k), lerp(A[2] || 0, B[2] || 0, k)]; }
    return out;
  }

  return { draw, point, lowestY, blend, solve, tones, mix, rx, ry, rz, mm, mv, euler };
})();
