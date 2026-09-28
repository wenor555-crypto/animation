/* Ep.2, Scene 5 – «Τήνος»: the σίτα makes one call from the factory (we only hear her side) — Βαγγελιώ has won a free
   pilgrimage to Tinos, bus leaves in ten minutes, slippers included. Then Μίμης's kitchen: a note on the fridge,
   and two empty outlines by the door where the slippers used to be. */
defineScene((() => {
const PH = ['ΣΙΤΑ (τηλέφωνο)', 'SITA (phone)'];
const X = { myrsini: 470, mimis: 700, maria: 900 };
const CAMS = { fac: [640, 330, 2.2], facW: [640, 360, 1.3], bus: [640, 380, 1], kit: [640, 420, 1.1], note: [520, 480, 2.6], my: [520, 380, 2], mim: [720, 380, 2], door: [1120, 620, 2.6], three: [680, 420, 1.35], mar: [880, 380, 2] };
const steps = [
  { act: 'dial', d: 2, cam: 'facW' },
  { who: 'sita', label: PH, cam: 'fac', mark: 'win', el: 'Κυρία Βαγγελιώ; Συγχαρητήρια!', en: 'Mrs Vangelio? Congratulations!' },
  { who: 'sita', label: PH, cam: 'fac', mark: 'tinos', el: 'Κερδίσατε ΔΩΡΕΑΝ προσκύνημα στην Τήνο! Με πούλμαν! Αναχώρηση… σε δέκα λεπτά.', en: 'You have won a FREE pilgrimage to Tinos! By coach! Departure… in ten minutes.' },
  { who: 'sita', label: PH, cam: 'fac', mark: 'slip', el: '…Ναι. Και τις παντόφλες σας μαζί. Όλες.', en: '…Yes. And your slippers too. All of them.', gap: .7 },
  { act: 'bus', d: 3.4, cam: 'bus' },
  { act: 'kitchen', d: 2.2, cam: 'kit' },
  { who: 'myrsini', cam: 'note', mark: 'read', el: '«Πήγα Τήνο. Κέρδισα. Το φαγητό στο ψυγείο. ΜΗΝ ΑΦΗΝΕΤΕ ΤΗΝ ΠΟΡΤΑ ΑΝΟΙΧΤΗ.»', en: '"Gone to Tinos. I won. Food\'s in the fridge. DON\'T LEAVE THE DOOR OPEN."' },
  { act: 'look', d: 1.6, cam: 'door' },
  { who: 'mimis', cam: 'door', el: 'Πήρε και τις δύο παντόφλες.', en: 'She took both slippers.' },
  { who: 'myrsini', cam: 'my', el: 'Η μάνα μας κέρδισε κάτι. Σε κλήρωση. Από το τηλέφωνο.', en: 'Our mother won something. In a draw. Over the phone.' },
  { who: 'mimis', cam: 'mim', el: 'Αυτό δεν έχει ξανασυμβεί ποτέ στην ιστορία της οικογένειας.', en: 'That has never happened in the history of this family.' },
  { who: 'maria', cam: 'mar', el: 'Ούτε εσύ έχεις νοικοκυρευτεί ποτέ. Κι όμως, ελπίζουμε.', en: "You've never settled down either. And yet, we hope." },
  { act: 'end', d: 1.6, cam: 'three' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  const [, shot] = shotAt(sc, t);
  ctx.save(); applyCam(c);
  if (t < M.bus.a) {
    factoryBG(t, { lit: 1, red: true });
    const st = { x: 640, top: 250, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: 'happy', burn: 1, frame: true };
    sita(st);
    // a headset taped to the frame
    curve([[586, 270], [560, 300], [566, 330]], 4, '#2a2a30'); blob(566, 336, 10, 8, '#2a2a30', { lw: 2 });
    ctx.restore(); applyLight('red', .45); ctx.save(); applyCam(c); sitaGlow(st, .8); factoryGlow(t, 1); ctx.restore();
    if (inM(t, M.win)) sfxText('ΣΥΓΧΑΡΗΤΗΡΙΑ!', 640, 120, 50, -.08, '#ffd23f');
    vignette(.4); return;
  }
  if (shot === 'bus') {
    // a coach «ΠΡΟΣΚΥΝΗΜΑ ΤΗΝΟΣ» pulls away from the house; a hand waves a slipper out of the window
    yard(t, { noChickens: false });
    const bx = lerp(700, 1900, ease(prog(t, M.bus.a + 1, M.bus.b)));
    ctx.save(); ctx.translate(bx, GROUND + 20);
    rect(-360, -250, 720, 230, '#f4f3ee', { lw: 5, w: .5 }); rect(-360, -120, 720, 30, '#3f74a6', { lw: 0 });
    for (let i = 0; i < 6; i++) rect(-330 + i * 110, -220, 90, 70, '#9cc5d6', { lw: 3 });
    txt('ΠΡΟΣΚΥΝΗΜΑ ΤΗΝΟΣ ✚ ΔΩΡΕΑΝ', 0, -70, 30, '#3f74a6', { font: TVFONT, weight: 900 });
    for (const wx of [-230, 230]) blob(wx, -20, 38, 38, '#2b2a2e', { lw: 4 });
    blob(-240, -190, 20, 20, CAST.vangelio.skin, { lw: 3 }); poly([[-262, -196], [-258, -214], [-240, -220], [-222, -214], [-218, -196]], CAST.vangelio.scarfCol, { lw: 3 });
    slipper(-300, -260 + Math.sin(t * 10) * 10, -1 + Math.sin(t * 10) * .4, 1);
    ctx.restore();
    ctx.restore(); vignette(.3); return;
  }
  // the kitchen
  room({ wall: '#f1e6cc', floor: '#c8b89a', floorY: 600, tiles: true });
  rect(700, 160, 300, 150, '#d6c4a0', { lw: 4 }); for (let i = 0; i < 3; i++) rect(710 + i * 98, 170, 88, 130, '#e2d2b0', { lw: 2.5 });   // cupboards
  rect(-100, 460, 640, 140, '#d6c4a0', { lw: 4 }); rect(-100, 450, 640, 16, '#8a8a8a', { lw: 3 });
  fridge(560, 690, prog(t, M.read.a, M.read.b));
  // the front door, and by it the two dust outlines where the slippers stood
  rect(1060, 300, 150, 300, '#3f74a6', { lw: 4 }); rect(1072, 312, 126, 288, '#8a6a4a', { lw: 3 });
  for (const dx of [-26, 26]) blob(1110 + dx, 648, 30, 11, 'rgba(0,0,0,0)', { lw: 2.5, sc: '#8a7a60' });
  rect(1180, 640, 60, 20, '#9a8a6a', { lw: 0 }); txt('WELCOME', 1210, 650, 8, '#fff', { font: TVFONT, weight: 900 });
  const look = who => t > M.look.a && t < M.look.b + 1.6 ? [1, .4] : lookAtSpeaker(t, who, X, [0, .1]);
  stand(X.myrsini, 'myrsini', .95, { t, talk: talk('myrsini', t), look: inM(t, M.read) ? [.6, .2] : look('myrsini'), brow: 'up', mouth: 'flat', R: inM(t, M.read) ? [70, -100] : [44, -24] });
  stand(X.mimis, 'mimis', 1, { t, talk: talk('mimis', t), look: look('mimis'), lid: true, mouth: 'flat' });
  stand(X.maria, 'maria', .95, { t, talk: talk('maria', t), look: look('maria'), brow: 'flat', mouth: 'smirk', L: [-58, -40], R: [58, -40], legs: 'stand', dir: -1 });
  ctx.restore();
  vignette(.3);
}
return {
  id: 'scene05', title: '5 · Τήνος', steps, render,
  events: M => [[M.dial.a + .2, () => { for (let i = 0; i < 8; i++) tone(700 + (i % 3) * 200, .06, 'sine', .04, 1, i * .14); }], [M.win.a, SFX.jingle], [M.tinos.a + 1, SFX.choir],
    [M.bus.a + .5, SFX.honk], [M.bus.a + 1, SFX.engine], [M.kitchen.a + .3, SFX.door]],
  ambience: (t, M) => ({ hum: t < M.bus.a ? .04 : 0, cicada: t > M.bus.a ? .012 : 0 }),
};
})());
