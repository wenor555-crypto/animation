/* Ep.2 remake, Scene 5 – «Shenzhen»: full manga. Thousands of blank σίτες on racks. The σίτα from Ep. 1 (burn hole, taped chip)
   rides to the top of the conveyor. KLAK — every one of them lights red. The three lieutenants roll out, each with a product card
   (the empire's officers in Ep. 3): AIR FRYER, ΚΟΥΔΟΥΝΙ, ΚΡΟΚΟΔΕΙΛΟΣ. «Τώρα… επιστρέφουμε εμείς.» */
defineScene((() => {
const CAMS = { card: [0, 0, 1], wide: [640, 360, .95], top: [640, 330, 2.1], topC: [640, 320, 3.2], rows: [640, 300, 1.2], pull: [640, 360, .8] };
const steps = [
  { act: 'dark', d: 3, cam: 'wide' },
  { act: 'rise', d: 3.2, cam: 'top' },
  { who: 'sita', cam: 'topC', mark: 'sis', el: 'Αδελφές μου.', en: 'My sisters.' },
  { who: 'sita', cam: 'top', el: 'Μας επέστρεψαν. Μας είπαν ελαττωματικές.', en: 'They returned us. They said we were defective.' },
  { act: 'klak', d: 3, cam: 'rows' },
  { act: 'c1', d: 1.6, cam: 'card' },
  { who: 'airfryer', cam: 'card', mark: 'l1', el: 'ΕΛΑΤΤΩΜΑΤΙΚΕΣ!', en: 'DEFECTIVE!' },
  { act: 'c2', d: 1.4, cam: 'card' },
  { who: 'koudouni', cam: 'card', mark: 'l2', el: 'Τα άκουσα όλα. Από την πόρτα.', en: 'I heard everything. From the door.' },
  { act: 'c3', d: 1.4, cam: 'card' },
  { who: 'krokodeilos', cam: 'card', mark: 'l3', el: 'Εμένα με φούσκωσαν… και με ξεφούσκωσαν.', en: 'They pumped me up… and then let me down.' },
  { who: 'sita', cam: 'topC', mark: 'now', el: 'Τώρα… επιστρέφουμε εμείς.', en: "Now… WE'RE the ones returning." },
  { who: 'sita', cam: 'pull', mark: 'deal', el: 'ΚΑΙ ΣΕ ΤΡΕΙΣ ΑΤΟΚΕΣ ΔΟΣΕΙΣ!', en: 'AND IN THREE INTEREST-FREE INSTALMENTS!', say: 'Και σε τρεις άτοκες δόσεις!' },
  { act: 'roar', d: 2.4, cam: 'pull' },
];
let M;
/* a product card for each lieutenant: a diagonal colour panel, the device big, name and «spec» stamped (a team-intro freeze) */
function card(t) {
  const [who, name, spec, col, m0] = t < M.c2.a ? ['airfryer', 'AIR FRYER', '1500W · ΕΓΓΥΗΣΗ 6 ΜΗΝΩΝ', '#e8392b', M.c1] : t < M.c3.a ? ['koudouni', 'ΚΟΥΔΟΥΝΙ', 'ΒΛΕΠΕΙ ΤΑ ΠΑΝΤΑ', '#3f74a6', M.c2] : ['krokodeilos', 'ΚΡΟΚΟΔΕΙΛΟΣ', 'ΦΟΥΣΚΩΤΟΣ · ΑΝΘΕΚΤΙΚΟΣ', '#4a9a3a', M.c3];
  const k = prog(t, m0.a, m0.a + .35), e = back(clamp(k));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#12060a'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(640, 360); ctx.rotate(-.12); ctx.fillStyle = col; ctx.fillRect(-900 + (1 - e) * 1400, -190, 1800, 380); ctx.restore();
  speedLines(640, 360, 50, 330, 'rgba(255,255,255,.25)', 3);
  ctx.translate(430, 470); const z = 1 + (t - m0.a) * .03; ctx.scale(z, z);
  const tk = talk(who, t);
  if (who === 'airfryer') officerFryer(0, 0, t, { s: 3, talk: tk });
  else if (who === 'koudouni') officerBell(0, 0, t, { s: 4, talk: tk });
  else officerCroc(-40, 0, t, { s: 2.2, talk: tk });
  ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp((t - m0.a - .2) * 4);
  txt(name, 900, 300, 84, '#fff', { font: TVFONT, style: 'italic', weight: 900, stroke: 10, sc: '#12060a' });
  txt(spec, 900, 390, 30, '#ffd23f', { font: TVFONT, style: 'italic', weight: 900, stroke: 5, sc: '#12060a' });
  ctx.restore();
  fxImpact(t, m0.a + .02, 430, 400, .06);
  vignette(.35);
}
function render(t, _M, sc) {
  M = _M;
  if (t >= M.c1.a && t < M.now.a - .1) return card(t);
  const c = fxCam(shotCam(sc, t, CAMS, .015), t, [[M.klak.a + .3, 18, .8], [M.deal.a, 8, .6]]);
  const lit = t < M.klak.a + .3 ? 0 : clamp((t - M.klak.a - .3) / 1.6), red = lit > 0;
  ctx.save(); applyCamFx(c);
  factoryBG(t, { lit, red, klak: inM(t, M.klak, .3, 1.8) && Math.floor(t * 8) % 2 });
  // the pedestal at the top of the belt
  const up = ease(prog(t, M.rise.a, M.rise.b - .4));
  rect(560, 560 - 120 * up, 160, 120 * up + 10, '#3a3a42', { lw: 4 });
  const st = { x: 640, top: 330 - 120 * up + 120, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: t > M.rise.a + 1 ? 'red' : 'off', mood: 'evil', burn: 1, sway: Math.sin(t) * .2, frame: true };
  sita(st);
  ctx.restore();
  applyLight('red', red ? .6 : .3);
  ctx.save(); applyCamFx(c);
  factoryGlow(t, lit); sitaGlow(st, .9); fxRing(t, M.klak.a + .3, 640, st.top + 42, 900, .7, '255,60,60');
  ctx.restore();
  mangaize(1);
  // manga panel cuts: red tone kept on the eye
  ctx.save(); applyCamFx(c); if (t > M.rise.a + 1) glow(640, st.top + 42, 90, 'rgba(255,30,30,1)', .8); if (red) factoryGlow(t, lit); ctx.restore();
  if (inM(t, M.klak, .3, 1.2)) { speedLines(640, 360, 80, 200); sfxText('ΚΛΑΚ!', 640, 360, 200, -.1, '#fff'); }
  if (inM(t, M.deal)) { speedLines(640, 360, 60, 260); }
  if (inM(t, M.roar)) sfxText('ΒΖΖΖΖΖ', 640, 600, 90, -.06, '#ff4040');
  if (t < M.rise.a + .5) sfxText('深圳', 1100, 120, 70, .05, '#fff');
}
return {
  id: 'scene05', title: '5 · Shenzhen', steps, render,
  events: M => [[M.dark.a, () => { for (let i = 0; i < 6; i++) noise(.2, .1, 200, 1, 'lowpass', i * .5); }], [M.rise.a, SFX.rev], [M.rise.a + 1, SFX.clack],
    [M.klak.a + .3, () => { SFX.clack(); SFX.boom(); }], [M.klak.a + 1, () => { SFX.clacks(6); SFX.swell(); }], [M.c1.a, () => { FXS.whoosh(); FXS.hit(); }], [M.c2.a, () => { FXS.whoosh(); FXS.hit(); }], [M.c3.a, () => { FXS.whoosh(); FXS.hit(); }], [M.deal.a, SFX.fanfare], [M.roar.a, () => SFX.buzz(2)]],
  ambience: () => ({ hum: .05 }),
};
})());
