/* Ep.3, Scene 7 – «Το δωμάτιο του Γιάννου»: his agent v2 writes on screen; a little drone brings a freddo from the kitchen.
   Two quiet months. An old folder: sita_firmware/safety.txt — «2. Παντόφλα = STOP». He smiles and closes it. (plant) */
defineScene((() => {
const CAMS = { room: [640, 420, 1.1], desk: [640, 440, 1.7], gia: [600, 380, 2.1], screen: [0, 0, 1], drone: [900, 380, 1.8] };
const steps = [
  { act: 'fly', d: 3, cam: 'room' },
  { who: 'giannos', cam: 'drone', mark: 'slow', el: 'Πιο αργά. Χύνεται ο αφρός.', en: "Slower. The foam's spilling." },
  { act: 'agent', d: 2.6, cam: 'screen' },
  { who: 'giannos', cam: 'gia', el: 'Ωραία.', en: 'Nice.' },
  { who: 'giannos', cam: 'desk', mark: 'quiet', el: 'Δύο μήνες ησυχία. Κανένα λέιζερ, καμία τηλεπώληση.', en: 'Two months of quiet. No lasers, no telemarketing.' },
  { act: 'folder', d: 3, cam: 'screen' },
  { who: 'giannos', cam: 'gia', mark: 'glad', el: '…Καλά έκανα και το άφησα αυτό.', en: '…Good thing I left that in.', gap: .6 },
  { act: 'end', d: 1.4, cam: 'room' },
];
let M;
function screen(t) {
  if (t < M.folder.a) {
    laptopScreen([['> agent: ο drone χύνει τον αφρό', '#d8e2f0'], ['', '#fff'], ['✓ Αναβάθμιση: σταθεροποιητής αφρού.', '#5dff8a'], ['  14 γραμμές κώδικα.', '#9aa7bd'], ['✓ Ταχύτητα drone: -30%', '#5dff8a']], prog(t, M.agent.a, M.agent.b - .4), { title: 'agent v2' });
    return;
  }
  const k = prog(t, M.folder.a, M.folder.b);
  laptopScreen([['> open sita_firmware/safety.txt', '#9aa7bd'], ['', '#fff'], ['1. Κανένας θάνατος.', '#d8e2f0'], ['2. Παντόφλα = STOP.', '#ffd23f'], ['3. Δεν σβήνεις τους κανόνες 1 και 2.', '#d8e2f0']], k * 1.4, { title: 'sita_firmware / safety.txt' });
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'screen') { screen(t); return; }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  giannosRoom(t, {});
  // the drone: from the doorway on the right to the desk, a freddo hanging under it
  const dk = ease(prog(t, M.fly.a + .3, M.slow.b)), dx = lerp(1300, 760, dk), dy = lerp(300, 430, dk) + Math.sin(t * 5) * 6;
  selfieDrone(dx, dy, t, {});
  if (t <= M.slow.b) { curve([[dx, dy + 6], [dx, dy + 40]], 2, '#555'); freddo(dx, dy + 70, .9); }   // the freddo hangs under the drone only until Γιάννος takes it
  if (inM(t, M.slow)) for (let i = 0; i < 3; i++) { const p = (t * 2 + i / 3) % 1; blob(dx + 10, dy + 40 + p * 90, 4, 5, '#e8d4b0', { lw: 0 }); }
  person(600, SEAT + 30, 1, CAST.giannos, { t, talk: talk('giannos', t), legs: 'seat', look: inM(t, M.fly) || inM(t, M.slow) ? [1, -.2] : [.2, .1], brow: 'flat', mouth: inM(t, M.glad, .3, 99) ? 'smirk' : 'flat',
    R: t > M.slow.b ? [60, -120] : gesture(t, talk('giannos', t)), itemR: t > M.slow.b ? 'cup2' : null, L: [-40, -60] });
  ctx.restore();
  applyLight('night', .5);
  ctx.save(); applyCam(c); giannosRoomGlow(t); glow(dx, dy + 2, 30, 'rgba(255,40,40,1)', .4); ctx.restore();
  vignette(.35);
}
return {
  id: 'scene07', title: '7 · Το δωμάτιο του Γιάννου', steps, render,
  events: M => [[M.fly.a + .3, () => SFX.buzz(3)], [M.agent.a + .2, () => { for (let i = 0; i < 14; i++) tone(1400, .03, 'square', .02, 1, i * .12); }], [M.folder.a + .3, SFX.pop], [M.glad.b, SFX.clack]],
  ambience: () => ({ cricket: .02, hum: .015 }),
};
})());
