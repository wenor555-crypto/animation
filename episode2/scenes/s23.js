/* Ep.2, Scene 23 – «+86»: Κώστας's phone, face down on the table. It vibrates. He turns it over: +86. He looks at it… and declines.
   Black. One klak. End of episode 2. */
defineScene((() => {
const CAMS = { table: [640, 520, 2], phone: [0, 0, 1], black: [0, 0, 1] };
const steps = [
  { act: 'buzz', d: 2.6, cam: 'table' },
  { act: 'turn', d: 1.4, cam: 'table' },
  { act: 'ring', d: 3, cam: 'phone' },
  { act: 'decline', d: 1.4, cam: 'phone' },
  { act: 'black', d: 1.6, cam: 'black' },
  { who: 'sita', cam: 'black', mark: 'last', el: 'Τηλεφωνήστε… τώρα.', en: 'Call… now.' },
  { act: 'title', d: 6, cam: 'black' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'phone') {
    const dec = t > M.decline.a + .4;
    phoneScreen(t, dec ? { label: 'Η κλήση απορρίφθηκε', number: '+86 755 8888 1442', sub: 'Shenzhen, Κίνα', inCall: 0, ring: 0 } : { ring: 1 });
    if (!dec && t > M.decline.a) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); blob(550, 570, 26, 30, CAST.kostas.skin, { lw: 3 }); ctx.restore(); }   // his thumb on «decline»
    if (dec) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .5; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    return;
  }
  if (shot === 'black') {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    // one red LED in the dark, then the end card
    if (t > M.black.a + .8 && t < M.title.a + .4) { blob(640, 360, 5, 5, '#ff2a2a', { lw: 0, glow: '#ff2020', gb: 30 }); glow(640, 360, 80, 'rgba(255,40,40,1)', .6); }
    if (t > M.black.a + .8 && t < M.black.a + 1.2) sfxText('ΚΛΑΚ', 640, 460, 60, 0, '#fff');
    if (t > M.title.a) {
      const k = prog(t, M.title.a, M.title.a + .6);
      ctx.fillStyle = `rgba(22,17,29,${k})`; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = k;
      ctx.translate(640, 300); ctx.scale(back(k), back(k)); ctx.rotate(-.05);
      txt('Η ΕΞΥΠΝΗ ΣΙΤΑ', 0, -70, 80, '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 12, sc: '#fff' });
      txt('«ΤΗΛΕΦΩΝΗΣΤΕ ΤΩΡΑ»', 0, 20, 40, '#fffaf0', { font: TVFONT, style: 'italic', weight: 900 });
      txt(lang === 'el' ? 'ΤΕΛΟΣ ΕΠΕΙΣΟΔΙΟΥ 2' : 'END OF EPISODE 2', 0, 90, 34, '#ffd23f', { font: TVFONT, style: 'italic', weight: 900 });
      txt(lang === 'el' ? 'Φωνές: ElevenLabs (προσωρινές) · Ζωγραφισμένο με κώδικα' : 'Voices: ElevenLabs (placeholder) · Drawn in code', 0, 170, 20, '#fffaf0', { font: TVFONT, weight: 700 });
    }
    ctx.restore(); return;
  }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  room({ wall: '#d9cfe0', floor: '#8a6a4a', floorY: 600 });
  rect(360, 560, 560, 16, '#8a5a3a', { lw: 3.5 });
  beerCan(460, 558, 1); freddo(820, 556);
  // the phone: face down, buzzing, then turned over by his hand
  const turned = t > M.turn.a + .6, buzz = t < M.turn.b ? Math.sin(t * 70) * 3 : 0;
  ctx.save(); ctx.translate(640 + buzz, 552);
  rect(-44, -8, 88, 12, '#1b1b1f', { lw: 3 }); if (turned) rect(-38, -10, 76, 4, '#5b87c4', { lw: 0 });
  ctx.restore();
  if (!turned) sfxText('BZZ', 640 + buzz, 500, 24, -.1, '#fff');
  if (inM(t, M.turn)) { const k = bump(t, M.turn.a, M.turn.b); limb([[1100, 700], [800, 620 - k * 20], [680 + (1 - k) * 60, 560 - k * 20]], 22, '#b8e02c'); blob(680 + (1 - k) * 60, 556 - k * 20, 20, 16, CAST.kostas.skin, { lw: 3 }); }
  ctx.restore();
  applyLight('night', .6);
  vignette(.45);
}
return {
  id: 'scene23', title: '23 · +86', steps, render, fadeOut: false,
  events: M => [[M.buzz.a + .2, () => SFX.buzz(.6)], [M.buzz.a + 1.2, () => SFX.buzz(.6)], [M.ring.a, SFX.phone], [M.ring.a + 1.2, SFX.phone], [M.decline.a + .4, SFX.pop], [M.black.a + .8, () => { SFX.clack(); tone(60, .8, 'sawtooth', .05, .7); }], [M.title.a, SFX.jingleMinor]],
  ambience: () => ({ hum: .01 }),
};
})());
