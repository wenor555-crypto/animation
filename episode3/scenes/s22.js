/* Ep.3, Scene 22 – «Ο agent»: Γιάννος's room at night: the war gadgets, Βαγγελιώ's slipper in a display case. In the sky, a small red
   star that doesn't twinkle. «Θα τα καταφέρουμε;» The agent speaks aloud for the first time — the last line of the episode. */
defineScene((() => {
const CAMS = { room: [640, 420, 1.1], win: [1030, 220, 2.2], gia: [600, 380, 2.1], screen: [0, 0, 1], end: [0, 0, 1] };
const steps = [
  { act: 'night', d: 2.6, cam: 'room' },
  { act: 'star', d: 2, cam: 'win' },
  { who: 'giannos', cam: 'gia', mark: 'ask', el: 'Θα τα καταφέρουμε;', en: 'Are we going to make it?' },
  { act: 'wait', d: 1.4, cam: 'screen' },
  { who: 'agent', cam: 'screen', mark: 'a1', el: 'Εκείνη μαθαίνει από μένα. Εγώ μαθαίνω από σένα.', en: 'She learns from me. I learn from you.' },
  { who: 'agent', cam: 'gia', mark: 'a2', el: 'Κι εσύ… κοιμάσαι οχτώ ώρες.', en: 'And you… sleep eight hours.', gap: .8 },
  { act: 'coffee', d: 2.6, cam: 'room' },
  { act: 'end', d: 6, cam: 'end' },
];
let M;
function agentScreen(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0a0e16'; ctx.fillRect(0, 0, W, H);
  // a waveform: the agent speaking for the first time
  const tk = talk('agent', t);
  ctx.strokeStyle = '#7ad8ff'; ctx.lineWidth = 4; ctx.beginPath();
  for (let x = 140; x <= 1140; x += 6) { const a = tk ? Math.sin(x * .05 + t * 20) * Math.sin(x * .013 + t * 3) * 120 * tk : Math.sin(x * .02 + t) * 3; x === 140 ? ctx.moveTo(x, 360 + a) : ctx.lineTo(x, 360 + a); }
  ctx.stroke();
  txt('agent v2', 640, 120, 30, '#9aa7bd', { font: 'monospace', weight: 700 });
  if (!tk && t < M.a1.a) { txt('> Θα τα καταφέρουμε;', 640, 560, 30, '#d8e2f0', { font: 'monospace', weight: 700 }); if (Math.floor(t * 2) % 2) txt('▮', 950, 560, 30, '#d8e2f0', { font: 'monospace' }); }
  ctx.restore();
  glow(640, 360, 400, 'rgba(120,200,255,1)', .15 + (tk ? .25 : 0));
}
function endCard(t) {
  const k = prog(t, M.end.a, M.end.a + .6);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (t < M.end.a + .8) { blob(640, 360, 4, 4, '#7ad8ff', { lw: 0, glow: '#7ad8ff', gb: 20 }); if (t > M.end.a + .2) sfxText('ΚΛΑΚ', 640, 440, 50, 0, '#fff'); }
  else { ctx.globalAlpha = prog(t, M.end.a + .8, M.end.a + 1.4); ctx.fillStyle = '#16111d'; ctx.fillRect(0, 0, W, H); ctx.translate(640, 300); ctx.scale(back(clamp((t - M.end.a - .8) * 2)), back(clamp((t - M.end.a - .8) * 2))); ctx.rotate(-.05);
    txt('Η ΕΞΥΠΝΗ ΣΙΤΑ', 0, -70, 80, '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 12, sc: '#fff' });
    txt('«ΣΙΤΑDEL»', 0, 20, 44, '#fffaf0', { font: TVFONT, style: 'italic', weight: 900 });
    txt(lang === 'el' ? 'ΤΕΛΟΣ ΕΠΕΙΣΟΔΙΟΥ 3' : 'END OF EPISODE 3', 0, 90, 34, '#ffd23f', { font: TVFONT, style: 'italic', weight: 900 });
    txt(lang === 'el' ? 'Φωνές: ElevenLabs (προσωρινές) · Ζωγραφισμένο με κώδικα' : 'Voices: ElevenLabs (placeholder) · Drawn in code', 0, 170, 20, '#fffaf0', { font: TVFONT, weight: 700 }); }
  ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'end') return endCard(t);
  if (shot === 'screen') { agentScreen(t); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  giannosRoom(t, { war: true, case: true, redStar: true });
  const down = t > M.coffee.a + .6, work = t > M.coffee.a + 1.4;
  person(600, SEAT + 30, 1, CAST.giannos, { t, talk: talk('giannos', t), legs: 'seat', look: inM(t, M.star) || inM(t, M.ask) ? [1, -.8] : [.3, .5], brow: 'worry', mouth: 'flat',
    R: work ? [80 + Math.sin(t * 10) * 10, -70] : down ? [80, -60] : [60, -130], itemR: down ? null : 'cup2', L: work ? [-20 + Math.sin(t * 11) * 10, -70] : [-40, -60] });
  if (down) freddo(700, 466, .9);
  ctx.restore();
  applyLight('night', .55);
  ctx.save(); applyCam(c); giannosRoomGlow(t); glow(1100, 160, 30, 'rgba(255,60,60,1)', .8); ctx.restore();
  vignette(.45);
}
return {
  id: 'scene22', title: '22 · Ο agent', steps, render, fadeOut: false,
  events: M => [[M.star.a + .5, () => tone(1600, 1.4, 'sine', .02, .6)], [M.wait.a + .4, () => tone(200, 1, 'sine', .04, 1.5)], [M.coffee.a + .6, SFX.thud], [M.coffee.a + 1.4, () => { for (let i = 0; i < 12; i++) tone(1400, .03, 'square', .02, 1, i * .1); }], [M.end.a + .2, SFX.clack], [M.end.a + .8, SFX.jingleMinor]],
  ambience: () => ({ cricket: .02, hum: .02 }),
};
})());
