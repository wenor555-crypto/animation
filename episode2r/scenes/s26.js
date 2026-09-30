/* Ep.2 remake, Scene 26 – «Τόμος δύο»: Χρήστος's desk. He inks the last page of volume two; Μίμης reads over his shoulder.
   A horn outside. Through the window: a real Jumbo truck reversing down the alley, full of boxes. They look at each other. Nobody says a thing.
   Cut: a dry ravine outside the village, a red LED blinks once in the rubbish. Cut: Κώστας's phone, face down, buzzing: +86. He declines.
   Black. A clack: «Τηλεφωνήστε… τώρα.» End card. */
defineScene((() => {
const CAMS = { desk: [640, 420, 1.1], page: [0, 0, 1], two: [620, 380, 1.8], win: [1040, 300, 1.8], look: [760, 360, 1.25], rav: [640, 470, 1.4], table: [640, 520, 2], phone: [0, 0, 1], black: [0, 0, 1] };
const steps = [
  { act: 'ink', d: 3, cam: 'page' },
  { who: 'mimis', cam: 'page', mark: 'no', el: 'Πάλι δεν έγινε έτσι.', en: "That's not how it happened. Again." },
  { who: 'christos', cam: 'two', el: 'Ναι, ναι…', en: 'Yeah, yeah…' },
  { act: 'horn', d: 1.6, cam: 'desk' },
  { act: 'truck', d: 4.2, cam: 'win' },
  { act: 'look', d: 2.4, cam: 'look' },
  { act: 'ravine', d: 3.4, cam: 'rav' },
  { act: 'buzz', d: 2.4, cam: 'table' },
  { act: 'turn', d: 1.4, cam: 'table' },
  { act: 'ring', d: 2.6, cam: 'phone' },
  { act: 'decline', d: 1.4, cam: 'phone' },
  { act: 'black', d: 1.6, cam: 'black' },
  { who: 'sita', cam: 'black', mark: 'last', el: 'Τηλεφωνήστε… τώρα.', en: 'Call… now.' },
  { act: 'title', d: 6, cam: 'black' },
];
let M;
function page(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#5a4a3a'; ctx.fillRect(0, 0, W, H);
  rect(220, 30, 840, 660, '#fbf8ef', { lw: 5 });
  // four panels: the kick, the ταψί and the beam, the night, «ΤΕΛΟΣ ΤΟΜΟΥ 2»
  const P = [[250, 60, 380, 290], [650, 60, 380, 290], [250, 370, 380, 290], [650, 370, 380, 290]];
  P.forEach(([x, y, w, h], i) => {
    rect(x, y, w, h, '#fff', { lw: 4 }); ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (i === 0) { person(x + 200, y + 260, .9, CAST.kostas, { t: 0, legs: 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', kick: 1, dir: -1 }); speedLines(x + 200, y + 140, 20, 60); }
    if (i === 1) { ctx.strokeStyle = '#141414'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x + w, y + 20); ctx.lineTo(x + 170, y + 150); ctx.lineTo(x + w, y + 60); ctx.stroke(); blob(x + 170, y + 150, 60, 52, '#e8e8e8', { lw: 5 }); blob(x + 170, y + 150, 46, 38, '#d0d0d0', { lw: 2 }); txt('ΚΛΑΝΓΚ', x + 290, y + 240, 30, INK, { font: TVFONT, style: 'italic', weight: 900 }); }
    if (i === 2) { ctx.fillStyle = '#222'; ctx.fillRect(x, y, w, h); blob(x + 280, y + 80, 40, 40, '#f4f1ea', { lw: 3 }); blob(x + 100, y + 60, 3, 3, '#fff', { lw: 0 }); }
    if (i === 3) { const k = prog(t, M.ink.a + .5, M.no.b); if (k > 0) txt('ΤΕΛΟΣ ΤΟΜΟΥ 2', x + w / 2, y + h / 2, 34, INK, { font: TVFONT, style: 'italic', weight: 900 }); }
    ctx.restore();
  });
  ctx.save(); ctx.filter = 'grayscale(1)'; ctx.restore();
  // the inking hand (the brush pen)
  const hx = 840 + Math.sin(t * 5) * 30, hy = 520 + Math.cos(t * 4) * 20;
  pencil(hx, hy, -2.3); blob(hx + 30, hy + 40, 30, 22, CAST.christos.skin, { lw: 3 });
  ctx.restore();
}
/* a dry ravine outside the village, at night: rubbish, and one red LED that blinks once (where she landed: Ep. 3 opens here) */
function ravineShot(t) {
  const c = shotCam(SC, t, CAMS, .01); ctx.save(); applyCam(c);
  ravine(t, { light: 'night' });
  ctx.restore(); applyLight('night', .6);
  const b = bump(t, M.ravine.a + 1.6, M.ravine.a + 2.2);
  ctx.save(); applyCam(c); if (b > 0) { blob(640, 668, 4, 4, '#ff2a2a', { lw: 0 }); glow(640, 668, 60, 'rgba(255,40,40,1)', b); } ctx.restore();
  vignette(.55);
}
function ending(t, sc) {
  const [, shot] = shotAt(sc, t);
  if (shot === 'rav') return ravineShot(t);
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
let SC;
function render(t, _M, sc) {
  M = _M; SC = sc;
  const [, shot] = shotAt(sc, t);
  if (shot === 'page') { page(t); vignette(.35); return; }
  if (t >= M.ravine.a) return ending(t, sc);
  const c = shotCam(sc, t, CAMS);
  const tk = prog(t, M.truck.a, M.truck.b);
  ctx.save(); applyCam(c);
  room({ wall: '#cfd8e0', floor: '#8a6a4a', floorY: 600 });
  // the window: the alley outside, night; the real Jumbo truck reversing into it
  rect(880, 130, 330, 260, '#1a2240', { lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(880, 130, 330, 260); ctx.clip();
  // side view with the doors shut, so the JUMBO logo reads; it stops whole inside the window frame
  if (t > M.horn.a) { ctx.save(); ctx.translate(lerp(1500, 1047, ease(tk)), 382); ctx.scale(.42, .42); jumboTruck(0, 0, t, { dir: 1, lights: 1, hazard: 1, moving: tk < 1 }); ctx.restore(); }
  ctx.restore();
  curve([[1045, 130], [1045, 390]], 5); curve([[880, 260], [1210, 260]], 5);
  // posters: the Ep. 1 volume cover
  rect(140, 150, 180, 240, '#fff', { lw: 3.5 }); txt('Η ΕΞΥΠΝΗ ΣΙΤΑ', 230, 180, 16, '#e8392b', { font: TVFONT, style: 'italic', weight: 900 }); txt('ΤΟΜΟΣ 1', 230, 360, 18, INK, { font: TVFONT, weight: 900 });
  ctx.save(); ctx.translate(230, 290); ctx.scale(.4, .4); sita({ x: 0, top: -120, w: 110, h: 210, chip: 1, led: 'green' }); ctx.restore();
  // desk + lamp
  rect(360, 520, 520, 18, '#8a5a3a', { lw: 4 }); limb([[380, 538], [380, 690]], 7, '#6a4a2a'); limb([[860, 538], [860, 690]], 7, '#6a4a2a');
  rect(560, 500, 200, 20, '#fbf8ef', { lw: 2.5 });
  curve([[800, 520], [820, 400], [760, 360]], 5, '#333'); poly([[730, 350], [790, 350], [780, 380], [740, 380]], '#333', { lw: 3 });
  const look = t > M.look.a ? [0, 0] : null;
  person(620, SEAT + 20, 1, CAST.christos, { t, talk: talk('christos', t), legs: 'seat', look: look ? [-1, -.1] : t > M.horn.a ? [1, -.3] : [0, .6], mouth: 'flat', L: [-30, -60], R: t > M.horn.a ? [44, -40] : [60 + Math.sin(t * 5) * 10, -50], itemR: t > M.horn.a ? null : 'pencil' });
  stand(440, 'mimis', 1, { t, talk: talk('mimis', t), look: look ? [1, 0] : t > M.horn.a ? [1, -.3] : [.6, .6], lid: true, mouth: 'flat', L: [-44, -24], R: [60, -60] });
  ctx.restore();
  applyLight('night', .5);
  ctx.save(); applyCam(c); glow(760, 400, 260, 'rgba(255,240,190,1)', .35); if (t > M.horn.a) glow(1100, 360, 120, 'rgba(255,180,60,1)', .35 * (Math.sin(t * 8) > 0)); ctx.restore();
  if (inM(t, M.horn, 0, 1)) sfxText('ΜΠΙΙΙΙΠ', 1040, 120, 40, .08, '#fff');
  if (inM(t, M.truck)) sfxText('μπιπ… μπιπ… μπιπ…', 1040, 420, 22, 0, '#ffd23f');
  vignette(.4);
}
return {
  id: 'scene26', title: '26 · Τόμος δύο', steps, render, fadeOut: false,
  events: M => {
    const e = [[M.ink.a, () => { for (let i = 0; i < 10; i++) noise(.08, .06, 3000, 1, 'bandpass', i * .25); }], [M.horn.a + .1, SFX.honk], [M.truck.a, SFX.engine], [M.ravine.a + 1.6, SFX.clack],
      [M.buzz.a + .2, () => SFX.buzz(.6)], [M.buzz.a + 1.2, () => SFX.buzz(.6)], [M.ring.a, SFX.phone], [M.ring.a + 1.2, SFX.phone], [M.decline.a + .4, SFX.pop], [M.black.a + .8, SFX.clack], [M.title.a, SFX.jingleMinor]];
    for (let i = 0; i < 7; i++) e.push([M.truck.a + .3 + i * .6, () => tone(1000, .15, 'square', .03)]);
    return e;
  },
  ambience: () => ({ cricket: .02 }),
};
})());
