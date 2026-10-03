/* Ep.4, Scene 9 – «Τα λεφτά»: a montage, Γιάννος looking for money. The bank (a guarantor? a fig tree). The ΕΣΠΑ
   consultants (forty documents, two years, minus 20%). The rejection e-mail: no business code for a superhero. Then
   Μίμης's edit suite, at night: one frame of a table that doesn't add up (plant for Ep. 5). Γιάννος at the door: «Έχω
   τρακόσια. Κι ένα κουπόνι για σουβλάκια.» */
defineScene((() => {
const CAMS = { bank: [640, 400, 1.05], banker: [640, 330, 2.2], gb: [420, 360, 1.9], espa: [640, 400, 1.05], cons: [640, 360, 2.1], ge: [200, 380, 2],
  mail: [0, 0, 1], edit: [640, 400, 1.1], mon: [640, 300, 2.1], mim: [560, 380, 2], door: [1000, 380, 2] };
const steps = [
  { act: 'bank', d: 1.6, cam: 'bank' },
  { who: 'trapezitis', cam: 'banker', el: 'Δάνειο για…;', en: 'A loan for…?' },
  { who: 'giannos', cam: 'gb', el: 'Εξοπλισμό.', en: 'Equipment.' },
  { who: 'trapezitis', cam: 'banker', el: 'Εγγυητής;', en: 'A guarantor?' },
  { who: 'giannos', cam: 'gb', el: '…Ο πατέρας μου;', en: '…My father?' },
  { who: 'trapezitis', cam: 'banker', el: 'Έχει ακίνητο;', en: 'Does he own property?' },
  { who: 'giannos', cam: 'gb', mark: 'fig', el: 'Έχει μια συκιά.', en: 'He has a fig tree.' },
  { who: 'trapezitis', cam: 'banker', mark: 'young', el: 'Λυπάμαι. Δεν δανείζουμε σε νέους. Μόνο σε όσους δεν το χρειάζονται.', en: "I'm sorry. We don't lend to young people. Only to those who don't need it." },
  { act: 'espa', d: 1.6, cam: 'espa' },
  { who: 'symvoulos', cam: 'cons', mark: 'docs', el: 'Καταστατικό, φορολογική ενημερότητα, ασφαλιστική ενημερότητα, business plan, μελέτη βιωσιμότητας, και τρεις προσφορές για κάθε βίδα.', en: 'Articles of association, tax clearance, social-security clearance, business plan, feasibility study, and three quotes for every screw.', say: 'Καταστατικό, φορολογική ενημερότητα, ασφαλιστική ενημερότητα, μπίζνες πλαν, μελέτη βιωσιμότητας, και τρεις προσφορές για κάθε βίδα.' },
  { who: 'giannos', cam: 'ge', el: 'Και πότε παίρνω τα λεφτά;', en: 'And when do I get the money?' },
  { who: 'symvoulos', cam: 'cons', mark: 'cut', el: 'Σε δύο χρόνια. Μείον το είκοσι τοις εκατό μου.', en: 'In two years. Minus my twenty percent.' },
  { act: 'mail', d: 1.2, cam: 'mail' },
  { who: 'giannos', cam: 'mail', mark: 'kad', el: '«Η αίτησή σας απορρίπτεται. Δεν υπάρχει ΚΑΔ για υπερήρωα.»', en: '"Your application is rejected. There is no business code for a superhero."', say: 'Η αίτησή σας απορρίπτεται. Δεν υπάρχει Κ.Α.Δ. για υπερήρωα.' },
  { act: 'edit', d: 2, cam: 'edit' },
  { act: 'frame', d: 1.4, cam: 'mon' },
  { who: 'mimis', cam: 'mim', mark: 'numbers', el: '…Αυτά δεν βγαίνουν.', en: "…These don't add up." },
  { who: 'giannos', label: ['ΓΙΑΝΝΟΣ (στην πόρτα)', 'GIANNOS (at the door)'], cam: 'door', mark: 'want', el: 'Μίμη. Θέλω λεφτά.', en: 'Mimis. I need money.' },
  { who: 'mimis', cam: 'mim', el: 'Πόσα;', en: 'How much?' },
  { who: 'giannos', cam: 'door', el: 'Σαράντα τρία χιλιάρικα.', en: 'Forty-three grand.' },
  { who: 'mimis', cam: 'mim', mark: 'three', el: 'Έχω τρακόσια. Κι ένα κουπόνι για σουβλάκια.', en: 'I have three hundred. And a coupon for souvlaki.' },
  { act: 'end', d: 1.4, cam: 'edit' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'mail') { emailCard(t); return; }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  if (t < M.espa.a) {
    bankHall(t);
    stand(640, 'trapezitis', 1, { t, talk: talk('trapezitis', t), look: [-.4, .2], brow: 'flat', mouth: inM(t, M.young) ? 'smile' : 'flat', R: [40, -40], L: [-40, -40] });
    bankCounter(t);
    stand(330, 'giannos', 1, { t, talk: talk('giannos', t), look: [.6, -.1], brow: inM(t, M.fig, 0, 99) ? 'worry' : 'up', mouth: 'flat', R: gesture(t, talk('giannos', t), [44, -40]), L: [-40, -30] });
  } else if (t < M.mail.a) {
    espaOffice(t);
    stand(640, 'symvoulos', 1, { t, talk: talk('symvoulos', t), dir: -1, look: [-.4, .1], brow: 'up', mouth: 'smile', R: gesture(t, talk('symvoulos', t), [44, -40]), L: [-40, -40] });
    espaDesk(t, inM(t, M.docs) ? prog(t, M.docs.a, M.docs.b) : 1);
    stand(170, 'giannos', 1, { t, talk: talk('giannos', t), look: [.7, -.1], brow: 'worry', mouth: inM(t, M.cut) ? 'o' : 'flat', R: [44, -40], L: [-40, -30] });
  } else {
    editSuite(t, { table: inM(t, M.frame, .2, -.3) });
    person(560, SEAT + 30, 1, CAST.mimis, { t, talk: talk('mimis', t), legs: 'seat', look: t > M.want.a && t < M.three.a ? [.8, 0] : [.4, -.4], brow: inM(t, M.numbers) ? 'down' : 'flat', mouth: 'flat',
      R: [80, -70], L: [-30, -70], itemL: t > M.three.a ? 'phone' : null });
    if (t > M.want.a - .5) { doorway(1060, 690, 150, 320, '#3a3640', 1); stand(1000, 'giannos', .95, { t, talk: talk('giannos', t), dir: -1, look: [-.8, .1], brow: 'worry', mouth: 'flat', R: [40, -40], L: [-40, -30] }); }
  }
  ctx.restore();
  if (t > M.mail.b) applyLight('night', .4);
  vignette(.35);
}
return {
  id: 'scene09', title: '9 · Τα λεφτά', steps, render,
  events: M => [[M.bank.a + .2, SFX.ding], [M.young.b, () => tone(150, .6, 'sine', .04, .8)], [M.espa.a + .2, SFX.thud], [M.mail.a + .1, SFX.ding], [M.kad.b, () => tone(140, .8, 'sine', .04, .7)],
    [M.frame.a + .2, () => tone(900, .1, 'square', .02, 1)], [M.frame.a + .9, () => tone(900, .1, 'square', .02, 1)]],
  ambience: () => ({ hum: .015 }),
};
})());
