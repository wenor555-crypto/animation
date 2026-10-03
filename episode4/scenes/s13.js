/* Ep.4, Scene 13 – «Άφιξη»: night, lightning over the Corinthian gulf. A Jumbo truck in Κώστας's neighbourhood; Ep. 2's
   driver unloads a container: «Οικιακές συσκευές, ποσότητα: μία. …Δεν ρωτάω.» The container opens by itself; the parts arc
   out and lock onto the skeleton one by one, on the beat (click, spark, piston): vacuum feet, dehumidifier shins, boiler
   thighs, fridge, washer, air-conditioners, toasters, and last the air fryer. The eye lights up. On one knee, as in the
   film. It rises, scans the village. Its first target: a lemon tree. «Εξολόθρευση.» (graphics v2, through RV2) */
defineScene((() => {
const GY = 640, RS = .7, RX = 760, CONT = 1120;
const CAMS = { truck: [700, 380, 1], drv: [600, 500, 2.1], asm: [820, 420, 1.05], eye: [RX, 300, 2.3], scan: [700, 380, 1], lemon: [260, 470, 1.8] };
const steps = [
  { act: 'storm', d: 2.6, cam: 'truck' },
  { who: 'odigos', cam: 'drv', mark: 'note', el: 'Δελτίο αποστολής: «Οικιακές συσκευές, ποσότητα: μία». …Δεν ρωτάω.', en: 'Delivery note: "Household appliances, quantity: one". …I don\'t ask.' },
  { act: 'leave', d: 2, cam: 'truck' },
  { act: 'asm', d: 7.2, cam: 'asm' },
  { act: 'eye', d: 2, cam: 'eye' },
  { act: 'rise', d: 2.2, cam: 'scan' },
  { act: 'scan', d: 2.4, cam: 'scan' },
  { act: 'target', d: 1.4, cam: 'lemon' },
  { who: 'sita', label: T8, cam: 'eye', mark: 'ext', el: 'Εξολόθρευση.', en: 'Extermination.', fx: 'phone' },
  { act: 'end', d: 1.4, cam: 'scan' },
];
let M;
function robot(t) {
  const P = T800.P;
  let pose = P.crouch, yaw = -.6, asm = null;
  if (t < M.eye.a) asm = T800.assembly(prog(t, M.asm.a + .4, M.asm.b - .3), [520, -180, -120]);
  pose = R3.blend(P.crouch, P.idle, ease(prog(t, M.rise.a, M.rise.b)));
  if (t > M.scan.a) { pose = R3.blend(P.idle, P.scan, ease(prog(t, M.scan.a, M.scan.a + .6))); yaw = lerp(-.6, -1.1, ease(prog(t, M.scan.a, M.target.a))); }
  const base = { x: RX, y: 0, s: RS, pitch: .1, yaw, t, pose: T800.open(pose, 0, 0) };
  return { ...base, y: GY - R3.lowestY(T800, base), ground: GY, asm };
}
function lemonTree(x, y, t, lit = 0) {
  limb([[x, y], [x - 6, y - 120]], 14, '#6a4a2e', { w: .3 });
  for (let i = 0; i < 7; i++) blob(x - 50 + hash(i) * 100, y - 170 + hash(i + 4) * 80, 46, 36, '#3a6a3a', { lw: 3 });
  for (let i = 0; i < 9; i++) lemon(x - 50 + hash(i + 9) * 100, y - 160 + hash(i + 2) * 80, .8);
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  const c = shotCam(sc, t, CAMS, .006), o = robot(t);
  const eye = R3.point(T800, o, 'head', [0, 30, 33]), eyeOn = t > M.eye.a + .5;
  const flash = [M.storm.a + .4, M.storm.a + 1.9, M.asm.a + 2.5, M.asm.a + 5.6].reduce((a, f) => Math.max(a, t > f && t < f + .3 ? 1 - (t - f) / .3 : 0), 0);
  const W2S = p => [(p[0] - c[0]) * c[2] + 640, (p[1] - c[1]) * c[2] + 360];
  const world = fn => () => { ctx.save(); applyCam(c); fn(); ctx.restore(); };
  const truckX = t < M.leave.a ? 440 : lerp(440, -900, ease(prog(t, M.leave.a, M.leave.b)));
  RV2.frame(t, {
    layers: [
      { name: 'bg', draw: world(() => ctx.drawImage(streetImg(), -400, -300, 2400, 1200)) },
      { name: 'act', draw: world(() => {
        lemonTree(260, GY, t);
        if (t > M.storm.a) { jumboBox(CONT, GY, ease(prog(t, M.asm.a, M.asm.a + .7))); }
        if (truckX > -800) { jumboTruck(truckX, GY, t, { moving: t > M.leave.a, dir: -1, s: .62 }); }
        if (t < M.leave.a) person(640, GY + 28 - 150 * .55, .55, CAST.odigos, { legs: 'stand', t, talk: talk('odigos', t), dir: -1, look: [-.6, .3], brow: 'flat', mouth: 'flat', R: [50, -60], itemR: 'phone', L: [-40, -30] });
        if (t > M.asm.a) R3.draw(T800, o);
      }) },
    ],
    ambient: 'rgb(70,78,120)',
    lights: [{ x: 722, y: 180, r: 380, col: 'rgba(255,214,150,1)', k: .9, spill: 'rgba(255,200,120,.08)' }, ...(eyeOn ? [{ x: eye[0], y: eye[1], r: 260, col: 'rgba(255,110,90,1)', k: .6 }] : [])]
      .map(l => { const p = W2S([l.x, l.y]); return { ...l, x: p[0], y: p[1], r: l.r * c[2] }; }),
    emit: world(() => {
      if (eyeOn) redGlow(eye[0], eye[1], 36 * (1 + .3 * Math.sin(t * 9)));
      if (t > M.eye.a + .5 && t < M.eye.a + .9) redGlow(eye[0], eye[1], 140 * (1 - (t - M.eye.a - .5) / .4), 1);
      for (const s of T800.snapTimes(M.asm.a + .4, M.asm.b - M.asm.a - .7)) if (t > s.t && t < s.t + .3) fxBurst(t, s.t, RX + (hash(s.t) - .5) * 120, GY - 100 - hash(s.t * 3) * 120, { kind: 'spark', n: 10, speed: 260, life: .3, seed: s.t * 7 });
      if (t > M.scan.a && t < M.target.b) { const a = lerp(-.4, .5, (Math.sin((t - M.scan.a) * 2) + 1) / 2); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,40,30,.18)'; ctx.beginPath(); ctx.moveTo(eye[0], eye[1]); ctx.lineTo(eye[0] - 900, eye[1] + 300 + a * 300); ctx.lineTo(eye[0] - 900, eye[1] + 120 + a * 300); ctx.closePath(); ctx.fill(); ctx.restore(); }
    }),
    bloom: 1.1, tint: ['#c8d4ff', '#e8d8ff'], vignette: .5, grain: .08,
    after: () => {
      if (flash) fxFlash(flash * 1.3, '200,215,255');
      if (shot === 'lemon' || inM(t, M.ext)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = '#ff3030'; ctx.lineWidth = 3; const p = W2S([260, GY - 150]); ctx.strokeRect(p[0] - 90, p[1] - 90, 180, 180); txt('ΣΤΟΧΟΣ 1: ΛΕΜΟΝΙΑ', p[0], p[1] + 120, 20, '#ff3030', { font: 'monospace', weight: 900 }); ctx.restore(); }
    },
  });
}
return {
  id: 'scene13', title: '13 · Άφιξη', steps, render, fade: false,
  events: M => {
    const e = [[M.storm.a + .4, () => SND2.sfx('boom_small', .45, { rate: .5 })], [M.storm.a + 1.9, () => SND2.sfx('boom_small', .35, { rate: .45 })], [M.leave.a, SFX.engine],
      [M.asm.a + .1, () => SND2.sfx('servo', .7)], [M.asm.a + 2.5, () => SND2.sfx('boom_small', .4, { rate: .5 })], [M.eye.a + .5, () => SND2.sfx('zap', .6, { rate: .7 })],
      [M.rise.a, () => SND2.sfx('servo', .8)], [M.rise.b - .2, () => SND2.sfx('stomp', .7)], [M.scan.a, () => SND2.sfx('servo', .5, { rate: 1.3 })], [M.target.a, () => tone(880, .3, 'square', .02, 1)]];
    T800.snapTimes(M.asm.a + .4, M.asm.b - M.asm.a - .7).forEach((s, i) => { if (i % 2 === 0) e.push([s.t, () => SND2.sfx('click_lock', .5, { rate: .9 + (i % 5) * .05 })]); });
    return e;
  },
  ambience: () => ({ hum: .01 }),
};
})());
