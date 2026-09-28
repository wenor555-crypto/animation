/* Ep.3, Scene 22 – «Επιστροφή από την Τήνο»: noon. The coach stops outside the house; Βαγγελιώ gets off with a bag:
   three pairs of new, blessed slippers. Γιάννος: «μπορώ να δανειστώ μια παντόφλα;» — «ΓΙΑ ΤΙ ΤΗ ΘΕΣ;» — «…Για την εθνική άμυνα.» */
defineScene((() => {
const X = { vangelio: 560, giannos: 820 };
const CAMS = { wide: [640, 400, 1], bag: [560, 430, 1.9], van: [560, 380, 2.1], gia: [820, 380, 2.1], two: [690, 400, 1.55] };
const steps = [
  { act: 'bus', d: 3.4, cam: 'wide' },
  { act: 'off', d: 1.6, cam: 'wide' },
  { who: 'vangelio', cam: 'bag', mark: 'blessed', el: 'Αγιασμένες. Από την Τήνο. Τρία ζευγάρια.', en: 'Blessed. From Tinos. Three pairs.' },
  { who: 'giannos', cam: 'gia', el: 'Κυρία Βαγγελιώ… μπορώ να δανειστώ μια παντόφλα;', en: 'Mrs Vangelio… may I borrow a slipper?' },
  { who: 'vangelio', cam: 'van', mark: 'why', el: 'ΓΙΑ ΤΙ ΤΗ ΘΕΣ;', en: 'WHAT DO YOU WANT IT FOR?' },
  { who: 'giannos', cam: 'gia', mark: 'defence', el: '…Για την εθνική άμυνα.', en: '…For national defence.', gap: .8 },
  { who: 'vangelio', cam: 'two', mark: 'one', el: 'Μία. Και θα μου τη φέρεις πίσω.', en: "One. And you'll bring it back." },
  { act: 'give', d: 2.2, cam: 'two' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, { light: 'day' });
  // the coach «ΠΡΟΣΚΥΝΗΜΑ ΤΗΝΟΣ» arriving and pulling away
  const bx = t < M.give.a ? lerp(1900, 1000, ease(prog(t, M.bus.a, M.bus.b))) : lerp(1000, 2000, ease(prog(t, M.give.a, M.give.b)));
  if (bx < 1900) { ctx.save(); ctx.translate(bx, GROUND + 20);
    rect(-360, -250, 720, 230, '#f4f3ee', { lw: 5, w: .5 }); rect(-360, -120, 720, 30, '#3f74a6', { lw: 0 });
    for (let i = 0; i < 6; i++) rect(-330 + i * 110, -220, 90, 70, '#9cc5d6', { lw: 3 });
    txt('ΠΡΟΣΚΥΝΗΜΑ ΤΗΝΟΣ ✚', 0, -70, 30, '#3f74a6', { font: TVFONT, weight: 900 });
    for (const wx of [-230, 230]) blob(wx, -20, 38, 38, '#2b2a2e', { lw: 4 });
    ctx.restore(); }
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  if (t > M.off.a) {
    const [vx, vw] = path(t, [[M.off.a, 900], [M.off.b, X.vangelio]]);
    const giving = t > M.one.a + .6;
    stand(vx, 'vangelio', 1, { t, talk: talk('vangelio', t), legs: vw ? 'walk' : 'stand', look: la('vangelio', [1, 0]), brow: inM(t, M.why) ? 'frown' : 'flat', mouth: inM(t, M.why) ? 'open' : 'flat',
      L: [-50, -30], itemL: 'bag', R: giving ? [120, -100] : inM(t, M.blessed) ? [70, -150] : [44, -24], itemR: giving || inM(t, M.blessed) ? 'slipper' : null });
    if (inM(t, M.blessed)) for (let i = 0; i < 3; i++) { const p = (t * 1.5 + i / 3) % 1; sfxText('✦', vx + 60 + i * 20, standY() - 170 - p * 60, 18, 0, `rgba(255,220,120,${1 - p})`); }
  }
  const gotIt = t > M.give.a + .6;
  stand(X.giannos, 'giannos', 1, { t, talk: talk('giannos', t), look: la('giannos', [-1, 0]), brow: inM(t, M.why) ? 'worry' : 'flat', mouth: 'flat', dir: -1,
    R: gotIt ? [60, -140] : inM(t, M.L[1]) ? [-80, -120] : [44, -24], itemR: gotIt ? 'slipper' : null });
  ctx.restore();
  if (inM(t, M.why, 0, .2)) { speedLines(560, 300, 60, 200); }
  vignette(.3);
}
return {
  id: 'scene22', title: '22 · Επιστροφή από την Τήνο', steps, render,
  events: M => [[M.bus.a + .3, SFX.engine], [M.bus.b - .4, SFX.hiss], [M.off.a + .2, SFX.door], [M.blessed.a + .3, SFX.choir], [M.why.a, SFX.slam], [M.give.a + .6, SFX.pop], [M.give.a + .9, SFX.engine]],
  ambience: () => ({ cicada: .03 }),
};
})());
