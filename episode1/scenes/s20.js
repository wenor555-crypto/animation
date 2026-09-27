/* Ep.1, Scene 20 – «Τηλεφωνήστε… τώρα.» (beat 22): a factory in China. End of the episode. */
defineScene((() => {
const CAMS = { wide: [640, 360, 1], box: [640, 470, 2.4], boxC: [640, 470, 3.6], pull: [640, 360, .8] };
const steps = [
  { act: 'factory', d: 4, cam: 'wide' },
  { act: 'arrive', d: 3, cam: 'box' },
  { act: 'open', d: 2.2, cam: 'boxC' },
  { who: 'sita', cam: 'boxC', mark: 'call', el: 'Τηλεφωνήστε… τώρα.', en: 'Call… now.' },
  { act: 'klak', d: 3.2, cam: 'pull' },
  { act: 'title', d: 5.4, cam: 'pull' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS, .02);
  ctx.save(); applyCam(c);
  ctx.fillStyle = '#b8c0c8'; ctx.fillRect(-800, -600, 2900, 1900);
  // endless rows of blank σίτες on racks
  const klak = inM(t, M.klak, .6, 99) && Math.floor((t - M.klak.a) * 2) % 2 === 0;
  for (let r = 0; r < 3; r++) for (let i = -8; i < 16; i++) { const x = i * 120 + (r % 2) * 60, y = 100 + r * 160; ctx.save(); ctx.translate(x, y); ctx.scale(.5, .5); sita({ x: 0, top: 0, w: 110, h: 210, t, open: klak ? .4 : 0, led: t > M.klak.a + .6 ? 'green' : null, chip: t > M.klak.a + .6 }); ctx.restore(); }
  txt('工厂 · ΕΡΓΟΣΤΑΣΙΟ · SHENZHEN', 640, 40, 26, '#5a6068', { font: TVFONT, weight: 900 });
  // the conveyor belt
  rect(-800, 560, 2900, 40, '#4a4a52', { lw: 4 });
  for (let i = -20; i < 40; i++) blob(i * 60 - (t * 80) % 60, 600, 14, 14, '#2a2a30', { lw: 3 });
  const bx = lerp(-300, 640, ease(prog(t, M.factory.a + 1, M.arrive.b)));
  const openK = ease(prog(t, M.open.a, M.open.b));
  // a crack of light: green LED inside the returned box
  sitaBox(bx, 514, 1.3, { open: openK * .25, label: 'ΛΕΧΑΙΟ → 深圳' });
  for (let i = 0; i < 6; i++) sitaBox(bx - 260 - i * 260, 514, 1.3, {});
  ctx.restore();
  applyLight('dusk', .25);
  ctx.save(); applyCam(c);
  if (openK > .2) glow(bx - 60, 450, 140, 'rgba(70,255,120,1)', .8 * openK);
  if (t > M.klak.a + .6) for (let r = 0; r < 3; r++) for (let i = -8; i < 16; i++) glow(i * 120 + (r % 2) * 60, 100 + r * 160 + 21, 30, 'rgba(70,255,120,1)', .5);
  ctx.restore();
  if (klak) sfxText('ΚΛΑΚ!', 640, 360, 200, -.1, '#ffd23f');
  if (t > M.title.a) {
    const k = prog(t, M.title.a, M.title.a + .6);
    ctx.save(); ctx.fillStyle = `rgba(22,17,29,${k * .92})`; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = k;
    ctx.translate(640, 300); ctx.scale(back(k), back(k)); ctx.rotate(-.05);
    txt('Η ΕΞΥΠΝΗ ΣΙΤΑ', 0, -40, 90, '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 12, sc: '#fff' });
    txt(lang === 'el' ? 'ΤΕΛΟΣ ΕΠΕΙΣΟΔΙΟΥ 1' : 'END OF EPISODE 1', 0, 60, 36, '#ffd23f', { font: TVFONT, style: 'italic', weight: 900 });
    txt(lang === 'el' ? 'Φωνές: ElevenLabs (προσωρινές) · Ζωγραφισμένο με κώδικα' : 'Voices: ElevenLabs (placeholder) · Drawn in code', 0, 140, 20, '#fffaf0', { font: TVFONT, weight: 700 });
    ctx.restore();
  }
}
return {
  id: 'scene20', title: '20 · Τέλος', steps, render,
  events: M => [[M.factory.a, () => { for (let i = 0; i < 8; i++) noise(.2, .1, 200, 1, 'lowpass', i * .5); }], [M.open.a + .5, SFX.creak], [M.open.b - .4, () => tone(900, .3, 'sine', .04)],
    [M.klak.a + .6, () => { SFX.clack(); SFX.boom(); }], [M.klak.a + 1.6, () => { SFX.clack(); SFX.boom(); }], [M.klak.a + 2.6, () => { SFX.clack(); SFX.boom(); }], [M.title.a, SFX.jingle]],
  ambience: () => ({ hum: .04 }),
};
})());
