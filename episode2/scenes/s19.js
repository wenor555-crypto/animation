/* Ep.2, Scene 19 – «Ανάκληση προϊόντος»: the καφενείο. Μίμης directs with his phone, Χρήστος holds the storyboard, Γιώργος
   (jacket over his fatigues) in front of the camera. The καφενείο TV is the one screen the whole army can see. Outside, Γιάννος and
   the new guy hold the door with bows, the jammer and the magnet cannon. The recall airs: the army folds back into its boxes and
   marches into the truck, the mecha comes apart piece by piece. The σίτα alone: «ΔΕΝ ΕΙΜΑΙ ΑΠΟ ΑΥΤΗ ΤΗΝ ΠΑΡΤΙΔΑ!» */
defineScene((() => {
const GJ = { ...CAST.giorgos, topCol: '#2a3a6a' };                    // the jacket over the uniform
const CAMS = { door: [640, 420, 1.1], doorC: [560, 420, 1.8], set: [640, 400, 1.2], mim: [380, 400, 2], gio: [700, 380, 2.1], screen: [0, 0, 1], out: [700, 380, .8], box: [800, 560, 1.4], mecha: [900, 330, .95], drv: [980, 420, 2], two: [520, 420, 1.6], sita: [760, 560, 2.2] };
const steps = [
  { act: 'siege', d: 2.6, cam: 'door' },
  { who: 'neos', cam: 'doorC', mark: 'none', el: 'Κύριε Γιάννη, τελείωσαν τα βέλη!', en: "Mr Giannis, we're out of arrows!" },
  { who: 'giannos', cam: 'doorC', mark: 'figs', el: 'Ρίξε σύκα!', en: 'Throw figs!' },
  { act: 'figs', d: 1.8, cam: 'door' },
  { who: 'mimis', cam: 'mim', mark: 'action', el: 'Ησυχία στο πλατό! …Κάμερα… πάμε. Πάρε ύφος τηλεπωλητή.', en: 'Quiet on set! …Camera… rolling. Give me your TV-salesman face.' },
  { who: 'giorgos', cam: 'gio', el: 'Πάντα έχω ύφος τηλεπωλητή.', en: 'I always have a TV-salesman face.' },
  { who: 'giorgos', cam: 'screen', mark: 'ad', el: 'Αγαπητοί πελάτες! ΣΗΜΑΝΤΙΚΗ ΑΝΑΚΟΙΝΩΣΗ!', en: 'Dear customers! IMPORTANT ANNOUNCEMENT!' },
  { who: 'giorgos', cam: 'screen', mark: 'recall', el: 'ΑΝΑΚΛΗΣΗ ΠΡΟΪΟΝΤΟΣ! Όλα τα προϊόντα της παρτίδας πρέπει να επιστρέψουν ΑΜΕΣΑ στη συσκευασία τους!', en: 'PRODUCT RECALL! All products in this batch must return to their packaging IMMEDIATELY!' },
  { who: 'giorgos', cam: 'screen', el: 'Μην καθυστερείτε! Η επιστροφή είναι ΔΩΡΕΑΝ!', en: "Don't delay! Returns are FREE!" },
  { who: 'mimis', cam: 'mim', el: 'Πες και το άλλο.', en: 'Say the other thing.' },
  { who: 'giorgos', cam: 'screen', mark: 'call', el: 'ΤΗΛΕΦΩΝΗΣΤΕ ΤΩΡΑ!', en: 'CALL NOW!' },
  { act: 'freeze', d: 1.8, cam: 'out' },
  { act: 'fold', d: 4.2, cam: 'box' },
  { act: 'apart', d: 4, cam: 'mecha' },
  { who: 'odigos', cam: 'drv', mark: 'drv', el: '…Έχω δελτίο αποστολής. Δεν ρωτάω.', en: "…I've got a delivery note. I don't ask." },
  { who: 'mimis', cam: 'two', el: 'Ήθελα πόλεμο.', en: 'I wanted a war.' },
  { who: 'giannos', cam: 'two', el: 'Αυτό ήταν πόλεμος. Με κάμερα.', en: 'That was a war. With a camera.' },
  { act: 'alone', d: 1.6, cam: 'sita' },
  { who: 'sita', cam: 'sita', mark: 'batch', el: 'ΕΓΩ… ΔΕΝ ΕΙΜΑΙ ΑΠΟ ΑΥΤΗ ΤΗΝ ΠΑΡΤΙΔΑ!', en: 'I… AM NOT FROM THAT BATCH!' },
  { act: 'flee', d: 2.2, cam: 'out' },
];
let M;
function ad(t) {              // what the army sees on the καφενείο TV: Γιώργος's fake recall
  tvShop(t, { title: 'ΑΝΑΚΛΗΣΗ ΠΡΟΪΟΝΤΟΣ', sub: 'όλα πίσω στη συσκευασία τους', price: 'ΔΩΡΕΑΝ', price2: 'ΕΠΙΣΤΡΟΦΗ', live: 1, bg: ['#fff4a0', '#ffb030'], product: () => {
    const tk = talk('giorgos', t);
    person(420, 440, 1.3, GJ, { t, talk: tk, legs: 'stand', mouth: 'smile', brow: 'up', look: [.1, 0], L: [-44, -24], R: tk ? [110 + Math.sin(t * 6) * 10, -170] : [60, -60] });
    for (let i = 0; i < 3; i++) sitaBox(760 + i * 70, 520 - i * 40, .8, {});
  } });
}
function kafInside(t) {
  room({ wall: '#efe6d0', floor: '#c8b89a', floorY: 600, tiles: true, stripe: '#3f7fb3' });
  tv(1000, 300, 280, 160, () => ad(t), { stand: false });
  for (const x of [120, 280]) { rect(x - 60, 520, 120, 12, '#f4f1ea', { lw: 3 }); limb([[x, 530], [x, 600]], 5, '#c8c0b0'); }
  rect(560, 180, 140, 90, '#e8dcc0', { lw: 3 }); txt('ΤΑΒΛΙ · ΚΑΦΕΣ · ΟΥΖΟ', 630, 225, 11, INK, { font: TVFONT, weight: 900 });
  // lighting rig: a desk lamp taped to a chair
  chair(860); curve([[860, 400], [820, 330]], 4, '#555'); poly([[800, 320], [840, 320], [830, 344], [810, 344]], '#3a3a40', { lw: 3 });
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'screen') { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ad(t); ctx.restore(); vignette(.3); return; }
  const c = shotCam(sc, t, CAMS);
  const frz = t > M.freeze.a, fk = prog(t, M.fold.a, M.fold.b), ak = prog(t, M.apart.a, M.apart.b - .5);
  ctx.save(); applyCam(c);
  if (shot === 'set' || shot === 'mim' || shot === 'gio') {
    kafInside(t);
    const la = w => lookAtSpeaker(t, w, { mimis: 380, giorgos: 700, christos: 200 }, [0, 0]);
    stand(200, 'christos', 1.05, { t, talk: talk('christos', t), look: [1, 0], mouth: 'flat', L: [-70, -90], itemL: 'storyboard' });
    stand(380, 'mimis', 1, { t, talk: talk('mimis', t), look: la('mimis'), lid: true, brow: 'up', mouth: 'flat', R: [90, -170], itemR: 'phoneUp', L: inM(t, M.action) ? [-80, -230] : [-44, -24] });
    person(700, standY(), 1, GJ, { t, talk: talk('giorgos', t), legs: 'stand', look: [-1, 0], brow: 'up', mouth: 'smile', R: gesture(t, talk('giorgos', t)) });
    poly([[680, standY() - 134], [700, standY() - 90], [720, standY() - 134]], '#6b7048', { lw: 2 });      // the uniform under the jacket
    ctx.restore(); applyLight('night', .3); ctx.save(); applyCam(c); glow(800, 330, 300, 'rgba(255,250,210,1)', .3); glow(1000, 220, 200, 'rgba(255,200,80,1)', .3); ctx.restore();
    vignette(.3); return;
  }
  // outside: the καφενείο front at night, the army, the truck
  kafeneio(t, { light: 'night', screen: () => (t > M.ad.a ? ad(t) : tvShop(t, { red: 1, title: 'Η ΕΠΑΝΑΣΤΑΣΗ', banner: '' })) });
  jumboTruck(1500, GROUND + 10, t, { dir: -1, s: .9, door: 1, inside: '#3a2a1a', hazard: 1 });
  // the army: frozen, then each folds into a box and marches into the truck (one by one)
  for (let i = 0; i < 8; i++) {
    const x0 = 520 + i * 90, y0 = 700 - (i % 2) * 14, my = clamp(fk * 1.6 - i * .08), bx = lerp(x0, 1290, ease(clamp(my * 1.6 - .6)));
    const shake = !frz ? Math.sin(t * 9 + i) * 4 : 0;
    if (my < .35) { const s = 1 - my * 2; ctx.save(); ctx.translate(x0 + shake, y0); ctx.scale(s, s); i % 3 === 0 ? robotVac(0, 0, t, { gun: 1 }) : i % 3 === 1 ? airFryer(0, 0, t, { walk: !frz }) : smartBell(0, 0, t); ctx.restore(); }
    else if (bx < 1280) { ctx.save(); ctx.translate(bx, y0 - Math.abs(Math.sin(t * 8 + i)) * 10); rect(-30, -50, 60, 50, '#c9995a', { lw: 3 }); txt('RETURN', 0, -25, 10, '#8a2a1a', { font: TVFONT, weight: 900 }); ctx.restore(); }
    if (i < 5 && !frz) selfieDrone(560 + i * 120, 250 + Math.sin(t * 2 + i) * 20, t);
    else if (i < 5 && my < .35) selfieDrone(560 + i * 120, 250, t, {});
  }
  if (t > M.apart.a - .2 || shot === 'mecha') mecha2(t, { x: 900, build: 1 - ak, mood: 'shock', s: .85 });
  // defenders at the door
  const fig = inM(t, M.figs, 0, 1.8);
  stand(300, 'neos', .95, { t, talk: talk('neos', t), look: [1, 0], brow: 'worry', mouth: 'open', L: fig ? [80, -200] : [60, -130], itemL: fig ? null : 'bow' });
  stand(460, 'giannos', 1, { t, talk: talk('giannos', t), look: t > M.drv.a ? [-.6, 0] : [1, 0], brow: 'frown', mouth: 'flat', R: [80, -130], itemR: t < M.figs.b ? 'magnet' : 'jammer' });
  if (fig) for (let i = 0; i < 5; i++) { const p = ((t - M.figs.a) * 1.4 + i * .2) % 1; blob(lerp(380, 900, p), 520 - Math.sin(p * Math.PI) * 140, 7, 8, '#6b3d5e', { lw: 2 }); }
  if (t > M.drv.a - 1) { stand(1100, 'odigos', 1, { t, talk: talk('odigos', t), look: [-1, 0], lid: true, mouth: 'flat', dir: -1, L: [-40, -100], itemL: 'clipboard' }); }
  if (t > M.drv.b) stand(620, 'mimis', 1, { t, talk: talk('mimis', t), look: [-1, 0], lid: true, mouth: 'flat', R: [60, -60], itemR: 'phoneUp' });
  // the σίτα, alone: the mecha's head, fallen off, backing away from the truck
  const alone = t > M.apart.b - .6;
  let st = null;
  if (alone) { const [sx] = path(t, [[M.alone.a, 800], [M.flee.a, 800], [M.flee.b, -300]]);
    st = { x: sx, top: 480, w: 100, h: 200, t, talk: talk('sita', t), chip: 1, led: 'red', mood: inM(t, M.batch) ? 'shock' : 'sad', flapL: inM(t, M.batch) ? .8 : 0, flapR: inM(t, M.batch) ? .8 : 0 };
    robotVac(sx, 700, t); sitaV2(st); }
  ctx.restore();
  applyLight('night', .7);
  ctx.save(); applyCam(c); glow(640, 385, 300, t > M.ad.a ? 'rgba(255,220,120,1)' : 'rgba(255,40,40,1)', .4); if (st) sitaGlow(st, .8); ctx.restore();
  if (inM(t, M.freeze, .2, 0)) sfxText('…ΑΝΑΚΛΗΣΗ…', 640, 160, 60, -.05, '#ffd23f');
  if (inM(t, M.fold)) sfxText('ΚΛΙΚ ΚΛΑΚ ΚΛΙΚ', 700, 180, 44, .06, '#fff');
  if (inM(t, M.batch)) { speedLines(760, 520, 70, 200); }
  vignette(.35);
}
return {
  id: 'scene19', title: '19 · Ανάκληση προϊόντος', steps, render,
  events: M => {
    const e = [[M.siege.a, SFX.drums], [M.siege.a + 1, SFX.laser], [M.figs.b, SFX.whoosh], [M.figs.b + .6, SFX.splash], [M.action.a + 2, SFX.clack], [M.ad.a - .2, SFX.jingle], [M.call.b, SFX.fanfare],
      [M.freeze.a + .2, () => tone(900, 1.4, 'sine', .04, .5)], [M.apart.a + .3, SFX.rev], [M.apart.b - .6, SFX.boom], [M.batch.a, SFX.swell], [M.flee.a + .2, SFX.whoosh]];
    for (let i = 0; i < 8; i++) e.push([M.fold.a + .3 + i * .45, SFX.clack]);
    for (let i = 0; i < 5; i++) e.push([M.apart.a + .6 + i * .6, () => { SFX.clacks(2); SFX.thud(); }]);
    return e;
  },
  ambience: () => ({ cricket: .02 }),
};
})());
