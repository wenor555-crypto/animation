/* Ep.3, Scene 2 – «Χρεοκοπία»: the καφενείο. Γιώργος, broke (3,20€), the νέος holding his bag. A call from «Offshore Holdings
   (Μπαχάμες)» wants 51% of ΣίταAI. He signs in 0.4 seconds. «Οι όροι είναι για όσους δεν έχουν όραμα.» */
defineScene((() => {
const PH = ['ΕΠΕΝΔΥΤΗΣ (τηλέφωνο)', 'INVESTOR (phone)'];
const X = { giorgos: 600, neos: 860 };
const CAMS = { wide: [640, 420, 1.1], lap: [0, 0, 1], gio: [600, 380, 2.1], neo: [860, 380, 2.1], two: [720, 400, 1.55], phone: [0, 0, 1], sign: [0, 0, 1] };
const steps = [
  { act: 'open', d: 2.4, cam: 'wide' },
  { act: 'balance', d: 1.8, cam: 'lap' },
  { who: 'neos', cam: 'neo', el: 'Κύριε Γιώργο, ο φούρναρης λέει ότι δεν δέχεται άλλες μετοχές για ψωμί.', en: "Mr Giorgos, the baker says he won't take any more shares for bread." },
  { who: 'giorgos', cam: 'gio', el: 'Η αγορά δεν είναι έτοιμη για μένα.', en: "The market isn't ready for me." },
  { who: 'giorgos', cam: 'gio', mark: 'runway', el: 'Τρία ευρώ και είκοσι. Αυτό είναι… runway για ένα φρέντο.', en: "Three euros twenty. That's… runway for one freddo." },
  { act: 'ring', d: 1.8, cam: 'phone' },
  { who: 'investor', label: PH, cam: 'phone', mark: 'inv', el: 'Κύριε Γιώργο. Εκπροσωπώ έναν ανώνυμο επενδυτή.', en: 'Mr Giorgos. I represent an anonymous investor.' },
  { who: 'investor', label: PH, cam: 'gio', el: 'Θέλουμε το πενήντα ένα τοις εκατό της ΣίταAI.', en: 'We want fifty-one percent of ΣίταAI.' },
  { who: 'giorgos', cam: 'gio', mark: 'how', el: 'Πόσα;', en: 'How much?' },
  { who: 'investor', label: PH, cam: 'two', el: 'Αρκετά για πολλά φρέντο.', en: 'Enough for a lot of freddos.' },
  { who: 'giorgos', cam: 'gio', mark: 'send', el: 'Στείλτε το συμβόλαιο.', en: 'Send the contract.' },
  { act: 'sign', d: 2.2, cam: 'sign' },
  { who: 'neos', cam: 'neo', el: 'Κύριε Γιώργο… δεν διαβάσατε τους όρους.', en: "Mr Giorgos… you didn't read the terms." },
  { who: 'giorgos', cam: 'two', mark: 'vision', el: 'Οι όροι είναι για όσους δεν έχουν όραμα.', en: 'Terms are for people without vision.' },
  { act: 'end', d: 1.6, cam: 'wide' },
];
let M;
function bank(t) {
  laptopScreen([['> bank.balance()', '#9aa7bd'], ['', '#fff'], ['Υπόλοιπο: 3,20€', '#ff6a6a'], ['', '#fff'], ['Μετοχές ΣίταAI: 100%', '#d8e2f0'], ['Αξία μετοχών: 0,00€', '#ffb23a']], prog(t, M.balance.a, M.balance.b - .3), { title: 'ΤΡΑΠΕΖΑ ΛΕΧΑΙΟΥ · e-banking', size: 34 });
}
function render(t, _M, sc) {
  M = _M;
  const [, shot] = shotAt(sc, t);
  if (shot === 'lap') { bank(t); return; }
  if (shot === 'phone') { phoneScreen(t, t < M.inv.a ? { ring: 1, number: '+1 242 555 0151', sub: 'Offshore Holdings (Μπαχάμες)', label: 'Εισερχόμενη κλήση' } : { inCall: 1, number: '+1 242 555 0151', sub: 'Offshore Holdings (Μπαχάμες)', label: 'Σε κλήση', timer: '00:0' + Math.min(9, Math.floor(t - M.inv.a)) }); return; }
  if (shot === 'sign') { contractCard(t, { sign: prog(t, M.sign.a + .2, M.sign.a + .6), stamp: prog(t, M.sign.a + .9, M.sign.a + 1.6), stampText: 'ΥΠΕΓΡΑΦΗ: 0,4″' }); return; }
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  kafeneioInside(t, () => tvShop(t, { title: 'ΟΙΚΟΝΟΜΙΚΑ ΝΕΑ', bg: ['#1a3a6a', '#0a1a3a'], banner: '' }));
  const la = (who, rest) => lookAtSpeaker(t, who, X, rest);
  const onPhone = t > M.ring.a + 1 && t < M.sign.a;
  tableOf(t, [[X.giorgos, 'giorgos', { t, talk: talk('giorgos', t), look: onPhone ? [.2, -.2] : t < M.ring.a ? [.3, .7] : la('giorgos', [1, 0]), brow: inM(t, M.runway) ? 'worry' : 'up', mouth: inM(t, M.vision, .4, 99) ? 'smirk' : 'flat',
    R: onPhone ? [48, -196] : gesture(t, talk('giorgos', t), [44, -40]), itemR: onPhone ? 'phone' : null, L: [-44, -40] }]], { cups: [] });
  laptop(520, 536, .75, '#1d2a36'); freddo(700, 540, .9);
  stand(X.neos, 'neos', .95, { t, talk: talk('neos', t), look: la('neos', [-1, .1]), brow: 'worry', mouth: 'flat', L: [-50, -30], itemL: 'bag', dir: -1 });
  ctx.restore();
  vignette(.3);
}
return {
  id: 'scene02', title: '2 · Χρεοκοπία', steps, render,
  events: M => [[M.balance.a + .3, () => { for (let i = 0; i < 8; i++) tone(1400, .03, 'square', .02, 1, i * .1); }], [M.balance.b - .5, () => tone(200, .5, 'sine', .05, .6)], [M.ring.a, SFX.phone], [M.ring.a + .9, SFX.phone],
    [M.sign.a + .2, SFX.pop], [M.sign.a + .9, SFX.slam], [M.sign.a + 1, SFX.ding]],
  ambience: () => ({ cicada: .01 }),
};
})());
