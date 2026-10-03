/* Lab: sound v2. The «call» cue through the speaker EQ, dipping under two (silent) lines at 2–4 s and 6–8 s, opening
   to full range at 10 s; recorded effects at 1 s (punch) and 12 s (big boom). */
defineScene((() => {
const steps = [{ act: 'snd', d: 16, cam: 'all' }];
function render(t, M) {
  ctx.fillStyle = '#1b1b24'; ctx.fillRect(0, 0, W, H);
  const k = t - M.snd.a;
  txt('SOUND v2 · ' + k.toFixed(1) + ' s', 640, 300, 40, '#fff', { font: TVFONT, weight: 900 });
  txt(k < 10 ? 'speaker EQ' : 'full range', 640, 380, 26, '#9fd0ff', { font: TVFONT, weight: 900 });
  for (const [a, b] of [[2, 4], [6, 8]]) if (k > a && k < b) txt('(line: the music dips)', 640, 450, 22, '#ffd23f', { font: TVFONT, weight: 900 });
}
return { id: 'scene06', title: 'sound lab', steps, render, fade: false,
  events: M => [[M.snd.a, () => SND2.music('call', { eq: 'speaker', toFull: 10, lines: [[2, 4], [6, 8]], fadeOut: [14.5, 1.5] })],
                [M.snd.a + 1, () => SND2.sfx('metal_punch')], [M.snd.a + 12, () => SND2.sfx('boom_big')]] };
})());
