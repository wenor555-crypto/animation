/* Ep.2, Scene 22 – «Τόμος δύο»: Χρήστος's desk. He inks the last page of volume two; Μίμης reads over his shoulder.
   A horn outside. Through the window: a real Jumbo truck reversing down the alley, full of boxes. They look at each other. Nobody says a thing. */
defineScene((() => {
const CAMS = { desk: [640, 420, 1.1], page: [0, 0, 1], two: [620, 380, 1.8], win: [1040, 300, 1.8], look: [640, 380, 1.5] };
const steps = [
  { act: 'ink', d: 3, cam: 'page' },
  { who: 'mimis', cam: 'two', el: 'Τι φτιάχνεις πάλι;', en: 'What are you making now?' },
  { who: 'christos', cam: 'two', el: 'Τόμο δύο.', en: 'Volume two.' },
  { who: 'mimis', cam: 'page', mark: 'no', el: 'Πάλι δεν έγινε έτσι.', en: "That's not how it happened. Again." },
  { who: 'christos', cam: 'two', el: 'Ναι, ναι…', en: 'Yeah, yeah…' },
  { act: 'horn', d: 1.6, cam: 'desk' },
  { act: 'truck', d: 4.2, cam: 'win' },
  { act: 'look', d: 3, cam: 'look' },
];
let M;
function page(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#5a4a3a'; ctx.fillRect(0, 0, W, H);
  rect(220, 30, 840, 660, '#fbf8ef', { lw: 5 });
  // four panels: the kick, the σίτα flying, the moon, «ΤΕΛΟΣ ΤΟΜΟΥ 2»
  const P = [[250, 60, 380, 290], [650, 60, 380, 290], [250, 370, 380, 290], [650, 370, 380, 290]];
  P.forEach(([x, y, w, h], i) => {
    rect(x, y, w, h, '#fff', { lw: 4 }); ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (i === 0) { person(x + 200, y + 260, .9, CAST.kostas, { t: 0, legs: 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', kick: 1, dir: -1 }); speedLines(x + 200, y + 140, 20, 60); }
    if (i === 1) { ctx.translate(x + 190, y + 150); ctx.rotate(.6); ctx.scale(.6, .6); sita({ x: 0, top: -100, w: 110, h: 210, chip: 1, led: 'red', mood: 'shock', burn: 1 }); }
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
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'page') { page(t); vignette(.35); return; }
  const c = shotCam(sc, t, CAMS);
  const tk = prog(t, M.truck.a, M.truck.b);
  ctx.save(); applyCam(c);
  room({ wall: '#cfd8e0', floor: '#8a6a4a', floorY: 600 });
  // the window: the alley outside, night; the real Jumbo truck reversing into it
  rect(880, 130, 330, 260, '#1a2240', { lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(880, 130, 330, 260); ctx.clip();
  if (t > M.horn.a) { ctx.save(); ctx.translate(lerp(1500, 1060, ease(tk)), 380); ctx.scale(.45, .45); jumboTruck(0, 0, t, { dir: 1, door: 1, inside: '#c9995a', lights: 1, hazard: 1, moving: tk < 1 });
    for (let i = 0; i < 6; i++) rect(-350 + (i % 3) * 60, -280 + Math.floor(i / 3) * 70, 56, 64, '#c9995a', { lw: 3 }); ctx.restore(); }
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
  id: 'scene22', title: '22 · Τόμος δύο', steps, render,
  events: M => {
    const e = [[M.ink.a, () => { for (let i = 0; i < 10; i++) noise(.08, .06, 3000, 1, 'bandpass', i * .25); }], [M.horn.a + .1, SFX.honk], [M.truck.a, SFX.engine]];
    for (let i = 0; i < 7; i++) e.push([M.truck.a + .3 + i * .6, () => tone(1000, .15, 'square', .03)]);
    return e;
  },
  ambience: () => ({ cricket: .02 }),
};
})());
