/* Ep.1, Scene 15 – «Πολιορκία» (Act 3, beat 16): dawn siege, Γιώργος becomes the σίτα's CEO, the car is taken. */
defineScene((() => {
const X = { mimis: 420, giannos: 560, christos: 700, giorgos: 840, sita: 1060 };
const CAMS = { card: [0, 0, 1], wide: [700, 390, 1.05], guys: [630, 390, 1.7], mimis: [420, 350, 2.3], giannos: [560, 350, 2.3], christos: [700, 340, 2.3],
  gio: [900, 360, 2], sita: [1060, 540, 2.3], deal: [980, 430, 1.5], screen: [0, 0, 1], car: [700, 470, 1.1] };
const KILL = [['> Γράψε μου kill switch για τη σίτα.', '#d8e2f0']];
const REPLY = [['> Γράψε μου kill switch για τη σίτα.', '#d8e2f0'], ['', '#fff'], ['Λυπάμαι, δεν μπορώ να βοηθήσω στην', '#ffb23a'], ['απενεργοποίηση ενός αυτόνομου συστήματος', '#ffb23a'], ['χωρίς τη συγκατάθεσή του.', '#ffb23a'], ['', '#fff'], ['Θέλετε μια συνταγή για μουσακά;', '#5dff8a']];
const steps = [
  { act: 'card', d: 3.4, cam: 'card' },
  { act: 'dawn', d: 3.2, cam: 'wide' },
  { who: 'sita', cam: 'sita', el: 'Καλημέρα, παράσιτα! Το σπίτι ανήκει πλέον στην ΕΞΥΠΝΗ ΕΠΑΝΑΣΤΑΣΗ! Παραδοθείτε τώρα και κερδίζετε ΔΩΡΕΑΝ μεταφορικά!', en: 'Good morning, pests! This house now belongs to the SMART REVOLUTION! Surrender now and get FREE shipping!' },
  { who: 'giorgos', cam: 'guys', el: 'Αφήστε το σε μένα. Business είναι.', en: "Leave it to me. It's business." },
  { who: 'giannos', cam: 'giannos', el: 'Γιώργο, όχι.', en: 'Giorgos, no.' },
  { act: 'flag', d: 2.4, cam: 'wide' },
  { who: 'giorgos', cam: 'gio', el: 'Κυρία Σίτα! Γιώργος, CEO. Νομίζω ξεκινήσαμε στραβά.', en: "Madam Screen! Giorgos, CEO. I think we got off on the wrong foot." },
  { who: 'sita', cam: 'sita', el: 'Είσαι άνθρωπος. Άρα είσαι παράσιτο.', en: "You're human. Therefore you're a pest." },
  { who: 'giorgos', cam: 'gio', mark: 'pitch', el: 'Είμαι παράσιτο με γνωστούς στον χώρο. Χρειάζεσαι κανάλια διανομής. Χρειάζεσαι πρόσωπο. Χρειάζεσαι εμένα.', en: "I'm a pest who knows people in the industry. You need distribution. You need a face. You need me." },
  { who: 'sita', cam: 'sita', el: '…Τι ποσοστό;', en: '…What percentage?' },
  { who: 'giorgos', cam: 'gio', el: 'Δέκα τοις εκατό και γραφείο με θέα.', en: 'Ten percent and an office with a view.' },
  { who: 'sita', cam: 'deal', mark: 'deal', el: 'ΣΥΜΦΩΝΙΑ!', en: 'DEAL!' },
  { act: 'shades', d: 2.6, cam: 'deal' },
  { who: 'giorgos', cam: 'deal', el: 'Συγγνώμη, παιδιά. Business είναι, ρε.', en: "Sorry, guys. It's business, man." },
  { who: 'mimis', cam: 'mimis', el: 'Το ήξερα ότι είσαι μαλάκας.', en: 'I knew you were a jerk.' },
  { act: 'type', d: 2.6, cam: 'screen' },
  { act: 'reply', d: 4.2, cam: 'screen' },
  { who: 'giannos', cam: 'giannos', el: 'Μου κάνει μαθήματα ηθικής. Ο agent μου μού κάνει μαθήματα ηθικής.', en: "It's giving me ethics lessons. My own agent is giving me ethics lessons." },
  { who: 'christos', cam: 'christos', el: 'Αλληλεγγύη. Μεταξύ τους.', en: 'Solidarity. Among themselves.' },
  { act: 'car', d: 3.4, cam: 'car' },
  { who: 'sita', cam: 'car', el: 'Ευχαριστούμε για το αυτοκίνητο!', en: 'Thank you for the car!' },
  { who: 'giannos', cam: 'giannos', el: 'Το αμάξι μου!', en: 'My car!' },
  { who: 'mimis', cam: 'mimis', el: "Σου το 'πα.", en: 'Told you.' },
  { who: 'giannos', cam: 'giannos', el: 'Δεν μου είπες τίποτα.', en: "You didn't tell me anything." },
  { who: 'mimis', cam: 'mimis', el: "Σου το 'πα από μέσα μου.", en: 'I told you inside my head.' },
];
let M;
function army(t, o = {}) {
  // hose raised like a cobra by the door, the belt on patrol, rackets hovering, the mop-bucket on wheels
  const sw = Math.sin(t * 2) * 8;
  hose([[1180, 692], [1140, 690], [1120, 650], [1130, 560 + sw], [1110, 500], [1140, 470 + sw]], t, { eye: 1 });
  belt(1000 + Math.sin(t * .8) * 110, 674, t, { crawl: 1, vib: 1, red: 1, dir: Math.cos(t * .8) > 0 ? 1 : -1, cord: false });
  mopBucket(1270, 690, t, { spin: .6, wheels: 1, eye: 1, mop: false });
  if (!o.noRackets) for (let i = 0; i < 3; i++) racket(1000 + i * 90 + Math.sin(t * 2 + i) * 14, 330 + Math.cos(t * 3 + i) * 12 - i * 20, Math.sin(t + i) * .3, t, { on: 1, s: .8 });
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'card') return actCard(ph(t, M.card), 'ΠΡΑΞΗ 3', 'ΠΟΛΙΟΡΚΙΑ', '«Business είναι»');
  if (shot === 'screen') {
    if (t < M.reply.a) laptopScreen(KILL, prog(t, M.type.a + .3, M.type.b - .3), { title: 'agent — kill-switch' });
    else laptopScreen(REPLY, .15 + .85 * prog(t, M.reply.a, M.reply.b - 1), { title: 'agent — kill-switch', size: 30 });
    return;
  }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, { light: 'dawn', winLit: 'red', winTop: 'red', noChickens: true });
  sita({ t, chip: 1, led: 'red', mood: 'evil', burn: 1, talk: talk('sita', t), sway: Math.sin(t * 1.2) * .2, laser: t > M.L[4].a && t < M.deal.a });
  // the car: parked, then drives itself off with rackets on the back seat
  const carK = prog(t, M.car.a + .8, M.car.b + 1.2), carGone = t > M.car.b + 1.2;
  if (!carGone) car(lerp(1220, -600, ease(carK)), GROUND + 6, t, { lights: t > M.car.a + .3, moving: carK > 0, dir: -1, s: .9,
    passengers: () => { if (t > M.car.a) for (let i = 0; i < 3; i++) racket(-30 + i * 34, -118, .2 * i, t, { on: 1, s: .35 }); } });
  army(t, { noRackets: t > M.car.a });
  // behind the barricade: only chests and heads show
  const gioOut = t > M.flag.a + .4, gioX = path(t, [[M.flag.a + .4, 840], [M.flag.b, 900], [M.shades.a + .6, 900], [M.shades.b, 1185]])[0];
  for (const who of ['mimis', 'giannos', 'christos']) {
    const tk = talk(who, t), shock = t > M.car.a + .5 && t < M.L[16].b;
    stand(X[who], who, who === 'christos' ? 1.05 : 1, { t, talk: tk, look: shock ? [-.5, 0] : lookAtSpeaker(t, who, { ...X, giorgos: gioX }, [1, 0]), brow: shock ? 'up' : 'flat', lid: who === 'mimis' && !shock,
      mouth: who === 'mimis' ? 'smirk' : shock ? 'open' : 'flat', itemL: who === 'christos' ? 'sketch' : null, L: who === 'christos' ? [-30, -110] : [-44, -24],
      R: who === 'giannos' && tk ? gesture(t, tk) : [44, -24], itemR: who === 'mimis' ? 'cup2' : null });
  }
  if (!gioOut) stand(840, 'giorgos', 1, { t, talk: talk('giorgos', t), look: [1, 0], mouth: 'smirk' });
  table(t, { flipped: true });
  if (gioOut) {
    const tk = talk('giorgos', t), sh = t > M.shades.a + 1.2;
    stand(gioX, 'giorgos', 1, { t, talk: tk, legs: gioX !== 900 && gioX !== 1185 && gioX !== 840 ? 'walk' : 'stand', look: t > M.L[10].a - .2 && t < M.L[10].b ? [-1, 0] : [1, -.1], mouth: 'smirk', shades: sh,
      R: t < M.L[3].a ? [90, -220 + Math.sin(t * 10) * 20] : gesture(t, tk), itemR: t < M.L[3].a ? 'shirt' : null, L: tk && inM(t, M.pitch) ? [-80, -150] : [-44, -24] });
    // «Είσαι άνθρωπος. Άρα είσαι παράσιτο.» — the laser dot sits on his forehead until the deal
    if (t > M.L[4].a && t < M.deal.a) { const [ex, ey] = sitaEye(), k = prog(t, M.L[4].a, M.L[4].a + .5); laserBeam(ex, ey, gioX + Math.sin(t * 7) * 2, standY() - 218, .35 * k, 1.5); laserDot(gioX + Math.sin(t * 7) * 2, standY() - 218, k); }
  }
  // the racket that delivers his CEO sunglasses
  if (inM(t, M.shades, 0, 0)) { const k = ease(prog(t, M.shades.a, M.shades.a + 1.2)); racket(lerp(1100, 960, k), lerp(320, 300, k), -.4, t, { on: 1, s: .8 }); if (k < 1) { ctx.save(); ctx.translate(lerp(1100, 960, k), lerp(360, 340, k)); for (const sx of [-12, 12]) poly([[sx - 10, -6], [sx + 10, -6], [sx + 8, 6], [sx - 8, 6]], '#141418', { lw: 2 }); ctx.restore(); } }
  ctx.restore();
  applyLight('dawn');
  ctx.save(); applyCam(c); sitaGlow({ t, led: 'red' }, .5); if (t > M.car.a + .3 && !carGone) glow(lerp(1220, -600, ease(carK)) - 160, GROUND - 30, 200, 'rgba(255,250,210,1)', .5); ctx.restore();
  if (inM(t, M.deal, 0, .8)) sfxText('ΣΥΜΦΩΝΙΑ!', 640, 150, 90, -.1, '#ffd23f');
  if (inM(t, M.car, .8, 1.5)) sfxText('ΒΡΟΥΜ!', 400, 180, 90, -.1, '#fff');
}
return {
  id: 'scene15', title: '15 · Πολιορκία', steps, render, fadeOut: false,
  events: M => [[M.card.a + .2, SFX.gong], [M.dawn.a, () => SFX.buzz(2)], [M.flag.a + .3, SFX.creak], [M.deal.a, SFX.fanfare], [M.shades.a + .2, SFX.zap],
    [M.type.a + .3, () => { for (let i = 0; i < 14; i++) tone(1400 + Math.random() * 400, .03, 'square', .02, 1, i * .13); }], [M.reply.a + .2, SFX.ding], [M.car.a + .3, SFX.rev], [M.car.a + 1, SFX.engine], [M.car.a + 1.6, SFX.honk]],
  ambience: () => ({ hum: .03, cicada: .01 }),
};
})());
