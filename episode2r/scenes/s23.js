/* Ep.2 remake, Scene 23 – «Όλη η ισχύς»: with no army left to feed, the σίτα routes all her power into the laser. Now it doesn't sting,
   it cuts: the beam carves the square (a burning trench), the gang dives for cover. Γιάννος: «Αυτό δεν τσούζει πια.»
   Panik, hood up: «Ωραία. Βαρέθηκα τα τσιμπήματα.» He starts to climb. */
defineScene((() => {
const CAMS = { top: [TWX + 160, 60, 1.6], tower: [TWX + 145, 330, .95], sq: [640, 420, 1], gia: [520, 420, 2], pk: [760, 400, 2], base: [TWX + 180, 470, 1.4] };
const steps = [
  { act: 'charge', d: 2.2, cam: 'top' },
  { who: 'sita', cam: 'top', mark: 'all', el: 'Όλη η ενέργεια… σε μένα.', en: 'All the power… to me.' },
  { act: 'cut', d: 3, cam: 'sq' },
  { who: 'giannos', cam: 'gia', mark: 'nosting', el: 'Αυτό δεν τσούζει πια.', en: "That doesn't sting any more." },
  { who: 'panik', cam: 'pk', mark: 'bored', el: 'Ωραία. Βαρέθηκα τα τσιμπήματα.', en: "Good. I'm sick of the stings." },
  { act: 'climb', d: 2.4, cam: 'base' },
];
let M;
const TRENCH = []; for (let i = 0; i <= 40; i++) TRENCH.push([lerp(80, 1200, i / 40), 740 + Math.sin(i * 1.3) * 10]);
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  const hits = []; for (let s = M.cut.a; s < M.cut.b; s += .2) hits.push([s, 9, .3]);
  const c = fxCam(shotCam(sc, t, CAMS, .012), t, hits);
  ctx.save(); applyCamFx(c);
  const st = { x: TWX + 145, top: TWTOP - 150, w: 90, h: 170, t, talk: talk('sita', t), chip: 1, led: 'red', mood: 'evil', burn: 1, laser: true };
  if (shot === 'top' || shot === 'tower' || shot === 'base') {
    towerSet(t, { helmet: false });
    sitaV2(st);
    if (shot === 'base') {                   // Panik at the foot of the tower, starting up
      const k = ease(prog(t, M.climb.a + .6, M.climb.b)), py = lerp(GROUND - 150, GROUND - 330, k);
      person(TWX + 215, py, 1, CAST.kostas, { t, legs: 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', look: [-1, -.8], L: [-40, -250 + Math.sin(t * 6) * 20], R: [30, -250 - Math.sin(t * 6) * 20], dir: -1 });
    }
    ctx.restore(); applyLight('red', .45);
    ctx.save(); applyCamFx(c); const [ex, ey] = sitaV2Eye(st); sitaGlow(st, .9);
    if (inM(t, M.charge) || inM(t, M.all)) fxCharge(t, ex, ey, prog(t, M.charge.a, M.all.b));
    ctx.restore();
    vignette(.4); return;
  }
  // the square: the beam comes down from above and carves a burning trench; the gang dives for cover
  kafeneio(t, { light: 'night', screen: () => { ctx.fillStyle = '#ffd23f'; ctx.fillRect(0, 0, 1280, 720); txt('ΑΝΑΚΛΗΣΗ', 640, 360, 140, '#e8392b', { font: TVFONT, weight: 900 }); } });
  poly([[-600, 798], [2100, 798], [2100, 1500], [-600, 1500]], '#d9d0bd', { lw: 0 });
  const k = clamp((t - M.cut.a - .2) / 2.2);
  fxScorch(TRENCH, t > M.cut.b ? 1 : k, { w: 40, hot: t < M.cut.b + 1 });
  for (let i = 0; i < 6; i++) if (k > i / 6) fxFire(TRENCH[Math.round(i / 6 * 40)][0], TRENCH[Math.round(i / 6 * 40)][1], .5, t + i, clamp((k - i / 6) * 4));
  const dive = inM(t, M.cut, .4, 99);
  for (const [i, who] of ['mimis', 'christos', 'giorgos', 'giannos', 'neos'].entries()) {
    const x = 300 + i * 110;
    if (dive && who !== 'giannos') { ctx.save(); ctx.translate(x, GROUND); ctx.rotate(-1.2); person(0, -150, .9, CAST[who === 'giorgos' ? 'giorgos' : who], { t, legs: 'stand', look: [0, -1], brow: 'worry', mouth: 'open', L: [-36, -250], R: [36, -250] }); ctx.restore(); }
    else stand(x, who, .9, { t, talk: talk(who, t), look: [1, -.4], brow: 'worry', mouth: 'flat' });
  }
  // Panik, hood up, standing in the smoke
  stand(820, 'kostas', 1, { t, talk: talk('panik', t), hood: true, shades: true, brow: 'frown', mouth: 'frown', look: [-1, -.5], L: [-50, -40], itemL: 'beer', dir: -1 });
  const bx = TRENCH[Math.min(40, Math.floor(k * 40))][0];
  ctx.restore();
  applyLight('night', .6);
  ctx.save(); applyCamFx(c);
  if (inM(t, M.cut, .2, -.4)) { fxBeam(bx - 300, -200, bx, 740, t, { width: 1.8 }); fxBurst(t, Math.floor(t * 12) / 12, bx, 740, { kind: 'debris', n: 6, speed: 420, grav: 1200, life: .8, cols: ['#9a948a', '#c8c0b0'] }); }
  glow(640, 385, 260, 'rgba(255,220,120,1)', .35);
  ctx.restore();
  fxFlash(fxHitLight(t, [[M.cut.a + .2, .7]]));
  if (inM(t, M.cut, .3, -1)) sfxText('ΖΖΖΖΑΑΑΠ', 640, 150, 80, -.08, '#ff5050');
  vignette(.4);
}
return {
  id: 'scene23', title: '23 · Όλη η ισχύς', steps, render,
  events: M => [[M.charge.a, () => { FXS.charge(2.2); FXS.riser(3); }], [M.cut.a + .2, () => { FXS.laser(2.4); FXS.boom(1); }], [M.cut.b, () => noise(2, .1, 600, .6, 'lowpass')], [M.climb.a + .6, FXS.thud]],
  ambience: () => ({ hum: .05 }),
};
})());
