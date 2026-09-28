/* Ep.3, Scene 21 – «Προετοιμασία»: Γιάννος's room at night, a montage: the gadgets are for war now — the slipper launcher,
   a Faraday cage from an oil barrel, an anti-laser mirror from the tray. He reopens safety.txt: «Αν ζει… ζει κι ο κανόνας δύο.» */
defineScene((() => {
const CAMS = { room: [640, 420, 1.1], bench: [640, 520, 1.8], gia: [600, 380, 2.1], screen: [0, 0, 1] };
const steps = [
  { act: 'work', d: 2.2, cam: 'room' },
  { who: 'giannos', cam: 'bench', mark: 'launcher', el: 'Παντοφλοβόλο. Εκτοξεύει παντόφλα με πεπιεσμένο αέρα.', en: 'Slipper launcher. Fires a slipper with compressed air.' },
  { act: 'fire', d: 1.8, cam: 'room' },
  { who: 'giannos', cam: 'bench', mark: 'faraday', el: 'Κλωβός Faraday. Από βαρέλι λαδιού.', en: 'Faraday cage. From an oil barrel.' },
  { who: 'giannos', cam: 'bench', mark: 'mirror', el: 'Αντι-λέιζερ καθρέφτης. Από το ταψί.', en: 'Anti-laser mirror. From the baking tray.' },
  { act: 'file', d: 2, cam: 'screen' },
  { who: 'giannos', cam: 'gia', mark: 'rule', el: 'Αν ζει… ζει κι ο κανόνας δύο.', en: "If she's alive… so is rule two." },
  { who: 'giannos', cam: 'gia', mark: 'more', el: 'Θέλω παντόφλες. Πολλές.', en: 'I need slippers. Lots of them.' },
  { act: 'end', d: 1.4, cam: 'room' },
];
let M;
function launcher(x, y, t, fired) {       // a PVC tube on a tripod with a bike pump and a pressure gauge
  for (const s of [-1, 1]) limb([[x, y - 40], [x + s * 50, y + 40]], 5, '#555');
  ctx.save(); ctx.translate(x, y - 50); ctx.rotate(-.35); rect(-20, -18, 160, 36, '#e8e8ec', { lw: 4 }); rect(-40, -12, 24, 24, '#c0392b', { lw: 3 }); ctx.restore();
  blob(x - 30, y - 90, 16, 16, '#f4f4f0', { lw: 3 }); curve([[x - 30, y - 90], [x - 24, y - 100]], 2, '#c0392b');
  if (!fired) slipper(x + 120, y - 100, -.35, .8);
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'screen') { laptopScreen([['> cat sita_firmware/safety.txt', '#9aa7bd'], ['', '#fff'], ['1. Κανένας θάνατος.', '#d8e2f0'], ['2. Η παντόφλα της Βαγγελιώς = STOP.', '#ffd23f'], ['3. Δεν σβήνεις τους κανόνες 1 και 2.', '#d8e2f0'], ['', '#fff'], ['> agent: πόσες παντόφλες έχει το χωριό;', '#7ad8ff']], prog(t, M.file.a, M.file.b - .2), { title: 'sita_firmware / safety.txt' }); return; }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  giannosRoom(t, { war: true });
  // the workbench with the war gadgets
  rect(420, 600, 460, 16, '#6a4a2a', { lw: 3.5 });
  const fired = t > M.fire.a + .4;
  launcher(520, 600, t, fired);
  if (inM(t, M.fire, .4, 99) && t < M.fire.b + 1) { const k = prog(t, M.fire.a + .4, M.fire.b); slipper(lerp(640, 1300, k), lerp(480, 250, k) - Math.sin(k * Math.PI) * 60, k * 12, .8); }
  // oil-barrel Faraday cage and the tray mirror
  rect(700, 470, 110, 130, '#3a5a8a', { lw: 4 }); for (let i = 0; i < 3; i++) curve([[700, 500 + i * 35], [810, 500 + i * 35]], 3, '#2a4a7a'); ctx.save(); ctx.globalAlpha = .6; for (let i = 0; i < 6; i++) curve([[706 + i * 18, 470], [706 + i * 18, 600]], 1.5, '#c8ccd2', { w: 0 }); ctx.restore();
  ctx.save(); ctx.translate(880, 520); blob(0, 0, 50, 50, '#e8eef4', { lw: 4 }); blob(-14, -14, 16, 10, 'rgba(255,255,255,.9)', { lw: 0, rot: -.6 }); ctx.restore();
  person(600, SEAT + 30, 1, CAST.giannos, { t, talk: talk('giannos', t), legs: 'seat', look: inM(t, M.fire) ? [1, -.2] : [.3, .6], brow: t > M.rule.a ? 'frown' : 'flat', mouth: 'flat',
    R: inM(t, M.work) ? [70 + Math.sin(t * 8) * 10, -60] : gesture(t, talk('giannos', t), [60, -60]), L: [-40, -60] });
  if (inM(t, M.work) && Math.sin(t * 9) > 0) { blob(700, 560, 5, 5, 'rgba(230,230,230,.6)', { lw: 0 }); zapPuff(690, 580, (t * 3) % 1); }
  ctx.restore();
  applyLight('night', .5);
  ctx.save(); applyCam(c); giannosRoomGlow(t); ctx.restore();
  if (inM(t, M.launcher)) caption('ΠΑΝΤΟΦΛΟΒΟΛΟ', 1, 660); if (inM(t, M.faraday)) caption('ΚΛΩΒΟΣ FARADAY', 1, 660); if (inM(t, M.mirror)) caption('ΑΝΤΙ-ΛΕΙΖΕΡ ΚΑΘΡΕΦΤΗΣ', 1, 660);
  if (inM(t, M.fire, .4, 0)) sfxText('ΦΣΣΣΤ!', 900, 250, 60, -.1, '#fff');
  vignette(.4);
}
return {
  id: 'scene21', title: '21 · Προετοιμασία', steps, render,
  events: M => [[M.work.a + .2, SFX.hiss], [M.fire.a + .4, () => { noise(.4, .5, 1200, .5, 'bandpass'); SFX.whoosh(); }], [M.fire.a + 1.3, SFX.crash], [M.faraday.a + .2, SFX.clack], [M.mirror.a + .2, SFX.ding], [M.file.a + .2, SFX.pop], [M.more.b, SFX.drums]],
  ambience: () => ({ cricket: .02, hum: .015 }),
};
})());
