/* =========================================================
   Episode 2 remake – continuity for the yard.
   The yard gets a gate in its back wall (the army comes through it in scene 15), and after the battle
   it keeps the damage in every later shot: the gate blown open, the scorch line, the vacuum stuck on the wall,
   the dead air fryer with an arrow in it, planks, feathers, a smouldering fig tree.
   yard(t, o) is wrapped: o.gate = 'closed' (default) | 'none' (the scene draws its own) ; o.after = true → the damage.
   ========================================================= */
const YGATE = 560;
function yardGate(state) {
  rect(YGATE - 90, 500, 22, 190, '#bfb49a', { lw: 4 }); rect(YGATE + 68, 500, 22, 190, '#bfb49a', { lw: 4 });
  if (state === 'blown') {
    rect(YGATE - 68, 500, 136, 190, '#d8c8a4', { lw: 0 }); rect(YGATE - 68, 610, 136, 80, '#c8b890', { lw: 0 });
    ctx.save(); ctx.translate(YGATE - 40, 684); ctx.rotate(.5); rect(-34, -8, 68, 16, '#6a3a1e', { lw: 2.5 }); ctx.restore();
    return;
  }
  for (const x of [YGATE - 68, YGATE]) { rect(x, 520, 68, 170, '#7a4a2a', { lw: 3.5 }); for (let i = 1; i < 5; i++) curve([[x + i * 13.6, 524], [x + i * 13.6, 686]], 2, 'rgba(0,0,0,.25)', { w: 0 }); }
}
function yardDamage(t) {
  // the scorch line across the yard
  const pts = []; for (let i = 0; i <= 60; i++) pts.push([lerp(120, 1260, i / 60), 752 + Math.sin(i * .7) * 5]);
  fxScorch(pts, 1, { hot: false });
  // planks from the gate, the dead air fryer with the arrow, the vacuum stuck on the back wall
  for (let i = 0; i < 6; i++) { ctx.save(); ctx.translate(YGATE - 200 + i * 80 + fxr(i) * 30, 700 + fxr(i, 2) * 20); ctx.rotate(fxr(i, 3) * 3); rect(-20, -5, 40, 10, '#6a3a1e', { lw: 2 }); ctx.restore(); }
  ctx.save(); ctx.translate(510, 705); ctx.scale(.8, .8); ctx.rotate(1.35); airFryer(0, 0, 0, { noLegs: 1 }); arrow(-10, -50, .25, .9); ctx.restore();
  ctx.save(); ctx.translate(350, 480); ctx.rotate(-Math.PI / 2); ctx.scale(.95, .95); robotVac(0, 0, t, { gun: 1 }); ctx.restore();
  // feathers on the ground, a few still drifting down
  for (let i = 0; i < 24; i++) { ctx.save(); ctx.translate(-100 + fxr(i) * 1400, 700 + fxr(i, 2) * 80); ctx.rotate(fxr(i, 3) * 3); blob(0, 0, 8, 3, '#f6f2e8', { lw: 1.2 }); ctx.restore(); }
  fxBurst(t, Math.floor(t / 4) * 4, 640, -40, { kind: 'feather', n: 10, speed: 120, dir: Math.PI / 2, spread: 2.6, grav: 120, drag: 3, life: 4, size: 1.4 });
  // the fig tree smoulders
  fxEmit(t, 0, 1e9, .25, 80, 380, { kind: 'smoke', n: 2, speed: 40, grav: 400, life: 3, size: .9, alpha: .35, spread: .6 });
  fxEmit(t, 0, 1e9, .3, 90, 400, { kind: 'ember', n: 1, speed: 60, grav: -120, life: 1.4, spread: 1 });
  for (const [x, y, r] of [[30, 410, 40], [120, 350, 34], [70, 460, 30]]) blob(x, y, r, r * .8, 'rgba(40,30,25,.45)', { lw: 0 });
}
{
  const _yard = yard;
  yard = function (t, o = {}) {
    _yard(t, o);
    if (o.gate !== 'none') yardGate(o.after ? 'blown' : 'closed');
    if (o.after) yardDamage(t);
  };
}

/* ---------- the bell tower set (scenes 1, 22, 23, 24): night, red light, rooftops, the church ---------- */
const TWX = 500, TWTOP = GROUND - 560;          // bell tower base x (the tower itself is at TWX+90..TWX+200); top of its walls
function towerSet(t, o = {}) {
  sky('night', t);
  for (let i = 0; i < 8; i++) rect(-400 + i * 300, 500 + hash(i) * 60, 260, 300, '#d8ccb4', { lw: 3 });
  bellTower(TWX, GROUND, t, { red: 1, helmet: o.helmet ?? true });
  poly([[-600, GROUND], [2000, GROUND], [2000, 1400], [-600, 1400]], '#9a948a', { lw: 0 });
}

/* after the battle: a sticking plaster over a laser sting (reads as an injury at a glance, unlike a red dot) */
function plaster(x, y, rot = 0, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.roundRect(-13, -5, 26, 10, 5); ctx.fillStyle = '#e9c49a'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-4.5, -3.5, 9, 7, 1.5); ctx.fillStyle = '#f6e3c8'; ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.25)'; for (const [dx, dy] of [[-9, -1.5], [-9, 1.5], [9, -1.5], [9, 1.5]]) { ctx.beginPath(); ctx.arc(dx, dy, .7, 0, TAU); ctx.fill(); }
  ctx.restore();
}
/* a hen feather stuck in someone's hair: a clear quill and vane, big enough to read as a feather */
function feather(x, y, rot = 0, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 6); ctx.bezierCurveTo(-9, -4, -7, -22, 0, -30); ctx.bezierCurveTo(7, -22, 9, -4, 0, 6); ctx.closePath();
  ctx.fillStyle = '#f7f3ea'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(0, -26); ctx.lineWidth = 1.2; ctx.stroke();
  ctx.beginPath(); for (let i = 0; i < 3; i++) { ctx.moveTo(0, -6 - i * 7); ctx.lineTo(-5, -2 - i * 7); ctx.moveTo(0, -8 - i * 7); ctx.lineTo(5, -4 - i * 7); } ctx.lineWidth = .8; ctx.stroke();
  ctx.restore();
}
