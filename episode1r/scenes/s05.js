/* Ep.1, Scene 5 – «Η παντόφλα» (script beat 5): Μυρσίνη's watermelon, Βαγγελιώ's slipper. */
defineScene((() => {
const X = { giannos: 460, mimis: 640, giorgos: 820, myrsini: 900 };
const CAMS = {
  wide: [640, 360, 1], three: [640, 430, 1.35], giannos: [460, 370, 2.1], mimis: [640, 370, 2.1], giorgos: [820, 370, 2.1],
  myr: [860, 380, 1.7], door: [1000, 470, 1.5], gface: [820, 350, 3.2], long: [900, 440, 1.15], sita: [1060, 560, 2.6],
  kitchen: [1060, 470, 2.4],
};
/* Βαγγελιώ, never seen in the light: a silhouette in the dark doorway, behind the σίτα */
function vangelioShadow(t) {
  if (!(inM(t, M.L[3], -.2, 0) || inM(t, M.L[4]) || inM(t, M.shadow) || inM(t, M.slipper, 0, -2.2))) return;
  const raise = inM(t, M.shadow) ? ease(ph(t, M.shadow, .2, 0)) : inM(t, M.slipper) ? 1 - ease(prog(t, M.slipper.a + .1, M.slipper.a + .4)) : 0;
  const thrown = t > M.slipper.a + .3;
  ctx.save(); ctx.beginPath(); ctx.rect(1000, 330, 120, GROUND - 330); ctx.clip();
  ctx.filter = 'brightness(0.12) saturate(0)';
  stand(1062, 'vangelio', 1, { t, look: [-1, .1], L: [-44, -24], R: thrown ? [-100, -150] : [lerp(44, 70, raise), lerp(-24, -250, raise)], itemR: thrown ? null : raise > .2 ? 'slipper' : null });
  ctx.filter = 'none'; ctx.restore();
}
const steps = [
  { act: 'enter', d: 3.2, cam: 'door' },
  { who: 'myrsini', cam: 'myr', el: 'Παιδιά, καρπουζάκι. Κρύο.', en: 'Guys, watermelon. Cold.' },
  { who: 'giorgos', cam: 'giorgos', el: 'Μυρσίνη, είσαι θεά.', en: "Myrsini, you're a goddess." },
  { who: 'myrsini', cam: 'myr', mark: 'burn', el: 'Εσύ δεν υποτίθεται ότι είσαι σκοπιά τώρα;', en: "Aren't you supposed to be on guard duty right now?" },
  { act: 'leave', d: 2.8, cam: 'three' },
  { act: 'fly', d: 2.2, cam: 'gface' },
  { who: 'vangelio', cam: 'gface', label: ['ΒΑΓΓΕΛΙΩ (Ε.Κ.)', 'VANGELIO (O.S.)'], el: 'ΜΗΝ ΑΦΗΝΕΤΕ ΤΗΝ ΠΟΡΤΑ ΑΝΟΙΧΤΗ, ΘΑ ΓΕΜΙΣΟΥΜΕ ΜΥΓΕΣ!', en: "DON'T LEAVE THE DOOR OPEN, WE'LL BE FULL OF FLIES!", say: 'Μην αφήνετε την πόρτα ανοιχτή, θα γεμίσουμε μύγες!' },
  { who: 'giorgos', cam: 'gface', el: 'Κυρία Βαγγελιώ, έχει σίτα τώρα…', en: "Mrs Vangelio, there's a screen door now…" },
  { act: 'shadow', d: 1.3, cam: 'kitchen' },     // in the dark kitchen: her silhouette takes off a slipper (the finale's weapon, planted)
  { act: 'slipper', d: 2.6, cam: 'long' },
  { who: 'vangelio', cam: 'long', label: ['ΒΑΓΓΕΛΙΩ (Ε.Κ.)', 'VANGELIO (O.S.)'], el: 'Φέρε μου πίσω την παντόφλα.', en: 'Bring me back my slipper.', gap: .6 },
  { act: 'flinch', d: 2, cam: 'sita' },
  { who: 'mimis', cam: 'mimis', el: 'Αν τη βάλεις να κάνει και αυτό, κάνουμε εισαγωγή στο χρηματιστήριο.', en: "If you get it to do THAT, we're going public." },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, {});
  // σίτα: opens for Μυρσίνη both ways; the slipper passes through the seam; nervous click-clack at the end
  const through = Math.max(bump(t, M.enter.a + .2, M.enter.a + 1.4), bump(t, M.leave.a + 1.2, M.leave.a + 2.5));
  const nerv = inM(t, M.flinch, .3, -.4) ? Math.abs(Math.sin(t * 22)) * .25 : 0;
  // Μυρσίνη: out of the door → by the table → back in
  const mx = path(t, [[M.enter.a + .3, 1060], [M.enter.a + 2.6, 900], [M.leave.a + .2, 900], [M.leave.a + 2, 1060]]);
  const myrIn = t < M.enter.a + .8 || t > M.leave.a + 1.8;
  const myrSt = { t, talk: talk('myrsini', t), legs: mx[1] ? 'walk' : 'stand', look: mx[1] ? [mx[0] < 1000 ? -1 : 1, 0] : [-.6, .2], mouth: 'smile',
    L: t < M.L[0].b ? [-60, -130] : [-44, -24], R: t < M.L[0].b ? [60, -130] : gesture(t, talk('myrsini', t)), lid: inM(t, M.burn) };
  if (myrIn && t < M.leave.b) { stand(mx[0], 'myrsini', .95, myrSt); }
  vangelioShadow(t);
  sita({ t, pass: through, open: nerv, sway: Math.sin(t * 1.3) * .25 });
  const fallK = ease(prog(t, M.slipper.a + 1.2, M.slipper.a + 1.7));
  const gLook = t > M.leave.a && t < M.fly.a ? [.3, .9] : lookAtSpeaker(t, 'giorgos', X, [1, -.2]);
  const S = {
    giannos: { t, talk: talk('giannos', t), look: lookAtSpeaker(t, 'giannos', X, [1, 0]), itemR: 'cig', R: [48, -30] },
    mimis: { t, talk: talk('mimis', t), look: t > M.flinch.a ? [1, -.2] : lookAtSpeaker(t, 'mimis', X, [0, .2]), lid: true, mouth: 'smirk', itemR: 'cup', itemL: 'cig', R: [44, -20] },
    giorgos: { t, talk: talk('giorgos', t), look: t > M.fly.a && t < M.slipper.a ? [0, -1] : gLook, mouth: inM(t, M.burn) ? 'frown' : 'smirk',
      R: t > M.leave.a && t < M.fly.a ? [20, -110] : [44, -22], itemR: t > M.leave.a && t < M.fly.a ? 'phone' : null, brow: t > M.fly.a ? 'up' : 'flat' },
  };
  tableScene(t, fallK > 0 ? { ...S, giorgos: null } : S, { watermelon: t > M.enter.a + 2.8, fallen: fallK > 0 ? { giorgos: fallK } : null });
  if (fallK > 0) {           // Γιώργος goes over backwards with his chair
    ctx.save(); ctx.translate(820, GROUND); ctx.rotate(fallK * 1.3); ctx.translate(-820, -GROUND);
    person(820, SEAT, 1, CAST.giorgos, { ...S.giorgos, part: 'all', legs: 'seat', look: [0, -1], mouth: 'open', brow: 'worry' });
    blob(820, SEAT - 232, 9, 6, '#e0303a', { lw: 0 });
    ctx.restore();
  }
  if (!myrIn && t > M.enter.a + .8) stand(mx[0], 'myrsini', .95, myrSt);
  // the tray
  if (t > M.enter.a + .4 && t < M.enter.a + 2.8) { const tx = mx[0]; rect(tx - 50, standY(.95) - 130, 100, 12, '#c9ced4', { lw: 3 }); poly([[tx - 30, standY(.95) - 132], [tx + 30, standY(.95) - 132], [tx, standY(.95) - 162]], '#e8404a', { lw: 3 }); }
  // the fly: lands on Γιώργος's forehead
  if (t > M.fly.a && t < M.slipper.a + 1.25) {
    const k = ease(prog(t, M.fly.a, M.fly.a + 1.4)), fx = lerp(1000, 820, k) + Math.sin(t * 20) * 8 * (1 - k), fy = lerp(300, SEAT - 232, k) + Math.cos(t * 17) * 8 * (1 - k);
    blob(fx, fy, 4, 3, INK, { lw: 0 }); blob(fx - 2, fy - 4, 4, 2, 'rgba(220,230,240,.8)', { lw: 1, rot: -.4 });
  }
  // the slipper: from the dark kitchen, through the seam, five metres of yard, into the fly
  const sk = prog(t, M.slipper.a + .3, M.slipper.a + 1.2);
  if (sk > 0 && sk < 1) slipper(lerp(1060, 830, sk), lerp(560, SEAT - 232, sk) - Math.sin(sk * Math.PI) * 50, sk * 20, 1.1);
  if (t > M.slipper.a + 1.2 && fallK < 1) slipper(820, SEAT - 232, 0, 1.1);
  if (fallK >= 1) slipper(700, GROUND - 8, .3, 1);
  for (let i = 0; i < 6; i++) mosquito(640 + Math.sin(t * (1.1 + i * .13) + i) * 380, 330 + Math.cos(t * (1.7 + i * .1) + i * 2) * 110, .9, t);
  fxBurst(t, M.slipper.a + 1.2, 820, SEAT - 232, { kind: 'dust', n: 6, speed: 160, grav: 0, life: .7 });
  fxRing(t, M.slipper.a + 1.2, 820, SEAT - 232, 120, .3);
  ctx.restore();
  const [, sh] = shotAt(sc, t);
  dayGrade(t);
  if (sh === 'three' || sh === 'long' || sh === 'door') fxForeground(t, 'left', { blur: 9 });
  if (sh === 'kitchen') { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createRadialGradient(640, 360, 120, 640, 360, 700); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  fxImpact(t, M.slipper.a + 1.2, 640, 300, .06);
  if (t > M.slipper.a + 1.18 && t < M.slipper.a + 1.7) sfxText('ΠΑΦ!', 640, 200, 110, -.12, '#ffd23f');
  if (inM(t, M.flinch, .3, -.4)) sfxText('κλικ-κλακ', 900, 170, 38, .08, '#fff');
}
return {
  id: 'scene05', title: '5 · Η παντόφλα', steps, render,
  events: M => [[M.enter.a + .3, SFX.clack], [M.enter.a + 1.4, SFX.clack], [M.leave.a + 1.3, SFX.clack], [M.leave.a + 2.4, SFX.clack], [M.fly.a, SFX.flies], [M.shadow.a + .3, () => tone(110, 1.1, 'sawtooth', .04, .7)],
    [M.slipper.a + .3, SFX.whoosh], [M.slipper.a + 1.2, () => { SFX.slap(); SFX.thud(); }], [M.slipper.a + 1.6, SFX.crash], [M.flinch.a + .3, () => SFX.clacks(4)]],
  ambience: () => ({ cicada: .03, mosq: .004 }),
};
})());
