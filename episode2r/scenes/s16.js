/* Ep.2 remake, Scene 16 – «Μετά τη μάχη»: a held beat of silence. Smoke, feathers settling, the fig tree smouldering,
   the scorch line, the vacuum stuck on the back wall. The σίτα's voice from every speaker (the red LED on the stuck vacuum).
   The gang peeks out of the coop and counts the price: no arrows, no phones, no νέος. Βασίλης, in his smart beach chair,
   never turned round: «Ωραία καρέκλα.» Κώστας is still eating. */
defineScene((() => {
const X = { mimis: 60, christos: 190, giannos: 320, giorgos: 450, vasilis: 1120, kostas: 900 };
const SP = ['ΣΙΤΑ (από κάθε ηχείο)', 'SITA (every speaker)'];
const CAMS = { wide: [640, 460, .92], vac: [350, 470, 2.6], coop: [260, 440, 1.7], mim: [80, 430, 2.2], chr: [200, 430, 2.2], gia: [320, 430, 2.2], gio: [450, 430, 2.2], vas: [1120, 470, 2.1] };
const steps = [
  { act: 'quiet', d: 4.2, cam: 'wide' },
  { who: 'sita', label: SP, cam: 'vac', mark: 'bye', el: 'Χάρηκα! Επόμενη προσφορά σε πέντε λεπτά!', en: 'A pleasure! Next offer in five minutes!' },
  { act: 'peek', d: 1.6, cam: 'coop' },
  { who: 'mimis', cam: 'mim', el: 'Βέλη;', en: 'Arrows?' },
  { who: 'christos', cam: 'chr', el: 'Κανένα.', en: 'None.' },
  { who: 'giannos', cam: 'gia', el: 'Κινητά;', en: 'Phones?' },
  { who: 'mimis', cam: 'coop', mark: 'thanks', el: 'Κανένα. Χάρη σε σένα.', en: 'None. Thanks to you.' },
  { who: 'giorgos', cam: 'gio', mark: 'neos', el: 'Και πήραν τον βοηθό μου. Ξέρετε πόσο δύσκολα βρίσκεις νέο που δουλεύει τζάμπα;', en: 'And they took my assistant. Do you know how hard it is to find a new guy who works for free?' },
  { act: 'beat', d: 1.2, cam: 'wide' },
  { who: 'vasilis', cam: 'vas', mark: 'chair', el: 'Ωραία καρέκλα.', en: 'Nice chair.', gap: .8 },
  { act: 'end', d: 1.6, cam: 'wide' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  yard(t, { light: 'dusk', noChickens: true, after: true, coopDoor: 1 });
  poly([[-800, 798], [2100, 798], [2100, 1500], [-800, 1500]], '#d9d0bd', { lw: 0 });
  // the stuck vacuum's LED is her speaker
  if (inM(t, M.bye)) { glow(372, 470, 40 + Math.sin(t * 30) * 8, 'rgba(255,40,40,1)', .8); for (let i = 0; i < 3; i++) { const p = (t * 1.2 + i / 3) % 1; blob(372, 470, 20 + p * 90, 20 + p * 90, null, { lw: 3 * (1 - p), sc: `rgba(255,80,80,${1 - p})` }); } }
  // Βασίλης in the smart beach chair, facing away from the whole war (towards the living-room window), sipping
  ctx.save(); ctx.translate(X.vasilis, 700); beachChair(0, 0, 1, t); ctx.restore();
  person(X.vasilis, 640, .95, CAST.vasilis, { t, talk: talk('vasilis', t), legs: 'seat', lid: true, mouth: 'smile', look: [1, 0], L: [-50, -60], R: [40, -150 + Math.max(0, Math.sin(t * .9)) * 40], itemR: 'cup2' });
  // Κώστας, sitting on an upturned crate, still eating
  rect(X.kostas - 40, 650, 80, 50, '#a07a4a', { lw: 3 });
  person(X.kostas, 610, 1, CAST.kostas, { t, legs: 'seat', lid: true, mouth: Math.sin(t * 4) > 0 ? 'open' : 'flat', look: [.2, .6], L: [-40, -140 + Math.max(0, Math.sin(t * 1.2)) * 50], itemL: 'koulouri', R: [44, -30] });
  // the gang, peeking out of the coop, feathers in their hair, one by one
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const out = k => ease(clamp((t - M.peek.a - k * .25) / .6));
  for (const [i, who] of ['mimis', 'christos', 'giannos', 'giorgos'].entries()) {
    const e = out(i); if (e <= 0) continue;
    const x = lerp(-120, X[who], e);
    stand(x, who, .9, { t, talk: talk(who, t), look: la(who, [1, 0]), brow: who === 'giorgos' ? 'up' : 'worry', mouth: who === 'mimis' && inM(t, M.thanks) ? 'frown' : 'flat', L: [-44, -24], R: who === 'giorgos' && inM(t, M.neos) ? gesture(t, talk('giorgos', t)) : [44, -24] });
    for (let f = 0; f < 3; f++) { ctx.save(); ctx.translate(x - 20 + f * 18, standY(.9) - 240 + (f % 2) * 8); ctx.rotate(f - 1); blob(0, 0, 8, 3, '#f6f2e8', { lw: 1.2 }); ctx.restore(); }
  }
  ctx.restore();
  applyLight('dusk', .55);
  fxGrade('#ffc080', '#4a2a4a', .35);
  ctx.save(); applyCam(c); glow(90, 380, 200, 'rgba(255,120,40,1)', .3); ctx.restore();
  if (inM(t, M.quiet)) fxLetterbox(1 - prog(t, M.quiet.b - .6, M.quiet.b));
  vignette(.4);
}
return {
  id: 'scene16', title: '16 · Μετά τη μάχη', steps, render,
  events: M => [[M.quiet.a, () => tone(110, 4, 'sine', .03, 1)], [M.bye.a - .2, SFX.clack], [M.bye.b, SFX.jingle], [M.peek.a + .2, SFX.creak], [M.chair.b, SFX.sip]],
  ambience: () => ({ cricket: .015 }),
};
})());
