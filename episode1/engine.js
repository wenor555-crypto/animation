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
    // crickets: high sine chirps gated by a slow square
    const cr = osc('sine', 4400), crAM = gain(0), crL = osc('square', 3.2), crLg = gain(.5); crL.connect(crLg); crLg.connect(crAM.gain);
    const krG = gain(0); cr.connect(crAM); crAM.connect(krG); krG.connect(master);
    // mains hum (evil devices)
    const hm = osc('sawtooth', 50), hf = AC.createBiquadFilter(); hf.type = 'lowpass'; hf.frequency.value = 180;
    const hG = gain(0); hm.connect(hf); hf.connect(hG); hG.connect(master);
    amb = { cG, mG, krG, hG };
  }
  if (AC.state === 'suspended') AC.resume();
  queueClips();
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
  clack: () => { tone(2400, .05, 'square', .1, .4); tone(900, .08, 'square', .08, .5); },
  clacks: (n = 3) => { for (let i = 0; i < n; i++) { tone(2400, .05, 'square', .08, .4, i * .13); tone(900, .07, 'square', .06, .5, i * .13); } },
  jingle: () => [0, 4, 7, 12, 16].forEach((s, i) => tone(523.25 * 2 ** (s / 12), .25, 'square', .045, 0, i * .09)),
  jingleMinor: () => [0, 3, 7, 12, 15].forEach((s, i) => tone(261.6 * 2 ** (s / 12), .5, 'square', .04, 0, i * .22)),
  ding: () => { tone(1568, .5, 'sine', .08); tone(2093, .6, 'sine', .05, 0, .08); },
  whoosh: () => noise(.5, .35, 900, .6, 'bandpass'),
  fire: () => { noise(1.2, .4, 600); noise(1.2, .2, 2000, .5, 'bandpass', .1); },
  spark: () => { noise(.12, .3, 5000, 1, 'highpass'); tone(3000, .08, 'square', .04, .3); },
  zap: () => { for (let i = 0; i < 5; i++) { noise(.05, .3, 6000, 1, 'highpass', i * .06); tone(180, .05, 'sawtooth', .06, 1, i * .06); } },
  buzz: (d = .8) => { tone(110, d, 'sawtooth', .05, 1.02); tone(113, d, 'square', .03, .98); },
  boot: () => [0, 7, 12, 16].forEach((s, i) => tone(392 * 2 ** (s / 12), .7, 'sine', .06, 0, i * .18)),
  drums: () => { for (let i = 0; i < 12; i++) { noise(.12, .3 + i * .03, 300, 1, 'lowpass', i * .08); tone(90, .1, 'sine', .15, .6, i * .08); } },
  applause: () => { for (let i = 0; i < 40; i++) noise(.05, .12, 2500, .8, 'bandpass', Math.random() * 1.6); },
  boom: () => { noise(1, .7, 300); tone(55, .9, 'sine', .35, .4); },
  thud: () => { noise(.2, .5, 250); tone(80, .2, 'sine', .25, .5); },
  pop: () => tone(600, .08, 'sine', .08, 2),
  cluck: () => { for (let i = 0; i < 3; i++) tone(700 + Math.random() * 300, .06, 'square', .04, .7, i * .1); },
  snore: () => { noise(1, .12, 300, 2, 'bandpass'); tone(80, 1, 'sawtooth', .02, 1.2); },
  engine: () => { tone(60, 1.6, 'sawtooth', .07, 1.8); noise(1.6, .15, 400); },
  honk: () => { tone(415, .4, 'square', .06); tone(523, .4, 'square', .05); },
  phone: () => { for (let i = 0; i < 2; i++) { tone(1200, .12, 'square', .04, 1, i * .2); tone(900, .12, 'square', .04, 1, i * .2 + .1); } },
  splash: () => noise(.5, .35, 1200, .5, 'bandpass'),
  hiss: () => noise(.9, .3, 3000, .4, 'highpass'),
  rev: () => { tone(70, 1.2, 'sawtooth', .08, 4); noise(1.2, .2, 800); },
  swell: () => [0, 7, 12].forEach(s => tone(110 * 2 ** (s / 12), 2.5, 'sawtooth', .03, 1.01)),
  gong: () => { tone(98, 3, 'sine', .2, .98); tone(147, 3, 'sine', .08, .99); noise(.4, .3, 400) },
  windows: () => [[622, 0], [932, .15], [831, .3], [1244, .45]].forEach(([f, d]) => tone(f, .9, 'sine', .06, 1, d)),
  fanfare: () => [0, 4, 7, 12, 7, 12].forEach((s, i) => tone(392 * 2 ** (s / 12), .3, 'sawtooth', .04, 0, i * .14)),
};

