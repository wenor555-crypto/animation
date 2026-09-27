/* =========================================================
   «Η Έξυπνη Σίτα» – shared engine
   Canvas primitives with line boil, synth audio, placeholder
   narrator/voices (speechSynthesis), subtitles and the player.
   ========================================================= */
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 1280, H = 720, TAU = Math.PI * 2, INK = '#241d22';
const TVFONT = '"Noto Sans", sans-serif';

/* ---------- math ---------- */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const back = k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const bump = (t, a, b) => Math.sin(prog(t, a, b) * Math.PI);          // 0→1→0 over [a,b]
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

/* ---------- wobbly primitives (line boil at 8fps) ---------- */
let SEED = 0, BOIL = 0;
const jit = (sd, i, k) => (hash(sd * 12.9898 + i * 78.233 + BOIL * 37.719 + k * 3.3) - .5) * 2;
function finish(fill, o) {
  ctx.save();
  if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.gb || 20; }
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (o.lw !== 0) { ctx.lineWidth = o.lw || 4; ctx.strokeStyle = o.sc || INK; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.restore();
}
function blob(x, y, rx, ry, fill, o = {}) {
  const sd = ++SEED, n = o.n || 24, w = o.w ?? 1.2, rot = o.rot || 0, cr = Math.cos(rot), sr = Math.sin(rot);
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU, j = jit(sd, i, 0) * w, px = Math.cos(a) * (rx + j), py = Math.sin(a) * (ry + j);
    const X = x + px * cr - py * sr, Y = y + px * sr + py * cr; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
  }
  ctx.closePath(); finish(fill, o);
}
const wp = (pts, sd, w) => pts.map((p, i) => [p[0] + jit(sd, i, 1) * w, p[1] + jit(sd, i, 2) * w]);
function poly(pts, fill, o = {}) {
  const sd = ++SEED, P = wp(pts, sd, o.w ?? 1), L = P.length;
  ctx.beginPath();
  if (o.smooth) {
    const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], s = m(P[L - 1], P[0]); ctx.moveTo(s[0], s[1]);
    for (let i = 0; i < L; i++) { const mm = m(P[i], P[(i + 1) % L]); ctx.quadraticCurveTo(P[i][0], P[i][1], mm[0], mm[1]); }
  } else P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
  ctx.closePath(); finish(fill, o);
}
function curve(pts, lw = 4, col = INK, o = {}) {
  const sd = ++SEED, P = wp(pts, sd, o.w ?? .9), L = P.length;
  ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
  if (L === 2) ctx.lineTo(P[1][0], P[1][1]);
  else for (let i = 1; i < L - 1; i++) { const e = i === L - 2; ctx.quadraticCurveTo(P[i][0], P[i][1], e ? P[i + 1][0] : (P[i][0] + P[i + 1][0]) / 2, e ? P[i + 1][1] : (P[i][1] + P[i + 1][1]) / 2); }
  finish(null, { ...o, lw, sc: col });
}
function limb(pts, lw, col, o = {}) { curve(pts, lw + 6, INK, o); SEED--; curve(pts, lw, col, o); }
function rect(x, y, w, h, fill, o = {}) { poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill, o); }
function txt(s, x, y, size, col, o = {}) {
  ctx.font = `${o.style || ''} ${o.weight || 700} ${size}px ${o.font || 'Comfortaa, sans-serif'}`;
  ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  if (o.stroke) { ctx.lineWidth = o.stroke; ctx.strokeStyle = o.sc || INK; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
  ctx.fillStyle = col; ctx.fillText(s, x, y);
}
function eye(x, y, r, lx, ly, bl, o = {}) {        // big whites, tiny dot pupils
  if (bl) { curve([[x - r, y + 1], [x, y + r * .35], [x + r, y + 1]], 3); SEED++; return; }
  blob(x, y, r, r * (o.sq || 1.08), '#fff', { lw: 3, w: .5 });
  blob(x + lx * r * .45, y + ly * r * .45, o.pr || 2.8, o.pr || 2.8, INK, { lw: 0, w: .15, n: 10 });
  if (o.lid) curve([[x - r, y - r * .2], [x + r, y - r * .2]], 3);      // half-lidded, bored
}
const blinkAt = (t, off) => ((t + off) % 3.7) < .12;
function mosquito(x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.globalAlpha *= .5; blob(0, -4 + Math.sin(t * 90) * 2, 4, 2, '#dfe9f2', { lw: 0 }); ctx.globalAlpha /= .5;
  blob(0, 0, 4, 1.6, '#3b302c', { lw: 0 }); curve([[-2, 1], [-4, 5]], 1, INK, { w: 0 }); curve([[2, 1], [4, 5]], 1, INK, { w: 0 });
  ctx.restore();
}

/* =========================================================
   AUDIO: synth SFX + ambience
   ========================================================= */
let AC = null, master = null, amb = null, soundOn = true, voOn = true, playing = false;
function ensureAudio() {
  if (!AC) {
    AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.connect(AC.destination);
    const osc = (type, f) => { const o = AC.createOscillator(); o.type = type; o.frequency.value = f; o.start(); return o; };
    const gain = v => { const g = AC.createGain(); g.gain.value = v; return g; };
    const nb = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate), d = nb.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const ns = AC.createBufferSource(); ns.buffer = nb; ns.loop = true; ns.start();
    const cf = AC.createBiquadFilter(); cf.type = 'bandpass'; cf.frequency.value = 5200; cf.Q.value = 6;
    const cAM = gain(0), lfo = osc('square', 34), lg = gain(.5); lfo.connect(lg); lg.connect(cAM.gain);
    const cG = gain(0); ns.connect(cf); cf.connect(cAM); cAM.connect(cG); cG.connect(master);
    const mq = osc('sawtooth', 560), vib = osc('sine', 7), vg = gain(18); vib.connect(vg); vg.connect(mq.frequency);
    const mf = AC.createBiquadFilter(); mf.type = 'bandpass'; mf.frequency.value = 900; mf.Q.value = 1.2;
    const mG = gain(0); mq.connect(mf); mf.connect(mG); mG.connect(master);
    amb = { cG, mG };
  }
  if (AC.state === 'suspended') AC.resume();
}
function tone(f, dur, type = 'triangle', vol = .06, slide = 0, delay = 0) {
  if (!soundOn || !AC) return;
  const o = AC.createOscillator(), g = AC.createGain(), n = AC.currentTime + delay;
  o.type = type; o.frequency.setValueAtTime(f, n); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * slide), n + dur);
  g.gain.setValueAtTime(0, n); g.gain.linearRampToValueAtTime(vol, n + .008); g.gain.exponentialRampToValueAtTime(.0001, n + dur);
  o.connect(g); g.connect(master); o.start(n); o.stop(n + dur + .02);
}
function noise(dur, vol = .2, freq = 800, q = .7, type = 'lowpass', delay = 0) {
  if (!soundOn || !AC) return;
  const n = AC.currentTime + delay, len = Math.floor(AC.sampleRate * dur), buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
  s.buffer = buf; f.type = type; f.frequency.value = freq; f.Q.value = q;
  g.gain.setValueAtTime(vol, n); g.gain.exponentialRampToValueAtTime(.0001, n + dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(n);
}
const SFX = {
  slap: () => { noise(.09, .5, 2400, .8, 'bandpass'); tone(180, .06, 'sine', .08, .5); },
  sip: () => noise(.7, .12, 1400, 3, 'bandpass'),
  creak: () => { tone(320, .5, 'sawtooth', .025, 1.6); tone(410, .4, 'sawtooth', .02, 1.4, .1); },
  slam: () => { noise(.35, .6, 500); tone(70, .3, 'sine', .25, .5); },
  crash: () => { noise(.5, .25, 4000, .5, 'highpass', .25); for (let i = 0; i < 6; i++) tone(2000 + Math.random() * 3000, .15, 'sine', .04, 1, .25 + i * .05); },
  door: () => { noise(.25, .5, 700); tone(90, .25, 'sine', .2, .6); },
  choir: () => [0, 4, 7, 12].forEach(s => { tone(261.6 * 2 ** (s / 12), 2.2, 'sine', .05); tone(261.6 * 2 ** (s / 12) * 1.005, 2.2, 'triangle', .025); }),
  flies: () => { tone(200, 1.6, 'sawtooth', .025, 1.1); tone(230, 1.6, 'sawtooth', .02, .95); },
};

/* =========================================================
   VOICES: babble + placeholder TTS
   ========================================================= */
let greekVoice = null;
const loadVoices = () => { greekVoice = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith('el')) || null; };
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
/* A line's voice either comes from a recorded clip (window.CLIPS, embedded by build.py
   from audio/<scene>/<NN>.mp3) or, as a placeholder, from the browser's Greek TTS.
   While a voice is still speaking, the timeline HOLDS at the end of that line,
   so pictures and subtitles never run ahead of the audio. */
