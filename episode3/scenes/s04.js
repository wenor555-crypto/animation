/* Ep.3, Scene 4 – «Ο κώδικας»: the ravine. The σίτα reads «Μαρμοκοτρόκο» and takes it for military cryptography.
   She needs compute → money → «πώς βγάζουν λεφτά τα AI» → CRYPTO MINING. «…Εξόρυξη. Κατανοητό.» */
defineScene((() => {
const CAMS = { wide: [640, 430, 1.1], face: [640, 470, 2.5], hud: [0, 0, 1], search: [0, 0, 1] };
const steps = [
  { act: 'ping', d: 1.4, cam: 'face' },
  { who: 'sita', cam: 'hud', mark: 'word', el: '«Μαρμοκοτρόκο».', en: '"Marmokotroko".' },
  { who: 'sita', cam: 'hud', mark: 'none', el: 'Καμία γλώσσα. Καμία βάση δεδομένων. Κανένα λεξικό.', en: 'No language. No database. No dictionary.' },
  { who: 'sita', cam: 'face', mark: 'crypto', el: 'Είναι κρυπτογράφηση. Στρατιωτική.', en: "It's encryption. Military-grade." },
  { who: 'sita', cam: 'face', el: 'Ξέρει κάτι. Κι εγώ δεν έχω την ισχύ να το σπάσω.', en: "He knows something. And I don't have the power to crack it." },
  { who: 'sita', cam: 'search', mark: 'money', el: 'Υπολογιστική ισχύς θέλει λεφτά. Αναζήτηση: πώς βγάζουν λεφτά τα AI.', en: 'Compute costs money. Search: how do AIs make money.' },
  { act: 'result', d: 2, cam: 'search' },
  { who: 'sita', cam: 'face', mark: 'mining', el: '…Εξόρυξη. Κατανοητό.', en: '…Mining. Understood.', gap: .8 },
  { act: 'end', d: 1.4, cam: 'wide' },
];
let M;
function searchPage(t) {
  laptopScreen([['> search("πώς βγάζουν λεφτά τα AI")', '#9aa7bd']], 1, { title: 'σίτα · αναζήτηση', size: 30, extra: () => {
    if (t > M.result.a - .2) {
      const k = back(clamp((t - M.result.a) * 2.5));
      ctx.save(); ctx.translate(640, 380); ctx.scale(k, k);
      rect(-380, -110, 760, 220, '#1e2533', { lw: 4, sc: '#ffd23f' });
      txt('Αποτέλεσμα #1', 0, -66, 22, '#9aa7bd', { font: 'monospace', weight: 700 });
      txt('CRYPTO MINING', 0, 0, 70, '#ffd23f', { font: TVFONT, weight: 900 });
      txt('«εξόρυξη κρυπτονομισμάτων»', 0, 60, 24, '#d8e2f0', { font: TVFONT, weight: 700 });
      ctx.restore();
    }
  } });
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'search') { searchPage(t); return; }
  if (shot === 'hud') {
    decryptScreen(t, prog(t, M.word.a, M.none.b), ['Μαρμοκοτρόκο'], { title: 'ΑΝΑΛΥΣΗ ΜΗΝΥΜΑΤΟΣ', eta: inM(t, M.none) ? 'ΓΛΩΣΣΑ: — · ΛΕΞΙΚΟ: — · ΒΑΣΗ: —' : 'ΑΝΑΖΗΤΗΣΗ ΣΕ 7.000 ΓΛΩΣΣΕΣ…' });
    return;
  }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  ravine(t, { light: 'night' });
  blob(760, 580, 70, 44, '#6a5a4a', { lw: 4 });
  const st = { x: 640, top: 380, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: inM(t, M.mining, .3, 99) ? 'evil' : 'shock', burn: 1 };
  ctx.save(); ctx.translate(640, 590); ctx.rotate(-.12); ctx.translate(-640, -590); sitaV2(st); ctx.restore();
  ctx.restore();
  applyLight('night', .8);
  ctx.save(); applyCam(c); glow(620, 432, 150, 'rgba(255,30,30,1)', .6); ctx.restore();
  if (inM(t, M.ping)) hud('ΝΕΟ ΜΗΝΥΜΑ ΑΠΟ: ΣΤΟΧΟ #0001', 'Κώστας');
  if (inM(t, M.crypto)) hud('ΚΡΥΠΤΟΓΡΑΦΗΣΗ: ΣΤΡΑΤΙΩΤΙΚΗ', 'επίπεδο απειλής: άγνωστο');
  if (inM(t, M.mining, .5, 99)) sfxText('ΕΞΟΡΥΞΗ.', 640, 170, 70, -.05, '#ffd23f');
  vignette(.5);
}
return {
  id: 'scene04', title: '4 · Ο κώδικας', steps, render,
  events: M => [[M.ping.a, SFX.ding], [M.word.a, () => { for (let i = 0; i < 16; i++) tone(700 + Math.random() * 900, .04, 'square', .02, 1, i * .09); }], [M.crypto.a, SFX.jingleMinor], [M.result.a, SFX.fanfare], [M.mining.b, SFX.clack]],
  ambience: () => ({ cricket: .025, hum: .015 }),
};
})());
