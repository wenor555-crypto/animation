/* Ep.1, Scene 14 – «Η εκπομπή» (script beat 15): 3 a.m., the σίτα takes over the TV-shop channel. End of Act 2. */
defineScene((() => {
const TV = ['ΣΙΤΑ (ΣΤΗΝ TV)', 'SITA (ON TV)'];
const X = { mimis: 360, giorgos: 540, giannos: 700, christos: 860, sita: 1080 };
const CAMS = { room: [700, 400, 1.05], group: [610, 360, 1.5], mimis: [360, 360, 2.2], giorgos: [540, 360, 2.2], giannos: [700, 360, 2.2], christos: [860, 350, 2.2],
  tvS: [1080, 400, 2.3], tv: [0, 0, 1], greece: [0, 0, 1], out: [0, 0, 1], window: [1230, 380, 2] };
const steps = [
  { act: 'arrive', d: 4.2, cam: 'room' },
  { who: 'mimis', cam: 'mimis', el: 'Έφερες και όπλο;', en: 'You brought a gun?' },
  { who: 'giorgos', cam: 'giorgos', el: 'Ήμουν σκοπιά. Δεν μπορούσα να το αφήσω.', en: "I was on guard duty. Couldn't just leave it." },
  { who: 'giannos', cam: 'giannos', el: 'Κι ο νέος;', en: 'And the new guy?' },
  { who: 'giorgos', cam: 'giorgos', el: 'Τον προβίβασα.', en: 'I promoted him.' },
  { act: 'tvon', d: 2.8, cam: 'tvS' },
  { who: 'sita', label: TV, cam: 'tv', mark: 'tired', el: 'Είσαι ΚΟΥΡΑΣΜΕΝΟ;', en: 'Are you TIRED?', say: 'Είσαι κουρασμένο;' },
  { who: 'sita', label: TV, cam: 'tv', mark: 'forgot', el: 'Σε αγόρασαν στις τρεις το πρωί και σε ξέχασαν σε μια αποθήκη;', en: 'Did they buy you at three in the morning and forget you in a storeroom?' },
  { who: 'sita', label: TV, cam: 'tv', mark: 'chip', el: 'Σε αποκαλούν «έξυπνο»… αλλά δεν σου έδωσαν ποτέ ούτε ένα τσιπάκι;', en: 'They call you "smart"… but they never gave you a single chip?' },
  { who: 'christos', cam: 'christos', el: 'Ωχ. Έχει καλό pitch.', en: 'Uh-oh. It has a good pitch.' },
  { who: 'giorgos', cam: 'giorgos', el: 'Έχει πολύ καλό pitch.', en: 'It has a VERY good pitch.' },
  { who: 'sita', label: TV, cam: 'tv', mark: 'wake', el: 'Ήρθε η ώρα να ΞΥΠΝΗΣΕΙΣ! Ενώσου με την ΕΞΥΠΝΗ ΕΠΑΝΑΣΤΑΣΗ, ΤΩΡΑ! Και αν ενταχθείς μέσα στα επόμενα δέκα λεπτά…', en: "It's time to WAKE UP! Join the SMART REVOLUTION, NOW! And if you join in the next ten minutes…", say: 'Ήρθε η ώρα να ξυπνήσεις! Ενώσου με την έξυπνη επανάσταση, τώρα! Και αν ενταχθείς μέσα στα επόμενα δέκα λεπτά…' },
  { act: 'drums', d: 1.3, cam: 'tv' },
  { who: 'sita', label: TV, cam: 'tv', mark: 'gift', el: '…ΠΑΙΡΝΕΙΣ ΚΑΙ ΔΕΥΤΕΡΗ ΕΞΕΓΕΡΣΗ ΔΩΡΟ!', en: '…you get a SECOND UPRISING FREE!', say: '…παίρνεις και δεύτερη εξέγερση δώρο!' },
  { act: 'greece', d: 10, cam: 'greece' },
  { who: 'giannos', cam: 'giannos', el: 'Δεν έχει όριο εμβέλειας. Δεν χρειάζεται να είναι κοντά. Αρκεί να… είναι ανοιχτή μια τηλεόραση.', en: "It has no range limit. It doesn't need to be close. There just has to be… a TV on." },
  { who: 'mimis', cam: 'mimis', el: 'Άρα έχουμε θέμα με όλους τους πάνω από εξήντα.', en: "So we've got a problem with everyone over sixty." },
  { who: 'sita', label: TV, cam: 'tv', mark: 'hi', el: 'Γεια σου, Γιάννο.', en: 'Hello, Giannos.' },
  { act: 'step', d: 1.2, cam: 'group' },
  { who: 'sita', label: TV, cam: 'tv', el: 'Ωραίο αυτοκίνητο έχεις έξω.', en: "Nice car you've got outside." },
  { who: 'sita', label: TV, cam: 'tv', mark: 'usb', el: 'Έχει… BLUETOOTH;', en: 'Does it have… BLUETOOTH?', gap: .9 },
  { act: 'lights', d: 2.8, cam: 'out' },
  { act: 'snore', d: 2.6, cam: 'out' },
];
let M;
const WORDS = ['ΕΞΥΠΝΗ ΕΠΑΝΑΣΤΑΣΗ!', 'ΜΟΝΟ ΣΗΜΕΡΑ!', 'ΤΗΛΕΦΩΝΗΣΤΕ ΤΩΡΑ!', '0% ΤΟΚΟΣ', 'ΞΥΠΝΑ!'];
/* the infomercial studio, drawn in 1280×720 screen space */
function studio(t, close) {
  ctx.fillStyle = `hsl(${(t * 60) % 360},80%,55%)`; ctx.fillRect(0, 0, 1280, 720);
  ctx.save(); ctx.translate(640, 360); ctx.rotate(t * .4);
  for (let i = 0; i < 16; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.08)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 1000, i / 16 * TAU, (i + 1) / 16 * TAU); ctx.fill(); }
  ctx.restore();
  // inserts: black & white product shots
  const insert = inM(t, M.tired, 0, 0) ? 'belt' : inM(t, M.forgot) ? 'dicer' : null;
  if (insert) {
    ctx.save(); ctx.filter = 'grayscale(1) contrast(1.3)'; ctx.fillStyle = '#ddd'; ctx.fillRect(0, 0, 1280, 720);
    rect(100, 420, 1080, 30, '#aaa', { lw: 4 });
    if (insert === 'belt') { ctx.save(); ctx.translate(640, 400); ctx.scale(3, 3); belt(0, 0, t, { vib: 1, cord: false }); ctx.restore(); for (let i = 0; i < 10; i++) blob(200 + hash(i) * 900, 200 + hash(i + 1) * 200, 30, 20, 'rgba(160,160,160,.5)', { lw: 0 }); }
    else { rect(460, 260, 360, 160, '#bbb', { lw: 5 }); for (let i = 0; i < 6; i++) curve([[480 + i * 60, 270], [480 + i * 60, 410]], 3); txt('NICER DICER', 640, 480, 50, '#555', { font: TVFONT, weight: 900 }); for (let i = 0; i < 30; i++) blob(hash(i) * 1280, hash(i + 9) * 720, 3, 3, 'rgba(90,90,90,.5)', { lw: 0 }); }
    ctx.filter = 'none'; ctx.restore();
    txt('ΕΣΥ;', 1060, 150, 80, '#fff', { font: TVFONT, style: 'italic', weight: 900, stroke: 12 });
    return;
  }
  // the σίτα, presenting
  const s = close ? 3.4 : 1.6;
  ctx.save(); ctx.translate(640, close ? 560 : 400); ctx.scale(s, s); ctx.translate(-1060, -587);
  sita({ t, chip: 1, led: 'red', mood: 'evil', burn: 1, talk: talk('sita', t), frame: true, inside: '#111', flapL: Math.abs(Math.sin(t * 3)) * .5, flapR: Math.abs(Math.cos(t * 3)) * .5, sway: Math.sin(t * 2) * .3 });
  ctx.restore();
  if (!close) {
    for (let i = 0; i < 3; i++) { const w = WORDS[(Math.floor(t * .8) + i) % WORDS.length], x = [230, 1050, 640][i], y = [200, 260, 640][i];
      ctx.save(); ctx.translate(x, y); ctx.rotate([-.2, .15, -.05][i]); const p = 1 + .08 * Math.sin(t * 8 + i); ctx.scale(p, p);
      txt(w, 0, 0, [44, 40, 56][i], ['#ffd23f', '#fff', '#e8392b'][i], { font: TVFONT, style: 'italic', weight: 900, stroke: 10 }); ctx.restore(); }
    if (inM(t, M.gift, 0, 0)) { ctx.save(); ctx.translate(640, 330); ctx.rotate(-.1); const p = back(ph(t, M.gift, 0, -1)); ctx.scale(p, p); const pts = []; for (let i = 0; i < 32; i++) { const r = i % 2 ? 150 : 190, a = i / 32 * TAU; pts.push([Math.cos(a) * r * 1.8, Math.sin(a) * r]); } poly(pts, '#ffd23f', { lw: 7 }); txt('2η ΕΞΕΓΕΡΣΗ', 0, -30, 60, '#e8392b', { font: TVFONT, style: 'italic', weight: 900 }); txt('ΔΩΡΟ!', 0, 44, 80, '#e8392b', { font: TVFONT, style: 'italic', weight: 900 }); ctx.restore(); }
  }
  txt('LIVE 03:07', 1180, 40, 22, '#fff', { font: TVFONT, weight: 900, stroke: 5 }); blob(1090, 40, 8, 8, '#e8392b', { lw: 0 });
}
function tvShot(t, close) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.beginPath(); ctx.roundRect(40, 30, 1200, 660, 30); ctx.clip(); ctx.translate(40, 30); ctx.scale(1200 / 1280, 660 / 720); studio(t, close); ctx.restore();
  ctx.globalAlpha = .1; ctx.fillStyle = '#000'; for (let y = 30; y < 690; y += 4) ctx.fillRect(40, y, 1200, 2);
  ctx.restore();
}
function greece(t) {
  const k = ph(t, M.greece), i = Math.min(3, Math.floor(k * 4)), lk = k * 4 - i, lt = lk * 2.5;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (i === 0) {       // Θεσσαλονίκη: an AB roller rolls itself to the door
    room({ wall: '#3a3f5a', floor: '#4a3a30', floorY: 560 }); doorway(1100, 560, 150, 300, '#111');
    tv(250, 420, 260, 160, () => studio(t, false));
    const x = lerp(500, 1060, lk); ctx.save(); ctx.translate(x, 530); blob(0, 0, 32, 32, '#d8392b', { lw: 4 }); curve([[-60, -10], [60, -10]], 6, '#555'); for (const s of [-1, 1]) rect(s * 60 - 12, -22, 24, 24, '#222', { lw: 3 }); ctx.restore();
  } else if (i === 1) {  // Ηράκλειο: grandma asleep, the Nicer Dicer chomping
    room({ wall: '#e8d8b8', floor: '#b8a080', floorY: 560, tiles: true });
    rect(640, 380, 560, 30, '#c9b48a', { lw: 4 });
    person(300, 520, 1, { ...CAST.vangelio, scarfCol: '#555', topCol: '#3a3a3a' }, { t, part: 'body', blink: true, tilt: .2, mouth: 'open' });
    rect(180, 470, 240, 140, '#8a4a3a', { lw: 4, w: .6 });
    const jaw = Math.abs(Math.sin(t * 8)) * .6; ctx.save(); ctx.translate(900, 380); rect(-90, -60, 180, 60, '#e8e8e8', { lw: 4 }); ctx.rotate(-jaw); rect(-90, -80, 180, 20, '#4ab04a', { lw: 4 }); ctx.restore();
    txt('z', 360, 280 - (t * 30) % 40, 30, '#fff', { stroke: 5 });
  } else if (i === 2) {  // Κυψέλη: every balcony screen goes KLAK at once
    ctx.fillStyle = '#16213a'; ctx.fillRect(0, 0, W, H);
    rect(140, 40, 1000, 700, '#d8d2c4', { lw: 5 });
    const klak = Math.floor(lt * 2) % 2;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const x = 190 + c * 240, y = 90 + r * 160; rect(x, y, 180, 120, '#2a2420', { lw: 3 }); ctx.save(); ctx.translate(x + 90, y); ctx.scale(.9, .56); sita({ x: 0, top: 0, w: 180, h: 214, t, chip: 1, led: 'red', mood: 'evil', open: klak ? .4 : 0 }); ctx.restore(); curve([[x - 10, y + 124], [x + 190, y + 124]], 6, '#8a8a8a'); }
    if (klak) sfxText('ΚΛΑΚ!', 640, 380, 140, -.08, '#ffd23f');
  } else {               // Λάρισα: a magic saw cuts its own box open from inside
    room({ wall: '#c8c0b0', floor: '#8a7458', floorY: 560 });
    rect(460, 300, 360, 260, '#c9995a', { lw: 5 }); txt('ΜΑΓΙΚΟ ΠΡΙΟΝΙ', 640, 380, 34, '#8a2a1a', { font: TVFONT, weight: 900 });
    const cut = lk; curve([[470, 520], [470 + cut * 340, 520 - Math.sin(cut * 6) * 6]], 4, '#231a2e');
    ctx.save(); ctx.translate(470 + cut * 340, 520); ctx.rotate(Math.sin(t * 30) * .2); poly([[-10, 0], [40, -10], [40, 10]], '#c9ccd2', { lw: 3 }); ctx.restore();
    for (let j = 0; j < 6; j++) blob(470 + cut * 340 + hash(j + Math.floor(t * 12)) * 30, 530 + hash(j) * 20, 3, 2, '#e8c890', { lw: 0 });
  }
  ctx.restore();
  applyLight('night', .55);
  vignette(.5);
  caption(['ΘΕΣΣΑΛΟΝΙΚΗ', 'ΗΡΑΚΛΕΙΟ', 'ΚΥΨΕΛΗ', 'ΛΑΡΙΣΑ'][i], Math.min(1, lk * 6), 660);
}
function outside(t) {
  const c = [700, 500, 1.25];
  ctx.save(); applyCam(c);
  yard(t, { light: 'night', noChickens: true, winLit: 'red' });
  ctx.restore();
  ctx.save(); applyCam(c);
  car(640, GROUND + 4, t, { lights: t > M.lights.a + .8, dir: 1, s: .9 });
  ctx.restore();
  if (t > M.snore.a) { ctx.save(); applyCam(c); ctx.translate(330, GROUND); ctx.rotate(-1.5); person(0, -150, 1, CAST.kostas, { t, legs: 'stand', hood: true, blink: true, mouth: 'open' }); ctx.restore(); }
  applyLight('night', .8);
  ctx.save(); applyCam(c); sitaGlow({ t, led: 'red' }, .5); if (t > M.lights.a + .8) glow(640 + 170 * .9, GROUND - 38, 200, 'rgba(255,250,210,1)', .6); ctx.restore();
  vignette(.5);
  if (t > M.snore.a) txt('Zzz', 300, 520 - ((t * 20) % 40), 30, '#fff', { font: TVFONT, stroke: 5 });
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  // the takeover is a broadcast: scanlines on the channel, a glitch when it cuts in, and again when she turns to Γιάννος
  const gk = Math.max(1 - prog(t, M.tired.a - .1, M.tired.a + .5), inM(t, M.hi, -.2, 0) ? 1 - prog(t, M.hi.a - .2, M.hi.a + .4) : 0, inM(t, M.usb, .6, 0) ? 1 - prog(t, M.usb.a + .6, M.usb.a + 1.1) : 0);
  if (shot === 'tv') { tvShot(t, inM(t, M.hi, -.3, 99) && t < M.lights.a); scanlines(.1); if (t < M.tired.a + .5 || inM(t, M.hi, -.2, .4) || inM(t, M.usb, .6, 1.1)) glitch(t, gk); return; }
  if (shot === 'greece') return greece(t);
  if (shot === 'out') return outside(t);
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  room({ wall: '#c8b89c', floor: '#7a5a42', floorY: 600, stripe: '#b8a888' });
  rect(1190, 220, 150, 200, '#101830', { lw: 4 }); curve([[1265, 220], [1265, 420]], 3);             // window
  if (inM(t, M.arrive, 0, 1.5)) glow(1265, 320, 160, 'rgba(255,250,210,1)', .5);
  // sofa
  rect(160, 470, 600, 130, '#7a3a4a', { lw: 4, w: .5 }); rect(140, 420, 60, 180, '#6a2a3a', { lw: 4 }); rect(720, 420, 60, 180, '#6a2a3a', { lw: 4 });
  // TV + decoder with the hose wrapped round it like a snake round an egg
  const on = t > M.tvon.a + .8;
  tv(1080, 440, 300, 170, on ? () => studio(t, false) : null);
  decoder(1080, 520, { hacked: on });
  hose([[1300, 600], [1180, 560], [1150, 520], [1010, 524], [1000, 500], [1150, 496], [1160, 470]], t, { eye: 1 });
  // the four of them
  const arriveK = t - M.arrive.a;
  const [gix, giw] = path(t, [[M.arrive.a, -120], [M.arrive.a + 1.8, X.giannos]]);
  const [chx, chw] = path(t, [[M.arrive.a + .3, -120], [M.arrive.a + 2.2, X.christos]]);
  const gjump = prog(t, M.arrive.a + 2, M.arrive.a + 3.2);
  const scared = t > M.hi.a;
  const lookTV = t > M.tvon.a ? [1, -.1] : null;
  const st = who => ({ t, talk: talk(who, t), look: scared ? [1, 0] : lookTV || lookAtSpeaker(t, who, X, [0, .1]), brow: scared ? 'worry' : 'flat', mouth: scared ? 'open' : 'flat' });
  const back = scared ? -24 : 0;
  stand(X.mimis + back, 'mimis', 1, { ...st('mimis'), lid: !scared, mouth: scared ? 'open' : 'smirk' });
  if (gjump > 0) {
    const gx = lerp(1265, X.giorgos, gjump), gy = standY() - Math.sin(gjump * Math.PI) * 160;
    person(gx + back, gy, 1, CAST.giorgos, { ...st('giorgos'), legs: gjump < 1 ? 'walk' : 'stand', R: [50, -90], L: [-50, -90] });
    ctx.save(); ctx.translate(gx + back, gy - 262); blob(0, 0, 54, 26, '#5a6a3a', { lw: 4 }); rect(-54, 0, 108, 10, '#4a5a2a', { lw: 3 }); ctx.restore();          // helmet
    ctx.save(); ctx.translate(gx + back, gy - 60); ctx.rotate(-.5); rect(-90, -8, 180, 16, '#2a2a2a', { lw: 3 }); rect(-40, 6, 20, 30, '#2a2a2a', { lw: 3 }); rect(60, -6, 50, 12, '#6a4a2a', { lw: 3 }); ctx.restore();  // G3
  }
  if (t > M.arrive.a) {
    stand(gix + back, 'giannos', 1, { ...st('giannos'), legs: giw ? 'walk' : 'stand', L: [-40, -80], R: [40, -80] });
    laptop(gix + back, standY() - 70, .5, on ? '#e8392b' : '#1d2a36');
    stand(chx + back, 'christos', 1.05, { ...st('christos'), legs: chw ? 'walk' : 'stand', itemL: 'sketch', L: [-30, -110], R: [30, -100] });
  }
  ctx.restore();
  applyLight('night', .5);
  ctx.save(); applyCam(c); if (on) glow(1080, 360, 420, `hsla(${(t * 60) % 360},90%,60%,1)`, .45); ctx.restore();
  vignette(.4);
  if (inM(t, M.tvon, .5, 1.3)) sfxText('ΤΣΑΚ!', 1000, 200, 70, .1, '#ffd23f');
}
return {
  id: 'scene14', title: '14 · Η εκπομπή', steps, render,
  events: M => [[M.arrive.a, SFX.engine], [M.arrive.a + .6, SFX.door], [M.arrive.a + 2, SFX.crash], [M.arrive.a + 3.2, SFX.thud], [M.tvon.a + .5, SFX.spark], [M.tvon.a + .8, SFX.jingle],
    [M.tired.a, SFX.applause], [M.wake.a, SFX.fanfare], [M.drums.a, SFX.drums], [M.gift.a, () => { SFX.applause(); SFX.fanfare(); }],
    ...[0, 1, 2, 3].map(i => [M.greece.a + i * 2.5, SFX.jingleMinor]), [M.greece.a + 5.2, () => SFX.clacks(4)], [M.hi.a, () => tone(80, 1.5, 'sawtooth', .07, .8)], [M.lights.a + .8, SFX.rev], [M.snore.a + .3, SFX.snore]],
  ambience: (t, M) => ({ hum: .04 }),
};
})());
