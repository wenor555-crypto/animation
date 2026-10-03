/* =========================================================
   «Η Έξυπνη Σίτα» – effects v2 and battle choreography (graphics v2, from Episode 4 on)
   Explosions in layers, each a pure function of time since the blast:
     body pass  (normal):   the smoke column (lit from below while the fire burns), debris that spins and bounces,
                            the scorch mark that stays
     emit pass  (emissive): the flash, the fireball (white → yellow → orange → red), the shockwave ring, embers,
                            secondary pops
   Call the body part in a normal layer and the emit part inside RV2.frame's emit pass (it gets the bloom).
   CHOREO turns a list of battle beats into camera shake, hit-stop and punch zooms (on top of fx.js's fxShake/fxTime).
   Load after fx.js.
   ========================================================= */
const FX2 = (() => {
  const r = (i, s) => hash(i * 12.9898 + s * 78.233 + .5);
  /* a projectile that bounces on the ground with restitution e: [x, y, landedForGood] */
  function bounce(dt, x0, y0, vx, vy, g, ground, e = .38) {
    let t = dt, x = x0, y = y0, vX = vx, vY = vy;
    for (let b = 0; b < 4; b++) {
      // time to reach the ground: y0 + vy t + g t²/2 = ground
      const A = g / 2, B = vY, C = y - ground, disc = B * B - 4 * A * C;
      const th = disc < 0 ? Infinity : (-B + Math.sqrt(disc)) / (2 * A);
      if (t <= th) return [x + vX * t, y + vY * t + A * t * t, false];
      x += vX * th; y = ground; t -= th; vY = -(vY + g * th) * e; vX *= .7;
      if (Math.abs(vY) < 40) return [x + vX * Math.min(t, .15), ground, true];
    }
    return [x, ground, true];
  }
  const RAMP = [[0, [255, 255, 255]], [.08, [255, 244, 190]], [.22, [255, 196, 80]], [.45, [255, 110, 40]], [.7, [200, 50, 30]], [1, [70, 30, 30]]];
  function ramp(k) {
    for (let i = 1; i < RAMP.length; i++) if (k <= RAMP[i][0]) { const [a, A] = RAMP[i - 1], [b, B] = RAMP[i], u = (k - a) / (b - a); return A.map((v, j) => Math.round(v + (B[j] - v) * u)); }
    return RAMP[RAMP.length - 1][1];
  }

  /* ---------- explosion ---------- o: { ground, seed, debris (count), cols (debris colours), smoke (0..2), life } */
  function explosionBody(t, t0, x, y, s = 1, o = {}) {
    const dt = t - t0, ground = o.ground ?? y + 20 * s, sd = (o.seed || 0) + Math.floor(t0 * 13);
    if (dt < 0) return;
    // the scorch mark stays
    ctx.save(); ctx.globalAlpha = Math.min(1, dt * 6) * .55; ctx.fillStyle = '#16100e'; ctx.beginPath(); ctx.ellipse(x, ground + 2, 70 * s, 14 * s, 0, 0, TAU); ctx.fill(); ctx.restore();
    // the smoke column: puffs that rise, swell, drift and darken; lit orange from below while the fire is alive
    const life = o.life || 4.2, nS = Math.round(14 * (o.smoke ?? 1)), puffs = [];
    if (dt < life + 1) for (let i = 0; i < nS; i++) {
      const born = r(i, sd) * .5, a = dt - born; if (a < 0) continue;
      const k = a / life; if (k > 1) continue;
      const px = x + (r(i, sd + 1) - .5) * 90 * s + Math.sin(a * 1.3 + i) * 12 * s + a * 18 * s, py = y - 30 * s - a * (70 + r(i, sd + 2) * 60) * s;
      puffs.push({ px, py, rad: (22 + 70 * Math.sqrt(k)) * s * (.7 + r(i, sd + 3) * .6), al: (1 - k) * .9, fire: clamp(1 - a / .9) });
    }
    if (puffs.length) {   // one cloud: the ink only on its outer edge (rims first, then every fill over them)
      ctx.save();
      for (const p of puffs) { ctx.globalAlpha = Math.min(1, p.al); blob(p.px, p.py, p.rad + 2.5, p.rad * .9 + 2.5, 'rgba(30,20,28,.7)', { lw: 0, n: 18 }); }
      for (const p of puffs) { ctx.globalAlpha = Math.min(1, p.al); blob(p.px, p.py, p.rad, p.rad * .9, mix3([74, 66, 74], [130, 66, 44], p.fire * .8), { lw: 0, n: 18 }); }
      for (const p of puffs) { ctx.globalAlpha = Math.min(1, p.al); blob(p.px - p.rad * .22, p.py - p.rad * .26, p.rad * .6, p.rad * .48, mix3([118, 110, 118], [255, 160, 80], p.fire), { lw: 0, n: 14 }); }
      ctx.restore();
    }
    // debris: chunks that spin, arc, bounce and come to rest
    const n = o.debris ?? 16;
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI / 2 + (r(i, sd + 4) - .5) * 2.6, sp = (300 + r(i, sd + 5) * 520) * s;
      const [px, py, rest] = bounce(Math.min(dt, 3), x, y - 10 * s, Math.cos(ang) * sp, Math.sin(ang) * sp, 1500, ground + (r(i, sd + 6) - .3) * 14 * s);
      const sz = (5 + r(i, sd + 7) * 11) * s, rot = rest ? r(i, sd + 8) * 6 : dt * (6 + r(i, sd + 9) * 10);
      const col = o.cols ? o.cols[i % o.cols.length] : ['#4a515c', '#aeb8c4', '#2a2c33', '#eef0f2'][i % 4];
      ctx.save(); ctx.translate(px, py); ctx.rotate(rot);
      poly([[-sz, -sz * .6], [sz * .8, -sz * .7], [sz, sz * .5], [-sz * .6, sz * .7]], col, { lw: 2 });
      ctx.restore();
    }
  }
  function explosionEmit(t, t0, x, y, s = 1, o = {}) {
    const dt = t - t0, sd = (o.seed || 0) + Math.floor(t0 * 13);
    if (dt < 0 || dt > 2.4) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // the flash
    if (dt < .1) { const a = 1 - dt / .1, R = 170 * s, g = ctx.createRadialGradient(x, y - 20 * s, 0, x, y - 20 * s, R); g.addColorStop(0, `rgba(255,255,245,${a})`); g.addColorStop(.25, `rgba(255,230,170,${a * .55})`); g.addColorStop(1, 'rgba(255,160,80,0)'); ctx.fillStyle = g; ctx.fillRect(x - R, y - 20 * s - R, R * 2, R * 2); }
    ctx.restore(); ctx.save();
    // the fireball: cartoon puffs in three colour bands (outer red-orange with an ink rim, then orange, then a hot core)
    const fl = 1.0; if (dt < fl) {
      const k = dt / fl, grow = (.45 + 1.1 * Math.min(1, dt * 5)) * (1 - k * .3), lift = dt * 46 * s;
      for (const [band, off] of [[0, .32], [1, .14], [2, 0]]) {
        for (let i = 0; i < 9; i++) {
          const a = r(i, sd + 11) * TAU, d = (8 + 52 * r(i, sd + 12)) * s * (1 - Math.exp(-dt * 7)) * (1 - band * .25);
          const rad = (30 + 40 * r(i, sd + 13)) * s * grow * (1 - band * .28);
          const c = ramp(clamp(k * .9 + off));
          const al = clamp(1.25 - k * 1.1 - band * .1);
          if (al <= 0) continue;
          ctx.globalAlpha = al;
          blob(x + Math.cos(a) * d, y - 24 * s + Math.sin(a) * d * .6 - lift, rad, rad * .88, `rgb(${c[0]},${c[1]},${c[2]})`, band === 0 ? { lw: 3, sc: 'rgba(60,20,20,.6)', n: 16 } : { lw: 0, n: 16 });
        }
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore(); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // the shockwave ring
    if (dt < .42) { const k = dt / .42, R = 40 * s + 330 * s * (1 - Math.pow(1 - k, 3)); ctx.lineWidth = 7 * s * (1 - k); ctx.strokeStyle = `rgba(255,235,200,${.4 * (1 - k)})`; ctx.beginPath(); ctx.ellipse(x, y, R, R * .32, 0, 0, TAU); ctx.stroke(); }
    ctx.restore();
    // embers and the secondary pops
    fxBurst(t, t0, x, y - 10 * s, { kind: 'ember', n: 26, speed: 520 * s, grav: 300, life: 2.2, seed: sd + 1 });
    fxBurst(t, t0, x, y - 10 * s, { kind: 'spark', n: 30, speed: 900 * s, grav: 900, life: .7, seed: sd + 2 });
    for (let j = 0; j < (o.pops ?? 2); j++) { const tp = t0 + .25 + j * .22 + r(j, sd + 20) * .1, px = x + (r(j, sd + 21) - .5) * 160 * s, py = y - 20 * s - r(j, sd + 22) * 60 * s; if (t > tp && t < tp + .4) { const k = (t - tp) / .4, c = ramp(k); ctx.save(); ctx.globalCompositeOperation = 'lighter'; blob(px, py, 30 * s * (1 - k * .5), 26 * s, `rgba(${c[0]},${c[1]},${c[2]},${1 - k})`, { lw: 0 }); ctx.restore(); } }
  }
  const mix3 = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;

  /* the light an explosion throws (for RV2 lights): radius and strength over time */
  function explosionLight(t, t0, x, y, s = 1) {
    const dt = t - t0; if (dt < 0 || dt > 1.4) return null;
    const k = dt < .08 ? 1 : Math.exp(-(dt - .08) * 3.2);
    return { x, y: y - 30 * s, r: 520 * s, col: `rgba(255,${Math.round(150 + 80 * k)},90,1)`, k: k, spill: `rgba(255,160,80,${.25 * k})` };
  }

  /* ---------- choreography ----------
     beats: [{ t, kind: 'hit' | 'big' | 'tap', zoom (extra zoom on the punch-in), stop (hit-stop seconds) }]
     → cam(t, base [x, y, z]) with shake and punch-zoom; time(t) with hit-stops; hits for anything else */
  function choreo(beats) {
    const A = { tap: [6, .25], hit: [16, .45], big: [34, .8] };
    const hits = beats.map(b => [b.t, (A[b.kind] || A.hit)[0], (A[b.kind] || A.hit)[1]]);
    const ops = beats.filter(b => b.stop).map(b => ({ a: b.t, b: b.t + b.stop, rate: 0, catch: .2 }));
    return {
      hits,
      time: t => fxTime(t, ops),
      cam(t, c) {
        let z = c[2];
        for (const b of beats) if (b.zoom) { const d = t - b.t; if (d >= 0 && d < .6) z *= 1 + b.zoom * Math.exp(-d * 7) * (d < .04 ? d / .04 : 1); }
        return fxCam([c[0], c[1], z], t, hits);
      },
    };
  }
  return { explosionBody, explosionEmit, explosionLight, bounce, choreo, ramp };
})();
