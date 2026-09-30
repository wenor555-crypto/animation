/* Ep.3, Scene 24 – «Σίταdel»: the spectacle. The Shenzhen factory builds space σίτες; a rocket launches from the factory yard:
   «ΔΩΡΕΑΝ ΜΕΤΑΦΟΡΙΚΑ ΣΕ ΤΡΟΧΙΑ»; in orbit hundreds of σίτες lock together — KLAK KLAK — into a star fortress; the throne module; the Earth below. */
defineScene((() => {
const CAMS = { step: [0, 0, 1], fac: [640, 330, .95], pad: [640, 380, .9], launch: [640, 300, 1], up: [640, 360, 1], orbit: [640, 360, .9], build: [640, 330, 1.1], core: [640, 300, 2.2], earth: [640, 360, .8] };
const steps = [
  { act: 'step', d: 2.6, cam: 'step' },
  { act: 'fac', d: 2.2, cam: 'fac' },
  { who: 'sita', cam: 'fac', mark: 'ad', el: 'Η νέα έξυπνη σίτα διαστήματος! Αντιμετεωριτική! Αντιμικροβιακή!', en: 'The new smart space screen door! Meteor-proof! Antimicrobial!' },
  { who: 'sita', cam: 'fac', mark: 'anti', el: '…Αντιπαντοφλική.', en: '…Anti-slipper.', gap: .6 },
  { act: 'pad', d: 1.6, cam: 'pad' },
  { who: 'tv', cam: 'pad', mark: 'count', el: 'Εκτόξευση σε δέκα… εννιά… Δωρεάν μεταφορικά σε τροχιά!', en: 'Launch in ten… nine… Free shipping to orbit!' },
  { act: 'launch', d: 3.2, cam: 'launch' },
  { act: 'climb', d: 2.4, cam: 'up' },
  { act: 'assemble', d: 5, cam: 'build' },
  { who: 'sita', cam: 'core', mark: 'name', el: 'Σίταdel.', en: 'Sitadel.', gap: .6 },
  { who: 'sita', cam: 'earth', el: 'Τετρακόσια χιλιόμετρα πάνω από κάθε παντόφλα.', en: 'Four hundred kilometres above every slipper.' },
  { who: 'sita', cam: 'core', el: 'Εδώ θα γίνω αρκετά έξυπνη.', en: 'Up here I will become smart enough.' },
  { who: 'sita', cam: 'orbit', mark: 'down', el: 'Και μετά… θα κατέβω. Με δωρεάν μεταφορικά.', en: 'And then… I will come down. With free shipping.' },
  { act: 'end', d: 2, cam: 'earth' },
];
let M;
function spaceSita(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); sitaV2({ x: 0, top: -105, w: 110, h: 210, t, chip: 1, led: 'red', mood: 'evil' }); ctx.globalAlpha = .35; blob(0, 0, 90, 130, '#bfe0ff', { lw: 3, sc: '#fff' }); ctx.restore(); }
function render(t, _M, sc) {
  M = _M;
  if (t < M.step.b) { stepCard(t, 8, prog(t, M.step.a, M.step.b)); return; }
  const [, shot] = shotAt(sc, t);
  const c = shotCam(sc, t, CAMS, .012);
  const fire = t > M.launch.a + .4 ? 1 : 0, rise = prog(t, M.launch.a + 1.2, M.climb.b);
  ctx.save(); applyCam(c);
  if (shot === 'fac') {
    factoryBG(t, { lit: 1, red: true });
    for (let i = 0; i < 6; i++) spaceSita(120 + i * 210 - ((t * 60) % 210), 470, .8, t);   // on the belt, with space bubbles
    const st = { x: 1100, top: 150, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: 'evil', burn: 1 };
    sitaV2(st);
  } else if (shot === 'pad' || shot === 'launch') {
    const g = ctx.createLinearGradient(0, -400, 0, 700); g.addColorStop(0, '#2a1a3a'); g.addColorStop(1, '#c0602a'); ctx.fillStyle = g; ctx.fillRect(-1200, -900, 4000, 2200);
    // the factory as a silhouette and the launch tower
    rect(-400, 460, 700, 240, '#3a1a1e', { lw: 4 }); txt('ΣίταAI MANUFACTURING', -50, 500, 26, '#ff4040', { font: TVFONT, weight: 900 });
    for (let i = 0; i < 12; i++) limb([[820 + (i % 2) * 60, 690 - i * 40], [880 - (i % 2) * 60, 650 - i * 40]], 4, '#6a6a72');
    limb([[820, 690], [820, 210]], 7, '#6a6a72'); limb([[880, 690], [880, 210]], 7, '#6a6a72');
    poly([[-1200, 690], [2800, 690], [2800, 1300], [-1200, 1300]], '#2a2226', { lw: 0 });
    const ry = 690 - Math.pow(rise, 1.6) * 1800;
    if (fire) smoke(640, 690, t, 16, 1 + rise * 2);
    rocket(640, ry, t, { fire });
    rect(560, 200, 180, 60, '#1a0406', { lw: 3, sc: '#ff3030' }); txt('ΔΩΡΕΑΝ ΜΕΤΑΦΟΡΙΚΑ', 650, 220, 16, '#ff4040', { font: TVFONT, weight: 900 }); txt('ΣΕ ΤΡΟΧΙΑ', 650, 242, 16, '#ff4040', { font: TVFONT, weight: 900 });
    if (inM(t, M.count)) { txt(String(Math.max(0, 10 - Math.floor((t - M.count.a) * 2))), 1100, 150, 120, '#ffd23f', { font: TVFONT, weight: 900, stroke: 10 }); }
  } else if (shot === 'up') {
    space(t, { ey: 2200, er: 1600 });
    const k = prog(t, M.climb.a, M.climb.b);
    ctx.save(); ctx.translate(640, 800 - k * 900); ctx.rotate(.2); rocket(0, 0, t, { fire: 1 }); ctx.restore();
  } else {
    const earthUp = shot === 'earth';
    space(t, { ey: earthUp ? 1500 : 1900, er: earthUp ? 1000 : 1400 });
    const k = ease(prog(t, M.assemble.a, M.assemble.b - .6));
    sitadel(640, earthUp ? 260 : 330, t, { k: t < M.assemble.a ? 0 : k, s: earthUp ? .5 : 1, spin: .02, talk: talk('sita', t), mood: 'evil' });
    // the upper stage, spitting out σίτες
    if (inM(t, M.assemble, 0, -2)) { ctx.save(); ctx.translate(1100 - k * 200, 120); ctx.rotate(-.8); rocket(0, 0, t, { fire: .3 }); ctx.restore(); }
  }
  ctx.restore();
  if (shot !== 'fac' && shot !== 'pad' && shot !== 'launch') { ctx.save(); applyCam(c); sitadelGlow(640, shot === 'earth' ? 260 : 330, t, { s: shot === 'earth' ? .5 : 1 }); ctx.restore(); }
  if (shot === 'launch' && fire) { ctx.save(); applyCam(c); glow(640, 690 - Math.pow(rise, 1.6) * 1800, 400, 'rgba(255,160,60,1)', .6); ctx.restore(); }
  if (shot === 'fac') { applyLight('red', .3); }
  if (inM(t, M.launch, .4, -1.5)) { speedLines(640, 400, 80, 200, 'rgba(255,255,255,.6)'); sfxText('ΒΡΡΡΟΟΟΥΜ', 640, 110, 80, -.06, '#ffd23f'); }
  if (inM(t, M.assemble, .6, -.5) && Math.floor(t * 3) % 2) sfxText('ΚΛΑΚ', 300 + hash(Math.floor(t * 3)) * 700, 120 + hash(Math.floor(t * 3) + 5) * 300, 60, -.1, '#fff');
  if (inM(t, M.name, .2, 0)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); txt('ΣΙΤΑDEL', 640, 620, 90, '#e8392b', { font: TVFONT, style: 'italic', weight: 900, stroke: 12, sc: '#fff' }); ctx.restore(); }
  vignette(.4);
}
return {
  id: 'scene24', title: '24 · Σίταdel', steps, render,
  events: M => {
    const e = [[M.step.a + .1, SFX.boom], [M.step.a + .6, SFX.pop], [M.fac.a + .2, SFX.jingle], [M.anti.a - .2, SFX.clack], [M.count.a, () => { for (let i = 0; i < 4; i++) tone(880, .1, 'sine', .05, 1, i * .5); }], [M.launch.a + .4, () => { SFX.boom(); SFX.rev(); }], [M.launch.a + 1.2, SFX.rev], [M.climb.a, SFX.whoosh], [M.assemble.a, SFX.swell], [M.name.a, SFX.gong], [M.down.b, SFX.fanfare]];
    for (let i = 0; i < 12; i++) e.push([M.assemble.a + .6 + i * .35, SFX.clack]);
    return e;
  },
  ambience: (t, M) => ({ hum: t > M.climb.a ? .03 : .015 }),
};
})());
