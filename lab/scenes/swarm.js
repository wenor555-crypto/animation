/* Lab: a swarm test: 300+ of the σίτα's machines (robot vacuums on the ground, drones and rackets in the air, bulbs),
   some shot down, through the v2 pipeline. Measures the cost of a crowded battle frame. */
defineScene((() => {
const steps = [{ act: 'swarm', d: 6, cam: 'all' }];
const GY = 640;
let S = null;
function build(M) {
  const t0 = M.swarm.a;
  return [
    ARMY.swarm({ seed: 1, n: 120, kind: 'vac', t0, spread: 2.5, from: i => [1400 + hash(i) * 300, GY], to: (i, t, u) => [260 + hash(i * 3) * 700, GY], dur: 3.2, size: [18, 50], band: [560, 690], wob: 10, killAt: i => i % 7 === 0 ? t0 + 2 + hash(i) * 3 : null }),
    ARMY.swarm({ seed: 2, n: 110, kind: 'drone', t0, spread: 2, from: i => [1400 + hash(i * 5) * 200, 120 + hash(i * 7) * 300], to: (i, t, u) => [300 + hash(i * 11) * 800, 150 + hash(i * 13) * 330], dur: 2.6, size: [18, 54], hover: true, wob: 22, killAt: i => i % 6 === 0 ? t0 + 2.5 + hash(i * 2) * 3 : null }),
    ARMY.swarm({ seed: 3, n: 50, kind: 'bulb', t0: t0 + .5, spread: 1.5, from: i => [700 + hash(i * 3) * 600, -40], to: (i, t) => [200 + hash(i * 9) * 900, 90 + hash(i * 4) * 200], dur: 2, size: [16, 30], hover: true, wob: 14 }),
    ARMY.swarm({ seed: 4, n: 40, kind: 'racket', t0: t0 + 1, spread: 2, from: i => [1350, 300 + hash(i) * 200], to: (i, t) => [400 + hash(i * 17) * 600, 250 + hash(i * 19) * 250], dur: 2.2, size: [30, 60], hover: true, wob: 30, spin: 3 }),
  ];
}
function render(t, M) {
  if (!S) S = build(M);
  const n = S.reduce((a, s) => a + s.units.length, 0);
  RV2.frame(t, {
    layers: [
      { name: 'bg', draw: () => villageStreet(t, { light: 'night' }), dof: 3, cache: 'street-night' },
      { name: 'army', draw: () => { for (const s of S) ARMY.draw(s, t); } },
    ],
    ambient: 'rgb(70,78,118)', lights: [{ x: 640, y: 200, r: 700, col: 'rgba(255,90,70,1)', k: .35 }],
    emit: () => { for (const s of S) ARMY.emit(s, t); }, bloom: 1,
    tint: ['#c8d4ff', '#e8d8ff'], vignette: .5, grain: .08,
    after: () => txt(`ΣΜΗΝΟΣ: ${n} μονάδες`, 640, 40, 22, '#fff', { font: TVFONT, weight: 900 }),
  });
}
return { id: 'scene04', title: 'swarm lab', steps, render, fade: false };
})());
