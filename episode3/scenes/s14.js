/* Ep.3, Scene 14 – «Το σεμινάριο»: the καφενείο, full. Banner: ΠΑΘΗΤΙΚΟ ΕΙΣΟΔΗΜΑ ΜΕ LEVERAGE ΣΤΟ ΟΙΚΟΣΥΣΤΗΜΑ ΤΗΣ ΣΙΤΑΣ.
   Γιώργος at a flipchart; the νέος in a suit and next to him an even newer νέος. Βασίλης: «Έχεις ένα τσιγάρο;»
   Running gag: the λοχίας (callback to Ep. 1) and Χαμάντ from London are already inside. */
defineScene((() => {
const X = { giorgos: 900, neos: 1080, vasilis: 300, lochias: 150, hamad: 480 };
const CAMS = { wide: [640, 400, 1], gio: [900, 360, 2], neo: [1060, 380, 2], vas: [300, 420, 2], loch: [170, 380, 2], ham: [480, 420, 2], stage: [960, 380, 1.5] };
const steps = [
  { act: 'room', d: 2.6, cam: 'wide' },
  { who: 'giorgos', cam: 'gio', el: 'Κύριοι. Η ΣίταAI δεν πουλάει προϊόν. Πουλάει… ευκαιρία.', en: "Gentlemen. SitaAI doesn't sell a product. It sells… opportunity." },
  { who: 'giorgos', cam: 'stage', el: 'Αγοράζετε ένα πακέτο. Φέρνετε δύο φίλους. Και μετά απλώς… περιμένετε.', en: 'You buy a package. You bring two friends. And then you just… wait.' },
  { who: 'neos', cam: 'neo', el: 'Εγώ έφερα αυτόν.', en: 'I brought him.' },
  { who: 'giorgos', cam: 'gio', el: 'Κι αυτός;', en: 'And him?' },
  { who: 'neos', cam: 'neo', mark: 'door', el: 'Έφερε έναν άλλο νέο. Είναι στην πόρτα. Φέρνει κι αυτός έναν.', en: "He brought another new guy. He's at the door. He's bringing one too." },
  { who: 'giorgos', cam: 'stage', el: 'Βλέπετε; Κλιμάκωση.', en: 'See? Scaling.' },
  { who: 'vasilis', cam: 'vas', mark: 'cig', el: 'Έχεις ένα τσιγάρο;', en: 'Got a cigarette?' },
  { who: 'giorgos', cam: 'gio', el: 'Με το πακέτο Gold, κύριε Βασίλη, το τσιγάρο είναι δώρο.', en: 'With the Gold package, Mr Vasilis, the cigarette is free.' },
  { who: 'vasilis', cam: 'vas', mark: 'in', el: '…Μέσα.', en: "…I'm in." },
  { act: 'rise', d: 1.4, cam: 'loch' },
  { who: 'lochias', cam: 'loch', mark: 'guard', el: 'Γιώργο. Εσύ δεν υποτίθεται ότι είσαι σκοπιά;', en: "Giorgos. Aren't you supposed to be on guard duty?" },
  { who: 'giorgos', cam: 'gio', el: 'Κύριε λοχία… είστε μέσα στο Gold. Με δύο αστέρια.', en: "Sergeant… you're in Gold. With two stars." },
  { who: 'lochias', cam: 'loch', el: '…Συνέχισε.', en: '…Carry on.', gap: .7 },
  { who: 'hamad', cam: 'ham', mark: 'habibi', el: 'Γιώργο, habibi. Στο Λονδίνο αυτό το λέγαμε πυραμίδα.', en: 'Giorgos, habibi. In London we called this a pyramid.' },
  { who: 'giorgos', cam: 'gio', el: 'Εδώ το λέμε κίνημα.', en: 'Here we call it a movement.' },
  { who: 'hamad', cam: 'ham', mark: 'how', el: 'Ωραία λέξη. Πόσα βάζω;', en: 'Nice word. How much do I put in?' },
  { act: 'end', d: 1.6, cam: 'wide' },
];
let M;
function flip(t) { rect(700, 300, 150, 190, '#fbfaf6', { lw: 3 }); limb([[710, 490], [690, 690]], 4, '#555'); limb([[840, 490], [860, 690]], 4, '#555');
  for (let r = 0; r < 4; r++) for (let i = 0; i <= r; i++) blob(775 + (i - r / 2) * 26, 330 + r * 36, 8, 8, null, { lw: 2.5, sc: '#1a3a8a' }); txt('€€€', 775, 470, 18, '#2a8a4a', { font: TVFONT, weight: 900 }); }
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  kafeneioInside(t, () => stockChart(t, 1));
  rect(80, 60, 1120, 80, '#e8392b', { lw: 4 }); txt('ΠΑΘΗΤΙΚΟ ΕΙΣΟΔΗΜΑ ΜΕ LEVERAGE ΣΤΟ ΟΙΚΟΣΥΣΤΗΜΑ ΤΗΣ ΣΙΤΑΣ', 640, 100, 26, '#fff', { font: TVFONT, style: 'italic', weight: 900 });
  flip(t);
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  // the audience, seated: old men, Βασίλης, the λοχίας, Χαμάντ in the front row
  const aud = [[X.lochias, 'lochias'], [X.vasilis, 'vasilis'], [X.hamad, 'hamad'], [620, 'geros1']];
  const risen = t > M.rise.a + .5 && t < M.L[11].b + .5;
  for (const [x, who] of aud) if (!(who === 'lochias' && risen)) chair(x);
  for (const [x, who] of aud) {
    if (who === 'lochias' && risen) { stand(x, 'lochias', 1, { t, talk: talk('lochias', t), look: la('lochias', [1, 0]), brow: 'frown', mouth: 'flat', L: [-58, -40], R: [58, -40] }); continue; }
    person(x, SEAT, 1, CAST[who], { t, talk: talk(who, t), legs: 'seat', look: who === 'lochias' || who === 'hamad' || who === 'vasilis' ? la(who, [1, 0]) : [1, 0], lid: who === 'vasilis' || who === 'geros1', mouth: who === 'hamad' ? 'smile' : 'flat', brow: who === 'hamad' ? 'up' : 'flat',
      R: who === 'vasilis' && inM(t, M.cig, -.3, 0) ? [60, -260] : [44, -40], L: [-44, -40] });
    if (who === 'hamad') agal(x, SEAT, 1);
  }
  // Γιώργος (jacket over the uniform) and the νέοι in suits
  const gtk = talk('giorgos', t);
  person(X.giorgos, standY(), 1, CAST.giorgosJacket, { t, talk: gtk, legs: 'stand', look: la('giorgos', [-1, 0]), brow: 'up', mouth: 'smile', R: gesture(t, gtk), L: [-80, -150] });
  stand(X.neos, 'neosSuit', .95, { t, talk: talk('neos', t), look: la('neos', [-1, 0]), brow: 'up', mouth: 'smile', dir: -1, L: [-40, -100], itemL: 'clipboard' }); tie(X.neos, standY(.95), .95);
  stand(X.neos + 120, 'neosSuit', .8, { t: t + 3, look: [-1, 0], brow: 'up', mouth: 'smile', dir: -1 }); tie(X.neos + 120, standY(.8), .8);
  if (t > M.door.a) { doorway(1250, 690, 120, 290, '#f4e8c8', 1); stand(1250, 'neosSuit', .7, { t: t + 5, look: [-1, 0], mouth: 'smile', dir: -1 }); }
  ctx.restore();
  vignette(.3);
}
return {
  id: 'scene14', title: '14 · Το σεμινάριο', steps, render,
  events: M => [[M.room.a + .3, SFX.applause], [M.in.b, SFX.ding], [M.rise.a + .4, SFX.creak], [M.how.b, SFX.jingle]],
  ambience: () => ({ cicada: .008 }),
};
})());
