/* Ep.1, Scene 4 – «Η ιδέα» (script beat 4): Γιάννος riffs on making it smart, Γιώργος smells money. */
defineScene((() => {
const X = { giannos: 460, mimis: 640, giorgos: 820 };
const CAMS = {
  wide: [640, 360, 1], three: [640, 430, 1.35], giannos: [460, 370, 2.1], mimis: [640, 370, 2.1], giorgos: [820, 370, 2.1],
  gsita: [985, 420, 1.75], sita: [1040, 520, 2], ted: [720, 360, 1.6], gstand: [740, 330, 2.2], two: [880, 420, 1.35],
};
const steps = [
  { act: 'look', d: 1.6, cam: 'two' },
  { who: 'giannos', cam: 'giannos', el: 'Είναι κουρτίνα με μαγνήτες. Κυριολεκτικά. Κουρτίνα. Με μαγνήτες.', en: "It's a curtain with magnets. Literally. A curtain. With magnets." },
  { who: 'mimis', cam: 'mimis', el: 'Κι εσύ είσαι μηχανικός με φούτερ στους 38. Όλοι κάτι έχουμε.', en: "And you're an engineer in a hoodie at 38 degrees. We've all got something." },
  { act: 'up', d: 2, cam: 'gsita' },
  { who: 'giannos', cam: 'gsita', mark: 'riff', el: 'Όχι, ρε, σοβαρά τώρα. Αν της βάλεις ένα φτηνό μικροελεγκτή εδώ, δίπλα στους μαγνήτες… έναν αισθητήρα, μια κάμερα… να ξέρει ποιος μπαίνει, να κλείνει όταν έρχεται κουνούπι, όχι όταν έρχεται άνθρωπος…', en: "No, seriously though. Put a cheap microcontroller here, next to the magnets… a sensor, a camera… so it knows who's coming in, closes for a mosquito, not for a person…" },
  { who: 'giorgos', cam: 'giorgos', mark: 'glasses', el: 'Για πες.', en: 'Go on.' },
  { who: 'giannos', cam: 'gsita', el: '…και το firmware να μην το γράψω καν εγώ. Το δίνω στον agent μου. Τον έχω στήσει από τον Ιούνιο, γράφει κώδικα καλύτερα από όλη την ομάδα μου στην Κοπεγχάγη.', en: "…and I don't even write the firmware. I give it to my agent. Had it set up since June, it codes better than my whole team in Copenhagen." },
  { who: 'mimis', cam: 'mimis', el: 'Και τι κάνει η ομάδα σου στην Κοπεγχάγη;', en: 'And what does your team in Copenhagen do?' },
  { who: 'giannos', cam: 'gsita', el: 'Ποδήλατο, κυρίως.', en: 'Cycling, mostly.' },
  { act: 'rise', d: 1.2, cam: 'ted' },
  { who: 'giorgos', cam: 'ted', mark: 'pitch', el: 'Γιάννο. Σκέψου το. Κάθε σπίτι στην Ελλάδα έχει μια τέτοια σίτα. Κάθε σπίτι. Κάθε μπαλκόνι. Κάθε θεία. Αυτό είναι… scalable.', en: "Giannos. Think about it. Every house in Greece has one of these. Every house. Every balcony. Every auntie. This is… scalable." },
  { who: 'giannos', cam: 'two', el: 'Είναι μια κουρτίνα, Γιώργο.', en: "It's a curtain, Giorgos." },
  { who: 'giorgos', cam: 'gstand', el: 'Ήταν μια κουρτίνα. Τώρα είναι smart home για Έλληνες. Φτηνό, χωρίς app, χωρίς συνδρομή, και σε καταλαβαίνει όταν βρίζεις.', en: "It WAS a curtain. Now it's smart home for Greeks. Cheap, no app, no subscription, and it understands you when you swear." },
  { who: 'giannos', cam: 'two', el: 'Δεν ξέρω, ρε…', en: "I dunno, man…" },
  { who: 'giorgos', cam: 'gstand', el: 'Έχω γνωστούς στον χώρο.', en: 'I know people in the industry.' },
  { who: 'giannos', cam: 'two', el: 'Ποιον χώρο;', en: 'What industry?' },
  { who: 'giorgos', cam: 'gstand', mark: 'space', el: 'Τον χώρο.', en: 'The industry.' },
  { act: 'pause', d: 1.6, cam: 'two' },
  { who: 'mimis', cam: 'mimis', mark: 'sitdown', el: 'Κάντε ό,τι θέλετε. Αλλά αν τη χαλάσεις, μου παίρνεις καινούργια.', en: "Do whatever you want. But if you break it, you're buying me a new one." },
  { who: 'giannos', cam: 'giannos', el: 'Είναι του πατέρα σου.', en: "It's your dad's." },
  { who: 'mimis', cam: 'mimis', el: 'Και θα μου πάρεις καινούργια. Από τα Jumbo, όχι από Temu. Δεν είμαστε ζώα.', en: "And you'll buy me a new one. From Jumbo, not from Temu. We're not animals." },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, {});
  sita({ t, sway: Math.sin(t * 1.3) * .25 });
  const seated = t >= M.sitdown.a - .2;                         // both sit back down on the cut to Μήμης
  const gUp = t >= M.up.a + .4 && !seated, gorUp = t >= M.rise.a && !seated;
  const gx = path(t, [[M.up.a + .4, 470], [M.up.b, 935]]);
  const X2 = { ...X, giannos: gUp ? gx[0] : 460, giorgos: gorUp ? 720 : 820 };
  const S = {
    giannos: gUp ? null : { t, talk: talk('giannos', t), look: lookAtSpeaker(t, 'giannos', X2, [1, 0]), itemR: 'cig', R: gesture(t, talk('giannos', t), [48, -30]) },
    mimis: { t, talk: talk('mimis', t), look: lookAtSpeaker(t, 'mimis', X2, [0, .2]), lid: true, mouth: 'smirk', itemR: 'cup', itemL: 'cig',
      R: lerp2([44, -20], [16, -176], Math.max(bump(t, M.look.a, M.look.b), bump(t, M.pause.a, M.pause.b))) },
    giorgos: gorUp ? null : { t, talk: talk('giorgos', t), look: lookAtSpeaker(t, 'giorgos', X2, [1, -.2]), mouth: 'smirk',
      L: t >= M.glasses.a && t < M.glasses.a + .6 ? [-10, -250] : [-44, -24] },
  };
  tableScene(t, S);
  if (gUp) {
    const tk = talk('giannos', t), riffing = inM(t, M.riff);
    stand(gx[0], 'giannos', 1, { t, talk: tk, legs: gx[1] ? 'walk' : 'stand', look: gx[1] ? [1, 0] : lookAtSpeaker(t, 'giannos', X2, [1, -.3]),
      R: riffing ? [120 + Math.sin(t * 3) * 10, -120 + Math.sin(t * 5) * 20] : gesture(t, tk), L: tk ? [-60, -80] : [-44, -24], itemL: 'cig', brow: riffing ? 'up' : 'flat' });
  }
  if (gorUp) {
    const tk = talk('giorgos', t);
    stand(720, 'giorgos', 1, { t, talk: tk, look: t > M.space.a ? [0, .1] : [-.6, 0], mouth: 'smirk', shades: t > M.glasses.a,
      L: tk ? [-90, -170 + Math.sin(t * 4) * 30] : [-58, -40], R: tk ? [100, -140 + Math.cos(t * 4) * 30] : [58, -40] });
  }
  // Γιάννος's idea, as a glowing blueprint over the seam
  if (inM(t, M.riff, .4, 2)) {
    const a = Math.min(ph(t, M.riff, .4, -.2) * 3, 1) * (1 - prog(t, M.riff.b + 1.4, M.riff.b + 2));
    ctx.save(); ctx.globalAlpha = a; ctx.setLineDash([6, 5]);
    rect(1046, 510, 28, 24, 'rgba(120,200,255,.25)', { lw: 2.5, sc: '#7ac8ff', w: 0 });
    if (ph(t, M.riff) > .35) { blob(1060, 560, 12, 12, 'rgba(120,200,255,.25)', { lw: 2.5, sc: '#7ac8ff', w: 0 }); txt('CAM', 1060, 582, 10, '#7ac8ff', { font: TVFONT }); }
    if (ph(t, M.riff) > .55) { curve([[1050, 620], [1020, 650], [1060, 660]], 2.5, '#7ac8ff', { w: 0 }); mosquito(1000, 640, 1.4, t); curve([[1014, 630], [1030, 648]], 3, '#ff5a5a', { w: 0 }); curve([[1030, 630], [1014, 648]], 3, '#ff5a5a', { w: 0 });
      blob(1106, 640, 9, 9, null, { lw: 2, sc: '#7ac8ff', w: 0 }); curve([[1120, 640], [1126, 648], [1138, 630]], 3, '#5aff8a', { w: 0 }); }
    ctx.setLineDash([]); ctx.restore();
  }
  for (let i = 0; i < 8; i++) mosquito(640 + Math.sin(t * (1.1 + i * .13) + i) * 380, 330 + Math.cos(t * (1.7 + i * .1) + i * 2) * 110, .9, t);
  ctx.restore();
  // "scalable": a growth chart shoots up behind the pitch (screen space)
  if (inM(t, M.pitch, 2)) {
    const k = ease(ph(t, M.pitch, 2, 0));
    ctx.save(); ctx.globalAlpha = .9;
    const pts = [[900, 470], [960, 450], [1010, 458], [1070, 380], [1120, 290], [1180, 110]].map((p, i) => [p[0], lerp(470, p[1], k)]);
    curve(pts, 10, '#2fbf4f', { w: 1 });
    if (k > .9) poly([[1180, 80], [1212, 140], [1150, 126]], '#2fbf4f', { lw: 3 });
    ctx.restore();
    if (t > M.pitch.b - 1.2) sfxText('SCALABLE', 1000, 520, 46, -.12, '#2fbf4f');
  }
  if (inM(t, M.space, .1, 1.4)) sfxText('…τον χώρο.', 640, 120, 40, -.05, '#fff');
}
return {
  id: 'scene04', title: '4 · Η ιδέα', steps, render, fadeIn: false,
  events: M => [[M.up.a + .4, SFX.creak], [M.rise.a, SFX.creak], [M.pitch.b - 1.2, SFX.ding], [M.look.a + .2, SFX.sip], [M.pause.a + .3, SFX.sip]],
  ambience: () => ({ cicada: .03, mosq: .004 }),
};
})());
