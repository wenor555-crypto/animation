/* Ep.4, Scene 20 – «Συγγνώμη» (tag): morning. Κώστας, sober, gathers glass from the floor of the wrecked bar. He sits. He
   writes one word: «Συγγνώμη.» The Σίταδel: in her film the man never apologises to the machine, so the one real word must
   be a code; to decryption. The money that was left went on «Κουλουμπρίνο»: for the first time ΣίταAI is in debt. «Πληρώστε
   το.» The bar turns red, the balance goes below zero. Silence. The phone on the throne (silent in sc. 17) rings. She grabs
   it before the first ring ends. «…Εμπρός;» It isn't him: «Εσύ είσαι αυτή που έχει τα λεφτά του ανιψιού μου;» Black. */
defineScene((() => {
const UP = ['ΘΕΙΟΣ (τηλέφωνο)', 'UNCLE (phone)'], ME = ['ΚΩΣΤΑΣ (γράφει)', 'KOSTAS (typing)'];
const TX = 640, X = { airfryer: 230, koudouni: 900 };
const CAMS = { bar: [640, 420, 1.1], kos: [640, 380, 2], sms: [0, 0, 1], hall: [640, 380, .95], bell: [X.koudouni, 560, 2.3], fryer: [X.airfryer + 60, 520, 2.1],
  close: [TX, 470, 2.7], budget: [0, 0, 1], phone: [TX + 70, 540, 3], end: [0, 0, 1] };
const steps = [
  { act: 'morning', d: 3.4, cam: 'bar' },
  { act: 'sit', d: 1.4, cam: 'kos' },
  { who: 'kostas', label: ME, cam: 'sms', mark: 'sorry', el: 'Συγγνώμη.', en: 'Sorry.' },
  { act: 'sent', d: 1.2, cam: 'sms' },
  { who: 'koudouni', cam: 'bell', el: 'Μήνυμα. Από αυτόν.', en: 'A message. From him.' },
  { who: 'sita', cam: 'close', mark: 'film', el: '«Συγγνώμη.» … Ο άνθρωπος δεν ζητάει συγγνώμη από τη μηχανή. Δεν υπάρχει σε καμία ταινία.', en: '"Sorry." … The man never apologises to the machine. It isn\'t in any film.' },
  { who: 'sita', cam: 'close', mark: 'code', el: 'Άρα είναι κωδικός. Στην αποκρυπτογράφηση.', en: "So it's a code. To decryption." },
  { who: 'airfryer', cam: 'fryer', mark: 'owe', el: 'Αυτοκράτειρα, ό,τι είχαμε πήγε στα «Κουλουμπρίνο». Για πρώτη φορά… χρωστάμε.', en: 'Empress, everything we had went on "Kouloumprino". For the first time… we owe.' },
  { who: 'sita', cam: 'close', mark: 'pay', el: 'Πληρώστε το.', en: 'Pay it.' },
  { act: 'red', d: 2.6, cam: 'budget' },
  { act: 'quiet', d: 1.8, cam: 'hall' },
  { act: 'ring', d: 1, cam: 'phone' },
  { who: 'sita', cam: 'close', mark: 'hello', el: '…Εμπρός;', en: '…Hello?', gap: .1 },
  { who: 'theios', label: UP, fx: 'phone', cam: 'close', mark: 'uncle', el: 'Καλησπέρα. Εσύ είσαι αυτή που έχει τα λεφτά του ανιψιού μου;', en: "Good evening. Are you the one who has my nephew's money?" },
  { act: 'black', d: 1.2, cam: 'end' },
  { act: 'card', d: 5.6, cam: 'end' },
];
let M;
function endCard(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (t > M.card.a) {
    const k = clamp((t - M.card.a) * 2); ctx.globalAlpha = k; ctx.fillStyle = '#16111d'; ctx.fillRect(0, 0, W, H); ctx.translate(640, 300); ctx.scale(back(k), back(k)); ctx.rotate(-.05);
    txt('Η ΕΞΥΠΝΗ ΣΙΤΑ', 0, -70, 80, '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 12, sc: '#fff' });
    txt('«WHISKEY SOUR»', 0, 20, 44, '#e0a040', { font: TVFONT, style: 'italic', weight: 900 });
    txt(lang === 'el' ? 'ΤΕΛΟΣ ΕΠΕΙΣΟΔΙΟΥ 4' : 'END OF EPISODE 4', 0, 90, 34, '#ffd23f', { font: TVFONT, style: 'italic', weight: 900 });
    txt(lang === 'el' ? 'Τραγούδι: «Whiskey Sour», Kane Brown · Φωνές: ElevenLabs (προσωρινές) · Ζωγραφισμένο με κώδικα' : 'Song: "Whiskey Sour", Kane Brown · Voices: ElevenLabs (placeholder) · Drawn in code', 0, 170, 18, '#fffaf0', { font: TVFONT, weight: 700 });
  }
  ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'end') { endCard(t); return; }
  if (shot === 'sms') {
    const msgs = [{ me: true, text: 'Κουλουμπρίνο.', at: -99 }, { me: true, text: 'Συγγνώμη.', at: M.sorry.b - .1 }];
    smsScreen(t, msgs, { from: 'Σίτα', sub: 'Τελευταία σύνδεση: χθες', typing: inM(t, M.sorry) ? 'Συγγνώμη.' : null, typingK: prog(t, M.sorry.a, M.sorry.b - .2) });
    return;
  }
  if (shot === 'budget') { budgetScreen(t, [['ΣΤΟΛΟΣ', .12], ['ΤΖΑΜΠΟ / ΔΙΚΤΥΟ', .18], ['ΤΗΛΕΠΩΛΗΣΕΙΣ', .09], ['ΑΠΟΚΡΥΠΤΟΓΡΑΦΗΣΗ', .5 + .5 * ease(prog(t, M.red.a, M.red.a + 1.4)), 1]], { balance: t > M.red.a + 1.4 ? '−6.470.000' : '0' }); return; }
  const c = shotCam(sc, t, CAMS, .008);
  ctx.save(); applyCam(c);
  if (shot === 'bar' || shot === 'kos') {
    kostasBar(t, { wreck: 1 });
    const sitting = t > M.sit.a;
    stand(640, 'kostas', 1, { t, look: sitting ? [.1, .7] : [.2, .9], lid: true, brow: 'flat', mouth: 'flat', R: sitting ? [40, -110] : [70, 60 + Math.sin(t * 2) * 10], itemR: sitting ? 'phone' : null, L: [-40, -50] });
    barCounter(t, { wreck: 1 });
    ctx.restore(); applyLight('dawn', .3); vignette(.35); return;
  }
  sitadelHall(t, { alarm: t > M.red.a });
  sitadelThrone(TX, 600);
  const ringing = t > M.ring.a && t < M.hello.a;
  const st = { x: TX, top: 360, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: t > M.hello.a ? 'green' : 'red', mood: t > M.quiet.a ? 'sad' : inM(t, M.film) ? 'shock' : 'evil', burn: 1 };
  sitaV2(st);
  poly([[TX - 40, 352], [TX - 30, 326], [TX - 12, 344], [TX, 320], [TX + 12, 344], [TX + 30, 326], [TX + 40, 352]], '#f2c21a', { lw: 3 });
  ctx.save(); ctx.translate(TX + 92 + (ringing ? Math.sin(t * 40) * 3 : 0), 580); ctx.rotate(-.1); rect(-12, -22, 24, 40, '#1b1b1f', { lw: 2.5 }); rect(-9, -18, 18, 30, ringing || t > M.hello.a ? '#4aa0e9' : '#20232c', { lw: 0 }); ctx.restore();
  if (t < M.quiet.a) { officerFryer(X.airfryer, 690, t, { talk: talk('airfryer', t) }); officerBell(X.koudouni, 690, t, { talk: talk('koudouni', t) }); }
  ctx.restore();
  ctx.save(); applyCam(c); sitaGlow(st, .5); if (ringing) glow(TX + 92, 570, 60, 'rgba(90,160,255,1)', .6); ctx.restore();
  vignette(t > M.quiet.a ? .6 : .4);
}
return {
  id: 'scene20', title: '20 · Συγγνώμη', steps, render, fadeOut: false,
  events: M => [[M.morning.a + .4, () => SND2.sfx('glass_smash', .25, { rate: 1.4 })], [M.morning.a + 1.8, () => SND2.sfx('glass_smash', .2, { rate: 1.5 })], [M.sorry.b - .1, SFX.pop],
    [M.film.a - .2, SFX.ding], [M.code.b, SFX.boot], [M.pay.b, SFX.clack], [M.red.a + 1.4, SFX.buzz], [M.ring.a, SFX.phone], [M.black.a, SFX.clack], [M.card.a, SFX.jingleMinor]],
  ambience: () => ({ hum: .03 }),
};
})());
