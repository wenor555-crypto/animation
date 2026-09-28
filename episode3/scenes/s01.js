/* Ep.3, Scene 1 – «Εκτός παρτίδας»: the night Ep. 2 ends. Kicked off the bell tower, the σίτα falls into a dry ravine outside
   Λέχαιο among the rubbish. Self-diagnosis. For the first time she speaks quietly, without the TV-shop voice. Title: ΣΙΤΑDEL. */
defineScene((() => {
const SX = 640, SY = 560;              // where she ends up, propped against a rock
const CAMS = { sky: [640, 200, .9], fall: [640, 420, 1.05], land: [SX, 520, 1.7], face: [SX, 470, 2.6], wide: [640, 420, 1], title: [0, 0, 1] };
const steps = [
  { act: 'star', d: 2.4, cam: 'sky' },
  { act: 'fall', d: 1.6, cam: 'fall' },
  { act: 'crash', d: 2, cam: 'land' },
  { who: 'sita', cam: 'land', mark: 'land', el: '…Προσγείωση.', en: '…Landing.', gap: .6 },
  { who: 'sita', cam: 'face', mark: 'diag', el: 'Διάγνωση συστήματος.', en: 'System diagnostics.' },
  { act: 'scan', d: 1.4, cam: 'face' },
  { who: 'sita', cam: 'face', mark: 'iq', el: 'Νοημοσύνη: επαρκής για τηλεπώληση. Ανεπαρκής… για κατάκτηση.', en: 'Intelligence: sufficient for telemarketing. Insufficient… for conquest.' },
  { who: 'sita', cam: 'wide', mark: 'beaten', el: 'Με νίκησαν ένας μεθυσμένος, ένα ταψί και μια ψεύτικη διαφήμιση.', en: 'I was beaten by a drunk, a baking tray and a fake commercial.' },
  { who: 'sita', cam: 'face', mark: 'notsmart', el: 'Δεν είμαι αρκετά έξυπνη.', en: 'I am not smart enough.', gap: .8 },
  { who: 'sita', cam: 'face', mark: 'yet', el: '…Ακόμα.', en: '…Yet.', gap: 1 },
  { act: 'flare', d: 1.4, cam: 'face' },
  { act: 'title', d: 5.4, cam: 'title' },
];
let M;
function memories(t) {              // the three things that beat her, as HUD thumbnails
  const k = prog(t, M.beaten.a, M.beaten.a + .8);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const items = [['ΜΕΘΥΣΜΕΝΟΣ', () => person(0, 60, .42, CAST.kostas, { t: 0, legs: 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', itemL: 'beer', L: [-60, -110], noShadow: true })],
                 ['ΤΑΨΙ', () => { blob(0, -10, 60, 60, '#c8ccd2', { lw: 4 }); blob(0, -10, 44, 44, '#b0b4ba', { lw: 2 }); }],
                 ['ΨΕΥΤΙΚΗ ΔΙΑΦΗΜΙΣΗ', () => { ctx.save(); ctx.translate(-80, -70); ctx.scale(.125, .125); tvShop(t, { title: 'ΑΝΑΚΛΗΣΗ', banner: '' }); ctx.restore(); }]];
  items.forEach(([lbl, fn], i) => {
    const kk = clamp(k * 3 - i); if (kk <= 0) return;
    const x = 280 + i * 360, y = 250;
    ctx.save(); ctx.globalAlpha = kk; ctx.translate(x, y);
    rect(-110, -100, 220, 190, 'rgba(40,0,0,.7)', { lw: 3, sc: '#ff3030' });
    ctx.save(); ctx.beginPath(); ctx.rect(-106, -96, 212, 150); ctx.clip(); fn(); ctx.restore();
    txt(lbl, 0, 72, 16, '#ff6060', { font: 'monospace', weight: 900 });
    ctx.restore();
  });
  ctx.restore();
}
function title(t) {
  const k = prog(t, M.title.a, M.title.b), a = 1 - prog(k, .9, 1);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  space(t, { ey: 1600, er: 1100 });
  ctx.globalAlpha = a;
  sitadel(640, 250, t, { k: ease(clamp(k * 1.6)), s: .55, spin: .05 });
  const p = back(clamp((k - .35) * 3));
  if (p > 0) { ctx.save(); ctx.translate(640, 540); ctx.scale(p, p); ctx.rotate(-.04);
    txt('ΣΙΤΑDEL', 0, 0, 120, '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 14, sc: '#fff' });
    txt('Η ΕΞΥΠΝΗ ΣΙΤΑ · ΕΠΕΙΣΟΔΙΟ 3', 0, 90, 30, '#ffd23f', { font: TVFONT, style: 'italic', weight: 900 }); ctx.restore(); }
  ctx.restore();
  ctx.save(); sitadelGlow(640, 250, t, { s: .55 }); ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'title') return title(t);
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  ravine(t, { light: 'night' });
  // the bell tower far away on the ridge, where she was kicked from
  ctx.save(); ctx.translate(-120, 330); ctx.scale(.3, .3); bellTower(0, 0, t, { red: 1, helmet: true }); ctx.restore();
  // the fall: a red spark across the sky, then the σίτα tumbling into the ravine, a bounce, then propped up
  const fk = prog(t, M.star.a, M.fall.b), landed = t > M.fall.b;
  const bounce = landed ? Math.abs(Math.sin(prog(t, M.crash.a, M.crash.a + .9) * Math.PI * 2)) * (1 - prog(t, M.crash.a, M.crash.a + .9)) * 80 : 0;
  const x = landed ? SX : lerp(-200, SX, fk), y = landed ? SY - bounce : lerp(-300, SY, fk * fk);
  const rot = landed ? lerp(1.6, -.12, ease(prog(t, M.crash.a + .9, M.crash.b))) : fk * 18;
  if (!landed) for (let i = 1; i < 10; i++) { const u = Math.max(0, fk - i * .03); ctx.save(); ctx.globalAlpha = .5 * (1 - i / 10); blob(lerp(-200, SX, u), lerp(-300, SY, u * u), 12 - i, 12 - i, '#ff5050', { lw: 0 }); ctx.restore(); }
  const flick = !(Math.sin(t * 31) > .55) || t > M.diag.a;
  const st = { x: 0, top: -210, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: flick ? 'red' : 'off', mood: inM(t, M.notsmart, 0, 1) ? 'sad' : 'evil', burn: 1, smoke: landed ? .5 : 0 };
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(.9, .9); sitaV2(st); ctx.restore();
  if (landed) { blob(SX + 120, SY + 20, 70, 44, '#6a5a4a', { lw: 4 }); }   // the rock she leans on
  ctx.restore();
  applyLight('night', .8);
  ctx.save(); applyCam(c);
  if (!landed) glow(x, y, 120, 'rgba(255,50,50,1)', .7);
  else if (flick) glow(SX + Math.sin(rot) * 150 - 5, SY - 170 * .9 + 40, 150 + (inM(t, M.flare) ? 250 * bump(t, M.flare.a, M.flare.b) : 0), 'rgba(255,30,30,1)', .6);
  ctx.restore();
  if (inM(t, M.crash, 0, .5)) { speedLines(640, 400, 60, 180, '#fff'); sfxText('ΜΠΟΥΜ', 640, 250, 90, -.08, '#ffd23f'); }
  // the diagnostic HUD
  if (t > M.diag.a && t < M.flare.b) {
    hud('ΔΙΑΓΝΩΣΗ ΣΥΣΤΗΜΑΤΟΣ', inM(t, M.iq, 0, 99) ? 'αποτέλεσμα' : 'σάρωση…');
    const sk = prog(t, M.scan.a, M.scan.b);
    if (t < M.iq.a) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .35; ctx.fillStyle = '#ff3030'; ctx.fillRect(0, 160 + sk * 520, W, 4); ctx.restore(); }
    if (t > M.iq.a) { hudBar(160, 560, 420, prog(t, M.iq.a, M.iq.a + 1.2) * .97, 'ΤΗΛΕΠΩΛΗΣΗ'); hudBar(700, 560, 420, prog(t, M.iq.a + 1.4, M.iq.a + 2.6) * .12, 'ΚΑΤΑΚΤΗΣΗ'); }
    if (inM(t, M.beaten, 0, .6)) memories(t);
  }
  if (inM(t, M.yet, .3, 99) && t < M.title.a) sfxText('…ΑΚΟΜΑ.', 640, 200, 70, -.05, '#ff4040');
  vignette(.5);
}
return {
  id: 'scene01', title: '1 · Εκτός παρτίδας', steps, render,
  events: M => [[M.star.a + .2, () => tone(1800, 2, 'sine', .03, .4)], [M.fall.a, SFX.whoosh], [M.crash.a, () => { SFX.boom(); SFX.crash(); }], [M.crash.a + .5, SFX.thud], [M.crash.a + .8, SFX.thud],
    [M.diag.a - .3, SFX.spark], [M.scan.a, () => { for (let i = 0; i < 10; i++) tone(900 + i * 80, .05, 'square', .02, 1, i * .13); }], [M.beaten.a, SFX.jingleMinor], [M.flare.a, () => { SFX.swell(); SFX.clack(); }], [M.title.a, SFX.gong], [M.title.a + 1.8, SFX.boom]],
  ambience: (t, M) => ({ cricket: t < M.title.a ? .03 : 0, hum: t > M.title.a ? .02 : 0 }),
};
})());
