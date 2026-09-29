/* Ep.2 remake, Scene 24 – «Καμπαναριό»: the climax, full manga (the teaser of scene 1 plays here in full).
   Panik climbs through the full-power beam, which melts the tiles next to his hands. «Γιατί εμένα;» «Γιατί ήσουν εκεί.»
   She corners him at the bell and charges to full: «ΤΕΛΕΥΤΑΙΑ ΠΡΟΣΦΟΡΑ, PANIK!» Γιώργος bursts out onto the church roof at the foot of the tower with the ταψί
   (Μίμης is filming from below, and Γιώργος knows it): «ΠΙΑΣ' ΤΟ!» Slow motion: the tray spinning up through the red light;
   Panik catches it; the beam hits it and bounces straight back into her lens. White flash; she burns again.
   «Κάηκα για σένα. …Ξανά.» «…Σκουπίδια.» The kick (hit-stop, impact frame): she flies off the tower towards the dark hills.
   Χρήστος holds up the drawing he made in the morning: the same frame. */
defineScene((() => {
const SX = TWX + 145, SY = TWTOP - 150;            // the σίτα on the tower roof, by the cross
const PX = TWX + 215, PTOP = TWTOP - 110;          // Panik's ledge at the top
const ARCH = [TWX + 10, GROUND - 360];             // where Γιώργος comes out: on the church roof, at the foot of the tower (his feet)
const CAMS = { tower: [TWX + 145, 330, .95], climb: [TWX + 160, 260, 1.25], top: [TWX + 160, 60, 1.6], pk: [PX, -20, 1.9], duo: [TWX + 180, 40, 1.4],
  arch: [ARCH[0] + 30, ARCH[1] - 150, 2.1], toss: [TWX + 180, 100, 1.1], sky: [1000, 80, .9], page: [0, 0, 1] };
const steps = [
  { act: 'night', d: 2.4, cam: 'tower' },
  { act: 'climb', d: 4.6, cam: 'climb' },
  { who: 'sita', cam: 'top', mark: 'only', el: 'Μόνο εσύ κι εγώ, Panik.', en: 'Just you and me, Panik.' },
  { who: 'panik', cam: 'pk', el: 'Και η πόλη.', en: 'And the city.' },
  { who: 'sita', cam: 'top', mark: 'village', el: 'ΧΩΡΙΟ ΕΙΝΑΙ!', en: "IT'S A VILLAGE!" },
  { who: 'sita', cam: 'duo', el: 'Γιατί εμένα; Από όλες τις σίτες του κόσμου;', en: 'Why me? Of all the σίτες in the world?' },
  { who: 'panik', cam: 'pk', mark: 'there', el: 'Γιατί ήσουν εκεί.', en: 'Because you were there.' },
  { act: 'corner', d: 1.4, cam: 'duo' },
  { who: 'sita', cam: 'top', mark: 'last', el: 'ΤΕΛΕΥΤΑΙΑ ΠΡΟΣΦΟΡΑ, PANIK!', en: 'FINAL OFFER, PANIK!' },
  { who: 'giorgos', cam: 'arch', mark: 'catch', el: 'ΠΙΑΣ\' ΤΟ! …Και να πεις σε όλους ποιος στο έδωσε!', en: 'CATCH! …And tell everyone who gave it to you!' },
  { act: 'toss', d: 2.6, cam: 'toss' },
  { act: 'reflect', d: 2.2, cam: 'duo' },
  { who: 'sita', cam: 'top', mark: 'burn', el: 'Κάηκα για σένα. …Ξανά.', en: 'I burned for you. …Again.' },
  { who: 'panik', cam: 'pk', mark: 'trash', el: '…Σκουπίδια.', en: '…Trash.', gap: .8 },
  { act: 'kick', d: 2.2, cam: 'duo' },
  { act: 'fly', d: 1.6, cam: 'sky' },
  { who: 'sita', cam: 'sky', mark: 'far', el: 'Θα επιστρέψω… με ΔΩΡΕΑΝ μεταφορικάαα…', en: "I'll be back… with FREE shippiiing…" },
  { act: 'page', d: 3, cam: 'page' },
];
let M;
const THROW = () => M.toss.a + .2, CATCH = () => M.toss.b - .4, HIT = () => M.reflect.a + .4, KICK = () => M.kick.a + .6;
/* Χρήστος's page from the morning, held up in his hands against the night sky: it's the same frame */
function page(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0c0a14'; ctx.fillRect(0, 0, W, H);
  const k = ease(prog(t, M.page.a, M.page.a + .6));
  ctx.translate(640, 380 + (1 - k) * 300);
  rect(-330, -300, 660, 520, '#fbf8ef', { lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(-300, -270, 600, 460); ctx.clip();
  speedLines(640 - 80, 360 - 70, 60, 110, 'rgba(0,0,0,.45)', 5);
  ctx.strokeStyle = '#141414'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(300, -250); ctx.lineTo(-80, -70); ctx.lineTo(300, -200); ctx.stroke();
  ctx.strokeStyle = '#fbf8ef'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(300, -250); ctx.lineTo(-80, -70); ctx.lineTo(300, -200); ctx.stroke();
  blob(-80, -70, 80, 70, '#e8e8e8', { lw: 6 }); blob(-80, -70, 62, 52, '#d0d0d0', { lw: 2.5 });
  blob(-160, 10, 24, 20, '#e8e8e8', { lw: 4 }); blob(0, 10, 24, 20, '#e8e8e8', { lw: 4 });
  poly([[-200, 190], [-170, 40], [-80, 20], [10, 40], [40, 190]], '#2a2a2a', { lw: 4 });
  txt('ΚΛΑΝΓΚ', 170, 80, 54, '#141414', { font: TVFONT, style: 'italic', weight: 900 });
  ctx.restore();
  // his hands at the edges
  blob(-340, 60, 30, 26, CAST.christos.skin, { lw: 3 }); blob(340, 60, 30, 26, CAST.christos.skin, { lw: 3 });
  ctx.restore();
  if (t > M.page.a + 1) txt(lang === 'el' ? 'ΤΟ ΙΔΙΟ ΚΑΡΕ.' : 'THE SAME FRAME.', 640, 680, 30, '#ffd23f', { font: TVFONT, style: 'italic', weight: 900 });
  vignette(.5);
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'page') return page(t);
  const T0 = t;
  t = fxTime(t, [{ a: THROW() + .3, b: CATCH() - .1, rate: .3, catch: .3 }, { a: HIT(), b: HIT() + .2, rate: 0, catch: 0 }, { a: KICK(), b: KICK() + .22, rate: 0, catch: 0 }]);
  const c = fxCam(shotCam(sc, T0, CAMS, .012), T0, [[HIT(), 24, .8], [KICK(), 26, .8], [M.village.a, 8, .5]]);
  const fly = prog(t, KICK(), M.fly.b + 1.2);
  ctx.save(); applyCamFx(c);
  towerSet(t, { helmet: false });
  // tiles melting where the climbing beam lands: scorch marks that stay
  const climbHits = [0, 1, 2, 3, 4, 5].map(i => [M.climb.a + .6 + i * .65, TWX + 200 + (i % 2 ? 40 : -10), GROUND - 180 - i * 60]);
  for (const [ht, hx, hy] of climbHits) if (t > ht) { blob(hx, hy, 16, 10, 'rgba(20,10,5,.7)', { lw: 0 }); fxBurst(t, ht, hx, hy, { kind: 'tile', n: 6, speed: 300, grav: 1300, life: 1 }); }
  // the σίτα
  const fx = lerp(SX, SX + 1500, fly), fy = SY - Math.sin(Math.min(fly, .7) / .7 * Math.PI / 2) * 220 + Math.max(0, fly - .7) * 160;
  const burnt = t > HIT();
  const st = { x: 0, top: 0, w: 90, h: 170, t, talk: talk('sita', T0), chip: 1, led: 'red', mood: burnt ? 'shock' : inM(t, M.village) ? 'shock' : 'evil', burn: 1, laser: true };
  if (fly < 1) { ctx.save(); ctx.translate(fx - 45, fy); if (fly > 0) { ctx.rotate(fly * 12); ctx.scale(1 - fly * .8, 1 - fly * .8); } sitaV2({ ...st, x: 45 }); ctx.restore(); }
  if (burnt && fly <= 0) fxFire(SX, SY + 150, .5, t, clamp((t - HIT()) * 2) * (1 - clamp((t - M.burn.b) / 2)));
  // Panik: climbing, then on the ledge; the tray in both hands after the catch
  const ck = ease(prog(t, M.climb.a, M.climb.b)), py = lerp(GROUND - 150, PTOP, ck), climbing = t < M.climb.b, kick = bump(t, KICK() - .3, KICK() + .4);
  const hasTray = t > CATCH() && t < KICK() - .4;
  person(PX, py, 1, CAST.kostas, { t, talk: talk('panik', T0), legs: 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', look: [-1, -.3],
    L: climbing ? [-40, -250 + Math.sin(t * 6) * 20] : hasTray ? [70, -170] : [-50, -40], R: climbing ? [30, -250 - Math.sin(t * 6) * 20] : hasTray ? [40, -150] : [50, -60],
    itemL: climbing || hasTray ? null : 'beer', kick, dir: -1 });
  const TRAY = [PX - 60, PTOP - 160];                      // held up in front of him, towards her (he faces left: dir -1 mirrors the offsets)
  if (hasTray) { ctx.save(); ctx.translate(TRAY[0], TRAY[1]); ctx.rotate(-.3); blob(0, 0, 40, 50, '#c8ccd2', { lw: 4 }); blob(0, 0, 30, 38, '#b0b4ba', { lw: 1.5 }); ctx.restore(); }
  // Γιώργος out of the bell arch, throwing the ταψί; the tray spins up in slow motion
  if (t > M.catch.a - .6 && t < M.kick.b) {
    const out = ease(prog(t, M.catch.a - .6, M.catch.a));
    person(ARCH[0], ARCH[1] - 120 + (1 - out) * 80, .8, { ...CAST.giorgos, topCol: '#2a3a6a' }, { t, talk: talk('giorgos', T0), legs: 'stand', look: [1, -.8], brow: 'up', mouth: 'open', L: t < THROW() ? [30, -200] : [80, -260], R: t < THROW() ? [60, -190] : [100, -250] });
    if (t < THROW()) { ctx.save(); ctx.translate(ARCH[0] + 40, ARCH[1] - 290); blob(0, 0, 34, 30, '#c8ccd2', { lw: 3 }); ctx.restore(); }
  }
  if (t > THROW() && t < CATCH()) {
    const k = (t - THROW()) / (CATCH() - THROW()), tx = lerp(ARCH[0] + 40, TRAY[0], k), ty = lerp(ARCH[1] - 290, TRAY[1], k) - Math.sin(k * Math.PI) * 120;
    ctx.save(); ctx.translate(tx, ty); ctx.rotate(t * 8); ctx.scale(1, .5 + .5 * Math.abs(Math.cos(t * 8))); blob(0, 0, 44, 44, '#c8ccd2', { lw: 4 }); blob(0, 0, 32, 32, '#b0b4ba', { lw: 1.5 }); ctx.restore();
  }
  ctx.restore();
  applyLight('red', .45);
  mangaize(1);
  // colour after the manga pass: the red laser, the glints on the tray, the fire
  ctx.save(); applyCamFx(c);
  const [ex, ey] = fly < 1 ? [fx + 18, fy + 42] : [0, 0];
  if (fly < 1) glow(ex, ey, 80, 'rgba(255,30,30,1)', .9);
  if (climbing && t > M.climb.a + .5) { const i = Math.min(5, Math.floor((t - M.climb.a - .6) / .65)); const [, hx, hy] = climbHits[Math.max(0, i)]; if (Math.sin(t * 5) > -.3) fxBeam(ex, ey, hx, hy, t, { width: .9 }); }
  if (inM(t, M.corner) || inM(t, M.last) || inM(t, M.catch) || inM(t, M.toss)) fxCharge(t, ex, ey, clamp(prog(t, M.corner.a, M.toss.b)));
  if (t > CATCH() && t < HIT() + 1.4) {                  // the shot: into the tray, and straight back into her lens
    fxBeam(ex, ey, TRAY[0], TRAY[1], t, { width: 1.6 });
    if (t > HIT()) { fxBeam(TRAY[0], TRAY[1], ex, ey, t, { width: 1.6 }); glow(TRAY[0], TRAY[1], 120, 'rgba(255,255,255,1)', .8); }
  }
  if (t > THROW() && t < CATCH()) { const k = (t - THROW()) / (CATCH() - THROW()); glow(lerp(ARCH[0] + 40, TRAY[0], k), lerp(ARCH[1] - 290, TRAY[1], k) - Math.sin(k * Math.PI) * 120, 60, 'rgba(255,220,220,1)', .5 + .4 * Math.sin(t * 16)); }
  if (burnt && fly <= 0) fxFire(SX, SY + 150, .5, t, clamp((t - HIT()) * 2) * (1 - clamp((t - M.burn.b) / 2)));
  ctx.restore();
  fxFlash(fxHitLight(t, [[HIT(), 1.2], [KICK(), .5]]), '255,255,255');
  fxImpact(T0, HIT() + .05, 640, 200, .1); fxImpact(T0, KICK(), 640, 300, .09);
  fxLetterbox(inM(T0, M.toss) || inM(T0, M.reflect) ? 1 : 0);
  if (inM(t, M.climb) && Math.sin(t * 5) > .5) sfxText('ΤΣΣΣ!', 360 + hash(Math.floor(t * 4)) * 200, 200, 44, -.1, '#ff5050');
  if (inM(t, M.village)) speedLines(640, 300, 80, 180);
  if (inM(T0, M.reflect, .3, -.6)) { speedLines(640, 200, 110, 90); sfxText('ΚΛΑΝΓΚ!!', 640, 380, 140, -.1, '#fff'); }
  if (inM(T0, M.kick, .5, 0)) { speedLines(640, 360, 110, 90); sfxText('ΜΠΑΜ!!', 640, 380, 150, -.12, '#fff'); }
  vignette(.45);
}
return {
  id: 'scene24', title: '24 · Καμπαναριό', steps, render,
  events: M => {
    const e = [[M.night.a, SFX.gong], [M.climb.a, () => fxScore(4, 140, .9)], [M.village.a, () => { SFX.boom(); tone(392, 2, 'sine', .08); }], [M.corner.a, () => { FXS.charge(3.2); FXS.riser(3.4); }],
      [M.toss.a + .2, FXS.whoosh], [M.toss.a + .5, () => tone(600, 2.2, 'sine', .04, 1.5)], [M.reflect.a + .4, () => { FXS.clang(); FXS.boom(1.2); FXS.laser(1.2); }],
      [M.kick.a + .6, () => { SFX.slam(); SFX.boom(); tone(392, 2.5, 'sine', .1); tone(196, 2.5, 'sine', .08); }], [M.fly.a, SFX.whoosh], [M.page.a + .4, () => { tone(523, 1.4, 'sine', .05); tone(659, 1.4, 'sine', .04, 1, .3); }]];
    for (let i = 0; i < 6; i++) e.push([M.climb.a + .6 + i * .65, () => { FXS.laser(.3); noise(.2, .15, 1200, 1, 'bandpass'); }]);
    return e;
  },
  ambience: () => ({ cricket: .03 }),
};
})());
