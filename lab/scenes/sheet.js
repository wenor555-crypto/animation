/* Lab: the T-800 model sheet (for the creator's approval before any animation), then a turntable, the pose library,
   a walk cycle and the assembly sequence. Everything is drawn by the same robot3d.js code the episode will use. */
defineScene((() => {
const steps = [
  { act: 'sheet', d: 4, cam: 'all' },
  { act: 'turn', d: 6, cam: 'all' },
  { act: 'poses', d: 9, cam: 'all' },
  { act: 'walk', d: 4, cam: 'all' },
  { act: 'asm', d: 6, cam: 'all' },
];
const S = .62, GROUND = 650;
function grid() {
  ctx.fillStyle = '#16324f'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(160,200,255,.12)'; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(160,200,255,.35)'; ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();
}
/* place the robot so its lowest foot point sits on the ground line */
function robot(x, o) {
  const base = { x, y: 0, s: o.s ?? S, pitch: .14, ...o };
  const low = R3.lowestY(T800, base);
  return R3.draw(T800, { ...base, y: (o.ground ?? GROUND) - low, ground: o.ground ?? GROUND });
}
const label = (s, x, y) => txt(s, x, y, 15, '#cfe3ff', { font: TVFONT, weight: 900 });
function render(t, M) {
  grid();
  txt('T-800 · ΜΟΝΤΕΛΟ (model sheet v1)', 640, 34, 22, '#ffffff', { font: TVFONT, weight: 900 });
  if (t < M.sheet.b) {
    robot(300, { yaw: -.6, t, pose: T800.open(T800.P.guard, 0, .6), s: 1.0 }); label('3/4 · ΜΑΧΗ', 300, 690);
    const views = [[0, 'ΜΠΡΟΣΤΑ'], [-Math.PI / 2, 'ΠΡΟΦΙΛ'], [Math.PI, 'ΠΙΣΩ']];
    views.forEach(([yaw, name], i) => { const x = 700 + i * 220; robot(x, { yaw, t, pose: T800.P.idle, s: .5 }); label(name, x, 690); });
    // the parts list
    const L = ['κράνος: air fryer (μάτι LED)', 'θώρακας: ψυγείο + μαγνητάκια', 'κοιλιά: πλυντήριο (τύμπανο-αντιδραστήρας)', 'επωμίδες: κλιματιστικά inverter', 'μηροί: θερμοσίφωνες 80L', 'κνήμες: αφυγραντήρες', 'πέλματα: σκούπες ρομπότ', 'παλάμες: τοστιέρες (ανοίγουν)'];
    L.forEach((s, i) => txt(s, 1150, 110 + i * 26, 13, '#cfe3ff', { font: TVFONT, weight: 700, align: 'right' }));
    return;
  }
  if (t < M.turn.b) {
    const k = prog(t, M.turn.a, M.turn.b);
    robot(640, { yaw: k * TAU, t, pose: T800.P.idle, s: .72 }); label('ΠΕΡΙΣΤΡΟΦΗ 360°', 640, 690); return;
  }
  if (t < M.poses.b) {
    const names = ['idle', 'crouch', 'guard', 'punch', 'hit', 'scan'];
    const u = (t - M.poses.a) / (M.poses.b - M.poses.a) * names.length, i = Math.min(names.length - 1, Math.floor(u)), f = u - i;
    const a = T800.P[names[i]], b = T800.P[names[Math.min(names.length - 1, i + 1)]];
    const pose = R3.blend(a, b, ease(clamp((f - .6) / .4)));
    robot(420, { yaw: -.55, t, pose: T800.open(pose, names[i] === 'punch' ? 0 : .5, names[i] === 'guard' ? 1 : 0), s: .68 });
    robot(980, { yaw: .25, t, pose: T800.P[names[i]], s: .5 });
    label('ΠΟΖΑ: ' + names[i].toUpperCase(), 640, 690); return;
  }
  if (t < M.walk.b) {
    const ph = (t - M.walk.a) * 5.2, x = 900 - ph * T800.WALK_SPEED * .72;   // facing left, moving left at the stride speed
    robot(x, { yaw: -Math.PI / 2, t, pose: T800.walk(ph), s: .72 }); label('ΒΑΔΙΣΜΑ (ΠΡΟΦΙΛ)', 640, 690); return;
  }
  const k = prog(t, M.asm.a, M.asm.b - .8);
  robot(700, { yaw: -.5, t, pose: T800.P.idle, s: .72, asm: T800.assembly(k) });
  // the container the parts come from
  rect(40, 470, 240, 180, '#c9532e', { lw: 4 }); for (let i = 0; i < 9; i++) curve([[60 + i * 25, 480], [60 + i * 25, 640]], 3, '#8f3519', { w: 0 });
  txt('JUMBO', 160, 500, 22, '#fff', { font: TVFONT, weight: 900 });
  for (const s of T800.snapTimes(M.asm.a, M.asm.b - M.asm.a - .8)) if (t > s.t && t < s.t + .25) fxBurst(t, s.t, 700, 420, { kind: 'spark', n: 10, speed: 260, life: .3, seed: s.t * 7 });
  label('ΣΥΝΑΡΜΟΛΟΓΗΣΗ', 640, 690);
}
return { id: 'scene01', title: 'T-800 lab', steps, render, fade: false };
})());