/* =========================================================
   VOICES: recorded clips (Web Audio) or placeholder TTS/babble
   ========================================================= */
let greekVoice = null;
const loadVoices = () => { greekVoice = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith('el')) || null; };
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
/* Clips come from window.CLIPS (embedded by build.py from audio/<scene>/<NN>.mp3) and are decoded
   into Web Audio buffers: <audio> elements with data: URLs get blocked by autoplay rules and
   sandboxed previews. Only the scenes around the playhead are kept decoded (memory).
   While a voice is speaking the timeline HOLDS at the end of that line. */
const BUFS = {}, DECODED_SCENES = new Set();
let speaking = false, speakStart = 0, speakMax = 6, curClip = null, pendingKey = null;
function decodeScene(id) {
  if (!AC || DECODED_SCENES.has(id)) return;
  DECODED_SCENES.add(id);
  for (const [key, src] of Object.entries(window.CLIPS || {})) {
    if (!key.startsWith(id + '/') || key in BUFS) continue;
    BUFS[key] = null;
    const bin = atob(src.slice(src.indexOf(',') + 1)), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    AC.decodeAudioData(bytes.buffer).then(b => {
      if (!DECODED_SCENES.has(id)) { delete BUFS[key]; return; }
      BUFS[key] = b; if (pendingKey === key) startClip(key);
    }, e => { console.warn('clip decode failed', key, e); delete BUFS[key]; if (pendingKey === key) { pendingKey = null; speaking = false; } });
  }
}
function queueClips() {
  if (!AC || !EP) return;
  const i = EP.cur, keep = new Set([i - 1, i, i + 1, i + 2].filter(k => k >= 0 && k < EP.scenes.length).map(k => EP.scenes[k].id));
  for (const id of [...DECODED_SCENES]) if (!keep.has(id)) { DECODED_SCENES.delete(id); for (const k in BUFS) if (k.startsWith(id + '/')) delete BUFS[k]; }
  for (const id of keep) decodeScene(id);
}
const clipKey = (sc, idx) => `${sc.id}/${String(idx + 1).padStart(2, '0')}`;
function startClip(key) {
  pendingKey = null;
  curClip = AC.createBufferSource(); curClip.buffer = BUFS[key]; curClip.connect(master);
  curClip.onended = () => { speaking = false; };
  speaking = true; speakStart = performance.now(); speakMax = BUFS[key].duration + 1.5; curClip.start();
}
function voiceLine(sc, L, idx) {
  stopVO();
  if (!soundOn) return;
  const key = clipKey(sc, idx);
  if (AC && BUFS[key]) return startClip(key);
  if (AC && BUFS[key] === null) { pendingKey = key; speaking = true; speakStart = performance.now(); speakMax = 3; return; }   // still decoding: wait for it
  if (!voOn || !('speechSynthesis' in window)) return;
  const v = voiceInfo(sc, L.who), u = new SpeechSynthesisUtterance(L.el.replace(/[«»*]/g, ''));
  if (greekVoice) u.voice = greekVoice; u.lang = 'el-GR'; u.rate = v.rate || 1; u.pitch = v.pitch || 1;
  u.onend = u.onerror = () => { speaking = false; };
  speaking = true; speakStart = performance.now(); speakMax = 8;
  speechSynthesis.speak(u);
}
function stopVO() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (curClip) { curClip.onended = null; try { curClip.stop(); } catch (e) {} curClip = null; }
  speaking = false; pendingKey = null;
}
const hasClip = (sc, idx) => !!(AC && BUFS[clipKey(sc, idx)]);

