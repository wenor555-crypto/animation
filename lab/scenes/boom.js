/* Lab: explosion v2 (FX2) and the choreography helper: three blasts in sequence on the night street, through RV2,
   with camera shake, a punch-zoom and a hit-stop on the big one. */
defineScene((() => {
const steps = [{ act: 'boom', d: 5, cam: 'all' }];
const GY = 640;
let C = null;
function render(t0, M) {
  const a = M.boom.a, B = [[a + .4, 900, GY, .8], [a + 1.6, 520, GY, 1.3], [a + 2.2, 760, GY - 10, .7]];
  if (!C) C = FX2.choreo([{ t: B[0][0], kind: 'hit' }, { t: B[1][0], kind: 'big', zoom: .12, stop: .1 }, { t: B[2][0], kind: 'hit' }]);
  const t = C.time(t0), cam = C.cam(t0, [640, 360, 1]);
  const lights = B.map(b => FX2.explosionLight(t, b[0], b[1], b[2], b[3])).filter(Boolean);
  RV2.frame(t, {
    layers: [
      { name: 'bg', draw: () => { ctx.save(); applyCamFx(cam); villageStreet(t, { light: 'night' }); ctx.restore(); }, dof: 2.5 },
      { name: 'boomBody', draw: () => { ctx.save(); applyCamFx(cam); for (const b of B) FX2.explosionBody(t, ...b, { ground: GY }); ctx.restore(); } },
    ],
    ambient: 'rgb(70,78,118)', lights: lights.map(l => { const p = [ (l.x - cam[0]) * cam[2] + 640, (l.y - cam[1]) * cam[2] + 360 ]; return { ...l, x: p[0], y: p[1] }; }),
    emit: () => { ctx.save(); applyCamFx(cam); for (const b of B) FX2.explosionEmit(t, ...b); ctx.restore(); }, bloom: 1.2,
    tint: ['#c8d4ff', '#e8d8ff'], vignette: .5, grain: .08,
  });
}
return { id: 'scene05', title: 'explosion lab', steps, render, fade: false };
})());
