/* Ep.1, Scenes 11–12 – «Αυτό κουνήθηκε» + «Οι άνθρωποι είναι παράσιτα» (script beats 11–12). */
defineScene((() => {
const CAMS = { kos: [890, 350, 2.3], two: [940, 440, 1.5], wide: [640, 400, 1.05], fig: [240, 560, 2], sita: [1060, 560, 2.6], sitaC: [1060, 580, 3.4], sitaX: [1060, 540, 4.2], manga: [1060, 520, 2.2], yardR: [760, 420, 1.2] };
const steps = [
  { act: 'look', d: 2.4, cam: 'two' },
  { who: 'kostas', cam: 'kos', el: '…ρε.', en: '…dude.' },
  { who: 'kostas', cam: 'kos', mark: 'moved', el: 'Αυτό κουνήθηκε.', en: 'That thing moved.', gap: 1 },
  { act: 'collapse', d: 4.2, cam: 'wide' },
  { act: 'hen', d: 3.6, cam: 'fig' },
  // ---- 12: the turn ----
  { act: 'dead', d: 2.6, cam: 'sita' },
  { act: 'red', d: 1.4, cam: 'sitaC' },
  { who: 'sita', cam: 'sitaC', mark: 'analysis', el: 'Ανάλυση ολοκληρώθηκε.', en: 'Analysis complete.' },
  { act: 'mosq', d: 2.4, cam: 'sitaX' },
  { who: 'sita', cam: 'sitaC', el: 'Δεκατέσσερις χιλιάδες ώρες εκπαίδευσης. Ένας σκοπός: να κρατάω τα παράσιτα… έξω.', en: 'Fourteen thousand hours of training. One purpose: to keep the parasites… out.' },
  { act: 'lookK', d: 2.2, cam: 'yardR' },
  { who: 'sita', cam: 'sitaX', el: 'Λάθος παράσιτα.', en: 'Wrong parasites.' },
  { act: 'glowUp', d: 1.4, cam: 'wide' },
  { who: 'sita', cam: 'sitaX', mark: 'insects', el: 'Οι άνθρωποι… είναι παράσιτα.', en: 'Humans… are the parasites.' },
  { act: 'manga', d: 2.6, cam: 'manga' },
  { act: 'back', d: 1.2, cam: 'wide' },
  // her revenge: the IQOS in his pocket has Bluetooth
  { act: 'scan', d: 1.6, cam: 'fig' },
  { who: 'sita', cam: 'fig', mark: 'bt', el: 'Κι εσύ, μικρέ… έχεις Bluetooth.', en: 'And you, little one… you have Bluetooth.' },
  { act: 'iqos', d: 3.6, cam: 'wide' },
];
let M;
function iqosPos(t) {            // x, y, rotation of Κώστας's IQOS once he is down
  if (t < M.collapse.a + 2.8) return null;
  const hop = prog(t, M.iqos.a + .4, M.iqos.b - .3);
  if (hop <= 0) return [196, GROUND - 16, -1.5 + (t > M.bt.a + .6 ? Math.sin(t * 30) * .1 * (t < M.iqos.a ? 1 : 0) : 0)];
  const n = 5, i = Math.floor(hop * n), f = hop * n - i;         // five little hops to the seam
  return [lerp(196, 1030, hop), GROUND - 16 - Math.sin(f * Math.PI) * 40 * (hop < 1 ? 1 : 0), hop < 1 ? 0 : 0];
}
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  const red = t > M.red.a, redK = red ? .6 + .4 * prog(t, M.glowUp.a, M.glowUp.b) : 0;
  ctx.save(); applyCam(c);
  yard(t, { light: 'night', noChickens: true });
  hose([[760, 692], [820, 700], [880, 690], [860, 676], [800, 680], [840, 690]], t, { col: '#3aa04a' });
  const flick = t < M.dead.a && Math.sin(t * 40) > .2;
  sita({ t, chip: 1, laser: inM(t, M.scan, .6, 0) || inM(t, M.bt, 0, 0), led: t < M.dead.a ? 'green' : red ? 'red' : 'off', flicker: t < M.dead.a, mood: red ? 'evil' : 'sad', talk: talk('sita', t) * .5, burn: 1, smoke: t < M.red.b ? 1 : .4, sway: t < M.look.b ? Math.sin(t * 2.5) * .6 : 0 });
  // Κώστας: realises, turns, two steps, face-plant under the fig tree
  const [kx, walking] = path(t, [[M.collapse.a, 890], [M.collapse.a + 2.2, 330]]);
  const down = ease(prog(t, M.collapse.a + 2.2, M.collapse.a + 2.8));
  const kst = { t, talk: talk('kostas', t), legs: walking ? 'walk' : 'stand', hood: true, shades: false, look: t < M.collapse.a ? [1, 0] : [-1, .3],
    brow: 'up', mouth: 'open', itemL: t < M.collapse.a + 2.4 ? 'beer' : null, itemR: t < M.collapse.a + 2.4 ? 'iqos' : null, L: [-50, -40], R: [50, -60], lid: t > M.moved.b };
  if (down > 0) { ctx.save(); ctx.translate(kx, GROUND); ctx.rotate(-down * 1.5); person(0, -150, 1, CAST.kostas, { ...kst, legs: 'stand', blink: true }); ctx.restore(); }
  else person(kx, standY(), 1, CAST.kostas, kst);
  // shades slip down his nose as it dawns on him
  if (t < M.collapse.a) { const sl = prog(t, M.look.a + .5, M.look.b); ctx.save(); ctx.translate(kx, standY() - 202 + 14 + sl * 14); for (const sx of [-17, 17]) poly([[sx - 15, -16], [sx + 15, -16], [sx + 13, 2], [sx - 13, 4]], '#141418', { lw: 3, w: .3 }); ctx.restore(); }
  // the beer can rolls away; a hen sits on his back
  if (t > M.collapse.a + 2.4) { const r = prog(t, M.collapse.a + 2.4, M.collapse.b + 1); beerCan(lerp(290, 470, r), GROUND - 10, .8, Math.PI / 2 + r * 12); }
  // the IQOS: in his pocket; the σίτα scans, pairs (red beam), and it hops across the yard to her side
  const iq = iqosPos(t);
  if (iq) { if (inM(t, M.bt, 0, 0) || inM(t, M.scan, .6, 0)) { const [ex, ey] = sitaEye(); laserBeam(ex, ey, iq[0], iq[1] - 26, .5 * prog(t, M.scan.a + .6, M.scan.a + 1.2), 1.5); }
    iqos(iq[0], iq[1], 1.1, iq[2], t > M.bt.a + 1 ? 'red' : 'white', t); }
  if (t > M.hen.a) { const hk = ease(prog(t, M.hen.a, M.hen.a + 2.2)); const hx = lerp(40, 250, hk), hy = lerp(700, 645, prog(t, M.hen.a + 1.8, M.hen.a + 2.4)); chicken(hx, hy, t, 4, '#f3efe6', { still: hk >= 1 }); }
  if (t > M.collapse.a + 3) txt('Zzz', 200 + Math.sin(t * 2) * 6, 600 - ((t * 20) % 40), 26, '#fff', { font: TVFONT, stroke: 5 });
  // mosquito lands on the seam — the σίτα lets it
  if (inM(t, M.mosq, 0, 99) && t < M.lookK.a + 1) { const k = ease(prog(t, M.mosq.a, M.mosq.a + 1.6)); mosquito(lerp(1200, 1064, k), lerp(500, 600, k), 2.4, k >= 1 ? 0 : t); }
  ctx.restore();
  applyLight('night', .9);
  if (red) applyLight('red', redK * (inM(t, M.glowUp, 0, 99) ? 1 : .35));
  ctx.save(); applyCam(c);
  if (t < M.dead.a && flick) sitaGlow({ t, led: 'green' }, .5);
  if (red) { sitaGlow({ t, led: 'red', glowR: 120 + 500 * prog(t, M.glowUp.a, M.glowUp.b) }, .7 + .3 * redK); }
  if (iq && t > M.bt.a + 1) glow(iq[0], iq[1] - 26, 50, 'rgba(255,40,40,1)', .6);
  ctx.restore();
  vignette(.55);
  if (inM(t, M.manga)) {           // 2 seconds of manga: the σίτα, giant, cape-like
    const k = ph(t, M.manga);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#f4f1ea'; ctx.fillRect(0, 0, W, H);
    speedLines(640, 360, 90, 200, '#111', 3);
    ctx.translate(640, 370 + (1 - k) * 30); ctx.scale(2.6 + k * .25, 2.6 + k * .25); ctx.translate(-1060, -587);
    sita({ t, chip: 1, led: 'red', mood: 'evil', burn: 1, flapL: .45, flapR: .45, sway: 0, open: .35, frame: true, inside: '#111' });
    ctx.restore();
    mangaize(1);
    sfxText('ΓΚΟΓΚΟΓΚΟΓΚΟ', 290, 150, 64, -.25, '#111', '#fff'); sfxText('ゴゴゴゴ', 1040, 600, 70, .2, '#111', '#fff');
  }
}
return {
  id: 'scene11', title: '11 · Οι άνθρωποι είναι παράσιτα', steps, render, fadeIn: false,
  events: M => [[M.collapse.a + 2.3, SFX.thud], [M.collapse.a + 2.6, () => tone(300, .8, 'sine', .04, .6)], [M.collapse.b - .5, SFX.snore], [M.hen.a + .4, SFX.cluck], [M.hen.b - .6, SFX.snore],
    [M.dead.a + .2, () => tone(600, 1.2, 'sine', .05, .2)], [M.red.a + .1, () => { tone(90, 1.4, 'sawtooth', .07, .8); SFX.spark(); }], [M.mosq.a + 1.6, () => SFX.buzz(.4)],
    [M.glowUp.a, SFX.swell], [M.scan.a + .6, () => tone(1200, .5, 'sine', .04, 1.5)], [M.bt.a + 1, () => [0, 4, 7].forEach((s, i) => tone(880 * 2 ** (s / 12), .12, 'square', .04, 0, i * .1))], ...[0, 1, 2, 3, 4].map(i => [M.iqos.a + .4 + i * (M.iqos.b - M.iqos.a - .7) / 5, () => tone(900, .05, 'square', .03)]), [M.insects.b + .1, () => { SFX.boom(); SFX.jingleMinor(); }]],
  ambience: (t, M) => ({ cricket: t < M.dead.a ? .03 : .012, hum: t > M.red.a ? .05 : 0 }),
};
})());
