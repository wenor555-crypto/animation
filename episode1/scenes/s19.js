/* Ep.1, Scene 19 – TAG «Αυτό δεν πουλάει» (beat 21): Χρήστος at his desk; what "really" happened. */
defineScene((() => {
const CAMS = { desk: [640, 360, 1.25], page: [640, 360, 1], chr: [520, 330, 2.1], two: [600, 360, 1.5], real: [0, 0, 1] };
const steps = [
  { act: 'ink', d: 4.2, cam: 'desk' },
  { act: 'wall', d: 3.4, cam: 'page' },
  { who: 'mimis', cam: 'two', el: 'Τι φτιάχνεις;', en: 'What are you making?' },
  { who: 'christos', cam: 'chr', el: 'Τι έγινε χθες.', en: 'What happened yesterday.' },
  { act: 'real', d: 7.2, cam: 'real' },
  { who: 'mimis', cam: 'two', el: 'Χθες έλιωσε η κόλλα κι έπεσε η σίτα.', en: 'Yesterday the glue melted and the screen fell off.' },
  { act: 'beat', d: 1.4, cam: 'chr' },
  { who: 'christos', cam: 'chr', mark: 'sell', el: '…Ναι. Αυτό δεν πουλάει.', en: "…Yeah. That doesn't sell." },
  { act: 'end', d: 2, cam: 'desk' },
];
let M;
/* a manga page: panels of the episode, inked in black & white */
function mangaPage(x, y, w, h, i, t) {
  rect(x, y, w, h, '#f7f4ec', { lw: 3, w: .3 });
  ctx.save(); ctx.beginPath(); ctx.rect(x + 6, y + 6, w - 12, h - 12); ctx.clip();
  ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
  const sw = w - 12, sh = h - 12;
  ctx.strokeRect(x + 6, y + 6, sw, sh * .45); ctx.strokeRect(x + 6, y + 6 + sh * .48, sw * .48, sh * .52); ctx.strokeRect(x + 6 + sw * .52, y + 6 + sh * .48, sw * .48, sh * .52);
  ctx.save(); ctx.translate(x + w / 2, y + 6 + sh * .24); ctx.scale(w / 380, w / 380);
  if (i === 0) sita({ x: 0, top: -120, w: 110, h: 210, chip: 1, led: 'red', mood: 'evil', burn: 1, flapL: .5, flapR: .5 });
  if (i === 1) { ctx.translate(0, 60); ctx.scale(.5, .5); person(0, 0, 1, CAST.kostas, { hood: true, shades: true, part: 'body', brow: 'frown' }); }
  if (i === 2) { slipper(0, 0, -.3, 3); }
  if (i === 3) { ctx.translate(0, 100); ctx.scale(.5, .5); car(0, 0, 0, { lights: 1 }); }
  ctx.restore();
  ctx.restore();
}
function desk(t) {
  room({ wall: '#2a2a3a', floor: '#3a2a22', floorY: 600 });
  // manga pages pinned to the wall
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(120 + i * 270, 90); ctx.rotate((hash(i) - .5) * .1); mangaPage(0, 0, 200, 280, i, t); ctx.restore(); }
  // desk + lamp
  rect(200, 460, 880, 30, '#6a4a32', { lw: 4 }); rect(230, 490, 30, 110, '#5a3a22', { lw: 3 }); rect(1020, 490, 30, 110, '#5a3a22', { lw: 3 });
  limb([[900, 460], [940, 330], [860, 280]], 6, '#3a3a40', { w: .3 }); poly([[830, 270], [890, 260], [880, 300], [840, 306]], '#3a3a40', { lw: 3 });
  rect(520, 430, 240, 30, '#f7f4ec', { lw: 3, w: .3 });            // the last page, on the desk
  rect(460, 440, 16, 20, '#111', { lw: 2 });                       // ink pot
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'real') {           // what REALLY happened: three plain sketches, no manga
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#f4f0e4'; ctx.fillRect(0, 0, W, H);
    const k = ph(t, M.real), n = Math.min(2, Math.floor(k * 3));
    for (let i = 0; i <= n; i++) {
      const x = 40 + i * 410, y = 110; rect(x, y, 380, 460, '#fff', { lw: 5, w: .6 });
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, 380, 460); ctx.clip(); ctx.translate(x + 190, y + 300); ctx.scale(.6, .6);
      if (i === 0) {               // the velcro melts, the screen just falls off
        rect(-140, -330, 280, 440, '#3f74a6', { lw: 4 }); rect(-120, -310, 240, 420, '#2a2420', { lw: 3 });
        ctx.save(); ctx.translate(0, 80); ctx.rotate(-1.3); sita({ x: 0, top: -105, w: 110, h: 210 }); ctx.restore();
        for (let j = 0; j < 3; j++) curve([[-110 + j * 20, -310], [-112 + j * 20, -270]], 3, '#f4f2ea');
        txt('38°C', 180, -300, 40, '#e8392b', { font: TVFONT, weight: 900 });
      } else if (i === 1) {        // Κώστας with a lighter… asleep
        ctx.save(); ctx.translate(0, 120); ctx.rotate(-1.4); person(0, -150, 1, CAST.kostas, { legs: 'stand', blink: true, mouth: 'open', R: [60, -60], itemR: 'lighter' }); ctx.restore();
        txt('Zzz', 120, -200, 50, '#555', { font: TVFONT });
      } else {                     // Βασίλης asking for a τράκα
        person(0, -20, 1, CAST.vasilis, { legs: 'stand', lid: true, R: [80, -130], bandage: true });
        ctx.save(); ctx.translate(40, -330); rect(-150, -50, 300, 90, '#fff', { lw: 3 }); poly([[-40, 40], [0, 40], [-60, 80]], '#fff', { lw: 3 }); txt('Έχεις ένα τσιγάρο;', 0, -5, 26, INK, { font: TVFONT }); ctx.restore();
      }
      ctx.restore();
    }
    ctx.filter = 'none'; txt(lang === 'el' ? 'ΤΙ ΕΓΙΝΕ ΣΤΗΝ ΠΡΑΓΜΑΤΙΚΟΤΗΤΑ' : 'WHAT REALLY HAPPENED', 640, 64, 40, INK, { font: TVFONT, style: 'italic', weight: 900 });
    ctx.restore();
    return;
  }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  desk(t);
  // Χρήστος inking at the desk (seated behind it), Μήμης behind him with a freddo
  const inking = !talk('christos', t);
  person(520, 470, 1, CAST.christos, { t, talk: talk('christos', t), part: 'body', look: speaker(t) === 'mimis' ? [1, -.3] : [.2, .9], lid: true, mouth: t > M.sell.b ? 'smirk' : 'flat', aviators: true });
  person(520, 470, 1, CAST.christos, { t, part: 'arms', L: [-30, -30], R: inking ? [60 + Math.sin(t * 6) * 10, -30] : [44, -24] });
  if (t > M.wall.a + 1) stand(820, 'mimis', 1, { t, talk: talk('mimis', t), look: [-1, .4], lid: true, mouth: 'smirk', itemR: 'cup2', R: [50, -60] });
  ctx.restore();
  applyLight('night', .5);
  ctx.save(); applyCam(c); glow(860, 330, 360, 'rgba(255,220,150,1)', .5); ctx.restore();
  vignette(.5);
  if (t > M.end.a) { ctx.fillStyle = `rgba(0,0,0,${prog(t, M.end.a, M.end.b)})`; ctx.fillRect(0, 0, W, H); }
}
return {
  id: 'scene19', title: '19 · Tag: Το manga', steps, render,
  events: M => [[M.ink.a + .2, () => { for (let i = 0; i < 10; i++) noise(.08, .05, 3000, 1, 'bandpass', i * .35); }], [M.wall.a + 1, SFX.door], [M.real.a, SFX.ding], [M.sell.b + .3, SFX.pop]],
  ambience: () => ({ cricket: .015 }),
};
})());
