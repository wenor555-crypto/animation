/* Ep.3, Scene 23 – «Βήμα 7: Δίκτυο»: the Jumbo board room. Γιώργος in a jacket, the νέος with a laptop, Χαμάντ in shades, the IQOS PRIME
   in his pocket with a red LED. The chairman asks what they want; the νέος reads the answers from an «Offshore Holdings» email and
   Γιώργος repeats them. Containers from China, «ανταλλακτικά για διαστημικές σίτες». He haggles the wrong way: 30 → «Δέκα» → 40 → «Κλείσαμε». */
defineScene((() => {
const X = { neos: 170, hamad: 350, giorgos: 530, proedros: 770, board2: 950, board1: 1120 };
const CAMS = { step: [0, 0, 1], wide: [640, 400, .95], pro: [X.proedros, 400, 2], gio: [X.giorgos, 400, 2], ham: [X.hamad, 400, 2], neo: [(X.neos + X.giorgos) / 2 + 40, 420, 1.7],
  two: [(X.giorgos + X.proedros) / 2, 410, 1.5], lap: [0, 0, 1], pocket: [X.hamad + 10, SEAT - 90, 4.2] };
const NW = ['ΝΕΟΣ (ψιθυριστά)', 'NEOS (whispering)'];
const steps = [
  { act: 'step', d: 2.6, cam: 'step' },
  { act: 'wide', d: 2.4, cam: 'wide' },
  { who: 'proedros', cam: 'pro', mark: 'why', el: 'Κύριε Γιώργο. Γιατί να επενδύσουν τα Jumbo σε μια εταιρεία που φτιάχνει σίτες;', en: 'Mr Giorgos. Why should Jumbo invest in a company that makes screen doors?' },
  { who: 'giorgos', cam: 'gio', el: 'Γιατί εσείς πουλάτε τα πάντα. Κι εμείς… είμαστε τα πάντα.', en: 'Because you sell everything. And we… are everything.' },
  { who: 'proedros', cam: 'pro', mark: 'stock', el: 'Η μετοχή σας ανέβηκε τετρακόσια τοις εκατό. Από πού;', en: 'Your share price went up four hundred percent. From what?' },
  { who: 'giorgos', cam: 'gio', el: 'Από το όραμα.', en: 'From the vision.' },
  { who: 'hamad', cam: 'ham', mark: 'bahamas', el: 'Και από τις Μπαχάμες.', en: 'And from the Bahamas.' },
  { who: 'giorgos', cam: 'gio', mark: 'mostly', el: '…Κυρίως από το όραμα.', en: '…Mostly from the vision.', gap: .5 },
  { who: 'proedros', cam: 'pro', mark: 'want', el: 'Και τι θέλετε από εμάς;', en: 'And what do you want from us?' },
  { act: 'look', d: 2.8, cam: 'lap' },
  { who: 'neos', label: NW, tag: '[whispers] ', cam: 'neo', mark: 'w1', el: 'Το δίκτυό σας. Κοντέινερ από την Κίνα. Κάθε μέρα.', en: 'Your network. Containers from China. Every day.' },
  { who: 'giorgos', cam: 'gio', mark: 'rep1', el: 'Το δίκτυό σας. Κοντέινερ από την Κίνα. Κάθε μέρα.', en: 'Your network. Containers from China. Every day.' },
  { who: 'proedros', cam: 'pro', el: 'Για να φέρετε τι;', en: 'To bring in what?' },
  { who: 'neos', cam: 'neo', mark: 'parts', el: '…Ανταλλακτικά. Για διαστημικές σίτες.', en: '…Spare parts. For space screen doors.' },
  { who: 'proedros', cam: 'pro', mark: 'space', el: 'Διαστημικές σίτες.', en: 'Space screen doors.', gap: .6 },
  { who: 'giorgos', cam: 'gio', el: 'Το επόμενο μεγάλο πράγμα μετά τα air fryer.', en: 'The next big thing after air fryers.' },
  { who: 'proedros', cam: 'pro', mark: 'stake', el: 'Σε αντάλλαγμα, θέλουμε μερίδιο στη ΣίταAI. Τριάντα τοις εκατό.', en: 'In return, we want a stake in SitaAI. Thirty percent.' },
  { who: 'giorgos', cam: 'two', mark: 'ten', el: 'Δέκα.', en: 'Ten.' },
  { who: 'proedros', cam: 'two', mark: 'forty', el: 'Σαράντα.', en: 'Forty.' },
  { who: 'giorgos', cam: 'two', mark: 'deal', el: 'Κλείσαμε.', en: 'Deal.' },
  { who: 'neos', cam: 'neo', mark: 'up', el: 'Κύριε Γιώργο… αυτό ανέβηκε.', en: 'Mr Giorgos… that went up.' },
  { who: 'giorgos', cam: 'gio', mark: 'numbers', el: 'Οι αριθμοί είναι για όσους δεν έχουν όραμα.', en: 'Numbers are for people without vision.' },
  { act: 'shake', d: 2.2, cam: 'two' },
  { who: 'prime', cam: 'pocket', mark: 'report', el: 'Πράκτορας Χρυσό Φίλτρο. Η συμφωνία έκλεισε. Τα Jumbo πήραν σαράντα. Ο Γιώργος κράτησε εννιά.', en: 'Agent Golden Filter. The deal is done. Jumbo took forty. Giorgos kept nine.' },
  { act: 'end', d: 1.2, cam: 'wide' },
];
let M;
function officeChair(x) { rect(x - 58, SEAT - 190, 116, 150, '#1a1a1e', { lw: 4 }); limb([[x, SEAT + 10], [x, GROUND - 20]], 8, '#333'); for (const d of [-1, 1]) limb([[x, GROUND - 20], [x + d * 50, GROUND]], 6, '#333'); }
function lapScreen(t) {
  const k = prog(t, M.look.a + .1, M.look.b - .2);
  laptopScreen([['Από: Offshore Holdings (Μπαχάμες)', '#9aa7bd'], ['Θέμα: Τι να πείτε στα Jumbo', '#ffd23f'], ['', null],
    ['1. «Το δίκτυό σας. Κοντέινερ από την Κίνα. Κάθε μέρα.»', '#d8e2f0'], ['2. Αν ρωτήσουν «για τι»: ανταλλακτικά για διαστημικές σίτες.', '#d8e2f0'], ['3. Ό,τι ποσοστό ζητήσουν: ΝΑΙ.', '#ff8080']],
    k, { title: 'neos@sitaai.gr — Εισερχόμενα', size: 26 });
}
function render(t, _M, sc) {
  M = _M;
  if (t < M.step.b) { stepCard(t, 7, prog(t, M.step.a, M.step.b)); return; }
  const [, shot] = shotAt(sc, t);
  if (shot === 'lap') { lapScreen(t); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  boardroom(t);
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const shaking = t > M.shake.a + .3 && t < M.report.a;
  const S = {
    neos: ['neosSuit', { look: inM(t, M.look, 0, 99) && t < M.parts.b ? [.2, .8] : la('neos', [1, 0]), brow: inM(t, M.up) ? 'worry' : 'up', mouth: 'flat', L: [-10, -30], R: [40, -30] }],
    hamad: ['hamad', { look: la('hamad', [1, 0]), brow: 'up', mouth: 'smile', L: [-44, -30], R: [44, -30] }],
    giorgos: ['giorgosJacket', { look: la('giorgos', [1, 0]), brow: 'up', mouth: inM(t, M.up, 0, 99) ? 'smirk' : 'smile', L: [-44, -30], R: shaking ? [118, -60] : gesture(t, talk('giorgos', t), [44, -30]) }],
    proedros: ['proedros', { look: la('proedros', [-1, 0]), brow: inM(t, M.space) ? 'up' : 'flat', mouth: inM(t, M.deal, 0, 99) ? 'smile' : 'flat', L: shaking ? [-118, -60] : [-44, -30], R: [44, -30] }],
    board2: ['board2', { look: la('board2', [-1, 0]), brow: inM(t, M.ten) ? 'up' : 'flat', mouth: 'flat', L: [-44, -30], R: [44, -30] }],
    board1: ['board1', { look: la('board1', [-1, 0]), lid: true, mouth: 'flat', L: [-44, -30], R: [44, -30] }],
  };
  for (const k in S) officeChair(X[k]);
  for (const k in S) person(X[k], SEAT, 1, CAST[S[k][0]], { t, talk: talk(k === 'proedros' ? 'proedros' : k, t), ...S[k][1], part: 'legs', legs: 'seat' });
  for (const k in S) person(X[k], SEAT, 1, CAST[S[k][0]], { t, talk: talk(k, t), ...S[k][1], part: 'body' });
  agal(X.hamad, SEAT, 1);
  tie(X.neos, SEAT, 1); tie(X.proedros, SEAT, 1, '#1f5fb8'); tie(X.board1, SEAT, 1, '#ffd23f');
  // the PRIME in Χαμάντ's breast pocket, red LED
  iqosPrime(X.hamad + 22, SEAT - 92, .42, t, { red: true, screen: '', talk: talk('prime', t) });
  boardTable();
  laptop(X.neos + 20, 528, .9, '#1d2a36', 1);
  for (const k in S) person(X[k], SEAT, 1, CAST[S[k][0]], { t, talk: talk(k, t), ...S[k][1], part: 'arms' });
  ctx.restore();
  ctx.save(); applyCam(c); glow(X.hamad + 22, SEAT - 116, shot === 'pocket' ? 20 : 12, 'rgba(255,40,40,1)', .7); ctx.restore();
  if (inM(t, M.forty, .1)) sfxText('40%', X.proedros, 250, 60, -.1, '#ffd23f');
  if (inM(t, M.ten, .1)) sfxText('10%', X.giorgos, 250, 60, .1, '#fff');
  if (inM(t, M.shake, .3)) sfxText('ΚΛΑΠ', 650, 380, 44, -.1, '#fff');
  vignette(.3);
}
return {
  id: 'scene23', title: '23 · Βήμα 7: Δίκτυο', steps, render,
  events: M => [[M.step.a + .1, SFX.boom], [M.step.a + .6, SFX.pop], [M.look.a + .2, SFX.ding], [M.deal.b, SFX.slam], [M.shake.a + .3, SFX.slap], [M.shake.a + .5, SFX.applause], [M.report.a - .3, () => tone(1400, .2, 'square', .03)]],
  ambience: () => ({ hum: .02 }),
};
})());
