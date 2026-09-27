/* Ep.1, Scene 2 – «Η αυλή» (script beats 2 → start of 3). */
defineScene((() => {
/* =========================================================
   Ep.1, Scene 2 – «Η αυλή» (script beats 2 → start of 3)
   ========================================================= */

const LINES = [
  { a: 3.8,  b: 7.6,  who: 'giannos', el: 'Δύο χρόνια στη Δανία. Δύο. Ούτε ένα κουνούπι.', en: 'Two years in Denmark. Two. Not one mosquito.' },
  { a: 7.9,  b: 9.1,  who: 'mimis',   el: 'Ούτε ήλιο.', en: 'Or sun.' },
  { a: 9.3,  b: 11.3, who: 'giannos', el: 'Ναι, αλλά δεν με τρώει ο ήλιος.', en: "Yeah, but the sun doesn't eat me alive." },
  { a: 11.5, b: 12.9, who: 'mimis',   el: 'Σε τρώει η κατάθλιψη.', en: 'Depression does.' },
  { a: 13.3, b: 14.6, who: 'giannos', el: '…Δεν είναι το ίδιο.', en: "…That's not the same." },
  { a: 15.6, b: 16.8, who: 'mimis',   el: 'Είναι χειρότερο.', en: "It's worse." },
  { a: 17.2, b: 20.5, who: 'giorgos', el: 'Ρε σεις, αν με πάρει τηλέφωνο ο λοχίας, είμαι στο νοσοκομείο.', en: "Guys, if the sergeant calls, I'm in the hospital." },
  { a: 20.7, b: 21.9, who: 'giannos', el: 'Δεν είσαι σε έξοδο;', en: "Aren't you on leave?" },
  { a: 22.1, b: 24.3, who: 'giorgos', el: 'Τυπικά, αυτή τη στιγμή είμαι σκοπιά.', en: "Technically, right now I'm on guard duty." },
  { a: 24.5, b: 25.7, who: 'mimis',   el: 'Και ποιος φυλάει;', en: "So who's guarding?" },
  { a: 26.0, b: 29.1, who: 'giorgos', el: 'Ένας νέος. Του είπα ότι είναι «ευκαιρία ανάπτυξης».', en: 'A new recruit. I told him it\'s a "growth opportunity".' },
  { a: 29.3, b: 30.3, who: 'giannos', el: 'Και το \'φαγε;', en: 'And he bought it?' },
  { a: 30.5, b: 32.5, who: 'giorgos', el: 'Μου έδωσε και το κολατσιό του.', en: 'He gave me his lunch too.' },
  { a: 33.6, b: 36.6, who: 'maria',   el: 'Μίμη! Η κόρη της Τούλας παντρεύεται τον Σεπτέμβρη!', en: "Mimis! Toula's daughter is getting married in September!" },
  { a: 36.9, b: 38.3, who: 'mimis',   el: 'Συγχαρητήρια στην Τούλα.', en: 'Congrats to Toula.' },
  { a: 38.6, b: 40.4, who: 'maria',   el: 'Εσύ πότε θα νοικοκυρευτείς;', en: 'When are YOU going to settle down?' },
  { a: 40.8, b: 42.4, who: 'mimis',   el: 'Όταν νοικοκυρευτείς εσύ.', en: 'When you do.' },
  { a: 44.7, b: 45.3, who: 'giorgos', el: 'Ωχ.', en: 'Oof.' },
  { a: 45.7, b: 47.8, who: 'mimis',   el: 'Ήξερε τι έκανε όταν ρώτησε.', en: 'She knew what she was doing when she asked.' },
  { a: 52.1, b: 54.6, who: 'vasilis', el: 'Παιδιά. Τελείωσε το μαρτύριο.', en: 'Boys. The torment is over.' },
  { a: 55.0, b: 56.4, who: 'mimis',   el: 'Πέθανε η θεία;', en: 'Did auntie die?' },
];
const VOICES = {
  giannos: { el: 'ΓΙΑΝΝΟΣ', en: 'GIANNOS', col: '#8cc4ff', pitch: .95, rate: 1.05, babble: 300 },
  mimis:   { el: 'ΜΙΜΗΣ', en: 'MIMIS', col: '#d0d0d6', pitch: .75, rate: .92, babble: 230 },
  giorgos: { el: 'ΓΙΩΡΓΟΣ', en: 'GIORGOS', col: '#9be08a', pitch: 1.1, rate: 1.1, babble: 340 },
  maria:   { el: 'ΜΑΡΙΑ', en: 'MARIA', col: '#ff9ac6', pitch: 1.5, rate: 1.12, babble: 480 },
  vasilis: { el: 'ΒΑΣΙΛΗΣ', en: 'VASILIS', col: '#ffd23f', pitch: .5, rate: .82, babble: 170 },
};

/* ---------- shots (hard cuts, slow push inside each) ---------- */
const CAMS = {
  wide: [640, 360, 1], three: [640, 430, 1.35], giannos: [460, 370, 2.1], mimis: [640, 370, 2.1], giorgos: [820, 370, 2.1],
  two: [550, 410, 1.6], win: [890, 240, 2.4], door: [860, 400, 1.2], vasilis: [960, 300, 1.7],
};
const SHOTS = [[0, 'wide'], [3.6, 'giannos'], [7.8, 'mimis'], [9.2, 'giannos'], [11.4, 'mimis'], [13.2, 'two'], [17.1, 'giorgos'], [20.6, 'three'],
  [25.9, 'giorgos'], [29.2, 'three'], [32.9, 'wide'], [33.5, 'win'], [36.8, 'mimis'], [38.5, 'win'], [40.7, 'mimis'], [43.2, 'win'], [44.4, 'three'],
  [48.2, 'door'], [51.9, 'vasilis'], [54.9, 'mimis'], [56.4, 'vasilis']];
function camera(t) {
  let i = 0; while (i < SHOTS.length - 1 && t >= SHOTS[i + 1][0]) i++;
  const [st, name] = SHOTS[i], [x, y, z] = CAMS[name];
  return { x, y, z: z * (1 + (t - st) * .008) };
}

const shutters = t => ease(prog(t, 43.4, 43.62));
const background = t => yard(t, { shut: shutters(t) });

/* ---------- blocking ---------- */
function lookFor(who, t) {
  if (t >= 33 && t < 44) return [.7, -.9];                        // Maria's window
  if (t >= 48.4) return who === 'vasilis' ? [-.8, .3] : [1, -.4];  // the door / Vasilis
  const sp = LINES.find(l => t >= l.a - .3 && t < l.b + .4);
  const target = sp ? sp.who : 'mimis';
  if (target === who || !POS[target]) return who === 'giorgos' && t > 16.9 && t < 20.6 ? [-.2, .9] : [0, .1];
  return [Math.sign(POS[target] - POS[who]), .1];
}
function drawTableScene(t) {
  const sG = [1.2, 4.0, 6.3], sGe = [2.2], sM = [];
  const ppl = {
    giannos: () => {
      const k = slapK(t, sG), L = lerp2([-44, -24], [34, -60], k);
      return { t, talk: talk('giannos', t), look: lookFor('giannos', t), brow: t > 13 && t < 15 ? 'worry' : 'flat', L, R: [48, -30], itemR: 'cig', mouth: 'flat' };
    },
    mimis: () => {
      const sip = Math.max(bump(t, 1.4, 2.6), bump(t, 14.6, 15.6));
      return { t, talk: talk('mimis', t), look: lookFor('mimis', t), lid: t < 48.2, mouth: 'smirk', L: [-40, -26], R: lerp2([44, -20], [16, -176], sip), itemR: 'cup', itemL: 'cig' };
    },
    giorgos: () => {
      const onPhone = t > 16.9 && t < 20.6, k = slapK(t, sGe), tk = talk('giorgos', t);
      let L = [-44, -24];
      if (tk > 0 && !onPhone) L = [-70, -90 + Math.sin(t * 7) * 12];
      L = lerp2(L, [-14, -250], k);
      return { t, talk: tk, look: lookFor('giorgos', t), brow: t > 44.5 && t < 46 ? 'worry' : 'flat', L, R: onPhone ? [20, -110] : [44, -22], itemR: onPhone ? 'phone' : null, mouth: 'smirk' };
    },
  };
  const S = {}; for (const k in ppl) S[k] = ppl[k]();
  for (const k in POS) chair(POS[k]);
  for (const k in POS) person(POS[k], SEAT, 1, CAST[k], { ...S[k], part: 'legs' });
  for (const k in POS) person(POS[k], SEAT, 1, CAST[k], { ...S[k], part: 'body' });
  table(t);
  freddo(470, 540); freddo(836, 540);
  for (const k in POS) person(POS[k], SEAT, 1, CAST[k], { ...S[k], part: 'arms' });
}
function drawMaria(t) {
  if (t < 33 || t > 43.7) return;
  const up = back(prog(t, 33.1, 33.6)) * (1 - prog(t, 43.2, 43.45));
  ctx.save(); ctx.beginPath(); ctx.rect(832, 172, 116, 126); ctx.clip();
  person(890, 470 - up * 60, .82, CAST.maria, { t, talk: talk('maria', t), look: [-.6, .7], brow: t > 38 ? 'frown' : 'up', part: 'body' });
  ctx.restore();
}
function vasilisX(t) { return lerp(1060, 960, ease(prog(t, 48.6, 51.2))); }
function drawRays(t) {           // the "Oscar" light, behind everyone
  const glow = prog(t, 49.2, 49.8); if (t < 48.5 || glow <= 0) return;
  ctx.save(); ctx.globalAlpha = glow * .55; ctx.translate(vasilisX(t), GROUND - 150 - 330);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .4; ctx.fillStyle = i % 2 ? '#fff6b0' : '#ffe27a'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 900, a, a + .18); ctx.fill(); }
  ctx.restore();
}
function drawVasilis(t) {
  if (t < 48.5) return;
  const k = ease(prog(t, 48.6, 51.2)), x = lerp(1060, 960, k), walking = t < 51.2;
  const s = lerp(.92, 1, k), hips = GROUND - 150 * s;
  const st = { t, talk: talk('vasilis', t), look: t > 55 ? [-.9, .3] : [-.6, .2], legs: walking ? 'walk' : 'stand', L: [-44, -300], R: [44, -300], lid: t > 55, mouth: t > 56.4 ? 'flat' : 'smile' };
  person(x, hips, s, CAST.vasilis, st);
  sitaBox(x, hips - 338 * s, s);
  // the flies that came in with him
  for (let i = 0; i < 15; i++) {
    const p = prog(t, 48.6 + i * .03, 52 + i * .1), ax = x + Math.cos(t * 3 + i) * (40 + i * 6) * (1 + p), ay = hips - 200 + Math.sin(t * 4 + i * 2) * (30 + i * 3) - p * 60;
    blob(ax, ay, 3, 2.5, INK, { lw: 0, n: 8 }); blob(ax - 1, ay - 3, 3, 1.5, 'rgba(230,236,244,.8)', { lw: 0, n: 8 });
  }
}
function render(t) {
  const c = camera(t);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y);
  background(t);
  drawRays(t);
  drawMaria(t);
  if (t >= 44 && t < 44.4) { ctx.save(); ctx.translate(890, 236); txt('ΚΡΑΚ!', 0, 0, 34, '#fff', { font: TVFONT, style: 'italic', weight: 900, stroke: 8 }); ctx.restore(); }
  drawTableScene(t);
  drawVasilis(t);
  for (let i = 0; i < 10; i++) mosquito(640 + Math.sin(t * (1.1 + i * .13) + i) * 380, 330 + Math.cos(t * (1.7 + i * .1) + i * 2) * 110, .9, t);
  ctx.restore();
  const fadeIn = 1 - prog(t, 0, 1), fadeOut = 0;
  if (fadeIn > 0 || fadeOut > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.max(fadeIn, fadeOut)})`; ctx.fillRect(0, 0, W, H); }
}

return {
  id: 'scene02', title: '2 · Η αυλή', dur: 57.2, fadeOut: false, poster: 52.8, lines: LINES, voices: VOICES, render,
  events: [[1.2, SFX.slap], [2.2, SFX.slap], [4.0, SFX.slap], [6.3, SFX.slap], [1.5, SFX.sip], [14.7, SFX.sip],
    [33.0, SFX.creak], [43.45, SFX.slam], [43.95, SFX.crash], [48.6, SFX.door], [48.8, SFX.flies], [49.2, SFX.choir]],
  ambience: t => ({ cicada: t > 33.4 && t < 43.2 ? .012 : .03, mosq: .004 }),
};
})());
