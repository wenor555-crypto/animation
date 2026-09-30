/* Ep.2 remake, Scene 25 – «Νύχτα στην αυλή»: everyone wrecked. Κώστας, sober again, remembers nothing. He pulls out a pack of normal
   cigarettes. Βασίλης appears out of nowhere: «Έχεις ένα τσιγάρο;» Κώστας gives him one. «…Επιτέλους. Κάποιος έχει.»
   The yard keeps all the damage of the battle. The bin (the IQOS inside, 3%) leans towards Κώστας like a dog.
   The Jumbo driver hands Γιώργος the bill for the «free» returns: «Η εταιρεία είστε εσείς.» (Ep. 3 opens with him broke.) */
defineScene((() => {
const X = { giannos: 460, mimis: 640, giorgos: 820, kostas: 1050, vasilis: 1190, neos: 250 };
const CAMS = { wide: [700, 420, 1.1], kos: [1050, 380, 2.1], gia: [470, 400, 2.1], mim: [640, 400, 2.1], gio: [820, 400, 2.1], two: [1090, 400, 1.7], vas: [1150, 380, 2.1], neo: [300, 420, 2], cig: [1090, 380, 2.8], drv: [870, 400, 1.8], bin: [1180, 560, 2] };
const steps = [
  { act: 'open', d: 3, cam: 'wide' },
  { who: 'kostas', cam: 'kos', el: 'Τι έγινε;', en: 'What happened?' },
  { who: 'giannos', cam: 'gia', el: 'Δεν θέλεις να ξέρεις.', en: "You don't want to know." },
  { who: 'kostas', cam: 'kos', el: 'Πού είναι το IQOS μου;', en: "Where's my IQOS?" },
  { who: 'mimis', cam: 'mim', el: 'Στον κάδο.', en: 'In the bin.' },
  { who: 'kostas', cam: 'kos', mark: 'belongs', el: '…Εκεί ανήκει.', en: "…That's where it belongs.", gap: .7 },
  { act: 'dog', d: 2, cam: 'bin' },
  { act: 'pack', d: 2.2, cam: 'kos' },
  { act: 'appear', d: 1.4, cam: 'two' },
  { who: 'vasilis', cam: 'vas', mark: 'ask', el: 'Έχεις ένα τσιγάρο;', en: 'Got a cigarette?' },
  { act: 'give', d: 2.6, cam: 'cig' },
  { who: 'vasilis', cam: 'vas', mark: 'finally', el: '…Επιτέλους. Κάποιος έχει.', en: '…Finally. Somebody has one.' },
  { act: 'smoke', d: 1.6, cam: 'two' },
  { act: 'bill', d: 1.6, cam: 'drv' },
  { who: 'odigos', cam: 'drv', mark: 'inv', el: 'Τα μεταφορικά της επιστροφής. Είπατε δωρεάν. Άρα πληρώνει η ΣίταAI.', en: 'The return shipping. You said free. So SitaAI pays.' },
  { who: 'giorgos', cam: 'gio', mark: 'send', el: 'Στείλτε το στην εταιρεία.', en: 'Send it to the company.' },
  { who: 'odigos', cam: 'drv', mark: 'you', el: 'Η εταιρεία είστε εσείς.', en: 'You ARE the company.' },
  { who: 'giorgos', cam: 'gio', mark: 'rebrand', el: '…Γιάννο. Λέω να κάνουμε rebrand.', en: "…Giannos. I'm thinking rebrand.", gap: .8 },
  { who: 'giannos', cam: 'gia', el: 'Λέω να πας σκοπιά.', en: "I'm thinking guard duty." },
  { who: 'neos', cam: 'neo', mark: 'other', el: 'Την κάνει ένας άλλος νέος.', en: "Another new guy's on it." },
  { act: 'end', d: 2.4, cam: 'wide' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, { light: 'night', doorLit: true, noChickens: true, after: true });
  poly([[-800, 798], [2100, 798], [2100, 1500], [-800, 1500]], '#d9d0bd', { lw: 0 });
  arrow(60, 600, -.4, 1);
  // the bin, with the IQOS inside (its battery blinking at 3%), leaning towards Κώστας like a dog
  friendBin(1260, 700, t, { lean: t > M.dog.a ? .08 - ease(prog(t, M.dog.a, M.dog.a + 1)) * .2 : .08, lid: .15, inside: () => { ctx.save(); ctx.translate(-4, -118); ctx.rotate(-.3); iqos(0, 0, 1.4, 0, 'blink', t); ctx.restore(); } });
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  tableOf(t, [
    [X.giannos, 'giannos', { t, talk: talk('giannos', t), look: la('giannos', [1, .1]), lid: true, brow: 'flat', mouth: 'flat', bandage: true }],
    [X.mimis, 'mimis', { t, talk: talk('mimis', t), look: la('mimis', [1, .1]), lid: true, mouth: 'flat', L: [-44, -40], itemL: 'bow' }],
    [X.giorgos, 'giorgos', { t, talk: talk('giorgos', t), look: t > M.bill.a && t < M.you.b ? [1, .2] : la('giorgos', [-1, 0]), brow: inM(t, M.you) ? 'worry' : 'up', mouth: inM(t, M.send) ? 'smirk' : 'flat', L: [-50, -40], itemL: 'tray', R: inM(t, M.bill, .8, 99) && t < M.rebrand.a ? [80, -60] : [44, -40] }],
  ], { cups: [470, 836] });
  const hasPack = t > M.pack.a + .4, lit = t > M.give.a + 1.4;
  stand(X.kostas, 'kostas', 1, { t, talk: talk('kostas', t), look: t > M.appear.a ? [1, 0] : la('kostas', [-1, .1]), lid: true, mouth: 'flat', brow: 'flat',
    R: inM(t, M.give) ? [110, -110] : hasPack ? [60, -110] : [44, -24], itemR: hasPack && !inM(t, M.give, 1, 99) ? 'cigPack' : null, L: t > M.smoke.a ? [-30, -170] : [-44, -24], itemL: t > M.smoke.a ? 'cig' : null });
  if (t > M.appear.a) { const [vx, vw] = path(t, [[M.appear.a, 1500], [M.appear.b, X.vasilis]]);
    stand(vx, 'vasilis', 1, { t, talk: talk('vasilis', t), legs: vw ? 'walk' : 'stand', look: [-1, 0], lid: true, mouth: inM(t, M.finally, .6, 99) ? 'smile' : 'flat', dir: -1,
      R: inM(t, M.give) ? [-110, -110] : lit ? [-30, -170] : [44, -24], itemR: lit ? 'cig' : null }); }
  if (inM(t, M.give, 1, 1.6)) { lighter(X.kostas + 110, standY() - 110, 1); }
  // the Jumbo driver with the invoice
  if (t > M.bill.a) { const [dx, dw] = path(t, [[M.bill.a, 1400], [M.bill.a + 1.2, 905]]); stand(dx, 'odigos', 1, { t, talk: talk('odigos', t), legs: dw ? 'walk' : 'stand', look: [-1, 0], lid: true, mouth: 'flat', dir: -1, R: [60, -110] });
    ctx.save(); ctx.translate(dx - 60, standY() - 110); ctx.rotate(-.1); rect(-18, -24, 36, 48, '#fbfaf6', { lw: 2 }); for (let i = 0; i < 4; i++) curve([[-12, -14 + i * 9], [12, -14 + i * 9]], 1.5, '#8a8a8a'); txt('€€€', 0, 14, 9, '#c0202a', { font: TVFONT, weight: 900 }); ctx.restore(); }
  // Γιώργος's new guy, sitting on the coop steps
  person(X.neos, SEAT + 30, .95, CAST.neos, { t, talk: talk('neos', t), legs: 'seat', look: la('neos', [1, 0]), brow: 'up', mouth: 'smile' });
  ctx.restore();
  applyLight('night', .9);
  ctx.save(); applyCam(c); glow(1060, 580, 300, 'rgba(255,220,140,1)', .25); glow(1278, 574, 30, 'rgba(255,40,40,1)', .7);
  if (t > M.give.a + 1) glow(X.vasilis - 30, standY() - 170, 40, 'rgba(255,120,40,1)', .7);
  if (t > M.smoke.a) glow(X.kostas - 30, standY() - 170, 40, 'rgba(255,120,40,1)', .7);
  ctx.restore();
  vignette(.45);
}
return {
  id: 'scene25', title: '25 · Νύχτα στην αυλή', steps, render,
  events: M => [[M.pack.a + .4, () => noise(.3, .1, 3000, 1, 'bandpass')], [M.give.a + 1, () => { SFX.spark(); noise(.4, .1, 2500, .5, 'bandpass', .1); }], [M.finally.b, () => noise(1.2, .06, 900, .5, 'bandpass')]],
  ambience: () => ({ cricket: .04, mosq: .004 }),
};
})());
