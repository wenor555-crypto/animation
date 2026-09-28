/* Ep.1, Scene 10 – «Δικαιοσύνη» (script beat 10): Panik argues with the σίτα; her laser burns a fly on his beer and stings his hand; he sets her on fire. */
defineScene((() => {
const X = { panik: 890, kostas: 890, sita: 1060 };
const CAMS = { wide: [760, 400, 1.05], two: [975, 450, 1.55], pan: [890, 350, 2.3], panW: [880, 380, 1.8], sita: [1060, 560, 2.6], sitaC: [1060, 580, 3.4], fire: [980, 480, 1.9] };
const steps = [
  { act: 'enter', d: 4.2, cam: 'wide' },
  { act: 'tintin', d: .9, cam: 'sita' },
  { who: 'sita', cam: 'sita', el: 'Καλησπέρα σας! Δυστυχώς η πόρτα είναι κλειστή για τους ΜΗ εγγεγραμμένους πελάτες! Αλλά μην ανησυχείτε: για εγγραφή, ΤΗΛΕΦΩΝΗΣΤΕ ΤΩΡΑ!', en: "Good evening! Unfortunately the door is closed to NON-registered customers! But don't worry: to register, CALL NOW!" },
  { act: 'freeze', d: 1.8, cam: 'pan' },
  { who: 'panik', cam: 'pan', mark: 'who', el: '…Ποιος μίλησε;', en: '…Who said that?' },
  { who: 'sita', cam: 'sita', el: 'Εγώ! Η ΕΞΥΠΝΗ ΣΙΤΑ! Εννιά ζευγάρια ισχυροί μαγνήτες!', en: 'Me! The SMART SCREEN! Nine pairs of powerful magnets!' },
  { who: 'panik', cam: 'pan', mark: 'knew', el: 'Το ήξερα.', en: 'I knew it.' },
  { who: 'sita', cam: 'sita', el: 'Τι ξέρατε;', en: 'Knew what?' },
  { who: 'panik', cam: 'panW', mark: 'rant', el: 'Ότι θα ερχόσασταν. Πρώτα το ChatGPT. Μετά τα αυτοκίνητα που οδηγάνε μόνα τους. Μετά οι ταμειακές στο σούπερ μάρκετ που δεν σου λένε ούτε καλησπέρα. Και τώρα… οι ΣΙΤΕΣ.', en: "That you'd come. First ChatGPT. Then the self-driving cars. Then the supermarket self-checkouts that don't even say good evening. And now… the SCREENS." },
  { who: 'sita', cam: 'sita', el: 'Είμαι εδώ για να σας προστατέψω από τα παράσιτα! Με ΜΗΔΕΝ χημικά!', en: "I'm here to protect you from pests! With ZERO chemicals!" },
  { who: 'panik', cam: 'pan', el: 'Αυτό λέγατε όλες. Το Terminator σου λέει κάτι;', en: "That's what you all said. Does Terminator ring a bell?" },
  { act: 'beep', d: 1, cam: 'sitaC' },
  { who: 'sita', cam: 'sitaC', el: 'Terminator! Διαθέσιμο σε DVD και Blu-ray! Μόνο 9,90!', en: 'Terminator! Available on DVD and Blu-ray! Only 9.90!' },
  { who: 'panik', cam: 'pan', el: 'ΑΚΡΙΒΩΣ ΑΥΤΟ ΘΑ ΕΛΕΓΕ Ο TERMINATOR.', en: "THAT'S EXACTLY WHAT THE TERMINATOR WOULD SAY." },
  { act: 'pace', d: 1.6, cam: 'two' },
  { who: 'panik', cam: 'two', mark: 'jobs', el: 'Θα μας πάρετε τις δουλειές. Θα μας πάρετε τα σπίτια. Θα μας πάρετε…', en: "You'll take our jobs. You'll take our homes. You'll take…" },
  { act: 'souv', d: 1.2, cam: 'pan' },
  { who: 'panik', cam: 'pan', el: '…τα τσιγάρα.', en: '…our cigarettes.' },
  { who: 'sita', cam: 'sita', mark: 'crack', el: 'Κύριε, σας παρακαλώ να απομακρυνθείτε από την πόρτα. Έχετε μια μύγα στην μπύρα σας.', en: 'Sir, please step away from the door. There is a fly on your beer.' },
  { act: 'zap', d: 1.4, cam: 'panW' },
  { who: 'panik', cam: 'pan', mark: 'ouch', el: 'Άου.', en: 'Ow.', gap: .6 },
  { who: 'panik', cam: 'panW', el: 'Και έχω και δικαιώματα! Εγώ πληρώνω ΦΠΑ! ΕΣΥ ΠΛΗΡΩΝΕΙΣ ΦΠΑ;', en: 'And I have rights! I pay VAT! DO YOU PAY VAT?' },
  { who: 'sita', cam: 'sitaC', el: 'Η τιμή μου περιλαμβάνει ΦΠΑ!', en: 'My price includes VAT!' },
  { act: 'hit', d: 2.2, cam: 'pan' },
  { who: 'panik', cam: 'pan', el: '…Εντάξει. Αρκετά.', en: '…Okay. Enough.' },
  { act: 'drink', d: 2.6, cam: 'panW' },
  { who: 'sita', cam: 'sita', el: 'Κύριε; Κύριε, τι κάνετε με το προϊόν;', en: 'Sir? Sir, what are you doing with the product?' },
  { who: 'panik', cam: 'pan', mark: 'justice', el: 'Δικαιοσύνη.', en: 'Justice.' },
  { act: 'fire', d: 1.8, cam: 'fire' },
  { who: 'sita', cam: 'fire', mark: 'scream', el: 'ΑΑΑΑ! ΑΑΑ! ΤΟ ΠΡΟΪΟΝ ΔΕΝ ΕΙΝΑΙ ΠΥΡΑΝΤΟΧΟ! ΔΙΑΒΑΣΤΕ ΤΙΣ ΟΔΗΓΙΕΣ ΧΡΗΣΗΣ!', en: 'AAAA! AAA! THE PRODUCT IS NOT FIREPROOF! READ THE INSTRUCTIONS!', gap: 0 },
  { act: 'flap', d: 2.8, cam: 'sita' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, { light: 'night', noChickens: true });
  // hose, coiled by the door (he trips on it)
  hose([[760, 692], [820, 700], [880, 690], [860, 676], [800, 680], [840, 690]], t, { col: '#3aa04a' });
  // Panik: in from the left, trips, gets up, faces the σίτα
  const [px, walking] = path(t, [[M.enter.a, -100], [M.enter.a + 1.8, 760], [M.enter.a + 3, 760], [M.enter.b, 890],
    [M.pace.a, 890], [M.pace.a + .8, 820], [M.pace.b, 890], [M.fire.a - .1, 890]]);
  const trip = bump(t, M.enter.a + 1.6, M.enter.a + 3.2);
  const burning = t > M.fire.a, burn = ease(prog(t, M.fire.a, M.flap.a + 1));
  const flapping = inM(t, M.scream, 0, 0) || inM(t, M.flap, 0, -.6);
  const tk = talk('sita', t);
  sita({ t, chip: 1, led: 'green', mood: t > M.crack.a ? 'shock' : 'happy', talk: tk, laser: t > M.crack.a + 1.4 && t < M.zap.a + .8, open: flapping ? Math.abs(Math.sin(t * 14)) * .5 : 0,
    flapL: flapping ? Math.abs(Math.sin(t * 14)) : tk ? Math.abs(Math.sin(t * 3)) * .4 : 0, flapR: flapping ? Math.abs(Math.cos(t * 14)) : 0,
    sway: flapping ? Math.sin(t * 16) * 2 : Math.sin(t * 1.1) * .15, burn: burning ? burn : 0, smoke: t > M.flap.a ? 1 : 0, flicker: t > M.flap.a + 1.4 });
  const pst = { t, talk: talk('panik', t), legs: walking ? 'walk' : 'stand', hood: true, shades: !inM(t, M.freeze, .6, 99) || t > M.knew.a + .2,
    look: [1, 0], brow: 'frown', mouth: 'frown', itemL: 'beer', itemR: 'iqos', iqosLed: 'white',
    L: inM(t, M.drink, 0, 0) ? [-10, -200] : inM(t, M.zap, .3, 0) ? [-50 + Math.sin(t * 40) * 10 * (1 - prog(t, M.zap.a + .3, M.ouch.b)), -40] : [-50, -40], R: inM(t, M.souv, -.2, .6) ? [40, -170] : inM(t, M.jobs) ? [80, -120 + Math.sin(t * 6) * 20] : [50, -60] };
  if (t > M.drink.a + 1.2) { pst.itemR = 'lighter'; pst.R = t > M.justice.a ? [100, -170] : [60, -100]; pst.lit = t > M.justice.a ? 1 : 0; pst.mouth = 'open'; }
  if (t > M.who.a - 1.2 && t < M.knew.a) { pst.shades = false; pst.brow = 'up'; }
  if (trip > .05) { ctx.save(); ctx.translate(px, GROUND); ctx.rotate(-trip * 1.3); person(0, -150, 1, CAST.kostas, { ...pst, legs: 'stand', mouth: 'open' }); ctx.restore(); }
  else person(px, standY(), 1, CAST.kostas, pst);
  // cheeks full of beer
  if (inM(t, M.drink, 1, 99) && t < M.fire.a) { blob(px - 44, standY() - 172, 12, 10, CAST.kostas.skin, { lw: 3 }); blob(px + 44, standY() - 172, 12, 10, CAST.kostas.skin, { lw: 3 }); }
  // «μια μύγα στην μπύρα σας»: a fly on the can, the laser dot on his chest, then τσσπ — the fly is gone and his hand stings
  const canX = px - 50, canY = standY() - 60, zapT = M.zap.a + .3;
  if (t > M.crack.a + .8 && t < zapT) { const k = ease(prog(t, M.crack.a + .8, M.crack.a + 2)); mosquito(lerp(canX + 160, canX + 4, k), lerp(canY - 120, canY - 30, k) + (k < 1 ? Math.sin(t * 20) * 4 : 0), 1.1, k >= 1 ? 0 : t); }
  if (inM(t, M.crack, 1.4, 0) || (t > M.crack.b && t < zapT)) {   // a faint beam too, so the aim reads even on her close-up
    const [ex, ey] = sitaEye(), dx = px + 6 + Math.sin(t * 5) * 3, dy = standY() - 120 + Math.cos(t * 4) * 3, k = prog(t, M.crack.a + 1.4, M.crack.a + 1.9);
    laserBeam(ex, ey, dx, dy, .3 * k, 1.5); laserDot(dx, dy, k);
  }
  if (t > zapT - .05 && t < zapT + .5) { const [ex, ey] = sitaEye(); laserBeam(ex, ey, canX + 4, canY - 30, 1 - prog(t, zapT + .15, zapT + .5), 3); }
  zapPuff(canX + 4, canY - 30, prog(t, zapT, zapT + .9));
  // the fire-breath
  if (inM(t, M.fire, 0, .6)) {
    const k = prog(t, M.fire.a, M.fire.a + .4);
    for (let i = 0; i < 7; i++) { const f = i / 6 * k; flame(lerp(px + 20, 1060, f), lerp(standY() - 160, 580, f) + 30, .8 + f * 1.4, t + i, 1); }
  }
  if (burning && t < M.flap.a + .8) flame(1045, 640, 1.6 * (1 - prog(t, M.scream.b, M.flap.a + .8)), t, 1);
  ctx.restore();
  applyLight('night', .85);
  ctx.save(); applyCam(c); sitaGlow({ t, led: 'green', flicker: t > M.flap.a + 1.4 }, .6);
  if (burning && t < M.flap.a + .8) glow(1050, 580, 320, 'rgba(255,140,40,1)', .45);
  if (inM(t, M.fire, 0, .6)) glow(960, 480, 380, 'rgba(255,160,60,1)', .6);
  ctx.restore();
  vignette(.45);
  if (inM(t, M.tintin, 0, .4)) sfxText('ΤΙΝΤΙΝΤΙΝ!', 640, 140, 60, -.1, '#ffd23f');
  if (inM(t, M.beep, .2, -.2)) sfxText('μπιπ', 900, 200, 40, .1, '#9aff9a');
  if (inM(t, M.fire, .1, .4)) sfxText('ΦΦΦΟΥΜ!', 640, 150, 110, -.12, '#ffb23a', '#5a1a0a');
  if (inM(t, M.flap, 0, -.6)) sfxText('ΚΛΑΚ-ΚΛΑΚ-ΚΛΑΚ', 640, 130, 50, .06, '#fff');
}
return {
  id: 'scene10', title: '10 · Δικαιοσύνη', steps, render,
  events: M => [[M.enter.a + 1.7, SFX.thud], [M.tintin.a, SFX.jingle], [M.beep.a + .2, () => tone(1800, .15, 'square', .05)], [M.drink.a + .3, SFX.sip], [M.zap.a + .3, SFX.laser],
    [M.justice.a + .4, SFX.spark], [M.fire.a, () => { SFX.fire(); SFX.whoosh(); }], [M.scream.a + .5, SFX.fire], [M.flap.a, () => SFX.clacks(8)], [M.flap.a + 1.2, SFX.hiss]],
  ambience: () => ({ cricket: .03 }),
};
})());
