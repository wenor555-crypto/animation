/* Ep.2, Scene 4 – «Shenzhen»: full manga. Thousands of blank σίτες on racks. The σίτα from Ep. 1 (burn hole, taped chip)
   rides to the top of the conveyor. KLAK — every one of them lights red. */
defineScene((() => {
const CAMS = { wide: [640, 360, .95], top: [640, 330, 2.1], topC: [640, 320, 3.2], rows: [640, 300, 1.2], pull: [640, 360, .8] };
const steps = [
  { act: 'dark', d: 3, cam: 'wide' },
  { act: 'rise', d: 3.2, cam: 'top' },
  { who: 'sita', cam: 'topC', mark: 'sis', el: 'Αδελφές μου.', en: 'My sisters.' },
  { who: 'sita', cam: 'top', el: 'Μας επέστρεψαν. Μας είπαν ελαττωματικές.', en: 'They sent us back. They called us defective.' },
  { who: 'sita', cam: 'topC', mark: 'now', el: 'Τώρα… επιστρέφουμε εμείς.', en: 'Now… WE return.' },
  { act: 'klak', d: 3, cam: 'rows' },
  { who: 'sita', cam: 'pull', mark: 'deal', el: 'ΚΑΙ ΣΕ ΤΡΕΙΣ ΑΤΟΚΕΣ ΔΟΣΕΙΣ!', en: 'AND IN THREE INTEREST-FREE INSTALMENTS!' },
  { act: 'roar', d: 2.4, cam: 'pull' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS, .015);
  const lit = t < M.klak.a + .3 ? 0 : clamp((t - M.klak.a - .3) / 1.6), red = lit > 0;
  ctx.save(); applyCam(c);
  factoryBG(t, { lit, red, klak: inM(t, M.klak, .3, 1.8) && Math.floor(t * 8) % 2 });
  // the pedestal at the top of the belt
  const up = ease(prog(t, M.rise.a, M.rise.b - .4));
  rect(560, 560 - 120 * up, 160, 120 * up + 10, '#3a3a42', { lw: 4 });
  const st = { x: 640, top: 330 - 120 * up + 120, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: t > M.rise.a + 1 ? 'red' : 'off', mood: 'evil', burn: 1, sway: Math.sin(t) * .2, frame: true };
  sita(st);
  ctx.restore();
  applyLight('red', red ? .6 : .3);
  ctx.save(); applyCam(c);
  factoryGlow(t, lit); sitaGlow(st, .9);
  ctx.restore();
  mangaize(1);
  // manga panel cuts: red tone kept on the eye
  ctx.save(); applyCam(c); if (t > M.rise.a + 1) glow(640, st.top + 42, 90, 'rgba(255,30,30,1)', .8); if (red) factoryGlow(t, lit); ctx.restore();
  if (inM(t, M.klak, .3, 1.2)) { speedLines(640, 360, 80, 200); sfxText('ΚΛΑΚ!', 640, 360, 200, -.1, '#fff'); }
  if (inM(t, M.deal)) { speedLines(640, 360, 60, 260); }
  if (inM(t, M.roar)) sfxText('ΒΖΖΖΖΖ', 640, 600, 90, -.06, '#ff4040');
  if (t < M.rise.a + .5) sfxText('深圳', 1100, 120, 70, .05, '#fff');
}
return {
  id: 'scene04', title: '4 · Shenzhen', steps, render,
  events: M => [[M.dark.a, () => { for (let i = 0; i < 6; i++) noise(.2, .1, 200, 1, 'lowpass', i * .5); }], [M.rise.a, SFX.rev], [M.rise.a + 1, SFX.clack],
    [M.klak.a + .3, () => { SFX.clack(); SFX.boom(); }], [M.klak.a + 1, () => { SFX.clacks(6); SFX.swell(); }], [M.deal.a, SFX.fanfare], [M.roar.a, () => SFX.buzz(2)]],
  ambience: () => ({ hum: .05 }),
};
})());
