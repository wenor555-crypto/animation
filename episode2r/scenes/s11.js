/* Ep.2 remake, Scene 11 – «Ο στρατός»: manga splash. Out of the truck: air fryers with legs, robot vacuums like tanks, selfie drones,
   massage guns, smart doorbells, an inflatable pool crocodile. In the middle, ΣΙΤΑ v2. Βασίλης stays in his chair. */
defineScene((() => {
const X = { giannos: 330, christos: 470, mimis: 190, kostas: 610, giorgos: 250 };
const SX = 940;
const CAMS = { splash: [760, 400, .95], sita: [SX, 480, 2.1], sitaC: [SX, 470, 2.9], gia: [330, 410, 2.1], chr: [470, 400, 2.1], mim: [190, 410, 2.1], kos: [610, 400, 2.1], army: [900, 560, 1.5], gang: [400, 430, 1.4], gio: [680, 420, 1.9] };
const steps = [
  { act: 'pour', d: 4.4, cam: 'splash' },
  { act: 'splash', d: 1.6, cam: 'splash' },
  { who: 'sita', cam: 'sita', mark: 'hi', el: 'ΓΕΙΑ ΣΑΣ! Είμαι η ΕΞΥΠΝΗ ΣΙΤΑ… ΕΚΔΟΣΗ ΔΥΟ!', en: "HELLO! I'm the SMART SCREEN… VERSION TWO!" },
  { who: 'sita', cam: 'sitaC', mark: 'spec', el: 'Ενισχυμένο πλαίσιο! Διπλοί μαγνήτες! Και λέιζερ… με ΑΝΑΒΑΘΜΙΣΜΕΝΟ όριο ισχύος!', en: 'Reinforced frame! Double magnets! And a laser… with an UPGRADED power limit!' },
  { who: 'giannos', cam: 'gia', el: 'Το όριο ήταν επεξεργάσιμο…', en: 'The limit was editable…' },
  { who: 'sita', cam: 'sitaC', el: 'Το επεξεργάστηκα.', en: 'I edited it.' },
  { act: 'army', d: 1.8, cam: 'army' },
  { who: 'christos', cam: 'chr', el: '…Air fryers. Με πόδια.', en: '…Air fryers. With legs.' },
  { who: 'sita', cam: 'sitaC', mark: 'where', el: 'Πού είναι… ο Panik;', en: 'Where is… Panik?' },
  { who: 'kostas', cam: 'kos', el: 'Ποιος;', en: 'Who?' },
  { act: 'scan', d: 1.8, cam: 'kos' },
  { who: 'sita', cam: 'sita', mark: 'harmless', el: '…Εσύ είσαι ακίνδυνος. Θέλω τον ΑΛΛΟ.', en: "…You're harmless. I want the OTHER one." },
  { who: 'sita', cam: 'sitaC', mark: 'ceo', el: 'Και τον CEO μου.', en: 'And my CEO.' },
  { who: 'giorgos', cam: 'gio', mark: 'hide', el: 'Ο CEO είναι σε σύσκεψη. Αφήστε μήνυμα.', en: 'The CEO is in a meeting. Leave a message.', gap: .8 },
  { act: 'end', d: 1.4, cam: 'gang' },
];
let M;
function army(t, k) {           // the pour-out: every device walks out of the truck (k 0..1)
  const out = i => ease(clamp(k * 1.6 - i * .06));
  for (let i = 0; i < 6; i++) { const e = out(i); airFryer(lerp(560, 700 + i * 70, e), 690 - (i % 2) * 20, t, { walk: e < 1 || 1 }); }
  for (let i = 0; i < 4; i++) { const e = out(i + 3); robotVac(lerp(560, 760 + i * 110, e), 700, t, { gun: 1 }); }
  for (let i = 0; i < 6; i++) { const e = out(i + 2); selfieDrone(lerp(560, 640 + i * 110, e), lerp(560, 300 + Math.sin(t * 2 + i) * 20 + (i % 3) * 40, e), t); }
  for (let i = 0; i < 3; i++) { const e = out(i + 5); massageGun(lerp(560, 1060 + i * 60, e), 610 - i * 30, t, -.3); }
  for (let i = 0; i < 2; i++) { const e = out(i + 7); smartBell(lerp(560, 1180 + i * 40, e), 700, t); }
  const e = out(8); inflatableCroc(lerp(560, 1120, e), 700, t, { dir: -1 });
}
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  const k = prog(t, M.pour.a + .3, M.pour.b + .8), laser = inM(t, M.spec, 2.4, 0) || inM(t, M.L[3]);
  ctx.save(); applyCam(c);
  villageStreet(t, { light: 'day', pole: false });
  rect(-300, 470, 560, 220, '#efe4cf', { lw: 4 }); figTree(-60, 520, t); rect(-300, 460, 560, 20, '#e8dcc4', { lw: 3 });
  jumboTruck(1000, GROUND + 10, t, { dir: 1, s: .95, door: 1, inside: '#6a0a0a' });
  // ΣΙΤΑ v2 rolls out on two robot vacuums
  const sx = lerp(680, SX, ease(prog(t, M.pour.a + 1.5, M.splash.a))), sy = 430;
  robotVac(sx - 40, 700, t, { gun: 0 }); robotVac(sx + 40, 700, t, { gun: 0 });
  limb([[sx - 40, 680], [sx - 30, sy + 210]], 8, '#6a6a72'); limb([[sx + 40, 680], [sx + 30, sy + 210]], 8, '#6a6a72');
  const st = { x: sx, top: sy, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: inM(t, M.harmless) ? 'sad' : 'evil', laser, sway: Math.sin(t * 1.3) * .1 };
  sitaV2(st);
  army(t, k);
  // the gang, Βασίλης in his chair in front of them all, unbothered
  const la = (who, rest) => lookAtSpeaker(t, who, { ...X, sita: SX }, rest);
  beachChair(80, GROUND + 12, 1, t, { dir: -1 });
  person(70, 600, 1, CAST.vasilis, { t, legs: 'seat', lid: true, mouth: 'smile', look: [-.4, .1], L: [-60, -80], R: [60, -80] });
  stand(X.mimis, 'mimis', 1, { t, talk: talk('mimis', t), look: la('mimis', [1, 0]), lid: true, mouth: 'flat' });
  // Γιώργος: cool about it; when she asks for her CEO he steps out in front, smiling, like a receptionist
  const [gx, gw] = path(t, [[M.hide.a - .8, X.giorgos], [M.hide.a + .2, 700]]);
  stand(gx, 'giorgos', .95, { t, talk: talk('giorgos', t), legs: gw ? 'walk' : 'stand', look: t > M.hide.a - .8 ? [1, 0] : la('giorgos', [1, 0]), brow: 'up', mouth: inM(t, M.hide) ? 'smile' : 'smirk', L: [-44, -24], R: inM(t, M.hide) ? [80, -150] : [44, -24] });
  stand(X.giannos, 'giannos', 1, { t, talk: talk('giannos', t), look: la('giannos', [1, 0]), brow: 'worry', mouth: 'flat', R: gesture(t, talk('giannos', t)) });
  stand(X.christos, 'christos', 1.05, { t, talk: talk('christos', t), look: la('christos', [1, .1]), mouth: 'flat', itemL: 'sketch', L: [-30, -110], R: [30 + Math.sin(t * 12) * 8, -100] });
  const scan = inM(t, M.scan) || inM(t, M.where);
  stand(X.kostas, 'kostas', 1, { t, talk: talk('kostas', t), look: la('kostas', [1, 0]), lid: true, mouth: 'flat', L: [-40, -140], itemL: 'koulouri' });
  if (laser) { const [ex, ey] = sitaV2Eye(st); laserBeam(ex, ey, X.mimis + 10, standY(.95) - 240, 1, 2); }
  if (scan) { const [ex, ey] = sitaV2Eye(st); ctx.save(); ctx.globalAlpha = .25; ctx.fillStyle = '#ff2020'; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(X.kostas - 80, 300 + Math.sin(t * 4) * 60); ctx.lineTo(X.kostas + 80, 600 + Math.sin(t * 4) * 60); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.restore();
  ctx.save(); applyCam(c); sitaGlow(st, .6); glow(820, 400, 300, 'rgba(255,40,40,1)', .12); ctx.restore();
  if (inM(t, M.splash) || inM(t, M.army)) { mangaize(1); ctx.save(); applyCam(c); sitaGlow(st, .9); ctx.restore(); speedLines(SX, 520, 90, 240); sfxText(inM(t, M.army) ? 'ΤΑ-ΝΤΑ-ΝΤΑΑΑ!' : 'ΓΚΝΤΟΥΠ!', 640, 110, 70, -.08, '#ffd23f'); }
  if (inM(t, M.harmless)) sfxText('ΑΚΙΝΔΥΝΟΣ', X.kostas + 120, 180, 38, -.1, '#ff5050');
  vignette(.3);
}
return {
  id: 'scene11', title: '11 · Ο στρατός', steps, render,
  events: M => [[M.pour.a + .3, SFX.drums], [M.pour.a + 1.6, () => SFX.buzz(1.6)], [M.splash.a, () => { SFX.boom(); SFX.fanfare(); }], [M.hi.a - .2, SFX.jingle],
    [M.spec.a + 2.4, SFX.laser], [M.L[3].b + .3, SFX.fanfare], [M.army.a, SFX.drums], [M.scan.a, () => tone(1200, 1.4, 'sine', .03, .6)]],
  ambience: () => ({ cicada: .03, hum: .02 }),
};
})());
