/* Ep.1, Scene 17 – «ΣΙΤΑ-ΜΕΚΑ 3000» (beat 19): the manga climax. Ends with Βαγγελιώ's slipper. */
defineScene((() => {
const X = { kostas: 190, panik: 190, mimis: 300, giannos: 430, christos: 560, giorgos: 1185, vasilis: 660, vangelio: 1060, sita: 820 };
const CAMS = { wide: [700, 400, 1.02], mecha: [820, 360, 1.15], head: [820, 300, 2], guys: [400, 380, 1.7], chr: [560, 340, 2.4], gia: [430, 350, 2.3], kos: [200, 360, 2.3],
  gio: [1100, 400, 1.7], vas: [700, 400, 1.6], door: [1000, 470, 1.5], vang: [1060, 380, 2.2], throw: [900, 420, 1.2] };
const steps = [
  { act: 'rumble', d: 2.6, cam: 'wide' },
  { act: 'build', d: 4.4, cam: 'mecha' },
  { who: 'sita', cam: 'head', mark: 'name', el: 'ΣΙΤΑ-ΜΕΚΑ ΤΡΙΣΧΙΛΙΑ! Τώρα και σε ΤΡΕΙΣ άτοκες δόσεις!', en: 'SITA-MECHA THREE THOUSAND! Now in THREE interest-free instalments!' },
  { who: 'christos', cam: 'chr', el: '…Nani.', en: '…Nani.' },
  { who: 'giannos', cam: 'gia', el: 'Κώστα. Πιες.', en: 'Kostas. Drink.' },
  { act: 'drink', d: 3, cam: 'kos' },
  { who: 'panik', cam: 'kos', el: 'Η πόλη ξύπνησε. Κι εγώ θέλω καφέ.', en: 'The city is awake. And I want coffee.' },
  { act: 'charge', d: 2.8, cam: 'wide' },
  { who: 'sita', cam: 'head', el: 'CEO! Βοήθησέ με!', en: 'CEO! Help me!' },
  { who: 'giorgos', cam: 'gio', el: 'Βλέπω ότι η μετοχή πέφτει.', en: 'I see the stock is falling.' },
  { act: 'plug', d: 2.2, cam: 'mecha' },
  { who: 'giorgos', cam: 'gio', el: 'Διαφοροποίηση χαρτοφυλακίου.', en: 'Portfolio diversification.' },
  { act: 'vasWalk', d: 2.6, cam: 'vas' },
  { who: 'vasilis', cam: 'vas', el: 'Έχεις ένα τσιγάρο;', en: 'Got a cigarette?' },
  { who: 'sita', cam: 'head', el: '…Όχι.', en: '…No.' },
  { who: 'vasilis', cam: 'vas', el: 'Κανείς δεν έχει ποτέ.', en: 'Nobody ever does.' },
  { act: 'door', d: 3.6, cam: 'door' },
  { who: 'sita', cam: 'head', mark: 'offer', el: 'Κυρία Βαγγελιώ… μπορούμε να το συζητήσουμε. Έχω μια προσφορά—', en: "Mrs Vangelio… we can talk about this. I have an offer—" },
  { who: 'vangelio', cam: 'vang', mark: 'told', el: 'Σας είπα. Μην. Αφήνετε. Την πόρτα. ΑΝΟΙΧΤΗ.', en: 'I told you. Do not. Leave. The door. OPEN.', gap: .1 },
  { act: 'throw', d: 2.8, cam: 'throw' },
  { act: 'settle', d: 1.8, cam: 'wide' },
];
let M;
/* the mecha: every telemarketing device bolted onto Γιάννος's car, the σίτα as its face */
function mecha(t, o) {
  const x = 820, bk = o.build, fall = o.fall || 0, kneel = o.kneel || 0, recoil = o.back || 0;
  const part = (i, sx, sy, fn) => {           // each part flies in from (sx,sy), staggered; scatters when it falls
    const k = ease(clamp(bk * 1.6 - i * .12));
    const dx = fall * (hash(i) - .5) * 700, dy = fall * (120 + hash(i + 3) * 120) * (i > 3 ? 1 : .3), rot = fall * (hash(i + 7) - .5) * 3;
    ctx.save(); ctx.translate(lerp(sx, 0, k) + dx - recoil * 60, lerp(sy, 0, k) + dy + kneel * 60 * (i > 1 ? 1 : 0)); ctx.rotate(rot + (1 - k) * 1.5 * (hash(i) - .5)); fn(); ctx.restore();
  };
  ctx.save(); ctx.translate(x, GROUND); ctx.scale(1.35, 1.35); ctx.translate(-x, -GROUND);
  // cape (blanket) behind
  part(5, -300, 200, () => blanket(x - 190, 470, 380, 190, { t, ctrl: false, wave: 1, col: '#c9443a' }));
  // wings (rackets)
  part(6, 0, -300, () => { racket(x - 190, 420, -.9 + Math.sin(t * 6) * .1, t, { on: 1, s: 1.2 }); racket(x + 190, 420, .9 - Math.sin(t * 6) * .1, t, { on: 1, s: 1.2 }); });
  // legs (mop buckets)
  part(0, -500, 0, () => { mopBucket(x - 100, GROUND, t, { spin: 1, wheels: 1, mop: false }); mopBucket(x + 100, GROUND, t, { spin: 1, wheels: 1, mop: false }); });
  // torso (the car, on end) + belt
  part(1, -900, 0, () => { ctx.save(); ctx.translate(x, 600); ctx.rotate(-Math.PI / 2); car(0, 0, t, { s: .62, lights: 1 }); ctx.restore(); });
  part(2, 300, 100, () => belt(x, 600 - 20, t, { vib: 1, red: 1, cord: false }));
  // arms (hoses)
  const sw = o.swing || 0;
  part(3, 400, 100, () => { hose([[x - 70, 450], [x - 150, 480], [x - 200, 560], [x - 190, 620]], t, { eye: 1 }); hose([[x + 70, 450], [x + 150, 460 - sw * 100], [x + 240 - sw * 520, 430 - sw * 40], [x + 300 - sw * 700, 400 + sw * 60]], t, { eye: 1 }); });
  // head: the σίτα
  part(4, 240, 400, () => sita({ x, top: 250, w: 110, h: 210, t, chip: 1, led: 'red', mood: o.mood || 'evil', burn: 1, talk: talk('sita', t), open: o.open || 0, frame: false, flapL: .3, flapR: .3 }));
  ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS);
  const shake = inM(t, M.rumble) ? Math.sin(t * 60) * 5 : inM(t, M.throw, .9, -1) ? Math.sin(t * 80) * 8 : 0;
  ctx.save(); applyCam([c[0] + shake, c[1], c[2]]);
  yard(t, { light: 'day', winLit: 'red', winTop: 'red', noChickens: true, doorLit: false });
  // the door: empty now, until Βαγγελιώ steps out
  // guys
  const panik = t > M.drink.a + 1.6;
  for (const who of ['mimis', 'giannos', 'christos']) {
    const tk = talk(who, t), scared = t > M.build.a;
    stand(X[who], who, who === 'christos' ? 1.05 : 1, { t, talk: tk, look: t > M.door.a ? [1, -.1] : [1, -.4], brow: scared ? 'up' : 'flat', mouth: scared && !tk ? 'open' : 'flat', lid: who === 'mimis',
      itemL: who === 'christos' ? 'sketch' : null, L: who === 'christos' ? [-30, -110] : [-44, -24], R: who === 'christos' ? [30 + Math.sin(t * 30) * 8, -100] : who === 'giannos' && inM(t, M.L[2], -.3, .8) ? [-120, -120] : [44, -24],
      itemR: who === 'giannos' && inM(t, M.L[2], -.3, .8) ? 'bottle' : who === 'mimis' ? 'cup2' : null });
  }
  // Κώστας → Panik: drinks, shades, hood, speed lines; charges; the hose swats him into the coop
  const [kx, kw] = path(t, [[M.charge.a, 190], [M.charge.a + 1.2, 600]]);
  const swat = prog(t, M.charge.a + 1.2, M.charge.a + 2.2);
  if (swat <= 0) stand(kx, 'kostas', 1, { t, talk: talk('panik', t), legs: kw ? 'walk' : 'stand', hood: panik, shades: panik, look: [1, -.2], brow: panik ? 'frown' : 'up', mouth: panik ? 'frown' : 'flat',
    itemL: inM(t, M.drink, 0, -1) ? 'bottle' : null, L: inM(t, M.drink, 0, -1) ? [-10, -200] : [-50, -40], R: kw ? [110, -150] : [50, -60] });
  else if (swat < 1) { const px = lerp(600, 60, swat), py = standY() - Math.sin(swat * Math.PI) * 300; personRot(px, py, 1, CAST.kostas, { t, legs: 'stand', hood: true, shades: true, mouth: 'open' }, swat * 9); }
  // mecha
  if (t > M.rumble.a) {
    const carIn = prog(t, M.rumble.a, M.build.a);
    if (t < M.build.a) car(lerp(-700, 700, ease(carIn)), GROUND + 6, t, { moving: 1, lights: 1, dir: 1, s: .9 });
    else mecha(t, { build: prog(t, M.build.a, M.build.b), kneel: t > M.plug.a + .6 ? ease(prog(t, M.plug.a + .6, M.plug.b)) : 0, back: inM(t, M.door, 1.6, 99) ? ease(prog(t, M.door.a + 1.6, M.door.b)) * (1 - prog(t, M.throw.a + .9, M.throw.a + 1)) : 0,
      fall: ease(prog(t, M.throw.a + .9, M.throw.a + 2)), swing: swat > 0 && swat < 1 ? bump(t, M.charge.a + 1, M.charge.a + 1.6) : 0, mood: t > M.door.a + 1 ? 'shock' : 'evil', open: inM(t, M.offer) ? .2 : 0 });
    if (t < M.build.a + .8) { army(t); }
  }
  // Γιώργος: CEO shades, pulls the belt's plug
  const [gx, gw] = path(t, [[M.plug.a, 1185], [M.plug.a + 1, 930], [M.L[6].b + .4, 930], [M.vasWalk.a + 1.6, 1185]]);
  stand(gx, 'giorgos', 1, { t, talk: talk('giorgos', t), legs: gw ? 'walk' : 'stand', shades: true, look: t > M.L[5].a ? [-1, 0] : [-1, -.3], mouth: 'smirk', R: inM(t, M.plug, .8, 0) ? [-80, -40] : [44, -24] });
  if (inM(t, M.plug, .9, 99) && t < M.vasWalk.b) { curve([[gx - 70, standY() + 110], [gx - 140, GROUND - 10], [gx - 200, GROUND - 4]], 2.5); rect(gx - 86, standY() + 104, 16, 14, '#f4f2ec', { lw: 2 }); }
  // Βασίλης strolls between them, unbothered
  if (inM(t, M.vasWalk, 0, 99) && t < M.door.a + 1) {
    const [vx, vw] = path(t, [[M.vasWalk.a, 1060], [M.vasWalk.b, 660], [M.L[9].b + .2, 660], [M.door.a + 1, 300]]);
    stand(vx, 'vasilis', 1, { t, talk: talk('vasilis', t), legs: vw ? 'walk' : 'stand', look: [1, -.4], lid: true, bandage: true, R: inM(t, M.L[7], 0, 1) ? [80, -140] : [44, -24] });
  }
  // Βαγγελιώ: out of the dark kitchen, takes off her slipper… and throws
  if (t > M.door.a) {
    const [wx] = path(t, [[M.door.a, 1060], [M.door.a + 1.4, 1040]]);
    const aim = inM(t, M.told, 0, 99) && t < M.throw.a + .4, thrown = t > M.throw.a + .4;
    stand(wx, 'vangelio', 1, { t, talk: talk('vangelio', t), look: [-1, -.4], brow: 'frown', mouth: 'frown', lid: true,
      R: thrown ? [-90, -170] : aim ? [80, -240] : t > M.door.a + 2 ? [60, -120] : [44, -24], itemR: !thrown && t > M.door.a + 2 ? 'slipper' : null, L: [-44, -24] });
    if (thrown) { const k = prog(t, M.throw.a + .4, M.throw.a + .9); if (k < 1) slipper(lerp(1000, 820, k), lerp(430, 250, k) - Math.sin(k * Math.PI) * 60, k * 25, 1.4); else if (t < M.throw.a + 1.6) slipper(820, 250, 0, 1.4); }
  }
  ctx.restore();
  // manga from the moment the mecha assembles until it falls apart
  const mk = inM(t, M.build, 0, 99) ? prog(t, M.build.a, M.build.a + .4) * (1 - prog(t, M.settle.a, M.settle.a + .6)) : 0;
  if (mk > 0) {
    const [, sh] = shotAt(sc, t);
    if (sh === 'kos' && inM(t, M.drink, 1.4, 99) && t < M.charge.a) speedLines(640, 300, 70, 240, 'rgba(20,20,20,.7)', 5);
    if (sh === 'throw' || sh === 'head' && inM(t, M.name)) speedLines(640, 360, 60, 300, 'rgba(20,20,20,.5)', 9);
    mangaize(mk);
  }
  if (inM(t, M.build, 1, 0)) sfxText('ΚΛΑΝΚ! ΤΣΑΚ! ΚΛΑΚ!', 640, 110, 60, -.08, '#fff', '#111');
  if (inM(t, M.name, 0, 0)) sfxText('ΓΚΟΓΚΟΓΚΟ', 1080, 620, 56, .15, '#fff', '#111');
  if (inM(t, M.charge, 1.2, -.8)) sfxText('ΦΛΑΠ!', 500, 200, 90, -.12, '#fff', '#111');
  if (inM(t, M.plug, .9, -.6)) sfxText('ΠΛΟΠ', 1000, 560, 60, .1, '#fff', '#111');
  if (inM(t, M.throw, .9, -1)) sfxText('ΠΑΦ!!', 640, 200, 180, -.12, '#ffd23f', '#111');
  if (inM(t, M.charge, 2.2, 0) || inM(t, M.L[6], 0, 0)) sfxText('ΚΡΑΣ!', 150, 480, 60, .1, '#fff', '#111');
}
function army(t) {
  hose([[1180, 692], [1140, 690], [1120, 650], [1130, 560], [1110, 500], [1140, 470]], t, { eye: 1 });
  mopBucket(1270, 690, t, { spin: .6, wheels: 1, eye: 1, mop: false });
}
return {
  id: 'scene17', title: '17 · ΣΙΤΑ-ΜΕΚΑ', steps, render, fadeIn: false,
  events: M => [[M.rumble.a, () => { SFX.boom(); SFX.rev(); }], [M.build.a, SFX.swell], ...[0, 1, 2, 3, 4, 5].map(i => [M.build.a + .4 + i * .45, () => { SFX.thud(); SFX.clack(); }]), [M.name.a, SFX.fanfare],
    [M.drink.a + .3, SFX.sip], [M.drink.a + 1.6, () => { SFX.whoosh(); SFX.swell(); }], [M.charge.a, SFX.whoosh], [M.charge.a + 1.2, SFX.slap], [M.charge.a + 2.2, () => { SFX.crash(); SFX.cluck(); }],
    [M.plug.a + .9, SFX.pop], [M.plug.a + 1, () => tone(300, 1, 'sawtooth', .07, .3)], [M.door.a + .2, SFX.creak], [M.door.a + 2, SFX.gong], [M.throw.a + .4, SFX.whoosh], [M.throw.a + .9, () => { SFX.slap(); SFX.boom(); }], [M.throw.a + 1.1, SFX.crash]],
  ambience: (t, M) => ({ hum: t < M.throw.a + 1 ? .05 : 0, cicada: t > M.throw.a + 1 ? .03 : 0 }),
};
})());
