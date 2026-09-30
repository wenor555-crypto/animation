/* Ep.2 remake, Scene 15 – «Η μάχη της αυλής»: the first set piece, staged in depth.
   Background: the back wall with the yard gate (the army comes through it). Midground: the army. Foreground: the gang.
   Phase 1: the cicadas stop, the crocodile blows the gate. Phase 2: arrow headshot on an air fryer (slow motion + hit-stop),
   the racket gun zaps two drones out of the sky, the magnet cannon throws a vacuum-tank into the house wall, the crocodile
   leaps at Γιώργος and hits the ταψί. Phase 3: ΣΙΤΑ v2 lands on the wall, charges, and the laser sweeps the yard:
   a scorch line that stays, the fig tree on fire. The jammer drops the drones like flies, and every phone in the yard with them.
   Μίμης's hen cavalry ends in feathers; the doorbell drags the νέος out through the gate. Retreat to the coop.
   Κώστας eats his κουλούρι through all of it. */
defineScene((() => {
const S = .85, BASE = 775, HIPS = BASE - 150 * S;                     // the foreground plane (the gang)
const X = { mimis: 70, neos: 250, giorgos: 840, giannos: 1020, kostas: 1200 };
const GATE = 560, MID = 705;                                          // the gate in the back wall; the army's ground line
const CHR = [205, 438, .78];                                          // Χρήστος on a branch of the fig tree: x, hips y, scale
const SITA = { x: GATE, top: 222, w: 110, h: 210 };                   // ΣΙΤΑ v2 on top of the wall, over the gate
const FRY = [660, 510, 900, 1000];                                     // where the air fryers stop
const CAMS = {
  est: [640, 470, .92], gia: [X.giannos, 480, 2], chrW: [CHR[0] + 20, 330, 2.2], gate: [GATE, 590, 2.0],
  mim: [X.mimis + 40, 480, 2], low: [640, 560, 1.05], bow: [CHR[0] + 30, 330, 2.8], fryer: [FRY[1] + 20, 640, 2.4], fryer2: [FRY[0], 630, 2.4],
  sky: [560, 330, 1.15], mag: [470, 560, 1.2], gio: [X.giorgos, 490, 2], tray: [700, 560, 1.6], sita: [GATE, 360, 2.2],
  sitaC: [GATE + 18, 312, 3.4], sweep: [640, 470, .95], after: [640, 480, .92], kos: [X.kostas - 20, 490, 2],
};
const steps = [
  { act: 'est', d: 4.4, cam: 'est' },
  { who: 'giannos', cam: 'gia', mark: 'cicadas', el: 'Σταμάτησαν τα τζιτζίκια.', en: 'The cicadas stopped.' },
  { who: 'christos', cam: 'chrW', el: 'Στα κόμικ, αυτό σημαίνει ότι έρχονται.', en: 'In comics, that means they are coming.' },
  { act: 'rumble', d: 1.8, cam: 'gate' },
  { act: 'boom', d: 2.4, cam: 'gate' },
  { who: 'krokodeilos', cam: 'gate', mark: 'deliv', el: 'ΝΤΕΛΙΒΕΡΙ!', en: 'DELIVERY!' },
  { who: 'mimis', cam: 'mim', mark: 'cry', el: 'ΓΙΑ ΤΟ ΛΕΧΑΙΟ!', en: 'FOR LECHAIO!', say: 'Για το Λεχαιόοοο!' },
  { act: 'charge', d: 2.8, cam: 'low' },
  { act: 'draw', d: 3, cam: 'bow' },
  { act: 'hit', d: 1.9, cam: 'fryer' },
  { who: 'christos', cam: 'bow', mark: 'hs', el: 'Headshot. Σε air fryer.', en: 'Headshot. On an air fryer.' },
  { who: 'airfryer', cam: 'fryer2', mark: 'fry', el: 'ΕΠΙΘΕΣΗ! ΣΤΟΥΣ ΔΙΑΚΟΣΙΟΥΣ ΒΑΘΜΟΥΣ!', en: 'ATTACK! AT TWO HUNDRED DEGREES!' },
  { act: 'aa', d: 3.4, cam: 'sky' },
  { act: 'mag', d: 3.1, cam: 'mag' },
  { who: 'giannos', cam: 'gia', mark: 'holds', el: 'Κρατάει!', en: "It's holding!" },
  { who: 'giorgos', cam: 'gio', mark: 'croc', el: 'Ο κροκόδειλος έρχεται σε μένα!', en: 'The crocodile is coming for me!' },
  { who: 'mimis', cam: 'mim', el: 'Φουσκωτός είναι!', en: "It's inflatable!" },
  { act: 'block', d: 2.6, cam: 'tray' },
  { who: 'giorgos', cam: 'gio', mark: 'real', el: 'Χτυπάει σαν αληθινός!', en: 'It hits like a real one!' },
  { who: 'giannos', cam: 'gia', mark: 'jamnow', el: 'Jammer… τώρα!', en: 'Jammer… now!', say: 'Τζάμερ… τώρα!' },
  { act: 'jam', d: 2.4, cam: 'sky' },
  { who: 'mimis', cam: 'mim', mark: 'phone', el: 'Το κινητό μου!', en: 'My phone!' },
  { who: 'giannos', cam: 'gia', mark: 'tenm', el: 'Είπα δέκα μέτρα. Δεν είπα ότι ξεχωρίζει.', en: "I said ten metres. I didn't say it picks sides." },
  { act: 'land', d: 1.8, cam: 'sita' },
  { who: 'sita', cam: 'sita', mark: 'offer', el: 'Αρκετά. Ώρα για… ΠΡΟΣΦΟΡΑ.', en: 'Enough. Time for… a SPECIAL OFFER.' },
  { act: 'power', d: 2, cam: 'sitaC' },
  { act: 'sweep', d: 3.4, cam: 'sweep' },
  { who: 'mimis', cam: 'mim', mark: 'hens', el: 'Κότες! ΕΠΙΘΕΣΗ!', en: 'Chickens! CHARGE!' },
  { act: 'cav', d: 2.8, cam: 'low' },
  { act: 'grab', d: 1.6, cam: 'mag' },
  { who: 'neos', cam: 'mag', mark: 'help', el: 'Κύριε Γιώργο!', en: 'Mr Giorgos!' },
  { who: 'giannos', cam: 'gia', mark: 'inside', el: 'Μέσα! Όλοι στο κοτέτσι!', en: 'Inside! Everyone into the coop!' },
  { act: 'retreat', d: 2.4, cam: 'after' },
  { who: 'kostas', cam: 'kos', mark: 'what', el: '…Έγινε κάτι;', en: '…Did something happen?' },
  { act: 'end', d: 1.4, cam: 'kos' },
];
let M, SHAKE = [], TIME = [], LIGHT = [], SCORCH = [];
const IMPACT = () => M.hit.a + .45, CLANG = () => M.block.a + .6, SLAM = () => M.mag.a + 1.7;
const ZAP = () => [M.aa.a + .5, M.aa.a + 1.7], CRASH = z => z + 1.05;
const JAM = () => M.jam.a + .25, HENHIT = i => M.cav.a + 1.1 + i * .22;
function prep() {                                                     // everything keyed off the marks, once per scene layout
  const boomT = M.boom.a + .35;
  SHAKE = [[M.rumble.a, 3, 1.8], [boomT, 34, 1], [IMPACT(), 12, .35], ...ZAP().map(z => [CRASH(z), 14, .5]), [SLAM(), 16, .5], [CLANG(), 20, .55], [JAM(), 8, .6], [M.land.a + .5, 12, .5], ...[0, 1, 2, 3, 4].map(i => [HENHIT(i), 5, .25])];
  for (let s = M.sweep.a; s < M.sweep.b; s += .25) SHAKE.push([s, 5, .3]);
  TIME = [{ a: M.draw.a + .5, b: M.draw.b - .25, rate: .3, catch: .35 }, { a: IMPACT(), b: IMPACT() + .16, rate: 0, catch: 0 },
    { a: CLANG() - .3, b: CLANG() + .4, rate: .25, catch: .3 }];
  LIGHT = [[boomT, 1], [IMPACT(), .5], ...ZAP().map(z => [z, .35]), ...ZAP().map(z => [CRASH(z), .5]), [SLAM(), .3], [CLANG(), .45], [JAM(), .3], [M.sweep.a, .8]];
  SCORCH = []; for (let i = 0; i <= 60; i++) SCORCH.push([lerp(120, 1260, i / 60), 752 + Math.sin(i * .7) * 5]);
}
const hero = (who, x, st) => { const r = RET(); person(x - r * 900, HIPS, S, CAST[who], { legs: r > 0 && r < 1 ? 'walk' : 'stand', ...st, ...(r > 0 ? { dir: -1 } : {}) }); };
let RET = () => 0;
function gate(t) {
  rect(GATE - 90, 500, 22, 190, '#bfb49a', { lw: 4 }); rect(GATE + 68, 500, 22, 190, '#bfb49a', { lw: 4 });
  const blown = t > M.boom.a + .35;
  if (!blown) {
    const sh = inM(t, M.rumble) ? Math.sin(t * 60) * 2 * prog(t, M.rumble.a, M.rumble.b) : 0;
    for (const [x, d] of [[GATE - 68, 1], [GATE, -1]]) { ctx.save(); ctx.translate(sh * d, 0); rect(x, 520, 68, 170, '#7a4a2a', { lw: 3.5 }); for (let i = 1; i < 5; i++) curve([[x + i * 13.6, 524], [x + i * 13.6, 686]], 2, 'rgba(0,0,0,.25)', { w: 0 }); ctx.restore(); }
  } else {
    rect(GATE - 68, 500, 136, 190, '#d8c8a4', { lw: 0 });                                   // the lane beyond, in the dust
    rect(GATE - 68, 610, 136, 80, '#c8b890', { lw: 0 });
    ctx.save(); ctx.translate(GATE - 40, 684); ctx.rotate(.5); rect(-34, -8, 68, 16, '#6a3a1e', { lw: 2.5 }); ctx.restore();   // what's left of a door
  }
}
function army(t, T) {
  const inv = k => ease(clamp(k));
  // the air fryers march in through the gate
  for (let i = 0; i < 4; i++) {
    const t0 = M.charge.a + i * .3, k = inv((T - t0) / 1.7); if (T < t0) continue;
    const x = lerp(GATE, FRY[i], k), dead = i === 1 && T > IMPACT();
    ctx.save(); ctx.translate(x, MID); ctx.scale(.8, .8);
    if (!dead) { if (i === 0) officerFryer(0, 0, t, { s: 1.25, talk: talk('airfryer', t) }); else airFryer(0, 0, T, { walk: k < 1 ? 1 : .2 }); }
    else { ctx.rotate(1.35); airFryer(0, 0, T, { noLegs: 1 }); arrow(-10, -50, .25, .9); }
    ctx.restore();
    if (k > 0 && k < 1) fxEmit(t, t0, t0 + 1.7, .18, () => x, MID, { kind: 'dust', n: 2, speed: 40, grav: 0, life: .8, size: .6, seed: i });
  }
  // the vacuum-tank: advances, is pulled up by the magnet, thrown into the house wall, and stays there
  const up = inv((T - M.mag.a - .6) / .6), fly = inv((T - M.mag.a - 1.2) / .5), creep = clamp((T - M.charge.a) / 6) * 60;
  let vx = 760 - creep, vy = MID, rot = 0;
  if (up > 0) { vx = lerp(vx, 430, up); vy = lerp(MID, 520, up) - Math.sin(up * Math.PI) * 40; rot = -up * .6; }
  if (fly > 0) { vx = lerp(430, 350, fly); vy = lerp(520, 480, fly) - Math.sin(fly * Math.PI) * 50; rot = -.6 - fly * 5.6; }
  if (T > SLAM()) { vx = 350; vy = 480; rot = -Math.PI / 2; }
  if (T > M.charge.a + .6) { ctx.save(); ctx.translate(vx, vy); ctx.rotate(rot); ctx.scale(.95, .95); robotVac(0, 0, T, { gun: 1 }); ctx.restore(); }
  if (up > .3 && fly < 1) fxSmear(vx, vy, -120, 60, 40);
  // the doorbell (the scout): waits by the gate, then snatches the νέος and drags him out
  if (T > M.charge.a + .9) {
    let bx = lerp(GATE, 660, inv((T - M.charge.a - .9) / 1)), by = MID;
    const g1 = inv((T - M.grab.a) / .7), g2 = clamp((T - M.grab.a - .7) / (M.help.b + .6 - M.grab.a - .7));
    if (g1 > 0) { bx = lerp(660, X.neos + 70, g1); by = lerp(MID, BASE, g1); }
    if (g2 > 0) { bx = lerp(X.neos + 70, GATE + 20, g2); by = lerp(BASE, MID, g2); }
    if (g2 < 1) officerBell(bx, by, t, { s: 2.2, talk: talk('koudouni', t) });
  }
  // the crocodile: out of the smoke, then the leap at Γιώργος's ταψί, then it bounces off
  if (t > M.boom.a + .9) {
    let cx = lerp(GATE - 60, 780, inv((T - M.boom.a - .9) / 1)), cy = MID + 4, r = 0;
    const lp = (T - (CLANG() - .5)) / .5, bk = (T - CLANG()) / .7;
    if (lp > 0 && bk <= 0) { cx = lerp(780, 645, lp); cy = lerp(MID + 4, 549, lp) - Math.sin(lp * Math.PI) * 60; r = -.3 * lp; }
    if (bk > 0) { const e = inv(bk); cx = lerp(645, 780, e); cy = lerp(549, MID + 4, e) - Math.sin(e * Math.PI) * 120; r = -.3 - e * 6; }
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(r); officerCroc(0, 0, t, { talk: talk('krokodeilos', t), s: 1.15 }); ctx.restore();
  }
}
function drones(t, T) {
  const [z1, z2] = ZAP();
  for (let i = 0; i < 5; i++) {
    const t0 = M.charge.a + .4 + i * .2; if (T < t0) continue;
    const rise = ease(clamp((T - t0) / 1.2));
    let x = lerp(GATE, 330 + i * 170, rise) + Math.sin(T * 1.7 + i) * 16, y = lerp(600, 150 + (i % 2) * 70, rise) + Math.sin(T * 2.3 + i * 2) * 10;
    const z = i === 1 ? z1 : i === 3 ? z2 : null;
    if (z != null && T > z) {
      const d = T - z; if (d > CRASH(z) - z) { fxExplosion(t, CRASH(z), 330 + i * 170 + 140, MID, .45, { debrisN: 10 }); continue; }
      const x0 = 330 + i * 170, y0 = 150 + (i % 2) * 70;
      x = x0 + d * 140; y = y0 + (MID - y0) * (d / (CRASH(z) - z)) ** 2;
      fxEmit(t, z, CRASH(z), .05, tt => x0 + (tt - z) * 140, tt => y0 + (MID - y0) * ((tt - z) / (CRASH(z) - z)) ** 2, { kind: 'smoke', n: 1, speed: 20, grav: 300, life: 1, size: .5, alpha: .5 });
      selfieDrone(x, y, T, { fall: d * 1.4 }); continue;
    }
    if (T > JAM() + i * .08) {                                        // the jammer: they drop like flies
      const d = T - JAM() - i * .08, fy = Math.min(MID - 10, y + 900 * d * d);
      if (fy >= MID - 10) { fxBurst(t, JAM() + i * .08 + Math.sqrt((MID - 10 - y) / 900), x, MID - 10, { kind: 'spark', n: 12, speed: 300, life: .4, seed: i }); ctx.save(); ctx.translate(x, MID - 4); ctx.rotate(.4 + i); selfieDrone(0, 0, 0, { fall: 1 }); ctx.restore(); continue; }
      selfieDrone(x, fy, T, { fall: d * 3 }); continue;
    }
    selfieDrone(x, y, T, {});
  }
}
function sita(t, T) {
  const drop = ease(clamp((T - M.land.a) / .5));
  if (T < M.land.a) return null;
  const st = { ...SITA, top: lerp(-400, SITA.top, drop), t, talk: talk('sita', t), chip: 1, led: 'red', mood: 'evil', laser: T > M.power.a };
  sitaV2(st);
  return st;
}
function beamTarget(t) { const e = ease(clamp((t - M.sweep.a - .1) / (M.sweep.b - M.sweep.a - .5))); return [lerp(120, 1260, e), 752, e]; }
function render(t, _M, sc) {
  M = _M;
  if (!SHAKE.length || SHAKE.M !== M) { prep(); SHAKE.M = M; }
  const T = fxTime(t, TIME);
  RET = () => ease(clamp((T - M.retreat.a) / (M.retreat.b - M.retreat.a)));
  const [, shot] = shotAt(sc, t);
  let base = shotCam(sc, t, CAMS, .012);
  if (shot === 'gate' && t > M.boom.a) base = fxCrash(t, M.boom.a + .3, M.boom.a + .6, CAMS.gate, [GATE, 560, 2.5]);
  const c = fxCam(base, t, SHAKE);
  ctx.save(); applyCamFx(c);
  // the set: the yard at golden hour, the gate in the back wall
  yard(T, { light: 'dusk', noChickens: true, gate: 'none' });
  poly([[-800, 798], [2100, 798], [2100, 1500], [-800, 1500]], '#d9d0bd', { lw: 0 });   // the yard floor, down past the frame
  gate(T);
  // the scorch line stays once the laser has swept
  const [bx, by, bk] = beamTarget(T);
  if (T > M.sweep.a) fxScorch(SCORCH, bk, { hot: T < M.sweep.b });
  if (T > M.boom.a + .3) for (let i = 0; i < 6; i++) { ctx.save(); ctx.translate(GATE - 200 + i * 80 + fxr(i) * 30, 700 + fxr(i, 2) * 20); ctx.rotate(fxr(i, 3) * 3); rect(-20, -5, 40, 10, '#6a3a1e', { lw: 2 }); ctx.restore(); }   // planks
  army(t, T);
  const st = sita(t, T);
  drones(t, T);
  // the gate explosion
  fxExplosion(T, M.boom.a + .35, GATE, 620, 1.3, { cols: ['#7a4a2a', '#6a3a1e', '#bfb49a'] });
  if (inM(T, M.boom, .5, 3)) fxEmit(T, M.boom.a + .5, M.boom.b + 1, .2, GATE, 640, { kind: 'dust', n: 3, speed: 120, grav: 0, life: 1.6, size: 1.4, seed: 4 });
  if (inM(t, M.rumble)) fxEmit(T, M.rumble.a, M.rumble.b, .15, GATE, 500, { kind: 'dust', n: 2, speed: 60, grav: -60, life: 1.2, size: .8, seed: 2 });
  // the fig tree catches fire when the beam passes it, and keeps burning
  if (T > M.sweep.a + .3) { const a = clamp((T - M.sweep.a - .3) * 2); fxFire(60, 400, .9, T, a); fxFire(125, 335, .6, T + 1, a); }
  // Χρήστος in the fig tree: draws the bow (slow motion), releases
  const pull = inM(t, M.draw) ? clamp((T - M.draw.a - .3) / (M.draw.b - M.draw.a - .9)) : 0;
  limb([[150, 560], [CHR[0] + 30, CHR[1] + 118], [CHR[0] + 110, CHR[1] + 108]], 16, '#9a948a', { w: .6 });   // his branch
  if (RET() > 0) { const r = RET(); person(CHR[0] - r * 700, lerp(CHR[1], HIPS, clamp(r * 3)), CHR[2], CAST.christos, { t, legs: 'walk', look: [-1, 0], brow: 'worry', mouth: 'flat', L: [-60, -110], itemL: 'bow', dir: -1 }); } else
  person(CHR[0], CHR[1], CHR[2], CAST.christos, { t, talk: talk('christos', t), legs: 'stand', look: [1, .5], brow: inM(t, M.draw) ? 'frown' : 'flat', mouth: 'flat', L: [70, -130], itemL: 'bow', bowDir: 1, pull, R: [66 - pull * 30, -134] });
  // the arrow on the string while he draws (the bow is in his front hand, the string comes back to his other hand)
  if (inM(t, M.draw) && T < M.draw.b - .35) { const s = CHR[2], sx = CHR[0] + s * (76 - 6 - 30 * pull), sy = CHR[1] + s * (-136); arrow(sx + 50 * s * .8, sy, 0, s * .8); }
  // the gang, in front
  const duck = inM(T, M.sweep, 0, .3);
  const hands = (L, R) => duck ? { L: [-36, -250], R: [36, -250] } : { L, R };
  hero('mimis', X.mimis, { t, talk: talk('mimis', t), look: inM(t, M.phone) ? [.3, .6] : [1, -.2], brow: inM(t, M.phone) ? 'worry' : 'frown', mouth: inM(t, M.cry) || inM(t, M.hens) ? 'open' : 'flat', ...hands(inM(t, M.phone) ? [30, -140] : [-44, -24], [50, -190]), itemL: inM(t, M.phone) ? 'phone' : null, itemR: duck ? null : 'racketGun' });
  const g2 = clamp((T - M.grab.a - .7) / (M.help.b + .6 - M.grab.a - .7));
  if (g2 < 1) { const nx = lerp(X.neos, GATE - 50, g2), grabbed = T > M.grab.a + .6;
    ctx.save(); if (grabbed) { ctx.translate(nx, BASE); ctx.rotate(-.35); ctx.translate(-nx, -BASE); }
    hero('neos', nx, { t, talk: talk('neos', t), look: grabbed ? [-1, -.3] : [1, 0], brow: grabbed || inM(t, M.mag) ? 'worry' : 'frown', mouth: grabbed ? 'open' : 'flat', ...(grabbed ? { L: [-80, -230], R: [80, -230] } : hands([-40, -110], [60, -120])), itemR: duck || grabbed ? null : 'magnet', legs: grabbed ? 'walk' : 'stand' });
    ctx.restore(); if (grabbed && g2 > 0) fxEmit(T, M.grab.a + .7, M.help.b + .6, .12, () => nx, BASE, { kind: 'dust', n: 2, speed: 60, grav: 0, life: .7, size: .7 }); }
  const slide = CLANG() < T ? 110 * ease(clamp((T - CLANG()) / .5)) : 0;
  hero('giorgos', X.giorgos + slide, { t, talk: talk('giorgos', t), look: [1, .1], brow: 'worry', mouth: t > CLANG() - .6 ? 'open' : 'flat', ...hands([-44, -24], [80, -150]), itemR: duck ? null : 'tray', dir: -1 });
  hero('giannos', X.giannos, { t, talk: talk('giannos', t), look: [1, 0], brow: 'frown', mouth: 'flat', ...hands([-44, -24], [60, -110]), itemR: duck ? null : 'jammer', dir: -1 });
  person(X.kostas, HIPS, S, CAST.kostas, { legs: 'stand', t, talk: talk('kostas', t), look: [.2, .6], lid: true, mouth: 'flat', L: [-44, -24], R: [40, -150 + Math.max(0, Math.sin(t * 2.2)) * 20], itemR: 'koulouri', dir: -1 });
  if (slide > 0 && slide < 108) fxBurst(T, CLANG(), X.giorgos + 20, BASE, { kind: 'dust', n: 10, speed: 200, dir: Math.PI, spread: 1, grav: 0, life: .9, size: .9 });
  // effects on top of everyone
  // the arrow: released at the end of the draw, in flight through the hit shot
  const rel = M.draw.b - .35;
  if (T > rel && T < IMPACT()) { const k = (T - rel) / (IMPACT() - rel), ax = lerp(CHR[0] + 60, FRY[1], k), ay = lerp(CHR[1] - 80, MID - 55, k) - Math.sin(k * Math.PI) * 40; arrow(ax, ay, .35, 1); fxSmear(ax - 30, ay - 10, 140, 50, 6); }
  fxBurst(T, IMPACT(), FRY[1], MID - 50, { kind: 'chip', n: 30, speed: 520, grav: 1200, life: 1.4, size: 1.3 });
  fxBurst(T, IMPACT(), FRY[1], MID - 50, { kind: 'spark', n: 26, speed: 700, grav: 900, life: .5 });
  fxRing(T, IMPACT(), FRY[1], MID - 50, 120, .3);
  // the racket gun: arcs to two drones
  for (const [z, i] of [[ZAP()[0], 1], [ZAP()[1], 3]]) if (T > z - .25 && T < z + .15) { fxArc(X.mimis + 42, HIPS - 255, 330 + i * 170, 150 + (i % 2) * 70, T, { seed: i }); fxBurst(T, z, 330 + i * 170, 150 + (i % 2) * 70, { kind: 'spark', n: 20, speed: 500, life: .5, col: 'rgba(170,220,255,.9)' }); }
  // the magnet cannon's field while it pulls
  if (inM(T, M.mag, .3, -1.35)) fxMagField(X.neos + 120, HIPS - 105, T, .45, 1);
  fxBurst(T, SLAM(), 350, 480, { kind: 'debris', n: 22, speed: 520, spread: Math.PI, dir: 0, grav: 1300, life: 1.2, cols: ['#ebe2cd', '#d9ceb4'] });
  fxBurst(T, SLAM(), 350, 480, { kind: 'dust', n: 12, speed: 200, grav: 0, life: 1.4, size: 1.2, col: '#efe6d4' });
  fxRing(T, SLAM(), 350, 480, 160, .3);
  // the ταψί: CLANG
  fxBurst(T, CLANG(), 755, 503, { kind: 'spark', n: 40, speed: 900, dir: Math.PI, spread: 2.2, grav: 800, life: .6 });
  fxRing(T, CLANG(), 755, 503, 150, .25);
  if (inM(T, M.block, .1, -.6) && T < CLANG()) fxSmear(lerp(700, 760, (T - CLANG() + .5) / .5), 520, 160, 40, 36, '140,220,120');
  // the jammer: a blue pulse from Γιάννος, and every phone in the yard dies
  if (inM(T, M.jam, 0, .2)) { fxRing(T, JAM(), X.giannos - 60, HIPS - 100, 1400, .8, '120,190,255'); fxRing(T, JAM() + .15, X.giannos - 60, HIPS - 100, 1400, .8, '120,190,255'); }
  if (inM(T, M.jam, .4, 0)) for (const x of [X.mimis, X.neos, X.giorgos, X.giannos, X.kostas]) { ctx.save(); ctx.translate(x - RET() * 900, HIPS - 40); rect(-10, -16, 20, 32, '#1b1b1f', { lw: 2 }); curve([[-6, -8], [6, 8]], 3, '#ff3030'); curve([[6, -8], [-6, 8]], 3, '#ff3030'); ctx.restore(); }
  // Μίμης's hen cavalry: out of the coop, across the yard, zapped one by one into clouds of feathers
  if (inM(T, M.cav, 0, 1)) for (let i = 0; i < 5; i++) {
    const hit = HENHIT(i), x0 = -150 - i * 60, run = clamp((T - M.cav.a) / 1.6), x = x0 + run * (560 + i * 40);
    if (T < hit) { chicken(x, BASE - 8 - (i % 2) * 10, T, i, ['#f3efe6', '#b97a4a', '#e8dcc4'][i % 3], { goggles: true, s: 1 }); fxSmear(x - 20, BASE - 30, 60, 0, 16); }
    else if (T < hit + 1.4) { const k = (T - hit) / 1.4; chicken(x - k * 900, BASE - 8, T, i, '#f6f2e8', { s: .8, dir: -1 }); }
    fxBurst(T, hit, x, BASE - 30, { kind: 'feather', n: 22, speed: 380, grav: 260, drag: 3, life: 2.4, size: 1.4, seed: i });
    if (st && T > hit - .12 && T < hit + .04) { const [ex, ey] = sitaV2Eye(st); fxBeam(ex, ey, x, BASE - 30, T, { width: .5, hit: false }); }
  }
  // the laser: the charge, then the sweep
  if (st) {
    const [ex, ey] = sitaV2Eye(st);
    if (inM(T, M.power)) fxCharge(T, ex, ey, prog(T, M.power.a, M.power.b));
    if (inM(T, M.sweep, 0, -.2)) { fxBeam(ex, ey, bx, by, T, { width: 1.3 }); fxBurst(T, Math.floor(T * 20) / 20, bx, by, { kind: 'smoke', n: 3, speed: 60, grav: 300, life: 1.2, size: .6, alpha: .4 }); }
  }
  // feathers settling after the battle
  if (T > M.retreat.a - .5) fxBurst(T, M.retreat.a - .5, 640, -40, { kind: 'feather', n: 40, speed: 260, dir: Math.PI / 2, spread: 2.6, grav: 220, drag: 3, life: 4.4, size: 1.8 });
  ctx.restore();
  // light, grade, lens
  applyLight('dusk', .45);
  fxGrade('#ffd08a', '#5a2a4a', .4);
  if (inM(T, M.sweep)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,120,110,.35)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  ctx.save(); applyCamFx(c);
  if (st) { const [ex, ey] = sitaV2Eye(st); glow(ex, ey, 40, 'rgba(255,60,60,1)', .7); if (inM(T, M.sweep, 0, -.2)) { glow(bx, by, 160, 'rgba(255,90,60,1)', .6); fxFlare(ex, ey, .8); } }
  if (T > M.sweep.a + .3) { glow(90, 370, 260, 'rgba(255,140,40,1)', .45); }
  ctx.restore();
  fxFlash(fxHitLight(T, LIGHT));
  if (shot === 'est' || (shot === 'after' && t > M.what.a - 1)) fxForeground(t, 'left', { blur: 8 });
  if (shot === 'low' || shot === 'sweep') fxForeground(t, 'bottom', { kind: 'grass', blur: 6 });
  if (shot === 'est') fxRays(1150, -40, t, .16);
  fxLetterbox(inM(t, M.power) || inM(t, M.draw) ? 1 : inM(t, M.sweep) ? 1 - prog(t, M.sweep.b - .5, M.sweep.b) : 0);
  fxImpact(t, M.boom.a + .35, 640, 400, .08);
  fxImpact(t, IMPACT(), 640, 360, .07);
  fxImpact(t, CLANG(), 560, 330, .07);
  if (inM(t, M.boom, .4, -1)) sfxText('ΜΠΟΥΜ', 640, 150, 90, -.1, '#ffd23f');
  if (inM(t, M.hit, .45, -.6)) sfxText('ΤΣΑΦ!', 900, 170, 64, .1, '#fff');
  if (inM(T, M.block, .6, -.9)) sfxText('ΝΤΑΓΚ!', 640, 150, 80, -.08, '#fff');
  if (T > SLAM() && T < SLAM() + .8) sfxText('ΚΛΑΝΚ!', 420, 170, 64, -.1, '#ffd23f');
  vignette(.35);
}
return {
  id: 'scene15', title: '15 · Η μάχη της αυλής', steps, render,
  events: M => {
    const imp = M.hit.a + .45, clang = M.block.a + .6, slam = M.mag.a + 1.7, z = [M.aa.a + .5, M.aa.a + 1.7];
    return [[M.rumble.a, () => { tone(40, 1.8, 'sine', .2, 1.5); noise(1.8, .15, 200, .7, 'lowpass'); }], [M.boom.a + .35, () => FXS.boom(1.5)],
      [M.charge.a, () => fxScore(8, 132, 1)], [M.draw.a + .3, () => tone(300, 2, 'sine', .03, 1.4)], [M.draw.b - .35, FXS.arrow], [imp, () => { FXS.hit(); FXS.boom(.5); }],
      ...z.flatMap(x => [[x - .2, FXS.zap], [x + 1.05, () => FXS.boom(.7)]]), [M.mag.a + .4, () => FXS.charge(1)], [slam, FXS.crash],
      [clang - .5, FXS.whoosh], [clang, FXS.clang], [M.land.a + .45, FXS.thud], [M.power.a, () => { FXS.charge(2); FXS.riser(2); }], [M.sweep.a, () => FXS.laser(3.2)], [M.sweep.a, () => fxScore(4, 132, .8)],
      [M.jamnow.b, () => { FXS.zap(); tone(3000, 1.2, 'sine', .04, .2); }], [M.jam.a + .5, () => { for (let i = 0; i < 5; i++) tone(1400, .15, 'square', .02, .5, i * .12); }],
      [M.cav.a, () => { for (let i = 0; i < 10; i++) SFX.cluck(); }], ...[0, 1, 2, 3, 4].map(i => [M.cav.a + 1.1 + i * .22, () => { FXS.zap(); noise(.2, .2, 3000, 1, 'bandpass'); }]),
      [M.grab.a + .6, () => { FXS.whoosh(); SFX.ding(); }], [M.retreat.a, () => tone(220, 2.5, 'sine', .03, .8)]];
  },
  ambience: (t, M) => ({ cicada: t < M.est.b - .6 ? .05 : 0, hum: t > M.land.a ? .03 : 0 }),
};
})());
