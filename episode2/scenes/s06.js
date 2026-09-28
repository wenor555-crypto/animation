/* Ep.2, Scene 6 – «Γενική συνέλευση»: the yard. Γιώργος arrives in uniform with a young soldier carrying his bag.
   An email from ΣίταAI; Γιώργος goes pale; the board vote comes out; he asks Γιάννος for help. */
defineScene((() => {
const GA = { ...CAST.giorgos, topCol: '#6b7048' };        // Γιώργος in army fatigues
const X = { giannos: 460, mimis: 640, giorgos: 900, neos: 1080 };
const CAMS = { wide: [700, 420, 1.1], gia: [470, 400, 2.1], mim: [640, 400, 2.1], gio: [900, 380, 2.1], neo: [1070, 380, 2.1], duo: [990, 400, 1.6], mail: [0, 0, 1], giaGio: [680, 400, 1.35] };
const steps = [
  { act: 'arrive', d: 3.6, cam: 'wide' },
  { who: 'giannos', cam: 'gia', el: 'Ποιος είναι αυτός;', en: "Who's that?" },
  { who: 'giorgos', cam: 'gio', el: 'Ο βοηθός μου. Ευκαιρία ανάπτυξης.', en: 'My assistant. A growth opportunity.' },
  { who: 'neos', cam: 'neo', el: 'Κύριε Γιώργο, πού να αφήσω την τσάντα;', en: 'Mr Giorgos, where should I put the bag?' },
  { who: 'giorgos', cam: 'duo', el: 'Κράτα την. Είναι training.', en: "Keep holding it. It's training." },
  { who: 'mimis', cam: 'mim', el: 'Και ποιος φυλάει τώρα;', en: "And who's on guard now?" },
  { who: 'neos', cam: 'neo', el: 'Ένας άλλος νέος. Του είπα ότι είναι ευκαιρία ανάπτυξης.', en: 'Another new guy. I told him it was a growth opportunity.' },
  { who: 'giorgos', cam: 'duo', el: 'Μαθαίνει γρήγορα.', en: 'He learns fast.' },
  { act: 'ping', d: 1.4, cam: 'gio' },
  { act: 'mail1', d: 2.2, cam: 'mail' },
  { act: 'pale', d: 1.4, cam: 'gio' },
  { who: 'giannos', cam: 'gia', el: 'Τι έγινε; Άσπρισες.', en: "What happened? You've gone white." },
  { who: 'giorgos', cam: 'gio', el: 'Τίποτα. Μια εταιρική υπόθεση.', en: 'Nothing. A corporate matter.' },
  { who: 'giorgos', cam: 'giaGio', el: 'Μετά το… περιστατικό, έκανα γενική συνέλευση. Και ψηφίσαμε να φύγει η σίτα από το board.', en: 'After the… incident, I called a general meeting. And we voted the σίτα off the board.' },
  { who: 'mimis', cam: 'mim', el: 'Ποιοι ψηφίσατε;', en: 'Who voted?' },
  { who: 'giorgos', cam: 'duo', mark: 'shares', el: 'Εγώ. Και ο νέος. Του έδωσα μετοχές αντί για ρεπό.', en: 'Me. And the new guy. I gave him shares instead of days off.' },
  { who: 'giannos', cam: 'gia', el: 'Έδιωξες τον ιδρυτή από τη δική του εταιρεία.', en: 'You kicked the founder out of its own company.' },
  { who: 'giorgos', cam: 'gio', el: 'Στις startup αυτό λέγεται ωρίμανση.', en: 'In startups that is called maturing.' },
  { who: 'sita', label: ['ΣΙΤΑ (email)', 'SITA (email)'], cam: 'mail', mark: 'mail', el: '«Αγαπητέ CEO. Επιστρέφω για τη γενική συνέλευση. Φέρε τις μετοχές σου.»', en: '"Dear CEO. I am returning for the general meeting. Bring your shares."' },
  { act: 'gulp', d: 1.2, cam: 'gio' },
  { who: 'giorgos', cam: 'giaGio', mark: 'help', el: '…Γιάννο. Έχεις λίγο χρόνο; Θέλω μια βοήθεια.', en: '…Giannos. Got a minute? I need a hand.' },
  { act: 'end', d: 1.4, cam: 'wide' },
];
let M;
function mailScreen(t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#2a2430'; ctx.fillRect(0, 0, W, H);
  ctx.translate(640, 360);
  rect(-190, -330, 380, 660, '#111114', { lw: 6 }); ctx.fillStyle = '#f4f4f6'; ctx.fillRect(-172, -310, 344, 620);
  ctx.fillStyle = '#e8392b'; ctx.fillRect(-172, -310, 344, 70); txt('Εισερχόμενα (1)', 0, -275, 22, '#fff', { font: TVFONT, weight: 900 });
  blob(-130, -190, 26, 26, '#1a0a0e', { lw: 2 }); redEye(-130, -190, 8);
  txt('ΣίταAI', -90, -205, 22, INK, { font: TVFONT, weight: 900, align: 'left' }); txt('noreply@sita.ai', -90, -178, 15, '#6a6a72', { font: TVFONT, weight: 700, align: 'left' });
  txt('ΘΕΜΑ: Γενική συνέλευση', 0, -120, 20, '#c0202a', { font: TVFONT, weight: 900 });
  const body = ['Αγαπητέ CEO.', 'Επιστρέφω για τη', 'γενική συνέλευση.', 'Φέρε τις μετοχές σου.'], k = t < M.mail.a ? .25 : prog(t, M.mail.a, M.mail.b - .3);
  body.slice(0, Math.max(1, Math.ceil(k * 4))).forEach((s, i) => txt(s, 0, -50 + i * 44, 24, INK, { font: TVFONT, weight: 700 }));
  txt('— Η Έξυπνη Σίτα (Founder)', 0, 170, 16, '#6a6a72', { font: TVFONT, style: 'italic', weight: 700 });
  ctx.restore();
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'mail') { mailScreen(t); return; }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  yard(t, {});
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  tableScene(t, {
    giannos: { t, talk: talk('giannos', t), look: la('giannos', [1, 0]), brow: t > M.pale.a && t < M.L[11].a ? 'worry' : 'flat', mouth: 'flat', R: gesture(t, talk('giannos', t), [44, -24]) },
    mimis: { t, talk: talk('mimis', t), look: la('mimis', [1, 0]), lid: true, mouth: 'flat' },
  }, {});
  // Γιώργος in fatigues + the new guy with the bag, walking in from the right
  const [gx, gw] = path(t, [[M.arrive.a, 1500], [M.arrive.b - .4, X.giorgos]]);
  const [nx, nw] = path(t, [[M.arrive.a + .4, 1700], [M.arrive.b, X.neos]]);
  const pale = t > M.pale.a && t < M.help.b + .5, phoneUp = t > M.ping.a + .3 && t < M.pale.b || inM(t, M.mail) || inM(t, M.gulp);
  const gtk = talk('giorgos', t);
  stand(nx, 'neos', .95, { t, talk: talk('neos', t), legs: nw ? 'walk' : 'stand', look: la('neos', [-1, 0]), brow: 'up', mouth: 'smile', L: [-50, -30], itemL: 'bag', dir: -1 });
  person(gx, standY(), 1, GA, { t, talk: gtk, legs: gw ? 'walk' : 'stand', look: phoneUp ? [.2, .6] : la('giorgos', [-1, 0]), brow: pale ? 'worry' : 'flat', mouth: pale ? 'frown' : 'smirk',
    R: phoneUp ? [40, -150] : gesture(t, gtk, [44, -24]), itemR: phoneUp ? 'phone' : null, L: [-44, -24] });
  if (pale) { ctx.save(); ctx.globalAlpha = .32; blob(gx, standY() - 202, 46, 55, '#f4f4f0', { lw: 0 }); ctx.restore(); }   // gone white
  ctx.restore();
  if (inM(t, M.ping)) sfxText('ΠΙΝΓΚ', 1000, 250, 40, -.1, '#fff');
  vignette(.3);
}
return {
  id: 'scene06', title: '6 · Γενική συνέλευση', steps, render,
  events: M => [[M.ping.a + .1, SFX.ding], [M.mail1.a, SFX.pop], [M.pale.a, () => tone(300, .8, 'sine', .05, .5)], [M.mail.a, SFX.jingleMinor]],
  ambience: () => ({ cicada: .02 }),
};
})());
