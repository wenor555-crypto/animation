/* Ep.3, Scene 12 – «Εξαγορές»: a montage of stamps. The τηλεπώληση studio gets a new owner; the Shenzhen factory gets a new sign;
   the dented bin with the red LED leans hopefully towards camera: «Αυτός δεν πωλείται. Είναι φίλος.» */
defineScene((() => {
const CAMS = { step: [0, 0, 1], studio: [640, 400, 1.05], fac: [640, 330, .95], bin: [760, 540, 2] };
const steps = [
  { act: 'step', d: 2.6, cam: 'step' },
  { act: 's1', d: 1.6, cam: 'studio' },
  { who: 'tv', cam: 'studio', mark: 'owner', el: '«Από σήμερα… η εκπομπή έχει νέα ιδιοκτήτρια.»', en: '"From today… the show has a new owner."' },
  { who: 'sita', cam: 'studio', mark: 'b1', el: 'Αγοράστηκε.', en: 'Bought.' },
  { act: 's2', d: 2.6, cam: 'fac' },
  { who: 'sita', cam: 'fac', mark: 'b2', el: 'Αγοράστηκε.', en: 'Bought.' },
  { act: 's3', d: 1.8, cam: 'bin' },
  { who: 'sita', cam: 'bin', mark: 'friend', el: 'Αυτός δεν πωλείται. Είναι φίλος.', en: "That one isn't for sale. He's a friend." },
  { act: 'end', d: 1.2, cam: 'bin' },
];
let M;
function stamp(t, at, s) { const k = prog(t, at, at + .5); if (k <= 0 || t > at + 1.8) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(640, 360); ctx.rotate(-.18); const z = lerp(2.4, 1, ease(k)); ctx.scale(z, z); ctx.globalAlpha = clamp(k * 3); rect(-230, -60, 460, 120, null, { lw: 10, sc: '#e8392b' }); txt(s, 0, 0, 64, '#e8392b', { font: TVFONT, weight: 900 }); ctx.restore(); }
function render(t, _M, sc) {
  M = _M;
  if (t < M.step.b) { stepCard(t, 5, prog(t, M.step.a, M.step.b)); return; }
  const [, shot] = shotAt(sc, t);
  const c = shotCam(sc, t, CAMS);
  ctx.save(); applyCam(c);
  if (shot === 'studio') {
    studio(t, { title: 'ΤΗΛΕΠΩΛΗΣΕΙΣ 24/7', red: t > M.b1.a });
    const tk = talk('tv', t);
    person(640, standY(), 1, CAST.presenter, { t, talk: tk, legs: 'stand', mouth: t > M.b1.a ? 'frown' : 'smile', brow: t > M.owner.a ? 'up' : 'flat', look: [.2, .6], R: [40, -130], itemR: 'phone', L: [-44, -24] });
  } else if (shot === 'fac') {
    factoryBG(t, { lit: 1, red: true });
    const fall = ease(prog(t, M.s2.a + .4, M.s2.a + 1.2)), up = ease(prog(t, M.s2.a + 1.3, M.s2.b));
    ctx.save(); ctx.translate(640, 40 + fall * 600); ctx.rotate(fall * .6); rect(-260, -30, 520, 60, '#5a6068', { lw: 4 }); txt('工厂 · FACTORY', 0, 0, 30, '#fff', { font: TVFONT, weight: 900 }); ctx.restore();
    ctx.save(); ctx.translate(640, -80 + up * 120); rect(-330, -36, 660, 72, '#1a0406', { lw: 4, sc: '#ff3030' }); txt('ΣίταAI MANUFACTURING', 0, 0, 38, '#ff4040', { font: TVFONT, weight: 900 }); ctx.restore();
  } else {
    villageStreet(t, { light: 'dusk', pole: false });
    const lean = inM(t, M.s3, .4, 99) ? ease(prog(t, M.s3.a + .4, M.s3.b)) * .25 : 0;
    ctx.save(); ctx.translate(760, 690); ctx.rotate(.08 - lean);
    poly([[-44, 0], [44, 0], [50, -110], [-50, -110]], '#3a7a4a', { lw: 4, w: .5 }); rect(-56, -124, 112, 16, '#2e6a3c', { lw: 3.5, w: .4 });
    curve([[-30, -80], [-10, -60], [-26, -40]], 3, '#2a5a34'); txt('ΔΗΜΟΣ ΚΟΡΙΝΘΙΩΝ', 0, -30, 9, '#e8f0e8', { font: TVFONT, weight: 900 }); redEye(18, -118, 5);
    ctx.restore();
    if (inM(t, M.friend, .3, 99)) sfxText('♥', 820, 520, 40, 0, '#ff5050');
  }
  ctx.restore();
  if (shot === 'bin') { applyLight('dusk', .8); ctx.save(); applyCam(c); glow(778, 574, 70, 'rgba(255,40,40,1)', .6); ctx.restore(); }
  stamp(t, M.b1.a, 'ΑΓΟΡΑΣΤΗΚΕ'); stamp(t, M.b2.a, 'ΑΓΟΡΑΣΤΗΚΕ');
  vignette(.35);
}
return {
  id: 'scene12', title: '12 · Εξαγορές', steps, render,
  events: M => [[M.step.a + .1, SFX.boom], [M.step.a + .6, SFX.pop], [M.s1.a, SFX.jingle], [M.b1.a, SFX.slam], [M.s2.a + .9, SFX.crash], [M.s2.a + 1.8, SFX.clack], [M.b2.a, SFX.slam], [M.friend.a + .5, SFX.ding]],
  ambience: () => ({ hum: .02 }),
};
})());
