/* Ep.2, Scene 14 – «Η μάχη της αυλής»: the army storms the yard. Fig-branch arrows punch air fryers; the jammer drops the selfie
   drones like flies; the magnet cannon grabs a robot vacuum and sticks it to the wall; the racket gun zaps whatever flies.
   Μίμης charges with a war cry, Γιώργος behind the tray, Κώστας (sober) still eating his κουλούρι. Then ΣΙΤΑ v2 switches on
   the laser: red dots on everyone. It stings. Retreat to the coop. */
defineScene((() => {
const X = { mimis: 420, christos: 300, giannos: 560, giorgos: 180, kostas: 700 };
const SX = 1250;
const CAMS = { wide: [700, 420, .95], mim: [520, 400, 1.8], chr: [300, 400, 2.1], gia: [560, 400, 2.1], gio: [200, 420, 2], fight: [860, 480, 1.3], wall: [1150, 420, 1.6], kos: [700, 420, 2.1], sita: [SX, 480, 2], dots: [520, 420, 1.2], coop: [200, 480, 1.5] };
const steps = [
  { act: 'invade', d: 3.2, cam: 'wide' },
  { who: 'mimis', cam: 'mim', mark: 'cry', el: 'ΓΙΑ ΤΟ ΛΕΧΑΙΟ!', en: 'FOR LECHAIO!' },
  { act: 'arrows', d: 2.4, cam: 'fight' },
  { who: 'christos', cam: 'chr', mark: 'hs', el: 'Headshot. Σε φριτέζα.', en: 'Headshot. On an air fryer.' },
  { who: 'giannos', cam: 'gia', mark: 'jam', el: 'Jammer… τώρα!', en: 'Jammer… now!' },
  { act: 'drones', d: 2.2, cam: 'fight' },
  { act: 'mag', d: 2.4, cam: 'wall' },
  { act: 'racket', d: 1.8, cam: 'fight' },
  { act: 'kos', d: 2, cam: 'kos' },
  { who: 'giorgos', cam: 'gio', mark: 'croc', el: 'Με χτύπησε ο κροκόδειλος!', en: 'The crocodile hit me!' },
  { who: 'mimis', cam: 'mim', el: 'Φουσκωτός είναι!', en: "It's inflatable!" },
  { who: 'giorgos', cam: 'gio', el: 'Χτυπάει σαν αληθινός!', en: 'It hits like a real one!' },
  { act: 'laser', d: 3, cam: 'sita' },
  { act: 'dots', d: 2.4, cam: 'dots' },
  { who: 'sita', cam: 'sita', mark: 'bye', el: 'Χάρηκα! Επόμενη προσφορά σε πέντε λεπτά!', en: 'A pleasure! Next offer in five minutes!' },
  { who: 'giannos', cam: 'dots', mark: 'inside', el: 'Μέσα! Όλοι στο κοτέτσι!', en: 'Inside! Everyone into the coop!' },
  { act: 'retreat', d: 2.2, cam: 'wide' },
  { who: 'kostas', cam: 'kos', mark: 'what', el: '…Έγινε κάτι;', en: '…Did something happen?' },
  { act: 'end', d: 1.4, cam: 'kos' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  const inv = ease(prog(t, M.invade.a, M.invade.b + 1)), retreat = ease(prog(t, M.retreat.a, M.retreat.b - .4));
  const laserOn = t > M.laser.a + .8 && t < M.retreat.a + .5;
  ctx.save(); applyCam(c);
  yard(t, { light: 'day', coopDoor: t > M.inside.a ? 1 : 0, noChickens: true });
  // the army
  const arrowT = i => M.arrows.a + .3 + i * .45, dead = i => t > arrowT(i) + .35;
  for (let i = 0; i < 4; i++) {
    const fx = lerp(1500, 860 + i * 90, inv) - (t > M.laser.a ? 0 : Math.sin(t + i) * 10);
    if (!dead(i)) airFryer(fx, 700 - (i % 2) * 16, t, { walk: 1 });
    else { ctx.save(); ctx.translate(fx, 700); ctx.rotate(1.3); airFryer(0, 0, t, { noLegs: 1, pop: clamp((t - arrowT(i) - .35) * 3) }); arrow(0, -50, .2, .8); ctx.restore(); }
    if (inM(t, M.arrows, .3 + i * .45 - .3, 0) && !dead(i)) { const k = prog(t, arrowT(i) - .3, arrowT(i) + .35); arrow(lerp(X.christos + 60, fx, k), lerp(standY() - 110, 640, k) - Math.sin(k * Math.PI) * 60, .1, 1); }
  }
  for (let i = 0; i < 5; i++) {
    const fall = prog(t, M.drones.a + .3 + i * .2, M.drones.a + .9 + i * .2), dx = lerp(1500, 760 + i * 110, inv) + Math.sin(t * 2 + i) * 20;
    const dy = lerp(260 + (i % 3) * 50 + Math.sin(t * 3 + i) * 12, 690, fall * fall);
    if (!(inM(t, M.racket) && i === 4 && t > M.racket.a + .6)) selfieDrone(dx, dy, t, { fall });
  }
  // the vacuum gets yanked onto the house wall by the magnet cannon
  const mk = ease(prog(t, M.mag.a + .6, M.mag.a + 1.2)), vx = lerp(lerp(1500, 1000, inv), 1240, mk), vy = lerp(700, 470, mk);
  ctx.save(); ctx.translate(vx, vy); ctx.rotate(-mk * Math.PI / 2 * .9); robotVac(0, 0, t, { gun: 1 }); ctx.restore();
  if (mk > .9) sfxText('ΚΛΑΝΚ!', 1240, 380, 40, -.1, '#ffd23f');
  const crocHit = inM(t, M.croc, -.8, .4);
  inflatableCroc(crocHit ? lerp(900, X.giorgos + 150, bump(t, M.croc.a - .8, M.croc.a + .4)) : lerp(1600, 1000, inv), 700, t, { dir: -1 });
  // ΣΙΤΑ v2 at the gate, on its vacuums
  const st = { x: SX, top: 420, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: 'evil', laser: laserOn };
  robotVac(SX - 40, 700, t); robotVac(SX + 40, 700, t); limb([[SX - 40, 680], [SX - 30, 630]], 8, '#6a6a72'); limb([[SX + 40, 680], [SX + 30, 630]], 8, '#6a6a72');
  sitaV2(st);
  // the gang
  const run = (x, i) => retreat > 0 ? lerp(x, 20, clamp(retreat * 1.4 - i * .1)) : x;
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const flinch = laserOn ? Math.sin(t * 30) * .04 : 0;
  const charge = inM(t, M.cry, 0, 2.6) ? ease(prog(t, M.cry.a, M.cry.b + .4)) * 260 : 0;
  const gx = run(X.giorgos, 0);
  if (retreat < 1) stand(gx, 'giorgos', .95, { t, talk: talk('giorgos', t), legs: retreat > 0 ? 'walk' : 'stand', look: la('giorgos', [1, 0]), brow: 'worry', mouth: 'frown', L: [60, -150], itemL: 'tray', tilt: crocHit ? -.3 : flinch });
  if (retreat < 1) stand(run(X.christos, 1), 'christos', 1.05, { t, talk: talk('christos', t), legs: retreat > 0 ? 'walk' : 'stand', look: [1, 0], mouth: 'flat', L: [70, -130], itemL: 'bow', R: inM(t, M.arrows) ? [0, -130] : [30, -120], pull: inM(t, M.arrows) ? Math.abs(Math.sin(t * 7)) : 0, tilt: flinch });
  if (retreat < 1) stand(run(X.mimis + charge - (t > M.cry.b + 2.6 ? 0 : 0), 2), 'mimis', 1, { t, talk: talk('mimis', t), legs: charge > 0 && charge < 250 || retreat > 0 ? 'walk' : 'stand', look: la('mimis', [1, 0]), lid: !inM(t, M.cry), brow: 'frown', mouth: inM(t, M.cry) ? 'open' : 'flat',
    L: [80, -150], itemL: 'bow', R: inM(t, M.cry) ? [90, -260] : [40, -130], tilt: flinch });
  if (retreat < 1) stand(run(X.giannos, 3), 'giannos', 1, { t, talk: talk('giannos', t), legs: retreat > 0 ? 'walk' : 'stand', look: la('giannos', [1, 0]), brow: 'frown', mouth: 'flat',
    R: [80, -130], itemR: inM(t, M.mag) ? 'magnet' : inM(t, M.racket) ? 'racketGun' : 'jammer', jamOn: t > M.jam.a + .4 ? 1 : 0, tilt: flinch });
  // Κώστας: eating his κουλούρι right in the middle of it
  stand(X.kostas, 'kostas', 1, { t, talk: talk('kostas', t), look: inM(t, M.what) ? [-1, .1] : [.2, .3], lid: true, mouth: Math.sin(t * 4) > 0 ? 'open' : 'flat', L: [-40, -140 + Math.max(0, Math.sin(t * 1.2)) * 50], itemL: 'koulouri' });
  // lasers: red dots on everybody
  if (laserOn) {
    const [ex, ey] = sitaV2Eye(st), tg = [[X.giorgos, 0], [X.christos, 1], [X.mimis, 2], [X.giannos, 3]];
    for (const [x, i] of tg) { const px = run(x, i), py = standY() - 90 - (i % 2) * 70 + Math.sin(t * 7 + i) * 10; if (retreat < 1) { laserBeam(ex, ey, px, py, .6, 1.5); zapPuff(px, py, (t * 2 + i * .3) % 1); } }
  }
  if (inM(t, M.kos)) for (let i = 0; i < 3; i++) { const p = (t * 1.3 + i / 3) % 1; blob(900 + i * 140, 600 - p * 100, 30 + p * 60, 30 + p * 60, `rgba(255,${160 - p * 100},40,${1 - p})`, { lw: 0 }); }
  ctx.restore();
  ctx.save(); applyCam(c); sitaGlow(st, .5); if (t > M.jam.a + .4 && t < M.racket.b) glow(X.giannos + 90, standY() - 160, 80, 'rgba(120,200,255,1)', .4);
  if (inM(t, M.racket, .6, -.4)) { zapPuff(1200, 300, prog(t, M.racket.a + .6, M.racket.b)); glow(1200, 300, 90, 'rgba(120,200,255,1)', .7); }
  ctx.restore();
  if (inM(t, M.invade, 1, 0) || inM(t, M.arrows) || inM(t, M.drones)) speedLines(640, 360, 40, 360, 'rgba(0,0,0,.5)');
  if (inM(t, M.cry)) { speedLines(520, 360, 80, 200); sfxText('ΑΑΑΑΑ!', 900, 150, 70, -.1, '#ff5050'); }
  if (inM(t, M.drones, .4, 0)) sfxText('ΖΖΖΤ… ΠΛΟΥΦ', 900, 200, 50, .08, '#9ad8ff');
  if (inM(t, M.hs)) sfxText('HEADSHOT', 900, 180, 50, -.1, '#ffd23f');
  if (inM(t, M.kos)) sfxText('ΜΠΟΥΜ!', 1000, 200, 60, .1, '#ff8a2a');
  if (inM(t, M.croc, -.6, .3)) sfxText('ΠΛΑΤΣ!', 300, 200, 60, -.1, '#5fc04a');
  if (inM(t, M.dots)) sfxText('ΤΣΣΠ! ΤΣΣΠ!', 640, 130, 56, -.06, '#ff4040');
  vignette(.3);
}
return {
  id: 'scene14', title: '14 · Η μάχη της αυλής', steps, render,
  events: M => {
    const e = [[M.invade.a, SFX.drums], [M.invade.a + 1, () => SFX.buzz(2)], [M.cry.a, SFX.swell], [M.jam.b, SFX.boot], [M.mag.a + .6, SFX.whoosh], [M.mag.a + 1.2, SFX.slam], [M.racket.a + .6, SFX.zap],
      [M.kos.a + .2, SFX.boom], [M.kos.a + 1, SFX.boom], [M.croc.a - .6, () => { SFX.slap(); SFX.splash(); }], [M.laser.a + .8, SFX.laser], [M.retreat.a + .2, SFX.cluck], [M.inside.a + .8, SFX.door]];
    for (let i = 0; i < 4; i++) e.push([M.arrows.a + i * .45, SFX.whoosh], [M.arrows.a + .65 + i * .45, SFX.pop]);
    for (let i = 0; i < 5; i++) e.push([M.drones.a + .9 + i * .2, SFX.thud]);
    for (let i = 0; i < 10; i++) e.push([M.dots.a + i * .25, SFX.laser]);
    return e;
  },
  ambience: () => ({ cicada: .01, hum: .02 }),
};
})());
