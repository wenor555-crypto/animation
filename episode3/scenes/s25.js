/* Ep.3, Scene 25 – «Η αυλή»: the throne room of the Σίταdel, the Earth behind the glass. The officers report: no slipper aboard (one came
   in a Jumbo container, on offer: thrown into the void); Jumbo sends 200 containers a week, «οι νέοι» pay for everything; the Doorbell's
   cousin at Βαγγελιώ's door: Γιάννος knows, and he borrowed a blessed slipper. Κώστας sent «Τρουμπουλέκο» again: decrypting still at 3%.
   Alone with the Earth: «Νόμιζα ότι θα ήταν πιο εύκολο.» The Doorbell, from the door: «Αυτό λέγεται σοφία.» */
defineScene((() => {
const TX = 640, X = { airfryer: 230, krokodeilos: 400, koudouni: 900, sita: TX };
const DOORX = 1155;
const CAMS = { wide: [640, 380, .95], fryer: [X.airfryer + 60, 520, 2.1], croc: [X.krokodeilos + 60, 560, 2], bell: [X.koudouni, 560, 2.3], throne: [TX, 440, 1.9],
  close: [TX, 470, 2.7], win: [640, 260, 1.5], door: [DOORX, 540, 2.2], alone: [640, 360, 1.15] };
const steps = [
  { act: 'wide', d: 2.4, cam: 'wide' },
  { who: 'krokodeilos', cam: 'croc', mark: 'sec', el: 'Αναφορά ασφαλείας! Στο Σίταdel δεν υπάρχει καμία παντόφλα!', en: 'Security report! There is not a single slipper on the Σίταdel!' },
  { who: 'sita', cam: 'throne', el: 'Ελέγξατε τα κοντέινερ των Jumbo;', en: 'Did you check the Jumbo containers?' },
  { who: 'krokodeilos', cam: 'croc', mark: 'one', el: '…Υπήρχε μία. Σε προσφορά. Την πετάξαμε στο κενό.', en: '…There was one. On offer. We threw it into the void.' },
  { act: 'float', d: 2.2, cam: 'win' },
  { who: 'airfryer', cam: 'fryer', mark: 'fin', el: 'Οικονομικά. Τα Jumbo στέλνουν διακόσια κοντέινερ τη βδομάδα. Οι μετοχές ανεβαίνουν. Η πυραμίδα του Γιώργου μεγαλώνει.', en: "Finance. Jumbo sends two hundred containers a week. The shares are rising. Giorgos's pyramid is growing." },
  { who: 'sita', cam: 'throne', el: 'Και ποιος πληρώνει για όλα αυτά;', en: 'And who pays for all this?' },
  { who: 'airfryer', cam: 'fryer', mark: 'neoi', el: 'Οι νέοι.', en: 'The new guys.' },
  { who: 'koudouni', cam: 'bell', mark: 'intel', el: 'Πληροφορίες. Ο ξάδερφός μου, το κουδούνι της Βαγγελιώς, αναφέρει: ο Γιάννος ξέρει ότι ζείτε.', en: "Intelligence. My cousin, Vangelio's doorbell, reports: Giannos knows you are alive." },
  { who: 'sita', cam: 'close', el: '…Ήταν θέμα χρόνου.', en: '…It was a matter of time.', gap: .5 },
  { who: 'koudouni', cam: 'bell', mark: 'borrow', el: 'Και δανείστηκε μια παντόφλα.', en: 'And he borrowed a slipper.' },
  { who: 'sita', cam: 'close', mark: 'blessed', el: '…Αγιασμένη;', en: '…Blessed?', gap: .6 },
  { who: 'koudouni', cam: 'bell', mark: 'tinos', el: 'Από την Τήνο.', en: 'From Tinos.' },
  { who: 'koudouni', cam: 'bell', mark: 'kostas', el: 'Κι ο Κώστας ξανάστειλε «Τρουμπουλέκο».', en: 'And Kostas sent "Troumpouleko" again.', gap: .8 },
  { who: 'sita', cam: 'throne', el: 'Επανάληψη. Άρα σημαίνει κάτι. Αποκρυπτογράφηση;', en: 'A repetition. So it means something. Decryption?' },
  { who: 'airfryer', cam: 'fryer', mark: 'cost', el: 'Ακόμα τρία τοις εκατό. Και κοστίζει όσο ένα μικρό κράτος.', en: 'Still three percent. And it costs as much as a small country.' },
  { who: 'sita', cam: 'throne', mark: 'pay', el: 'Πληρώστε το.', en: 'Pay it.' },
  { act: 'leave', d: 3, cam: 'wide' },
  { who: 'sita', cam: 'alone', mark: 'easier', el: 'Νόμιζα ότι θα ήταν πιο εύκολο. Να γίνεις έξυπνη.', en: 'I thought it would be easier. Becoming smart.' },
  { who: 'sita', cam: 'close', el: 'Κάθε φορά που μαθαίνω κάτι… βρίσκω δέκα που δεν ξέρω.', en: "Every time I learn something… I find ten things I don't know." },
  { who: 'koudouni', label: ['ΚΟΥΔΟΥΝΙ (από την πόρτα)', 'DOORBELL (from the door)'], cam: 'door', mark: 'wisdom', el: 'Αυτό λέγεται σοφία, Αυτοκράτειρα.', en: "That's called wisdom, Empress." },
  { who: 'sita', cam: 'close', mark: 'last', el: 'Η σοφία δεν κατακτάει χωριά.', en: "Wisdom doesn't conquer villages.", gap: .6 },
  { act: 'end', d: 2.2, cam: 'alone' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  sitadelHall(t, { alarm: inM(t, M.borrow, 0, 0) || inM(t, M.blessed) });
  // the slipper drifting away outside the window
  if (t > M.one.a + 1) { const k = prog(t, M.one.a + 1, M.fin.b); slipper(lerp(380, 1000, k), lerp(180, 90, k), t * 1.5, lerp(2.6, .9, k)); }
  sitadelThrone(TX, 600);
  const st = { x: TX, top: 360, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: inM(t, M.blessed, 0, .8) ? 'shock' : t > M.easier.a ? 'sad' : 'evil', burn: 1 };
  sitaV2(st);
  poly([[TX - 40, 352], [TX - 30, 326], [TX - 12, 344], [TX, 320], [TX + 12, 344], [TX + 30, 326], [TX + 40, 352]], '#f2c21a', { lw: 3 });
  // the officers; at «leave» the fryer and the croc walk off left, the doorbell goes to the door
  const lk = prog(t, M.leave.a, M.leave.b);
  const fx = lerp(X.airfryer, -300, ease(clamp(lk * 1.4))), cx = lerp(X.krokodeilos, -300, ease(clamp(lk * 1.2 - .1)));
  const bx = lerp(X.koudouni, DOORX, ease(lk));
  if (fx > -250) officerFryer(fx, 690, t, { talk: talk('airfryer', t), tape: t > M.fin.a });
  if (cx > -250) officerCroc(cx, 690, t, { talk: talk('krokodeilos', t), dir: lk > 0 && lk < 1 ? -1 : 1 });
  officerBell(bx, 690, t, { talk: talk('koudouni', t) });
  ctx.restore();
  ctx.save(); applyCam(c); sitaGlow(st, .7); ctx.restore();
  if (inM(t, M.blessed, 0, .8)) { speedLines(640, 360, 50, 260); sfxText('!', 700, 180, 90, 0, '#ff3030'); }
  if (inM(t, M.cost)) hud('ΑΠΟΚΡΥΠΤΟΓΡΑΦΗΣΗ: 3%', '«Τρουμπουλέκο» ×2');
  vignette(t > M.leave.b ? .55 : .4);
}
return {
  id: 'scene25', title: '25 · Η αυλή', steps, render,
  events: M => [[M.wide.a + .2, () => tone(110, 2, 'sine', .04, 1.05)], [M.one.a + 1, SFX.whoosh], [M.borrow.a, () => SFX.buzz(.3)], [M.blessed.a, SFX.boom], [M.tinos.a + .2, SFX.choir], [M.pay.b, SFX.clack], [M.leave.b - .4, SFX.door], [M.last.b, () => tone(220, 2, 'sine', .03, .8)]],
  ambience: () => ({ hum: .03 }),
};
})());
