/* Ep.4, Scene 18 – «Ρωγμές»: the καφενείο. A queue at the pyramid's table; the new guy with his folder. Κυρα-Τούλα wants her
   money (her daughter's wedding): «Τα λεφτά; Ή εσύ τον κόσμο;» (the first clear sign of public anger). Χαμάντ on the phone,
   aside: his uncle stops the money: «Στο Κατάρ… πάμε επίσκεψη.» Γιώργος, very calm, with his freddo: a trip to Αγιονόρι for
   παϊδάκια. (plant 3) */
defineScene((() => {
const UP = ['ΘΕΙΟΣ (τηλέφωνο)', 'UNCLE (phone)'];
const X = { neos: 520, toula: 760, hamad: 1100, giorgos: 300 };
const CAMS = { wide: [700, 420, 1.05], queue: [700, 420, 1.4], toula: [X.toula, 400, 2.2], neos: [X.neos, 420, 2.2], ham: [X.hamad, 380, 2.1], gio: [X.giorgos, 420, 2.2], two: [800, 410, 1.5] };
const steps = [
  { act: 'queue', d: 2.4, cam: 'wide' },
  { who: 'toula', cam: 'toula', mark: 'money', el: 'Γιώργο! Θέλω τα λεφτά μου. Παντρεύω την κόρη μου!', en: "Giorgos! I want my money. I'm marrying off my daughter!" },
  { who: 'neos', cam: 'neos', el: 'Κυρία Τούλα, τα λεφτά σας δουλεύουν.', en: 'Mrs Toula, your money is working.' },
  { who: 'toula', cam: 'toula', mark: 'work', el: 'Τα λεφτά; Ή εσύ τον κόσμο;', en: 'The money? Or you, the people?' },
  { act: 'aside', d: 1.4, cam: 'ham' },
  { who: 'theios', label: UP, fx: 'phone', cam: 'ham', mark: 'stop', el: 'Χαμάντ. Από σήμερα, τα λεφτά σταματάνε.', en: 'Hamad. From today, the money stops.', say: 'Χαμάντ… Από σήμερα, τα λεφτά σταματάνε.' },
  { who: 'hamad', cam: 'ham', el: 'Θείε, είναι κίνημα!', en: "Uncle, it's a movement!" },
  { who: 'theios', label: UP, fx: 'phone', cam: 'ham', mark: 'visit', el: 'Στο Κατάρ, όταν χάνουμε λεφτά, δεν πάμε στα δικαστήρια. Πάμε… επίσκεψη.', en: "In Qatar, when we lose money, we don't go to court. We pay… a visit." },
  { who: 'hamad', cam: 'two', mark: 'men', el: 'Γιώργο, habibi… ο θείος μου θα στείλει ανθρώπους.', en: 'Giorgos, habibi… my uncle will send people.', say: 'Γιώργο, χαμπίμπι… ο θείος μου θα στείλει ανθρώπους.' },
  { who: 'giorgos', cam: 'gio', mark: 'calm', el: 'Ωραία. Να τους πάμε για Αγιονόρι, για παϊδάκια!', en: "Great. Let's take them to Agionori, for lamb chops!" },
  { act: 'end', d: 1.6, cam: 'wide' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  kafeneio(t, {});
  // the pyramid's table with its banner, and the queue behind Τούλα
  rect(420, 470, 220, 14, '#f4f1ea', { lw: 3 }); limb([[440, 484], [440, 690]], 5, '#c8c0b0'); limb([[620, 484], [620, 690]], 5, '#c8c0b0');
  rect(430, 400, 200, 40, '#f2c21a', { lw: 3 }); txt('ΣΙΤΑ ΕΪ ΑΪ · GOLD', 530, 420, 15, '#2a1e10', { font: TVFONT, weight: 900 });
  for (let i = 0; i < 4; i++) stand(880 + i * 70, i % 2 ? 'geros1' : 'geros2', .85, { t, dir: -1, look: [-.8, 0], brow: 'worry', mouth: 'flat', R: [40, -30], L: [-40, -30] });
  // Γιώργος at his usual table, freddo, untroubled
  tableOf(t, [[X.giorgos, 'giorgos', { t, talk: talk('giorgos', t), look: inM(t, M.calm) ? [.6, -.1] : [.4, .4], brow: 'up', mouth: 'smile', R: [48, -120], itemR: 'cup2', L: [-44, -40] }]], { cups: [] });
  stand(X.neos, 'neosSuit', .95, { t, talk: talk('neos', t), look: [.8, 0], brow: 'worry', mouth: 'smile', R: [60, -60], L: [-40, -30], itemL: 'bag' });
  stand(X.toula, 'toula', .9, { t, talk: talk('toula', t), dir: -1, look: [-.8, 0], brow: 'down', mouth: talk('toula', t) ? 'o' : 'frown', R: gesture(t, talk('toula', t), [44, -30]), L: [-40, -30] });
  stand(X.hamad, 'hamad', 1, { t, talk: talk('hamad', t), dir: -1, look: t > M.men.a ? [-.9, 0] : [.3, .2], brow: t > M.stop.a ? 'worry' : 'up', mouth: t > M.stop.a ? 'o' : 'smile',
    R: t > M.aside.a && t < M.men.a ? [48, -196] : [44, -30], itemR: t > M.aside.a && t < M.men.a ? 'phone' : null, L: [-40, -30] });
  ctx.restore();
  vignette(.3);
}
return {
  id: 'scene18', title: '18 · Ρωγμές', steps, render,
  events: M => [[M.queue.a + .2, SFX.flies], [M.aside.a + .1, SFX.phone], [M.visit.b, () => tone(110, 1.2, 'sine', .04, .9)], [M.calm.b, SFX.sip]],
  ambience: () => ({ cicada: .012 }),
};
})());
