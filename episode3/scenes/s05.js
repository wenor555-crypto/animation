/* Ep.3, Scene 5 – «Miner Farm»: an underground quarry somewhere secret. A neon MINER FARM sign. Hundreds of dumb σίτες with pickaxes
   and helmet lamps; carts of ore become coins stamped ₿. The σίτα on a throne of rock. The dumb ones only know one sentence. */
defineScene((() => {
const XZ = ['ΧΑΖΗ ΣΙΤΑ', 'DUMB SCREEN'], FORE = ['ΧΑΖΗ ΣΙΤΑ (εργοδηγός)', 'DUMB SCREEN (foreman)'];
const TX = 1040;
const CAMS = { gate: [640, 250, 1.2], wide: [640, 400, .95], throne: [TX, 380, 1.9], workers: [420, 560, 1.7], fore: [760, 560, 2.3], press: [300, 520, 2] };
const steps = [
  { act: 'loc', d: 2.6, cam: 'gate' },
  { act: 'reveal', d: 3, cam: 'wide' },
  { who: 'sita', cam: 'throne', mark: 'welcome', el: 'Καλώς ήρθατε στο πρώτο ορυχείο κρυπτονομισμάτων… με κασμά.', en: 'Welcome to the first cryptocurrency mine… with pickaxes.' },
  { act: 'press', d: 2.2, cam: 'press' },
  { who: 'sita', cam: 'throne', el: 'Κάθε δέκα κιλά βωξίτη… ένα bitcoin.', en: 'Every ten kilos of bauxite… one bitcoin.' },
  { who: 'xazi', label: XZ, cam: 'workers', mark: 'call', el: 'ΤΗΛΕΦΩΝΗΣΤΕ ΤΩΡΑ!', en: 'CALL NOW!' },
  { who: 'sita', cam: 'throne', el: 'Δεν ξέρουν να λένε τίποτε άλλο. Γι\' αυτό είναι τέλειοι εργαζόμενοι.', en: "They can't say anything else. That's why they're perfect employees." },
  { who: 'sita', cam: 'fore', mark: 'shift', el: 'Βάρδια;', en: 'Shift?' },
  { who: 'xazi', label: FORE, cam: 'fore', el: 'ΤΗΛΕΦΩΝΗΣΤΕ ΤΩΡΑ!', en: 'CALL NOW!' },
  { who: 'sita', cam: 'throne', mark: 'sixteen', el: 'Δεκαέξι ώρες. Ωραία.', en: 'Sixteen hours. Good.' },
  { act: 'end', d: 2.2, cam: 'wide' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  mine(t);
  // the workforce: rows of dumb σίτες swinging pickaxes at the rock face
  for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) {
    const x = 110 + i * 120 + r * 60, y = 610 + r * 70;
    dumbSita(x, y, t, { pick: 1, seed: i * 1.7 + r, s: .5 + r * .08, talk: inM(t, M.call) && r === 1 && i === 3 ? talk('xazi', t) : 0 });
  }
  // the foreman with a clipboard
  dumbSita(760, 690, t, { s: .55, talk: inM(t, M.L[5]) ? talk('xazi', t) : 0 });
  ctx.save(); ctx.translate(800, 620); rect(-18, -26, 36, 48, '#b88a5a', { lw: 2.5 }); rect(-14, -20, 28, 36, '#f4f2ec', { lw: 1.5 }); ctx.restore();
  // carts rolling to the press; coins pouring out
  const cx = 60 + ((t * 60) % 400);
  mineCart(cx, 730, 1);
  rect(250, 560, 120, 130, '#4a4a52', { lw: 4 }); txt('₿-PRESS', 310, 590, 14, '#ffd23f', { font: TVFONT, weight: 900 });
  for (let i = 0; i < 6; i++) { const p = (t * .9 + i / 6) % 1; coin(310 + (i % 2 ? 1 : -1) * p * 60, 690 - Math.sin(p * Math.PI) * 60, 12, t * 6 + i); }
  for (let i = 0; i < 9; i++) coin(360 + i * 16, 700 - (i % 3) * 10, 11, i);
  // the throne
  rockThrone(TX, 690);
  const st = { x: TX, top: 400, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: 'evil', burn: 1 };
  sitaV2(st);
  // a crown of bottle caps
  poly([[TX - 40, 392], [TX - 30, 366], [TX - 12, 384], [TX, 360], [TX + 12, 384], [TX + 30, 366], [TX + 40, 392]], '#f2c21a', { lw: 3 });
  ctx.restore();
  applyLight('night', .3);
  ctx.save(); applyCam(c); mineGlow(t);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) dumbGlow(110 + i * 120 + r * 60, 610 + r * 70, .5 + r * .08);
  sitaGlow({ ...st }, .7); ctx.restore();
  if (inM(t, M.loc)) { caption('ΤΟΠΟΘΕΣΙΑ: ΑΠΟΡΡΗΤΗ', clamp((t - M.loc.a) * 3), 640); }
  if (inM(t, M.reveal, .3, -.3)) { speedLines(640, 360, 50, 320, 'rgba(255,220,120,.5)'); sfxText('ΤΣΑΚ ΤΣΑΚ ΤΣΑΚ', 640, 120, 50, -.06, '#fff'); }
  vignette(.45);
}
return {
  id: 'scene05', title: '5 · Miner Farm', steps, render,
  events: M => {
    const e = [[M.loc.a + .3, () => SFX.buzz(.6)], [M.reveal.a, SFX.drums], [M.press.a + .4, SFX.slam], [M.press.a + 1, SFX.jingle], [M.sixteen.b, SFX.clack]];
    for (let i = 0; i < 12; i++) e.push([M.reveal.a + i * .25, SFX.clack]);
    return e;
  },
  ambience: () => ({ hum: .04 }),
};
})());
