/* Ep.4, Scene 5 – «Το γύρισμα»: a rented studio lit like a TV shop, the banner «ΣΙΤΑ ΕΪ ΑΪ · GOLD». Young men in suits
   in a row; Μίμης behind the camera with a megaphone. The testimonials. Off to the side, the minister cuts a ribbon with
   Γιώργος (flash). Χαμάντ: everyone took Gold, and you? «Εγώ είμαι το Gold.» (plant 1: he is the only one without a
   gold pin). Μίμης alone at the monitor: five years of film school. Μαρία calls: «Δουλειά είναι.» */
defineScene((() => {
const PH = ['ΜΑΡΙΑ (τηλέφωνο)', 'MARIA (phone)'];
const X = { ex1: 300, neos2: 520, neos3: 760, ex2: 980, mimis: 1180, ypourgos: 1560, giorgos: 1730, hamad: 1890 };
const CAMS = { wide: [640, 400, 1], mim: [X.mimis, 400, 2], n2: [X.neos2, 400, 2.2], n3: [X.neos3, 400, 2.2], row: [640, 420, 1.3],
  ribbon: [1700, 400, 1.25], min: [X.ypourgos, 400, 2.1], gh: [1810, 410, 1.8], gio: [X.giorgos, 400, 2.3], mon: [X.mimis - 20, 380, 2.6] };
const steps = [
  { act: 'set', d: 2.2, cam: 'wide' },
  { who: 'mimis', cam: 'mim', mark: 'again', el: 'Από την αρχή. Πιο αισιόδοξα. Σαν να μην ξέρετε τι υπογράψατε.', en: "From the top. More upbeat. Like you don't know what you signed." },
  { who: 'neos2', cam: 'n2', mark: 'rm', el: 'Πριν έναν χρόνο ήμουν άνεργος. Σήμερα είμαι Regional Manager. Μισθό δεν έχω. Αλλά! Έχω τίτλο.', en: "A year ago I was unemployed. Today I'm a Regional Manager. I don't have a salary. But! I have a title.", say: 'Πριν έναν χρόνο ήμουν άνεργος. Σήμερα είμαι Ρίτζιοναλ Μάνατζερ. Μισθό δεν έχω. Αλλά! Έχω τίτλο.' },
  { who: 'neos3', cam: 'n3', mark: 'mum', el: 'Η μάνα μου λέει σε όλη τη γειτονιά ότι δουλεύω. Δεν ξέρει σε τι. Ούτε εγώ.', en: "My mum tells the whole neighbourhood I've got a job. She doesn't know doing what. Neither do I." },
  { who: 'mimis', cam: 'mim', mark: 'cut', el: 'Cut. Τέλειο. Δεν πιστεύω λέξη. Θα πουλήσει.', en: "Cut. Perfect. I don't believe a word. It'll sell.", say: 'Κατ. Τέλειο. Δεν πιστεύω λέξη. Θα πουλήσει.' },
  { act: 'ribbon', d: 2.4, cam: 'ribbon' },
  { who: 'ypourgos', cam: 'min', mark: 'gov', el: 'Η κυβέρνηση στηρίζει την καινοτομία. Ιδιαίτερα όταν η καινοτομία στηρίζει την κυβέρνηση.', en: 'The government supports innovation. Especially when innovation supports the government.' },
  { who: 'hamad', cam: 'gh', el: 'Γιώργο, habibi. Όλοι πήραν το Gold. Εσύ;', en: 'Giorgos, habibi. Everyone took Gold. You?', say: 'Γιώργο, χαμπίμπι. Όλοι πήραν το Γκολντ. Εσύ;' },
  { who: 'giorgos', cam: 'gio', mark: 'gold', el: 'Εγώ είμαι το Gold.', en: 'I am the Gold.', say: 'Εγώ είμαι το Γκολντ.' },
  { act: 'alone', d: 1.8, cam: 'mon' },
  { who: 'mimis', cam: 'mon', mark: 'school', el: 'Πέντε χρόνια σχολή κινηματογράφου. Η πρώτη μου πληρωμένη δουλειά είναι πυραμίδα.', en: 'Five years of film school. My first paid job is a pyramid.' },
  { act: 'ring', d: 1.2, cam: 'mon' },
  { who: 'maria', label: PH, fx: 'phone', cam: 'mon', mark: 'maria', el: 'Μίμη! Έμαθα ότι δουλεύεις! Επιτέλους. Τώρα νοικοκυρέψου.', en: "Mimis! I heard you've got work! Finally. Now get your life in order." },
  { who: 'mimis', cam: 'mon', el: 'Μαρία, γυρίζω διαφήμιση για απάτη.', en: "Maria, I'm shooting an ad for a scam." },
  { who: 'maria', label: PH, fx: 'phone', cam: 'mon', mark: 'job', el: 'Δουλειά είναι.', en: "It's a job." },
  { act: 'end', d: 1.4, cam: 'mon' },
];
let M;
const pin = (x, s) => blob(x + 18 * s, standY(s) - 100 * s, 7 * s, 7 * s, '#f2c21a', { lw: 2 });
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  shootStudio(t, {});
  // the new offices' entrance, to the right of the set: a door, a sign, the ribbon
  rect(1380, 120, 640, 480, '#e8e4dc', { lw: 4 }); rect(1560, 150, 300, 60, '#1a1a20', { lw: 3 }); txt('ΝΕΑ ΓΡΑΦΕΙΑ · ΣΙΤΑ ΕΪ ΑΪ', 1710, 180, 22, '#f2c21a', { font: TVFONT, weight: 900 });
  doorway(1710, 600, 180, 340, '#2a2420', 0);
  const cutK = prog(t, M.gov.b - .2, M.gov.b + .3);
  curve([[1600, 450], [1700 - cutK * 20, 452 + cutK * 30]], 6, '#d8202a', { w: 0 }); curve([[1720 + cutK * 20, 452 + cutK * 30], [1820, 450]], 6, '#d8202a', { w: 0 });
  // the row of young men, the camera, Μίμης
  const talking = (w) => talk(w, t);
  for (const [w, cast] of [['ex1', 'neosSuit'], ['neos2', 'neos2'], ['neos3', 'neos3'], ['ex2', 'neosSuit']]) {
    stand(X[w], cast, .9, { t, talk: talking(w), look: [.3, .1], brow: 'up', mouth: t < M.cut.a ? 'smile' : 'flat', R: gesture(t, talking(w), [44, -30]), L: [-44, -30] });
    pin(X[w], .9);
  }
  filmCamera(X.mimis - 110, 690, 1, t < M.cut.a, t);
  const megaphone = t < M.cut.b;
  stand(X.mimis, 'mimis', 1, { t, talk: talk('mimis', t), dir: -1, look: t > M.alone.a ? [-.3, .3] : [-.8, 0], brow: 'flat', mouth: 'flat',
    R: megaphone ? [70, -200] : t > M.ring.a && t < M.end.a ? [48, -196] : [44, -40], itemR: megaphone ? 'megaphone' : t > M.ring.a && t < M.end.a ? 'phone' : null, L: [-40, -30] });
  // the ribbon party
  stand(X.ypourgos, 'ypourgos', 1, { t, talk: talk('ypourgos', t), look: [.6, 0], brow: 'up', mouth: 'smile', R: [70, -60], itemR: 'scissors', L: [-40, -30] });
  stand(X.giorgos, 'giorgosJacket', 1, { t, talk: talk('giorgos', t), look: inM(t, M.gold) ? [.3, -.1] : [-.6, 0], brow: 'up', mouth: 'smile', R: gesture(t, talk('giorgos', t), [44, -30]), L: [-40, -30] });
  stand(X.hamad, 'hamad', 1, { t, talk: talk('hamad', t), dir: -1, look: [-.8, 0], brow: 'up', mouth: 'smile', R: [44, -30], L: [-40, -30] });
  pin(X.hamad, 1); pin(X.ypourgos, 1);
  ctx.restore();
  if (inM(t, M.ribbon, .6, -1.2) || inM(t, M.gov, 0, .5)) { const f = (t * 1.7) % 1; if (f < .12) fxFlash(1 - f / .12); }   // the press flashes
  if (inM(t, M.alone)) { ctx.save(); applyCam(c); rect(X.mimis - 150, 470, 90, 60, '#111', { lw: 3 }); rect(X.mimis - 145, 475, 80, 50, '#3a2a10', { lw: 0 }); ctx.restore(); }
  vignette(.35);
}
return {
  id: 'scene05', title: '5 · Το γύρισμα', steps, render,
  events: M => [[M.cut.a + .1, SFX.clack], [M.ribbon.a + .6, SFX.applause], [M.gov.b, SFX.applause], [M.ring.a, SFX.phone]],
  ambience: () => ({ hum: .015 }),
};
})());
