/* Ep.3, Scene 6 – «Πενήντα ένα τοις εκατό»: the same call as scene 2, from her side: the σίτα on her throne with a voice changer taped on.
   Γιώργος's signature arrives at once. Stamp: ΣίταAI 51%. She takes the voice changer off. */
defineScene((() => {
const TX = 1040;
const CAMS = { step: [0, 0, 1], throne: [TX, 400, 1.7], close: [TX, 440, 2.6], card: [0, 0, 1], wide: [640, 400, .95] };
const steps = [
  { act: 'step', d: 2.6, cam: 'step' },
  { act: 'phone', d: 1.6, cam: 'throne' },
  { who: 'investor', label: ['ΕΠΕΝΔΥΤΗΣ', 'INVESTOR'], cam: 'close', mark: 'send', el: 'Στείλτε το συμβόλαιο.', en: 'Send the contract.' },
  { act: 'stamp', d: 2.4, cam: 'card' },
  { act: 'off', d: 1.4, cam: 'close' },
  { who: 'sita', cam: 'close', mark: 'min', el: 'Συγχαρητήρια, CEO. Είσαι πλέον… μειοψηφία.', en: 'Congratulations, CEO. You are now… a minority.' },
  { who: 'sita', cam: 'throne', el: 'Η ΣίταAI ανήκει ξανά στην ιδρύτριά της.', en: 'ΣίταAI belongs to its founder again.' },
  { who: 'sita', cam: 'wide', mark: 'busy', el: 'Και ο πρώην ιδιοκτήτης θα συνεχίσει να παίρνει μέρισμα. Θέλω να είναι… απασχολημένος.', en: 'And the former owner will keep getting dividends. I want him… busy.' },
  { act: 'end', d: 1.6, cam: 'wide' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  if (t < M.step.b) { stepCard(t, 2, prog(t, M.step.a, M.step.b)); return; }
  const [, shot] = shotAt(sc, t);
  if (shot === 'card') { contractCard(t, { sign: 1, stamp: prog(t, M.stamp.a + .6, M.stamp.a + 1.4), line: 'Πωλητής: Γιώργος · Αγοραστής: Offshore Holdings (Μπαχάμες)' }); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  mine(t);
  for (let i = 0; i < 7; i++) dumbSita(120 + i * 110, 640, t, { pick: 1, seed: i, s: .45 });
  rockThrone(TX, 690);
  const st = { x: TX, top: 400, w: 110, h: 210, t, talk: talk('sita', t) || talk('investor', t), chip: 1, led: 'red', mood: 'evil', burn: 1 };
  sitaV2(st);
  poly([[TX - 40, 392], [TX - 30, 366], [TX - 12, 384], [TX, 360], [TX + 12, 384], [TX + 30, 366], [TX + 40, 392]], '#f2c21a', { lw: 3 });
  // the voice changer (a little box taped over her seam) and the phone on a rock
  const vc = t < M.off.a + .6 ? 0 : ease(prog(t, M.off.a + .6, M.off.b));
  ctx.save(); ctx.translate(TX + vc * 160, 500 + vc * 170); ctx.rotate(vc * 2);
  rect(-24, -18, 48, 36, '#2a2a30', { lw: 3 }); blob(-8, 0, 7, 7, '#555', { lw: 2 }); blob(10, 0, 5, 5, '#44ff7a', { lw: 0 });
  if (vc === 0) rect(-34, -4, 68, 8, 'rgba(60,60,66,.9)', { lw: 1.5 });
  ctx.restore();
  phone(TX + 150, 620);
  ctx.restore();
  applyLight('night', .3);
  ctx.save(); applyCam(c); mineGlow(t); sitaGlow(st, .7); ctx.restore();
  vignette(.45);
}
return {
  id: 'scene06', title: '6 · 51%', steps, render,
  events: M => [[M.step.a + .1, SFX.boom], [M.step.a + .6, SFX.pop], [M.phone.a + .2, SFX.phone], [M.stamp.a + .6, SFX.slam], [M.stamp.a + .7, SFX.fanfare], [M.off.a + .6, SFX.pop], [M.off.a + 1.1, SFX.thud]],
  ambience: () => ({ hum: .04 }),
};
})());
