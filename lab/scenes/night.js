/* Lab: the same night beat drawn twice: plain (the old way) and through the v2 pipeline (render2.js):
   layers with depth of field, a light map (street lamp, the T-800's eye, the laser), rim light, bloom, grade, grain. */
defineScene((() => {
const steps = [{ act: 'v1', d: 4, cam: 'all' }, { act: 'v2', d: 4, cam: 'all' }];
const RX = 860, GY = 640, S = .62;
function streetBG(t) { villageStreet(t, { light: 'night' }); }
function lamp(t) { rect(196, 250, 10, 400, '#3a3f49', { lw: 3 }); poly([[176, 250], [226, 250], [214, 232], [188, 232]], '#2c3038', { lw: 3 }); }
function t800(t) {
  const base = { x: RX, y: 0, s: S, pitch: .1, yaw: -.5, t, pose: T800.open(R3.blend(T800.P.idle, T800.P.scan, .7), 0, 0) };
  const low = R3.lowestY(T800, base); const o = { ...base, y: GY - low, ground: GY };
  return o;
}
function chars(t, rim) {
  const o = t800(t); R3.draw(T800, rim ? { ...o, rim: { dir: [.6, .2, -.8], col: '#ff6a50', k: .5 } } : o);
  person(400, GY, 1, CAST.giannos, { t, legs: 'stand', look: [.8, -.2], brow: 'down', mouth: 'flat', R: [60, -120], L: [-40, -30] });
}
function emissive(t) {
  const o = t800(t), eye = R3.point(T800, o, 'head', [0, 30, 33]);
  redGlow(eye[0], eye[1], 40);
  const k = (t % 4);
  if (k > 1.2 && k < 2.6) { fxBeam(eye[0], eye[1], 470, GY - 4, t); fxBurst(t, Math.floor(t) + .2, 470, GY - 4, { kind: 'spark', n: 26, speed: 380, life: .6, seed: 4 }); }
  // the street lamp's bulb
  blob(201, 246, 9, 6, '#fff3c4', { lw: 0 });
}
function render(t, M) {
  if (t < M.v1.b) {   // the old way: everything straight onto the canvas
    streetBG(t); lamp(t); chars(t, false); emissive(t); nightGrade(t); vignette(.45);
    txt('ΠΡΙΝ (v1)', 640, 40, 24, '#fff', { font: TVFONT, weight: 900 });
    return;
  }
  const o = t800(t), eye = R3.point(T800, o, 'head', [0, 30, 33]);
  RV2.frame(t, {
    layers: [
      { name: 'bg', draw: () => { streetBG(t); }, dof: 3.5, cache: 'street-night' },
      { name: 'mid', draw: () => lamp(t) },
      { name: 'chars', draw: () => chars(t, true) },
    ],
    ambient: 'rgb(70,78,118)',
    lights: [
      { x: 201, y: 250, r: 380, col: 'rgba(255,214,150,1)', k: .95, spill: 'rgba(255,200,120,.10)' },
      { x: eye[0], y: eye[1], r: 220, col: 'rgba(255,120,100,1)', k: .45, spill: 'rgba(255,60,40,.10)' },
      { x: 470, y: GY - 10, r: 220, col: 'rgba(255,120,90,1)', k: ((t % 4) > 1.2 && (t % 4) < 2.6) ? .9 : 0 },
    ],
    emit: () => emissive(t), bloom: 1.1,
    tint: ['#c8d4ff', '#e8d8ff'], vignette: .5, grain: .08,
    after: () => txt('ΜΕΤΑ (v2)', 640, 40, 24, '#fff', { font: TVFONT, weight: 900 }),
  });
}
return { id: 'scene02', title: 'v2 lighting lab', steps, render, fade: false };
})());
