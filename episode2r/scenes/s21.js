/* Ep.2 remake, Scene 21 – «Πολιορκία του καφενείου»: night, the village square. All is lost.
   The gang runs for the καφενείο while the mecha's laser sweeps the street (a scorch line that stays) and its steps shake the ground.
   At the door, Γιάννος and the νέος hold with the last arrows, then figs. Inside, the TV has no signal; Γιώργος wants make-up;
   the mecha's hand comes through the window. */
defineScene((() => {
const MX = 1180;                                            // the mecha, looming over the square
const CAMS = { square: [640, 380, .9], door: [420, 470, 1.6], doorC: [400, 450, 2.2], inW: [640, 400, 1.1], in: [640, 400, 1.6], hand: [900, 330, 1.7] };
const steps = [
  { act: 'run', d: 3.6, cam: 'square' },
  { act: 'door', d: 1.6, cam: 'door' },
  { who: 'mimis', label: ['ΜΙΜΗΣ (από μέσα)', 'MIMIS (inside)'], cam: 'inW', mark: 'nosig', el: 'Δεν πιάνει σήμα η τηλεόραση!', en: "The TV has no signal!" },
  { act: 'arrows', d: 2, cam: 'door' },
  { who: 'neos', cam: 'doorC', mark: 'out', el: 'Κύριε Γιάννη, τελείωσαν τα βέλη!', en: "Mr Giannis, we're out of arrows!" },
  { who: 'giannos', cam: 'doorC', mark: 'figs', el: 'Ρίξε σύκα!', en: 'Throw figs!' },
  { act: 'figsA', d: 2, cam: 'door' },
  { who: 'giorgos', cam: 'in', mark: 'makeup', el: 'Θέλω μακιγιάζ.', en: 'I want make-up.' },
  { who: 'mimis', cam: 'in', mark: 'hand', el: 'Δεν έχουμε χρόνο για μακιγιάζ! Το χέρι του είναι στο παράθυρο!', en: "We don't have time for make-up! Its hand is in the window!" },
  { act: 'grab', d: 1.6, cam: 'hand' },
];
let M;
const SCORCH = []; for (let i = 0; i <= 50; i++) SCORCH.push([lerp(1300, -100, i / 50), 720 + Math.sin(i * .9) * 6]);
function square(t) {
  kafeneio(t, { light: 'night', screen: () => { ctx.fillStyle = '#222'; ctx.fillRect(0, 0, 1280, 720); for (let i = 0; i < 400; i++) { ctx.fillStyle = hash(i + Math.floor(t * 20)) > .5 ? '#ddd' : '#444'; ctx.fillRect(hash(i * 3) * 1280, hash(i * 7 + Math.floor(t * 20)) * 720, 16, 10); } } });
  poly([[-600, 798], [2100, 798], [2100, 1500], [-600, 1500]], '#d9d0bd', { lw: 0 });
}
function inside(t) {
  room({ wall: '#efe6d0', floor: '#c8b89a', floorY: 600, tiles: true, stripe: '#3f7fb3' });
  tv(640, 300, 300, 170, () => { ctx.fillStyle = '#222'; ctx.fillRect(0, 0, 1280, 720); for (let i = 0; i < 500; i++) { ctx.fillStyle = hash(i + Math.floor(t * 20)) > .5 ? '#ddd' : '#444'; ctx.fillRect(hash(i * 3) * 1280, hash(i * 7 + Math.floor(t * 20)) * 720, 14, 9); } txt('ΧΩΡΙΣ ΣΗΜΑ', 640, 360, 90, '#fff', { font: TVFONT, weight: 900, stroke: 10 }); }, { stand: false });
  // the window on the right: red light outside, and the mecha's hand
  rect(840, 160, 320, 260, '#5a1010', { lw: 5 });
  const g = prog(t, M.hand.a + 1.2, M.grab.b);
  if (g > 0) { ctx.save(); ctx.beginPath(); ctx.rect(840, 160, 320, 260); ctx.clip(); ctx.translate(1240 - g * 260, 300); for (let i = 0; i < 4; i++) { limb([[0, -60 + i * 36], [-80 - g * 40, -70 + i * 40]], 18, '#6a6a72'); blob(-86 - g * 40, -70 + i * 40, 12, 12, '#4a4a52', { lw: 2.5 }); } rect(0, -90, 120, 160, '#4a4a52', { lw: 4 }); redEye(40, -60, 6); ctx.restore(); }
  if (g > 0 && g < .3) fxBurst(t, M.hand.a + 1.2, 860, 300, { kind: 'glass', n: 26, speed: 600, dir: Math.PI, spread: 1.6, grav: 1200, life: 1.2 });
  curve([[840, 160], [1160, 420]], 3, g > 0 ? 'rgba(0,0,0,0)' : '#3a3a3a'); curve([[1160, 160], [840, 420]], 3, g > 0 ? 'rgba(0,0,0,0)' : '#3a3a3a');
  // Χρήστος with the storyboard, Μίμης fiddling with the TV cable, Γιώργος at the mirror
  stand(220, 'christos', 1.05, { t, talk: talk('christos', t), look: [1, 0], mouth: 'flat', L: [-70, -90], itemL: 'storyboard' });
  stand(460, 'mimis', 1, { t, talk: talk('mimis', t), look: t > M.hand.a ? [1, -.3] : [1, -.4], brow: 'frown', mouth: inM(t, M.hand) ? 'open' : 'flat', R: [80, -210 + Math.sin(t * 9) * 10], L: [-44, -24] });
  person(700, standY(), 1, { ...CAST.giorgos, topCol: '#2a3a6a' }, { t, talk: talk('giorgos', t), legs: 'stand', look: [-.3, .1], brow: 'up', mouth: inM(t, M.makeup) ? 'flat' : 'smirk', R: [60, -200], L: [-44, -24] });
  rect(760, 330, 40, 60, '#cfe3ea', { lw: 3 });                                  // a hand mirror
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  const hits = []; for (let i = 0; i < 6; i++) hits.push([M.run.a + .3 + i * .6, 14, .45]);
  hits.push([M.hand.a + 1.2, 18, .6]);
  const c = fxCam(shotCam(sc, t, CAMS, .012), t, hits);
  ctx.save(); applyCamFx(c);
  if (shot === 'in' || shot === 'inW' || shot === 'hand') {
    inside(t);
    ctx.restore(); applyLight('night', .3); ctx.save(); applyCamFx(c); glow(1000, 290, 260, 'rgba(255,40,40,1)', .4); glow(640, 220, 200, 'rgba(220,220,255,1)', .25); ctx.restore();
    fxImpact(t, M.hand.a + 1.2, 1000, 290, .07);
    if (inM(t, M.grab)) sfxText('ΚΡΑΣΣ!', 900, 150, 70, -.1, '#fff');
    vignette(.4); return;
  }
  square(t);
  // the mecha over the rooftops; its laser sweeps the street behind the runners, leaving a burn
  mecha2(t, { x: MX, build: 1, mood: 'evil', s: .75 });
  const sk = prog(t, M.run.a + .4, M.run.b);
  fxScorch(SCORCH, t > M.run.b ? 1 : sk, { hot: t < M.run.b });
  // the gang runs for the door; then Γιάννος and the νέος hold it
  const [rx] = path(t, [[M.run.a, 1250], [M.run.b, 430]]);
  if (t < M.run.b) for (const [i, who] of ['mimis', 'christos', 'giorgos', 'giannos', 'neos'].entries()) stand(rx + i * 70, who, .95, { t, legs: 'walk', look: [-1, 0], brow: 'worry', mouth: 'open', dir: -1 });
  else {
    const shoot = inM(t, M.arrows), pull = shoot ? (Math.sin((t - M.arrows.a) * 6) + 1) / 2 : 0, fig = inM(t, M.figsA);
    stand(330, 'neos', .95, { t, talk: talk('neos', t), look: [1, -.3], brow: 'worry', mouth: 'open', L: fig ? [80, -200 + Math.sin(t * 9) * 30] : [70, -130], itemL: fig ? null : 'bow', bowDir: 1, pull, R: fig ? [44, -24] : [66 - pull * 30, -134] });
    stand(470, 'giannos', 1, { t, talk: talk('giannos', t), look: [1, -.3], brow: 'frown', mouth: 'flat', R: [80, -130], itemR: 'magnet' });
    if (shoot) for (let i = 0; i < 3; i++) { const p = ((t - M.arrows.a) * 1.2 + i / 3) % 1; arrow(lerp(400, 1000, p), lerp(520, 200, p), -.5, .9); }
    if (fig) for (let i = 0; i < 6; i++) { const p = ((t - M.figsA.a) * 1.3 + i / 6) % 1; blob(lerp(400, 1000, p), 520 - Math.sin(p * Math.PI) * 220 - p * 200, 7, 8, '#6b3d5e', { lw: 2 }); if (p > .92) fxBurst(t, t - (p - .92) / 1.3, 1000, 320 - 0, { kind: 'drop', n: 6, speed: 200, life: .5, col: '#8a3a6a' }); }
    for (let i = 0; i < 3; i++) selfieDrone(900 + i * 110, 230 + Math.sin(t * 2 + i) * 20, t, {});
  }
  const [ex, ey] = mecha2Eye({ x: MX, build: 1, s: .75 });
  const bx = SCORCH[Math.min(50, Math.floor(sk * 50))][0];
  ctx.restore();
  applyLight('night', .6);
  ctx.save(); applyCamFx(c);
  glow(ex, ey, 180, 'rgba(255,30,30,1)', .6);
  if (inM(t, M.run, .4, 0)) fxBeam(ex, ey, bx, 720, t, { width: 1.1 });
  glow(640, 385, 260, 'rgba(220,220,255,1)', .25);
  ctx.restore();
  vignette(.4);
}
return {
  id: 'scene21', title: '21 · Πολιορκία του καφενείου', steps, render,
  events: M => {
    const e = [[M.run.a, () => fxScore(6, 138, 1)], [M.run.a + .4, () => FXS.laser(3.2)], [M.arrows.a, FXS.arrow], [M.arrows.a + .6, FXS.arrow], [M.figsA.a + .4, () => noise(.3, .2, 800, 1, 'lowpass')], [M.nosig.a - .3, () => noise(1.2, .06, 4000, .5, 'highpass')],
      [M.hand.a + 1.2, () => { FXS.crash(); FXS.boom(.6); }]];
    for (let i = 0; i < 6; i++) e.push([M.run.a + .3 + i * .6, FXS.thud]);
    return e;
  },
  ambience: () => ({ hum: .04 }),
};
})());
