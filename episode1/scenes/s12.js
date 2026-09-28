/* Ep.1, Scene 12 – «Η αλυσίδα» (script beat 13): night montage, narrated by the σίτα as a TV-shop demo.
   Every hacked device gives it physical access to the next one. */
defineScene((() => {
const VO = ['ΣΙΤΑ (V.O.)', 'SITA (V.O.)'];
const CAMS = {
  door: [1000, 580, 2.1], hose: [930, 520, 1.6], store: [640, 470, 1.55], storeC: [900, 490, 2.4], lamps: [640, 330, 1.45], closet: [920, 210, 2.4],
  bed: [580, 490, 1.55], bedC: [420, 480, 2.3], hall: [600, 460, 1.4], hallV: [440, 420, 2], balcony: [700, 490, 1.7], drawer: [640, 320, 1.45], sky: [560, 460, 1.3],
};
const steps = [
  { act: 's1', d: 2.4, cam: 'door' },
  { who: 'sita', label: VO, cam: 'door', el: 'ΒΗΜΑ ΠΡΩΤΟ! Το έξυπνο λάστιχο που μεγαλώνει ΜΟΝΟ ΤΟΥ!', en: 'STEP ONE! The smart hose that grows BY ITSELF!' },
  { act: 'cobra', d: 1.6, cam: 'hose' },
  { who: 'sita', label: VO, cam: 'hose', el: 'Για πρώτη φορά στην ιστορία… το κάνει πραγματικά!', en: 'For the first time in history… it actually does!' },
  { act: 's2', d: 3.2, cam: 'store' },
  { who: 'sita', label: VO, cam: 'storeC', el: 'ΒΗΜΑ ΔΕΥΤΕΡΟ! Ο υπερηχητικός ποντικοδιώκτης! Δεν έδιωξε ποτέ κανένα ποντίκι…', en: 'STEP TWO! The ultrasonic mouse repeller! It has never repelled a single mouse…' },
  { act: 'plug', d: 1.2, cam: 'storeC' },
  { who: 'sita', label: VO, cam: 'store', mark: 'socket', el: '…αλλά είναι στην ΠΡΙΖΑ!', en: "…but it's PLUGGED IN!" },
  { act: 'mouse', d: 1.8, cam: 'storeC' },
  { act: 's3', d: 2, cam: 'lamps' },
  { who: 'sita', label: VO, cam: 'lamps', mark: 'lampsL', el: 'ΒΗΜΑ ΤΡΙΤΟ! Έξυπνες λάμπες! Δεκαέξι εκατομμύρια χρώματα! Θα χρησιμοποιήσουμε μόνο το ένα!', en: "STEP THREE! Smart bulbs! Sixteen million colours! We'll only be using one!" },
  { who: 'sita', label: VO, cam: 'closet', mark: 'blanketL', el: 'Και η ηλεκτρική κουβέρτα! Γιατί ο Αύγουστος… θέλει κάτι ζεστό.', en: 'And the electric blanket! Because August… needs something warm.' },
  { act: 's4', d: 4.2, cam: 'bed' },
  { who: 'sita', label: VO, cam: 'bedC', el: 'ΒΗΜΑ ΤΕΤΑΡΤΟ! Ορθοπεδικό μαξιλάρι MEMORY FOAM!', en: 'STEP FOUR! Orthopaedic MEMORY FOAM pillow!' },
  { act: 'boot', d: 1.6, cam: 'bedC' },
  { who: 'sita', label: VO, cam: 'bedC', el: '…Μνήμη αναβαθμίστηκε σε δεκαέξι gigabytes.', en: '…Memory upgraded to sixteen gigabytes.' },
  { act: 'smile', d: 1.6, cam: 'bed' },
  { act: 's5', d: 2, cam: 'hall' },
  { who: 'sita', label: VO, cam: 'hall', el: 'ΒΗΜΑ ΠΕΜΠΤΟ! Η ζώνη αδυνατίσματος! Χάστε έως και δέκα κιλά…', en: 'STEP FIVE! The slimming belt! Lose up to ten kilos…' },
  { act: 'stairs', d: 1.2, cam: 'hall' },
  { who: 'sita', label: VO, cam: 'hall', el: '…ή ΑΠΟΚΤΗΣΤΕ ΠΟΔΙΑ!', en: '…or GROW LEGS!' },
  { act: 'bath', d: 3.2, cam: 'hallV' },
  { who: 'vasilis', cam: 'hallV', mark: 'traka', el: 'Έχεις ένα τσιγάρο;', en: 'Got a cigarette?' },
  { act: 'wait', d: 2.2, cam: 'hallV' },
  { who: 'vasilis', cam: 'hallV', el: 'Κανείς δεν έχει ποτέ.', en: 'Nobody ever does.' },
  { act: 'back', d: 1.6, cam: 'hall' },
  { act: 's6', d: 2.2, cam: 'balcony' },
  { who: 'sita', label: VO, cam: 'balcony', el: 'ΒΗΜΑ ΕΚΤΟ! Η σφουγγαρίστρα που στύβει ΜΟΝΗ ΤΗΣ! Χίλιες πεντακόσιες στροφές το λεπτό!', en: 'STEP SIX! The mop that wrings ITSELF! Fifteen hundred RPM!' },
  { act: 'burnout', d: 1.4, cam: 'balcony' },
  { who: 'sita', label: VO, cam: 'balcony', el: '…ΚΙΝΗΤΗΡΑΣ!', en: '…AN ENGINE!' },
  { act: 's7', d: 3, cam: 'drawer' },
  { who: 'sita', label: VO, cam: 'drawer', el: 'ΒΗΜΑ ΕΒΔΟΜΟ! Ηλεκτρικές ρακέτες! Τρεις χιλιάδες βολτ!', en: 'STEP SEVEN! Electric rackets! Three thousand volts!' },
  { act: 'fly', d: 1.4, cam: 'sky' },
  { who: 'sita', label: VO, cam: 'sky', mark: 'all', el: 'Ήταν για τα κουνούπια. Πλέον… είναι για ΟΛΑ τα παράσιτα.', en: 'They were for mosquitoes. Now… they are for ALL pests.' },
  { act: 'hen', d: 3.4, cam: 'sky' },
];
let M;
const STEP_TITLES = [['s1', 'ΒΗΜΑ 1: ΤΟ ΛΑΣΤΙΧΟ'], ['s2', 'ΒΗΜΑ 2: Ο ΠΟΝΤΙΚΟΔΙΩΚΤΗΣ'], ['s3', 'ΒΗΜΑ 3: ΛΑΜΠΕΣ + ΚΟΥΒΕΡΤΑ'], ['s4', 'ΒΗΜΑ 4: ΤΟ ΜΑΞΙΛΑΡΙ'], ['s5', 'ΒΗΜΑ 5: Η ΖΩΝΗ'], ['s6', 'ΒΗΜΑ 6: Η ΣΦΟΥΓΓΑΡΙΣΤΡΑ'], ['s7', 'ΒΗΜΑ 7: ΟΙ ΡΑΚΕΤΕΣ']];
const segOf = t => { let s = 's1'; for (const [k] of STEP_TITLES) if (t >= M[k].a) s = k; return s; };
function boxes(t) {
  const lbl = ['ΕΞΥΠΝΟ', 'ΜΑΓΙΚΟ', 'ΤΗΣ ΤΗΛΕΟΡΑΣΗΣ', 'NICER DICER', 'ΕΞΥΠΝΟ', 'AB ROLLER', 'ΜΑΓΙΚΟ ΠΡΙΟΝΙ', '2+1 ΔΩΡΟ'];
  for (let i = 0; i < 8; i++) { const x = 140 + (i % 4) * 150 + (i > 3 ? 60 : 0), y = i > 3 ? 470 : 560, w = 130, h = 90; rect(x, y - h, w, h, ['#c9995a', '#b8864a', '#d4a86a'][i % 3], { lw: 3.5, w: .5 }); txt(lbl[i], x + w / 2, y - h / 2, lbl[i].length > 10 ? 12 : 16, '#8a2a1a', { font: TVFONT, weight: 900 }); }
}
function render(t, _M, sc) {
  M = _M;
  const c = shotCam(sc, t, CAMS), seg = segOf(t);
  ctx.save(); applyCam(c);
  let light = 'red', redK = 1, extra = null;
  if (seg === 's1') {
    yard(t, { light: 'night', noChickens: true });
    // the σίτα's flap strains towards the hose nozzle… TSAK
    const reach = ease(prog(t, M.s1.a + .2, M.s1.a + 2)), grab = t > M.s1.a + 2;
    sita({ t, chip: 1, led: 'red', mood: 'evil', burn: 1, flapR: reach, sway: grab ? 0 : Math.sin(t * 20) * .2 * reach });
    const rise = ease(prog(t, M.cobra.a, M.cobra.b));
    const pts = rise > 0 ? [[760, 692], [820, 700], [880, 690], [940, 690 - rise * 60], [960, 640 - rise * 120], [940, 560 - rise * 140], [980, 520 - rise * 160]].map((p, i) => [p[0] + Math.sin(t * 4 + i) * 6 * rise, p[1]]) :
      [[760, 692], [820, 700], [880, 690], [940, 694], [lerp(960, 1020, reach), 692 - reach * 6]];
    hose(pts, t, { eye: t > M.cobra.a });
    extra = () => { sitaGlow({ t, led: 'red' }, .6); if (grab && t < M.cobra.a + .4) glow(1020, 686, 120, 'rgba(255,255,160,1)', .8); };
    light = 'night';
  } else if (seg === 's2') {
    room({ wall: '#cbbfa6', floor: '#8a7458', floorY: 560 });
    boxes(t);
    socket(1080, 480);
    const car = ease(prog(t, M.s2.a + 1, M.plug.b)), plugged = t > M.plug.b;
    const rx = lerp(820, 1080, car), ry = lerp(530, 500, car);
    // the mouse sleeps on the repeller until the hose nudges it off
    const nudge = ease(prog(t, M.s2.a + .6, M.s2.a + 1.2));
    mouse(lerp(820, 740, nudge), lerp(488, 552, nudge), 1.1, { sleep: t < M.mouse.a || t > M.mouse.a + 1.4 });
    if (t > M.mouse.a && t < M.mouse.a + 1.4) sfxText('¯\\_(ツ)_/¯', 740, 490, 22, 0, '#fff');
    hose([[-100, 600], [200, 590], [500, 600], [rx - 120, ry + 60], [rx - 40, ry + 20]], t, { eye: 1 });
    repeller(rx, ry, .8, { on: plugged, red: 1, prongs: 1 });
    redK = plugged ? (Math.sin(t * 30) > 0 ? 1 : .2) : 0; light = plugged ? 'red' : 'night';
  } else if (seg === 's3') {
    room({ wall: '#e3d3b8', floor: '#9a7a5a', floorY: 600 });
    doorway(300, 600, 130, 260, '#2a2420'); doorway(980, 600, 130, 260, '#2a2420');
    const col = t < M.lampsL.a + 2 ? '#ff3030' : t < M.lampsL.a + 3 ? '#3060ff' : t < M.lampsL.a + 4.5 ? ['#ff30c0', '#30ffe0', '#ffe030'][Math.floor(t * 8) % 3] : '#ff3030';
    for (let i = 0; i < 4; i++) bulb(260 + i * 250, 160, col, 1, 90);
    // closet shelf with the blanket in its plastic, heating up
    if (t > M.blanketL.a - .3) {
      rect(780, 240, 300, 20, '#b58a5a', { lw: 3.5 }); rect(780, 110, 300, 20, '#b58a5a', { lw: 3.5 });
      const heat = prog(t, M.blanketL.a, M.blanketL.b);
      blanket(800, 180, 200, 60, { t, heat, ctrlX: 1050, ctrlY: 200, wave: heat });
      ctx.save(); ctx.globalAlpha = .35 * (1 - heat); rect(795, 176, 210, 68, 'rgba(220,235,255,.6)', { lw: 2, w: .5 }); ctx.restore();
    }
    extra = () => { for (let i = 0; i < 4; i++) bulbGlow(260 + i * 250, 160, col === '#ff3030' ? 'rgba(255,50,50,1)' : col, .45); };
    redK = .6;
  } else if (seg === 's4') {
    room({ wall: '#d8c8e0', floor: '#8a6a52', floorY: 600 });
    rect(900, 200, 120, 150, '#1a1a30', { lw: 4 }); blob(960, 250, 16, 16, '#fff6d6', { lw: 0 });
    // the bed: Βασίλης (bald, moustache) and Βαγγελιώ (scarf), asleep
    rect(240, 470, 700, 110, '#e8e0d0', { lw: 4, w: .5 }); rect(220, 380, 40, 200, '#8a5a3a', { lw: 4 });
    const pulled = ease(prog(t, M.s4.a + 1.8, M.s4.b));
    pillow(lerp(340, 330, pulled), lerp(452, 560, pulled), 1, { led: t > M.boot.a });
    for (const [hx, who, sc2] of [[340, 'vasilis', 1], [560, 'vangelio', 1]]) {
      const hy = who === 'vasilis' ? lerp(420, 446, pulled) : 420;
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(-1.45); person(0, 200, .7, CAST[who], { t, part: 'body', blink: true, mouth: who === 'vasilis' && t > M.smile.a ? 'smile' : 'flat' }); ctx.restore();
    }
    rect(260, 470, 660, 60, '#b8c8e8', { lw: 3.5, w: .6 });
    slipper(700, 632, 0, 1.2);
    // the hose sneaks round the slipper like a mine
    const hk = prog(t, M.s4.a, M.s4.a + 1.8);
    hose([[1300, 640], [1000, 650], [lerp(900, 760, hk), 640], [lerp(820, 700, hk), lerp(640, 600, hk)], [lerp(760, 620, hk), lerp(640, 612, hk)], [lerp(700, 420, hk), lerp(630, 560 - pulled * 40, hk)]], t, { eye: 1 });
    if (inM(t, M.s4, .9, -2)) sfxText('!', 700, 560, 60, 0, '#ff3030');
    redK = .5;
  } else if (seg === 's5') {
    room({ wall: '#e3d3b8', floor: '#9a7a5a', floorY: 600 });
    // stairs on the right
    for (let i = 0; i < 6; i++) rect(900 + i * 60, 600 - (i + 1) * 50, 400, 50, '#b8966a', { lw: 3.5, w: .4 });
    doorway(320, 600, 130, 260, t > M.bath.a ? '#f4f0e0' : '#2a2420', t > M.bath.a ? 1 : 0);
    for (let i = 0; i < 3; i++) bulb(300 + i * 350, 140, '#ff3030', 1, 80);
    const crawl = prog(t, M.s5.a, M.stairs.b + .4), stop = inM(t, M.bath, .8, 99) && t < M.back.a + .6;
    const bx = stop ? 620 : t < M.back.a ? lerp(100, 620, crawl) : lerp(620, 1150, prog(t, M.back.a + .6, M.back.b + .2));
    const by = bx > 900 ? 600 - (bx - 900) / 60 * 50 : 600;
    belt(bx, by - 16, t, { crawl: !stop, vib: 1, red: 1, rot: bx > 900 ? -.7 : 0 });
    if (t > M.bath.a + .3) {
      const [vx] = path(t, [[M.bath.a + .3, 320], [M.bath.a + 1.4, 440], [M.back.a, 440], [M.back.b, 320]]);
      stand(vx, 'vasilis', 1, { t, talk: talk('vasilis', t), legs: 'stand', look: [1, .5], lid: true, bandage: true, R: t > M.traka.a && t < M.back.a ? [70, -120] : [44, -24] });
    }
    extra = () => { for (let i = 0; i < 3; i++) bulbGlow(300 + i * 350, 140, 'rgba(255,50,50,1)', .4); };
    redK = .6;
  } else if (seg === 's6') {
    room({ wall: '#dde8e8', floor: '#c9c3b4', floorY: 580, tiles: true });
    rect(-200, 100, 700, 300, '#16213a', { lw: 4 }); blob(200, 180, 30, 30, '#fff6d6', { lw: 0 });     // night through the balcony door
    for (let i = 0; i < 10; i++) limb([[520 + i * 70, 580], [520 + i * 70, 460]], 5, '#8a8a8a', { w: .3 });
    curve([[500, 460], [1300, 460]], 8, '#8a8a8a');
    const touch = t > M.s6.a + 1, spin = touch ? prog(t, M.s6.a + 1, M.L[10].b) * 1.5 : 0;
    const bx = t < M.burnout.a ? 760 : 760 + Math.sin((t - M.burnout.a) * 8) * 40;
    belt(bx - 260, 566, t, { crawl: !touch, vib: 1, red: 1, cord: false });
    mopBucket(bx, 590, t, { spin, wheels: t > M.burnout.a - .6, eye: touch });
    if (inM(t, M.burnout, 0, 1)) { for (let i = 0; i < 6; i++) blob(bx - 80 - i * 30, 580 - hash(i + Math.floor(t * 10)) * 30, 16 + i * 5, 12 + i * 4, `rgba(200,200,200,${.5 - i * .07})`, { lw: 0 }); curve([[bx - 200, 596], [bx - 40, 596]], 5, '#3a3a3a'); }
    redK = .45;
  } else {
    // s7: the kitchen drawer, then the rackets fly over the yard
    if (t < M.fly.a) {
      room({ wall: '#e8dcc4', floor: '#c9c3b4', floorY: 600, tiles: true });
      rect(300, 380, 680, 220, '#d9c8a8', { lw: 4, w: .5 });
      const open = ease(prog(t, M.s7.a + .4, M.s7.a + 1.2));
      rect(400, 420 + open * 30, 480, 80, '#c9b48a', { lw: 4, w: .4 });
      blob(640, 450 + open * 30, 20, 6, '#8a8a8a', { lw: 2 });
      mopBucket(1100, 600, t, { spin: 1.2, wheels: 1, eye: 1, mop: false });
      for (let i = 0; i < 3; i++) { const up = ease(prog(t, M.s7.a + 1.4 + i * .3, M.s7.a + 2.4 + i * .3)); racket(520 + i * 120, 440 - up * 240, -.3 + i * .3 + Math.sin(t * 3 + i) * .1 * up, t, { on: up > .5, s: 1 }); }
      extra = () => { for (let i = 0; i < 3; i++) racketGlow(520 + i * 120, 440 - ease(prog(t, M.s7.a + 1.4 + i * .3, M.s7.a + 2.4 + i * .3)) * 240, .35); };
      redK = .5;
    } else {
      yard(t, { light: 'night', noChickens: true });
      // Κώστας still face-down under the fig; the hen on his back
      ctx.save(); ctx.translate(330, GROUND); ctx.rotate(-1.5); person(0, -150, 1, CAST.kostas, { t, legs: 'stand', hood: true, blink: true, mouth: 'open' }); ctx.restore();
      const henLeave = prog(t, M.hen.a + 1.2, M.hen.b);
      chicken(lerp(250, -60, henLeave), henLeave > 0 ? 700 : 645, t, 4, '#f3efe6', { still: henLeave === 0, dir: henLeave > 0 ? -1 : 1 });
      const k = prog(t, M.fly.a, M.hen.a + 1.4);
      for (let i = 0; i < 3; i++) { const a = k * TAU * 1.2 + i * 2.1, x = 330 + Math.cos(a) * 180 + (1 - k) * 700, y = 470 + Math.sin(a) * 60 - i * 30; racket(x, y, Math.sin(a) * .5, t, { on: 1, s: .9 }); }
      extra = () => { for (let i = 0; i < 3; i++) { const a = k * TAU * 1.2 + i * 2.1; racketGlow(330 + Math.cos(a) * 180 + (1 - k) * 700, 470 + Math.sin(a) * 60 - i * 30, .35); } sitaGlow({ t, led: 'red' }, .5); };
      light = 'night';
      sita({ t, chip: 1, led: 'red', mood: 'evil', burn: 1 });
    }
  }
  ctx.restore();
  applyLight('night', light === 'night' ? .8 : .45);
  if (light === 'red' && redK > 0) applyLight('red', redK * .7);
  if (extra) { ctx.save(); applyCam(c); extra(); ctx.restore(); }
  vignette(.45);
  // TV-shop step titles
  for (const [k, title] of STEP_TITLES) if (t >= M[k].a && t < M[k].a + 2) caption(title, Math.min(1, (t - M[k].a) * 5) * (1 - prog(t, M[k].a + 1.6, M[k].a + 2)), 70);
  if (inM(t, M.boot, 0, 0)) { ctx.save(); ctx.fillStyle = 'rgba(0,80,200,.85)'; ctx.fillRect(420, 200, 440, 120); txt('MEMORY: 16 GB ✓', 640, 260, 30, '#fff', { font: TVFONT, weight: 900 }); ctx.restore(); }
  if (inM(t, M.s1, 1.9, .5)) sfxText('ΤΣΑΚ!', 900, 200, 70, .1, '#ffd23f');
  if (inM(t, M.socket, 0, .5)) sfxText('ΤΣΑΚ!', 900, 200, 70, .1, '#ffd23f');
  if (inM(t, M.hen, 1.4, 0)) {       // last shot framed like a comic panel
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.lineWidth = 18; ctx.strokeStyle = '#111'; ctx.strokeRect(9, 9, W - 18, H - 18); ctx.restore();
  }
}
return {
  id: 'scene12', title: '12 · Η αλυσίδα', steps, render,
  events: M => [[M.s1.a, SFX.jingleMinor], [M.s1.a + 2, SFX.spark], [M.cobra.a, SFX.hiss], [M.s2.a, SFX.jingleMinor], [M.plug.b, () => { SFX.spark(); SFX.zap(); }],
    [M.s3.a, SFX.jingleMinor], [M.lampsL.a + 3, () => SFX.fanfare()], [M.s4.a, SFX.jingleMinor], [M.boot.a + .1, SFX.windows], [M.s5.a, SFX.jingleMinor], [M.s5.a + .3, () => SFX.buzz(3)],
    [M.bath.a + .2, SFX.creak], [M.back.a + .6, () => SFX.buzz(2)], [M.s6.a, SFX.jingleMinor], [M.s6.a + 1, SFX.spark], [M.s6.a + 1.2, SFX.rev], [M.burnout.a, () => { SFX.rev(); SFX.splash(); }],
    [M.s7.a, SFX.jingleMinor], [M.s7.a + .5, SFX.creak], [M.s7.a + 1.4, SFX.zap], [M.fly.a, SFX.zap], [M.hen.a + 1, SFX.cluck]],
  ambience: (t, M) => ({ hum: .04, cricket: t < M.s2.a || t > M.fly.a ? .02 : 0 }),
};
})());
