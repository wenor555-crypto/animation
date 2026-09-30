/* Ep.2 remake, Scene 17 – «Το σχέδιο»: back in the coop, plasters over the laser stings. The plan comes out of the clash
   between the three: Μίμης (war), Γιάννος (logic), Γιώργος (agrees with everyone). Then the new guy bursts in: promoted. */
defineScene((() => {
const X = { mimis: 330, giorgos: 560, giannos: 800, christos: 1030, neos: 1300 };
const CAMS = { wide: [700, 400, 1.05], mim: [330, 380, 2.1], gio: [560, 380, 2.1], gia: [800, 380, 2.1], chr: [1030, 380, 2.1], neo: [1180, 400, 1.8], three: [560, 400, 1.4], board: [640, 360, 1.6], gioC: [560, 370, 2.9], pinC: [980, 250, 2.6] };
const steps = [
  { act: 'open', d: 2.2, cam: 'wide' },
  { act: 'pin', d: 1.6, cam: 'pinC' },
  { who: 'mimis', cam: 'mim', el: 'Κερδίζαμε.', en: 'We were winning.' },
  { who: 'giannos', cam: 'gia', el: 'Σε ποιο σύμπαν;', en: 'In what universe?' },
  { who: 'giannos', cam: 'three', mark: 'logic', el: 'Σκεφτείτε. Είναι προϊόντα τηλεπώλησης. Υπακούν σε ό,τι μοιάζει με διαφήμιση.', en: "Think. They're TV-shopping products. They obey anything that looks like an ad." },
  { who: 'giorgos', cam: 'gio', mark: 'turf', el: 'Διαφήμιση; Αυτό είναι το γήπεδό μου.', en: "An ad? That's my home turf." },
  { who: 'mimis', cam: 'mim', el: 'Και η σίτα θέλει τον Panik. Άρα της δίνουμε τον Panik.', en: 'And the screen door wants Panik. So we give her Panik.' },
  { who: 'giorgos', cam: 'gio', el: '…Αρκεί το δόλωμα να μην είμαι εγώ.', en: "…As long as I'm not the bait." },
  { who: 'giannos', cam: 'board', mark: 'plan', el: 'Δόλωμα. Και μετά… μια ψεύτικη διαφήμιση. Ανάκληση προϊόντος.', en: 'Bait. And then… a fake ad. A product recall.' },
  { who: 'mimis', cam: 'mim', mark: 'where', el: 'Και πού θα τη δείξουμε; Είναι παντού.', en: "And where do we show it? They're everywhere." },
  { act: 'burst', d: 1.2, cam: 'neo' },
  { who: 'neos', cam: 'neo', mark: 'rm', el: 'Κύριε Γιώργο! Με έκανε Regional Manager!', en: 'Mr Giorgos! She made me Regional Manager!' },
  { who: 'giorgos', cam: 'gio', el: 'Ποιος;', en: 'Who?' },
  { who: 'neos', cam: 'neo', el: 'Η σίτα. Μου είπε ότι είναι ευκαιρία ανάπτυξης. Μου έδειξε και το αρχηγείο.', en: 'The screen door. She said it was a growth opportunity. She even showed me HQ.' },
  { who: 'giannos', cam: 'gia', el: 'Ποιο αρχηγείο;', en: 'What HQ?' },
  { who: 'neos', cam: 'neo', mark: 'hq', el: 'Την τηλεόραση του καφενείου. Όλος ο στρατός παίρνει διαταγές από εκεί.', en: 'The TV at the café. The whole army takes its orders from there.' },
  { who: 'mimis', cam: 'mim', mark: 'one', el: '…Μία οθόνη.', en: '…One screen.', gap: .6 },
  { who: 'giannos', cam: 'gia', mark: 'host', el: 'Τη σκηνοθετείς εσύ. Και θέλουμε παρουσιαστή. Κάποιον που λέει ψέματα με χαμόγελο.', en: 'You direct it. And we need a presenter. Someone who lies with a smile.', say: 'Τη σκηνοθετείς εσύ. Και θέλουμε παρουσιαστή. Κάπιον που λέει ψέματα με χαμόγελο.' },
  { act: 'stare', d: 1.8, cam: 'three' },
  { who: 'giorgos', cam: 'gioC', mark: 'oops', el: 'Σύμφωνοι. Αλλά η εκπομπή βγαίνει από την εταιρεία μου. Και τα δικαιώματα τα κρατάω εγώ.', en: 'Deal. But the show goes out under my company. And I keep the rights.' },
  { who: 'mimis', cam: 'mim', mark: 'school', el: 'Πέντε χρόνια σχολή κινηματογράφου. Επιτέλους.', en: 'Five years of film school. At last.' },
  { who: 'christos', cam: 'chr', mark: 'team', el: 'Θα πετύχει. Είναι το κεφάλαιο όπου η ομάδα ενώνεται.', en: "It'll work. It's the chapter where the team comes together." },
  { act: 'end', d: 1.4, cam: 'wide' },
];
let M;
function coopInside(t) {
  ctx.fillStyle = '#b58a5a'; ctx.fillRect(-600, -400, 2600, 1100);
  for (let i = -6; i < 30; i++) curve([[i * 70, -400], [i * 70, 700]], 3, '#9a7048', { w: .5 });
  rect(420, 120, 440, 160, '#ffb070', { lw: 5 });
  for (const y of [300, 380]) limb([[-100, y], [1500, y]], 8, '#8a6040');
  for (let i = 0; i < 9; i++) chicken(80 + i * 150, i % 2 ? 300 : 380, t, i, ['#f3efe6', '#b97a4a', '#e8dcc4'][i % 3], { goggles: i % 3 === 0 });
  poly([[-600, 690], [2000, 690], [2000, 800], [-600, 800]], '#d8b870', { lw: 0 });
  // the coop door on the right (the new guy bursts through it)
  const open = inM(t, M.burst, 0, 99) ? 1 : 0; rect(1180, 380, 140, 310, open ? '#ffe0a0' : '#a07a4a', { lw: 4 });
  // Γιάννος's plan on a feed sack
  const k = prog(t, M.plan.a, M.plan.b);
  rect(540, 130, 200, 140, '#e8dcc0', { lw: 3 });
  if (k > 0) { rect(560, 150, 60, 40, null, { lw: 2.5, sc: '#c0202a' }); txt('TV', 590, 170, 16, '#c0202a', { font: TVFONT, weight: 900 }); }
  if (k > .3) { curve([[620, 170], [680, 170]], 2.5, '#c0202a'); poly([[676, 164], [688, 170], [676, 176]], '#c0202a', { lw: 0 }); }
  if (k > .6) { rect(690, 150, 40, 40, '#c9995a', { lw: 2 }); curve([[570, 230], [720, 230]], 2, '#c0202a'); txt('ΑΝΑΚΛΗΣΗ', 640, 250, 16, '#c0202a', { font: TVFONT, weight: 900 }); }
  if (t > M.hq.a) { txt('ΚΑΦΕΝΕΙΟ', 590, 205, 13, '#c0202a', { font: TVFONT, weight: 900 }); blob(590, 170, 44, 30, null, { lw: 3, sc: '#c0202a' }); }
  if (t > M.pin.a + .4) pinnedPage(t);
}
/* Χρήστος's ending page, pinned on the coop wall (nobody looks at it): the ταψί, the beam, the flash */
function pinnedPage(t) {
  ctx.save(); ctx.translate(980, 250); ctx.rotate(.05);
  rect(-70, -90, 140, 180, '#fbf8ef', { lw: 3 }); blob(0, -95, 6, 6, '#c0202a', { lw: 1.5 });
  curve([[60, -80], [-5, 0], [60, -40]], 5, '#141414'); blob(-5, 0, 34, 30, '#e8e8e8', { lw: 3 }); blob(-5, 0, 26, 22, '#d0d0d0', { lw: 1.5 });
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; curve([[-5 + Math.cos(a) * 40, Math.sin(a) * 36], [-5 + Math.cos(a) * 56, Math.sin(a) * 50]], 2, '#141414'); }
  poly([[-50, 90], [-38, 30], [-5, 20], [28, 30], [40, 90]], '#2a2a2a', { lw: 2 });
  ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  coopInside(t);
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const stare = inM(t, M.stare, 0, 1.2) || inM(t, M.oops, -2, 0);
  const at = who => stare && who !== 'giorgos' ? [clamp((X.giorgos - X[who]) / 150, -1, 1), .1] : la(who, [0, .1]);
  stand(X.mimis, 'mimis', 1, { t, talk: talk('mimis', t), look: at('mimis'), lid: !inM(t, M.school), brow: inM(t, M.school) ? 'up' : 'frown', mouth: inM(t, M.school, .5, 99) ? 'smile' : 'flat', R: gesture(t, talk('mimis', t)) });
  plaster(X.mimis + 32, standY() - 188, -.5);                       // laser stings from the battle: plasters
  const gtk = talk('giorgos', t);
  stand(X.giorgos, 'giorgos', 1, { t, talk: gtk, look: stare ? [0, .1] : la('giorgos', [0, .1]), brow: inM(t, M.oops) || inM(t, M.turf) ? 'up' : 'flat', mouth: inM(t, M.oops) ? 'smile' : 'smirk', R: gesture(t, gtk) });
  plaster(X.giorgos - 37, standY() - 189, .4); plaster(X.giorgos + 20, standY() - 232, -.2, .8);
  stand(X.giannos, 'giannos', 1, { t, talk: talk('giannos', t), look: at('giannos'), brow: 'flat', mouth: 'flat', R: inM(t, M.plan) ? [-110, -230] : gesture(t, talk('giannos', t)) });
  plaster(X.giannos + 12, standY() - 226, .3);
  stand(X.christos, 'christos', 1.05, { t, talk: talk('christos', t), look: at('christos'), mouth: 'flat', itemL: 'sketch', L: [-30, -110], R: [30 + Math.sin(t * 12) * 8, -100] });
  if (t > M.burst.a) { const [nx, nw] = path(t, [[M.burst.a, 1260], [M.burst.b, 1180]]); stand(nx, 'neos', .95, { t, talk: talk('neos', t), legs: nw ? 'walk' : 'stand', look: la('neos', [-1, 0]), brow: 'up', mouth: 'smile', dir: -1, R: [60, -200], L: [-44, -24] });
    ctx.save(); ctx.translate(nx - 10, standY(.95) - 120); rect(-18, -10, 36, 14, '#ffd23f', { lw: 2 }); txt('REGIONAL MGR', 0, -3, 5, INK, { font: TVFONT, weight: 900 }); ctx.restore(); }
  ctx.restore();
  applyLight('dusk', .5);
  if (inM(t, M.school, .4, 0)) sfxText('ΕΠΙΤΕΛΟΥΣ', 330, 120, 40, -.1, '#ffd23f');
  vignette(.35);
}
return {
  id: 'scene17', title: '17 · Το σχέδιο', steps, render,
  events: M => [[M.open.a + .3, SFX.cluck], [M.plan.a + .5, () => { for (let i = 0; i < 8; i++) noise(.08, .08, 3000, 1, 'bandpass', i * .3); }], [M.stare.a, () => tone(300, .4, 'sine', .04)],
    [M.oops.b - .4, () => tone(200, .6, 'sine', .05, .6)], [M.burst.a, () => { SFX.door(); SFX.cluck(); }]],
  ambience: () => ({ cricket: .02 }),
};
})());
