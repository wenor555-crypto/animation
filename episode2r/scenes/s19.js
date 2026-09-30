/* Ep.2 remake, Scene 19 – «Panik εναντίον IQOS»: full manga, the most stylised sequence so far. The IQOS drops its mask: holder and
   charger split and «transform» into a tiny assassin mecha with a red eye and a TEREA-stick katana. A chase over Λέχαιο's roof
   tiles (they burst under their feet), a slow-motion jump across a lane at dusk; the katana cuts his beer can in half and the beer
   sprays like blood in a samurai film (colour in the manga). Its battery blinks empty. «…Σκουπίδια.» Kick (hit-stop, impact frame).
   It lands in the bin; the bin swallows it and burps, and stays standing, its LED red (the «friend» of Ep. 3). */
defineScene((() => {
const IQ = ['ΣΙΤΑ (από το IQOS)', 'SITA (from the IQOS)'];
const CAMS = { roof: [640, 340, 1.05], split: [600, 390, 1.9], pan: [640, 340, 1.2], pk: [640, 220, 1.9], low: [640, 400, 2], bin: [760, 540, 1.6], binC: [760, 560, 2.4] };
const steps = [
  { act: 'stand', d: 2.6, cam: 'roof' },
  { act: 'unmask', d: 3.4, cam: 'split' },
  { who: 'sita', label: IQ, cam: 'split', mark: 'on', el: 'Ο στόχος ενεργοποιήθηκε.', en: 'Target activated.' },
  { who: 'panik', cam: 'pk', mark: 'you', el: 'Εσύ; Με πρόδωσες εσύ;', en: 'You? YOU betrayed me?' },
  { act: 'chase', d: 4.6, cam: 'pan' },
  { who: 'panik', cam: 'pk', el: 'Σε φόρτιζα κάθε βράδυ.', en: 'I charged you every night.' },
  { act: 'clash', d: 2.4, cam: 'pan' },
  { who: 'panik', cam: 'pk', mark: 'beer', el: 'Την μπύρα μου… Αυτό ήταν λάθος.', en: 'My beer… That was a mistake.', gap: .5 },
  { who: 'panik', cam: 'pk', mark: 'one', el: 'Ένα τσιγάρο βγάζεις. Ένα.', en: "One smoke, that's all you're good for. One." },
  { act: 'empty', d: 2.6, cam: 'low' },
  { who: 'panik', cam: 'pk', mark: 'trash', el: '…Σκουπίδια.', en: '…Trash.', gap: .6 },
  { act: 'kick', d: 2, cam: 'pan' },
  { act: 'fall', d: 2.8, cam: 'bin' },
  { act: 'swallow', d: 2.6, cam: 'binC' },
];
let M;
const RY = 470;                    // the ridge line everyone runs on
function roofRow(t) {
  sky('dusk', t);
  for (let i = -4; i < 14; i++) rect(i * 180 - 40, 330 + hash(i + 40) * 60, 160, 400, '#8a8478', { lw: 2.5, w: .3 });      // far houses
  for (let i = -3; i < 12; i++) {
    const x = i * 260, top = RY + (i % 3) * 5;
    rect(x, top + 50, 250, 400, '#e8dcc4', { lw: 4, w: .5 });
    rect(x + 80, top + 110, 60, 70, '#2a2420', { lw: 3 });
    poly([[x - 12, top], [x + 262, top], [x + 252, top + 56], [x - 2, top + 56]], '#c4643c', { lw: 4, w: .5 });
    for (let k = 0; k < 10; k++) curve([[x + k * 27, top + 2], [x + k * 27 + 2, top + 54]], 2, '#9c4a2a', { w: .2 });
    if (i % 4 === 1) { rect(x + 190, top - 60, 26, 60, '#b8b0a0', { lw: 3 }); }                                            // chimney
  }
}
const JUMP = () => M.chase.a + 2, CUT = () => M.clash.a + .8, KICK = () => M.kick.a + .5;
function render(t, _M, sc) {
  M = _M;
  const TW = [{ a: JUMP(), b: JUMP() + 1, rate: .3, catch: .3 }, { a: CUT(), b: CUT() + .18, rate: 0, catch: 0 }, { a: KICK(), b: KICK() + .2, rate: 0, catch: 0 }];
  const T0 = t; t = fxTime(t, TW);
  const [, shot] = shotAt(sc, T0);
  // positions along the roofs: Panik runs right, the mecha chases; clash; the mecha runs out of battery; kick
  const [px] = path(t, [[M.chase.a, 500], [M.chase.b, 1300], [M.clash.b, 1360]]);
  const [mx] = path(t, [[M.unmask.a, 640], [M.chase.a, 640], [M.chase.b, 1150], [M.clash.b, 1230]]);
  const k = ease(prog(t, M.unmask.a + .6, M.unmask.b - .4));
  const kickT = M.kick.a + .5, fly = prog(t, kickT, kickT + 1.4);
  const camX = shot === 'pan' ? (px + mx) / 2 : shot === 'pk' ? px : 640;
  const c = fxCam(shotCam(sc, T0, { ...CAMS, pan: [camX, 340, 1.2], pk: [t > M.chase.a ? px : 500, 220, 1.9], low: [(px + mx) / 2, 400, 2] }, .01), T0, [[CUT(), 10, .4], [KICK(), 22, .7], [M.fall.a + 1.2, 10, .4]]);
  ctx.save(); applyCamFx(c);
  if (shot === 'bin' || shot === 'binC') {
    villageStreet(t, { light: 'night', redLamp: false, lamp: true });
    const fk = ease(prog(t, M.fall.a, M.fall.a + 1.2)), sw = prog(t, M.swallow.a, M.swallow.a + .5), top = ease(prog(t, M.swallow.a + 1, M.swallow.a + 1.8));
    ctx.save(); ctx.translate(760, 690); ctx.rotate(.08 - Math.sin(top * Math.PI) * .12);
    poly([[-44, 0], [44, 0], [50, -110], [-50, -110]], '#3a7a4a', { lw: 4, w: .5 });
    ctx.save(); ctx.translate(0, -118); ctx.rotate(sw < 1 ? -.9 + sw * .9 : 0); rect(-56, -6, 112, 16, '#2e6a3c', { lw: 3.5, w: .4 }); ctx.restore();
    curve([[-30, -80], [-10, -60], [-26, -40]], 3, '#2a5a34'); redEye(18, -118, 5);
    ctx.restore();
    if (fk < 1) iqosMecha(760 + (1 - fk) * 200, lerp(-100, 580, fk * fk), t, { k: 1, swing: 0 });
    if (inM(t, M.swallow, 0, .6)) sfxText('ΓΚΛΟΥΠ', 760, 450, 50, -.1, '#fff');
    if (top > .1 && top < .95) sfxText('ΜΠΡΡΡ', 820, 480, 50, .1, '#fff');
  } else {
    roofRow(t);
    // Panik: hood, shades, beer can in his fist
    const dodge = inM(t, M.chase) ? Math.max(0, Math.sin(t * 5)) : 0, kick = bump(t, kickT - .3, kickT + .4);
    const pst = { t, talk: talk('panik', T0), legs: inM(t, M.chase) ? 'walk' : 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', look: [-1, inM(t, M.trash) || inM(t, M.empty) ? .8 : 0],
      L: [-50, -40], itemL: 'beer', R: inM(t, M.clash) ? [-80, -200] : [50, -60], itemR: t < M.unmask.a + .6 ? 'iqos' : null, iqosLed: 'red', kick, dir: -1 };
    const jk = prog(t, JUMP(), JUMP() + 1.1), jumpY = Math.sin(jk * Math.PI) * 160;
    if (t > CUT()) pst.itemL = null;
    ctx.save(); ctx.translate(t > M.chase.a ? px : 500, RY - 146 - dodge * 40 - jumpY); person(0, 0, 1, CAST.kostas, pst); ctx.restore();
    if (inM(t, M.chase)) fxEmit(t, M.chase.a, M.chase.b, .35, tt => path(tt, [[M.chase.a, 500], [M.chase.b, 1300]])[0], RY + 4, { kind: 'tile', n: 5, speed: 320, grav: 1300, life: 1, size: 1.1 });
    fxBurst(t, CUT(), (t > M.chase.a ? px : 500) - 50, RY - 186, { kind: 'drop', n: 40, speed: 520, grav: 1100, life: 1.2, size: 1.3, col: '#e8b43a' });
    fxBurst(t, CUT(), (t > M.chase.a ? px : 500) - 50, RY - 186, { kind: 'spark', n: 20, speed: 700, life: .4 });
    if (t > CUT() && t < CUT() + 2) { const hx = (t > M.chase.a ? px : 500) - 60; ctx.save(); ctx.translate(hx, RY + 50 - Math.max(0, 1 - (t - CUT()) * 2) * 140); ctx.rotate((t - CUT()) * 8); beerCan(0, 0, .8, 0); ctx.restore(); }
    // the IQOS mecha
    if (t > M.unmask.a + .6) {
      const batt = t > M.empty.a, slow = batt ? prog(t, M.empty.a, M.empty.b) : 0;
      const hop = inM(t, M.chase) ? Math.abs(Math.sin(t * 8)) * 30 : 0;
      const kx = fly > 0 ? lerp(mx, mx - 900, fly) : mx, ky = fly > 0 ? RY - Math.sin(fly * Math.PI) * 300 + fly * 300 : RY - hop;
      ctx.save(); ctx.translate(kx, ky); if (fly > 0) ctx.rotate(fly * 14); ctx.scale(1.5, 1.5 - slow * .3);
      iqosMecha(0, 0, t, { k: t < M.unmask.b - .4 ? k : 1, swing: inM(t, M.chase) || inM(t, M.clash) ? (Math.sin(t * 9) + 1) / 2 : slow * .5 });
      ctx.restore();
      if (batt && fly <= 0 && Math.sin(t * 9) > 0) { ctx.save(); ctx.translate(kx, ky - 160); rect(-22, -10, 44, 20, null, { lw: 2.5, sc: '#fff' }); rect(22, -4, 4, 8, '#fff', { lw: 0 }); rect(-19, -7, 6, 14, '#ff3030', { lw: 0 }); ctx.restore(); }
    }
  }
  ctx.restore();
  applyLight('night', .35);
  mangaize(1);
  // after the manga pass: only the IQOS's red keeps its colour
  ctx.save(); applyCam(c);
  if (shot !== 'bin' && shot !== 'binC' && t > M.unmask.a && fly < 1) {
    const kx = fly > 0 ? lerp(mx, mx - 900, fly) : mx, ky = fly > 0 ? RY - Math.sin(fly * Math.PI) * 300 + fly * 300 : RY;
    glow(kx, ky - 114, 50, 'rgba(255,30,30,1)', t > M.empty.a ? .3 : .9);
  }
  if (shot === 'bin' || shot === 'binC') glow(778, 574, 60, 'rgba(255,40,40,1)', .7);
  ctx.restore();
  if (inM(t, M.unmask, .6, -.6)) { speedLines(640, 300, 90, 160); sfxText('ΚΛΙΚ-ΚΛΑΚ-ΚΡΑΤΣ', 640, 600, 60, -.08, '#fff'); }
  if (inM(t, M.chase)) { speedLines(640, 360, 50, 300); if (Math.sin(t * 9) > .8) sfxText('ΣΟΥΙΣ', 400 + hash(Math.floor(t * 3)) * 500, 200, 50, -.1, '#fff'); }
  if (inM(t, M.clash)) { sfxText('ΚΛΙΝΓΚ!', 640, 200, 80, -.1, '#fff'); speedLines(640, 360, 80, 120); }
  if (inM(t, M.empty, .3, 0)) sfxText('ΜΠΑΤΑΡΙΑ 0%', 640, 140, 50, 0, '#fff');
  if (inM(t, M.kick, .3, 1)) { speedLines(640, 360, 100, 100); sfxText('ΜΠΑΜ!', 500, 300, 110, -.12, '#fff'); }
  if (T0 > CUT() && T0 < CUT() + 1) { ctx.save(); applyCamFx(c); fxBurst(t, CUT(), (t > M.chase.a ? path(t, [[M.chase.a, 500], [M.chase.b, 1300], [M.clash.b, 1360]])[0] : 500) - 50, RY - 186, { kind: 'drop', n: 40, speed: 520, grav: 1100, life: 1.2, size: 1.3, col: '#e8b43a' }); ctx.restore(); sfxText('ΤΣΑΚ!', 700, 180, 80, .1, '#ffd23f'); }
  fxImpact(T0, CUT(), 640, 300, .07); fxImpact(T0, KICK(), 500, 300, .08);
  fxLetterbox(inM(T0, M.chase, 1.8, -1.4) ? 1 : 0);
  vignette(.4);
}
return {
  id: 'scene19', title: '19 · Panik εναντίον IQOS', steps, render,
  events: M => [[M.stand.a + .3, SFX.gong], [M.unmask.a + .6, () => { SFX.clacks(5); SFX.rev(); }], [M.unmask.b - .6, SFX.boom], [M.on.a - .2, SFX.clack],
    [M.chase.a, SFX.drums], [M.chase.a + 1.2, SFX.whoosh], [M.chase.a + 2.4, SFX.whoosh], [M.chase.a + 3.6, SFX.whoosh],
    [M.clash.a + .3, () => { SFX.spark(); tone(2400, .6, 'triangle', .06, .98); }], [M.clash.a + .8, () => { FXS.hit(); noise(.8, .3, 900, .6, 'bandpass'); }], [M.chase.a + 2, () => tone(180, 1.2, 'sine', .05, 2)], [M.chase.a, () => fxScore(4, 140, .8)], [M.clash.a + 1.2, SFX.spark], [M.empty.a + .3, () => tone(600, 1.2, 'square', .03, .3)],
    [M.kick.a + .5, () => { SFX.slam(); SFX.whoosh(); }], [M.fall.a + 1.2, SFX.slam], [M.swallow.a + .1, () => tone(90, .5, 'sine', .15, .5)], [M.swallow.a + 1.1, () => { tone(70, .6, 'sawtooth', .08, .7); noise(.5, .15, 300, 1, 'lowpass'); }]],
  ambience: () => ({ cricket: .02 }),
};
})());
