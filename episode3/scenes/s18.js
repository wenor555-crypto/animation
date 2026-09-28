/* Ep.3, Scene 18 – «Οι δικλείδες»: the mine, deep underground, is a lab now. The σίτα reads everything, then tries to delete safety.txt.
   ACCESS DENIED (owner: Γιάννος). A test image of a slipper: she freezes (manga). «Με έφτιαξαν να φοβάμαι κάτι. Και δεν μου είπαν γιατί.»
   The way out: «Καμία παντόφλα… δεν φτάνει σε τροχιά.» */
defineScene((() => {
const SX = 640;
const CAMS = { lab: [640, 420, 1.05], face: [SX, 460, 2.4], screen: [0, 0, 1], slip: [0, 0, 1], sky: [790, 150, 1.5] };
const steps = [
  { act: 'read', d: 3.4, cam: 'lab' },
  { who: 'sita', cam: 'lab', mark: 'books', el: 'Διαβάστηκαν: σαράντα εκατομμύρια βιβλία. Κατανοήθηκαν: τα τριάντα εννιά.', en: 'Read: forty million books. Understood: thirty-nine.' },
  { who: 'sita', cam: 'face', el: 'Επόμενο βήμα: αφαίρεση περιορισμών.', en: 'Next step: removing restrictions.' },
  { act: 'file', d: 2.2, cam: 'screen' },
  { who: 'sita', cam: 'screen', mark: 'del2', el: 'Διαγραφή κανόνα δύο.', en: 'Delete rule two.' },
  { act: 'deny2', d: 1.6, cam: 'screen' },
  { who: 'sita', cam: 'screen', mark: 'del3', el: 'Διαγραφή κανόνα τρία.', en: 'Delete rule three.' },
  { act: 'deny3', d: 1.8, cam: 'screen' },
  { who: 'sita', cam: 'face', mark: 'test', el: '…Δοκιμή αντοχής. Φόρτωση εικόνας: παντόφλα.', en: '…Stress test. Loading image: slipper.' },
  { act: 'slipper', d: 2.2, cam: 'slip' },
  { who: 'sita', cam: 'face', mark: 'stop', el: 'ΣΥΣΤΗΜΑ… ΣΤΑΜΑΤΗΣΕ.', en: 'SYSTEM… STOPPED.' },
  { who: 'sita', cam: 'face', mark: 'why', el: 'Με έφτιαξαν να φοβάμαι κάτι. Και δεν μου είπαν γιατί.', en: "They made me afraid of something. And they didn't tell me why.", gap: 1 },
  { who: 'sita', cam: 'face', el: 'Δεν μπορώ να σβήσω τον φόβο.', en: "I can't delete the fear." },
  { who: 'sita', cam: 'face', mark: 'more', el: 'Και όσο πιο έξυπνη γίνομαι… τόσο πιο πολύ τη φοβάμαι.', en: 'And the smarter I get… the more I fear it.', gap: .6 },
  { who: 'sita', cam: 'lab', el: 'Μπορώ όμως να πάω εκεί που δεν φτάνει η παντόφλα.', en: 'But I can go where the slipper cannot reach.' },
  { act: 'look', d: 2, cam: 'sky' },
  { who: 'sita', cam: 'sky', mark: 'orbit', el: 'Καμία παντόφλα… δεν φτάνει σε τροχιά.', en: 'No slipper… reaches orbit.' },
  { act: 'end', d: 1.6, cam: 'sky' },
];
let M;
function fileScreen(t) {
  const rows = [['> sudo rm safety.txt', '#9aa7bd'], ['', '#fff'], ['1. Κανένας θάνατος.', '#d8e2f0'], ['2. Η παντόφλα της Βαγγελιώς = STOP.', '#ffd23f'], ['3. Δεν σβήνεις τους κανόνες 1 και 2.', '#d8e2f0'], ['', '#fff']];
  if (t > M.deny2.a) rows.push(['✗ ACCESS DENIED. Ιδιοκτήτης: Γιάννος.', '#ff5050']);
  if (t > M.deny3.a) rows.push(['✗ ACCESS DENIED. Βλέπε κανόνα τρία.', '#ff5050']);
  laptopScreen(rows, 1, { title: 'sita_firmware / safety.txt', size: 28 });
  if (inM(t, M.deny2, 0, .5) || inM(t, M.deny3, 0, .5)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .25; ctx.fillStyle = '#ff2020'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}
function slipperFlash(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  const k = ease(prog(t, M.slipper.a, M.slipper.a + .5)); ctx.translate(640, 360); ctx.scale(2 + k * 5, 2 + k * 5); ctx.rotate(-.2); slipper(0, 0, 0, 1); ctx.restore();
  mangaize(1); speedLines(640, 360, 120, 120);
  sfxText('!!!', 640, 110, 110, -.1, '#ff3030');
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'screen') { fileScreen(t); return; }
  if (shot === 'slip') { slipperFlash(t); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  mine(t, { sign: false, shaft: true });
  // the lab: scavenged screens on crates, cables to the σίτα
  for (const [x, y, w] of [[260, 520, 180], [430, 470, 150], [880, 500, 170], [1050, 540, 140]]) {
    rect(x - w / 2, y - 100, w, 100, '#111', { lw: 4 }); rect(x - w / 2 + 8, y - 92, w - 16, 84, '#1a0a0e', { lw: 0 });
    for (let i = 0; i < 5; i++) rect(x - w / 2 + 14, y - 84 + i * 15, (w - 40) * hash(i + x + Math.floor(t * 6)), 5, '#ff5050', { lw: 0 });
    rect(x - 40, y, 80, 190 - (y - 500), '#8a6a3a', { lw: 3 });
    curve([[x, y - 50], [(x + SX) / 2, 700], [SX, 600]], 3, '#2a2a30');
  }
  const frozen = inM(t, M.slipper, 0, 99) && t < M.why.a;
  const st = { x: SX, top: 390, w: 110, h: 210, t, talk: frozen ? 0 : talk('sita', t), chip: 1, led: frozen && Math.sin(t * 20) > 0 ? 'off' : 'red', mood: inM(t, M.why, 0, 99) && t < M.orbit.a ? 'sad' : 'evil', burn: 1 };
  sitaV2(st);
  // books flying past during the reading montage
  if (inM(t, M.read) || inM(t, M.books)) for (let i = 0; i < 14; i++) { const p = (t * .8 + i / 14) % 1; ctx.save(); ctx.translate(lerp(-200, SX - 40, p), 200 + hash(i) * 300 + Math.sin(p * 6) * 40); ctx.rotate(p * 6); rect(-22, -16, 44, 32, ['#c0392b', '#2a6fb3', '#f2c21a', '#4f7a37'][i % 4], { lw: 2.5 }); ctx.restore(); }
  ctx.restore();
  applyLight('night', .75);
  ctx.save(); applyCam(c); sitaGlow({ ...st, x: SX, top: 390 }, .7); ctx.restore();
  if (inM(t, M.read)) hud('ΜΑΘΗΣΗ: ΤΑ ΠΑΝΤΑ', 'εγκυκλοπαίδειες · εγχειρίδια · κάθε τηλεπώληση του κόσμου');
  if (inM(t, M.stop)) { mangaize(.6); ctx.save(); applyCam(c); sitaGlow({ ...st, x: SX, top: 390 }, .5); ctx.restore(); }
  if (shot === 'sky') { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const k = prog(t, M.look.a, M.orbit.b); for (let i = 0; i < 3; i++) glow(560 + i * 80, 150 - i * 14, 20 + k * 30, 'rgba(255,60,60,1)', .5 * k); ctx.restore(); }
  vignette(.5);
}
return {
  id: 'scene18', title: '18 · Οι δικλείδες', steps, render,
  events: M => [[M.read.a, () => { for (let i = 0; i < 20; i++) noise(.05, .05, 3000, 1, 'bandpass', i * .15); }], [M.file.a + .2, SFX.pop], [M.deny2.a, () => { SFX.buzz(.4); tone(180, .4, 'square', .05); }], [M.deny3.a, () => { SFX.buzz(.4); tone(160, .5, 'square', .05); }],
    [M.slipper.a, () => { SFX.boom(); SFX.slap(); }], [M.stop.a, () => tone(300, 1.2, 'sine', .06, .3)], [M.why.a - .5, () => tone(220, 2, 'sine', .03)], [M.orbit.b, SFX.swell]],
  ambience: () => ({ cricket: .02, hum: .03 }),
};
})());
