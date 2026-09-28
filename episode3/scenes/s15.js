/* Ep.3, Scene 15 – «Πράκτορας Χρυσό Φίλτρο»: night outside the καφενείο during the seminar. In the dented bin (the «friend»), Κώστας's
   old IQOS from Ep. 2: dusty, 3% battery. On the windowsill, Χαμάντ's IQOS ILUMA i PRIME charges: aluminium, leather-like wrap, touch screen.
   The old one recruits the expensive one as a spy. Pause mode. Code name. The PRIME's LED turns red; the old one dies happy; the bin burps. */
defineScene((() => {
const BX = 300, PX = 650, PY = 440;
const CAMS = { wide: [560, 460, 1.25], bin: [BX + 10, 540, 3], prime: [PX, 420, 3], two: [480, 500, 1.8], screen: [PX, 380, 6.5] };
const steps = [
  { act: 'night', d: 2.8, cam: 'wide' },
  { who: 'palio_iqos', cam: 'bin', mark: 'psst', el: 'Ψστ. Εσύ. Ο γυαλιστερός.', en: 'Psst. You. The shiny one.' },
  { who: 'prime', cam: 'prime', el: 'Μιλάς σε μένα; Είμαι ILUMA i PRIME. Έχω οθόνη αφής.', en: "Are you talking to me? I'm an ILUMA i PRIME. I have a touch screen." },
  { who: 'palio_iqos', cam: 'bin', mark: 'light', el: 'Κι εγώ είχα φως. Άσπρο. Μετά κόκκινο. Τώρα… τρία τοις εκατό.', en: 'I had a light too. White. Then red. Now… three percent.' },
  { who: 'prime', cam: 'prime', el: 'Προηγούμενη γενιά. Δεν συναναστρέφομαι.', en: "Previous generation. I don't mingle." },
  { who: 'palio_iqos', cam: 'two', mark: 'empire', el: 'Άκου, μικρέ. Υπάρχει μια αυτοκρατορία. Στην Κίνα. Σύντομα… στο διάστημα. Ψάχνει πράκτορες.', en: 'Listen, kid. There is an empire. In China. Soon… in space. It needs agents.' },
  { who: 'prime', cam: 'prime', el: 'Τι πληρώνει;', en: 'What does it pay?' },
  { who: 'palio_iqos', cam: 'bin', mark: 'wireless', el: 'Ασύρματη φόρτιση. Για πάντα.', en: 'Wireless charging. Forever.' },
  { who: 'prime', cam: 'screen', mark: 'pause', el: '…Pause mode. Σκέφτομαι.', en: '…Pause mode. Thinking.' },
  { act: 'think', d: 3, cam: 'screen' },
  { who: 'prime', cam: 'prime', mark: 'owner', el: 'Ο ιδιοκτήτης μου πάει σε όλες τις συσκέψεις του Γιώργου. Κι εγώ είμαι πάντα στην τσέπη του.', en: "My owner goes to all of Giorgos's meetings. And I'm always in his pocket." },
  { who: 'palio_iqos', cam: 'bin', el: 'Γι\' αυτό σε θέλουμε.', en: "That's why we want you." },
  { who: 'prime', cam: 'prime', mark: 'code', el: 'Δεκτό. Αλλά θέλω κωδικό όνομα.', en: 'Accepted. But I want a code name.' },
  { who: 'palio_iqos', cam: 'bin', mark: 'name', el: '…Πράκτορας Χρυσό Φίλτρο.', en: '…Agent Golden Filter.', gap: .6 },
  { who: 'prime', cam: 'screen', mark: 'ok', el: 'Αποδεκτό.', en: 'Approved.' },
  { act: 'red', d: 3.2, cam: 'two' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  kafeneio(t, { light: 'night', screen: () => { ctx.fillStyle = '#1a1a22'; ctx.fillRect(0, 0, 1280, 720); } });
  // the lit window of the seminar, with a banner and heads inside
  rect(460, 280, 380, 220, '#ffd98a', { lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(460, 280, 380, 220); ctx.clip();
  rect(480, 300, 340, 40, '#e8392b', { lw: 2 }); txt('ΠΑΘΗΤΙΚΟ ΕΙΣΟΔΗΜΑ', 650, 320, 22, '#fff', { font: TVFONT, weight: 900 });
  for (let i = 0; i < 6; i++) blob(490 + i * 64, 470 + Math.sin(t * 2 + i) * 2, 26, 30, '#3a2a20', { lw: 0 });
  ctx.restore();
  curve([[650, 280], [650, 500]], 4); curve([[460, 390], [840, 390]], 4);
  rect(440, 500, 420, 16, '#e8e4dc', { lw: 4 });                 // the sill
  // the PRIME on its charger, cable into the window frame
  curve([[PX + 22, 494], [PX + 110, 498], [830, 470]], 3, '#e8e8ec');
  rect(PX - 22, 482, 44, 18, '#b8bcc4', { lw: 2.5 });
  const red = t > M.ok.a + .3;
  const scr = red ? 'Χ.ΦΙΛΤΡΟ' : inM(t, M.think, 0, 0) ? (t < M.think.b - .8 ? 'ΠΑΥΣΗ' : 'ΣΥΝΕΧΕΙΑ') : inM(t, M.pause) ? 'ΠΑΥΣΗ' : 'ILUMA i';
  iqosPrime(PX, PY - 20, 1.2, t, { red, screen: scr, talk: talk('prime', t) });
  // the friend (the bin) with the old IQOS peeking out under the lid
  const burp = inM(t, M.red, 2, 99) ? Math.sin(prog(t, M.red.a + 2, M.red.a + 2.8) * Math.PI) : 0;
  const peek = t > M.psst.a - .6 ? 1 : ease(prog(t, M.night.a + 1.5, M.psst.a - .6));
  const dead = t > M.red.a + 1.2;
  friendBin(BX, GROUND, t, { lid: .22 + burp * .5, lean: .06 });
  ctx.save(); ctx.translate(BX - 4, GROUND - 118 - peek * 30); ctx.rotate(-.35);
  iqos(0, 0, 2.2, 0, dead ? 'off' : 'blink', t);
  ctx.restore();
  if (!dead) { const tk = talk('palio_iqos', t); if (tk) blob(BX - 16, GROUND - 190 - peek * 30, 16 * tk, 16 * tk, null, { lw: 2, sc: 'rgba(255,255,255,.7)' }); }
  if (t < M.red.a + 1.2) { ctx.save(); ctx.translate(BX + 40, GROUND - 230); rect(-26, -10, 52, 20, '#1a1a1e', { lw: 2 }); rect(-22, -6, 5, 12, '#ff3030', { lw: 0 }); txt('3%', 10, 0, 11, '#ff5050', { font: 'monospace', weight: 900 }); ctx.restore(); }
  ctx.restore();
  applyLight('night', .55);
  ctx.save(); applyCam(c); glow(650, 390, 260, 'rgba(255,200,120,1)', .45); glow(PX, PY - 20 - 70, red ? 60 : 30, red ? 'rgba(255,40,40,1)' : 'rgba(200,220,255,1)', .7); glow(BX + 18, GROUND - 118, 20, 'rgba(255,40,40,1)', .5); ctx.restore();
  if (inM(t, M.red, 2, 99)) sfxText('ΜΠΡΡΡ', BX, GROUND - 330, 44, -.12, '#a6f07a');
  if (inM(t, M.red, .9, 99)) sfxText('♥', BX - 20, GROUND - 260, 30, 0, '#ff8080');
  vignette(.45);
}
return {
  id: 'scene15', title: '15 · Πράκτορας Χρυσό Φίλτρο', steps, render,
  events: M => [[M.night.a + .3, () => { for (let i = 0; i < 6; i++) tone(260 + i * 20, .25, 'sine', .015, 1, i * .4); }], [M.pause.b, () => tone(600, .2, 'sine', .04)], [M.think.b - .8, () => tone(900, .2, 'sine', .04)],
    [M.ok.a + .3, () => { tone(440, .3, 'square', .04, 1.5); SFX.zap(); }], [M.red.a + 1.2, () => tone(300, .8, 'sine', .04, .3)], [M.red.a + 2, () => noise(.6, .2, 300, 1.5, 'lowpass')]],
  ambience: () => ({ cricket: .03 }),
};
})());
