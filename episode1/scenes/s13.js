/* Ep.1, Scene 13 – «Προσέλαβε προσωπικό» (script beat 14): Μίμης, the blanket fire, the call to Γιάννος. */
defineScene((() => {
const PHONE = ['ΓΙΑΝΝΟΣ (ΤΗΛ.)', 'GIANNOS (PHONE)'];
const CAMS = { room: [640, 420, 1.2], bed: [620, 470, 1.8], face: [520, 430, 2.6], door: [980, 400, 1.5], hallway: [980, 380, 2.2], cam: [470, 360, 2.2], call: [600, 370, 2] };
const steps = [
  { act: 'sweat', d: 3.4, cam: 'room' },
  { who: 'mimis', cam: 'face', el: '…μαμά, είναι Αύγουστος…', en: "…mum, it's August…" },
  { act: 'fire', d: 3.4, cam: 'bed' },
  { who: 'mimis', cam: 'face', el: 'Χμ.', en: 'Hm.' },
  { act: 'douse', d: 2.2, cam: 'bed' },
  { who: 'mimis', cam: 'face', el: 'Κρίμα. Είχε ακόμα.', en: 'Shame. There was some left.' },
  { act: 'open1', d: 3, cam: 'hallway' },
  { act: 'shut1', d: 2.4, cam: 'door' },
  { act: 'open2', d: 1.4, cam: 'hallway' },
  { act: 'shut2', d: .8, cam: 'door' },
  { who: 'mimis', cam: 'cam', mark: 'fourth', el: 'Εντάξει. Πάρε τον Γιάννο.', en: 'Fine. Put Giannos on.' },
  { act: 'dial', d: 2.2, cam: 'call' },
  { who: 'giannos', label: PHONE, cam: 'call', el: 'Ρε μαλάκα, τρεις η ώρα…', en: "Dude, it's three a.m.…" },
  { who: 'mimis', cam: 'call', el: 'Γιάννο. Η σίτα σου.', en: 'Giannos. Your screen.' },
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
  const up = t > M.douse.b;
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
  if (!up) {
    // Μίμης face-down, sweating, under the electric blanket (9 – MAX)
    ctx.save(); ctx.translate(360, 468); ctx.rotate(-1.52); person(0, 190, .8, CAST.mimis, { t, part: 'body', talk: talk('mimis', t), blink: t < M.fire.a + 1.4, look: [1, 0], lid: t > M.fire.a + 1.4 }); ctx.restore();
    blanket(300, 470, 460, 90, { t, heat: 1, ctrlX: 850, ctrlY: 470, wave: .3, col: '#c9443a' });
    for (let i = 0; i < 4; i++) { const p = (t * .8 + i / 4) % 1; blob(250 + i * 30, 430 + p * 30, 4, 6, '#9ad8ff', { lw: 1.5 }); }
    freddo(850, 520, 1);
  } else {
    blanket(300, 520, 460, 70, { t, ctrl: false, col: '#6a2a2a' });
    const [mx, walking] = path(t, [[M.douse.b, 520], [M.open1.a, 900], [M.fourth.a, 900], [M.fourth.a + .01, 470]]);
    stand(t < M.fourth.a ? mx : 470, 'mimis', 1, { t, talk: talk('mimis', t), legs: walking ? 'walk' : 'stand', look: shot === 'cam' ? [0, .1] : shot === 'call' ? [-.4, .1] : [1, 0], lid: true, mouth: 'flat',
      R: t > M.dial.a ? [30, -175] : [44, -24], itemR: t > M.dial.a ? 'phone' : null });
  }
  // fire at the blanket corner, doused with freddo
  const fireK = inM(t, M.fire, 1, 0) || inM(t, M.L[1], 0, 0) ? prog(t, M.fire.a + 1, M.fire.a + 2) : inM(t, M.douse, 0, .6) ? 1 - prog(t, M.douse.a + .8, M.douse.a + 1.2) : 0;
  if (fireK > 0 && !up) flame(740, 480, .7 * fireK, t);
  if (inM(t, M.douse, 0, 0)) { const k = prog(t, M.douse.a, M.douse.a + 1); ctx.save(); ctx.translate(lerp(850, 760, k), lerp(520, 440, k)); ctx.rotate(k * 2.2); freddo(0, 0, 1); ctx.restore(); if (k > .6) for (let i = 0; i < 8; i++) blob(740 + hash(i) * 30, 450 + hash(i + 3) * 40, 5, 7, '#6b3e1f', { lw: 0 }); }
  ctx.restore();
  applyLight('night', .55); applyLight('red', openK ? .45 : .15);
  ctx.save(); applyCam(c);
  if (fireK > 0 && !up) glow(740, 450, 200, 'rgba(255,140,40,1)', .5 * fireK);
  glow(850, 470, 50, 'rgba(255,60,40,1)', up ? 0 : .4);
  if (t > M.dial.a) glow(500, standY() - 180, 70, 'rgba(160,200,255,1)', .5);
  ctx.restore();
  vignette(.5);
  if (inM(t, M.douse, .9, .5)) sfxText('ΤΣΣΣ!', 700, 200, 70, .1, '#fff');
  if (shot === 'call') {         // split screen: Γιάννος in bed on the other side
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath(); ctx.moveTo(760, 0); ctx.lineTo(1280, 0); ctx.lineTo(1280, 720); ctx.lineTo(680, 720); ctx.closePath(); ctx.clip();
    ctx.fillStyle = '#1a2038'; ctx.fillRect(680, 0, 600, 720);
    ctx.translate(1030, 300); ctx.scale(2.2, 2.2);
    rect(-200, 60, 400, 120, '#6a7a9a', { lw: 4 });
    person(0, 230, 1, CAST.giannos, { t, part: 'body', talk: talk('giannos', t), lid: !inM(t, M.staff, 0, 1.6), brow: inM(t, M.staff, .4, 1.6) ? 'up' : 'worry', look: [-.4, 0] });
    person(0, 230, 1, CAST.giannos, { t, part: 'arms', L: [-44, -24], R: [-30, -175], itemR: 'phone' });
    rect(-210, 80, 420, 120, '#8a9aba', { lw: 4, w: .5 });
    ctx.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.lineWidth = 14; ctx.strokeStyle = '#111'; ctx.beginPath(); ctx.moveTo(760, 0); ctx.lineTo(680, 720); ctx.stroke(); ctx.restore();
  }
}
return {
  id: 'scene13', title: '13 · Προσωπικό', steps, render,
  events: M => [[M.fire.a + 1, SFX.fire], [M.douse.a + .9, SFX.hiss], [M.open1.a + .2, SFX.creak], [M.open1.a + 1, SFX.zap], [M.shut1.a, SFX.door], [M.open2.a + .1, SFX.creak], [M.shut2.a, SFX.door],
    [M.dial.a + .3, SFX.phone], [M.dial.a + 1.2, SFX.phone]],
  ambience: () => ({ hum: .03 }),
};
})());
