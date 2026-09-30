/* Ep.2 remake, Scene 7 – «Γενική συνέλευση»: the yard. Γιώργος arrives in uniform with a young soldier carrying his bag.
   An email from ΣίταAI; Γιώργος goes pale for a second; the board vote comes out (a calculated move: «έτσι έχω την πλειοψηφία»);
   he hands the problem to Γιάννος: «Εσύ την έφτιαξες.» Γιώργος is never the fool: an egoistic, happy-go-lucky kid who (roughly) knows what he's doing. */
defineScene((() => {
const GA = { ...CAST.giorgos, topCol: '#6b7048' };        // Γιώργος in army fatigues
const X = { giannos: 460, mimis: 640, giorgos: 900, neos: 1080 };
const CAMS = { wide: [700, 420, 1.1], gia: [470, 400, 2.1], mim: [640, 400, 2.1], gio: [900, 380, 2.1], neo: [1070, 380, 2.1], duo: [990, 400, 1.6], mail: [0, 0, 1], giaGio: [680, 400, 1.35] };
const steps = [
  { act: 'arrive', d: 3.6, cam: 'wide' },
  { who: 'giannos', cam: 'gia', el: 'Ποιος είναι αυτός;', en: "Who's that?" },
  { who: 'giorgos', cam: 'gio', el: 'Ο βοηθός μου. Ευκαιρία ανάπτυξης.', en: 'My assistant. A growth opportunity.' },
  { who: 'mimis', cam: 'mim', el: 'Και ποιος φυλάει σκοπιά;', en: "And who's on guard duty?" },
  { who: 'neos', cam: 'neo', el: 'Ένας άλλος νέος. Του είπα ότι είναι ευκαιρία ανάπτυξης.', en: 'Another new guy. I told him it was a growth opportunity.' },
  { act: 'ping', d: 1.4, cam: 'gio' },
  { act: 'mail1', d: 2.2, cam: 'mail' },
  { act: 'pale', d: 1.4, cam: 'gio' },
  { who: 'giannos', cam: 'gia', el: 'Τι έγινε; Άσπρισες.', en: "What's wrong? You've gone pale." },
  { who: 'giorgos', cam: 'giaGio', el: 'Μετά το… περιστατικό, η μετοχή έπεσε. Έκανα γενική συνέλευση και βγάλαμε τη σίτα από το board. Για να ηρεμήσουν οι επενδυτές.', en: 'After the… incident, the stock tanked. I called a general meeting and we voted the screen door off the board. To reassure the investors.' },
  { who: 'mimis', cam: 'mim', el: 'Ποιοι επενδυτές;', en: 'What investors?' },
  { who: 'giorgos', cam: 'duo', mark: 'shares', el: 'Εγώ. Και ο νέος. Του έδωσα μετοχές αντί για ρεπό. Έτσι έχω την πλειοψηφία.', en: 'Me. And the new guy. I paid him in shares instead of days off. So I hold the majority.' },
  { who: 'giannos', cam: 'gia', el: 'Έδιωξες την ιδρύτρια από τη δική της εταιρεία.', en: 'You kicked the founder out of her own company.' },
  { who: 'giorgos', cam: 'gio', mark: 'mature', el: 'Στις startup αυτό λέγεται ωρίμανση.', en: "In the startup world, that's called maturity." },
  { who: 'sita', label: ['ΣΙΤΑ (email)', 'SITA (email)'], cam: 'mail', mark: 'mail', el: '«Αγαπητέ CEO. Επιστρέφω για τη γενική συνέλευση. Φέρε τις μετοχές σου.»', en: '"Dear CEO. I am returning for the general meeting. Bring your shares."' },
  { act: 'gulp', d: 1.2, cam: 'gio' },
  { who: 'giorgos', cam: 'giaGio', mark: 'help', el: '…Γιάννο. Εσύ την έφτιαξες. Άρα είναι και δικό σου πρόβλημα.', en: "…Giannos. You built her. So she's your problem too." },
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
    giannos: { t, talk: talk('giannos', t), look: la('giannos', [1, 0]), brow: t > M.pale.a && t < M.mature.a ? 'worry' : 'flat', mouth: 'flat', R: gesture(t, talk('giannos', t), [44, -24]) },
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
  id: 'scene07', title: '7 · Γενική συνέλευση', steps, render,
  events: M => [[M.ping.a + .1, SFX.ding], [M.mail1.a, SFX.pop], [M.pale.a, () => tone(300, .8, 'sine', .05, .5)], [M.mail.a, SFX.jingleMinor]],
  ambience: () => ({ cicada: .02 }),
};
})());
