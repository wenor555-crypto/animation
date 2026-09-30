/* Ep.3, Scene 10 – «Τα λεφτά έρχονται»: the καφενείο TV shows ΣίταAI up 400%. Γιώργος: «Είναι το όραμα.» The νέος now in a suit:
   a dividend from the Bahamas. Nobody knows where the money comes from — perfect. The pyramid on a napkin, «γνωστοί στον χώρο» at the top. */
defineScene((() => {
const X = { giorgos: 600, neos: 880 };
const CAMS = { chart: [0, 0, 1], wide: [640, 420, 1.1], gio: [600, 380, 2.1], neo: [880, 380, 2.1], two: [740, 400, 1.5], napkin: [0, 0, 1] };
const steps = [
  { act: 'chart', d: 2.2, cam: 'chart' },
  { who: 'tv', cam: 'chart', mark: 'up', el: 'Η ΣίταAI ανεβαίνει τετρακόσια τοις εκατό. Κανείς δεν ξέρει γιατί.', en: 'SitaAI is up four hundred percent. Nobody knows why.' },
  { who: 'giorgos', cam: 'gio', mark: 'vision', el: 'Εγώ ξέρω. Είναι το όραμα.', en: "I know. It's the vision." },
  { act: 'enter', d: 2, cam: 'wide' },
  { who: 'neos', cam: 'neo', el: 'Κύριε Γιώργο, μας ήρθε μέρισμα. Από τις Μπαχάμες.', en: "Mr Giorgos, we've got a dividend. From the Bahamas." },
  { who: 'giorgos', cam: 'gio', el: 'Από πού βγάζουν λεφτά;', en: 'Where do they make their money?' },
  { who: 'neos', cam: 'neo', el: 'Δεν λένε.', en: "They don't say." },
  { who: 'giorgos', cam: 'two', mark: 'trust', el: 'Τέλεια. Αυτό λέγεται εμπιστοσύνη.', en: "Perfect. That's called trust." },
  { act: 'draw', d: 1.6, cam: 'napkin' },
  { who: 'giorgos', cam: 'napkin', mark: 'two', el: 'Φέρνεις δύο φίλους. Αυτοί φέρνουν από δύο φίλους.', en: 'You bring two friends. They each bring two friends.' },
  { who: 'neos', cam: 'neo', el: 'Και στο τέλος;', en: 'And at the end?' },
  { who: 'giorgos', cam: 'gio', mark: 'end', el: 'Στο τέλος δεν φτάνει ποτέ κανείς. Γι\' αυτό είναι τέλος.', en: "Nobody ever gets to the end. That's why it's the end." },
  { who: 'giorgos', cam: 'napkin', mark: 'top', el: 'Και στην κορυφή βάζουμε δικούς μας ανθρώπους. Έχω γνωστούς στον χώρο.', en: 'And at the top we put our own people. I know people in the field.' },
  { act: 'names', d: 2.4, cam: 'napkin' },
];
let M;
function napkin(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#e9dcc4'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(640, 380); ctx.rotate(-.04);
  rect(-360, -300, 720, 600, '#fbfaf6', { lw: 3 }); for (let i = 0; i < 12; i++) { curve([[-360 + i * 60, -300], [-360 + i * 60, 300]], 1, 'rgba(0,0,0,.05)', { w: 0 }); }
  const k = prog(t, M.draw.a, M.two.b), rows = Math.min(5, Math.ceil(k * 5));
  for (let r = 0; r < rows; r++) { const n = 2 ** r; for (let i = 0; i < n && i < 16; i++) { const x = (i - (Math.min(n, 16) - 1) / 2) * (600 / Math.min(n, 16)), y = -200 + r * 90; blob(x, y, 12, 12, null, { lw: 3, sc: '#1a3a8a' }); if (r) curve([[x, y - 12], [(Math.floor(i / 2) - (Math.min(n / 2, 16) - 1) / 2) * (600 / Math.min(n / 2, 16)), y - 78]], 2, '#1a3a8a'); } }
  if (t > M.top.a + 1) { const names = ['λοχίας', 'υπουργός', 'Χαμάντ (Λονδίνο)']; names.forEach((s, i) => { if (t > M.top.a + 1 + i * .7) txt(s, -160 + i * 160, -262 + (i % 2) * 18, 22, '#c0202a', { font: TVFONT, style: 'italic', weight: 900 }); }); }
  txt('ΓΙΩΡΓΟΣ', 0, -250, 18, '#1a3a8a', { font: TVFONT, weight: 900 });
  ctx.restore();
  // his pen hand
  const px = 700 + Math.sin(t * 6) * 60, py = 420 + Math.cos(t * 5) * 40; pencil(px, py, -2.3); blob(px + 34, py + 44, 30, 24, CAST.giorgos.skin, { lw: 3 });
  ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'chart') { stockChart(t, prog(t, M.chart.a, M.up.b)); return; }
  if (shot === 'napkin') { napkin(t); return; }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  kafeneioInside(t, () => stockChart(t, 1));
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  tableOf(t, [[X.giorgos, 'giorgos', { t, talk: talk('giorgos', t), look: la('giorgos', [1, 0]), brow: 'up', mouth: 'smirk', R: gesture(t, talk('giorgos', t), [44, -40]), L: [-44, -40] }]], { cups: [480] });
  if (t > M.enter.a) { const [nx, nw] = path(t, [[M.enter.a, 1400], [M.enter.b, X.neos]]);
    stand(nx, 'neosSuit', .95, { t, talk: talk('neos', t), legs: nw ? 'walk' : 'stand', look: la('neos', [-1, 0]), brow: 'up', mouth: 'smile', dir: -1, L: [-40, -100], itemL: 'clipboard' });
    tie(nx, standY(.95), .95); }
  ctx.restore();
  vignette(.3);
}
return {
  id: 'scene10', title: '10 · Τα λεφτά έρχονται', steps, render,
  events: M => [[M.chart.a + .2, SFX.fanfare], [M.enter.a + .2, SFX.door], [M.draw.a, () => { for (let i = 0; i < 8; i++) noise(.06, .06, 3000, 1, 'bandpass', i * .2); }], [M.names.a, SFX.ding]],
  ambience: () => ({ cicada: .01 }),
};
})());
