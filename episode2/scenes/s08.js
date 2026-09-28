/* Ep.2, Scene 8 – «Arc εκδίκησης»: the yard table. Κώστας drinks coffee; Χρήστος draws him. In the corner of the panel, a red LED. */
defineScene((() => {
const X = { giannos: 460, kostas: 640, christos: 900 };
const CAMS = { wide: [680, 420, 1.15], chr: [900, 380, 2.1], gia: [470, 400, 2.1], page: [0, 0, 1], two: [700, 400, 1.5] };
const steps = [
  { act: 'open', d: 2.6, cam: 'wide' },
  { act: 'draw', d: 2.4, cam: 'page' },
  { who: 'christos', cam: 'chr', el: '…Αυτό το έχω ξαναζωγραφίσει.', en: "…I've drawn this before." },
  { who: 'giannos', cam: 'gia', el: 'Τι;', en: 'What?' },
  { who: 'christos', cam: 'page', mark: 'led', el: 'Το κόκκινο φωτάκι. Είναι arc εκδίκησης.', en: "The little red light. It's a revenge arc." },
  { who: 'christos', cam: 'chr', el: 'Πάντα γυρνάνε για αυτόν που τους έκαψε.', en: 'They always come back for the one who burned them.' },
  { who: 'giannos', cam: 'two', el: 'Χρήστο, είναι IQOS.', en: "Christos, it's an IQOS." },
  { who: 'christos', cam: 'chr', mark: 'start', el: 'Έτσι ξεκινάνε όλα.', en: "That's how it all starts." },
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
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'page') { page(t); vignette(.35); return; }
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
  person(460, SEAT, 1, CAST.giannos, { part: 'arms', t, R: gesture(t, talk('giannos', t), [60, -60]), L: [-44, -60], itemL: 'cup2' });
  person(640, SEAT, 1, CAST.kostas, { part: 'arms', t, L: [-40, -150 + Math.max(0, Math.sin(t * .8)) * 60], itemL: 'cup2', R: [44, -40] });
  person(900, SEAT, 1, CAST.christos, { part: 'arms', t, L: [-30, -110], R: [30 + Math.sin(t * 12) * 8, -100], itemL: 'sketch' });
  ctx.restore();
  ctx.save(); applyCam(c); glow(700, 504, 40, 'rgba(255,40,40,1)', .35 + .2 * Math.sin(t * 3)); ctx.restore();
  vignette(.3);
}
return {
  id: 'scene08', title: '8 · Arc εκδίκησης', steps, render,
  events: M => [[M.draw.a, () => { for (let i = 0; i < 10; i++) noise(.08, .08, 3000, 1, 'bandpass', i * .2); }], [M.led.a, SFX.ding], [M.zoom.a, SFX.jingleMinor]],
  ambience: () => ({ cicada: .02 }),
};
})());
