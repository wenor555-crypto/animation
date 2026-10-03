/* Lab: the character rig v2 (characters2.js): run, crouch, lunge, jump, fall, aim; and the same frame with smears. */
defineScene((() => {
const steps = [{ act: 'poses', d: 3, cam: 'all' }, { act: 'run', d: 3, cam: 'all' }];
const GY = 470;
function render(t, M) {
  ctx.fillStyle = '#e9e4d8'; ctx.fillRect(0, 0, W, H); rect(0, GY + 146, W, H, '#cfc6b2', { lw: 0 });
  if (t < M.poses.b) {
    const P = [['crouch', POSE2.crouch()], ['lunge', POSE2.lunge()], ['jump', POSE2.jump(1)], ['fallBack', POSE2.fallBack(1)], ['aim', POSE2.aim()]];
    P.forEach(([n, p], i) => { const x = 140 + i * 250; person(x, GY, .8, CAST[i % 2 ? 'mimis' : 'giannos'], { t, legs: 'stand', ...p }); txt(n, x, 690, 18, '#333', { font: TVFONT, weight: 900 }); });
    return;
  }
  const ph = (t - M.run.a) * 12, x = 200 + (t - M.run.a) * 280;
  const p = POSE2.run(ph), pp = POSE2.run(ph - 12 / 30);
  person(x, GY, .8, CAST.mimis, { t, legs: 'stand', ...p, v2: { ...p.v2, smear: { R: pp.R, L: pp.L } } });
  txt('run + smear', 640, 690, 18, '#333', { font: TVFONT, weight: 900 });
}
return { id: 'scene03', title: 'rig v2 lab', steps, render, fade: false };
})());
