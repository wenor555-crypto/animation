/* =========================================================
   «Η Έξυπνη Σίτα» – character rig
   Local coords: hips at (0,0), up is -y. Shoulders ≈ -120, head ≈ -200.
   person(x, y, scale, design, state)
   state.part: 'legs' | 'body' | 'arms' | 'all' (lets a table sit between body and arms)
   ========================================================= */
const CAST = {
  mimis:   { skin: '#efc9a6', hair: 'bald', beard: 'goatee', beardCol: '#4a3a30', top: 'hoodie', topCol: '#29272d', print: true, lipRing: true, earRing: true, brow: '#4a3a30', rx: 50, ry: 58, legs: '#2c2c33', shoes: '#f2f2f2' },
  giorgos: { skin: '#d8a47c', hair: 'swoop', hairCol: '#211a17', beard: 'trim', beardCol: '#231a16', top: 'tee', topCol: '#f4f3ee', shades: true, brow: '#1b1411', browW: 6, rx: 46, ry: 55, legs: '#6b7048', shoes: '#2d2a26' },
  giannos: { skin: '#dcaa84', hair: 'quiff', hairCol: '#1d1613', beard: 'full', beardCol: '#221914', top: 'tee', topCol: '#34425c', brow: '#1d1613', browW: 6, rx: 46, ry: 55, legs: '#3e4a5e', shoes: '#9aa0a8' },
  vasilis: { skin: '#d39a70', hair: 'old', hairCol: '#ebe7df', beard: 'stubble', mustache: '#e8e4dc', top: 'tank', topCol: '#f6f4ee', belly: true, brow: '#d9d4c8', rx: 48, ry: 54, legs: '#3d5f8f', shoes: '#2b6fb3' },
  maria:   { skin: '#e7b994', hair: 'bun', hairCol: '#3b2a22', top: 'tank', topCol: '#b9477a', earrings: true, lips: '#b5475a', brow: '#3b2a22', rx: 44, ry: 52, legs: '#333', shoes: '#333' },
};

function freddo(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  curve([[4, -34], [10, -58], [16, -62]], 3.5, '#d8392b', { w: .3 });
  poly([[-12, -36], [12, -36], [9, 10], [-9, 10]], 'rgba(226,238,242,.75)', { lw: 3, w: .4 });
  poly([[-10.5, -18], [10.5, -18], [9, 9], [-9, 9]], '#6b3e1f', { lw: 0, w: .3 });
  poly([[-11, -26], [11, -26], [10.5, -18], [-10.5, -18]], '#d9b48a', { lw: 0, w: .3 });
  for (const [a, b] of [[-4, -8], [3, 0], [-2, 4]]) rect(a - 3, b - 3, 6, 6, 'rgba(255,255,255,.7)', { lw: 0 });
  ctx.restore();
}
function cigarette(x, y, rot, t, seed = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  rect(0, -2.5, 22, 5, '#f7f5ef', { lw: 2, w: .2 }); rect(0, -2.5, 6, 5, '#d9914a', { lw: 0 });
  blob(23, 0, 2.5, 2.5, '#ff6a2a', { lw: 0, glow: '#ff6a2a', gb: 8 });
  ctx.restore();
  for (let i = 0; i < 3; i++) { const p = (t * .45 + i / 3 + seed) % 1; blob(x + Math.cos(rot) * 24 + Math.sin(p * 6 + seed) * 6, y + Math.sin(rot) * 24 - p * 70, 3 + p * 9, 3 + p * 9, `rgba(215,215,215,${.45 * (1 - p)})`, { lw: 0 }); }
}
function phone(x, y) { ctx.save(); ctx.translate(x, y); ctx.rotate(-.2); rect(-9, -16, 18, 32, '#1b1b1f', { lw: 2.5, w: .2 }); rect(-7, -13, 14, 24, '#5b87c4', { lw: 0 }); ctx.restore(); }

