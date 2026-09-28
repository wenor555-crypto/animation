/* Ep.2, Scene 20 – «Καμπαναριό»: full manga, the final duel of the vendetta. The σίτα alone at the top of the bell tower, red light.
   Panik climbs while the laser stings him again and again. «ΧΩΡΙΟ ΕΙΝΑΙ!» The kick: the σίτα flies off the tower into the night.
   We don't see where it lands. */
defineScene((() => {
const TX = 500;                    // bell tower base x (tower itself is at TX+90..TX+200)
const TOP = GROUND - 560;          // top of the tower walls
const CAMS = { tower: [TX + 145, 330, .95], top: [TX + 160, 60, 1.6], pk: [TX + 215, -20, 1.9], climb: [TX + 145, 300, 1.2], duo: [TX + 180, 40, 1.4], sky: [1000, 80, .9] };
const steps = [
  { act: 'night', d: 2.8, cam: 'tower' },
  { act: 'climb', d: 4.8, cam: 'climb' },
  { who: 'sita', cam: 'top', mark: 'only', el: 'Μόνο εσύ κι εγώ, Panik.', en: 'Just you and me, Panik.' },
  { who: 'panik', cam: 'pk', el: 'Και η πόλη.', en: 'And the city.' },
  { who: 'sita', cam: 'top', mark: 'village', el: 'ΧΩΡΙΟ ΕΙΝΑΙ!', en: "IT'S A VILLAGE!" },
  { who: 'sita', cam: 'duo', el: 'Γιατί εμένα; Από όλες τις σίτες του κόσμου;', en: 'Why me? Of all the σίτες in the world?' },
  { who: 'panik', cam: 'pk', el: 'Γιατί ήσουν εκεί.', en: 'Because you were there.' },
  { who: 'sita', cam: 'top', mark: 'burn', el: 'Κάηκα για σένα. Κυριολεκτικά.', en: 'I burned for you. Literally.' },
  { who: 'panik', cam: 'pk', mark: 'trash', el: '…Σκουπίδια.', en: '…Trash.', gap: .8 },
  { act: 'kick', d: 2.2, cam: 'duo' },
  { act: 'fly', d: 2.4, cam: 'sky' },
  { who: 'sita', cam: 'sky', mark: 'far', el: 'Θα επιστρέψω… με ΔΩΡΕΑΝ μεταφορικάαα…', en: "I'll be back… with FREE shippiiing…" },
  { act: 'star', d: 2.2, cam: 'sky' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS, .012);
  const kickT = M.kick.a + .6, fly = prog(t, kickT, M.fly.b + 1.4);
  ctx.save(); applyCam(c);
  sky('night', t);
  for (let i = 0; i < 8; i++) rect(-400 + i * 300, 500 + hash(i) * 60, 260, 300, '#d8ccb4', { lw: 3 });
  bellTower(TX, GROUND, t, { red: 1, helmet: true });
  poly([[-600, GROUND], [2000, GROUND], [2000, 900], [-600, 900]], '#9a948a', { lw: 0 });
  // the σίτα, on the tower roof by the cross (feet in the arch)
  const sx0 = TX + 145, sy0 = TOP - 150;
  const fx = lerp(sx0, sx0 + 1400, fly), fy = sy0 - Math.sin(Math.min(fly, .7) / .7 * Math.PI / 2) * 200 + Math.max(0, fly - .7) * 100;
  const st = { x: 0, top: 0, w: 90, h: 170, t, talk: talk('sita', t), chip: 1, led: 'red', mood: inM(t, M.burn) ? 'sad' : inM(t, M.village) ? 'shock' : 'evil', burn: 1, laser: inM(t, M.climb, .5, 0) && Math.sin(t * 5) > 0 };
  if (fly < 1) { ctx.save(); ctx.translate(fx - 45, fy); if (fly > 0) { ctx.rotate(fly * 12); ctx.scale(1 - fly * .8, 1 - fly * .8); } sitaV2({ ...st, x: 45 }); ctx.restore(); }
  // Panik climbs the tower (hands above his head, gripping the stones), then stands on the ledge
  const ck = ease(prog(t, M.climb.a, M.climb.b)), px = TX + 215, py = lerp(GROUND - 150, TOP - 110, ck);
  const climbing = t < M.climb.b, kick = bump(t, kickT - .3, kickT + .4);
  const pst = { t, talk: talk('panik', t), legs: 'stand', hood: true, shades: true, brow: 'frown', mouth: 'frown', look: [-1, -.3], L: climbing ? [-40, -250 + Math.sin(t * 6) * 20] : [-50, -40], R: climbing ? [30, -250 - Math.sin(t * 6) * 20] : [50, -60], itemL: climbing ? null : 'beer', kick, dir: -1 };
  person(px, py, 1, CAST.kostas, pst);
  if (st.laser && climbing) { laserBeam(sx0 + 20, sy0 + 40, px, py - 150, 1, 2); zapPuff(px, py - 150, (t * 3) % 1); }
  ctx.restore();
  applyLight('red', .45);
  mangaize(1);
  ctx.save(); applyCam(c); if (fly < 1) glow(fx, fy + 40, 80, 'rgba(255,30,30,1)', .9); if (st.laser && climbing) laserBeam(sx0 + 20, sy0 + 40, px, py - 150, .8, 2); ctx.restore();
  if (inM(t, M.climb) && st.laser) sfxText('ΤΣΣΠ!', 360 + hash(Math.floor(t * 4)) * 200, 200, 44, -.1, '#ff5050');
  if (inM(t, M.village)) { speedLines(640, 300, 80, 180); }
  if (inM(t, M.kick, .4, 0)) { speedLines(640, 360, 110, 90); sfxText('ΜΠΑΜ!!', 640, 380, 150, -.12, '#fff'); }
  if (inM(t, M.star, .4, 0)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const k = bump(t, M.star.a + .4, M.star.b); blob(1160, 90, 6 + k * 14, 6 + k * 14, '#ff3030', { lw: 0, glow: '#ff2020', gb: 30 }); ctx.restore(); sfxText('✦', 1160, 90, 30 + 20 * Math.sin(t * 20), 0, '#fff'); }
  vignette(.45);
}
return {
  id: 'scene20', title: '20 · Καμπαναριό', steps, render,
  events: M => {
    const e = [[M.night.a, SFX.gong], [M.village.a, () => { SFX.boom(); tone(392, 2, 'sine', .08); }], [M.kick.a + .6, () => { SFX.slam(); SFX.boom(); tone(392, 2.5, 'sine', .1); tone(196, 2.5, 'sine', .08); }], [M.fly.a, SFX.whoosh], [M.star.a + .4, SFX.ding]];
    for (let i = 0; i < 8; i++) e.push([M.climb.a + .5 + i * .55, SFX.laser]);
    return e;
  },
  ambience: () => ({ cricket: .03 }),
};
})());
