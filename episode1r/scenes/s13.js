/* Ep.1, Scene 13 – «Προσέλαβε προσωπικό» (script beat 14): Μίμης, the blanket fire, the call to Γιάννος. */
defineScene((() => {
const PHONE = ['ΓΙΑΝΝΟΣ (ΤΗΛ.)', 'GIANNOS (PHONE)'];
const CAMS = { room: [640, 420, 1.2], bed: [620, 470, 1.8], face: [520, 430, 2.6], door: [980, 400, 1.5], hallway: [980, 380, 2.2], cam: [470, 360, 2.2], call: [600, 370, 2] };
const steps = [
  { act: 'sweat', d: 3.4, cam: 'room' },
  { who: 'mimis', cam: 'face', el: '…μαμά, είναι Αύγουστος…', en: "…mum, it's August…" },
  { act: 'fire', d: 3.4, cam: 'bed' },
  { who: 'mimis', cam: 'face', el: 'Χμ.', en: 'Hm.' },
  { act: 'douse', d: 3.4, cam: 'bed' },     // he gets up, takes the freddo off the bedside table and pours it on the fire
  { who: 'mimis', cam: 'face', el: 'Κρίμα. Είχε ακόμα.', en: 'Shame. There was some left.' },
  { act: 'open1', d: 3, cam: 'hallway' },
  { act: 'shut1', d: 2.4, cam: 'door' },
  { act: 'open2', d: 1.4, cam: 'hallway' },
  { act: 'shut2', d: .8, cam: 'door' },
  { who: 'mimis', cam: 'cam', mark: 'fourth', el: 'Εντάξει. Πάρε τον Γιάννο.', en: 'Fine. Put Giannos on.' },
  { act: 'dial', d: 2.2, cam: 'call' },
  { who: 'giannos', label: PHONE, cam: 'call', el: 'Ρε μαλάκα, τρεις η ώρα…', en: "Man, it's three in the fucking morning…" },
  { who: 'mimis', cam: 'call', el: 'Γιάννο. Η σίτα σου.', en: 'Giannos. Your screen door.' },
  { who: 'giannos', label: PHONE, cam: 'call', el: 'Τι έπαθε;', en: "What's wrong with it?" },
  { who: 'mimis', cam: 'call', mark: 'staff', el: 'Προσέλαβε προσωπικό.', en: "It's hired staff." },
  { act: 'pause', d: 1.6, cam: 'call' },
  { who: 'giannos', label: PHONE, cam: 'call', el: '…Έρχομαι. Παίρνω και τον Χρήστο.', en: "…I'm coming. I'll get Christos." },
  { who: 'mimis', cam: 'call', el: 'Και τον Γιώργο.', en: 'And Giorgos.' },
  { who: 'giannos', label: PHONE, cam: 'call', el: 'Είναι στο στρατόπεδο.', en: "He's at the base." },
  { who: 'mimis', cam: 'call', el: 'Είναι CEO. Να έρθει να δει την εταιρεία του.', en: "He's the CEO. He should come see his company." },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS), [, shot] = shotAt(sc, t);
  const D0 = M.douse.a, up = t > D0, pick = D0 + 1.3, pourA = D0 + 1.7, pourB = D0 + 2.4;
  ctx.save(); applyCam(c);
  room({ wall: '#a8b4c8', floor: '#7a6048', floorY: 600 });
  // poster, window
  rect(120, 150, 150, 200, '#e8392b', { lw: 4 }); txt('ΤΑΡΑΝΤΙΝΟ', 195, 250, 16, '#fff', { font: TVFONT, weight: 900 });
  rect(620, 140, 200, 160, '#16213a', { lw: 4 }); blob(700, 190, 18, 18, '#fff6d6', { lw: 0 });
  // the door to the hallway
  const openK = Math.max(inM(t, M.open1, .2, 0) ? 1 : 0, inM(t, M.open2, .1, 0) ? 1 : 0);
  const hallRed = '#8a2020';
  doorway(1000, 600, 150, 300, hallRed, openK ? 1 : 0);
  if (openK) {   // the hallway: red, a hose on the ceiling, belt on the wall, a racket zooming past
    hose([[930, 310], [980, 320], [1030, 312], [1070, 330]], t, { eye: 1 });
    belt(1010, 460, t, { crawl: 1, vib: 1, red: 1, rot: -1.4, cord: false });
    if (inM(t, M.open1, 1, 2)) racket(lerp(900, 1100, prog(t, M.open1.a + 1, M.open1.a + 1.8)), 420, 1.4, t, { on: 1, s: .6 });
  }
  // the bed
  rect(160, 480, 620, 120, '#d8d0c0', { lw: 4, w: .5 }); rect(140, 400, 36, 200, '#6a4a32', { lw: 4 });
  rect(810, 520, 90, 80, '#8a6a4a', { lw: 3.5 });                  // bedside table
  // fire at the blanket corner, doused with freddo
  const fireK = inM(t, M.fire, 1, 0) || inM(t, M.L[1], 0, 0) ? prog(t, M.fire.a + 1, M.fire.a + 2) : inM(t, M.douse, 0, .6) ? 1 - prog(t, pourA + .3, pourB) : 0;
  if (fireK > 0) { flame(740, 480, .7 * fireK, t); fxFire(740, 486, .55 * fireK, t, fireK); }
  const cupEmpty = t > pourB;
  if (!up) {
    // Μίμης face-down, sweating, under the electric blanket (9 – MAX)
    ctx.save(); ctx.translate(360, 468); ctx.rotate(-1.52); person(0, 190, .8, CAST.mimis, { t, part: 'body', talk: talk('mimis', t), blink: t < M.fire.a + 1.4, look: [1, 0], lid: t > M.fire.a + 1.4 }); ctx.restore();
    blanket(300, 470, 460, 90, { t, heat: 1, ctrlX: 850, ctrlY: 470, wave: .3, col: '#c9443a' });
    for (let i = 0; i < 4; i++) { const p = (t * .8 + i / 4) % 1; blob(250 + i * 30, 430 + p * 30, 4, 6, '#9ad8ff', { lw: 1.5 }); }
  } else if (t <= M.douse.b) {
    // he throws the blanket off, gets up, two steps to the bedside table, takes the freddo, turns and pours it on the fire
    blanket(300, 520, 460, 70, { t, ctrl: false, col: '#6a2a2a' });
    const rise = ease(prog(t, D0, D0 + .5));
    const [mx, walking] = path(t, [[D0 + .5, 560], [D0 + 1.2, 845]]);   // to the right of the fire, by the bedside table
    const pouring = t > pourA - .1, tilt = ease(prog(t, pourA, pourA + .35)) * 1.9 * (1 - ease(prog(t, pourB, pourB + .3)));
    const R2 = t < pick - .15 ? [44, -24] : t < pick ? [lerp(44, 52, prog(t, pick - .15, pick)), lerp(-24, -12, prog(t, pick - .15, pick))] : pouring ? [-96, -84] : [40, -60];
    const st = { t, talk: talk('mimis', t), legs: walking ? 'walk' : 'stand', look: pouring ? [-1, .4] : t > pick - .3 ? [1, .4] : [1, 0], lid: t > pourB, mouth: 'flat', L: [-44, -24], R: R2 };
    if (rise < 1) { ctx.save(); ctx.translate(560, GROUND); ctx.rotate(-1.5 * (1 - rise)); person(0, -150, 1, CAST.mimis, { ...st, legs: 'stand' }); ctx.restore(); }
    else stand(mx, 'mimis', 1, st);
    if (t >= pick) {                                   // the cup in his hand: tilted towards the fire to pour
      const hx = mx + R2[0], hy = standY() + R2[1];
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(-tilt); if (!cupEmpty) freddo(0, 0, .9); else emptyCup(0, 0, .9); ctx.restore();
      if (t > pourA + .2 && t < pourB) fxEmit(t, pourA + .2, pourB, .05, hx - 16, hy - 26, { kind: 'drop', n: 3, speed: 60, grav: 1400, life: .45, dir: Math.PI * .55, spread: .4, col: '#a6743e' });
    }
  } else {
    blanket(300, 520, 460, 70, { t, ctrl: false, col: '#6a2a2a' });
    const [mx, walking] = path(t, [[M.douse.b, 845], [M.open1.a, 900], [M.fourth.a, 900], [M.fourth.a + .01, 470]]);
    const holding = t < M.open1.a;                       // «Κρίμα. Είχε ακόμα.» — looking into the empty cup
    stand(t < M.fourth.a ? mx : 470, 'mimis', 1, { t, talk: talk('mimis', t), legs: walking ? 'walk' : 'stand', look: holding ? [.2, .6] : shot === 'cam' ? [0, .1] : shot === 'call' ? [-.4, .1] : [1, 0], lid: true, mouth: 'flat',
      R: t > M.dial.a ? [30, -175] : holding ? [40, -60] : [44, -24], itemR: t > M.dial.a ? 'phone' : null });
    if (holding) { ctx.save(); ctx.translate(mx + 40, standY() - 60); emptyCup(0, 0, .9); ctx.restore(); }
    else emptyCup(850, 520, .9);                          // left on the bedside table
  }
  if (inM(t, M.douse, 1.9, .6)) fxEmit(t, pourA + .3, pourB + .5, .1, 745, 470, { kind: 'smoke', n: 2, speed: 50, grav: 400, life: 1.6, size: .5, alpha: .5, spread: .7 });
  if (openK && inM(t, M.open1, 1, 2)) { const rx = lerp(900, 1100, prog(t, M.open1.a + 1, M.open1.a + 1.8)); fxArc(rx - 20, 380, rx + 30, 330, t, { seed: 4 }); }
  if (t < pick) freddo(850, 520, 1);                                           // on the bedside table until he takes it
  ctx.restore();
  applyLight('night', .55); applyLight('red', openK ? .45 : .15);
  ctx.save(); applyCam(c);
  if (fireK > 0) glow(740, 450, 200, 'rgba(255,140,40,1)', .5 * fireK);
  glow(850, 470, 50, 'rgba(255,60,40,1)', up ? 0 : .4);
  if (t > M.dial.a) glow(500, standY() - 180, 70, 'rgba(160,200,255,1)', .5);
  ctx.restore();
  nightGrade(t, .7);
  vignette(.5);
  fxImpact(t, M.staff.a + .5, 400, 300, .05);
  if (t > pourA + .3 && t < pourB + .4) sfxText('ΤΣΣΣ!', 700, 200, 70, .1, '#fff');
  if (shot === 'call') {         // split screen: Γιάννος in bed on the other side
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath(); ctx.moveTo(760, 0); ctx.lineTo(1280, 0); ctx.lineTo(1280, 720); ctx.lineTo(680, 720); ctx.closePath(); ctx.clip();
    ctx.fillStyle = '#1a2038'; ctx.fillRect(680, 0, 600, 720);
    ctx.translate(1030, 300); ctx.scale(2.2, 2.2);
    rect(-200, 60, 400, 120, '#6a7a9a', { lw: 4 });
    person(0, 230, 1, CAST.giannos, { t, part: 'body', talk: talk('giannos', t), lid: !inM(t, M.staff, 0, 1.6), brow: inM(t, M.staff, .4, 1.6) ? 'up' : 'worry', look: [-.4, 0] });
    person(0, 230, 1, CAST.giannos, { t, part: 'arms', L: [-44, -24], R: [-30, -175], itemR: 'phone' });
    rect(-210, 80, 420, 120, '#8a9aba', { lw: 4, w: .5 });
    glow(-20, 40, 90, 'rgba(160,200,255,1)', .45);                     // the phone lights his face
    ctx.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.lineWidth = 14; ctx.strokeStyle = '#111'; ctx.beginPath(); ctx.moveTo(760, 0); ctx.lineTo(680, 720); ctx.stroke(); ctx.restore();
  }
}
return {
  id: 'scene13', title: '13 · Προσωπικό', steps, render,
  events: M => [[M.fire.a + 1, SFX.fire], [M.douse.a + 2, SFX.hiss], [M.douse.a + .1, SFX.whoosh], [M.douse.a + 1.3, SFX.clack], [M.open1.a + .2, SFX.creak], [M.open1.a + 1, SFX.zap], [M.shut1.a, SFX.door], [M.open2.a + .1, SFX.creak], [M.shut2.a, SFX.door],
    [M.dial.a + .3, SFX.phone], [M.dial.a + 1.2, SFX.phone], [M.staff.a + .5, () => tone(70, 1, 'sawtooth', .05, .7)]],
  ambience: () => ({ hum: .03 }),
};
})());
