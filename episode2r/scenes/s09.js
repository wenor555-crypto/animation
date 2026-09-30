/* Ep.2 remake, Scene 9 – «Ατυχήματα»: sober Κώστας walks through the village to Μίμης's. The IQOS tries to kill him and fails:
   it overheats in his pocket (he likes it: a hot-water bottle), it vibrates off the edge of a roof terrace (he saves it),
   it pulls him towards the road as a van goes by (he bends down to tie his laces). The σίτα: «…ακίνδυνος.» */
defineScene((() => {
const VO = ['ΣΙΤΑ (V.O.)', 'SITA (V.O.)'];
const CAMS = { street: [640, 420, 1.1], kos: [640, 420, 2.2], pocket: [650, 470, 2.4], roof: [640, 420, 1.1], roofC: [700, 440, 2.1], road: [640, 480, 1.2], mimis: [980, 440, 1.8], iq: [0, 0, 1] };
const steps = [
  { act: 'walk', d: 2.8, cam: 'street' },
  { act: 'hud1', d: 1.8, cam: 'pocket' },
  { who: 'kostas', cam: 'kos', mark: 'nice', el: 'Ζεσταίνεται αυτό. …Ωραία. Σαν θερμοφόρα.', en: "This thing's warming up. …Nice. Like a hot-water bottle." },
  { act: 'fail1', d: 1.3, cam: 'kos' },
  { act: 'roof', d: 3.2, cam: 'roof' },
  { who: 'kostas', cam: 'roofC', mark: 'catch', el: 'Πού πας, ρε; Θα πέσεις.', en: "Where you going, buddy? You'll fall." },
  { act: 'fail2', d: 1.4, cam: 'roofC' },
  { act: 'road', d: 2.6, cam: 'road' },
  { who: 'kostas', cam: 'road', mark: 'laces', el: 'Τα κορδόνια μου.', en: 'My shoelaces.' },
  { act: 'van', d: 2, cam: 'road' },
  { act: 'fail3', d: 1.3, cam: 'road' },
  { who: 'sita', label: VO, cam: 'iq', mark: 'rep', el: 'Αναφορά. Ο στόχος είναι… ακίνδυνος.', en: 'Report. The target is… harmless.' },
  { who: 'sita', label: VO, cam: 'iq', mark: 'wait', el: 'Περιμένουμε… το Panik.', en: 'Now we wait… for Panik.' },
  { act: 'go', d: 2.6, cam: 'mimis' },
];
let M;
function hud(s, sub, col = '#ff3030') {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'rgba(40,0,0,.55)'; ctx.fillRect(0, 40, W, 90);
  txt(s, 640, 72, 34, col, { font: 'monospace', weight: 900 }); if (sub) txt(sub, 640, 110, 18, '#ffb0b0', { font: 'monospace', weight: 700 });
  ctx.strokeStyle = col; ctx.lineWidth = 3; for (const [x, y, dx, dy] of [[30, 30, 1, 1], [1250, 30, -1, 1], [30, 690, 1, -1], [1250, 690, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x + dx * 50, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * 50); ctx.stroke(); }
  ctx.restore();
}
function roofTerrace(t) {
  sky('day', t);
  ctx.save(); ctx.translate(0, 260); ctx.scale(1, .7);
  for (let i = -3; i < 12; i++) { const x = i * 220, y = 430 + hash(i) * 80; poly([[x, y], [x + 200, y], [x + 200, 900], [x, 900]], '#e8dcc4', { lw: 3, w: .5 }); poly([[x - 12, y], [x + 212, y], [x + 100, y - 70]], '#c4643c', { lw: 3, w: .5 }); }
  ctx.restore();
  blob(1150, 470, 400, 30, '#5aa8d8', { lw: 0 });                      // the sea, far off
  rect(-400, 690, 1360, 120, '#d8d0bd', { lw: 4 });                    // the roof slab…
  rect(900, 640, 30, 170, '#e8e0cc', { lw: 3.5 });                     // …and its low parapet: after it, a drop
  clothesline(t);
  for (const x of [150, 330]) { rect(x - 40, 610, 80, 80, '#6a8ab0', { lw: 3 }); }   // water tanks
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'iq') {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#140608'; ctx.fillRect(0, 0, W, H);
    ctx.translate(640, 400); iqos(0, 0, 7, .05, 'red', t); ctx.restore();
    glow(640, 400 - 26 * 7, 240, 'rgba(255,40,40,1)', .5);
    hud('ΣΤΟΧΟΣ: ΑΚΙΝΔΥΝΟΣ', 'αναμονή για PANIK… (τρίτο κουτάκι)');
    vignette(.5); return;
  }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  const tk = talk('kostas', t), heat = inM(t, M.hud1, 0, 99) && t < M.fail1.b ? 1 : 0;
  if (shot === 'roof' || shot === 'roofC') {
    roofTerrace(t);
    // the IQOS buzzes out of his hand, skitters along the parapet towards the drop… he catches it
    const buzz = prog(t, M.roof.a + .8, M.catch.a + .2), caught = t > M.catch.a + .2;
    const ix = caught ? 760 : lerp(700, 905, buzz), iy = caught ? 520 : lerp(560, 632, clamp(buzz * 3)) + Math.sin(t * 60) * 2;
    stand(640, 'kostas', 1, { t, talk: tk, look: caught ? [.4, .3] : t > M.roof.a + 1.5 ? [1, .4] : [1, 0], brow: caught ? 'worry' : 'flat', mouth: 'flat',
      R: caught ? [120, -170] : buzz > .6 ? [150 + buzz * 60, -80] : [60, -120], L: [-44, -24], itemR: caught ? 'iqos' : null, iqosLed: 'red' });
    if (!caught) { iqos(ix, iy, 1, buzz > 0 ? Math.PI / 2 : 0, 'red', t); if (buzz > 0) sfxText('ΒΖΖ', ix, iy - 50, 22, 0, '#fff'); }
    if (inM(t, M.roof, 0, 1.2)) hud('ΑΠΟΠΕΙΡΑ 2: ΠΤΩΣΗ', 'άκρη ταράτσας · δόνηση 100%');
  } else if (shot === 'mimis') {
    villageStreet(t, { light: 'day', pole: false });
    // Μίμης leaning on his yard wall
    rect(900, 480, 400, 210, '#efe4cf', { lw: 4 }); for (let i = 0; i < 6; i++) blob(920 + i * 60, 470, 30, 22, '#4f7a37', { lw: 2.5 });
    person(1060, 560, 1, CAST.mimis, { t, talk: talk('mimis', t), look: [-1, .1], lid: true, mouth: 'flat', R: inM(t, M.call) ? [90, -230] : [60, -60], L: [-60, -60], part: 'body' });
    person(1060, 560, 1, CAST.mimis, { t, R: inM(t, M.call) ? [90, -230] : [60, -60], L: [-60, -60], part: 'arms' });
    rect(900, 540, 400, 30, '#e8dcc4', { lw: 3.5 });
    const [kx, kw] = path(t, [[M.go.a, 560], [M.go.b + .5, 1000]]);
    stand(kx, 'kostas', 1, { t, talk: tk, legs: kw ? 'walk' : 'stand', look: [1, 0], mouth: 'smile', lid: true });
  } else {
    villageStreet(t, { light: 'day' });
    if (shot === 'road') {
      // the van comes from the left; the IQOS tugs him backwards into its path; he bends down to tie his laces
      const vk = prog(t, M.laces.a + .4, M.van.b), vx = lerp(-900, 2100, vk), pull = bump(t, M.road.a + .6, M.laces.a + .5), bend = inM(t, M.laces, .2, 1.8);
      car(vx, 650, t, { moving: 1, dir: 1, col: '#f4f3ee', s: 1.2 });
      if (vk > .3 && vk < .7) speedLines(640, 380, 30, 260, '#fff');
      const st = { t, talk: tk, look: bend ? [.3, 1] : [1, .1], brow: 'flat', mouth: 'flat', lid: true, L: pull > .2 ? [-110, -120] : [-44, -24], itemL: 'iqos', iqosLed: 'red', tilt: -pull * .2 };
      if (bend) { ctx.save(); ctx.translate(640, standY() + 130); ctx.rotate(.9); person(0, -130, 1, CAST.kostas, { ...st, R: [30, 90], L: [-10, 100] }); ctx.restore(); }
      else { ctx.save(); ctx.translate(640, GROUND); ctx.rotate(-pull * .25); person(0, -150, 1, CAST.kostas, { ...st, legs: 'stand' }); ctx.restore(); }
      if (pull > .2) sfxText('ΤΡΑΒΑ!', 520, 330, 30, -.1, '#ff5050');
      if (inM(t, M.road, 0, 1.2)) hud('ΑΠΟΠΕΙΡΑ 3: ΦΟΡΤΗΓΑΚΙ', 'έλξη προς τον δρόμο');
    } else {
      const [kx, kw] = path(t, [[M.walk.a, -120], [M.hud1.a, 640], [M.fail1.b, 760]]);
      stand(kx, 'kostas', 1, { t, talk: tk, legs: kw ? 'walk' : 'stand', look: heat ? [.1, .8] : [1, 0], lid: true, mouth: inM(t, M.nice, .5, 99) ? 'smile' : 'flat',
        R: inM(t, M.nice) ? [20, -50] : [44, -24], L: [-44, -24] });
      if (heat) { glow(kx + 20, standY() - 40, 80, 'rgba(255,60,30,1)', .6); for (let i = 0; i < 3; i++) { const p = (t + i / 3) % 1; curve([[kx + 10 + i * 10, standY() - 50 - p * 60], [kx + 18 + i * 10, standY() - 64 - p * 60], [kx + 10 + i * 10, standY() - 78 - p * 60]], 2.5, `rgba(255,255,255,${1 - p})`); } }
      if (inM(t, M.hud1)) hud('ΑΠΟΠΕΙΡΑ 1: ΥΠΕΡΘΕΡΜΑΝΣΗ', 'μπαταρία 90°C');
    }
  }
  ctx.restore();
  for (const m of [M.fail1, M.fail2, M.fail3]) if (inM(t, m)) { hud('ΑΠΟΤΥΧΙΑ', null, '#ffd23f'); sfxText('✕', 640, 380, 200, 0, 'rgba(255,40,40,.7)'); }
  vignette(.3);
}
return {
  id: 'scene09', title: '9 · Ατυχήματα', steps, render,
  events: M => [[M.hud1.a, SFX.hiss], [M.roof.a + .8, () => SFX.buzz(1.4)], [M.catch.a + .2, SFX.slap], [M.road.a + .6, () => SFX.buzz(1)], [M.laces.a + .4, SFX.engine], [M.van.a + .2, () => { SFX.honk(); SFX.whoosh(); }],
    [M.fail1.a, SFX.jingleMinor], [M.fail2.a, SFX.jingleMinor], [M.fail3.a, SFX.jingleMinor], [M.rep.a - .3, SFX.clack], [M.go.a + .8, () => SFX.honk()], [M.go.a + 1.8, () => SFX.honk()]],
  ambience: (t, M) => ({ cicada: t < M.rep.a || t > M.go.a ? .02 : 0, hum: inM(t, M.rep, 0, 3) ? .03 : 0 }),
};
})());
