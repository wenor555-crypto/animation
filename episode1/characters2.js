/* =========================================================
   «Η Έξυπνη Σίτα» – character rig v2 (graphics v2, from Episode 4 on)
   An opt-in extension of person(): pass st.v2 = { … } and the legs are solved by two-bone IK on foot targets, the
   upper body leans and lifts around the hips, the arms bend at real elbows, and fast limbs leave smear trails.
   Without st.v2, person() is exactly the old rig (every earlier episode renders unchanged).
   st.v2:
     feet:  [[lx, ly], [rx, ry]] foot targets in the character's local units (hips ≈ (0, 40), the ground ≈ y 146)
     lean:  torso rotation around the hips (radians, + leans forward in the facing direction)
     lift:  raises the hips (negative lowers: a crouch)
     elbows: [l, r] elbow bend side (+1 out/down, −1 in/up), default out
     smear: { R: [x, y], L: [x, y] } where the hands were one frame earlier (a trail is drawn when they moved far)
   Load after characters.js.
   ========================================================= */
(() => {
  const THIGH = 56, SHIN = 58, UPPER = 66, FORE = 66;
  /* two-bone IK in 2D: the middle joint for root a, end b, lengths l1, l2, bending to side s (±1) */
  function ik2(a, b, l1, l2, s) {
    let dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
    const max = l1 + l2 - .5; if (d > max) { b = [a[0] + dx * max / d, a[1] + dy * max / d]; dx = b[0] - a[0]; dy = b[1] - a[1]; d = max; }
    d = Math.max(d, Math.abs(l1 - l2) + .5);
    const ang = Math.atan2(dy, dx), cosA = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1), A = Math.acos(cosA) * s;
    return [[a[0] + Math.cos(ang - A) * l1, a[1] + Math.sin(ang - A) * l1], b];
  }
  function legsV2(c, st, v) {
    const lift = v.lift || 0, feet = v.feet || [[-22, 146], [22, 146]];
    poly([[-50, -8 - lift], [50, -8 - lift], [38, 40 - lift], [0, 46 - lift], [-38, 40 - lift]], c.legs, { lw: 4, w: .5 });   // the seat, behind the thighs
    for (const [side, f] of [[-1, feet[0]], [1, feet[1]]]) {
      const hip = [side * 22, 34 - lift];
      const [knee, foot] = ik2(hip, f, THIGH, SHIN, 1);   // knees bend forward (local +x is the facing direction)
      limb([hip, knee], 26, c.legs, { w: .4 });                 // thigh in the trousers / shorts colour
      limb([knee, foot], 13, c.skin, { w: .4 }); limb([hip, knee], 26, c.legs, { w: .4 });   // shin under the thigh at the knee
      blob(foot[0] + 8, foot[1] + 4, 20, 6, c.shoes, { lw: 3, w: .4 });
      curve([[foot[0] - 4, foot[1]], [foot[0] + 6, foot[1] - 6], [foot[0] + 14, foot[1] + 1]], 3, c.shoes, { w: .2 });
    }
  }
  function armsV2(c, st, v) {
    const t = st.t || 0, sleeve = c.top === 'hoodie' ? c.topCol : c.skin;
    const L = st.L || [-44, -24], R = st.R || [44, -24], eb = v.elbows || [1, 1];
    const draw = (sh, h, side, s) => {
      const [el, hand] = ik2(sh, h, UPPER, FORE, side * s);
      // smear: a fading trail from where the hand was a frame ago
      const prev = v.smear && (side < 0 ? v.smear.L : v.smear.R);
      if (prev && Math.hypot(prev[0] - hand[0], prev[1] - hand[1]) > 24) {
        ctx.save(); ctx.globalAlpha = .35;
        poly([[prev[0], prev[1] - 8], [hand[0], hand[1] - 9], [hand[0], hand[1] + 9], [prev[0], prev[1] + 8]], sleeve, { lw: 0 });
        ctx.restore();
      }
      limb([sh, el, hand], 12, sleeve, { w: .5 });
      if (c.top === 'tee') limb([[sh[0] + side * 2, sh[1] + 4], lerp2(sh, el, .55)], 20, c.topCol, { w: .3 });
      if (c.top === 'hoodie') blob(hand[0], hand[1] + 2, 10, 7, c.topCol, { lw: 3, w: .3 });
      blob(hand[0], hand[1], 9, 8, c.skin, { lw: 3, w: .4 });
      const item = side < 0 ? st.itemL : st.itemR;
      if (item && ITEM_HOOK[item]) ITEM_HOOK[item](hand, side, st, t);
      return hand;
    };
    draw([-52, -118], L, -1, eb[0]); draw([52, -118], R, 1, eb[1]);
  }
  const base = person;
  person = function (x, y, s, c, st = {}) {
    if (!st.v2) return base(x, y, s, c, st);
    const v = st.v2, lift = v.lift || 0, lean = v.lean || 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (st.dir || 1), s);
    if (!st.noShadow) blob(0, 150, 64, 10, 'rgba(20,10,20,.16)', { lw: 0, noqa: 1 });
    legsV2(c, st, v);
    ctx.save(); ctx.translate(0, 30 - lift); ctx.rotate(lean); ctx.translate(0, -30);
    personBody(c, st); personHead(c, st); armsV2(c, st, v);
    ctx.restore(); ctx.restore();
  };
  /* ready-made dynamic poses (feet, lean, lift, hands) for battles; k blends from the neutral stance */
  window.POSE2 = {
    run: ph => { const s = Math.sin(ph), c2 = Math.cos(ph);
      return { v2: { feet: [[-10 + 44 * s, 146 - Math.max(0, c2) * 30], [10 - 44 * s, 146 - Math.max(0, -c2) * 30]], lean: .22, lift: -6 + Math.abs(s) * 6 },
        L: [-30 - 50 * s, -40], R: [30 + 50 * s, -40] }; },
    crouch: () => ({ v2: { feet: [[-46, 146], [40, 146]], lean: .35, lift: -38 }, L: [-60, -10], R: [70, -40] }),
    lunge: () => ({ v2: { feet: [[-70, 146], [62, 146]], lean: .3, lift: -26 }, L: [-70, -70], R: [130, -110] }),
    jump: k => ({ v2: { feet: [[-30, 120 - 30 * k], [26, 110 - 34 * k]], lean: -.1, lift: 30 * k }, L: [-90, -170], R: [90, -170] }),
    fallBack: k => ({ v2: { feet: [[-10 + 40 * k, 146 - 20 * k], [30 + 60 * k, 130 - 50 * k]], lean: -.9 * k, lift: -20 * k }, L: [-100, -150], R: [100, -130] }),
    aim: () => ({ v2: { feet: [[-50, 146], [44, 146]], lean: .05, lift: -8, elbows: [1, -1] }, L: [16, -128], R: [150, -142] }),
  };
})();
