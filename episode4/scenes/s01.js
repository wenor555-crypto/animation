/* Ep.4, Scene 1 – «Mixology» (cold open): night, Κώστας's home bar. Sober, lab-precise: a whiskey sour with a dry shake.
   The song plays from a Bluetooth speaker (thin, in the room). On the chorus: glass one, glass two; on «I know you got my
   message» a thread of unanswered texts to the σίτα; on «alone» the third glass, and he becomes Panik (no manga: raw).
   The sound opens to full range, he calls her: «Έρχομαι να σε βρω. …Δεν έχω κανέναν άλλο να βρω.» Cut. Title.
   The timing is locked to the cue «cold_open» (music/cues.json): the chorus lands 8.2 s after the music starts. */
defineScene((() => {
const PH = ['ΣΙΤΑ (τηλέφωνο)', 'SITA (phone)'];
const CAMS = { wide: [640, 400, 1.05], hands: [660, 440, 2.2], face: [640, 360, 2.3], glass: [700, 440, 1.8], sms: [0, 0, 1], panik: [640, 350, 2.1], title: [0, 0, 1] };
const L1 = 'Εξήντα bourbon. Τριάντα λεμόνι. Είκοσι σιρόπι.', L2 = 'Ένα ασπράδι. Dry shake. Χωρίς πάγο. Για τον αφρό.';
// the shake fills the time until the chorus (cue 8.2 s after the music starts at the scene's .6 s)
const dur = (k, el) => (window.CLIP_DUR || {})[k] ?? estDur(el);
const SHAKE = Math.max(.4, .6 + 8.2 - (.6 + 1.2 + .3 + dur('scene01/01', L1) + .12 + .3 + dur('scene01/02', L2) + .12));
const steps = [
  { act: 'intro', d: 1.2, cam: 'wide' },
  { who: 'kostas', cam: 'hands', mark: 'pour', el: 'Εξήντα bourbon. Τριάντα λεμόνι. Είκοσι σιρόπι.', en: 'Sixty bourbon. Thirty lemon. Twenty syrup.', say: 'Εξήντα μπέρμπον. Τριάντα λεμόνι. Είκοσι σιρόπι.' },
  { who: 'kostas', cam: 'face', mark: 'egg', el: 'Ένα ασπράδι. Dry shake. Χωρίς πάγο. Για τον αφρό.', en: 'One egg white. Dry shake. No ice. For the foam.', say: 'Ένα ασπράδι. Ντράι σέικ. Χωρίς πάγο. Για τον αφρό.' },
  { act: 'shake', d: SHAKE, cam: 'hands' },
  { act: 'chorus', d: 12.5, cam: 'glass' },
  { act: 'thread', d: 7.3, cam: 'sms' },
  { act: 'alone', d: 1.6, cam: 'face' },
  { who: 'sita', label: PH, fx: 'phone', cam: 'panik', mark: 'call', el: 'Σίτα Έι Άι, καλησπέρα, πώς μπορώ—', en: 'SitaAI, good evening, how can I—', gap: .1 },
  { who: 'panik', cam: 'panik', mark: 'come', el: 'Έρχομαι να σε βρω. …Δεν έχω κανέναν άλλο να βρω.', en: "I'm coming to find you. …I have no one else to find.", gap: .05 },
  { act: 'title', d: 3.2, cam: 'title' },
];
let M;
const TEXTS = [['Μαρμοκοτρόκο.', 0], ['Σικαρέλο.', 1.4], ['Πού είσαι;', 2.8], ['Τρουμπουλέκο.', 4.0], ['…', 5.2]];
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'sms') {
    const msgs = TEXTS.map(([s, d]) => ({ me: true, text: s, at: M.thread.a - 30 + d * 3 }));   // sent over the last weeks, all unanswered
    smsScreen(t, msgs, { from: 'Σίτα 💔', sub: 'Τελευταία σύνδεση: ποτέ', typing: 'Γιατί δεν', typingK: prog(t, M.thread.a + 2.5, M.thread.b - .4) });
    return;
  }
  if (shot === 'title') {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0c0806'; ctx.fillRect(0, 0, W, H);
    const k = prog(t, M.title.a, M.title.a + .5);
    ctx.globalAlpha = k; txt('WHISKEY SOUR', 640, 340, 92, '#e0a040', { font: TVFONT, weight: 900, stroke: 6, sc: '#3a1a0a' });
    txt('Η Έξυπνη Σίτα · Επεισόδιο 4', 640, 430, 28, '#fbf4e2', { font: TVFONT, weight: 700 });
    ctx.restore(); return;
  }
  const c = shotCam(sc, t, CAMS);
  const panik = t > M.alone.a + 1.2;                                 // the change, on the tail of «alone»
  const drinking = (a, b) => t > a && t < b;
  // the three glasses: [lift time, done time]
  const G = [[M.chorus.a + 2.5, M.chorus.a + 5], [M.chorus.a + 8.5, M.chorus.a + 11], [M.alone.a + .1, M.alone.a + 1.1]];
  const cur = G.findIndex(([a, b]) => t < b), done = G.filter(([, b]) => t >= b).length;
  ctx.save(); applyCam(c);
  kostasBar(t, {});
  let R = [56, -60], itemR = null, L = [-40, -50], itemL = null, st = {};
  if (t < M.egg.a) { R = [40 + Math.sin(t * 3) * 10, -80]; itemR = 'shaker'; }
  else if (t < M.chorus.a) { R = [60, -150]; L = [-50, -150]; itemR = 'shaker'; st = { shake: inM(t, M.shake) || inM(t, M.egg, .8) }; }
  else if (cur >= 0 && cur < 3 && t > G[cur][0] - 1.2) {
    const [a, b] = G[cur], up = drinking(a, b);
    R = up ? [30, -200] : [60, -70]; itemR = 'sour'; st = { sourFill: up ? 1 - prog(t, a, b) : 1 };
  }
  if (inM(t, M.call) || inM(t, M.come)) { R = [48, -196]; itemR = 'phone'; L = [-40, -40]; itemL = null; }
  stand(640, 'kostas', 1, { t, talk: talk(panik ? 'panik' : 'kostas', t), look: shot === 'hands' ? [.2, .8] : [.1, .2], lid: !panik && t > M.chorus.a + 6,
    brow: panik ? 'frown' : 'flat', mouth: panik ? 'frown' : 'flat', hood: panik, shades: panik, R, itemR, L, itemL, ...st });
  barCounter(t, { music: 1 });
  for (let i = 0; i < done; i++) sourGlass(420 - i * 60, 450, 0, .9);   // the empties
  if (t < M.chorus.a) { lemon(520, 458); lemon(548, 462, .8); rect(760, 440, 40, 30, '#f4f1ea', { lw: 2.5 }); }   // lemons, the egg cup
  ctx.restore();
  if (panik && t < M.alone.a + 1.45) { fxFlash(1.2 * (1 - prog(t, M.alone.a + 1.2, M.alone.a + 1.45)), '255,230,180'); }
  applyLight('night', .35);
  vignette(panik ? .55 : .4);
}
return {
  id: 'scene01', title: '1 · Mixology', steps, render, fade: false,
  events: M => {
    const T0 = M.chorus.a - 8.2, rel = L => [L.a - T0, L.b - T0];   // the cue's chorus starts 8.2 s in
    return [
      [T0, () => SND2.music('cold_open', { eq: 'speaker', toFull: M.alone.a + 1.2 - T0, lines: [rel(M.pour), rel(M.egg)], vol: 1, duck: .35, fadeOut: [M.call.a - T0, .3] })],
      [M.egg.a + .8, SFX.clacks], [M.chorus.a + 2.5, SFX.sip], [M.chorus.a + 8.5, SFX.sip], [M.alone.a + .1, SFX.sip],
      [M.alone.a + 1.2, () => SND2.sfx('whoosh', .8, { rate: .7 })], [M.call.a - .2, SFX.phone], [M.come.b, SFX.clack], [M.title.a, () => SND2.sfx('boom_small', .5, { rate: .6 })],
    ];
  },
  ambience: () => ({ hum: .015 }),
};
})());
