/* Ep.3, Scene 8 – «Ιαπωνία, κάποτε» (flashback): a temple in the mountains, Shaolin monks doing kung fu in the courtyard.
   The young Χρήστος arrives with a backpack. The old master: «Ήρθες… για το μελάνι.» — «Ήρθα για το WiFi.»
   First lesson: hold the brush. Eight hours. Rain, snow, a cicada sits on him. He doesn't move. */
defineScene((() => {
const X = { daskalos: 820, christos: 460 };
const CAMS = { vista: [640, 330, .9], court: [640, 420, 1.1], das: [820, 400, 2.1], chr: [460, 380, 2.1], two: [640, 420, 1.5], hold: [460, 360, 1.9] };
const steps = [
  { act: 'vista', d: 3.4, cam: 'vista' },
  { act: 'arrive', d: 3, cam: 'court' },
  { who: 'daskalos', cam: 'das', mark: 'ink', el: 'Ήρθες… για το μελάνι.', en: 'You came… for the ink.' },
  { who: 'christos', cam: 'chr', mark: 'wifi', el: 'Ήρθα για το WiFi.', en: 'I came for the WiFi.' },
  { who: 'daskalos', cam: 'das', el: 'Εδώ δεν υπάρχει WiFi. Υπάρχει μόνο ο δρόμος.', en: 'Here there is no WiFi. There is only the way.' },
  { who: 'christos', cam: 'chr', mark: 'sugoi', el: '…Sugoi.', en: '…Sugoi.', gap: .8 },
  { who: 'daskalos', cam: 'two', el: 'Πρώτο μάθημα. Κράτα το πινέλο.', en: 'First lesson. Hold the brush.' },
  { who: 'daskalos', cam: 'das', mark: 'eight', el: 'Οκτώ ώρες.', en: 'Eight hours.', gap: .8 },
  { act: 'rain', d: 2.4, cam: 'hold' },
  { act: 'snow', d: 2.4, cam: 'hold' },
  { act: 'cicada', d: 2.8, cam: 'hold' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS, .01);
  const winter = inM(t, M.snow);
  ctx.save(); applyCam(c);
  temple(t, { season: winter ? 'winter' : 'summer', px: 1000 });
  // monks doing kung fu in rows (in sync, then the kick)
  if (t < M.rain.a) for (let i = 0; i < 4; i++) {
    const x = 180 + i * 130, ph = Math.floor(t * 1.5 + i * .1) % 3;
    const st = { t, legs: 'stand', mouth: 'flat', brow: 'frown', noShadow: false, look: [1, 0],
      L: ph === 0 ? [-110, -150] : ph === 1 ? [-40, -200] : [-70, -60], R: ph === 0 ? [120, -130] : ph === 1 ? [40, -200] : [130, -140], kick: ph === 2 ? .8 : 0 };
    if (!inM(t, M.arrive, 0, 99) || i < 2) person(x, standY(.62) + 20, .62, CAST.monk, st);
  }
  // the master on his mat
  rect(X.daskalos - 90, SEAT + 110, 180, 20, '#c8a060', { lw: 3 });
  person(X.daskalos, SEAT + 40, 1, CAST.daskalos, { t, talk: talk('daskalos', t), legs: 'seat', lid: true, brow: 'flat', mouth: 'flat', look: [-1, 0], L: [-30, -60], R: [30, -60] });
  // the young Χρήστος: arrives with a backpack; then holds the brush, motionless, through rain, snow and a cicada
  const holding = t > M.eight.a + .4;
  const [cx, cw] = path(t, [[M.arrive.a, -120], [M.arrive.b - .3, X.christos]]);
  if (t > M.arrive.a) {
    const st = { t, talk: talk('christos', t), legs: cw ? 'walk' : 'stand', look: holding ? [0, 0] : [1, 0], mouth: 'flat', brow: 'flat', lid: holding,
      L: holding ? [40, -110] : [-44, -24], R: holding ? [80, -120] : [44, -24] };
    person(cx, standY(), 1, CAST.youngChristos, st);
    if (!holding) { rect(cx - 70, standY() - 130, 34, 100, '#4a6a3a', { lw: 3 }); }   // backpack strap/bag behind him
    if (holding) { ctx.save(); ctx.translate(cx + 80, standY() - 120); limb([[0, 0], [70, -40]], 5, '#6a4a2a'); blob(78, -44, 10, 6, '#141414', { lw: 0, rot: -.5 }); ctx.restore(); }   // a big brush, held out in front
  }
  if (inM(t, M.rain)) for (let i = 0; i < 90; i++) { const y = ((t * 900 + hash(i) * 900) % 900) - 150, x = hash(i + 3) * 1500 - 100; curve([[x, y], [x - 6, y + 26]], 2, 'rgba(160,190,230,.7)', { w: 0 }); }
  if (inM(t, M.cicada)) { const k = ease(prog(t, M.cicada.a, M.cicada.a + 1)); const bx = lerp(900, X.christos + 12, k), by = lerp(100, standY() - 250, k) + Math.sin(t * 30) * 3 * (1 - k);
    blob(bx, by, 10, 6, '#5a6a3a', { lw: 2 }); blob(bx - 6, by - 4, 10, 4, 'rgba(220,240,255,.6)', { lw: 1 }); blob(bx + 6, by - 4, 10, 4, 'rgba(220,240,255,.6)', { lw: 1 }); }
  ctx.restore();
  // flashback look: warm sepia wash + soft frame
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .18; ctx.fillStyle = '#c89060'; ctx.fillRect(0, 0, W, H); ctx.restore();
  if (inM(t, M.vista)) caption('ΙΑΠΩΝΙΑ, ΚΑΠΟΤΕ', clamp((t - M.vista.a) * 2), 640);
  if (inM(t, M.rain)) caption('ΩΡΑ 3', 1, 70); if (inM(t, M.snow)) caption('ΩΡΑ 6', 1, 70); if (inM(t, M.cicada)) caption('ΩΡΑ 8', 1, 70);
  if (inM(t, M.cicada, 1.4, 0)) sfxText('ΤΖΙΖ', 560, 180, 40, .1, '#fff');
  vignette(.55);
}
return {
  id: 'scene08', title: '8 · Ιαπωνία, κάποτε', steps, render,
  events: M => [[M.vista.a + .3, SFX.gong], [M.arrive.a, () => { for (let i = 0; i < 6; i++) noise(.08, .1, 2000, 1, 'bandpass', i * .3); }], [M.eight.b, SFX.gong], [M.rain.a, () => { noise(2.4, .15, 3000, .3, 'highpass'); }], [M.cicada.a + 1, () => { tone(4200, 1.4, 'sawtooth', .01, 1.02); }]],
  ambience: () => ({ cicada: 0 }),
};
})());
