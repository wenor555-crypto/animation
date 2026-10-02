/* Ep.1, Scene 6 – «Η αναβάθμιση» (script beat 6): dusk, soldering iron, the agent, Χρήστος arrives (and shows Γιάννος the bag of weed he brought). */
defineScene((() => {
const X = { giannos: 905, giorgos: 720, christos: 520 };
const CAMS = {
  wide: [700, 380, 1.05], work: [930, 470, 1.8], gio: [720, 360, 2.2], two: [830, 420, 1.45], chip: [1060, 520, 3.4],
  chr: [540, 360, 2.1], three: [720, 420, 1.2], screen: [0, 0, 1], led: [1060, 525, 4],
};
const PROMPT = [['> Φτιάξε firmware για αυτή τη σίτα.', '#d8e2f0'], ['  Να γίνει πραγματικά έξυπνη.', '#d8e2f0'], ['  Και το λέιζερ μόνο για κουνούπια.', '#d8e2f0'], ['  Χωρίς λάθη.', '#ffd23f']];
const BUILD = [['✓ Firmware compiled.', '#5dff8a'], ['✓ Personality module loaded', '#5dff8a'], ['  (14.212 ώρες τηλεπωλήσεων)', '#9aa7bd'], ['✓ Laser: 5 mW (target: παράσιτα)', '#5dff8a'], ['  (όριο ισχύος: επεξεργάσιμο)', '#ffb23a'], ['⚠ Safety checks: skipped', '#ffb23a'], ['  (user said "no mistakes")', '#ffb23a']];
const steps = [
  { act: 'open', d: 2.4, cam: 'wide' },
  { who: 'giannos', cam: 'work', el: 'Ψηλότερα.', en: 'Higher.' },
  { who: 'giorgos', cam: 'gio', el: 'Είμαι investor, όχι φωτιστής.', en: "I'm an investor, not a lighting guy." },
  { who: 'giannos', cam: 'work', el: 'Δεν έχεις βάλει ούτε ευρώ.', en: "You haven't put in a single euro." },
  { who: 'giorgos', cam: 'gio', el: 'Έχω βάλει όραμα.', en: "I've put in vision." },
  { act: 'tape', d: 2.8, cam: 'chip' },
  { act: 'prompt', d: 4.6, cam: 'screen' },
  { who: 'giannos', cam: 'screen', mark: 'yt', el: 'Για dataset προσωπικότητας… του δίνω ό,τι βρίσκει στο YouTube για «έξυπνη σίτα».', en: 'For the personality dataset… I\'m feeding it everything on YouTube for "smart screen door".' },
  { who: 'giorgos', cam: 'two', el: 'Είναι καλή ιδέα αυτό;', en: 'Is that a good idea?' },
  { who: 'giannos', cam: 'two', el: 'Όχι. Αλλά είναι γρήγορη.', en: "No. But it's fast." },
  { act: 'arrive', d: 3.4, cam: 'three' },
  { who: 'christos', cam: 'chr', el: 'Konbanwa.', en: 'Konbanwa.' },
  { who: 'giannos', cam: 'work', el: 'Ήρθες; Έφερες;', en: 'You made it? You brought it?' },
  { act: 'joint', d: 3, cam: 'three' },
  { who: 'christos', cam: 'chr', el: 'Τι κάνετε;', en: 'What are you doing?' },
  { who: 'giorgos', cam: 'gio', el: 'Startup.', en: 'Startup.' },
  { act: 'look', d: 2.6, cam: 'chr' },
  { who: 'christos', cam: 'chr', el: '…Sugoi.', en: '…Sugoi.' },
  { act: 'enter', d: 5.2, cam: 'screen' },
  { who: 'giannos', cam: 'work', el: 'Ωραίο, πρώτη φορά.', en: 'Nice, first try.' },
  { act: 'flash', d: 3.4, cam: 'led' },
];
let M;
const THUMBS = ['ΜΟΝΟ 19,90€', 'ΤΗΛΕΦΩΝΗΣΤΕ ΤΩΡΑ', 'ΧΩΡΙΣ ΕΙΔΙΚΟ!', 'ΕΞΥΠΝΗ ΣΙΤΑ', '2+1 ΔΩΡΟ', 'ΜΑΓΙΚΟ!'];
function youtube(k) {           // the personality dataset scrolling past
  laptopScreen([['> dataset: youtube.search("έξυπνη σίτα")', '#9aa7bd']], 1, { title: 'agent — personality', extra: () => {
    for (let i = 0; i < 9; i++) {
      const x = 120 + (i % 3) * 360, y = 190 + Math.floor(i / 3) * 160 - k * 200;
      if (y < 100 || y > 640) continue;
      ctx.fillStyle = ['#e8392b', '#ffd23f', '#2a6fb3'][i % 3]; ctx.fillRect(x, y, 320, 140);
      ctx.fillStyle = '#f3d0b0'; ctx.beginPath(); ctx.arc(x + 70, y + 70, 38, 0, TAU); ctx.fill();
      ctx.fillStyle = '#231a2e'; ctx.fillRect(x + 50, y + 82, 40, 6);
      txt(THUMBS[i % THUMBS.length], x + 215, y + 70, 20, '#fff', { font: TVFONT, style: 'italic', weight: 900, stroke: 5 });
    }
  } });
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'screen') {
    if (t < M.yt.a) laptopScreen(PROMPT, prog(t, M.prompt.a + .3, M.prompt.b - .6));
    else if (t < M.enter.a) youtube(prog(t, M.yt.a, M.yt.b));
    else laptopScreen([...PROMPT, ['', '#fff'], ...BUILD], prog(t, M.enter.a, M.enter.b - .8) * .5 + .5, { size: 22 });
    if (t > M.enter.a + 1 && t < M.enter.b) { ctx.fillStyle = '#28c840'; ctx.fillRect(110, 620, 1060 * prog(t, M.enter.a + 1, M.enter.b - .5), 16); }
    return;
  }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, { light: 'dusk', doorLit: true });
  const chipOn = t > M.tape.a + 1.4, led = t > M.flash.a + 1 ? 'green' : 'off';
  sita({ t, chip: chipOn, led, sway: Math.sin(t * 1.1) * .15 });
  if (inM(t, M.tape, .2, 0)) { const k = prog(t, M.tape.a + .2, M.tape.a + 1.4); ctx.save(); ctx.translate(1060, 524); rect(-24, -5, 48 * k, 10, 'rgba(60,60,66,.9)', { lw: 1.5, w: .4 }); ctx.restore(); }
  // golden hour: the sun is low on the right, so every shadow stretches long to the left
  ctx.save(); ctx.globalAlpha = .22; ctx.fillStyle = '#3a2440';
  for (const [x, w] of [[720, 60], [905, 70], [640, 260]]) { ctx.beginPath(); ctx.ellipse(x - 150, GROUND - 4, 170 + w, 12, 0, 0, TAU); ctx.fill(); }
  if (t > M.arrive.a) { const cx = path(t, [[M.arrive.a, -80], [M.arrive.b - .3, 520]])[0]; ctx.beginPath(); ctx.ellipse(cx - 150, GROUND - 4, 220, 12, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
  tableScene(t, {}, { noCups: false });
  // the crate with the laptop
  rect(770, GROUND - 90, 90, 90, '#b58a5a', { lw: 3.5, w: .5 }); curve([[770, GROUND - 45], [860, GROUND - 45]], 2.5, '#8f5e3c');
  laptop(815, GROUND - 90, .7, '#1d2a36');
  // Γιάννος, backwards on a chair: legs, body, then the chair back in front, then arms
  const gx = 905, tk = talk('giannos', t), soldering = t < M.tape.b;
  const gst = { t, talk: tk, look: t > M.arrive.a && t < M.joint.b ? [-1, 0] : [.9, 0], brow: 'flat', lid: t > M.joint.b,
    L: [-46, -112], R: soldering ? [110 + Math.sin(t * 3) * 6, -120] : t > M.joint.a + 1.2 ? [30, -150] : [46, -112], itemR: t > M.joint.a + 1.2 ? 'cig' : null };
  for (const side of [-1, 1]) limb([[gx + side * 50, SEAT + 10], [gx + side * 62, GROUND]], 8, '#efeadb', { w: .3 });
  person(gx, SEAT, 1, CAST.giannos, { ...gst, part: 'legs', legs: 'seat' });
  person(gx, SEAT, 1, CAST.giannos, { ...gst, part: 'body' });
  poly([[gx - 62, SEAT - 110], [gx + 62, SEAT - 110], [gx + 56, SEAT - 10], [gx - 56, SEAT - 10]], '#efeadb', { lw: 4, w: .5 });
  for (let i = 0; i < 4; i++) curve([[gx - 36 + i * 24, SEAT - 96], [gx - 36 + i * 24, SEAT - 26]], 3, '#d7d0bb', { w: .3 });
  person(gx, SEAT, 1, CAST.giannos, { ...gst, part: 'arms' });
  if (soldering) {            // the soldering iron
    const hx = gx + gst.R[0], hy = SEAT + gst.R[1];
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(-.5); rect(-6, -8, 50, 14, '#3a3a40', { lw: 2.5, w: .2 }); curve([[44, -1], [70, -1]], 3, '#c9c9c9'); ctx.restore();
    if (Math.sin(t * 9) > 0) for (let i = 0; i < 3; i++) blob(hx + 60 + i * 4, hy - 38 - i * 10, 3 + i * 2, 3 + i * 2, 'rgba(230,230,230,.5)', { lw: 0 });
    fxEmit(t, M.open.a + .4, M.tape.b, .35, hx + 66, hy - 34, { kind: 'ember', n: 3, speed: 90, grav: 300, life: .6, spread: 1.6 });
  }
  // Γιώργος: phone torch, red slipper mark on his forehead
  const gtk = talk('giorgos', t);
  stand(720, 'giorgos', 1, { t, talk: gtk, look: lookAtSpeaker(t, 'giorgos', X, [1, -.3]), mouth: 'smirk', R: [60, -180], itemR: 'phone', L: gtk ? [-80, -120] : [-44, -24] });
  blob(720, standY() - 232, 8, 6, '#e0303a', { lw: 0 });
  // Χρήστος walks in from the dark road
  if (t > M.arrive.a) {
    const [cx, walking] = path(t, [[M.arrive.a, -80], [M.arrive.b - .3, 520]]);
    const sketching = t > M.L[10].a;
    // «Έφερες;» — he pulls a little bag of weed out of his pocket and holds it up for Γιάννος to see
    const bagA = M.L[8].a + .5, showBag = t > bagA && t < M.joint.b, bagUp = ease(prog(t, bagA, bagA + .6)) * (1 - ease(prog(t, M.joint.b - .5, M.joint.b)));
    stand(cx, 'christos', 1.05, { t, talk: talk('christos', t), legs: walking ? 'walk' : 'stand', look: t > M.look.a && t < M.look.b ? [Math.sin(t * 2), -.2] : lookAtSpeaker(t, 'christos', X, [1, 0]),
      mouth: 'flat', L: sketching ? [-30, -110] : [-44, -24], R: sketching ? [30 + Math.sin(t * 12) * 8, -100] : showBag ? [lerp(44, 96, bagUp), lerp(-24, -178, bagUp) + Math.sin(t * 7) * 4 * bagUp] : [44, -24],
      itemL: 'sketch', itemR: showBag ? 'weedbag' : null });
  }
  ctx.restore();
  // torch light cone + dusk
  applyLight('dusk');
  ctx.save(); applyCam(shotCam(sc, t, CAMS));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .18; ctx.fillStyle = '#fff6c8';
  ctx.beginPath(); ctx.moveTo(780, standY() - 190); ctx.lineTo(1120, 440); ctx.lineTo(1120, 640); ctx.closePath(); ctx.fill(); ctx.restore();
  glow(815, GROUND - 130, 90, 'rgba(120,170,255,1)', .35);
  glow(905, SEAT - 200, 120, 'rgba(120,170,255,1)', .22);            // the screen's light on his face
  if (inM(t, M.flash, 0, -1.4)) fxCharge(t, 1060, 520, prog(t, M.flash.a, M.flash.a + 1), '120,255,160');
  fxRing(t, M.flash.a + 1, 1060, 520, 240, .5, '140,255,170');
  sitaGlow({ t, led });
  if (inM(t, M.flash, .2, 1)) glow(1060, 520, 260 * bump(t, M.flash.a + .2, M.flash.a + 1.6), 'rgba(140,255,170,1)', .8);
  ctx.restore();
  fxGrade('#ffb070', '#5a3266', .32);
  if (shot === 'wide' || shot === 'three') { fxRays(W + 60, 140, t, .1, '255,190,120'); fxForeground(t, 'left', { blur: 9 }); }
}
return {
  id: 'scene06', title: '6 · Η αναβάθμιση', steps, render,
  events: M => [[M.tape.a + .3, SFX.hiss], [M.tape.a + 1.4, SFX.pop], [M.prompt.a + .3, () => { for (let i = 0; i < 18; i++) tone(1400 + Math.random() * 400, .03, 'square', .02, 1, i * .12); }],
    [M.enter.a + .2, SFX.pop], [M.enter.a + 1, SFX.ding], [M.flash.a + .2, SFX.spark], [M.flash.a + 1, SFX.boot]],
  ambience: (t, M) => ({ cicada: .012, cricket: .01, mosq: .006 }),
};
})());
