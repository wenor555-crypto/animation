/* Ep.2 remake, Scene 20 – «Οικογενειακή συσκευασία»: ΣΙΤΑ v2 loses its spy and escalates: a mecha out of the Jumbo truck and the whole
   army, the church bell for a helmet (ΝΤΑΝΓΚ: shock ring, impact frame, the ground shakes at every step). */
defineScene((() => {
const X = { mimis: 200, christos: 340, giannos: 500, giorgos: 580 };
const MX = 960;
const CAMS = { wide: [700, 360, .85], build: [MX, 330, 1], head: [MX - 300, 520, 2.1], gang: [380, 420, 1.6], gia: [500, 400, 2.1], chr: [340, 400, 2.1], mim: [200, 400, 2.1], gio: [560, 400, 2.2], sweep: [640, 380, 1] };
const steps = [
  { act: 'lost', d: 1.8, cam: 'head' },
  { who: 'sita', cam: 'head', el: 'Έχασα τον πράκτορά μου.', en: 'I have lost my agent.' },
  { act: 'build', d: 5, cam: 'build' },
  { who: 'sita', cam: 'wide', mark: 'family', el: 'Τώρα και σε… ΟΙΚΟΓΕΝΕΙΑΚΗ ΣΥΣΚΕΥΑΣΙΑ!', en: 'Now also in… FAMILY SIZE!' },
  { who: 'giannos', cam: 'gia', el: 'Έφτιαξε μέκα από φορτηγό.', en: 'It built a mecha out of a truck.' },
  { who: 'christos', cam: 'chr', el: 'Πάντα φτιάχνουν μέκα από φορτηγό.', en: 'They always build mechas out of trucks.' },
  { act: 'stomp', d: 2.2, cam: 'wide' },
  { act: 'end', d: 2, cam: 'wide' },
];
let M;
const BELLT = () => M.build.b - .5;             // the church bell drops onto its head
function render(t, _M, sc) {
  M = _M;
  const hits = [[BELLT(), 26, .9]]; for (let i = 0; i < 5; i++) hits.push([M.build.a + .6 + i * .9, 8, .35]); for (let i = 0; i < 3; i++) hits.push([M.stomp.a + .3 + i * .6, 16, .5]);
  const c = fxCam(shotCam(sc, t, CAMS), t, hits);
  const bk = t < M.build.a ? 0 : prog(t, M.build.a + .3, M.build.b - .3);
  const sweep = false, sw = 0;
  ctx.save(); applyCamFx(c);
  villageStreet(t, { light: 'dusk', redLamp: true, redWindows: true, pole: false });
  bellTower(-40, 690, t, { helmet: bk > .7 });
  const mo = { x: MX, build: bk, talk: talk('sita', t), mood: 'evil', laser: sweep, s: 1 };
  if (t < M.build.a + .2) { jumboTruck(MX, GROUND + 10, t, { dir: 1, s: .9, door: 1, inside: '#6a0a0a' }); sitaV2({ x: MX - 300, top: 430, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: 'sad' }); }
  else mecha2(t, mo);
  // the gang, on the left
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const hideK = 0;
  const up = [.6, -.6];
  stand(X.mimis, 'mimis', 1, { t, talk: talk('mimis', t), look: la('mimis', up), lid: !inM(t, M.ow), brow: 'frown', mouth: inM(t, M.ow) ? 'open' : 'flat', L: [80, -150], itemL: 'bow', bowDir: 1, tilt: inM(t, M.ow) ? Math.sin(t * 30) * .06 : 0 });
  stand(X.christos, 'christos', 1.05, { t, talk: talk('christos', t), look: la('christos', up), mouth: 'flat', L: [70, -130], itemL: 'bow', bowDir: 1 });
  stand(lerp(X.giorgos, X.giannos + 60, hideK), 'giorgos', .95, { t, talk: talk('giorgos', t), look: la('giorgos', up), brow: 'worry', mouth: 'frown', L: [60, -150], itemL: 'tray' });
  stand(X.giannos, 'giannos', 1, { t, talk: talk('giannos', t), look: la('giannos', up), brow: 'frown', mouth: 'flat', R: [80, -130], itemR: 'jammer', jamOn: 0 });
  if (sweep) {
    const [ex, ey] = mecha2Eye(mo);
    const tx = 350 + sw * 400, ty = standY() - 100 + Math.cos(t * 3) * 60;
    laserBeam(ex, ey, tx, ty, 1, 2.5 + (t - M.sweep.a) * .3);
    zapPuff(tx, ty, (t * 3) % 1);
    for (let i = 0; i < 4; i++) laserDot(X.mimis + i * 130 + Math.sin(t * 5 + i) * 20, standY() - 100 - (i % 2) * 60, .8, 4 + (t - M.sweep.a) * .4);
  }
  ctx.restore();
  // sparks where each part clamps on, steam, and the bell landing on its head
  ctx.save(); applyCamFx(c);
  for (let i = 0; i < 5; i++) fxBurst(t, M.build.a + .6 + i * .9, MX + [-60, 0, 120, -120, 0][i], [640, 420, 300, 300, 120][i], { kind: 'spark', n: 18, speed: 500, life: .5, seed: i });
  fxBurst(t, BELLT(), MX, 120, { kind: 'spark', n: 40, speed: 800, life: .7 }); fxRing(t, BELLT(), MX, 140, 500, .5);
  for (let i = 0; i < 3; i++) fxBurst(t, M.stomp.a + .3 + i * .6, MX + (i % 2 ? 110 : -110), GROUND, { kind: 'dust', n: 14, speed: 300, grav: 0, life: 1.2, size: 1.3 });
  ctx.restore();
  applyLight('dusk', .6);
  ctx.save(); applyCamFx(c);
  if (bk > 0) { const [ex, ey] = mecha2Eye(mo); glow(ex, ey, 200, 'rgba(255,30,30,1)', .6); }
  glow(722, 190, 200, 'rgba(255,30,30,1)', .4);
  ctx.restore();
  if (inM(t, M.build, .3, 0)) { mangaize(.9); ctx.save(); applyCamFx(c); if (bk > .6) { const [ex, ey] = mecha2Eye(mo); glow(ex, ey, 160, 'rgba(255,30,30,1)', .9); } ctx.restore(); speedLines(MX, 300, 80, 260);
    const lbl = ['ΣΚΟΥΠΕΣ = ΠΟΔΙΑ', 'ΦΟΡΤΗΓΟ = ΚΟΡΜΟΣ', 'AIR FRYERS = ΓΡΟΘΙΕΣ', 'ΣΙΤΑ = ΚΕΦΑΛΙ', 'ΚΑΜΠΑΝΑ = ΚΡΑΝΟΣ'][Math.min(4, Math.floor(bk * 5))];
    caption(lbl, 1, 650); }
  if (inM(t, M.family)) sfxText('×10', 1180, 140, 90, .12, '#ffd23f');
  fxImpact(t, BELLT(), 640, 200, .08);
  if (t > BELLT() && t < BELLT() + 1) sfxText('ΝΤΑΝΓΚ!', 640, 120, 100, -.08, '#ffd23f');
  fxFlash(fxHitLight(t, [[BELLT(), .5]]));
  vignette(.4);
}
return {
  id: 'scene20', title: '20 · Οικογενειακή συσκευασία', steps, render,
  events: M => {
    const e = [[M.lost.a, () => tone(300, .8, 'sine', .05, .6)], [M.build.a + .3, () => { SFX.rev(); SFX.drums(); }], [M.family.a, SFX.fanfare], [M.family.b, SFX.boom], [(M.build.b - .5), () => { FXS.clang(); FXS.boom(.8); }], [M.stomp.a + .3, FXS.thud], [M.stomp.a + .9, FXS.thud], [M.stomp.a + 1.5, FXS.thud]];
    for (let i = 0; i < 5; i++) e.push([M.build.a + .6 + i * .9, () => { SFX.clacks(3); SFX.thud(); }]);
    return e;
  },
  ambience: () => ({ cricket: .01, hum: .04 }),
};
})());
