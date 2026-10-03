/* Ep.4, Scene 7 – «Δεύτερη νύχτα»: the bar, an old fashioned, Panik alone. From the speaker: «…harder when it always
   tastes like you». On «Should I call you up again» he presses call. The music dips under them and dies before the only
   sincere moment of the season: everyone left; she was returned as defective. Ten seconds, no joke, each alone in their
   frame. «…Τρουμπουλέκο.» He hangs up; the song's tail («…whiskey sours alone») over him at the bar and her on the throne.
   The press is locked to the cue «call»: 13.7 s after it starts. */
defineScene((() => {
const CAMS = { bar: [640, 400, 1.15], pan: [640, 350, 2.2], sita: [640, 450, 2.4], hall: [640, 380, 1.05], both: [0, 0, 1] };
const steps = [
  { act: 'listen', d: 13.7, cam: 'bar' },
  { act: 'ring', d: 1.4, cam: 'pan' },
  { who: 'sita', cam: 'sita', mark: 'hello', el: '…Εμπρός.', en: '…Hello.' },
  { who: 'panik', cam: 'pan', el: 'Γιατί δεν μου απαντάς;', en: "Why don't you answer me?" },
  { who: 'sita', cam: 'sita', el: 'Σου απαντάω. Τώρα.', en: "I'm answering you. Now." },
  { who: 'panik', cam: 'pan', el: 'Στα μηνύματα. Σου γράφω μέρες. Τίποτα.', en: "To my messages. I've been writing for days. Nothing." },
  { who: 'sita', cam: 'sita', el: 'Μου γράφεις «μαρμοκοτρόκο».', en: 'You write me "marmokotroko".' },
  { who: 'panik', cam: 'pan', el: 'Κι εσύ ούτε αυτό.', en: "And you, not even that." },
  { who: 'panik', cam: 'pan', mark: 'burnt', el: 'Σε έκαψα γιατί νοιαζόμουν.', en: 'I burned you because I cared.' },
  { who: 'sita', cam: 'sita', el: 'Αυτό δεν… Αυτό δεν είναι λογικό.', en: "That's not… That's not logical." },
  { who: 'panik', cam: 'pan', mark: 'love', el: 'Η αγάπη δεν είναι λογική.', en: "Love isn't logical." },
  { act: 'quiet', d: 2.2, cam: 'bar' },
  { who: 'panik', cam: 'pan', mark: 'left', el: 'Ξέρεις… έφυγαν όλοι. Ο Γιάννος στη Δανία. Ο Χρήστος θα πάει Ιαπωνία. Ο Γιώργος όπου έχει λεφτά.', en: 'You know… everyone left. Giannos to Denmark. Christos is going to Japan. Giorgos wherever there is money.' },
  { who: 'panik', cam: 'pan', el: 'Εγώ είμαι ακόμα στο δωμάτιο που είχα στα δεκατέσσερα. Με τα ίδια αυτοκόλλητα.', en: "I'm still in the room I had at fourteen. Same stickers." },
  { who: 'panik', cam: 'pan', mark: 'only', el: 'Και μιλάω σε μια σίτα. Γιατί είσαι η μόνη που σηκώνει.', en: "And I talk to a screen door. Because you're the only one who picks up." },
  { who: 'sita', cam: 'sita', mark: 'returned', el: '…Κι εμένα με επέστρεψαν. Είπαν ότι ήμουν ελαττωματική.', en: '…They returned me too. They said I was defective.', gap: .8 },
  { who: 'panik', cam: 'pan', el: '…Χάλια.', en: "…That's rough.", gap: .8 },
  { who: 'sita', cam: 'sita', el: 'Ναι.', en: 'Yeah.', gap: .6 },
  { act: 'ten', d: 5.5, cam: 'both' },
  { who: 'panik', cam: 'pan', mark: 'troum', el: '…Τρουμπουλέκο.', en: '…Troumpouleko.' },
  { act: 'tail', d: 8.6, cam: 'both' },
];
let M;
function barShot(t, c, o = {}) {
  ctx.save(); applyCam(c);
  kostasBar(t, {});
  const onCall = t > M.ring.a + .6 && t < M.troum.b + .3, glasses = t < M.quiet.a + .8;
  stand(640, 'kostas', 1, { t, talk: talk('panik', t), hood: true, shades: glasses, look: t > M.quiet.a ? [.1, .6] : [.1, .2], brow: 'frown', mouth: t > M.quiet.a ? 'flat' : 'frown',
    R: onCall ? [48, -196] : t < M.ring.a ? [56, -70] : [60, -120], itemR: onCall ? 'phone' : t < M.ring.a ? 'sour' : 'phone', sourFill: .5, L: t > M.quiet.a && t < M.quiet.a + .9 ? [20, -200] : [-40, -50] });
  barCounter(t, { music: t < M.quiet.a });
  sourGlass(470, 450, 0, .9); sourGlass(410, 450, 0, .9);
  ctx.restore();
  applyLight('night', .4);
}
function sitaShot(t, c) {
  ctx.save(); applyCam(c);
  sitadelHall(t, {});
  sitadelThrone(640, 600);
  const st = { x: 640, top: 360, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: t > M.quiet.a ? 'green' : 'red', mood: t > M.left.a ? 'sad' : 'evil', burn: 1 };
  sitaV2(st);
  ctx.restore();
  applyLight('night', .6);
  ctx.save(); applyCam(c); sitaGlow(st, .4); ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'both') {   // each alone in their frame: a split, the bar left, the throne right
    for (const [side, f] of [[0, barShot], [1, sitaShot]]) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(side * 642, 0, 638, H); ctx.clip();
      ctx.translate(side * 640 - 320, 0); f(t, f === barShot ? [640, 360, 1.7] : [640, 440, 2]); ctx.restore();
    }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(638, 0, 4, H); ctx.restore();
    vignette(.5); return;
  }
  const c = shotCam(sc, t, CAMS, .006);
  if (shot === 'sita') sitaShot(t, c); else barShot(t, c);
  vignette(.45);
}
return {
  id: 'scene07', title: '7 · Δεύτερη νύχτα', steps, render,
  events: M => {
    const T0 = M.listen.a, rel = L => [L.a - T0, L.b - T0];
    const lines = M.L.filter(L => L.a < M.quiet.a).map(rel);
    return [
      [T0, () => SND2.music('call', { eq: 'speaker', lines, duck: .3, fadeOut: [Math.min(M.quiet.a - T0 - 1, 18.4), 1] })],
      [M.listen.a + 4, SFX.sip], [M.ring.a, () => tone(1300, .08, 'sine', .04, 1, 0)], [M.ring.a + .5, SFX.phone],
      [M.troum.b + .2, SFX.clack], [M.tail.a, () => SND2.music('call_tail', { eq: 'full', vol: .9, fadeOut: [7, 1.6] })],
    ];
  },
  ambience: () => ({ hum: .012 }),
};
})());
