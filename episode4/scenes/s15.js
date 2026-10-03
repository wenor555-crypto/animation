/* Ep.4, Scene 15 – «Κανείς»: Γιάννος, already in the cheap suit, calls the gang. Γιώργος's voicemail: «Ο Γιώργος είναι
   επένδυση.» Χρήστος in his room: the phone rings; he looks at it, looks at the inkwell, picks up neither. Μίμης: «Άλλη μια
   μαλακία του Κώστα;» «Έχει ένα ψυγείο που περπατάει.» «…Επιτέλους.» (the end of Act 2B: alone) */
defineScene((() => {
const VM = ['ΓΙΩΡΓΟΣ (τηλεφωνητής)', 'GIORGOS (voicemail)'], MP = ['ΜΙΜΗΣ (τηλέφωνο)', 'MIMIS (phone)'];
const CAMS = { gia: [600, 380, 1.9], room: [640, 420, 1.1], chr: [640, 400, 1.6], ink: [820, 520, 2.6], mim: [640, 360, 2.1] };
const steps = [
  { act: 'suit', d: 1.6, cam: 'gia' },
  { who: 'giannos', cam: 'gia', mark: 'come', el: 'Ήρθε. Στου Κώστα. Ελάτε τώρα.', en: "It's here. At Kostas's. Come now." },
  { who: 'giorgos', label: VM, fx: 'phone', cam: 'gia', mark: 'vm', el: 'Ο Γιώργος δεν είναι διαθέσιμος. Ο Γιώργος είναι επένδυση.', en: 'Giorgos is not available. Giorgos is an investment.' },
  { act: 'chr', d: 2.6, cam: 'chr' },
  { act: 'ink', d: 1.8, cam: 'ink' },
  { who: 'mimis', label: MP, fx: 'phone', cam: 'gia', mark: 'again', el: 'Άλλη μια μαλακία του Κώστα;', en: 'Another one of Kostas\'s bullshit stories?' },
  { who: 'giannos', cam: 'gia', el: 'Έχει ένα ψυγείο που περπατάει.', en: 'He has a fridge that walks.' },
  { who: 'mimis', cam: 'mim', mark: 'fin', el: '…Επιτέλους.', en: '…Finally.', gap: .8 },
  { act: 'end', d: 1.2, cam: 'mim' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  if (shot === 'chr' || shot === 'ink') {   // Χρήστος's room: the desk, the closed sketchbook, the inkwell, the phone buzzing
    room({ wall: '#2a2e40', floor: '#4a3a30', floorY: 600 });
    rect(820, 120, 240, 200, '#0b1030', { lw: 5 });
    rect(500, 470, 520, 18, '#6a4a2a', { lw: 4 }); limb([[520, 488], [520, 690]], 7, '#4a3a2a'); limb([[1000, 488], [1000, 690]], 7, '#4a3a2a');
    sketchbook(700, 462, 0, false);
    rect(808, 440, 26, 28, '#1a1a22', { lw: 3 }); rect(812, 432, 18, 10, '#3a3a44', { lw: 2 });   // the inkwell, closed
    const buzz = Math.sin(t * 40) * 2;
    ctx.save(); ctx.translate(900 + buzz, 462); rect(-12, -22, 24, 40, '#1b1b1f', { lw: 2.5 }); rect(-9, -18, 18, 30, Math.floor(t * 3) % 2 ? '#4aa0e9' : '#2a4a7a', { lw: 0 }); ctx.restore();
    person(620, SEAT + 30, 1, CAST.christos, { t, legs: 'seat', look: shot === 'ink' ? [.5, .6] : [.7, .5], brow: 'worry', mouth: 'flat', R: [60, -60], L: [-40, -60] });
    ctx.restore(); applyLight('night', .55); vignette(.5); return;
  }
  if (shot === 'mim') {   // Μίμης at home, the phone at his ear, his eyes light up
    room({ wall: '#3a3040', floor: '#4a3a30', floorY: 600 });
    stand(640, 'mimis', 1, { t, talk: talk('mimis', t), look: [.2, -.1], brow: 'up', mouth: t > M.fin.a ? 'smirk' : 'flat', R: [48, -196], itemR: 'phone', L: [-40, -30] });
    ctx.restore(); applyLight('night', .45); vignette(.45); return;
  }
  // Γιάννος in the suit, in his yard, calling
  yard(t, { light: 'night' });
  const v2 = { feet: [[-30, 146], [34, 146]], lean: .06 };
  inBody(600, standY(1), 1, 1, v2, suitBack);
  person(600, standY(1), 1, CAST.giannos, { t, talk: talk('giannos', t), legs: 'stand', v2, look: [.3, -.1], brow: 'worry', mouth: 'flat', R: [48, -196], itemR: 'phone', L: [-40, -30] });
  inBody(600, standY(1), 1, 1, v2, () => suitFront(t, {}));
  ctx.restore();
  applyLight('night', .5);
  vignette(.4);
}
return {
  id: 'scene15', title: '15 · Κανείς', steps, render,
  events: M => [[M.suit.a + .3, () => tone(1300, .08, 'sine', .03, 1)], [M.come.b, () => tone(440, .2, 'sine', .03, 1)], [M.vm.b, () => tone(1000, .5, 'sine', .04, 1)],
    [M.chr.a + .4, SFX.phone], [M.chr.a + 1.6, SFX.phone], [M.ink.a + .4, SFX.phone], [M.fin.b, () => tone(330, 1.2, 'sine', .03, 1.2)]],
  ambience: () => ({ cricket: .015 }),
};
})());
