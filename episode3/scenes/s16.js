/* Ep.3, Scene 16 – «Ο Panik δεν σταματάει»: the same night, the third can: a quick manga transformation. Panik walks the village:
   pigeons are ΔΕΗ drones; he kicks the village pump shut («Μας ψεκάζουν. Με 5G.»), rips Γιώργος's poster («Πυραμίδα. Το ήξερα.»),
   and uproots a STOP sign with its concrete and carries it home. */
defineScene((() => {
const CAMS = { trans: [640, 360, 2], wires: [640, 300, 1.4], pk: [0, 330, 2], pump: [1100, 480, 1.5], poster: [860, 430, 1.7], stop: [640, 420, 1.3], stopC: [640, 340, 2], away: [640, 420, 1] };
const steps = [
  { act: 'trans', d: 3, cam: 'trans' },
  { act: 'walk', d: 2, cam: 'wires' },
  { who: 'panik', cam: 'wires', mark: 'pigeons', el: 'Τα περιστέρια… είναι drones της ΔΕΗ.', en: 'The pigeons… are power-company drones.' },
  { who: 'panik', cam: 'pk', el: 'Γι\' αυτό κάθονται στα καλώδια. Φορτίζουν.', en: "That's why they sit on the wires. They're charging." },
  { act: 'pump', d: 1.8, cam: 'pump' },
  { who: 'panik', cam: 'pump', mark: 'fiveg', el: 'Μας ψεκάζουν. Με το νερό. Με 5G.', en: "They're spraying us. Through the water. With 5G." },
  { act: 'poster', d: 1.4, cam: 'poster' },
  { who: 'panik', cam: 'poster', mark: 'pyr', el: 'Πυραμίδα. Το ήξερα.', en: 'A pyramid. I knew it.' },
  { act: 'stop', d: 1.6, cam: 'stop' },
  { who: 'panik', cam: 'stopC', mark: 'sys', el: 'Το σύστημα… μου λέει να σταματήσω.', en: 'The system… is telling me to stop.' },
  { who: 'panik', cam: 'stopC', mark: 'never', el: 'Ο Panik δεν σταματάει.', en: 'Panik does not stop.', gap: .8 },
  { act: 'rip', d: 2.4, cam: 'stop' },
  { who: 'panik', cam: 'stop', mark: 'with', el: 'Εσύ έρχεσαι μαζί μου.', en: "You're coming with me." },
  { act: 'away', d: 3.2, cam: 'away' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  // Panik's walk: x over the whole scene
  const [px, pw] = path(t, [[M.walk.a, -200], [M.pigeons.b, 500], [M.pump.a, 900], [M.fiveg.b, 980], [M.poster.a + .6, 820], [M.stop.a + .8, 560], [M.away.a, 560], [M.away.b, 1500]]);
  const c = shotCam(sc, t, { ...CAMS, pk: [px, 330, 2] }, .01);
  ctx.save(); applyCam(c);
  villageStreet(t, { light: 'night', lamp: true, pole: false });
  // wires with pigeons (drones?)
  curve([[-600, 170], [640, 200], [2000, 170]], 2.5); curve([[-600, 190], [640, 216], [2000, 186]], 2.5);
  for (let i = 0; i < 7; i++) { const x = 200 + i * 120, y = 194 + Math.sin(x / 400) * 8; blob(x, y - 12, 14, 10, '#8a8a92', { lw: 2.5 }); blob(x + 12, y - 22, 7, 7, '#8a8a92', { lw: 2 }); if (inM(t, M.pigeons, .5, 3)) redEye(x + 14, y - 23, 2); }
  pump(1130, 690, t, ease(prog(t, M.pump.a + .6, M.pump.a + 1)));
  gioPoster(860, 360, ease(prog(t, M.poster.a + .4, M.poster.a + 1.1)));
  // the STOP sign: in the pavement until he rips it out, then on his shoulder
  const ripK = ease(prog(t, M.rip.a + .4, M.rip.a + 1.6)), carried = t > M.rip.a + 1.6;
  if (!carried) stopSign(700, 690 - ripK * 60, 1, { lean: ripK * .3, concrete: ripK > 0 });
  const kick = bump(t, M.pump.a + .3, M.pump.a + .9);
  const st = { t, talk: talk('panik', t), legs: pw ? 'walk' : 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', look: inM(t, M.pigeons) ? [0, -1] : [1, 0], kick,
    L: carried ? [-40, -260] : inM(t, M.poster) ? [100, -170] : inM(t, M.rip) ? [110, -200] : [-50, -40], itemL: carried || inM(t, M.rip) || inM(t, M.poster) ? null : 'beer',
    R: inM(t, M.rip) ? [120, -160] : inM(t, M.poster) ? [140, -170] : [50, -60], tilt: Math.sin(t * 1.3) * .06 };
  if (shot !== 'trans') {
    person(px, standY(), 1, CAST.kostas, st);
    if (carried) { ctx.save(); ctx.translate(px - 40, standY() - 150); ctx.rotate(-1.1); stopSign(0, 0, .8, { concrete: true }); ctx.restore(); }
  }
  ctx.restore();
  applyLight('night', .7);
  ctx.save(); applyCam(c); glow(722, 190, 300, 'rgba(255,230,160,1)', .35); ctx.restore();
  if (shot === 'trans') {
    // full-frame manga transformation (can #3 → hood → shades)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore();
    const k = prog(t, M.trans.a, M.trans.b);
    ctx.save(); applyCam(CAMS.trans);
    person(640, 500, 1, CAST.kostas, { t, legs: 'stand', hood: k > .45, shades: k > .7, brow: k > .7 ? 'frown' : 'flat', mouth: k > .7 ? 'frown' : 'smirk', lid: k < .7, L: k < .3 ? [-20, -200] : k < .55 ? [-50, -260] : k < .75 ? [-10, -210] : [-50, -40], itemL: k < .3 ? 'beer' : null });
    ctx.restore();
    mangaize(1); speedLines(640, 300, 100, 150);
    txt('3', 1120, 110, 90, '#111', { font: TVFONT, weight: 900 });
    if (k > .7) sfxText('PANIK', 640, 620, 120, -.08, '#c8f04a', '#111');
  }
  if (inM(t, M.pump, .5, .6)) sfxText('ΚΛΑΝΓΚ!', 1100, 360, 60, -.1, '#ffd23f');
  if (inM(t, M.poster, .4, .3)) sfxText('ΡΡΡΙΤΣ', 860, 200, 50, .1, '#fff');
  if (inM(t, M.rip, .3, -.6)) { mangaize(.9); speedLines(640, 380, 90, 140); sfxText('ΚΡΑΑΑΚ!', 640, 150, 90, -.1, '#fff'); }
  vignette(.45);
}
return {
  id: 'scene16', title: '16 · Ο Panik δεν σταματάει', steps, render,
  events: M => [[M.trans.a, () => { SFX.sip(); SFX.crash(); }], [M.trans.a + 1.2, SFX.whoosh], [M.trans.a + 2.2, () => { SFX.boom(); SFX.gong(); }], [M.pigeons.a + .5, () => tone(900, .8, 'sine', .02, 1.1)],
    [M.pump.a + .6, () => { SFX.slam(); tone(300, .6, 'triangle', .06, .6); }], [M.poster.a + .4, () => noise(.4, .25, 2500, 1, 'bandpass')], [M.rip.a + .4, SFX.rev], [M.rip.a + 1.3, () => { SFX.crash(); SFX.boom(); }]],
  ambience: () => ({ cricket: .03 }),
};
})());
