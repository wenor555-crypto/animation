/* Ep.3, Scene 26 – «Κίνημα»: the village square, a TED-style stage; the whole village on plastic chairs. The regional governor cuts the
   ribbon; the minister from Ep. 2 invests «ιδιωτικά» by video call; the νέος has forty νέοι under him in pyramid formation.
   A light crosses the sky (the Σίταdel). Γιώργος shrugs: «Θα είναι κάποιος επενδυτής.» */
defineScene((() => {
const X = { giorgos: 640, perif: 380, neos: 1040 };
const CAMS = { wide: [640, 380, .95], perif: [400, 380, 2], screen: [920, 300, 2], gio: [640, 360, 2], neo: [1040, 400, 2], pyr: [1050, 450, 1.5], sky: [640, 250, 1.2] };
const steps = [
  { act: 'crowd', d: 2.6, cam: 'wide' },
  { act: 'ribbon', d: 1, cam: 'perif' },
  { who: 'perifereiarchis', cam: 'perif', mark: 'open', el: 'Κηρύσσω την πυραμίδα… ανοιχτή!', en: 'I declare the pyramid… open!' },
  { act: 'call', d: 1.2, cam: 'screen' },
  { who: 'ypourgos', cam: 'screen', mark: 'min', el: 'Γιώργο, εγώ επενδύω ιδιωτικά. Ως ιδιώτης. Με ιδιωτικά λεφτά… του Δημοσίου.', en: "Giorgos, I'm investing privately. As a private citizen. With private money… from the State." },
  { who: 'giorgos', cam: 'gio', el: 'Η ΣίταAI δεν είναι εταιρεία. Είναι… κίνημα.', en: "SitaAI isn't a company. It's… a movement." },
  { who: 'giorgos', cam: 'wide', mark: 'rising', el: 'Και το κίνημα ανεβαίνει.', en: 'And the movement is rising.' },
  { who: 'neos', cam: 'pyr', mark: 'paid', el: 'Κύριε Γιώργο, οι νέοι ρωτάνε πότε πληρώνονται.', en: 'Mr Giorgos, the new guys are asking when they get paid.' },
  { who: 'giorgos', cam: 'gio', el: 'Πες τους ότι είναι ευκαιρία ανάπτυξης.', en: "Tell them it's a growth opportunity." },
  { act: 'light', d: 2.4, cam: 'sky' },
  { who: 'giorgos', cam: 'gio', mark: 'shrug', el: '…Δορυφόρος. Θα είναι κάποιος επενδυτής.', en: "…A satellite. Must be some investor." },
  { act: 'end', d: 1.6, cam: 'wide' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  villageSquare(t, { light: t > M.light.a - 3 ? 'dusk' : 'day', stage: true, pump: true, pumpBent: 1 });
  // the video-call screen on a stand
  tv(920, 360, 220, 130, () => { ctx.fillStyle = '#e8e4dc'; ctx.fillRect(0, 0, 1280, 720); rect(0, 560, 1280, 160, '#1f2a44', { lw: 0 }); person(640, 900, 2.6, CAST.ypourgos, { t, talk: talk('ypourgos', t), legs: 'stand', mouth: 'smile', brow: 'up', look: [0, .1], noShadow: true }); tie(640, 900, 2.6); txt('ΥΠΟΥΡΓΕΙΟ · VIDEO CALL', 640, 60, 50, '#1f2a44', { font: TVFONT, weight: 900 }); }, {});
  // the ribbon across the stage steps
  const cut = t > M.open.a + .4;
  if (!cut) curve([[300, 520], [480, 530]], 5, '#e8392b'); else { curve([[300, 520], [370, 560]], 5, '#e8392b'); curve([[410, 560], [480, 530]], 5, '#e8392b'); }
  const la = (who, rest) => lookAtSpeaker(t, who, { ...X, perifereiarchis: X.perif, ypourgos: 920 }, rest);
  stand(X.perif, 'perifereiarchis', 1, { t, talk: talk('perifereiarchis', t), look: la('perifereiarchis', [1, 0]), mouth: 'smile', brow: 'up', R: t < M.call.a ? [80, -80] : [44, -24], L: [-44, -24] });
  if (t < M.call.a) { ctx.save(); ctx.translate(X.perif + 80, standY() - 80); rect(-4, -26, 8, 30, '#c8ccd2', { lw: 2 }); ctx.restore(); }   // scissors
  const gtk = talk('giorgos', t);
  person(X.giorgos, standY() - 60, 1, CAST.giorgosJacket, { t, talk: gtk, legs: 'stand', look: inM(t, M.light) || inM(t, M.shrug, 0, .6) ? [.3, -.8] : la('giorgos', [0, .1]), brow: 'up', mouth: inM(t, M.shrug) ? 'flat' : 'smile', R: inM(t, M.shrug) ? [80, -130] : gesture(t, gtk), L: inM(t, M.shrug) ? [-80, -130] : [-44, -24] });
  neoiPyramid(1050, 690, 6, t, .26);
  stand(X.neos - 150, 'neosSuit', .9, { t, talk: talk('neos', t), look: la('neos', [-1, 0]), mouth: 'smile', brow: 'up', dir: -1 }); tie(X.neos - 150, standY(.9), .9);
  // the audience, backs to camera: rows of heads on plastic chairs
  for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) { const x = 80 + i * 140 + r * 70, y = 660 + r * 50; blob(x, y, 34, 40, ['#3a2a20', '#e8e4dc', '#1a1512', '#8a8a92'][(i + r) % 4], { lw: 3 }); rect(x - 44, y + 20, 88, 60, '#efeadb', { lw: 3 }); }
  ctx.restore();
  if (t > M.light.a - 3) applyLight('dusk', .5);
  if (inM(t, M.light) || inM(t, M.shrug)) { ctx.save(); applyCam(c); const k = prog(t, M.light.a, M.shrug.b); const sx = lerp(-100, 1400, k), sy = 120 - Math.sin(k * Math.PI) * 60; blob(sx, sy, 5, 5, '#ffd8d8', { lw: 0 }); glow(sx, sy, 60, 'rgba(255,60,60,1)', .6); ctx.restore(); }
  if (inM(t, M.open, .4, 0)) { sfxText('ΤΣΑΚ', 390, 470, 50, -.1, '#fff'); }
  vignette(.35);
}
return {
  id: 'scene26', title: '26 · Κίνημα', steps, render,
  events: M => [[M.crowd.a + .3, SFX.applause], [M.open.a + .4, () => { SFX.slap(); SFX.applause(); }], [M.call.a, () => tone(700, .3, 'sine', .04)], [M.rising.b, SFX.applause], [M.light.a + .3, () => tone(1600, 1.8, 'sine', .02, .5)]],
  ambience: () => ({ cicada: .02 }),
};
})());
