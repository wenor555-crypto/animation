/* Ep.2 remake, Scene 8 – «Arc εκδίκησης»: the yard table. Κώστας drinks coffee; Χρήστος draws him. In the corner of the panel, a red LED.
   He turns the page: he has already drawn the last one: a ταψί, a beam, a flash (it happens in scene 24). Μίμης: «Ταψί;» */
defineScene((() => {
const X = { giannos: 460, kostas: 640, christos: 900, mimis: 1110 };
const CAMS = { wide: [680, 420, 1.15], chr: [900, 380, 2.1], gia: [470, 400, 2.1], page: [0, 0, 1], two: [700, 400, 1.5], end: [0, 0, 1], mim: [1060, 400, 2] };
const steps = [
  { act: 'open', d: 2.6, cam: 'wide' },
  { act: 'draw', d: 2.4, cam: 'page' },
  { who: 'christos', cam: 'page', mark: 'led', el: 'Το κόκκινο φωτάκι. Είναι arc εκδίκησης.', en: "The little red light. It's a revenge arc." },
  { who: 'giannos', cam: 'gia', el: 'Χρήστο, είναι IQOS.', en: "Christos, it's an IQOS." },
  { who: 'christos', cam: 'chr', mark: 'start', el: 'Έτσι ξεκινάνε όλα.', en: "That's how it all starts." },
  { act: 'turn', d: 2.2, cam: 'end' },
  { who: 'mimis', cam: 'mim', mark: 'what', el: 'Τι είναι αυτό;', en: 'What is that?' },
  { who: 'christos', cam: 'end', mark: 'the', el: 'Το τέλος.', en: 'The ending.' },
  { who: 'mimis', cam: 'mim', mark: 'tray', el: 'Ταψί;', en: 'A baking tray?' },
  { who: 'christos', cam: 'chr', mark: 'always', el: 'Πάντα τελειώνει με κάτι που δεν πρόσεξες.', en: "It always ends with something you didn't notice." },
  { act: 'zoom', d: 2.2, cam: 'page' },
];
let M;
function page(t) {                // Χρήστος's sketchbook: Κώστας with his coffee; a tiny red dot in the corner of the panel
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#6a5a4a'; ctx.fillRect(0, 0, W, H);
  rect(200, 40, 880, 640, '#fbf8ef', { lw: 5 });
  rect(240, 80, 800, 560, null, { lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(240, 80, 800, 560); ctx.clip();
  ctx.filter = 'grayscale(1) contrast(1.4)'; person(640, 470, 1.4, CAST.kostas, { t: 0, legs: 'stand', lid: true, mouth: 'flat', L: [-40, -120], itemL: 'cup2' }); ctx.filter = 'none';
  // the IQOS on the table in the drawing: its LED in RED ink
  iqos(900, 600, 1.8, 0, 'off', t); const k = t > M.led.a ? 1 : prog(t, M.draw.a + 1, M.draw.b);
  if (k > 0) { blob(900, 553, 6 * k, 4 * k, '#e8201a', { lw: 0 }); if (t > M.led.a) glow(900, 553, 60, 'rgba(255,40,40,1)', .4); }
  ctx.restore();
  txt('ΚΕΦ. 2', 1000, 60, 20, INK, { font: TVFONT, weight: 900 });
  // his pencil hand
  const px = 900 + Math.sin(t * 9) * 12, py = 553 + Math.cos(t * 7) * 8;
  if (t < M.zoom.a) { pencil(px + 10, py + 30, -2.3); blob(px + 40, py + 60, 26, 20, CAST.christos.skin, { lw: 3 }); }
  ctx.restore();
  if (t > M.zoom.a) { const z = ease(prog(t, M.zoom.a, M.zoom.b)); ctx.save(); ctx.globalAlpha = z * .5; ctx.fillStyle = '#ff2020'; ctx.fillRect(0, 0, W, H); ctx.restore(); sfxText('…', 900, 480, 80, 0, '#fff'); }
}
/* the last page, drawn in the morning: a ταψί held up, a beam hitting it and bouncing back, a flash (it happens at scene 24) */
function endPage(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#6a5a4a'; ctx.fillRect(0, 0, W, H);
  const flip = ease(prog(t, M.turn.a, M.turn.a + .7));
  ctx.save(); ctx.translate(640, 360); ctx.scale(Math.max(.02, flip), 1); ctx.translate(-640, -360);
  rect(200, 40, 880, 640, '#fbf8ef', { lw: 5 });
  ctx.save(); ctx.beginPath(); ctx.rect(240, 80, 800, 560); ctx.clip();
  ctx.fillStyle = '#fbf8ef'; ctx.fillRect(240, 80, 800, 560);
  speedLines(560, 330, 60, 120, 'rgba(0,0,0,.5)', 5);
  // the beam from the top right, hitting the tray, and bouncing back up
  ctx.strokeStyle = '#141414'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(1040, 110); ctx.lineTo(560, 330); ctx.lineTo(1040, 170); ctx.stroke();
  ctx.strokeStyle = '#fbf8ef'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1040, 110); ctx.lineTo(560, 330); ctx.lineTo(1040, 170); ctx.stroke();
  blob(560, 330, 90, 78, '#e8e8e8', { lw: 6 }); blob(560, 330, 70, 58, '#d0d0d0', { lw: 2.5 });                 // the ταψί
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; curve([[560 + Math.cos(a) * 100, 330 + Math.sin(a) * 90], [560 + Math.cos(a) * 150, 330 + Math.sin(a) * 135]], 4, '#141414'); }
  // two hands holding it up, a hood below
  blob(470, 420, 26, 22, '#e8e8e8', { lw: 4 }); blob(650, 420, 26, 22, '#e8e8e8', { lw: 4 });
  poly([[430, 640], [460, 470], [560, 440], [660, 470], [690, 640]], '#2a2a2a', { lw: 4 });
  txt('ΚΛΑΝΓΚ', 820, 520, 60, '#141414', { font: TVFONT, style: 'italic', weight: 900 });
  ctx.restore();
  txt('ΤΕΛΕΥΤΑΙΑ ΣΕΛΙΔΑ', 960, 60, 18, INK, { font: TVFONT, weight: 900 });
  ctx.restore();
  ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'page') { page(t); vignette(.35); return; }
  if (shot === 'end') { endPage(t); vignette(.35); return; }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, {});
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  chair(460); chair(640); chair(900);
  person(460, SEAT, 1, CAST.giannos, { part: 'legs', legs: 'seat' }); person(640, SEAT, 1, CAST.kostas, { part: 'legs', legs: 'seat' }); person(900, SEAT, 1, CAST.christos, { part: 'legs', legs: 'seat' });
  person(460, SEAT, 1, CAST.giannos, { part: 'body', t, talk: talk('giannos', t), look: la('giannos', [1, 0]), mouth: 'flat' });
  person(640, SEAT, 1, CAST.kostas, { part: 'body', t, look: [.2, .3], lid: true, mouth: 'smile' });
  person(900, SEAT, 1, CAST.christos, { part: 'body', t, talk: talk('christos', t), look: la('christos', [-1, .3]), mouth: 'flat' });
  table(t, {}); iqos(700, 530, 1, 0, 'red', t); iqosCharger(730, 536, .8);
  if (t > M.turn.a - .4) stand(X.mimis, 'mimis', 1, { t, talk: talk('mimis', t), look: [-1, .5], lid: !inM(t, M.tray), brow: inM(t, M.tray) ? 'up' : 'flat', mouth: 'flat', R: [44, -24], L: [-44, -24], itemR: 'cup2', dir: -1 });
  person(460, SEAT, 1, CAST.giannos, { part: 'arms', t, R: gesture(t, talk('giannos', t), [60, -60]), L: [-44, -60], itemL: 'cup2' });
  person(640, SEAT, 1, CAST.kostas, { part: 'arms', t, L: [-40, -150 + Math.max(0, Math.sin(t * .8)) * 60], itemL: 'cup2', R: [44, -40] });
  person(900, SEAT, 1, CAST.christos, { part: 'arms', t, L: [-30, -110], R: [30 + Math.sin(t * 12) * 8, -100], itemL: 'sketch' });
  ctx.restore();
  ctx.save(); applyCam(c); glow(700, 504, 40, 'rgba(255,40,40,1)', .35 + .2 * Math.sin(t * 3)); ctx.restore();
  vignette(.3);
}
return {
  id: 'scene08', title: '8 · Arc εκδίκησης', steps, render,
  events: M => [[M.draw.a, () => { for (let i = 0; i < 10; i++) noise(.08, .08, 3000, 1, 'bandpass', i * .2); }], [M.led.a, SFX.ding], [M.turn.a, () => noise(.3, .15, 2000, 1, 'bandpass')], [M.zoom.a, SFX.jingleMinor]],
  ambience: () => ({ cicada: .02 }),
};
})());
