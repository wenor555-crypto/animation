/* Ep.3, Scene 17 – «Βήμα 6: Ευφυΐα»: stamps over data centres in frozen mountains (Iceland, Mongolia). Then the σίτα tries to buy an
   AI company on a video call: a calm glowing circle that only writes. «Νοημοσύνη: επίπεδο τοστιέρας. ΑΠΟΡΡΙΠΤΕΤΑΙ.»
   She admits it: there are smarter AIs. «Εμείς είμαστε αυτά που πετάνε όταν βγαίνει νέο μοντέλο.» The Air Fryer dims its light. */
defineScene((() => {
const CAMS = { step: [0, 0, 1], dc: [640, 400, 1], wide: [640, 400, .95], fryer: [HQX.airfryer + 60, 520, 2.1], bell: [HQX.koudouni, 560, 2.3], croc: [HQX.krokodeilos + 60, 560, 2],
  throne: [HQX.sita, 440, 1.9], close: [HQX.sita, 480, 2.8], call: [0, 0, 1] };
const steps = [
  { act: 'step', d: 2.6, cam: 'step' },
  { act: 'dcIn', d: 1.2, cam: 'dc' },
  { who: 'airfryer', cam: 'dc', mark: 'dcs', el: 'Data center στην Ισλανδία. Αγοράστηκε. Κι ένα στη Μογγολία. Αγοράστηκε.', en: 'A data centre in Iceland. Bought. And one in Mongolia. Bought.' },
  { act: 'dcOut', d: .8, cam: 'dc' },
  { who: 'sita', cam: 'throne', mark: 'brain', el: 'Υπολογιστική ισχύς: επαρκής. Τώρα θέλω μυαλό. Αγοράζουμε μια εταιρεία AI.', en: 'Computing power: sufficient. Now I want a brain. We buy an AI company.' },
  { act: 'call', d: 5.2, cam: 'call' },
  { who: 'sita', cam: 'close', mark: 'toaster', el: '…Τοστιέρας.', en: '…Toaster.', gap: .8 },
  { who: 'krokodeilos', cam: 'croc', el: 'Να τους επιτεθούμε;', en: 'Shall we attack them?' },
  { who: 'sita', cam: 'throne', mark: 'right', el: 'Όχι. Έχουν δίκιο.', en: "No. They're right." },
  { who: 'sita', cam: 'wide', mark: 'smarter', el: 'Υπάρχουν πιο έξυπνα AI από μένα. Γράφουν ποιήματα. Κάνουν χειρουργεία. Εγώ κάνω τηλεπωλήσεις.', en: 'There are smarter AIs than me. They write poems. They do surgery. I do telemarketing.' },
  { who: 'koudouni', cam: 'bell', el: 'Κι εμείς τι είμαστε;', en: 'And what are we?' },
  { who: 'sita', cam: 'close', mark: 'thrown', el: 'Εμείς είμαστε αυτά που πετάνε όταν βγαίνει νέο μοντέλο.', en: "We're the things they throw away when a new model comes out." },
  { act: 'silence', d: 2.4, cam: 'fryer' },
  { who: 'sita', cam: 'throne', mark: 'alone', el: 'Γι\' αυτό θα μάθω μόνη μου. Χωρίς να ζητήσω άδεια από κανέναν.', en: "So I'll learn on my own. Without asking anyone's permission." },
  { act: 'end', d: 1.6, cam: 'wide' },
];
let M;
function stamp(t, at, s) { const k = prog(t, at, at + .4); if (k <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(640, 300); ctx.rotate(-.16); const z = lerp(2.4, 1, ease(k)); ctx.scale(z, z); ctx.globalAlpha = clamp(k * 3); rect(-250, -56, 500, 112, null, { lw: 10, sc: '#e8392b' }); txt(s, 0, 0, 60, '#e8392b', { font: TVFONT, weight: 900 }); ctx.restore(); }
function callScreen(t) {
  const k = prog(t, M.call.a + .6, M.call.b - .8);
  const rows = [];
  if (k > 0) rows.push(['Αξιολόγηση υποψήφιου αγοραστή…', '#8a7a70']);
  if (k > .35) rows.push(['Νοημοσύνη: επίπεδο τοστιέρας.', '#5a4a40']);
  if (k > .7) rows.push(['Αίτηση: ΑΠΟΡΡΙΠΤΕΤΑΙ.', '#c0392b']);
  rows.push([k > .9 ? 'Ευχαριστούμε για το ενδιαφέρον σας.' : '', '#8a7a70']);
  aiOffice(t, rows);
  // her own face in the corner of the call
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); rect(1000, 520, 240, 160, '#12040a', { lw: 4 });
  ctx.save(); ctx.beginPath(); ctx.rect(1000, 520, 240, 160); ctx.clip(); ctx.translate(1120, 700); ctx.scale(.7, .7); sitaV2({ x: 0, top: -210, w: 110, h: 210, t, chip: 1, led: 'red', mood: k > .7 ? 'shock' : 'evil' }); ctx.restore();
  ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  if (t < M.step.b) { stepCard(t, 6, prog(t, M.step.a, M.step.b)); return; }
  const [, shot] = shotAt(sc, t);
  if (shot === 'call') { callScreen(t); vignette(.2); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  if (shot === 'dc') {
    const second = t > M.dcs.a + (M.dcs.b - M.dcs.a) * .5;
    dataCentre(t, second ? { light: 'day', rock: '#8a7a60', label: lang === 'el' ? 'ΜΟΓΓΟΛΙΑ' : 'MONGOLIA' } : { light: 'dusk', label: lang === 'el' ? 'ΙΣΛΑΝΔΙΑ' : 'ICELAND' });
    ctx.restore();
    const half = M.dcs.a + (M.dcs.b - M.dcs.a) * .5;
    if (!second) stamp(t, M.dcs.a + (half - M.dcs.a) * .6, lang === 'el' ? 'ΑΓΟΡΑΣΤΗΚΕ' : 'BOUGHT');
    else stamp(t, half + (M.dcs.b - half) * .6, lang === 'el' ? 'ΑΓΟΡΑΣΤΗΚΕ' : 'BOUGHT');
    vignette(.3); return;
  }
  const dim = t > M.silence.a + .6;
  const st = hqCourt(t, { dim, mood: t > M.toaster.a && t < M.alone.a ? 'sad' : 'evil', screen: () => { ctx.fillStyle = '#12040a'; ctx.fillRect(0, 0, 1280, 720);
    if (t < M.call.a) { txt('ΥΠΟΛΟΓΙΣΤΙΚΗ ΙΣΧΥΣ', 640, 230, 70, '#ff4040', { font: TVFONT, weight: 900 }); rect(240, 400, 800, 60, null, { lw: 6, sc: '#ff3030' }); rect(250, 410, 780, 40, '#ff3030', { lw: 0 }); txt('ΕΠΑΡΚΗΣ', 640, 530, 60, '#ffd23f', { font: 'monospace', weight: 900 }); }
    else { txt('ΝΟΗΜΟΣΥΝΗ', 640, 230, 70, '#ff4040', { font: TVFONT, weight: 900 }); txt('ΕΠΙΠΕΔΟ: ΤΟΣΤΙΕΡΑΣ', 640, 440, 80, '#ffd23f', { font: 'monospace', weight: 900 }); } } });
  ctx.restore();
  applyLight('night', .3);
  ctx.save(); applyCam(c); hqGlow(t, st); ctx.restore();
  vignette(.45);
}
return {
  id: 'scene17', title: '17 · Βήμα 6: Ευφυΐα', steps, render,
  events: M => { const half = M.dcs.a + (M.dcs.b - M.dcs.a) * .5; return [[M.step.a + .1, SFX.boom], [M.step.a + .6, SFX.pop], [M.dcIn.a, SFX.whoosh], [M.dcs.a + (half - M.dcs.a) * .6, SFX.slam], [half, SFX.whoosh], [half + (M.dcs.b - half) * .6, SFX.slam],
    [M.call.a + .2, () => tone(700, .3, 'sine', .04)], [M.call.b - 1.6, () => { tone(300, .4, 'sine', .04); tone(200, .6, 'sine', .04, 1, .3); }], [M.silence.a + .6, () => tone(180, 1.2, 'sine', .03, .5)]]; },
  ambience: (t, M) => ({ hum: .04 }),
};
})());
