/* Ep.2, Scene 13 – «Οπλοστάσιο»: montage in the yard. Μίμης and Χρήστος cut branches off the fig tree and make bows,
   strung with washing line, arrows from cane. Γιάννος builds gadgets: a Bluetooth jammer out of the microwave, a «magnet cannon»
   from the old σίτα's nine magnet pairs, and a racket anti-aircraft gun tied to a broomstick. Γιώργος gets a shield. */
defineScene((() => {
const X = { mimis: 300, christos: 470, giannos: 640, giorgos: 1040 };
const CAMS = { wide: [640, 420, 1.1], fig: [240, 440, 1.7], mim: [300, 400, 2.1], chr: [470, 400, 2.1], gia: [660, 420, 2.1], bench: [820, 540, 2.2], gio: [1040, 400, 2.1], duo: [880, 420, 1.3], two: [390, 420, 1.6] };
const steps = [
  { act: 'saw', d: 3, cam: 'fig' },
  { act: 'string', d: 2.4, cam: 'wide' },
  { who: 'christos', cam: 'chr', mark: 'milk', el: 'Το τόξο βγάζει γάλα.', en: 'The bow is leaking milk.' },
  { who: 'mimis', cam: 'mim', el: 'Συκιά είναι. Όπλο είναι, όχι φρούτο.', en: "It's a fig tree. It's a weapon, not a fruit." },
  { act: 'solder', d: 2.4, cam: 'bench' },
  { who: 'giannos', cam: 'gia', mark: 'jam', el: 'Αυτό κόβει το Bluetooth σε δέκα μέτρα.', en: 'This cuts Bluetooth within ten metres.' },
  { who: 'mimis', cam: 'two', el: 'Και το δικό μας;', en: 'Ours too?' },
  { who: 'giannos', cam: 'gia', el: 'Και το δικό μας.', en: 'Ours too.' },
  { act: 'magnet', d: 1.8, cam: 'bench' },
  { who: 'giannos', cam: 'gia', mark: 'mag', el: 'Κι αυτό είναι οι μαγνήτες της σίτας. Τραβάει ό,τι έχει μέταλλο.', en: "And this is the σίτα's magnets. It pulls anything made of metal." },
  { who: 'christos', cam: 'chr', el: 'Εννιά ζευγάρια ισχυροί μαγνήτες.', en: 'Nine pairs of powerful magnets.' },
  { who: 'giannos', cam: 'gia', el: 'Μην το λες έτσι.', en: "Don't say it like that." },
  { act: 'racket', d: 2.2, cam: 'wide' },
  { who: 'giorgos', cam: 'gio', el: 'Εμένα τι μου δίνετε;', en: 'What do I get?' },
  { who: 'mimis', cam: 'duo', mark: 'shield', el: 'Την ασπίδα.', en: 'The shield.' },
  { who: 'giorgos', cam: 'gio', mark: 'tray', el: 'Αυτό είναι ταψί.', en: "That's a baking tray." },
  { who: 'mimis', cam: 'duo', el: 'Της μάνας μου. Ό,τι πιο ανθεκτικό έχουμε.', en: "My mother's. The toughest thing we own." },
  { act: 'pose', d: 2.6, cam: 'wide' },
];
let M;
const LABELS = [['saw', 'ΤΟΞΑ ΑΠΟ ΣΥΚΙΑ'], ['solder', 'JAMMER BLUETOOTH'], ['magnet', 'ΜΑΓΝΗΤΙΚΟ ΚΑΝΟΝΙ'], ['racket', 'ΡΑΚΕΤΑ-ΑΝΤΙΑΕΡΟΠΟΡΙΚΟ'], ['pose', 'Η ΟΜΑΔΑ']];
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  // the washing line gets cut halfway through: the clothes are on the ground after that
  const cut = t > M.string.a + 1;
  const CL = clothesline; if (cut) clothesline = () => {};
  yard(t, { light: 'dusk' });
  clothesline = CL;
  if (cut) { for (const [x, col] of [[320, '#e05a4a'], [420, '#f2d34a'], [520, '#6fa7d8'], [620, '#f4f3ee']]) blob(x, 682, 40, 10, col, { lw: 2.5 }); }
  // the workbench: the crate with the microwave, magnets, a broom
  rect(720, GROUND - 90, 200, 90, '#b58a5a', { lw: 3.5, w: .5 });
  const jamOn = t > M.jam.a; jammer(780, GROUND - 110, t, jamOn ? 1 : 0);
  if (t < M.magnet.a) for (let i = 0; i < 9; i++) rect(840 + (i % 3) * 14, GROUND - 124 + Math.floor(i / 3) * 12, 10, 10, '#c9ccd2', { lw: 1.5 });
  else magnetCannon(850, GROUND - 110, -.2);
  // falling fig branch, sawn off
  if (inM(t, M.saw, 1.2, 99) && t < M.string.b) { const f = ease(prog(t, M.saw.a + 1.2, M.saw.a + 2.2)); ctx.save(); ctx.translate(280, 430 + f * 240); ctx.rotate(f * 1.3); limb([[-60, 0], [60, 0]], 12, '#9a948a'); for (let i = 0; i < 4; i++) blob(-40 + i * 26, -16, 20, 14, '#4f7a37', { lw: 2.5 }); ctx.restore(); }
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const bows = t > M.string.b;
  stand(X.mimis, 'mimis', 1, { t, talk: talk('mimis', t), look: la('mimis', [1, 0]), lid: true, brow: 'frown', mouth: 'flat',
    R: inM(t, M.saw) ? [80 + Math.sin(t * 16) * 30, -240] : bows ? [60, -120] : [44, -24], L: bows ? [-60, -110] : [-44, -24], itemL: bows ? 'bow' : null });
  if (inM(t, M.saw)) { const sx = X.mimis + 80 + Math.sin(t * 16) * 30; rect(sx - 4, standY() - 280, 60, 10, '#c9c9c9', { lw: 2 }); }
  const milk = inM(t, M.milk, -.3, 1.5);
  stand(X.christos, 'christos', 1.05, { t, talk: talk('christos', t), look: milk ? [-.6, -.2] : la('christos', [1, 0]), mouth: 'flat', brow: milk ? 'up' : 'flat',
    L: bows ? [-60, -120] : [-44, -24], itemL: bows ? 'bow' : 'sketch', R: bows ? [30, -110] : [30 + Math.sin(t * 12) * 8, -100], itemR: bows ? null : 'pencil', pull: inM(t, M.pose) ? .6 : 0 });
  if (milk) for (let i = 0; i < 3; i++) { const p = (t * 1.5 + i / 3) % 1; blob(X.christos - 64, standY(1.05) - 170 + p * 60, 3, 4, '#fbfaf2', { lw: 1 }); }
  const gtk = talk('giannos', t), holding = inM(t, M.jam) ? 'jammer' : inM(t, M.mag, 0, 3) ? 'magnet' : inM(t, M.racket, .6, 99) ? 'racketGun' : null;
  stand(X.giannos, 'giannos', 1, { t, talk: gtk, look: inM(t, M.solder) ? [.4, .8] : la('giannos', [-1, 0]), mouth: 'flat', brow: inM(t, M.L[9]) ? 'frown' : 'flat',
    R: holding ? [70, -120] : inM(t, M.solder) ? [60 + Math.sin(t * 5) * 6, -60] : gesture(t, gtk), itemR: holding, L: [-44, -24] });
  if (inM(t, M.solder) && Math.sin(t * 9) > 0) { blob(850, GROUND - 130, 5, 5, 'rgba(230,230,230,.6)', { lw: 0 }); blob(856, GROUND - 146, 7, 7, 'rgba(230,230,230,.4)', { lw: 0 }); }
  const tr = t > M.shield.a + .6;
  stand(X.giorgos, 'giorgos', 1, { t, talk: talk('giorgos', t), look: tr && t < M.tray.b ? [-.3, .6] : la('giorgos', [-1, 0]), brow: tr ? 'worry' : 'up', mouth: tr ? 'frown' : 'smirk', L: tr ? [-60, -110] : [-44, -24], itemL: tr ? 'tray' : null });
  ctx.restore();
  applyLight('dusk', .7);
  ctx.save(); applyCam(c); if (jamOn) glow(806, GROUND - 162, 50, 'rgba(120,200,255,1)', .4); ctx.restore();
  for (const [m, s] of LABELS) if (inM(t, M[m], 0, 0)) caption(s, clamp((t - M[m].a) * 3) * (1 - prog(t, M[m].b - .3, M[m].b)));
  if (inM(t, M.string, .8, -.8)) sfxText('ΤΣΑΚ!', 500, 180, 50, -.1, '#ffd23f');
  vignette(.35);
}
return {
  id: 'scene13', title: '13 · Οπλοστάσιο', steps, render,
  events: M => [[M.saw.a + .2, () => { for (let i = 0; i < 6; i++) noise(.12, .2, 2500, 1, 'bandpass', i * .16); }], [M.saw.a + 2.2, SFX.thud], [M.string.a + 1, SFX.slap], [M.string.a + 1.3, SFX.thud],
    [M.solder.a + .2, SFX.hiss], [M.jam.a, () => { SFX.boot(); }], [M.magnet.a + .3, SFX.clacks], [M.magnet.a + 1, SFX.clack], [M.racket.a + .6, SFX.zap], [M.shield.a + .6, () => tone(900, .5, 'sine', .06, 1.02)], [M.pose.a, SFX.fanfare]],
  ambience: () => ({ cicada: .01, cricket: .015 }),
};
})());
