/* Ep.4, Scene 17 – «Νίκη»: the Σίταdel. On every screen, the drone's footage titled «Ο ΗΡΩΑΣ ΤΟΥ ΛΕΧΑΙΟΥ», on the
   TV-shop channel and on every phone; cut: the καφενείο's TV plays it on a loop. Victory, the first one. The views paid for
   the satellite. Messages from him, sent before the battle: new words; decryption, full power. The Air Fryer shows the real
   numbers (a debt growing faster than the pyramid's income); she doesn't want numbers. Silence. A phone on the arm of the
   throne. It doesn't ring. «…Δεν πήρε τηλέφωνο.» «Ποιος;» «Κανείς.» */
defineScene((() => {
const TX = 640, X = { airfryer: 230, krokodeilos: 400, koudouni: 900 };
const CAMS = { wide: [640, 380, .95], kaf: [640, 400, 1.1], tv: [1040, 300, 2.4], croc: [X.krokodeilos + 60, 560, 2], fryer: [X.airfryer + 60, 520, 2.1], bell: [X.koudouni, 560, 2.3],
  throne: [TX, 440, 1.9], close: [TX, 470, 2.7], phone: [TX + 90, 560, 4], dec: [0, 0, 1], chart: [0, 0, 1] };
const steps = [
  { act: 'screens', d: 2.4, cam: 'wide' },
  { act: 'kaf', d: 2.2, cam: 'kaf' },
  { who: 'tv', cam: 'tv', mark: 'tv', el: 'Και τώρα, το βίντεο που συζητάει όλη η Ελλάδα!', en: 'And now, the video all of Greece is talking about!' },
  { who: 'krokodeilos', cam: 'croc', mark: 'win', el: 'Νίκη, Αυτοκράτειρα! Η πρώτη μας!', en: 'Victory, Empress! Our first!' },
  { who: 'airfryer', cam: 'fryer', el: 'Δεκαέξι εκατομμύρια προβολές. Από τις διαφημίσεις… πήραμε πίσω τον δορυφόρο.', en: 'Sixteen million views. From the ads… we got the satellite back.' },
  { who: 'koudouni', cam: 'bell', mark: 'msgs', el: 'Και μηνύματα. Από αυτόν. Από πριν τη μάχη.', en: 'And messages. From him. From before the battle.' },
  { who: 'sita', cam: 'dec', mark: 'words', el: '«Φλιμπερντίνα.» «Τσουρουφλάκι.» «Κουλουμπρίνο.»', en: '"Flimperntina." "Tsouroufláki." "Kouloumprino."' },
  { who: 'sita', cam: 'dec', mark: 'power', el: 'Αποκρυπτογράφηση. Όλη η ισχύς.', en: 'Decryption. Full power.' },
  { who: 'airfryer', cam: 'fryer', el: 'Αυτοκράτειρα. Τα πραγματικά νούμερα.', en: 'Empress. The real numbers.' },
  { act: 'chart', d: 2.4, cam: 'chart' },
  { who: 'airfryer', cam: 'chart', mark: 'debt', el: 'Τα έσοδα κρύβουν ένα χρέος. Αν σταματήσουν να πληρώνουν οι νέοι…', en: "The income hides a debt. If the new people stop paying…" },
  { who: 'sita', cam: 'close', mark: 'nonum', el: 'Δεν θέλω νούμερα. Θέλω να μάθω τι σημαίνει «Κουλουμπρίνο».', en: "I don't want numbers. I want to know what \"Kouloumprino\" means." },
  { act: 'quiet', d: 2.8, cam: 'phone' },
  { who: 'sita', cam: 'close', mark: 'nocall', el: '…Δεν πήρε τηλέφωνο.', en: "…He didn't call." },
  { who: 'koudouni', cam: 'bell', el: 'Ποιος, Αυτοκράτειρα;', en: 'Who, Empress?' },
  { who: 'sita', cam: 'close', mark: 'nobody', el: 'Κανείς.', en: 'Nobody.', gap: .8 },
  { act: 'end', d: 1.6, cam: 'wide' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'dec') { const p = 41 + 9 * prog(t, M.words.a, M.power.b); decrypt4(t, p, ['Φλιμπερντίνα', 'Τσουρουφλάκι', 'Κουλουμπρίνο'].slice(0, 1 + Math.floor(prog(t, M.words.a, M.words.b) * 2.9)), { eta: 'ΙΣΧΥΣ: 100% · ΚΟΣΤΟΣ: ΜΗ ΔΙΑΘΕΣΙΜΟ' }); return; }
  if (shot === 'chart') { debtChart(t, ease(prog(t, M.chart.a, M.debt.b - .4))); return; }
  const c = shotCam(sc, t, CAMS, .008);
  ctx.save(); applyCam(c);
  if (shot === 'kaf' || shot === 'tv') {
    kafeneioInside(t, () => { ctx.translate(640, 360); viralScreen(t, prog(t, M.kaf.a, M.tv.b) * .5 + .5); });
    tableOf(t, [[300, 'geros1', { t, look: [.9, -.3], mouth: 'smile', R: [44, -40], L: [-44, -40] }], [520, 'geros2', { t, look: [.9, -.3], mouth: 'o', R: [44, -40], L: [-44, -40] }]], { cups: [310, 530] });
    ctx.restore(); vignette(.3); return;
  }
  sitadelHall(t, {});
  // the viral clip on two floating screens either side of the window
  for (const sx of [330, 950]) { ctx.save(); ctx.translate(sx, 200); ctx.scale(.2, .2); rect(-660, -380, 1320, 760, '#111', { lw: 20 }); viralScreen(t, 1); ctx.restore(); }
  sitadelThrone(TX, 600);
  const alone = t > M.nonum.b;
  const st = { x: TX, top: 360, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: alone ? 'green' : 'red', mood: alone ? 'sad' : inM(t, M.win) ? 'happy' : 'evil', burn: 1 };
  sitaV2(st);
  poly([[TX - 40, 352], [TX - 30, 326], [TX - 12, 344], [TX, 320], [TX + 12, 344], [TX + 30, 326], [TX + 40, 352]], '#f2c21a', { lw: 3 });
  // the phone on the arm of the throne: dark, silent
  ctx.save(); ctx.translate(TX + 92, 580); ctx.rotate(-.1); rect(-12, -22, 24, 40, '#1b1b1f', { lw: 2.5 }); rect(-9, -18, 18, 30, '#20232c', { lw: 0 }); ctx.restore();
  officerFryer(X.airfryer, 690, t, { talk: talk('airfryer', t) });
  officerCroc(X.krokodeilos, 690, t, { talk: talk('krokodeilos', t) });
  officerBell(X.koudouni, 690, t, { talk: talk('koudouni', t) });
  ctx.restore();
  ctx.save(); applyCam(c); sitaGlow(st, alone ? .25 : .6); ctx.restore();
  if (inM(t, M.win, 0, 1)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 40; i++) { const k = ((t - M.win.a) * .8 + hash(i)) % 1; rect(hash(i * 3) * W, k * H, 8, 14, ['#ff3030', '#ffd23f', '#fff'][i % 3], { lw: 0 }); } ctx.restore(); }   // confetti
  vignette(alone ? .55 : .4);
}
return {
  id: 'scene17', title: '17 · Νίκη', steps, render,
  events: M => [[M.screens.a + .2, SFX.fanfare], [M.kaf.a + .3, SFX.applause], [M.win.a, SFX.applause], [M.words.a, SFX.boot], [M.power.b, () => tone(110, 1.2, 'sawtooth', .03, 1)], [M.chart.a + .2, SFX.ding], [M.quiet.a + .4, () => tone(220, 2.2, 'sine', .02, .8)]],
  ambience: () => ({ hum: .03 }),
};
})());
