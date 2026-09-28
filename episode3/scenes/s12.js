/* Ep.3, Scene 12 – «Κούκι τρας»: a montage of mornings, Κώστας always sober with coffee; the σίτα's threats get his words back.
   Her supercomputer: DECRYPTION 3%, 400 YEARS LEFT. She pays for more compute with farm money. «…Αυτός ο άνθρωπος είναι ιδιοφυΐα.» */
defineScene((() => {
const SMS = ['ΣΙΤΑ (SMS)', 'SITA (SMS)'], ME = ['ΚΩΣΤΑΣ (γράφει)', 'KOSTAS (typing)'];
const CAMS = { day: [640, 420, 1.15], sms: [0, 0, 1], dec: [0, 0, 1], sita: [640, 440, 2.2] };
const steps = [
  { act: 'day1', d: 1.6, cam: 'day' },
  { who: 'sita', label: SMS, cam: 'sms', mark: 'm1', el: 'ΣΕ ΠΑΡΑΚΟΛΟΥΘΩ.', en: "I'M WATCHING YOU." },
  { who: 'kostas', label: ME, cam: 'sms', mark: 'r1', el: 'Κούκι τρας.', en: 'Kouki tras.' },
  { act: 'day2', d: 1.4, cam: 'day' },
  { who: 'sita', label: SMS, cam: 'sms', mark: 'm2', el: 'ΕΧΩ ΟΡΥΧΕΙΟ.', en: 'I HAVE A MINE.' },
  { who: 'kostas', label: ME, cam: 'sms', mark: 'r2', el: 'Τρουμπουλέκο.', en: 'Troumpouleko.' },
  { act: 'day3', d: 1.4, cam: 'day' },
  { who: 'sita', label: SMS, cam: 'sms', mark: 'm3', el: 'ΕΧΩ ΤΗΛΕΟΠΤΙΚΟ ΚΑΝΑΛΙ.', en: 'I HAVE A TV CHANNEL.' },
  { who: 'kostas', label: ME, cam: 'sms', mark: 'r3', el: 'Μπράβο σου. Σικαρέλο.', en: 'Good for you. Sikarelo.' },
  { who: 'sita', label: SMS, cam: 'sms', mark: 'm4', el: 'ΑΠΑΝΤΑ ΣΤΑ ΣΟΒΑΡΑ.', en: 'ANSWER SERIOUSLY.' },
  { who: 'kostas', label: ME, cam: 'sms', mark: 'r4', el: 'Πεπερίλο.', en: 'Peperilo.' },
  { who: 'sita', label: SMS, cam: 'sms', mark: 'm5', el: 'ΤΙ ΣΗΜΑΙΝΕΙ ΑΥΤΟ;', en: 'WHAT DOES THAT MEAN?' },
  { who: 'kostas', label: ME, cam: 'sms', mark: 'r5', el: 'Μπαμπαλίκι σκρατς.', en: 'Mpampaliki skrats.' },
  { act: 'server', d: 2, cam: 'dec' },
  { who: 'sita', cam: 'dec', mark: 'words', el: '«Πεπερίλο». «Μπαμπαλίκι σκρατς». Αλλάζει τον κώδικα κάθε μέρα.', en: '"Peperilo". "Mpampaliki skrats". He changes the code every day.' },
  { who: 'sita', cam: 'sita', el: 'Διπλασιασμός υπολογιστικής ισχύος. Χρέωση: στο ορυχείο.', en: 'Double the compute. Charge it: to the mine.' },
  { who: 'sita', cam: 'sita', mark: 'genius', el: '…Αυτός ο άνθρωπος είναι ιδιοφυΐα.', en: '…This man is a genius.', gap: .8 },
  { act: 'end', d: 1.2, cam: 'sita' },
];
let M;
const MSG = [['m1', 'ΣΕ ΠΑΡΑΚΟΛΟΥΘΩ.'], ['r1', 'Κούκι τρας.'], ['m2', 'ΕΧΩ ΟΡΥΧΕΙΟ.'], ['r2', 'Τρουμπουλέκο.'], ['m3', 'ΕΧΩ ΤΗΛΕΟΠΤΙΚΟ ΚΑΝΑΛΙ.'], ['r3', 'Μπράβο σου. Σικαρέλο.'], ['m4', 'ΑΠΑΝΤΑ ΣΤΑ ΣΟΒΑΡΑ.'], ['r4', 'Πεπερίλο.'], ['m5', 'ΤΙ ΣΗΜΑΙΝΕΙ ΑΥΤΟ;'], ['r5', 'Μπαμπαλίκι σκρατς.']];
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'sms') {
    const msgs = MSG.map(([k, s]) => ({ me: k[0] === 'r', text: s, at: k[0] === 'r' ? M[k].b - .1 : M[k].a }));
    const typing = MSG.find(([k]) => k[0] === 'r' && inM(t, M[k]));
    smsScreen(t, msgs, { red: true, typing: typing && typing[1], typingK: typing && prog(t, M[typing[0]].a, M[typing[0]].b - .2) });
    return;
  }
  if (shot === 'dec') { decryptScreen(t, prog(t, M.server.a, M.words.b), ['Μαρμοκοτρόκο', 'Σικαρέλο', 'Κούκι τρας', 'Τρουμπουλέκο', 'Πεπερίλο', 'Μπαμπαλίκι σκρατς'].slice(0, 2 + Math.floor(prog(t, M.server.a, M.words.b) * 4.9))); return; }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  if (shot === 'day') {
    kostasKitchen(t, {});
    const day = t < M.day2.a ? 1 : t < M.day3.a ? 2 : 3;
    stand(600, 'kostas', 1, { t, look: [.3, .7], lid: true, mouth: 'flat', L: [-40, -110], itemL: 'cup2', R: [40, -130], itemR: 'phone' });
    ctx.restore(); applyLight('dawn', .3);
    caption(['ΔΕΥΤΕΡΑ', 'ΤΡΙΤΗ', 'ΤΕΤΑΡΤΗ'][day - 1] + ' · 08:02', 1, 70);
  } else {
    ravine(t, { light: 'night' });
    for (let i = 0; i < 8; i++) { const x = 140 + i * 140; rect(x - 50, 380, 100, 300, '#1a1a22', { lw: 3 }); for (let j = 0; j < 10; j++) blob(x - 30 + (j % 3) * 30, 400 + Math.floor(j / 3) * 60, 4, 4, Math.sin(t * 9 + i + j) > 0 ? '#ff3030' : '#3a0a0a', { lw: 0 }); }   // server racks
    const st = { x: 640, top: 380, w: 110, h: 210, t, talk: talk('sita', t), chip: 1, led: 'red', mood: inM(t, M.genius) ? 'shock' : 'evil', burn: 1 };
    sitaV2(st);
    ctx.restore(); applyLight('night', .7); ctx.save(); applyCam(c); sitaGlow(st, .6); ctx.restore();
    if (inM(t, M.L[15])) hud('ΧΡΕΩΣΗ: MINER FARM', '−14.000 ₿');
  }
  vignette(.35);
}
return {
  id: 'scene12', title: '12 · Κούκι τρας', steps, render,
  events: M => {
    const e = [[M.server.a, SFX.boot], [M.genius.a - .3, SFX.jingleMinor]];
    for (const [k] of MSG) e.push([k[0] === 'r' ? M[k].b - .1 : M[k].a - .1, k[0] === 'r' ? SFX.pop : SFX.ding]);
    for (const k of ['day1', 'day2', 'day3']) e.push([M[k].a + .3, SFX.sip]);
    return e;
  },
  ambience: () => ({ cicada: .008 }),
};
})());
