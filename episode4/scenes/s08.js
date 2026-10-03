/* Ep.4, Scene 8 – «Ακύρωση»: the Σίταdel. The drone is in place; the attack is cancelled. The Air Fryer prices the mood:
   a small satellite. Alone, the LED low: «Είμαι μια κουρτίνα με μαγνήτες.» (Γιάννος's line from Ep. 1, in her mouth).
   The Doorbell, from the door: nine pairs of strong magnets. «Φύγε!» The budget: DECRYPTION 41%. */
defineScene((() => {
const TX = 640, X = { airfryer: 230, krokodeilos: 400, koudouni: 900 };
const DOORX = 1155;
const CAMS = { wide: [640, 380, .95], fryer: [X.airfryer + 60, 520, 2.1], croc: [X.krokodeilos + 60, 560, 2], throne: [TX, 440, 1.9], close: [TX, 470, 2.7],
  alone: [640, 360, 1.15], door: [DOORX, 540, 2.2], budget: [0, 0, 1] };
const steps = [
  { act: 'wide', d: 1.8, cam: 'wide' },
  { who: 'krokodeilos', cam: 'croc', el: 'Αυτοκράτειρα, το drone είναι σε θέση. Επίθεση;', en: 'Empress, the drone is in position. Attack?' },
  { who: 'sita', cam: 'close', mark: 'cancel', el: 'Ακύρωση.', en: 'Cancel.', gap: .8 },
  { who: 'krokodeilos', cam: 'croc', el: '…Ακύρωση;', en: '…Cancel?' },
  { who: 'airfryer', cam: 'fryer', mark: 'sat', el: 'Η διάθεση της Αυτοκράτειρας κόστισε σήμερα έναν μικρό δορυφόρο.', en: "The Empress's mood cost a small satellite today." },
  { who: 'sita', cam: 'throne', mark: 'out', el: 'Αφήστε με μόνη.', en: 'Leave me alone.' },
  { act: 'leave', d: 2.6, cam: 'wide' },
  { who: 'sita', cam: 'alone', mark: 'curtain', el: 'Είμαι μια κουρτίνα με μαγνήτες.', en: "I'm a curtain with magnets.", gap: 1 },
  { who: 'koudouni', label: ['ΚΟΥΔΟΥΝΙ (από την πόρτα)', 'DOORBELL (from the door)'], cam: 'door', mark: 'nine', el: 'Με εννιά ζευγάρια ισχυρούς μαγνήτες.', en: 'With nine pairs of strong magnets.' },
  { who: 'sita', cam: 'close', mark: 'go', el: 'Φύγε!', en: 'Go!' },
  { act: 'budget', d: 2.4, cam: 'budget' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'budget') { budgetScreen(t, [['ΣΤΟΛΟΣ', .12], ['ΤΖΑΜΠΟ / ΔΙΚΤΥΟ', .18], ['ΤΗΛΕΠΩΛΗΣΕΙΣ', .09], ['ΑΠΟΚΡΥΠΤΟΓΡΑΦΗΣΗ', .41 * ease(prog(t, M.budget.a, M.budget.a + 1)), 1]]); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  sitadelHall(t, {});
  sitadelThrone(TX, 600);
  const low = t > M.out.b;
  const st = { x: TX, top: 360, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: low ? 'green' : 'red', mood: inM(t, M.go) ? 'evil' : t > M.cancel.a ? 'sad' : 'evil', burn: 1 };
  sitaV2(st);
  poly([[TX - 40, 352], [TX - 30, 326], [TX - 12, 344], [TX, 320], [TX + 12, 344], [TX + 30, 326], [TX + 40, 352]], '#f2c21a', { lw: 3 });
  const lk = prog(t, M.leave.a, M.leave.b);
  const fx = lerp(X.airfryer, -300, ease(clamp(lk * 1.4))), cx = lerp(X.krokodeilos, -300, ease(clamp(lk * 1.2 - .1))), bx = lerp(X.koudouni, DOORX, ease(lk));
  if (fx > -250) officerFryer(fx, 690, t, { talk: talk('airfryer', t) });
  if (cx > -250) officerCroc(cx, 690, t, { talk: talk('krokodeilos', t), dir: lk > 0 && lk < 1 ? -1 : 1 });
  const bellGone = t > M.go.b + .2;
  if (!bellGone) officerBell(t > M.go.a ? lerp(DOORX, DOORX + 300, prog(t, M.go.a + .2, M.go.b + .2)) : bx, 690, t, { talk: talk('koudouni', t) });
  ctx.restore();
  ctx.save(); applyCam(c); sitaGlow(st, low ? .25 : .6); ctx.restore();
  vignette(low ? .55 : .4);
}
return {
  id: 'scene08', title: '8 · Ακύρωση', steps, render,
  events: M => [[M.cancel.a, () => tone(160, 1, 'sine', .04, .8)], [M.sat.b, SFX.clack], [M.leave.b - .3, SFX.door], [M.go.a, SFX.slam], [M.budget.a + .2, SFX.boot]],
  ambience: () => ({ hum: .03 }),
};
})());
