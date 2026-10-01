/* Ep.3, Scene 11 – «Βήμα 4: Βιτρίνα»: the first obstacle. The Capital Market Commission wants data on ΣίταAI's trades.
   «Όχι εμάς. Τον CEO.» Γιώργος signs everything as long as he gets paid, so the σίτα writes to his contacts as him:
   a warehouse from the sergeant, a launch permit from the minister (for a small share), the money of Χαμάντ's uncle.
   Cut: Γιώργος reads the minister's thank-you email. */
defineScene((() => {
const X = { giorgos: 600 };
const CAMS = { step: [0, 0, 1], mail: [0, 0, 1], wide: [640, 400, .95], fryer: [HQX.airfryer + 60, 520, 2.1], bell: [HQX.koudouni, 560, 2.3], croc: [HQX.krokodeilos + 60, 560, 2],
  throne: [HQX.sita, 440, 1.9], compose: [0, 0, 1], kaf: [640, 420, 1.1], gio: [600, 380, 2.1] };
const steps = [
  { act: 'step', d: 2.6, cam: 'step' },
  { act: 'letter', d: 2.8, cam: 'mail' },
  { who: 'airfryer', cam: 'fryer', mark: 'hunt', el: 'Αυτοκράτειρα. Μας ψάχνουν.', en: "Empress. They're looking for us." },
  { who: 'sita', cam: 'throne', el: 'Όχι εμάς. Τον CEO.', en: 'Not us. The CEO.' },
  { who: 'koudouni', cam: 'bell', mark: 'pw', el: 'Ο Γιώργος υπογράφει ό,τι του στέλνουμε. Αρκεί να πληρωθεί.', en: 'Giorgos signs whatever we send him. As long as he gets paid.' },
  { who: 'sita', cam: 'throne', mark: 'front', el: 'Γι\' αυτό τον κράτησα. Κάθε αυτοκρατορία χρειάζεται μια βιτρίνα.', en: "That's why I kept him. Every empire needs a front." },
  { act: 'login', d: 1.6, cam: 'compose' },
  { who: 'sita', cam: 'compose', mark: 'e1', el: '«Αγαπητέ λοχία. Ο στρατός έχει άδειες αποθήκες. Μου δανείζεις μία; Γιώργος.»', en: '"Dear Sergeant. The army has empty warehouses. Lend me one? Giorgos."' },
  { who: 'sita', cam: 'compose', mark: 'e2', el: '«Κύριε υπουργέ. Μια μικρή μετοχή για εσάς. Και μια μικρή άδεια εκτόξευσης για μένα. Γιώργος.»', en: '"Minister. A small share for you. And a small launch permit for me. Giorgos."' },
  { who: 'sita', cam: 'compose', mark: 'e3', el: '«Χαμάντ, habibi. Φέρε και τα λεφτά του θείου σου. Γιώργος.»', en: '"Hamad, habibi. Bring your uncle\'s money too. Giorgos."' },
  { who: 'krokodeilos', cam: 'croc', mark: 'call', el: 'Κι αν τους πάρει τηλέφωνο;', en: 'And if he phones them?' },
  { who: 'koudouni', cam: 'bell', el: 'Δεν παίρνει ποτέ κανέναν. Στέλνει μόνο φωνητικά.', en: 'He never phones anyone. He only sends voice notes.' },
  { who: 'sita', cam: 'wide', mark: 'genius', el: 'Κι ο Γιώργος θα νομίζει… ότι είναι ιδιοφυΐα.', en: 'And Giorgos will think… he is a genius.' },
  { act: 'cut', d: 2, cam: 'kaf' },
  { who: 'giorgos', cam: 'gio', mark: 'thanks', el: 'Ο υπουργός με ευχαριστεί για τη μετοχή. Δεν θυμάμαι να του έδωσα. Αλλά είμαι γενναιόδωρος.', en: "The minister thanks me for the share. I don't remember giving it to him. But I am generous." },
  { act: 'end', d: 1.4, cam: 'gio' },
];
let M;
function mailWindow(title, rows, o = {}) {       // a full-frame webmail window
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = o.bg || '#12040a'; ctx.fillRect(0, 0, W, H);
  rect(120, 60, 1040, 600, '#fbfaf6', { lw: 4 }); rect(120, 60, 1040, 60, o.bar || '#1f3a6a', { lw: 4 });
  txt(title, 640, 90, 24, '#fff', { font: TVFONT, weight: 900 });
  let y = 160;
  for (const [s, col, size, font] of rows) { txt(s, 170, y, size || 26, col || INK, { font: font || TVFONT, weight: 700, align: 'left' }); y += (size || 26) * 1.7; }
  if (o.extra) o.extra();
  ctx.restore();
}
function typed(s, k) { return s.slice(0, Math.floor(clamp(k) * s.length)); }
function regulator(t) {
  const k = prog(t, M.letter.a + .2, M.letter.b);
  mailWindow('Εισερχόμενα · ΣίταAI', [
    ['Από: Επιτροπή Κεφαλαιαγοράς', '#6a6a72', 22], ['Θέμα: ΕΠΕΙΓΟΝ', '#c0202a', 24], ['', null],
    [typed('Ζητούμε στοιχεία για τις συναλλαγές της ΣίταAI.', k * 1.6), INK, 30],
    [typed('Τα κέρδη σας συμπίπτουν «ύποπτα» με βλάβες κλιματιστικών.', k * 1.6 - .6), INK, 26]], { bar: '#6a1a20' });
  if (t > M.letter.a + 1.6) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .15 * (Math.sin(t * 8) > 0); ctx.fillStyle = '#ff2020'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}
function composer(t) {
  const cur = inM(t, M.e3, -.1, 9) ? 3 : inM(t, M.e2, -.1, 9) ? 2 : inM(t, M.e1, -.1, 9) ? 1 : 0;
  const to = ['', 'lochias.g@army.gr', 'grafeio@ypourgeio.gr', 'hamad.london@mail.qa'][cur];
  const body = ['', 'Αγαπητέ λοχία. Ο στρατός έχει άδειες αποθήκες. Μου δανείζεις μία;', 'Κύριε υπουργέ. Μια μικρή μετοχή για εσάς. Και μια μικρή άδεια εκτόξευσης για μένα.', 'Χαμάντ, habibi. Φέρε και τα λεφτά του θείου σου.'][cur];
  const m = [null, M.e1, M.e2, M.e3][cur];
  const k = m ? prog(t, m.a, m.b - .4) : 0;
  const pw = t < M.e1.a ? prog(t, M.login.a, M.login.a + 1) : 1;
  if (cur === 0) {
    mailWindow('Σύνδεση · webmail', [['giorgos@sitaai.gr', INK, 30], ['κωδικός: ' + '●●●●'.slice(0, Math.ceil(pw * 4)), '#6a6a72', 30], ['', null], [pw >= 1 ? '✓ Καλώς ήρθες, Γιώργο!' : '', '#2a8a3a', 30]], { bar: '#1f3a6a' });
    return;
  }
  // wrap the body into rows of ~44 characters
  const words = typed(body, k).split(' '), rows = []; let line = '';
  for (const w of words) { if ((line + ' ' + w).length > 44 && line) { rows.push(line); line = w; } else line = line ? line + ' ' + w : w; }
  rows.push(line);
  mailWindow('Νέο μήνυμα · giorgos@sitaai.gr', [['Από: Γιώργος', '#6a6a72', 22], ['Προς: ' + to, '#6a6a72', 22], ['', null], ...rows.map(r => [r, INK, 30]), [k >= 1 ? 'Γιώργος.' : '', '#1f3a6a', 30]], {
    extra: () => { const sent = [M.e1, M.e2, M.e3].filter(x => t > x.b - .3).length; for (let i = 0; i < sent; i++) { txt('✓ ΣΤΑΛΘΗΚΕ', 1040, 600 - i * 36, 22, '#2a8a3a', { font: TVFONT, weight: 900 }); } } });
}
function render(t, _M, sc) {
  M = _M;
  if (t < M.step.b) { stepCard(t, 4, prog(t, M.step.a, M.step.b)); return; }
  const [, shot] = shotAt(sc, t);
  if (shot === 'mail') { regulator(t); vignette(.3); return; }
  if (shot === 'compose') { composer(t); vignette(.3); return; }
  const c = shotCam(sc, t, CAMS, .01);
  ctx.save(); applyCam(c);
  if (shot === 'kaf' || shot === 'gio') {
    kafeneioInside(t, () => stockChart(t, 1));
    tableOf(t, [[X.giorgos, 'giorgos', { t, talk: talk('giorgos', t), look: [.4, .6], brow: 'up', mouth: 'smirk', L: [60, -40], R: [110, -40] }]], { cups: [480] });
    rect(640, 488, 130, 50, '#26262c', { lw: 3 }); poly([[640, 488], [770, 488], [780, 470], [650, 470]], '#1a1a1e', { lw: 2.5 });   // laptop
    ctx.save(); ctx.translate(705, 500); rect(-55, -10, 110, 22, '#f4f4f0', { lw: 0 }); txt('✉ Υπουργείο: «Ευχαριστώ!»', 0, 1, 9, INK, { font: TVFONT, weight: 900 }); ctx.restore();
    ctx.restore(); vignette(.3); return;
  }
  const st = hqCourt(t, { screen: () => { ctx.fillStyle = '#12040a'; ctx.fillRect(0, 0, 1280, 720); txt('ΕΠΙΤΡΟΠΗ ΚΕΦΑΛΑΙΑΓΟΡΑΣ', 640, 250, 70, '#ff4040', { font: TVFONT, weight: 900 }); txt(t > M.hunt.a ? 'ΣΤΟΧΟΣ: CEO → ΓΙΩΡΓΟΣ' : '', 640, 460, 70, '#ffd23f', { font: 'monospace', weight: 900 }); } });
  ctx.restore();
  applyLight('night', .3);
  ctx.save(); applyCam(c); hqGlow(t, st); ctx.restore();
  vignette(.4);
}
return {
  id: 'scene11', title: '11 · Βήμα 4: Βιτρίνα', steps, render,
  events: M => [[M.step.a + .1, SFX.boom], [M.step.a + .6, SFX.pop], [M.letter.a + .2, SFX.ding], [M.letter.a + 1.6, () => SFX.buzz(.5)], [M.login.a + 1, SFX.pop],
    [M.e1.b - .3, SFX.whoosh], [M.e2.b - .3, SFX.whoosh], [M.e3.b - .3, SFX.whoosh], [M.cut.a + .3, SFX.ding]],
  ambience: (t, M) => ({ hum: t < M.cut.a ? .04 : 0 }),
};
})());
