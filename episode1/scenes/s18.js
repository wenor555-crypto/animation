/* Ep.1, Scene 18 – «Εγγύηση 14 ημερών» (beat 20): the refund call, the σίτα folds itself into its box. */
defineScene((() => {
const X = { mimis: 300, giannos: 430, christos: 560, giorgos: 1185, vasilis: 610, maria: 890, sita: 820 };
const CAMS = { wide: [700, 400, 1.02], vas: [610, 360, 2.1], box: [900, 590, 2.1], gio: [1100, 380, 2], win: [890, 240, 2.4], all: [640, 420, 1.25] };
const steps = [
  { act: 'after', d: 2.4, cam: 'wide' },
  { who: 'vasilis', cam: 'vas', el: 'Ναι, γεια σας. Για επιστροφή. Την έξυπνη σίτα.', en: "Yes, hello. About a return. The smart screen." },
  { act: 'listen1', d: 1.4, cam: 'vas' },
  { who: 'vasilis', cam: 'vas', el: 'Όχι, δεν δουλεύει όπως στη διαφήμιση. Δουλεύει πολύ παραπάνω.', en: "No, it doesn't work like in the ad. It works a lot more." },
  { act: 'listen2', d: 1.4, cam: 'vas' },
  { who: 'vasilis', cam: 'vas', mark: 'warranty', el: 'Είχε εγγύηση δεκατεσσάρων ημερών.', en: 'It had a fourteen-day warranty.' },
  { act: 'fold', d: 4.2, cam: 'box' },
  { who: 'sita', cam: 'box', mark: 'thanks', el: 'Ευχαριστούμε… για την προτίμηση.', en: 'Thank you… for your custom.' },
  { act: 'lid', d: 1.6, cam: 'box' },
  { who: 'giorgos', cam: 'gio', el: '…Κάνουμε pivot.', en: "…We're pivoting." },
  { act: 'win', d: .8, cam: 'win' },
  { who: 'maria', cam: 'win', el: 'Μίμη! Ούτε η σίτα δεν σε άντεξε!', en: "Mimis! Even the screen couldn't stand you!" },
  { act: 'end', d: 2.4, cam: 'all' },
];
let M;
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, { light: 'day', noChickens: false, winTop: t > M.win.a - .2 ? 'lit' : null });
  // Μαρία at the window
  if (t > M.win.a - .2) { const up = back(prog(t, M.win.a, M.win.a + .5)); ctx.save(); ctx.beginPath(); ctx.rect(832, 172, 116, 126); ctx.clip(); person(890, 470 - up * 60, .82, CAST.maria, { t, talk: talk('maria', t), look: [-.4, .8], brow: 'up', part: 'body', mouth: 'smirk' }); ctx.restore(); }
  // the wreckage: devices strewn about, all their LEDs off
  hose([[560, 700], [640, 690], [700, 704], [760, 694]], t, {});
  belt(1040, 684, t, { cord: false }); mopBucket(1180, 692, t, { wheels: 1, mop: false });
  racket(640, 660, 1.4, t, { s: .8 }); racket(760, 620, -1.3, t, { s: .8 });
  blanket(420, 650, 160, 40, { t, ctrl: false });
  car(-80, GROUND + 6, t, { dir: 1, s: .85 });
  // the σίτα folds itself up and climbs into its box
  const foldK = ease(prog(t, M.fold.a + .4, M.fold.b)), lidK = ease(prog(t, M.lid.a, M.lid.b - .4));
  if (foldK < 1) { ctx.save(); ctx.translate(900, 640); ctx.scale(1 - foldK * .7, 1 - foldK * .8); ctx.translate(-900, -640); sita({ x: 900, top: 440, w: 110, h: 210, t, chip: 1, led: t > M.fold.a ? 'green' : 'off', mood: 'sad', burn: 1, talk: talk('sita', t) * .4, flapL: .2 }); ctx.restore(); }
  else if (lidK < 1) { ctx.save(); ctx.translate(900, 620); ctx.scale(.3, .25); ctx.translate(-900, -540); sita({ x: 900, top: 440, w: 110, h: 210, t, chip: 1, led: 'green', mood: 'sad', burn: 1, talk: talk('sita', t) * .4 }); ctx.restore(); }
  sitaBox(900, 646, 1.2, { open: 1 - lidK, label: 'ΕΠΙΣΤΡΟΦΗ' });
  // the guys, now relaxed; Κώστας covered in feathers
  for (const who of ['mimis', 'giannos', 'christos']) stand(X[who], who, who === 'christos' ? 1.05 : 1, { t, talk: talk(who, t), look: t > M.win.a ? [.8, -.6] : [1, 0], lid: who === 'mimis', mouth: who === 'mimis' ? 'smirk' : 'flat',
    itemR: who === 'mimis' ? 'cup2' : null, itemL: who === 'christos' ? 'sketch' : null, L: who === 'christos' ? [-30, -110] : [-44, -24], R: who === 'christos' ? [30, -100] : [44, -24] });
  stand(180, 'kostas', 1, { t, look: [1, 0], hood: true, shades: false, lid: true, mouth: 'flat' }); feathers(180, 420, 0, 10, .3);
  stand(1185, 'giorgos', 1, { t, talk: talk('giorgos', t), look: [-1, 0], shades: t < M.L[4].a, mouth: 'smirk', L: [-44, -24], R: t > M.L[4].a ? [30, -175] : [44, -24] });
  // Βασίλης on the phone, finally with a cigarette
  stand(X.vasilis, 'vasilis', 1, { t, talk: talk('vasilis', t), look: inM(t, M.fold, 0, 99) ? [1, .4] : [.2, 0], lid: true, bandage: true, R: [30, -175], itemR: 'phone', L: [-10, -150], itemL: 'cig', mouth: 'flat' });
  ctx.restore();
  if (inM(t, M.lid, .6, 0)) sfxText('ΚΛΑΚ.', 900, 200, 60, 0, '#fff');
}
return {
  id: 'scene18', title: '18 · Εγγύηση', steps, render,
  events: M => [[M.fold.a + .4, () => SFX.clacks(3)], [M.fold.a + 2, () => SFX.clacks(2)], [M.lid.a + .6, SFX.thud], [M.win.a, SFX.creak]],
  ambience: () => ({ cicada: .03, mosq: .004 }),
};
})());