/* default speaker labels / placeholder voice params (a scene may override with cfg.voices) */
const VOICE_INFO = {
  narrator: { el: 'ΑΦΗΓΗΤΗΣ', en: 'NARRATOR', col: '#e8e0c8', pitch: .55, rate: .88, babble: 150 },
  giannos:  { el: 'ΓΙΑΝΝΟΣ', en: 'GIANNOS', col: '#8cc4ff', pitch: .95, rate: 1.05, babble: 300 },
  mimis:    { el: 'ΜΗΜΗΣ', en: 'MIMIS', col: '#d0d0d6', pitch: .75, rate: .92, babble: 230 },
  giorgos:  { el: 'ΓΙΩΡΓΟΣ', en: 'GIORGOS', col: '#9be08a', pitch: 1.1, rate: 1.1, babble: 340 },
  christos: { el: 'ΧΡΗΣΤΟΣ', en: 'CHRISTOS', col: '#7fa6ff', pitch: .85, rate: .9, babble: 260 },
  kostas:   { el: 'ΚΩΣΤΑΣ', en: 'KOSTAS', col: '#c8f04a', pitch: .9, rate: 1, babble: 280 },
  panik:    { el: 'PANIK', en: 'PANIK', col: '#c8f04a', pitch: .5, rate: .85, babble: 190 },
  maria:    { el: 'ΜΑΡΙΑ', en: 'MARIA', col: '#ff9ac6', pitch: 1.5, rate: 1.12, babble: 480 },
  myrsini:  { el: 'ΜΥΡΣΙΝΗ', en: 'MYRSINI', col: '#ffc37a', pitch: 1.3, rate: 1, babble: 420 },
  vangelio: { el: 'ΒΑΓΓΕΛΙΩ', en: 'VANGELIO', col: '#e05a4a', pitch: .9, rate: .9, babble: 360 },
  vasilis:  { el: 'ΒΑΣΙΛΗΣ', en: 'VASILIS', col: '#ffd23f', pitch: .5, rate: .82, babble: 170 },
  sita:     { el: 'ΣΙΤΑ', en: 'SITA', col: '#5dff8a', pitch: 1.6, rate: 1.2, babble: 520 },
};
const voiceInfo = (sc, who) => (sc.voices && sc.voices[who]) || VOICE_INFO[who] || VOICE_INFO.narrator;

/* =========================================================
   SCENES
   A scene is { id, dur, lines:[{a,b,who,el,en}], render(t, M), events, ambience }.
   Instead of fixed times it can give `steps`: spoken lines { who, el, en, gap, cam, mark }
   and silent actions { act: 'name', d: seconds, cam }. Timing is then laid out from the
   real clip durations (window.CLIP_DUR, from build.py) or a reading-speed estimate, and
   M['name'] = {a, b} (M.L[i] for the i-th line) lets the drawing code key off story beats.
   ========================================================= */
const SCENES = [];
function estDur(el) { return Math.max(.7, el.replace(/[^\p{L}\p{N}]/gu, '').length / 13 + .25 * (el.match(/[.,;!?…]/g) || []).length); }
function compileScene(cfg) {
  const sc = { events: [], fade: true, ...cfg, M: { L: [] } };
  if (cfg.steps) {
    let cur = cfg.start ?? .6, n = 0; sc.lines = []; sc.shots = [];
    for (const st of cfg.steps) {
      if (st.who) {
        const a = cur + (st.gap ?? .3), key = `${sc.id}/${String(++n).padStart(2, '0')}`;
        const d = (window.CLIP_DUR || {})[key] ?? estDur(st.el), b = a + d + .12;
        const L = { ...st, a, b }; sc.lines.push(L); sc.M.L.push(L);
        if (st.mark) sc.M[st.mark] = L;
        const cam = st.cam ?? (cfg.autoCam ? cfg.autoCam(st.who, st) : null);
        if (cam) sc.shots.push([st.cam ? cur : a - .15, cam]);
        cur = b + (st.after || 0);
      } else {
        const a = cur + (st.gap || 0), b = a + st.d;
        sc.M[st.act] = { a, b };
        if (st.cam) sc.shots.push([a, st.cam]);
        cur = b;
      }
    }
    sc.dur = cur + (cfg.tail ?? .8);
    if (cfg.events) sc.events = cfg.events(sc.M);
  }
  return sc;
}
function defineScene(cfg) { SCENES.push(cfg); }
/* current shot for step-based scenes: returns [name, startTime] */
function shotAt(sc, t) {
  let s = sc.shots[0] || [0, null];
  for (const sh of sc.shots) if (sh[0] <= t) s = sh; else break;
  return s;
}

/* =========================================================
   PLAYER (one timeline for all scenes of the episode)
   ========================================================= */