let speaking = false, speakStart = 0, curClip = null;
function voiceLine(L, idx) {
  stopVO();
  const key = `${SCENE.id}/${String(idx + 1).padStart(2, '0')}`, src = (window.CLIPS || {})[key];
  if (!soundOn) return;
  if (src) {
    curClip = new Audio(src); speaking = true; speakStart = performance.now();
    curClip.onended = curClip.onerror = () => { speaking = false; };
    curClip.play().catch(() => { speaking = false; });
    return;
  }
  if (!voOn || !('speechSynthesis' in window)) return;
  const v = SCENE.voices[L.who], u = new SpeechSynthesisUtterance(L.el.replace(/[«»*]/g, ''));
  if (greekVoice) u.voice = greekVoice; u.lang = 'el-GR'; u.rate = v.rate || 1; u.pitch = v.pitch || 1;
  u.onend = u.onerror = () => { speaking = false; };
  speaking = true; speakStart = performance.now();
  speechSynthesis.speak(u);
}
function stopVO() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (curClip) { curClip.pause(); curClip = null; }
  speaking = false;
}
const hasClips = () => Object.keys(window.CLIPS || {}).some(k => k.startsWith(SCENE.id + '/'));

/* =========================================================
   PLAYER
   ========================================================= */
let T = 0, started = false, lang = 'el', SCENE = null;
function talk(who, t) {
  for (const L of SCENE.lines) if (L.who === who && t >= L.a && t < L.b) return .3 + .7 * Math.abs(Math.sin(t * 13 + who.length));
  return 0;
}
function drawSubs(t) {
  const L = SCENE.lines.find(l => t >= l.a && t < l.b); if (!L) return;
  const V = SCENE.voices[L.who], s = lang === 'el' ? L.el : L.en, name = lang === 'el' ? V.el : V.en;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = '700 29px "Noto Sans", sans-serif';
  const words = s.split(' '), rows = []; let cur = '';
  for (const w of words) { const c = cur ? cur + ' ' + w : w; if (ctx.measureText(c).width > 1000 && cur) { rows.push(cur); cur = w; } else cur = c; }
  rows.push(cur);
  const lh = 38, bw = Math.max(...rows.map(r => ctx.measureText(r).width)) + 56, bh = rows.length * lh + 24, bx = 640 - bw / 2, by = 696 - bh;
  ctx.fillStyle = 'rgba(18,14,20,.8)'; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 12); ctx.fill();
  ctx.font = '700 17px "Noto Sans", sans-serif'; const nw = ctx.measureText(name).width + 24;
  ctx.fillStyle = V.col; ctx.beginPath(); ctx.roundRect(bx + 18, by - 14, nw, 28, 8); ctx.fill();
  txt(name, bx + 18 + nw / 2, by, 17, INK, { font: TVFONT });
  rows.forEach((r, i) => txt(r, 640, by + 12 + lh / 2 + i * lh, 29, '#fffaf0', { font: TVFONT }));
}
function runScene(cfg) {
  SCENE = cfg;
  const $ = id => document.getElementById(id);
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  $('scrub').max = cfg.dur;
  const updateUI = () => {
    $('play').textContent = playing ? '❚❚ Pause' : '▶ Play';
    $('big').hidden = playing || started;
    $('lang').textContent = lang === 'el' ? 'EN' : 'ΕΛ';
    $('snd').textContent = soundOn ? '🔊' : '🔇';
    $('vo').style.opacity = voOn ? 1 : .45;
  };
  const play = () => { ensureAudio(); if (T >= cfg.dur) T = 0; playing = true; started = true; updateUI(); };
  const pause = () => { playing = false; stopVO(); updateUI(); };
  $('big').onclick = play;
  $('play').onclick = () => playing ? pause() : play();
  $('restart').onclick = () => { stopVO(); T = 0; play(); };
  $('scrub').oninput = e => { stopVO(); T = +e.target.value; started = true; updateUI(); };
  $('lang').onclick = () => { lang = lang === 'el' ? 'en' : 'el'; updateUI(); };
  $('snd').onclick = () => { soundOn = !soundOn; if (soundOn) ensureAudio(); else stopVO(); updateUI(); };
  $('vo').onclick = () => { voOn = !voOn; if (!voOn) stopVO(); updateUI(); };
  $('fs').onclick = () => { document.fullscreenElement ? document.exitFullscreen() : $('stage').requestFullscreen?.(); };
  window.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); } });
  let last = null;
  const frame = now => {
    if (last == null) last = now;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (playing) {
      const prev = T;
      // hold at the end of the current line while its voice is still going (max 6s safety)
      const cur = cfg.lines.find(l => T >= l.a && T < l.b);
      const hold = speaking && cur && T + dt >= cur.b - .02 && performance.now() - speakStart < 6000;
      if (!hold) T += dt;
      if (T >= cfg.dur) { T = cfg.dur; pause(); }
      if (soundOn && AC) for (const [et, fn] of cfg.events) if (et > prev && et <= T) fn();
      cfg.lines.forEach((L, i) => { if (L.a > prev && L.a <= T) voiceLine(L, i); });
      if (soundOn && AC && T > 0 && !hasClips()) {
        const L = cfg.lines.find(l => T >= l.a && T < l.b);
        if (L && (!voOn || !greekVoice) && Math.floor(T / .085) > Math.floor(prev / .085)) { const V = cfg.voices[L.who]; tone(V.babble * (.85 + Math.random() * .35), .07, 'triangle', .04, .9 + Math.random() * .3); }
      }
    }
    if (AC) {
      const a = cfg.ambience ? cfg.ambience(T) : { cicada: 0, mosq: 0 }, n = AC.currentTime, on = soundOn && playing;
      amb.cG.gain.setTargetAtTime(on ? a.cicada : 0, n, .08); amb.mG.gain.setTargetAtTime(on ? a.mosq : 0, n, .08);
    }
    SEED = 0; BOIL = Math.floor((started ? T : cfg.poster) * 8);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    cfg.render(started ? T : cfg.poster);
    drawSubs(started ? T : -1);
    $('scrub').value = T; $('time').textContent = `${fmt(T)} / ${fmt(cfg.dur)}`;
    requestAnimationFrame(frame);
  };
  window.renderAt = t => { started = true; T = t; updateUI(); SEED = 0; BOIL = Math.floor(t * 8); ctx.setTransform(1, 0, 0, 1, 0, 0); cfg.render(t); drawSubs(t); };
  updateUI(); requestAnimationFrame(frame);
}
