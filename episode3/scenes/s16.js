/* Ep.3, Scene 16 – «Το μελάνι» (flashback): winter at the temple. The master draws a crow in three strokes — it flies off the paper.
   «Ό,τι ζωγραφίσεις… θα συμβεί. Γι' αυτό… ζωγράφιζε προσεκτικά.» — «…Sugoi.» Back to today: Χρήστος draws a σίτα-shaped satellite. */
defineScene((() => {
const CAMS = { temple: [640, 420, 1.1], paper: [640, 560, 2.2], das: [820, 400, 2.1], chr: [460, 380, 2.1], yard: [640, 420, 1.15], page: [0, 0, 1], mim: [820, 400, 2] };
const steps = [
  { act: 'draw', d: 3.2, cam: 'paper' },
  { act: 'crow', d: 2.4, cam: 'temple' },
  { who: 'daskalos', cam: 'das', mark: 'ink', el: 'Το μελάνι που ορίζει τη μοίρα.', en: 'The ink that decides fate.' },
  { who: 'daskalos', cam: 'das', el: 'Ό,τι ζωγραφίσεις… θα συμβεί.', en: 'Whatever you draw… will happen.' },
  { who: 'daskalos', cam: 'temple', el: 'Γι\' αυτό… ζωγράφιζε προσεκτικά.', en: 'So… draw carefully.' },
  { who: 'christos', cam: 'chr', mark: 'sugoi', el: '…Sugoi.', en: '…Sugoi.', gap: .8 },
  { act: 'cut', d: 1.6, cam: 'page' },
  { who: 'mimis', cam: 'mim', el: 'Τι είναι αυτό;', en: 'What is that?' },
  { who: 'christos', cam: 'page', mark: 'vol3', el: 'Τόμος τρία.', en: 'Volume three.' },
  { who: 'mimis', cam: 'mim', el: 'Πάλι δεν θα γίνει έτσι.', en: "Again, that's not how it'll go." },
  { who: 'christos', cam: 'yard', el: 'Ναι, ναι…', en: 'Yeah, yeah…' },
  { act: 'end', d: 1.0, cam: 'page' },
];
let M;
function crowShape(x, y, s, k = 1, flap = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const w = Math.sin(flap) * 20;
  if (k > 0) poly([[-50, 0], [0, -10], [50, 0], [0, 12]], '#141414', { lw: 0 });
  if (k > .33) poly([[-10, -6], [-70, -40 - w], [-30, -4]], '#141414', { lw: 0 });
  if (k > .66) poly([[10, -6], [70, -40 - w], [30, -4]], '#141414', { lw: 0 });
  ctx.restore();
}
function page(t) {                 // Χρήστος's page: a satellite shaped like a σίτα, around the Earth
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#6a5a4a'; ctx.fillRect(0, 0, W, H);
  rect(200, 40, 880, 640, '#fbf8ef', { lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(240, 80, 800, 560); ctx.clip();
  ctx.filter = 'grayscale(1) contrast(1.3)';
  // drawn while we watch: the station first (k 0 → .75), then the Earth's curve closes underneath (.75 → 1)
  const k = clamp(prog(t, M.cut.a + .1, M.vol3.b - .2)), ks = clamp(k / .75), ke = clamp((k - .75) / .25);
  const rr = 18 + ks * 250, a = ks * Math.PI * 7;      // the inked area grows out from the centre as the pencil circles
  ctx.save(); ctx.beginPath(); ctx.arc(640, 300, rr, 0, TAU); ctx.clip(); sitadel(640, 300, 0, { k: 1, s: .42 }); ctx.restore();
  if (ke > 0) { ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(640, 980, 520, Math.PI * 1.5 - .62, Math.PI * 1.5 - .62 + ke * 1.24); ctx.stroke(); }
  ctx.filter = 'none';
  ctx.restore();
  txt('ΤΟΜΟΣ 3', 1000, 60, 20, INK, { font: TVFONT, weight: 900 });
  // the brush tip sits where the line is being drawn right now: spiralling out over the station, then along the Earth's arc
  const wob = Math.sin(t * 23) * 3;
  const th = Math.PI * 1.5 - .62 + ke * 1.24, [px, py] = ke > 0 ? [640 + Math.cos(th) * 520, 980 + Math.sin(th) * 520] : [640 + Math.cos(a) * rr + wob, 300 + Math.sin(a) * rr + wob];
  if (t < M.end.a && k < 1) { pencil(px + 25, py + 28, -2.3); blob(px + 42, py + 46, 28, 22, CAST.christos.skin, { lw: 3 }); }   // the pencil's tip (38 px along -2.3 rad) on the line
  ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'page') { page(t); vignette(.35); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  if (shot === 'yard' || shot === 'mim') {
    yard(t, { light: 'day' });
    chair(560); person(560, SEAT, 1, CAST.christos, { t, talk: talk('christos', t), legs: 'seat', look: [.2, .6], mouth: 'flat', L: [-30, -110], R: [30 + Math.sin(t * 12) * 8, -100], itemL: 'sketch' });
    const [mx, mw] = path(t, [[M.cut.a, 1300], [M.L[4].a - .2, 820]]);
    stand(mx, 'mimis', 1, { t, talk: talk('mimis', t), legs: mw ? 'walk' : 'stand', look: [-1, .4], lid: true, mouth: 'flat', R: [60, -120], itemR: 'cup2', dir: -1 });
    ctx.restore(); vignette(.3); return;
  }
  temple(t, { season: 'winter', px: 1000 });
  // the master at a low table with paper; the crow drawn stroke by stroke, then it flies away
  rect(560, 600, 300, 20, '#6a4a2a', { lw: 3 }); rect(600, 580, 220, 24, '#fbf8ef', { lw: 2 });
  person(820, SEAT + 40, 1, CAST.daskalos, { t, talk: talk('daskalos', t), legs: 'seat', lid: true, mouth: 'flat', look: t < M.crow.b ? [-.4, .8] : [-1, 0], L: [-30, -60], R: t < M.draw.b ? [-120 + Math.sin(t * 3) * 20, -10] : [30, -60] });
  const dk = prog(t, M.draw.a + .3, M.draw.b - .3), fly = prog(t, M.crow.a, M.crow.b + 2);
  if (fly <= 0) crowShape(710, 590, .6, dk);
  else { const k = ease(fly); crowShape(lerp(710, 1400, k), lerp(590, 50, k) - Math.sin(k * 5) * 40, lerp(.6, 1.2, k), 1, t * 14); }
  person(460, SEAT + 40, 1, CAST.youngChristos, { t, talk: talk('christos', t), legs: 'seat', look: fly > 0 ? [1, -.6] : [.6, .4], mouth: inM(t, M.sugoi) ? 'open' : 'flat', brow: fly > 0 ? 'up' : 'flat', L: [-30, -60], R: [30, -60] });
  ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .18; ctx.fillStyle = '#c89060'; ctx.fillRect(0, 0, W, H); ctx.restore();
  if (inM(t, M.crow, .2, 1.2)) { speedLines(900, 250, 50, 160, 'rgba(0,0,0,.4)'); sfxText('ΚΡΑ!', 1000, 160, 60, .1, '#141414', '#fff'); }
  vignette(.55);
}
return {
  id: 'scene16', title: '16 · Το μελάνι', steps, render,
  events: M => [[M.draw.a + .3, () => { for (let i = 0; i < 3; i++) noise(.3, .12, 2500, 1, 'bandpass', i * .8); }], [M.crow.a, () => { SFX.whoosh(); tone(800, .3, 'sawtooth', .04, .5, .2); }], [M.ink.a - .2, SFX.gong], [M.cut.a, SFX.clack]],
  ambience: (t, M) => ({ cicada: t > M.cut.a ? .02 : 0 }),
};
})());
