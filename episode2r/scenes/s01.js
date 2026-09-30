/* Ep.2 remake, Scene 1 – «Δώδεκα ώρες αργότερα» (teaser): night, red light. The σίτα's red eye over the rooftops, Panik's silhouette
   climbing the bell tower through the laser, Γιώργος far below running with something round and shiny. «ΤΕΛΕΥΤΑΙΑ ΠΡΟΣΦΟΡΑ, PANIK!»
   Freeze-frame. Card: «12 ΩΡΕΣ ΝΩΡΙΤΕΡΑ». (It only makes sense at scene 24.) */
defineScene((() => {
const CAMS = { eye: [TWX + 125, TWTOP - 70, 3.2], tower: [TWX + 150, 300, 1.05], run: [TWX - 60, 560, 1.8], card: [0, 0, 1] };
const steps = [
  { act: 'eye', d: 2, cam: 'eye' },
  { act: 'climb', d: 2.2, cam: 'tower' },
  { act: 'run', d: 1.4, cam: 'run' },
  { who: 'sita', cam: 'tower', mark: 'last', el: 'ΤΕΛΕΥΤΑΙΑ ΠΡΟΣΦΟΡΑ, PANIK!', en: 'FINAL OFFER, PANIK!', say: 'Τελευτέα προσφορά, Πάνικ!' },
  { act: 'freeze', d: 1.2, cam: 'tower' },
  { act: 'card', d: 2.6, cam: 'card' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'card') {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0a0608'; ctx.fillRect(0, 0, W, H);
    const k = back(clamp((t - M.card.a) * 3));
    ctx.translate(640, 360); ctx.scale(k, k);
    txt(lang === 'el' ? '12 ΩΡΕΣ ΝΩΡΙΤΕΡΑ' : '12 HOURS EARLIER', 0, 0, 80, '#fffaf0', { font: TVFONT, style: 'italic', weight: 900, stroke: 10, sc: '#5a0a10' });
    ctx.restore(); vignette(.5); return;
  }
  const T = t > M.freeze.a ? M.freeze.a : t;                        // the freeze-frame
  const c = fxCam(shotCam(sc, t, CAMS, .02), T, [[M.last.a, 10, .8]]);
  ctx.save(); applyCamFx(c);
  towerSet(T, { helmet: false });
  const st = { x: TWX + 112, top: TWTOP - 115, w: 60, h: 115, t: T, talk: talk('sita', t), chip: 1, led: 'red', mood: 'evil', burn: 1, laser: true };
  sitaV2(st);
  const k = ease(prog(T, M.climb.a, M.last.b)), py = lerp(GROUND - 200, TWTOP - 20, k);
  person(TWX + 214, py, .5, CAST.kostas, { t: T, legs: 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', look: [-1, -.8], L: [-40, -250 + Math.sin(T * 6) * 20], R: [30, -250 - Math.sin(T * 6) * 20], dir: -1 });
  // Γιώργος far below, running towards the church with the ταψί (only a glint: we don't know what it is yet)
  const gx = lerp(TWX - 400, TWX - 60, prog(T, M.run.a - 1, M.last.b));
  stand(gx, 'giorgos', .6, { t: T, legs: 'walk', look: [1, -.8], brow: 'up', mouth: 'open', L: [60, -150], R: [80, -140] });
  { ctx.save(); ctx.translate(gx + 44, standY(.6) - 90); blob(0, 0, 20, 18, '#c8ccd2', { lw: 2.5 }); ctx.restore(); }
  ctx.restore();
  applyLight('red', .45);
  mangaize(1);
  ctx.save(); applyCamFx(c);
  const [ex, ey] = sitaV2Eye(st);
  glow(ex, ey, 90, 'rgba(255,30,30,1)', .9);
  fxBeam(ex, ey, TWX + 214 + Math.sin(T * 2) * 20, py - 60, T, { width: .6 });
  glow(gx + 40, standY(.6) - 90, 40, 'rgba(255,255,255,1)', .6 + .4 * Math.sin(T * 12));
  ctx.restore();
  if (t > M.freeze.a) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .12; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore(); fxImpact(t, M.freeze.a, 640, 360, .08); }
  fxLetterbox(1);
  vignette(.5);
}
return {
  id: 'scene01', title: '1 · Δώδεκα ώρες αργότερα', steps, render,
  events: M => [[M.eye.a, () => tone(80, 2, 'sawtooth', .05, .8)], [M.climb.a, () => fxScore(2, 150, .8)], [M.last.a, FXS.riser], [M.freeze.a, () => { FXS.hit(); tone(1200, .8, 'sine', .04, .5); }], [M.card.a, FXS.whoosh]],
  ambience: () => ({ cricket: .02 }),
};
})());