function person(x, y, s, c, st = {}) {
  const t = st.t || 0, tk = st.talk || 0, part = st.part || 'all', has = p => part === 'all' || part === p;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (st.dir || 1), s);
  if (has('legs')) personLegs(c, st);
  if (has('body')) { personBody(c, st); personHead(c, st); }
  if (has('arms')) personArms(c, st);
  ctx.restore();
}
function personLegs(c, st) {
  const t = st.t || 0;
  if (st.legs === 'stand' || st.legs === 'walk') {
    const sw = st.legs === 'walk' ? Math.sin(t * 9) * 16 : 0;
    for (const [side, ph] of [[-1, 1], [1, -1]]) {
      const fx = side * 22 + sw * ph;
      limb([[side * 24, 40], [side * 24 + sw * ph * .5, 90], [fx, 146]], 13, c.skin, { w: .4 });
      blob(fx + 8, 150, 20, 6, c.shoes, { lw: 3, w: .4 });
      curve([[fx - 4, 146], [fx + 6, 140], [fx + 14, 147]], 3, c.shoes, { w: .2 });
    }
    poly([[-54, -6], [54, -6], [58, 60], [4, 60], [0, 30], [-4, 60], [-58, 60]], c.legs, { lw: 4, w: .6 });
  } else {                                  // seated: only the shins show under a table
    for (const side of [-1, 1]) {
      limb([[side * 30, 60], [side * 34, 128]], 16, c.legs, { w: .4 });
      blob(side * 36 + 8, 132, 20, 8, c.shoes, { lw: 3, w: .4 });
    }
  }
}
function personBody(c, st) {
  if (c.hair === 'bun') blob(0, -262, 20, 16, c.hairCol, { lw: 3.5 });
  const torso = [[-40, -134], [40, -134], [58, -116], [54, 0], [-54, 0], [-58, -116]];
  if (c.top === 'tank') {
    poly(torso, c.skin, { smooth: true, lw: 4, w: .6 });
    poly([[-32, -132], [-20, -132], [-14, -102], [14, -102], [20, -132], [32, -132], [50, -98], [52, 0], [-52, 0], [-50, -98]], c.topCol, { lw: 3.5, w: .6 });
    if (c.belly) { blob(0, -34, 62, 50, c.topCol, { lw: 3.5, w: .8 }); curve([[-6, -20], [0, -16], [6, -20]], 2, '#c9c3b6'); }
  } else {
    poly(torso, c.topCol, { smooth: true, lw: 4, w: .6 });
    if (c.top === 'hoodie') {
      poly([[-34, -134], [34, -134], [22, -116], [0, -110], [-22, -116]], '#1f1e22', { lw: 3, w: .4 });
      curve([[-10, -118], [-12, -86]], 2.5, '#cfcfd4'); curve([[10, -118], [12, -86]], 2.5, '#cfcfd4');
      if (c.print) {
        ctx.save(); ctx.globalAlpha = .75;
        curve([[-34, -70], [-20, -86], [-6, -72], [8, -88], [24, -72], [36, -82]], 3, '#8e8d96', { w: .6 });
        curve([[-30, -52], [-14, -62], [0, -50], [16, -62], [32, -50]], 3, '#8e8d96', { w: .6 });
        curve([[-22, -40], [0, -34], [22, -40]], 2.5, '#8e8d96', { w: .6 });
        ctx.restore();
      }
    } else curve([[-16, -132], [0, -120], [16, -132]], 3);
  }
  blob(0, -142, 15, 12, c.skin, { lw: 3.5, w: .4 });
}
function personHead(c, st) {
  const t = st.t || 0, tk = st.talk || 0, rx = c.rx, ry = c.ry, lk = st.look || [0, 0];
  ctx.save(); ctx.translate(0, -202 + (st.bob || 0)); ctx.rotate(st.tilt || 0);
  blob(-rx + 1, 4, 9, 13, c.skin, { lw: 3.5, w: .4 }); blob(rx - 1, 4, 9, 13, c.skin, { lw: 3.5, w: .4 });
  blob(0, 0, rx, ry, c.skin, { lw: 4, w: .7 });
  // hair
  if (c.hair === 'bald') blob(-16, -36, 13, 6, 'rgba(255,255,255,.5)', { lw: 0, rot: -.3 });
  if (c.hair === 'swoop') {   // styled, side part, volume swept to one side
    poly([[-rx + 1, -2], [-rx - 3, -30], [-32, -ry - 5], [-6, -ry - 13], [22, -ry - 11], [rx + 3, -ry + 12], [rx + 4, -30], [rx, -6], [rx - 7, -24], [26, -36], [-2, -33], [-24, -25], [-rx + 8, -10]], c.hairCol, { lw: 3.5, w: .5 });
    curve([[-18, -ry - 4], [-10, -ry + 12]], 2.5, '#4a3a33', { w: .3 });
  }
  if (c.hair === 'quiff') {   // messy, pushed up, spiky top
    poly([[-rx + 1, -4], [-rx, -30], [-rx + 10, -48], [-26, -ry - 7], [-14, -ry - 2], [-5, -ry - 18], [7, -ry - 6], [19, -ry - 16], [28, -ry - 2], [40, -ry + 2], [rx - 2, -32], [rx, -4], [rx - 8, -22], [rx - 16, -30], [8, -36], [-16, -34], [-rx + 14, -28], [-rx + 8, -12]], c.hairCol, { lw: 3.5, w: .5 });
  }
  if (c.hair === 'old') { for (const sd of [-1, 1]) poly([[sd * (rx - 2), -24], [sd * (rx + 5), -16], [sd * (rx - 1), -10], [sd * (rx + 4), -2], [sd * (rx - 3), 2], [sd * (rx - 9), -14]], c.hairCol, { lw: 2.5, w: .4 }); blob(-14, -34, 12, 5, 'rgba(255,255,255,.35)', { lw: 0, rot: -.3 }); }
  if (c.hair === 'bun') poly([[-rx + 1, -2], [-rx + 3, -30], [-20, -ry], [20, -ry], [rx - 3, -30], [rx - 1, -2], [rx - 9, -24], [0, -34], [-rx + 9, -24]], c.hairCol, { lw: 3.5, w: .6 });
  if (c.shades) { for (const sx of [-16, 16]) { blob(sx, -ry + 4, 11, 7, '#1c1c22', { lw: 2.5, w: .3 }); blob(sx - 4, -ry + 2, 3, 1.5, 'rgba(255,255,255,.6)', { lw: 0 }); } curve([[-5, -ry + 4], [5, -ry + 4]], 2.5); }
  // beard
  if (c.beard === 'full') poly([[-rx, -4], [-rx + 3, 24], [-26, ry - 6], [0, ry + 4], [26, ry - 6], [rx - 3, 24], [rx, -4], [rx - 10, 20], [16, 24], [0, 23], [-16, 24], [-rx + 10, 20]], c.beardCol, { lw: 3, w: .6 });
  if (c.beard === 'trim') poly([[-rx + 1, 4], [-rx + 5, 28], [-24, ry - 4], [0, ry + 1], [24, ry - 4], [rx - 5, 28], [rx - 1, 4], [rx - 7, 24], [18, 40], [0, 43], [-18, 40], [-rx + 7, 24]], c.beardCol, { lw: 2.5, w: .5 });
  if (c.beard === 'goatee') poly([[-11, 38], [11, 38], [8, ry + 2], [-8, ry + 2]], c.beardCol, { lw: 3, w: .5 });
  if (c.beard === 'stubble') for (let i = 0; i < 26; i++) { const a = Math.PI * (.1 + hash(i) * .8), r = .75 + hash(i + 7) * .2; blob(Math.cos(a) * rx * r, Math.sin(a) * ry * r, 1.3, 1.3, '#b7aea2', { lw: 0, n: 6 }); }
  // eyes & brows
  const bl = st.blink ?? blinkAt(t, (c.rx * 7) % 3);
  eye(-17, -6, 12, lk[0], lk[1], bl, { lid: st.lid }); eye(17, -6, 12, lk[0], lk[1], bl, { lid: st.lid });
  const m = { worry: [5, -5], frown: [-5, 6], up: [-5, -5], flat: [0, 0] }[st.brow || 'flat'] || [0, 0];
  const bw = c.browW || 4.5;
  curve([[-29, -25 + m[0]], [-7, -25 + m[1]]], bw, c.brow); curve([[7, -25 + m[1]], [29, -25 + m[0]]], bw, c.brow);
  // nose
  curve([[2, -3], [9, 13], [0, 16]], 3);
  // mouth
  if (tk > .05) blob(0, 31, 11, 2 + tk * 9, c.lips || '#5a1f2b', { lw: 3 });
  else {
    const mm = { smirk: [[-9, 30], [2, 32], [11, 27]], smile: [[-11, 28], [0, 35], [11, 28]], frown: [[-9, 33], [0, 29], [9, 33]], open: null }[st.mouth || 'flat'] || [[-9, 31], [0, 32], [9, 31]];
    if (mm) curve(mm, 3.2, c.lips ? '#8a3140' : INK);
    else blob(0, 31, 9, 8, '#5a1f2b', { lw: 3 });
  }
  if (c.beard === 'full' || c.beard === 'trim' || c.beard === 'goatee') poly([[-18, 23], [0, 18], [18, 23], [12, 27], [0, 24], [-12, 27]], c.beardCol, { lw: 2, w: .3 });
  if (c.mustache) poly([[-20, 22], [0, 16], [20, 22], [14, 28], [0, 24], [-14, 28]], c.mustache, { lw: 2.5, w: .4 });
  if (c.lipRing) blob(7, 37, 3.5, 3.5, null, { lw: 2.2, sc: '#cfd3d8', w: .1 });
  if (c.earRing) blob(-rx - 1, 15, 3.5, 3.5, null, { lw: 2.2, sc: '#cfd3d8', w: .1 });
  if (c.earrings) for (const ex of [-rx - 1, rx + 1]) blob(ex, 18, 4, 6, null, { lw: 2.2, sc: '#e2b43c', w: .1 });
  ctx.restore();
}
function personArms(c, st) {
  const t = st.t || 0, sleeve = c.top === 'hoodie' ? c.topCol : c.skin;
  const L = st.L || [-44, -24], R = st.R || [44, -24];
  const arm = (sh, h, side, item) => {
    const mid = [(sh[0] + h[0]) / 2 + side * 20, (sh[1] + h[1]) / 2 + 16];
    if (item === 'cup') freddo(h[0], h[1] - 4);
    limb([sh, mid, h], 12, sleeve, { w: .5 });
    if (c.top === 'tee') blob(sh[0] + side * 4, sh[1] + 8, 16, 18, c.topCol, { lw: 3.5, w: .4 });
    if (c.top === 'hoodie') blob(h[0], h[1] + 2, 10, 7, c.topCol, { lw: 3, w: .3 });
    blob(h[0], h[1], 9, 8, c.skin, { lw: 3, w: .4 });
    if (item === 'cig') cigarette(h[0] + side * 4, h[1] - 4, side > 0 ? -.4 : Math.PI + .4, t, side);
    if (item === 'phone') phone(h[0], h[1] - 10);
  };
  arm([-52, -118], L, -1, st.itemL); arm([52, -118], R, 1, st.itemR);
}
// hand motion helpers
const slapK = (t, times) => { for (const s of times) if (t >= s && t < s + .35) return Math.sin(prog(t, s, s + .35) * Math.PI); return 0; };
const lerp2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