let T = 0, started = false, lang = 'el', EP = null, SCENE = null, FLAP = 0;
function talk(who, t) {
  for (const L of SCENE.lines) if (L.who === who && t >= L.a && t < L.b) return .3 + .7 * Math.abs(Math.sin(FLAP * 13 + who.length));
  return 0;
}
const speakingNow = (t) => SCENE.lines.find(l => t >= l.a && t < l.b);
function drawSubs(t) {
  const L = SCENE.lines.find(l => t >= l.a && t < l.b); if (!L || L.nosub) return;
  const V = voiceInfo(SCENE, L.who), s = lang === 'el' ? L.el : L.en, name = L.label ? L.label[lang === 'el' ? 0 : 1] : (lang === 'el' ? V.el : V.en);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = '700 29px "Noto Sans", sans-serif';
  const words = s.split(' '), rows = []; let cur = '';
  for (const w of words) { const c = cur ? cur + ' ' + w : w; if (ctx.measureText(c).width > 1000 && cur) { rows.push(cur); cur = w; } else cur = c; }
  rows.push(cur);
  const lh = 38, bw = Math.max(...rows.map(r => ctx.measureText(r).width)) + 56, bh = rows.length * lh + 24, bx = 640 - bw / 2, by = 696 - bh;
  ctx.fillStyle = 'rgba(18,14,20,.8)'; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 12); ctx.fill();
  if (name) {
    ctx.font = '700 17px "Noto Sans", sans-serif'; const nw = ctx.measureText(name).width + 24;
    ctx.fillStyle = V.col; ctx.beginPath(); ctx.roundRect(bx + 18, by - 14, nw, 28, 8); ctx.fill();
    txt(name, bx + 18 + nw / 2, by, 17, INK, { font: TVFONT });
  }
  rows.forEach((r, i) => txt(r, 640, by + 12 + lh / 2 + i * lh, 29, '#fffaf0', { font: TVFONT }));
}
/* manga post-process: grayscale + contrast + halftone + panel border, k = 0..1 */
let _buf = null;
function mangaize(k = 1, border = true) {
  if (k <= 0) return;
  if (!_buf) { _buf = document.createElement('canvas'); _buf.width = W; _buf.height = H; }
  const b = _buf.getContext('2d'); b.setTransform(1, 0, 0, 1, 0, 0); b.clearRect(0, 0, W, H); b.drawImage(cv, 0, 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = k;
  ctx.filter = 'grayscale(1) contrast(2.2) brightness(1.1)'; ctx.drawImage(_buf, 0, 0); ctx.filter = 'none';
  ctx.globalAlpha = k * .35; ctx.fillStyle = INK;
  for (let y = 0; y < H; y += 10) for (let x = (y / 10) % 2 ? 5 : 0; x < W; x += 10) { const r = .6 + Math.hypot(x - 640, y - 360) / 520; ctx.fillRect(x, y, r, r); }
  ctx.globalAlpha = k;
  if (border) { ctx.lineWidth = 16; ctx.strokeStyle = '#111'; ctx.strokeRect(8, 8, W - 16, H - 16); }
  ctx.restore();
}
function speedLines(cx = 640, cy = 360, n = 60, r0 = 220, col = '#111', seed = 0) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = col;
  for (let i = 0; i < n; i++) { const a = hash(i + seed + BOIL) * TAU, r = r0 + hash(i + 9 + BOIL) * 120; ctx.lineWidth = 1 + hash(i + 3) * 5; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.lineTo(cx + Math.cos(a) * 1500, cy + Math.sin(a) * 1500); ctx.stroke(); }
  ctx.restore();
}
function sfxText(s, x, y, size, rot = -.1, col = '#fff', sc = INK) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); txt(s, 0, 0, size, col, { font: TVFONT, style: 'italic', weight: 900, stroke: size / 6, sc }); ctx.restore();
}
function runEpisode(list, opts = {}) {
  const scenes = list.map(compileScene);
  let off = 0; for (const sc of scenes) { sc.off = off; off += sc.dur; }
  EP = { scenes, dur: off, cur: 0 }; SCENE = scenes[0];
  const $ = id => document.getElementById(id);
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const idxAt = t => { let i = 0; while (i < scenes.length - 1 && t >= scenes[i + 1].off) i++; return i; };
  $('scrub').max = EP.dur;
  const chap = $('chap');
  if (chap) {
    chap.innerHTML = scenes.map((s, i) => `<option value="${i}">${s.title || s.id}</option>`).join('');
    chap.onchange = () => { stopVO(); T = scenes[+chap.value].off + .001; started = true; setScene(); updateUI(); };
    if (scenes.length < 2) chap.hidden = true;
  }
  const setScene = () => { const i = idxAt(T); if (i !== EP.cur || SCENE !== scenes[i]) { EP.cur = i; SCENE = scenes[i]; queueClips(); if (chap) chap.value = i; } };
  const updateUI = () => {
    $('play').textContent = playing ? '❚❚ Pause' : '▶ Play';
    $('big').hidden = playing || started;
    $('lang').textContent = lang === 'el' ? 'EN' : 'ΕΛ';
    $('snd').textContent = soundOn ? '🔊' : '🔇';
    $('vo').style.opacity = voOn ? 1 : .45;
  };
  const play = () => { if (T >= EP.dur) T = 0; setScene(); ensureAudio(); playing = true; started = true; updateUI(); };
  const pause = () => { playing = false; stopVO(); updateUI(); };
  $('big').onclick = play;
  $('play').onclick = () => playing ? pause() : play();
  $('restart').onclick = () => { stopVO(); T = 0; play(); };
  $('scrub').oninput = e => { stopVO(); T = +e.target.value; started = true; setScene(); updateUI(); };
  $('lang').onclick = () => { lang = lang === 'el' ? 'en' : 'el'; updateUI(); };
  $('snd').onclick = () => { soundOn = !soundOn; if (soundOn) ensureAudio(); else stopVO(); updateUI(); };
  $('vo').onclick = () => { voOn = !voOn; if (!voOn) stopVO(); updateUI(); };
  $('fs').onclick = () => { document.fullscreenElement ? document.exitFullscreen() : $('stage').requestFullscreen?.(); };
  window.addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); }
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') { stopVO(); T = clamp(T + (e.code === 'ArrowRight' ? 5 : -5), 0, EP.dur); started = true; setScene(); updateUI(); }
  });
  const draw = (t) => {
    const sc = SCENE, lt = t - sc.off;
    SEED = 0; BOIL = Math.floor(lt * 8);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
    sc.render(lt, sc.M, sc);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    if (sc.fade) {
      const f = Math.max(sc.fadeIn === false ? 0 : 1 - prog(lt, 0, .35), sc.fadeOut === false ? 0 : prog(lt, sc.dur - .35, sc.dur));
      if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
    }
    drawSubs(lt);
  };
  let last = null;
  const frame = now => {
    if (last == null) last = now;
    const dt = Math.min(.05, (now - last) / 1000); last = now; FLAP = now / 1000;
    if (playing) {
      const sc = SCENE, prev = T - sc.off;
      // hold at the end of the current line while its voice is still going
      const cur = sc.lines.find(l => prev >= l.a && prev < l.b);
      const hold = speaking && cur && prev + dt >= cur.b - .02 && performance.now() - speakStart < speakMax * 1000;
      if (!hold) T += dt;
      if (T >= sc.off + sc.dur && EP.cur < scenes.length - 1) { T = sc.off + sc.dur; }
      const lt = Math.min(T - sc.off, sc.dur);
      if (soundOn && AC) for (const [et, fn] of sc.events) if (et > prev && et <= lt) fn();
      sc.lines.forEach((L, i) => { if (L.a > prev && L.a <= lt) voiceLine(sc, L, i); });
      if (soundOn && AC && lt > 0) {
        const i = sc.lines.findIndex(l => lt >= l.a && lt < l.b), L = sc.lines[i];
        if (L && !hasClip(sc, i) && !pendingKey && (!voOn || !greekVoice) && Math.floor(lt / .085) > Math.floor(prev / .085)) tone(voiceInfo(sc, L.who).babble * (.85 + Math.random() * .35), .07, 'triangle', .04, .9 + Math.random() * .3);
      }
      if (T >= EP.dur) { T = EP.dur; pause(); }
      setScene();
    }
    if (AC) {
      const lt = T - SCENE.off, a = SCENE.ambience ? SCENE.ambience(lt, SCENE.M) : {}, n = AC.currentTime, on = soundOn && playing;
      amb.cG.gain.setTargetAtTime(on ? a.cicada || 0 : 0, n, .08); amb.mG.gain.setTargetAtTime(on ? a.mosq || 0 : 0, n, .08);
      amb.krG.gain.setTargetAtTime(on ? a.cricket || 0 : 0, n, .08); amb.hG.gain.setTargetAtTime(on ? a.hum || 0 : 0, n, .08);
    }
    draw(started ? T : (opts.poster ?? scenes[0].poster ?? 0));
    $('scrub').value = T; $('time').textContent = `${fmt(T)} / ${fmt(EP.dur)}`;
    requestAnimationFrame(frame);
  };
  window.renderAt = t => { started = true; T = t; setScene(); updateUI(); draw(t); return { scene: SCENE.id, local: t - SCENE.off }; };
  window.EPISODE = EP;
  updateUI(); requestAnimationFrame(frame);
}
function runScene(cfg) { runEpisode([cfg], { poster: cfg.poster }); }
