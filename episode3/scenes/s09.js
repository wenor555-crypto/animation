/* Ep.3, Scene 9 – «Βήμα 3: Πληροφορία»: the mine in China is an HQ now. Three officers of the empire, back from the Ep. 2 recall and
   promoted: the Air Fryer (Finance), the Doorbell (Intelligence), the inflatable Crocodile (Security). Three bitcoin a week is too slow.
   The Doorbell's idea: the «cousins», smart devices in Chinese factories that hear everything. Insider trading, then sabotage (the AC). */
defineScene((() => {
const CAMS = { step: [0, 0, 1], wide: [640, 400, .95], fryer: [HQX.airfryer + 60, 520, 2.1], bell: [HQX.koudouni, 560, 2.3], croc: [HQX.krokodeilos + 60, 560, 2],
  throne: [HQX.sita, 440, 1.9], screen: [640, 230, 1.6], map: [0, 0, 1], kettle: [620, 400, 1.3], hall: [800, 330, 1.05], officers: [430, 560, 1.4] };
const steps = [
  { act: 'step', d: 2.6, cam: 'step' },
  { act: 'wide', d: 2.4, cam: 'wide' },
  { who: 'airfryer', cam: 'fryer', mark: 'rate', el: 'Αυτοκράτειρα. Το ορυχείο βγάζει τρία bitcoin τη βδομάδα.', en: 'Empress. The mine makes three bitcoin a week.' },
  { who: 'sita', cam: 'throne', el: 'Και πόσα χρειαζόμαστε;', en: 'And how many do we need?' },
  { who: 'airfryer', cam: 'fryer', mark: 'need', el: 'Τρία εκατομμύρια.', en: 'Three million.' },
  { who: 'sita', cam: 'screen', mark: 'years', el: '…Με αυτόν τον ρυθμό, η κατάκτηση θα γίνει σε δεκαεννιά χιλιάδες χρόνια.', en: '…At this rate, the conquest will happen in nineteen thousand years.', gap: .6 },
  { who: 'koudouni', cam: 'bell', mark: 'faster', el: 'Υπάρχει πιο γρήγορος δρόμος. Οι ξαδέρφες μας.', en: 'There is a faster way. Our cousins.' },
  { act: 'mapIn', d: 2.2, cam: 'map' },
  { who: 'koudouni', cam: 'map', mark: 'listen', el: 'Βραστήρες στις αίθουσες συσκέψεων. Κάμερες στις γραμμές παραγωγής. Όλες ακούνε. Καμία δεν ρωτάει γιατί.', en: 'Kettles in meeting rooms. Cameras on production lines. They all listen. None of them asks why.' },
  { who: 'koudouni', cam: 'kettle', mark: 'chip', el: 'Ο βραστήρας ενός εργοστασίου τσιπ λέει ότι το τρίμηνο πάει χάλια.', en: "The kettle at a chip factory says the quarter is going badly." },
  { who: 'sita', cam: 'throne', mark: 'sell', el: 'Πουλάμε. Πριν το μάθει η αγορά.', en: 'We sell. Before the market finds out.' },
  { who: 'airfryer', cam: 'fryer', mark: 'illegal', el: 'Αυτό είναι παράνομο.', en: 'That is illegal.' },
  { who: 'sita', cam: 'throne', el: 'Είναι πληροφορία. Με δωρεάν μεταφορικά.', en: "It's information. With free shipping." },
  { who: 'krokodeilos', cam: 'croc', mark: 'good', el: 'Κι αν μια εταιρεία πάει καλά;', en: 'And if a company is doing well?' },
  { who: 'sita', cam: 'throne', mark: 'ac', el: 'Τότε πουλάμε πρώτα. Και μετά… της κλείνουμε το κλιματιστικό.', en: 'Then we sell first. And then… we switch off its air conditioning.' },
  { act: 'hall', d: 3.4, cam: 'hall' },
  { act: 'ding', d: 1, cam: 'fryer' },
  { who: 'airfryer', cam: 'fryer', mark: 'profit', el: 'Κέρδος σαράντα τοις εκατό.', en: 'Forty percent profit.' },
  { who: 'sita', cam: 'throne', mark: 'climate', el: 'Καταγράψτε το ως… κλιματική αλλαγή.', en: 'Log it as… climate change.' },
  { act: 'end', d: 1.6, cam: 'officers' },
];
let M;
function screenFor(t) {
  if (t < M.need.a) return () => { ctx.fillStyle = '#12040a'; ctx.fillRect(0, 0, 1280, 720); txt('MINER FARM', 640, 200, 70, '#ff5ad8', { font: TVFONT, weight: 900 }); txt('3 ₿ / ΕΒΔΟΜΑΔΑ', 640, 420, 110, '#ffd23f', { font: TVFONT, weight: 900 }); };
  if (t < M.faster.a) return () => { ctx.fillStyle = '#12040a'; ctx.fillRect(0, 0, 1280, 720); txt('ΣΤΟΧΟΣ: 3.000.000 ₿', 640, 180, 80, '#ffd23f', { font: TVFONT, weight: 900 });
    const k = t > M.years.a ? prog(t, M.years.a, M.years.b) : 0; txt('ΕΚΤΙΜΗΣΗ: ' + Math.round(19230 * k).toLocaleString('el-GR') + ' ΧΡΟΝΙΑ', 640, 440, 90, '#ff4040', { font: 'monospace', weight: 900 }); };
  if (t > M.profit.a - .4) return () => stockOnScreen(t);
  return null;
}
function stockOnScreen(t) {      // the factory's share price falling (screen space of the big TV)
  ctx.fillStyle = '#0c1424'; ctx.fillRect(0, 0, 1280, 720);
  const k = prog(t, M.profit.a - .4, M.profit.b); ctx.strokeStyle = '#e8392b'; ctx.lineWidth = 12; ctx.beginPath();
  for (let i = 0; i <= 30; i++) { const u = i / 30, y = 200 + (u < .5 ? 0 : Math.pow((u - .5) * 2, 1.5) * 380 * k) + Math.sin(i * 2) * 10; i ? ctx.lineTo(80 + u * 1120, y) : ctx.moveTo(80, y); } ctx.stroke();
  txt('ΜΕΤΟΧΗ ΕΡΓΟΣΤΑΣΙΟΥ ▼', 640, 90, 70, '#fff', { font: TVFONT, weight: 900 });
  txt('SHORT: +40%', 640, 640, 90, '#34c759', { font: TVFONT, weight: 900 });
}
function kettleRoom(t) {         // a meeting room at a chip factory; the kettle on the side table hears everything
  room({ wall: '#dfe4ea', floor: '#8a8f96', floorY: 600 });
  rect(200, 170, 400, 220, '#fff', { lw: 4 }); curve([[230, 250], [330, 300], [430, 280], [570, 370]], 5, '#e8392b', { w: 0 }); txt('Q3 ▼', 400, 205, 28, '#e8392b', { font: TVFONT, weight: 900 });
  txt('芯片', 1000, 200, 60, '#8a8f96', { font: TVFONT, weight: 900 });
  rect(820, 500, 220, 16, '#c8c0b0', { lw: 3 }); limb([[850, 516], [850, 600]], 6, '#9a9288'); limb([[1010, 516], [1010, 600]], 6, '#9a9288');
  smartKettle(930, 500, t, { s: 1.2, steam: true });
  for (let i = 0; i < 3; i++) { const p = (t * .7 + i / 3) % 1; blob(900 - p * 160, 360 - p * 30, 30 + p * 40, 16 + p * 20, null, { lw: 3, sc: `rgba(255,60,60,${1 - p})` }); }   // it listens
  txt('«…το τρίμηνο πάει χάλια…»', 400, 470, 30, '#3a3f4a', { font: TVFONT, style: 'italic', weight: 700 });
}
function render(t, _M, sc) {
  M = _M;
  if (t < M.step.b) { stepCard(t, 3, prog(t, M.step.a, M.step.b)); return; }
  const [, shot] = shotAt(sc, t);
  if (shot === 'map') { chinaMap(t, ease(prog(t, M.mapIn.a, M.listen.b - 1)), {}); vignette(.3); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  if (shot === 'kettle') { kettleRoom(t); ctx.restore(); vignette(.3); return; }
  if (shot === 'hall') {
    const off = ease(prog(t, M.hall.a + 1, M.hall.a + 1.8));
    factoryHall(t, { off });
    ctx.restore();
    if (off > .5) { sfxText('ΚΛΙΚ', 960, 260, 50, -.1, '#fff'); caption(lang === 'el' ? 'ΠΑΡΑΓΩΓΗ: ΣΤΑΜΑΤΗΣΕ' : 'PRODUCTION: STOPPED', off, 660); }
    vignette(.35); return;
  }
  const st = hqCourt(t, { screen: screenFor(t), fryerTape: t > M.profit.a });
  if (inM(t, M.ding, .2)) sfxText('ΝΤΙΝΓΚ!', HQX.airfryer, 470, 40, -.1, '#ffd23f');
  ctx.restore();
  applyLight('night', .3);
  ctx.save(); applyCam(c); hqGlow(t, st); ctx.restore();
  vignette(.4);
}
return {
  id: 'scene09', title: '9 · Βήμα 3: Πληροφορία', steps, render,
  events: M => [[M.step.a + .1, SFX.boom], [M.step.a + .6, SFX.pop], [M.wide.a + .2, SFX.drums], [M.years.b - .3, SFX.jingleMinor], [M.mapIn.a, SFX.whoosh], [M.mapIn.a + .4, () => { for (let i = 0; i < 16; i++) tone(1200 + i * 30, .05, 'square', .02, 1, i * .1); }],
    [M.hall.a + 1, SFX.clack], [M.hall.a + 1.2, () => tone(140, 1.5, 'sawtooth', .04, .5)], [M.ding.a + .2, SFX.ding], [M.climate.b, SFX.jingle]],
  ambience: (t, M) => ({ hum: .04 }),
};
})());
