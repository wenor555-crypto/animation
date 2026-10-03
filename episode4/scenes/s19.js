/* Ep.4, Scene 19 – «Γιατί τη φοβάται»: Γιάννος's room. The pieces of the suit on the floor. He takes the slipper out of its
   display case and lays it on the scanner. «Τι ψάχνουμε;» «Γιατί τη φοβάται.» Elsewhere: Χρήστος, in the dark, watches «Ο
   ΗΡΩΑΣ ΤΟΥ ΛΕΧΑΙΟΥ» on his phone; Γιάννος falls, again and again. He puts the phone down. He opens the inkwell. For one
   second the frame turns manga (the episode's only manga: the ink is back). */
defineScene((() => {
const CAMS = { room: [640, 420, 1.1], gia: [600, 380, 2.1], scan: [760, 460, 2.6], screen: [0, 0, 1], chr: [640, 400, 1.7], phone: [0, 0, 1], ink: [820, 500, 2.8] };
const steps = [
  { act: 'pieces', d: 2.4, cam: 'room' },
  { act: 'place', d: 1.8, cam: 'scan' },
  { who: 'giannos', cam: 'gia', el: 'Agent. Σάρωσέ την.', en: 'Agent. Scan it.', say: 'Έιτζεντ. Σάρωσέ την.' },
  { who: 'agent', cam: 'screen', el: 'Τι ψάχνουμε;', en: 'What are we looking for?' },
  { who: 'giannos', cam: 'gia', mark: 'why', el: 'Γιατί τη φοβάται.', en: "Why she's afraid of it.", gap: .8 },
  { act: 'scanning', d: 1.6, cam: 'scan' },
  { act: 'chr', d: 2.4, cam: 'chr' },
  { act: 'loop', d: 2.4, cam: 'phone' },
  { act: 'ink', d: 2.6, cam: 'ink' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'screen') { agentWave(t, talk('agent', t)); return; }
  if (shot === 'phone') { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#05060c'; ctx.fillRect(0, 0, W, H); ctx.translate(640, 360); ctx.scale(.62, .62); viralScreen(t * 1.6, 1); ctx.restore(); return; }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  if (shot === 'chr' || shot === 'ink') {
    room({ wall: '#1e2234', floor: '#3a2e28', floorY: 600 });
    rect(500, 470, 520, 18, '#5a3a22', { lw: 4 }); limb([[520, 488], [520, 690]], 7, '#3a2a1e'); limb([[1000, 488], [1000, 690]], 7, '#3a2a1e');
    sketchbook(700, 462, 0, t > M.ink.a + 1.6);
    const open = t > M.ink.a + .8;
    rect(808, 440, 26, 28, '#1a1a22', { lw: 3 });
    if (!open) rect(812, 432, 18, 10, '#3a3a44', { lw: 2 }); else { rect(840, 452, 18, 10, '#3a3a44', { lw: 2 }); blob(821, 440, 10, 3, '#0a0a14', { lw: 0 }); }
    const phoneUp = t < M.loop.b;
    person(620, SEAT + 30, 1, CAST.christos, { t, legs: 'seat', look: phoneUp ? [.2, .3] : [.6, .6], brow: 'worry', mouth: 'flat', R: phoneUp ? [60, -150] : open ? [190, -70] : [150, -60], itemR: phoneUp ? 'phone' : null, L: [-40, -60] });
    ctx.restore();
    ctx.save(); applyCam(c); glow(660, 300, phoneUp ? 160 : 60, 'rgba(120,170,255,1)', phoneUp ? .35 : .1); ctx.restore();
    applyLight('night', .6);
    if (t > M.ink.a + 1.4 && t < M.ink.a + 2.4) { mangaize(1, true); speedLines(820, 450, 50, 140); }
    vignette(.55); return;
  }
  giannosRoom(t, { war: false, case: t < M.place.a });
  // the suit's remains on the floor: the dented tray, the helmet, the dead blower
  blob(300, 660, 38, 12, '#c8ccd2', { lw: 3 }); blob(420, 650, 44, 30, '#9aa0a8', { lw: 3 }); rect(160, 620, 70, 44, '#e8762b', { lw: 3 });
  // the scanner on the desk, with the slipper
  rect(700, 440, 130, 30, '#2a2e3a', { lw: 3 });
  if (t > M.place.a + .6) slipper(765, 434, 0, 1);
  if (t > M.scanning.a) { const y = 380 + ((t - M.scanning.a) * 120) % 70; ctx.save(); ctx.globalCompositeOperation = 'lighter'; rect(700, y, 130, 3, 'rgba(90,255,140,.9)', { lw: 0 }); ctx.restore(); }
  const reach = inM(t, M.place);
  person(600, SEAT + 30, 1, CAST.giannos, { t, talk: talk('giannos', t), legs: 'seat', look: t > M.place.a ? [.7, .4] : [.2, .6], brow: 'worry', mouth: 'flat', R: reach ? [160, -70] : [80, -60], itemR: reach && t < M.place.a + .6 ? 'slipper' : null, L: [-40, -60] });
  ctx.restore();
  applyLight('night', .55);
  ctx.save(); applyCam(c); giannosRoomGlow(t); ctx.restore();
  vignette(.45);
}
return {
  id: 'scene19', title: '19 · Γιατί τη φοβάται', steps, render,
  events: M => [[M.place.a + .6, SFX.thud], [M.scanning.a, SFX.boot], [M.loop.a, () => SND2.sfx('body_fall', .4, { rate: 1.2 })], [M.loop.a + 1.5, () => SND2.sfx('body_fall', .4, { rate: 1.2 })],
    [M.ink.a + .8, SFX.pop], [M.ink.a + 1.4, SFX.gong]],
  ambience: () => ({ cricket: .015, hum: .015 }),
};
})());
