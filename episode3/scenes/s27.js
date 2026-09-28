/* Ep.3, Scene 27 – «Κούκι τρας» (tag): the last morning. Κώστας sober with coffee; the STOP sign propped up in his living room.
   SMS: «ΕΙΜΑΙ ΠΑΝΩ ΑΠΟ ΤΟ ΚΕΦΑΛΙ ΣΟΥ.» He looks at the ceiling, at the STOP, and types: «Κούκι τρας.» In the Σίταdel, alarms.
   Far below, a tiny figure shakes a rug in a yard in Λέχαιο: Βαγγελιώ, slipper in hand. The σίτα shivers. */
defineScene((() => {
const SMS = ['ΣΙΤΑ (SMS)', 'SITA (SMS)'], ME = ['ΚΩΣΤΑΣ (γράφει)', 'KOSTAS (typing)'];
const CAMS = { room: [640, 420, 1.15], kos: [600, 380, 2.1], up: [600, 300, 2.1], stop: [1100, 400, 1.8], sms: [0, 0, 1], station: [640, 330, 1.8], earth: [640, 360, 1], yardTiny: [700, 440, 1.5] };
const steps = [
  { act: 'morning', d: 2.2, cam: 'room' },
  { who: 'sita', label: SMS, cam: 'sms', mark: 'm', el: 'ΕΙΜΑΙ ΠΑΝΩ ΑΠΟ ΤΟ ΚΕΦΑΛΙ ΣΟΥ.', en: 'I AM ABOVE YOUR HEAD.' },
  { act: 'ceiling', d: 1.6, cam: 'up' },
  { act: 'stoplook', d: 1.4, cam: 'stop' },
  { who: 'kostas', label: ME, cam: 'sms', mark: 'r', el: 'Κούκι τρας.', en: 'Kouki tras.', gap: .6 },
  { act: 'alarm', d: 2, cam: 'station' },
  { who: 'sita', cam: 'station', mark: 'know', el: 'Τι ξέρεις… Κώστα;', en: 'What do you know… Kostas?' },
  { act: 'below', d: 2.6, cam: 'earth' },
  { act: 'tiny', d: 2.2, cam: 'yardTiny' },
  { act: 'shiver', d: 1.8, cam: 'station' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'sms') { smsScreen(t, [{ me: false, text: 'ΕΙΜΑΙ ΠΑΝΩ ΑΠΟ ΤΟ ΚΕΦΑΛΙ ΣΟΥ.', at: M.m.a }, { me: true, text: 'Κούκι τρας.', at: M.r.b - .1 }], { red: true, typing: inM(t, M.r) ? 'Κούκι τρας.' : null, typingK: prog(t, M.r.a, M.r.b - .2) }); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  if (shot === 'room' || shot === 'kos' || shot === 'up' || shot === 'stop') {
    kostasKitchen(t, { stop: true });
    stand(600, 'kostas', 1, { t, look: shot === 'up' ? [0, -1] : shot === 'stop' ? [1, 0] : [.3, .7], lid: true, mouth: 'flat', L: [-40, -110], itemL: 'cup2', R: [40, -130], itemR: 'phone' });
    ctx.restore(); applyLight('dawn', .3); vignette(.3); return;
  }
  if (shot === 'yardTiny') {
    yard(t, { light: 'day', noChickens: false });
    const shake = Math.sin(t * 14);
    stand(700, 'vangelio', 1, { t, look: [0, -1], brow: 'frown', mouth: 'flat', L: [-80, -170 + shake * 20], R: [80, -170 - shake * 20], itemR: 'slipper' });
    poly([[620, 330 + shake * 10], [780, 330 - shake * 10], [790, 420], [610, 420]], '#b8306f', { lw: 3 });
    ctx.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .5; ctx.strokeStyle = '#ff3030'; ctx.lineWidth = 3; ctx.strokeRect(20, 20, W - 40, H - 40); ctx.restore();
    txt('ΖΟΥΜ ×40.000', 1120, 60, 22, '#ff4040', { font: 'monospace', weight: 900 });
    vignette(.45); return;
  }
  space(t, shot === 'earth' ? { ey: 1400, er: 900 } : { ey: 1900, er: 1400 });
  const shiver = inM(t, M.shiver) ? Math.sin(t * 60) * 6 : 0;
  sitadel(640 + shiver, shot === 'earth' ? 180 : 330, t, { s: shot === 'earth' ? .35 : 1, spin: .02, talk: talk('sita', t), mood: inM(t, M.shiver) ? 'shock' : 'evil' });
  ctx.restore();
  ctx.save(); applyCam(c); sitadelGlow(640, shot === 'earth' ? 180 : 330, t, { s: shot === 'earth' ? .35 : 1 }); ctx.restore();
  if (inM(t, M.alarm) || inM(t, M.know)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .18 * (Math.sin(t * 8) > 0); ctx.fillStyle = '#ff2020'; ctx.fillRect(0, 0, W, H); ctx.restore(); hud('ΑΝΑΛΥΣΗ…', '«Κούκι τρας»'); }
  if (inM(t, M.shiver)) sfxText('…!', 640, 150, 90, 0, '#fff');
  vignette(.4);
}
return {
  id: 'scene27', title: '27 · Κούκι τρας', steps, render,
  events: M => [[M.morning.a + .3, SFX.sip], [M.m.a - .1, SFX.ding], [M.r.b - .1, SFX.pop], [M.alarm.a, () => { for (let i = 0; i < 6; i++) tone(880, .2, 'square', .04, 1, i * .35); }], [M.tiny.a + .3, () => { for (let i = 0; i < 6; i++) SFX.slap(); }], [M.shiver.a, () => tone(120, 1.4, 'sawtooth', .04, 1.02)]],
  ambience: (t, M) => ({ hum: t > M.alarm.a ? .03 : 0 }),
};
})());
