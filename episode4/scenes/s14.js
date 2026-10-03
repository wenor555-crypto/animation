/* Ep.4, Scene 14 – «Ρήτρα αναπροσαρμογής»: Κώστας's kitchen, night. Sober, he is making a drink. The lights flicker, the
   lemons are gone, the ice is melting (the freezer is off), the fridge has a padlock. «…Ρήτρα αναπροσαρμογής.» He turns:
   a silhouette with a red eye in the doorway, stooping to fit. «Είσαι από τη ΔΕΗ;» «Εξολόθρευση.» «Πλήρωσα.» He calls
   Γιάννος, unhurried: «Έχω ένα ψυγείο στην κουζίνα. …Το δικό μου περπατάει.» */
defineScene((() => {
const PH = ['ΓΙΑΝΝΟΣ (τηλέφωνο)', 'GIANNOS (phone)'];
const DX = 180;   // the kitchen doorway
const CAMS = { wide: [640, 400, 1.05], kos: [640, 360, 2.1], fridge: [1080, 420, 2], door: [DX + 40, 380, 1.6], two: [440, 400, 1.3], ice: [560, 450, 2.6] };
const steps = [
  { act: 'mix', d: 2.4, cam: 'wide' },
  { act: 'ice', d: 1.4, cam: 'ice' },
  { who: 'kostas', cam: 'kos', el: 'Πάλι κόπηκε το ρεύμα.', en: 'Power cut again.' },
  { who: 'kostas', cam: 'kos', mark: 'clause', el: '…Ρήτρα αναπροσαρμογής.', en: '…Price-adjustment clause.', gap: .7 },
  { act: 'lock', d: 1.4, cam: 'fridge' },
  { who: 'kostas', cam: 'kos', el: 'Ποιος βάζει λουκέτο σε ψυγείο;', en: 'Who puts a padlock on a fridge?' },
  { act: 'turn', d: 1.6, cam: 'door' },
  { who: 'kostas', cam: 'kos', el: '…Είσαι από τη ΔΕΗ;', en: '…Are you from the power company?' },
  { who: 'sita', label: T8, cam: 'door', mark: 'ext', el: 'Εξολόθρευση.', en: 'Extermination.', fx: 'phone' },
  { who: 'kostas', cam: 'kos', mark: 'paid', el: 'Πλήρωσα.', en: 'I paid.' },
  { act: 'dial', d: 1.4, cam: 'two' },
  { who: 'kostas', cam: 'kos', el: 'Γιάννο. Έχω ένα ψυγείο στην κουζίνα.', en: "Giannos. There's a fridge in my kitchen." },
  { who: 'giannos', label: PH, fx: 'phone', cam: 'kos', el: 'Όλοι έχουν.', en: 'Everyone has one.' },
  { who: 'kostas', cam: 'two', mark: 'walks', el: 'Το δικό μου περπατάει.', en: 'Mine walks.' },
  { act: 'end', d: 1.2, cam: 'two' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  const flick = (Math.sin(t * 23) * Math.sin(t * 7.3) > .55) && t < M.turn.a;
  ctx.save(); applyCam(c);
  kostasBar(t, {});
  doorway(DX, 690, 170, 330, '#0b0d18', 1);
  // the T-800 in the doorway: too tall, stooping, half in the dark
  if (t > M.turn.a - .4) {
    ctx.save(); ctx.beginPath(); ctx.rect(DX - 85, 360, 170, 330); ctx.clip();
    const base = { x: DX, y: 0, s: .62, pitch: .1, yaw: .3, t, pose: R3.blend(T800.P.idle, T800.P.crouch, .25) };
    R3.draw(T800, { ...base, y: 690 - R3.lowestY(T800, base) + 4 });
    ctx.fillStyle = 'rgba(5,6,14,.55)'; ctx.fillRect(DX - 85, 360, 170, 330); ctx.restore();
  }
  // the fridge with its new padlock
  fridge(1080, 600, 1); rect(1132, 380, 26, 22, '#c8a040', { lw: 2.5 }); curve([[1136, 380], [1136, 368], [1154, 368], [1154, 380]], 3, '#8a8f98', { w: 0 });
  const onPhone = t > M.dial.a + .5;
  stand(640, 'kostas', 1, { t, talk: talk('kostas', t), dir: t > M.turn.a ? -1 : 1, look: t > M.turn.a ? [-.9, -.2] : inM(t, M.lock, -1, 2) ? [.7, 0] : [.1, .6], brow: 'flat', mouth: 'flat',
    R: onPhone ? [48, -196] : [56, -70], itemR: onPhone ? 'phone' : 'shaker', L: [-40, -50] });
  barCounter(t, {});
  rect(520, 430, 80, 40, 'rgba(200,230,255,.5)', { lw: 2.5 }); rect(526, 448 + 10 * prog(t, M.mix.a, M.ext.a), 68, 20 - 10 * prog(t, M.mix.a, M.ext.a), 'rgba(140,190,240,.7)', { lw: 0 });   // the ice bowl: water
  rect(440, 450, 60, 20, '#d8c8a8', { lw: 2 });   // an empty lemon plate
  ctx.restore();
  applyLight('night', flick ? .85 : .4);
  if (t > M.turn.a + .4) { ctx.save(); applyCam(c); redGlow(DX + 10, 410, 30 * (1 + .2 * Math.sin(t * 9))); ctx.restore(); }
  vignette(.45);
}
return {
  id: 'scene14', title: '14 · Ρήτρα αναπροσαρμογής', steps, render,
  events: M => [[M.mix.a + .3, SFX.clacks], [M.mix.a + 1.6, SFX.buzz], [M.lock.a + .3, SFX.clack], [M.turn.a + .4, () => SND2.sfx('servo', .7)], [M.turn.a + .9, () => SND2.sfx('stomp', .5)],
    [M.dial.a + .2, () => { for (let i = 0; i < 6; i++) tone(1300 + (i % 3) * 200, .05, 'sine', .02, 1, i * .12); }]],
  ambience: () => ({ hum: .025 }),
};
})());
