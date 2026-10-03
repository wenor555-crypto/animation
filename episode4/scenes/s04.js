/* Ep.4, Scene 4 – «Κλαιν μαιν»: the καφενείο. Γιάννος lays printed photos of the drone on the table. Μίμης, Χρήστος, Γιώργος,
   freddos. «Κλαιν μαιν», «μη μας πρήζεις», «η μετοχή είναι στα ύψη». Χρήστος doesn't draw any more. Γιώργος leaves for a
   shoot and takes Μίμης (he pays). Γιάννος stays alone with the photos; in the last frame the drone is over the καφενείο. */
defineScene((() => {
const X = { christos: 420, mimis: 620, giorgos: 820, giannos: 1060 };
const CAMS = { wide: [700, 420, 1.1], gia: [X.giannos - 40, 380, 2], mim: [X.mimis, 420, 2.1], chr: [X.christos, 420, 2.1], gio: [X.giorgos, 420, 2.1],
  photos: [700, 560, 2.6], two: [940, 420, 1.6], up: [800, 260, 1.1] };
const steps = [
  { act: 'open', d: 2.2, cam: 'wide' },
  { who: 'giannos', cam: 'gia', mark: 'drone', el: 'Μαλάκα, εδώ και τρεις μέρες είναι ένα drone πάνω από το σπίτι του Κώστα…', en: "Dude, for three days now there's been a drone over Kostas's house…" },
  { act: 'show', d: 1.4, cam: 'photos' },
  { who: 'mimis', cam: 'mim', el: 'Και;', en: 'So?' },
  { who: 'giannos', cam: 'gia', mark: 'agent', el: 'Και τα μηνύματα που παίρνει έχουν την υπογραφή του agent μου. Ζει. Είναι εκεί πάνω. Και μας κοιτάει.', en: "And the messages he gets carry my agent's signature. She's alive. She's up there. And she's watching us.", say: 'Και τα μηνύματα που παίρνει έχουν την υπογραφή του έιτζεντ μου. Ζει. Είναι εκεί πάνω. Και μας κοιτάει.' },
  { who: 'giorgos', cam: 'gio', mark: 'stock', el: 'Γιάννο, η μετοχή είναι στα ύψη. Αν μας κοίταζε κάτι κακό, θα έπεφτε.', en: 'Giannos, the stock is sky-high. If something evil were watching us, it would drop.' },
  { who: 'mimis', cam: 'mim', mark: 'klain', el: 'Κλαιν μαιν. Θα βρούμε λύση.', en: "Chill, man. We'll find a solution." },
  { who: 'giannos', cam: 'gia', el: 'Ποια λύση;', en: 'What solution?' },
  { who: 'mimis', cam: 'mim', el: 'Αυτή που θα βρούμε.', en: "The one we'll find." },
  { who: 'giannos', cam: 'two', el: 'Χρήστο. Εσύ τα ζωγράφισες όλα. Πες τους.', en: 'Christos. You drew all of it. Tell them.' },
  { who: 'christos', cam: 'chr', mark: 'nodraw', el: 'Δεν ζωγραφίζω πια.', en: "I don't draw any more." },
  { who: 'giannos', cam: 'gia', el: 'Από πότε;', en: 'Since when?' },
  { who: 'christos', cam: 'chr', el: 'Από τότε που ζωγράφισα ότι δεν τελειώσαμε μαζί της.', en: "Since I drew that we weren't done with her." },
  { who: 'christos', cam: 'chr', mark: 'sensei', el: 'Ο σενσέι είπε «ζωγράφιζε προσεκτικά». Πιο προσεκτικά από το καθόλου δεν γίνεται.', en: 'Sensei said "draw carefully". You can\'t get more careful than not at all.' },
  { who: 'giannos', cam: 'two', el: 'Ρε παιδιά, σοβαρά. Αν ξανάρθει, δεν θα είναι σαν την άλλη φορά.', en: "Guys, seriously. If she comes back, it won't be like last time." },
  { who: 'mimis', cam: 'mim', el: 'Γιάννο. Μη μας πρήζεις τα αρχίδια. Πίνουμε καφέ.', en: "Giannos. Stop busting our balls. We're having coffee." },
  { who: 'giorgos', cam: 'gio', mark: 'shoot', el: 'Εγώ φεύγω, έχω γύρισμα. Μίμη, έλα, είσαι ο σκηνοθέτης.', en: "I'm off, I've got a shoot. Mimis, come on, you're the director." },
  { who: 'mimis', cam: 'wide', mark: 'pays', el: 'Έρχομαι. Πληρώνει.', en: "Coming. He's paying." },
  { act: 'leave', d: 2.4, cam: 'wide' },
  { act: 'alone', d: 2.2, cam: 'gia' },
  { act: 'up', d: 2.4, cam: 'up' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  kafeneio(t, {});
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const gioUp = t > M.shoot.b, mimUp = t > M.pays.b, lk = prog(t, M.leave.a, M.leave.b);
  const seated = [[X.christos, 'christos', { t, talk: talk('christos', t), look: inM(t, M.nodraw, 0, 99) ? [-.2, .6] : la('christos', [.3, .2]), brow: inM(t, M.sensei) ? 'worry' : 'flat', mouth: 'flat', L: [-44, -40], R: [44, -40] }]];
  if (!mimUp) seated.push([X.mimis, 'mimis', { t, talk: talk('mimis', t), look: la('mimis', [.6, .1]), brow: 'flat', mouth: inM(t, M.klain) ? 'smirk' : 'flat', R: gesture(t, talk('mimis', t), [44, -40]), L: [-44, -40] }]);
  if (!gioUp) seated.push([X.giorgos, 'giorgos', { t, talk: talk('giorgos', t), look: la('giorgos', [.6, .1]), brow: 'up', mouth: inM(t, M.stock) ? 'smile' : 'flat', R: gesture(t, talk('giorgos', t), [44, -40]), L: [-44, -40] }]);
  tableOf(t, seated, { cups: [430, 610, 830] });
  // the photos on the table
  if (t > M.show.a) for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(620 + i * 70, 548); ctx.rotate((i - 1.5) * .15); rect(-30, -20, 60, 40, '#f4f4f0', { lw: 2 }); rect(-25, -16, 50, 30, '#5a8ac8', { lw: 0 }); droneCam(0, -2, 0, { s: .5 }); ctx.restore(); }
  if (gioUp) { const x = lerp(X.giorgos, -200, ease(prog(t, M.pays.a, M.leave.b))); stand(x, 'giorgos', 1, { t, legs: x > X.giorgos - 5 ? 'stand' : 'walk', look: [-1, 0], dir: -1, talk: talk('giorgos', t), mouth: 'smile', R: [44, -40] }); }
  if (mimUp) { const x = lerp(X.mimis, -200, ease(lk)); stand(x, 'mimis', 1, { t, legs: lk > 0 && lk < 1 ? 'walk' : 'stand', look: [-1, 0], dir: -1, talk: talk('mimis', t), mouth: 'flat' }); }
  const alone = t > M.leave.b;
  stand(X.giannos, 'giannos', 1, { t, talk: talk('giannos', t), dir: -1, look: alone ? [.1, .7] : la('giannos', [-.6, .1]), brow: alone ? 'worry' : 'up', mouth: alone ? 'flat' : 'o',
    R: t < M.show.b ? [70, -60] : gesture(t, talk('giannos', t), [44, -40]), itemR: t < M.show.a ? 'photos' : null, L: [-40, -30] });
  if (t > M.up.a) droneCam(820 + Math.sin(t) * 14, 90, t, { s: 1.6 });
  ctx.restore();
  if (t > M.up.a) { ctx.save(); applyCam(c); glow(820 + Math.sin(t) * 14, 102, 40, 'rgba(255,40,40,1)', .6); ctx.restore(); }
  vignette(alone ? .4 : .3);
}
return {
  id: 'scene04', title: '4 · Κλαιν μαιν', steps, render,
  events: M => [[M.show.a + .1, SFX.slap], [M.shoot.b, SFX.creak], [M.leave.b, () => tone(220, 1.6, 'sine', .03, .8)], [M.up.a + .3, () => SND2.sfx('drone_swarm', .2, { rate: 1.5 })]],
  ambience: () => ({ cicada: .01 }),
};
})());
