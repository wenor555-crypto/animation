/* Ep.2 remake, Scene 3 – «Η παραγγελία» (chain A): Βασίλης's living room, morning. A τηλεπώληση for a smart beach chair.
   He dials on autopilot, coffee in hand. The σίτα answers the order line. */
defineScene((() => {
const PH = ['ΣΙΤΑ (τηλέφωνο)', 'SITA (phone)'];
const CAMS = { wide: [640, 420, 1.1], screen: [0, 0, 1], vas: [470, 380, 2.2], vasC: [470, 370, 2.9], tvS: [930, 420, 1.9], two: [640, 400, 1.5] };
const steps = [
  { act: 'open', d: 2.6, cam: 'wide' },
  { who: 'tv', cam: 'screen', mark: 'pitch', el: 'Η ΕΞΥΠΝΗ ΚΑΡΕΚΛΑ ΠΑΡΑΛΙΑΣ! Ανοίγει μόνη της! Κλείνει μόνη της!', en: 'THE SMART BEACH CHAIR! It opens by itself! It closes by itself!' },
  { who: 'tv', cam: 'screen', mark: 'call', el: 'ΤΗΛΕΦΩΝΗΣΤΕ ΤΩΡΑ!', en: 'CALL NOW!' },
  { act: 'dial', d: 3.2, cam: 'vas' },
  { who: 'vasilis', cam: 'vas', el: 'Ναι, γεια σας. Θέλω μία καρέκλα. Την έξυπνη.', en: 'Yes, hello. I want one chair. The smart one.' },
  { act: 'beat', d: .9, cam: 'tvS' },
  { who: 'sita', label: PH, cam: 'tvS', mark: 'again', el: 'Καλώς ήρθατε ξανά… Βασίλη.', en: 'Welcome back… Vasilis.' },
  { who: 'sita', label: PH, cam: 'tvS', el: 'Η διεύθυνση είναι η ίδια;', en: 'Same address?' },
  { who: 'vasilis', cam: 'vas', el: 'Λέχαιο. Δίπλα στη συκιά. Το σπίτι με τις κότες.', en: 'Lechaio. Next to the fig tree. The house with the chickens.' },
  { who: 'vasilis', cam: 'vasC', mark: 'cig', el: '…Έχεις ένα τσιγάρο;', en: '…Got a cigarette?', gap: .8 },
  { act: 'wait', d: 1.2, cam: 'tvS' },
  { who: 'sita', label: PH, cam: 'tvS', mark: 'last', el: 'Θα σας έρθει… με την παραγγελία.', en: "It'll come… with your order." },
  { act: 'sip', d: 2.6, cam: 'two' },
];
let M;
function show(t) {           // the τηλεπώληση: presenter + the chair that opens and closes by itself
  const open = .5 + .5 * Math.sin(t * 2.2), red = t > M.again.a - .3;
  tvShop(t, { title: 'Η ΕΞΥΠΝΗ ΚΑΡΕΚΛΑ ΠΑΡΑΛΙΑΣ', sub: 'ανοίγει μόνη της · κλείνει μόνη της', price: '39,90€', price2: 'ΜΟΝΟ', live: 1, product: () => {
    ctx.save(); ctx.translate(520, 560); ctx.scale(2.4, 2.4); beachChair(0, 0, open, t); ctx.restore();
    const tk = talk('tv', t); person(250, 420, 1.15, CAST.presenter, { t, talk: tk, legs: 'stand', mouth: 'smile', brow: 'up', look: [.3, 0], L: [-44, -24], R: tk ? [110 + Math.sin(t * 6) * 10, -160] : [70, -60] });
  } });
  if (red) { ctx.save(); ctx.globalAlpha = .12 + .08 * Math.sin(t * 9); ctx.fillStyle = '#ff2020'; ctx.fillRect(0, 0, 1280, 720); ctx.restore(); redEye(1180, 60, 10); }
}
function livingRoom(t) {
  room({ wall: '#e6d6b8', floor: '#9a7a5a', floorY: 600, stripe: '#cdb58e' });
  rect(120, 150, 220, 180, '#9fd3ea', { lw: 5, w: .4 }); curve([[230, 150], [230, 330]], 4); curve([[120, 240], [340, 240]], 4);
  for (let i = 0; i < 5; i++) blob(150 + i * 40, 300 + Math.sin(t + i) * 2, 16, 12, '#4f7a37', { lw: 2 });   // the fig outside the window
  // icon corner + calendar
  rect(620, 150, 60, 80, '#c8a24a', { lw: 3 }); rect(628, 158, 44, 64, '#6a3a2a', { lw: 2 }); glow(650, 250, 40, 'rgba(255,180,60,1)', .3);
  rect(720, 170, 90, 110, '#fff', { lw: 3 }); rect(720, 170, 90, 24, '#c0392b', { lw: 0 }); txt('ΑΥΓ', 765, 182, 13, '#fff', { font: TVFONT, weight: 900 }); txt('14', 765, 236, 40, INK, { font: TVFONT, weight: 900 });
  // the TV on its cabinet
  rect(780, 560, 300, 130, '#8a5a3a', { lw: 4 });
  tv(930, 520, 300, 170, () => show(t), { stand: false });
  rect(920, 526, 20, 34, '#1c1c20', { lw: 3 });
  // the armchair
  rect(330, 470, 280, 170, '#8a3a2a', { lw: 4, w: .5 }); rect(300, 540, 60, 150, '#8a3a2a', { lw: 4 }); rect(580, 540, 60, 150, '#8a3a2a', { lw: 4 });
  // coffee table: the ashtray (empty, as always)
  rect(560, 640, 120, 12, '#6a4a2a', { lw: 3 }); blob(620, 634, 20, 6, '#c8ccd2', { lw: 2.5 });
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'screen') { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); show(t); ctx.restore(); vignette(.3); return; }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  livingRoom(t);
  const onPhone = t > M.dial.a + 1.8, dialK = prog(t, M.dial.a, M.dial.a + 1.8), tk = talk('vasilis', t);
  person(470, 590, 1, CAST.vasilis, { t, talk: tk, legs: 'seat', lid: true, brow: 'flat', mouth: 'flat', look: onPhone ? [.3, .1] : [1, .1],
    L: [-40, -60], itemL: 'cup2', R: onPhone ? [48, -196] : dialK > 0 ? [70, -120] : [44, -30], itemR: dialK > 0 ? 'phone' : null });
  if (dialK > 0 && !onPhone) for (let i = 0; i < 3; i++) if (Math.sin(t * 14 + i * 2) > .6) sfxText('·', 530 + i * 10, 440, 20, 0, '#fff');
  ctx.restore();
  applyLight('dawn', .3);
  ctx.save(); applyCam(c); glow(930, 440, 260, t > M.again.a - .3 ? 'rgba(255,50,50,1)' : 'rgba(255,200,120,1)', .25); ctx.restore();
  vignette(.35);
}
return {
  id: 'scene03', title: '3 · Η παραγγελία', steps, render,
  events: M => [[M.open.a + .3, SFX.jingle], [M.call.a, SFX.fanfare], [M.dial.a + .3, () => { for (let i = 0; i < 10; i++) tone(700 + (i % 3) * 200, .06, 'sine', .04, 1, i * .14); }],
    [M.dial.a + 1.9, () => { tone(425, .6, 'sine', .04); tone(425, .6, 'sine', .04, 1, 1); }], [M.again.a - .3, SFX.clack]],
  ambience: () => ({ cicada: .01 }),
};
})());
