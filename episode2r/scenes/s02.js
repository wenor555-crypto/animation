/* Ep.2 remake, Scene 2 – «Αναπάντητη»: morning, Κώστας (sober, wrecked) on his couch. +86 calls, and calls, and calls.
   He picks up. The σίτα: «…Και δεν τελειώσαμε.» Κώστας, flat: «Δεν ενδιαφέρομαι για προσφορές.» Hangs up, phone face down, back to sleep. Title. */
defineScene((() => {
const PH = ['ΣΙΤΑ (τηλέφωνο)', 'SITA (phone)'];
const CAMS = { wide: [640, 430, 1.15], phone: [0, 0, 1], face: [560, 420, 2.3], faceC: [560, 400, 3.1], table: [930, 600, 2.4], title: [0, 0, 1] };
const steps = [
  { act: 'sleep', d: 3.4, cam: 'wide' },
  { act: 'ring1', d: 2.4, cam: 'table' },
  { act: 'ignore', d: 2, cam: 'wide' },
  { act: 'ring2', d: 1.4, cam: 'phone' },
  { act: 'ring3', d: 1.2, cam: 'table' },
  { act: 'ring4', d: 1.2, cam: 'phone' },
  { act: 'pick', d: 3, cam: 'wide' },
  { act: 'silence', d: 1.2, cam: 'face' },
  { who: 'sita', label: PH, cam: 'face', mark: 'c1', el: 'Κώστα.', en: 'Kostas.' },
  { who: 'sita', label: PH, cam: 'phone', mark: 'c3', el: 'Εγώ είμαι. Θα γυρίσω.', en: "It's me. I'll be back." },
  { who: 'sita', label: PH, cam: 'faceC', mark: 'c4', el: '…Και δεν τελειώσαμε.', en: "…And we're not done.", gap: .8 },
  { who: 'kostas', cam: 'faceC', mark: 'no', el: 'Δεν ενδιαφέρομαι για προσφορές.', en: "I'm not interested in offers.", gap: .6 },
  { act: 'nothing', d: 2, cam: 'faceC' },
  { act: 'hang', d: 4.4, cam: 'wide' },
  { act: 'title', d: 5, cam: 'title' },
];
let M;
function flat(t) {
  room({ wall: '#d9cfe0', floor: '#8a6a4a', floorY: 600 });
  // the window: late morning glare through half-shut blinds
  rect(160, 140, 300, 260, '#fff4c8', { lw: 5, w: .4 });
  for (let i = 0; i < 9; i++) rect(160, 144 + i * 22, 300, 12, '#e8dcc0', { lw: 1.5, w: .2 });
  // poster: a manga Panik drawn by Χρήστος
  rect(1010, 180, 150, 200, '#f4f1ea', { lw: 3.5 }); txt('PANIK', 1085, 350, 24, '#c8f04a', { font: TVFONT, style: 'italic', weight: 900, stroke: 5 });
  blob(1085, 250, 34, 40, '#b8e02c', { lw: 3 }); for (const sx of [-12, 12]) rect(1085 + sx - 10, 240, 20, 10, '#141418', { lw: 2 });
  sofa(560, 700);
  // side table: the phone, the IQOS in its pocket charger (a tiny red flicker nobody sees)
  rect(860, 610, 150, 14, '#8a5a3a', { lw: 3.5 }); limb([[880, 624], [880, 700]], 5, '#6a4a2a'); limb([[990, 624], [990, 700]], 5, '#6a4a2a');
  iqosCharger(960, 600, .9); iqos(960, 572, .9, 0, Math.sin(t * 1.3) > .96 ? 'red' : 'off', t);
  // last night's cans
  for (const [x, r] of [[760, 1.5], [800, 0], [1060, -1.4], [700, .3]]) beerCan(x, r ? 692 : 690, .9, r);
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  const ringing = [M.ring1, M.ring2, M.ring3, M.ring4].some(m => inM(t, m)) || inM(t, M.ignore);
  const count = t < M.ring2.a ? 1 : t < M.ring3.a ? 2 : t < M.ring4.a ? 3 : 4;
  const inCall = t >= M.silence.a && t < M.hang.a + .6;
  if (shot === 'title') return title(t);
  if (shot === 'phone') {
    phoneScreen(t, inCall ? { inCall: 1, timer: `00:0${Math.min(9, Math.floor(t - M.silence.a))}`, label: 'Σε κλήση' } : { ring: 1, count: count > 1 ? count - 1 : 0 });
    if (inCall && inM(t, M.c3)) glow(640, 360, 300, 'rgba(255,40,40,1)', .15);
    return;
  }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  flat(t);
  // the phone on the side table (shakes while it rings; face down at the end)
  const inHand = t >= M.pick.a + 1.6 && t < M.hang.a + 1.8, faceDown = t >= M.hang.a + 1.8;
  if (!inHand) { ctx.save(); ctx.translate(920 + (ringing ? Math.sin(t * 70) * 3 : 0), 606); rect(-22, -6, 44, 8, '#1b1b1f', { lw: 2.5 }); if (!faceDown) rect(-18, -8, 36, 3, ringing ? '#5b87c4' : '#2a3040', { lw: 0 }); ctx.restore();
    if (ringing) sfxText('BZZ', 920, 560 - Math.sin(t * 20) * 4, 20, -.1, '#fff'); }
  // Κώστας: lying on his back, then sitting up to answer, then lying back
  const up = inM(t, M.pick, .8, 99) && t < M.hang.a + 2.6;
  const st = { t, talk: talk('kostas', t), lid: true, brow: inM(t, M.c4) ? 'frown' : 'flat', mouth: 'flat', blink: !up && t < M.pick.a + .8 };
  if (up) {
    const reach = ease(prog(t, M.pick.a + .8, M.pick.a + 1.6)), toEar = ease(prog(t, M.pick.a + 1.6, M.pick.b)), down = ease(prog(t, M.hang.a + .6, M.hang.a + 1.8));
    const R = inHand ? lerp2([48, -196], [130, -30], down) : lerp2([44, -24], [150, 0], reach);
    person(560, 590, 1, CAST.kostas, { ...st, legs: 'seat', look: t > M.hang.a ? [.8, .3] : [-.2, .2], R: toEar < 1 && inHand ? lerp2([150, 0], [48, -196], toEar) : R, itemR: inHand ? 'phone' : null, L: [-40, -30] });
  } else {
    personRot(600, 610, 1, CAST.kostas, { ...st, legs: 'stand', L: t > M.ignore.a && t < M.pick.a ? [-10, -210] : [-40, -30], R: [30, -60] }, -Math.PI / 2 + .04);
    if (t > M.ignore.a && t < M.pick.a) pillow(400, 600, .8);
  }
  ctx.restore();
  applyLight('dawn', .5);
  if (inM(t, M.c4)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .25 * bump(t, M.c4.a, M.c4.b); ctx.fillStyle = '#ff2020'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  if (!up && (t < M.pick.a || t > M.hang.b - 1.4)) sfxText('Z z z', 420, 330, 30, -.1, '#fff');
  vignette(.35);
}
function title(t) {
  const k = prog(t, M.title.a, M.title.b), p = back(clamp(k * 3)), a = 1 - prog(k, .88, 1);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  tvShop(t, { red: 1, banner: '', number: '' });
  ctx.fillStyle = 'rgba(10,4,8,.55)'; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = a; ctx.translate(640, 330); ctx.scale(p, p); ctx.rotate(-.05);
  txt('Η ΕΞΥΠΝΗ ΣΙΤΑ · ΕΠΕΙΣΟΔΙΟ 2', 0, -150, 34, '#ffd23f', { font: TVFONT, style: 'italic', weight: 900 });
  txt('ΤΗΛΕΦΩΝΗΣΤΕ', 0, -40, 120, '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 14, sc: '#fff' });
  txt('ΤΩΡΑ!', 0, 90, 130, '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 14, sc: '#fff' });
  ctx.restore();
}
return {
  id: 'scene02', title: '2 · Αναπάντητη', steps, render,
  events: M => [[M.sleep.a + .5, SFX.snore], [M.ring1.a + .1, SFX.phone], [M.ring1.a + 1.1, SFX.phone], [M.ignore.a + .2, SFX.phone], [M.ignore.a + 1.2, SFX.phone],
    [M.ring2.a + .1, SFX.phone], [M.ring3.a + .1, SFX.phone], [M.ring4.a + .1, SFX.phone], [M.pick.a + .2, SFX.phone], [M.pick.a + 1.6, SFX.pop],
    [M.c4.a, SFX.swell], [M.hang.a + .6, SFX.clack], [M.hang.a + 1.8, SFX.thud], [M.hang.a + 3, SFX.snore], [M.title.a, SFX.jingleMinor], [M.title.a + 1.4, SFX.boom]],
  ambience: () => ({ hum: .01 }),
};
})());
