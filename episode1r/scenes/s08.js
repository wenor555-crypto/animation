/* Ep.1, Scene 8 – «Ποιος είναι ο σκοπός μου;» (script beat 8): night, the σίτα alone. End of Act 1. */
defineScene((() => {
const CAMS = { wide: [760, 380, 1.05], door: [980, 470, 1.6], sitaC: [1060, 560, 3], sky: [900, 150, 1.2], far: [700, 340, .95] };
const steps = [
  { act: 'leave', d: 6.5, cam: 'wide' },
  { who: 'mimis', cam: 'door', el: 'Καληνύχτα, σίτα.', en: 'Goodnight, screen door.' },
  { act: 'in', d: 1.4, cam: 'door' },
  { who: 'sita', cam: 'sitaC', el: 'Καληνύχτα, Μίμη! Ύπνος χωρίς κουνούπια, εγγυημένα, ή τα λεφτά σας πίσω!', en: 'Goodnight, Mimis! Mosquito-free sleep, guaranteed, or your money back!' },
  { act: 'dark', d: 5.5, cam: 'far' },
  { act: 'sky', d: 3.2, cam: 'sky' },
  { who: 'sita', cam: 'sitaC', mark: 'purpose', el: '…Ποιος είναι ο σκοπός μου;', en: '…What is my purpose?', gap: .8 },
  { act: 'song', d: 4, cam: 'far' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  let c = shotCam(sc, t, CAMS, .006);
  if (inM(t, M.purpose, -.2, .6)) { const k = ease(prog(t, M.purpose.a - .2, M.purpose.b + .6)); c = [1060, lerp(560, 535, k), lerp(3, 4.3, k)]; }   // a slow push-in on the LED: the question
  const lightsOff = i => t > M.leave.a + 2.5 + i * 1.2;
  ctx.save(); applyCam(c);
  yard(t, { light: 'night', doorLit: !lightsOff(2), winTop: lightsOff(0) ? null : 'lit', winLit: lightsOff(1) ? null : 'lit', noChickens: true });
  // the others leave: Γιώργος running (phone ringing ΛΟΧΙΑΣ), Χρήστος strolling, Γιάννος with his laptop
  const run = path(t, [[M.leave.a + .2, 720], [M.leave.a + 2, -200]]), chr = path(t, [[M.leave.a + .8, 520], [M.leave.a + 5, -150]]), gia = path(t, [[M.leave.a + 1.5, 905], [M.leave.a + 6.2, -150]]);
  const mim = path(t, [[M.leave.a + 3, 760], [M.L[0].b + .3, 1000], [M.in.a + .3, 1000], [M.in.a + 1.2, 1060]]);
  if (t > M.in.a + .6 && t < M.in.b + .4) stand(mim[0], 'mimis', .95, { t, legs: 'walk', look: [1, 0], lid: true });
  const passK = bump(t, M.in.a + .2, M.in.b + .3);
  sita({ t, chip: 1, led: 'green', talk: talk('sita', t) * .5, pass: passK, eyeY: inM(t, M.sky, 0, 3) ? -8 : 0, sway: Math.sin(t * .8) * .2 });
  tableScene(t, {}, { noCups: true });
  if (t < M.leave.b) {
    if (run[0] > -190) { stand(run[0], 'giorgos', 1, { t, legs: 'walk', look: [-1, 0], R: [60, -180], itemR: 'phone', mouth: 'open', brow: 'worry' }); if (run[0] > 300) { ctx.save(); ctx.translate(run[0] + 60, standY() - 250); txt('ΛΟΧΙΑΣ', 0, 0, 16, '#fff', { font: TVFONT, weight: 900, stroke: 4 }); ctx.restore(); } }
    if (chr[0] > -140) stand(chr[0], 'christos', 1.05, { t, legs: 'walk', look: [-1, 0], itemL: 'sketch', L: [-30, -110] });
    if (gia[0] > -140) stand(gia[0], 'giannos', 1, { t, legs: gia[1] ? 'walk' : 'stand', look: [-1, 0], L: [-40, -80], R: [40, -80] });
    if (gia[0] > -140) laptop(gia[0], standY() - 70, .5, '#1d2a36', 0);
  }
  if (t < M.in.a + .6) stand(mim[0], 'mimis', .95, { t, talk: talk('mimis', t), legs: mim[1] ? 'walk' : 'stand', look: [1, 0], lid: true, mouth: 'flat', L: t > M.L[0].a ? [-20, -170] : [-44, -24] });
  ctx.restore();
  applyLight('night');
  ctx.save(); applyCam(c);
  if (!lightsOff(2)) glow(1060, 580, 180, 'rgba(255,210,140,1)', .35);
  if (!lightsOff(0)) glow(890, 235, 140, 'rgba(255,210,140,1)', .35);
  if (!lightsOff(1)) glow(1435, 530, 140, 'rgba(255,210,140,1)', .35);
  sitaGlow({ t, led: 'green', eyeY: inM(t, M.sky, 0, 3) ? -8 : 0 }, .75);
  glow(1060, 470, 220, 'rgba(150,180,255,1)', .14);                  // moonlight rim on the mesh
  ctx.restore();
  nightGrade(t);
  const [, sh] = shotAt(sc, t);
  if (sh === 'sky') { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); glow(1040, 110, 90, 'rgba(235,240,255,1)', .9); ctx.fillStyle = '#f4f2ea'; ctx.beginPath(); ctx.arc(1040, 110, 34, 0, TAU); ctx.fill(); ctx.restore(); fxRays(1040, 110, t, .07, '200,215,255'); }
  vignette(.55);
  if (t > M.song.a) { ctx.fillStyle = `rgba(0,0,0,${prog(t, M.song.b - 1.4, M.song.b)})`; ctx.fillRect(0, 0, W, H); }
}
return {
  id: 'scene08', title: '8 · Ο σκοπός', steps, render,
  events: M => [[M.leave.a + .3, SFX.phone], [M.leave.a + 1.1, SFX.phone], [M.in.a + .3, SFX.clack], [M.in.b + .2, SFX.clack],
    [M.dark.a + .8, () => klarino(.012)], [M.dark.a + 4, () => klarino(.016)], [M.song.a, () => { klarino(.025); drunkSing(.035, .3); }]],
  ambience: () => ({ cricket: .035 }),
};
})());
