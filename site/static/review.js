/* Review overlay for an episode draft (injected by server.py into /review/<ep>).
   Tap/click the frame → the player pauses and a quick menu opens at that point: 🎨 visual (one tap saves), 🔊 audio, ⏱ timing, 💬 line, 👍 like, ✍️ comment.
   📍 button or V = "visual check here" without pausing; C = comment. Each note keeps the time, scene, line, point on the frame and a snapshot.
   It only reads the player's own elements (#scrub, #play, #c, EPISODE), so the episode builds don't change. */
(() => {
  const R = window.REVIEW, $ = id => document.getElementById(id);
  const CATS = {
    visual: { icon: '🎨', el: 'Οπτικό', col: '#e8392b' }, audio: { icon: '🔊', el: 'Φωνή/ήχος', col: '#3a7bd5' }, timing: { icon: '⏱', el: 'Timing', col: '#e89a1a' },
    line: { icon: '💬', el: 'Ατάκα', col: '#8e44ad' }, like: { icon: '👍', el: 'Μ\'αρέσει', col: '#2e9e5b' }, comment: { icon: '✍️', el: 'Σχόλιο', col: '#231a2e' },
  };
  const QKEY = 'rv-queue-' + R.ep;
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const store = { get: k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };

  const TOUCH = matchMedia('(pointer: coarse)').matches;   // phones/tablets: touch hints, bottom-sheet menu, pinch zoom
  let NOTES = [], menu = null, form = null;
  const stage = $('stage'), cv = $('c'), scrub = $('scrub');

  /* ---------- where are we in the episode ---------- */
  const playing = () => /❚❚/.test($('play').textContent);
  const pause = () => { if (playing()) $('play').click(); };
  const resume = () => { if (!playing()) $('play').click(); };
  const jump = t => { scrub.value = t; scrub.dispatchEvent(new Event('input')); };
  function here() {
    const t = +scrub.value, sc = [...EPISODE.scenes].reverse().find(s => t >= s.off) || EPISODE.scenes[0], lt = t - sc.off;
    const i = sc.lines.findIndex(l => lt >= l.a - .15 && lt < l.b + .3), L = sc.lines[i];
    return { t, scene: sc.id, sceneTitle: sc.title || sc.id, lt, line: L ? { i, who: L.who, el: L.el } : {} };
  }
  function snapshot(x, y) {                         // 640×360 JPEG of the current frame, with a ring where you tapped
    const c = document.createElement('canvas'); c.width = 640; c.height = 360;
    const g = c.getContext('2d'); g.drawImage(cv, 0, 0, 640, 360);
    if (x != null) { g.lineWidth = 4; g.strokeStyle = '#ff2d2d'; g.beginPath(); g.arc(x / 2, y / 2, 22, 0, Math.PI * 2); g.stroke(); g.lineWidth = 2; g.strokeStyle = '#fff'; g.beginPath(); g.arc(x / 2, y / 2, 26, 0, Math.PI * 2); g.stroke(); }
    try { return c.toDataURL('image/jpeg', .72); } catch (e) { return ''; }
  }

  /* ---------- saving (with an offline queue) ---------- */
  const newId = () => Date.now().toString(36) + Math.random().toString(16).slice(2, 6);
  async function post(path, body) {
    const r = await fetch(`/api/review/${R.ep}/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' });
    if (r.status === 401) { toast('Η σύνδεση έληξε · <a href="/review/login">είσοδος</a>', 0); throw new Error('login'); }
    if (!r.ok) throw new Error('http ' + r.status);
    return r.json();
  }
  async function save(note) {
    try { await post('notes', note); } catch (e) {
      if (e.message === 'login') return;
      store.set(QKEY, [...(store.get(QKEY) || []), note]); toast('Χωρίς σύνδεση · το σχόλιο θα σταλεί αυτόματα', 3000); status();
    }
    load();
  }
  async function flush() {
    const q = store.get(QKEY) || []; if (!q.length) return;
    const left = [];
    for (const n of q) { try { await post('notes', n); } catch (e) { left.push(n); } }
    store.set(QKEY, left); status(); if (left.length < q.length) load();
  }
  async function load() {
    try { const r = await fetch(`/api/review/${R.ep}/notes`, { credentials: 'same-origin', cache: 'no-store' }); if (r.ok) { NOTES = (await r.json()).notes; draw(); } } catch (e) { }
  }
  function note(cat, pos, text, shot) {
    const h = here();
    save({ id: newId(), build: R.build, ...h, x: pos ? Math.round(pos.x) : null, y: pos ? Math.round(pos.y) : null, cat, text: text || '', shot });
    toast(`✓ ${CATS[cat].icon} ${CATS[cat].el} · ${fmt(h.t)}`, 1600);
  }

  /* ---------- the quick menu ---------- */
  function closeMenu() { menu?.remove(); menu = null; form?.remove(); form = null; stage.querySelectorAll(':scope > .rv-dot').forEach(d => d.remove()); }
  function openMenu(ev) {
    closeMenu();
    const r = cv.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    const pos = { x: (ev.clientX - r.left) / r.width * 1280, y: (ev.clientY - r.top) / r.height * 720 };
    const was = playing(); pause();
    const shot = snapshot(pos.x, pos.y);
    if (sr.width < 600) return openSheet(ev, pos, shot, was, sr);
    const rad = Math.min(78, sr.height * .3), cx = Math.min(Math.max(ev.clientX - sr.left, rad + 28), sr.width - rad - 28), cy = Math.min(Math.max(ev.clientY - sr.top, rad + 28), sr.height - rad - 28);
    menu = el('div', 'rv-menu'); menu.style.left = cx + 'px'; menu.style.top = cy + 'px';
    const dot = el('div', 'rv-dot'); dot.style.left = (ev.clientX - sr.left - cx) + 'px'; dot.style.top = (ev.clientY - sr.top - cy) + 'px'; menu.append(dot);
    const keys = Object.keys(CATS);
    keys.forEach((k, i) => {
      const a = -Math.PI / 2 + i / keys.length * Math.PI * 2, b = el('button', 'rv-opt', `<span>${CATS[k].icon}</span><small>${CATS[k].el}</small>`);
      b.style.left = Math.cos(a) * rad + 'px'; b.style.top = Math.sin(a) * rad + 'px'; b.style.setProperty('--c', CATS[k].col);
      b.onclick = e => {
        e.stopPropagation();
        if (k === 'visual') { closeMenu(); note('visual', pos, '', shot); if (was) resume(); }   // the one-tap flag
        else { menu.remove(); menu = null; ask(k, pos, shot, was); }
      };
      menu.append(b);
    });
    const x = el('button', 'rv-x', '✕'); x.title = 'Άκυρο'; x.onclick = e => { e.stopPropagation(); closeMenu(); if (was) resume(); }; menu.append(x);
    stage.append(menu);
  }
  function openSheet(ev, pos, shot, was, sr) {      // phones: the six choices as a sheet under the frame (the frame is too small for the ring)
    menu = el('div', 'rv-sheet');
    const dot = el('div', 'rv-dot'); dot.style.left = (ev.clientX - sr.left) + 'px'; dot.style.top = (ev.clientY - sr.top) + 'px'; stage.append(dot);
    menu.innerHTML = `<div class="rv-sheet-h">${fmt(+scrub.value)} · τι είδες;</div><div class="rv-sheet-g">${Object.keys(CATS).map(k => `<button class="rv-opt2" data-k="${k}" style="--c:${CATS[k].col}"><span>${CATS[k].icon}</span>${CATS[k].el}</button>`).join('')}</div><button class="rv-sheet-x">Άκυρο</button>`;
    const close = () => { dot.remove(); closeMenu(); };
    menu.onclick = e => {
      e.stopPropagation(); const b = e.target.closest('.rv-opt2');
      if (e.target.closest('.rv-sheet-x')) { close(); if (was) resume(); return; }
      if (!b) return; const k = b.dataset.k; dot.remove(); menu.remove(); menu = null;
      if (k === 'visual') { note('visual', pos, '', shot); if (was) resume(); } else ask(k, pos, shot, was);
    };
    document.body.append(menu);
  }
  function ask(cat, pos, shot, was) {                // one line of text (optional except for ✍️), then save
    form = el('form', 'rv-form', `<span class="rv-cat" style="--c:${CATS[cat].col}">${CATS[cat].icon} ${CATS[cat].el} · ${fmt(+scrub.value)}</span>
      <input name="t" maxlength="2000" autocomplete="off" placeholder="${cat === 'comment' ? 'Γράψε το σχόλιο…' : 'Προαιρετικό σχόλιο…'}"><button class="rv-ok">Αποθήκευση</button><button type="button" class="rv-cancel">✕</button>`);
    const inp = form.querySelector('input');
    inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Escape') { closeMenu(); if (was) resume(); } });   // keep Space/arrows away from the player
    form.onsubmit = e => { e.preventDefault(); const text = inp.value.trim(); if (cat === 'comment' && !text) return inp.focus(); closeMenu(); note(cat, pos, text, shot); if (was) resume(); };
    form.querySelector('.rv-cancel').onclick = () => { closeMenu(); if (was) resume(); };
    (stage.getBoundingClientRect().width < 600 ? document.body : stage).append(form); if (stage.getBoundingClientRect().width < 600) form.classList.add('rv-form-sheet'); setTimeout(() => inp.focus(), 30);
  }
  cv.addEventListener('click', e => { if (!$('big').hidden) return; if (menu || form) return closeMenu(); openMenu(e); });

  /* ---------- the notes bar + list under the player ---------- */
  const panel = el('section', 'rv-panel');
  const vurl = n => `/review/${R.ep}${n === R.latest ? '' : '/v' + n}`;
  const vopts = [...R.versions].reverse().map(v => `<option value="${v.n}"${v.n === R.ver ? ' selected' : ''}>v${v.n} · ${esc(v.ts)}${v.n === R.latest ? ' (τελευταίο)' : ''}</option>`).join('');
  panel.innerHTML = `${R.ver !== R.latest ? `<div class="rv-oldver">Βλέπεις το παλιό revision <b>v${R.ver}</b> · <a href="${vurl(R.latest)}">πήγαινε στο τελευταίο (v${R.latest})</a></div>` : ''}
    <div class="rv-head"><b>REVIEW</b> <span>${esc(R.ep)}</span> <select class="rv-ver" title="Revision">${vopts}</select> <span class="rv-q"></span>
    <span class="rv-sp"></span><button class="rv-pin" title="Οπτικός έλεγχος εδώ (V)">📍 Σημάδι</button><button class="rv-com" title="Σχόλιο (C)">✍️ Σχόλιο</button>
    ${R.role === 'owner' ? `<a href="/review/${R.ep}/log" target="_blank">log</a> <a href="/review/users" target="_blank">χρήστες</a>` : `<span class="rv-me">${esc(R.user)} · συνεργάτης</span>`}</div>
    <label class="rv-allv"><input type="checkbox" class="rv-all"> Σχόλια από όλα τα revision</label>
    ${R.role === 'owner' ? '<label class="rv-allv"><input type="checkbox" class="rv-com-on"> Σχόλια κοινότητας <span class="rv-com-n"></span></label>' : ''}
    <div class="rv-help"><button class="rv-tour-btn" title="Ξενάγηση">?</button> ${TOUCH ? 'Πάτα πάνω στο καρέ για να αφήσεις σχόλιο εκεί · 📍 = γρήγορο σημάδι' : ''}<span class="rv-keys">Πάτα πάνω στο καρέ για γρήγορο μενού · V = σημάδι χωρίς παύση · C = σχόλιο</span></div><ol class="rv-list"></ol>
    <section class="rv-gen"><h3>Γενικά σχόλια για το επεισόδιο</h3><p class="rv-meta">Ιδέες, απορίες και σχόλια για όλο το επεισόδιο (όχι για μια συγκεκριμένη στιγμή). Ψήφισε ▲ ▼ ό,τι συμφωνείς ή διαφωνείς.</p>
    <form class="rv-gform"><select name="kind"><option value="idea">💡 Ιδέα</option><option value="comment" selected>💬 Σχόλιο</option><option value="question">❓ Ερώτηση</option></select>
    <textarea name="text" maxlength="4000" rows="2" placeholder="Γράψε κάτι για το επεισόδιο…"></textarea><button class="rv-ok">Δημοσίευση</button></form>
    <div class="rv-gsort">Ταξινόμηση: <button data-s="top" class="on">Κορυφαία</button><button data-s="new">Νεότερα</button></div><ol class="rv-glist"></ol></section>`;
  document.querySelector('.bar').after(panel);
  const hp = document.querySelector('header p'); if (hp) hp.textContent = hp.textContent.replace(/\s*·\s*space\s*=.*$/i, '');

  /* ---------- transport + precision timeline (Premiere-style) ----------
     Buttons and keys step by 5 s / 1 s / one frame (1/30 s, the MP4's rate). The timeline zooms (wheel, +/−, slider) from the whole
     episode down to a few seconds; dragging moves the playhead at the zoom's scale, Shift+drag 10× finer. Positions snap to frames. */
  function initTL() {
  const FPS = 30, snap = t => Math.round(t * FPS) / FPS, clampT = t => Math.min(Math.max(t, 0), EPISODE.dur);
  const tc = s => { const f = Math.round(s * FPS), ss = Math.floor(f / FPS); return `${Math.floor(ss / 60)}:${String(ss % 60).padStart(2, '0')}:${String(f % FPS).padStart(2, '0')}`; };
  scrub.step = 'any';
  const seek = t => { pause(); jump(snap(clampT(t))); };
  const tp = el('div', 'rv-tp');
  tp.innerHTML = `<div class="rv-tbtns"><button data-d="-5" title="−5 s (Shift+←)">−5s</button><button data-d="-1" title="−1 s (←)">−1s</button><button data-d="-f" title="−1 καρέ (,)">◀︎ καρέ</button>
    <span class="rv-tc" title="λεπτά:δευτερόλεπτα:καρέ">0:00:00</span><button data-d="+f" title="+1 καρέ (.)">καρέ ▶︎</button><button data-d="1" title="+1 s (→)">+1s</button><button data-d="5" title="+5 s (Shift+→)">+5s</button></div>
    <div class="rv-tl-wrap"><canvas class="rv-tl"></canvas></div>
    <div class="rv-zoom"><button data-z="out" title="Zoom out (−)">−</button><input type="range" min="0" max="1000" value="0" aria-label="Zoom"><button data-z="in" title="Zoom in (+)">+</button><button data-z="fit">Όλο</button>
    <span class="rv-zhint">${TOUCH ? 'σύρε στη μπάρα = μετακίνηση · δύο δάχτυλα (τσίμπημα) ή + − = zoom, μέχρι το καρέ' : 'ροδέλα = zoom · σύρε = μετακίνηση · Shift+σύρε = λεπτομέρεια · , . = καρέ'}</span></div>`;
  document.querySelector('.bar').after(tp);
  const tlc = tp.querySelector('.rv-tl'), tg = tlc.getContext('2d'), zs = tp.querySelector('.rv-zoom input'), tcEl = tp.querySelector('.rv-tc');
  const MINSPAN = 4;
  let span = EPISODE.dur, v0 = 0;                     // the visible window [v0, v0 + span]
  const setSpan = (s, at) => { const k = at == null ? .5 : (at - v0) / span; span = Math.min(EPISODE.dur, Math.max(MINSPAN, s)); v0 = Math.min(Math.max((at ?? v0 + span / 2) - k * span, 0), EPISODE.dur - span);
    zs.value = Math.round(Math.log(EPISODE.dur / span) / Math.log(EPISODE.dur / MINSPAN) * 1000); };
  zs.oninput = () => { const s = EPISODE.dur / Math.pow(EPISODE.dur / MINSPAN, zs.value / 1000); setSpan(s, +scrub.value); };
  tp.querySelector('.rv-zoom').onclick = e => { const z = e.target.dataset?.z; if (!z) return; if (z === 'fit') setSpan(EPISODE.dur, 0); else setSpan(span * (z === 'in' ? .5 : 2), +scrub.value); };
  tp.querySelector('.rv-tbtns').onclick = e => { const d = e.target.closest('button')?.dataset.d; if (!d) return; const t = +scrub.value; seek(d === '-f' ? snap(t) - 1 / FPS : d === '+f' ? snap(t) + 1 / FPS : t + +d); };
  window.addEventListener('keydown', e => {          // capture phase: replaces the player's own ±5 s arrows inside the review
    if (e.target.closest?.('input, textarea, select') || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = +scrub.value; let to = null;
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') to = t + (e.code === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 5 : 1);
    else if (e.code === 'Period') to = snap(t) + 1 / FPS; else if (e.code === 'Comma') to = snap(t) - 1 / FPS;
    else if (e.key === '+' || e.key === '=') { setSpan(span * .5, t); e.preventDefault(); return; } else if (e.key === '-') { setSpan(span * 2, t); e.preventDefault(); return; }
    if (to == null) return;
    e.preventDefault(); e.stopImmediatePropagation(); seek(to);
  }, true);
  const xOf = t => (t - v0) / span * tlc.clientWidth, tOf = x => v0 + x / tlc.clientWidth * span;
  let drag = null; const PT = new Map(); let pinch = null;
  const pinchState = () => { const [a, b] = [...PT.values()], r = tlc.getBoundingClientRect(); return { d: Math.abs(a.x - b.x) || 1, at: tOf((a.x + b.x) / 2 - r.left), span }; };
  tlc.addEventListener('pointerdown', e => {
    PT.set(e.pointerId, { x: e.clientX }); tlc.setPointerCapture(e.pointerId);
    if (PT.size === 2) { drag = null; pinch = pinchState(); return; }
    const r = tlc.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const hit = y > 30 && shownAll().find(n => Math.abs(xOf(n.t) - x) < 7 && (n.community ? y > 52 : y <= 52));
    if (hit) { focusNote(hit); return; }
    tlc.setPointerCapture(e.pointerId); drag = { x0: x, t0: tOf(x) }; seek(tOf(x));
  });
  tlc.addEventListener('pointermove', e => {
    if (PT.has(e.pointerId)) PT.set(e.pointerId, { x: e.clientX });
    if (pinch && PT.size === 2) { const [a, b] = [...PT.values()]; setSpan(pinch.span * pinch.d / (Math.abs(a.x - b.x) || 1), pinch.at); return; }
    if (!drag) return; const x = e.clientX - tlc.getBoundingClientRect().left;
    seek(e.shiftKey ? drag.t0 + (x - drag.x0) / tlc.clientWidth * span * .1 : tOf(x));
  });
  const end = e => { PT.delete(e.pointerId); if (PT.size < 2) pinch = null; drag = null; }; tlc.addEventListener('pointerup', end); tlc.addEventListener('pointercancel', end);
  tlc.addEventListener('wheel', e => { e.preventDefault(); const x = e.clientX - tlc.getBoundingClientRect().left;
    if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) { v0 = Math.min(Math.max(v0 + (e.deltaX || e.deltaY) / tlc.clientWidth * span, 0), EPISODE.dur - span); return; }
    setSpan(span * Math.pow(1.0015, e.deltaY), tOf(x)); }, { passive: false });
  const STEPS = [1 / FPS, 5 / FPS, 10 / FPS, .5, 1, 2, 5, 10, 15, 30, 60, 120, 300];
  function drawTL() {
    const w = tlc.clientWidth, h = 74, dpr = devicePixelRatio || 1;
    if (tlc.width !== Math.round(w * dpr)) { tlc.width = Math.round(w * dpr); tlc.height = h * dpr; }
    tg.setTransform(dpr, 0, 0, dpr, 0, 0); tg.clearRect(0, 0, w, h);
    const css = getComputedStyle(tp), ink = css.getPropertyValue('--ink').trim() || '#231a2e', mut = css.getPropertyValue('--muted').trim() || '#888';
    const t = +scrub.value;
    if (playing() && (t < v0 || t > v0 + span)) v0 = Math.min(Math.max(t - span * .1, 0), EPISODE.dur - span);   // follow the playhead
    // scenes: alternating bands with their titles
    EPISODE.scenes.forEach((sc, i) => { const a = xOf(sc.off), b = xOf(sc.off + sc.dur); if (b < 0 || a > w) return;
      tg.fillStyle = i % 2 ? 'rgba(128,128,128,.10)' : 'rgba(128,128,128,.20)'; tg.fillRect(a, 0, b - a, 16);
      if (b - a < 34) return; tg.fillStyle = mut; tg.font = '600 10px "Noto Sans", sans-serif'; tg.save(); tg.beginPath(); tg.rect(a, 0, b - a, 16); tg.clip(); tg.fillText(sc.title || sc.id, Math.max(a, 0) + 4, 12); tg.restore(); });
    // ruler: the finest step that keeps ~70 px between labels
    const step = STEPS.find(s => s / span * w >= 70) || 600, minor = step >= 1 ? step / 5 : step / (step < .5 ? 1 : 5);
    tg.strokeStyle = mut; tg.fillStyle = mut; tg.font = '10px "Noto Sans", sans-serif'; tg.lineWidth = 1;
    for (let s = Math.floor(v0 / minor) * minor; s <= v0 + span; s += minor) { const x = Math.round(xOf(s)) + .5, major = Math.abs(s / step - Math.round(s / step)) < 1e-6;
      tg.beginPath(); tg.moveTo(x, 16); tg.lineTo(x, major ? 28 : 22); tg.stroke(); if (major) tg.fillText(step < 1 ? tc(s) : fmt(s), x + 3, 27); }
    // note lanes: the director's on top, the community's below (hollow)
    tg.fillStyle = 'rgba(128,128,128,.12)'; tg.fillRect(0, 32, w, 18); if (HAS_COMMUNITY) tg.fillRect(0, 54, w, 18);
    for (const n of shownAll()) { const x = xOf(n.t); if (x < -8 || x > w + 8) continue; const c = CATS[n.cat]?.col || '#888', y = n.community ? 63 : 41;
      tg.globalAlpha = n.status === 'open' ? 1 : .35; tg.beginPath(); tg.arc(x, y, 6, 0, Math.PI * 2);
      if (n.community) { tg.lineWidth = 2.5; tg.strokeStyle = c; tg.stroke(); } else { tg.fillStyle = c; tg.fill(); } tg.globalAlpha = 1; }
    // playhead
    const px = xOf(t); if (px >= 0 && px <= w) { tg.fillStyle = '#e8392b'; tg.fillRect(px - 1, 0, 2, h); tg.beginPath(); tg.moveTo(px - 6, 0); tg.lineTo(px + 6, 0); tg.lineTo(px, 8); tg.fill(); }
    tcEl.textContent = tc(t);
    requestAnimationFrame(drawTL);
  }
  setSpan(EPISODE.dur, 0); requestAnimationFrame(drawTL);
  }
  const list = panel.querySelector('.rv-list'), allv = panel.querySelector('.rv-all');
  panel.querySelector('.rv-ver').onchange = e => { location.href = vurl(+e.target.value); };
  allv.checked = !!store.get('rv-allv'); allv.onchange = () => { store.set('rv-allv', allv.checked); draw(); };
  const shown = () => allv.checked ? NOTES : NOTES.filter(n => n.ver === R.ver);
  const comOn = panel.querySelector('.rv-com-on');
  if (comOn) { comOn.checked = store.get('rv-com') !== false; comOn.onchange = () => { store.set('rv-com', comOn.checked); draw(); }; }
  const hideCom = () => comOn ? !comOn.checked : false;
  let HAS_COMMUNITY = R.role !== 'owner';
  const shownAll = () => shown().filter(n => !n.community || !hideCom());
  function focusNote(n) { jump(n.t); const li = $('rv-' + n.id); li?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); li?.classList.add('rv-hl'); setTimeout(() => li?.classList.remove('rv-hl'), 1500); }
  const pin = () => { const h = here(); note('visual', null, 'σημάδι για οπτικό έλεγχο', snapshot(null, null)); return h; };
  const comment = () => { const was = playing(); pause(); closeMenu(); ask('comment', null, snapshot(null, null), was); };
  panel.querySelector('.rv-pin').onclick = pin;
  panel.querySelector('.rv-com').onclick = comment;
  window.addEventListener('keydown', e => {
    if (e.target.closest?.('input, textarea, select') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code === 'KeyV') pin();
    if (e.code === 'KeyC') comment();
    if (e.code === 'Escape') closeMenu();
  });
  function status() { const q = (store.get(QKEY) || []).length; panel.querySelector('.rv-q').textContent = q ? `· ${q} σε αναμονή` : ''; }
  function draw() {
    const S = shownAll();
    allv.parentElement.lastChild.textContent = ` Σχόλια από όλα τα revision (${NOTES.length})`;
    if (R.role === 'owner') { const nc = NOTES.filter(n => n.community).length; HAS_COMMUNITY = nc > 0; panel.querySelector('.rv-com-n').textContent = `(${nc})`; }
    list.innerHTML = S.map(n => {
      const c = CATS[n.cat] || CATS.comment, old = n.ver !== R.ver;
      const mine = n.community ? n.uid === R.uid : R.role === 'owner';
      const actions = (n.community ? voteBox(n, 'note') : '') + (R.role === 'owner' && n.community ? `<button class="rv-adopt" data-id="${n.id}" title="Το παίρνω στα δικά μου σχόλια (για διόρθωση)">${n.adopted ? '✓ υιοθετήθηκε' : 'Υιοθέτηση'}</button>` : '')
        + (mine || R.role === 'owner' ? `<button class="rv-del" data-id="${n.id}" title="Διαγραφή">🗑</button>` : '');
      return `<li id="rv-${n.id}" class="${n.status}${n.community ? ' rv-cn' : ''}"><button class="rv-t" data-t="${n.t}" data-v="${n.ver || ''}">${fmt(n.t)}</button><span class="rv-ic" style="--c:${c.col}">${c.icon}</span>
        <div class="rv-body"><div>${n.text ? esc(n.text) : `<i>${esc(c.el)}</i>`}</div><div class="rv-meta">${esc(n.sceneTitle || n.scene)}${n.line?.el ? ` · ${esc(n.line.who)}: «${esc(n.line.el.slice(0, 80))}»` : ''} · ${n.community ? `<b class="rv-who">${esc(n.by)}</b>` : esc(n.by)} · <span class="${old ? 'rv-old' : 'rv-cur'}">v${n.ver || '?'}</span></div>
        ${n.from ? `<div class="rv-meta">από: ${esc(n.from)}</div>` : ''}${n.status !== 'open' && !n.community ? `<div class="rv-fix">${n.status === 'fixed' ? '✓ Διορθώθηκε' : '– Μένει ως έχει'}${n.rev ? ' · ' + esc(n.rev) : ''}${n.fixnote ? ' · ' + esc(n.fixnote) : ''}</div>` : ''}</div>
        ${n.shot ? `<a class="rv-shot" href="/review/shot/${R.ep}/${n.id}.jpg" target="_blank"><img src="/review/shot/${R.ep}/${n.id}.jpg" alt="" loading="lazy"></a>` : ''}
        ${actions}</li>`;
    }).join('') || `<li class="rv-empty">${NOTES.length ? 'Κανένα σχόλιο σε αυτό το revision.' : 'Κανένα σχόλιο ακόμα.'} Πάτα πάνω στο καρέ όπου δεις κάτι.</li>`;
    status();
  }
  list.onclick = async e => {
    if (await voteClick(e)) return;
    const t = e.target.closest('.rv-t');
    if (t && t.dataset.v && +t.dataset.v !== R.ver) { location.href = vurl(+t.dataset.v) + '#t=' + t.dataset.t; return; }   // a note on another revision: open that one
    if (t) { jump(+t.dataset.t); stage.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    const ad = e.target.closest('.rv-adopt'); if (ad) { const n = NOTES.find(n => n.id === ad.dataset.id); if (n && !n.adopted && confirm(`Υιοθέτηση του σχολίου του/της ${n.by}; Θα μπει στα δικά σου σχόλια για διόρθωση.`)) { try { await post('adopt', { id: n.id }); } catch (err) { } load(); } return; }
    const d = e.target.closest('.rv-del'); if (d && confirm('Διαγραφή αυτού του σχολίου;')) { try { await post('delete', { id: d.dataset.id }); } catch (err) { } load(); }
  };

  /* ---------- the tour (first visit of a collaborator; «?» opens it again) ---------- */
  const TOUR = [
    ['#stage', 'Καλώς ήρθες στην παραγωγή!', 'Εδώ παίζει το επεισόδιο, όπως είναι αυτή τη στιγμή στο εργαστήριο.' + (TOUCH ? '' : ' Space = play/pause.')],
    ['.rv-tbtns', 'Μπρος–πίσω με ακρίβεια', 'Πήγαινε 5 ή 1 δευτερόλεπτο, ή ένα καρέ τη φορά.' + (TOUCH ? '' : ' Πλήκτρα: ← → (με Shift 5 s), και , . για καρέ.')],
    ['.rv-tl-wrap', 'Το timeline', TOUCH ? 'Σύρε το δάχτυλο για να πας σε άλλη στιγμή. Με δύο δάχτυλα (τσίμπημα) ή με + − κάνεις zoom, μέχρι το καρέ. Οι κουκκίδες είναι σχόλια: πάτα μία για να πας εκεί.'
      : 'Σύρε για να πας σε άλλη στιγμή. Ροδέλα ή + − για zoom, μέχρι το καρέ. Με Shift το σύρσιμο γίνεται 10× πιο αργό. Οι κουκκίδες είναι σχόλια: πάτα μία για να πας εκεί.'],
    ['#c', 'Είδες κάτι; Πάτα πάνω του', (TOUCH ? 'Άγγιξε' : 'Κλικ στο') + ' σημείο του καρέ: το επεισόδιο σταματά και ανοίγει μενού. 🎨 οπτικό, 🔊 φωνή/ήχος, ⏱ timing, 💬 ατάκα, 👍 μ\'αρέσει, ✍️ σχόλιο. Κρατάμε τη στιγμή, το σημείο και μια φωτογραφία του καρέ.'],
    ['.rv-head', 'Revision και γρήγορα σημάδια', 'Από τη λίστα διαλέγεις παλαιότερο revision. 📍' + (TOUCH ? '' : ' (ή V)') + ' = σημάδι χωρίς παύση, ✍️' + (TOUCH ? '' : ' (ή C)') + ' = σχόλιο. Τα σχόλιά σου τα βλέπουν ο δημιουργός και οι άλλοι συνεργάτες, με το όνομά σου.'],
    ['.rv-gen', 'Γενικά σχόλια και ψήφοι', 'Για ιδέες και σχόλια για όλο το επεισόδιο υπάρχει αυτή η ενότητα. Με ▲ ▼ ψηφίζεις σχόλια και ιδέες, δικά σου και των άλλων: έτσι ο δημιουργός βλέπει τι θέλει η ομάδα.'],
  ];
  function markToured() { if (R.toured) return; R.toured = true; fetch('/api/me/toured', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}', credentials: 'same-origin' }).catch(() => { }); }
  function tour(i = 0) {
    document.querySelector('.rv-tour')?.remove();
    if (i >= TOUR.length) return;
    const [sel, title, text] = TOUR[i], tgt = document.querySelector(sel); if (!tgt) return tour(i + 1);
    tgt.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = tgt.getBoundingClientRect(), o = el('div', 'rv-tour');
    o.innerHTML = `<div class="rv-tour-hole" style="left:${r.left - 6}px;top:${r.top - 6}px;width:${r.width + 12}px;height:${r.height + 12}px"></div>
      <div class="rv-tour-card" role="dialog" aria-label="${esc(title)}"><div class="rv-tour-n">${i + 1} / ${TOUR.length}</div><h3>${esc(title)}</h3><p>${esc(text)}</p>
      <div class="rv-tour-b"><button class="rv-tour-skip" title="Κλείνει την ξενάγηση· την ξαναβρίσκεις στο «?»">Παράλειψη</button>${i ? '<button class="rv-tour-prev">Πίσω</button>' : ''}<button class="rv-tour-next">${i === TOUR.length - 1 ? 'Ξεκινάμε!' : 'Επόμενο'}</button></div></div>`;
    document.body.append(o);
    const card = o.querySelector('.rv-tour-card'), ch = card.offsetHeight;
    card.style.top = (r.bottom + 14 + ch < innerHeight ? r.bottom + 14 : Math.max(10, r.top - ch - 14)) + 'px';
    o.querySelector('.rv-tour-next').onclick = () => tour(i + 1);
    o.querySelector('.rv-tour-prev')?.addEventListener('click', () => tour(i - 1));
    o.querySelector('.rv-tour-skip').onclick = () => tour(TOUR.length);
  }
  panel.querySelector('.rv-tour-btn').onclick = () => tour(0);

  /* ---------- votes + the general discussion ---------- */
  const KIND = { idea: '💡 Ιδέα', comment: '💬 Σχόλιο', question: '❓ Ερώτηση' };
  function voteBox(n, on) {
    return `<span class="rv-vote" data-id="${n.id}" data-on="${on}"><button class="rv-up${n.mine > 0 ? ' on' : ''}" title="Συμφωνώ" aria-label="Συμφωνώ">▲</button>`
      + `<b title="${n.up || 0} ▲ · ${n.down || 0} ▼">${n.score || 0}</b><button class="rv-down${n.mine < 0 ? ' on' : ''}" title="Διαφωνώ" aria-label="Διαφωνώ">▼</button></span>`;
  }
  async function voteClick(e) {
    const b = e.target.closest('.rv-up, .rv-down'); if (!b) return false;
    const box = b.closest('.rv-vote'), up = b.classList.contains('rv-up'), cur = b.classList.contains('on') ? 0 : up ? 1 : -1;
    try { await post('vote', { id: box.dataset.id, on: box.dataset.on, v: cur }); } catch (err) { }
    box.dataset.on === 'post' ? loadGen() : load(); return true;
  }
  const gen = panel.querySelector('.rv-gen'), glist = gen.querySelector('.rv-glist'), gform = gen.querySelector('.rv-gform');
  let POSTS = [], gsort = store.get('rv-gsort') || 'top';
  gen.querySelectorAll('.rv-gsort button').forEach(b => { b.classList.toggle('on', b.dataset.s === gsort); b.onclick = () => { gsort = b.dataset.s; store.set('rv-gsort', gsort); gen.querySelectorAll('.rv-gsort button').forEach(x => x.classList.toggle('on', x === b)); drawGen(); }; });
  gform.querySelector('textarea').addEventListener('keydown', e => e.stopPropagation());   // typing never drives the player
  gform.onsubmit = async e => {
    e.preventDefault(); const ta = gform.querySelector('textarea'), text = ta.value.trim(); if (!text) return ta.focus();
    try { await post('post', { text, kind: gform.querySelector('select').value, build: R.build }); ta.value = ''; } catch (err) { toast('Δεν στάλθηκε, δοκίμασε ξανά', 2500); }
    loadGen();
  };
  async function loadGen() { try { const r = await fetch(`/api/review/${R.ep}/general`, { credentials: 'same-origin', cache: 'no-store' }); if (r.ok) { POSTS = (await r.json()).posts; drawGen(); } } catch (e) { } }
  function drawGen() {
    const S = [...POSTS].sort((a, b) => gsort === 'top' ? (b.score - a.score) || b.ts.localeCompare(a.ts) : b.ts.localeCompare(a.ts));
    glist.innerHTML = S.map(n => `<li>${voteBox(n, 'post')}<div class="rv-body"><div class="rv-gk">${KIND[n.kind] || KIND.comment}</div><div class="rv-gt">${esc(n.text)}</div>
      <div class="rv-meta"><b class="${n.owner ? 'rv-own' : 'rv-who'}">${esc(n.by)}${n.owner ? ' · δημιουργός' : ''}</b> · ${esc(n.ts.slice(0, 16).replace('T', ' '))}${n.ver ? ' · v' + n.ver : ''}</div></div>
      ${R.role === 'owner' || (n.uid && n.uid === R.uid) ? `<button class="rv-gdel" data-id="${n.id}" title="Διαγραφή">🗑</button>` : ''}</li>`).join('') || '<li class="rv-empty">Κανένα γενικό σχόλιο ακόμα. Γράψε πρώτος!</li>';
  }
  glist.onclick = async e => {
    if (await voteClick(e)) return;
    const d = e.target.closest('.rv-gdel'); if (d && confirm('Διαγραφή;')) { try { await post('unpost', { id: d.dataset.id }); } catch (err) { } loadGen(); }
  };

  /* ---------- toast ---------- */
  let toastEl = null, toastT = 0;
  function toast(html, ms) { toastEl?.remove(); clearTimeout(toastT); toastEl = el('div', 'rv-toast', html); stage.append(toastEl); if (ms) toastT = setTimeout(() => { toastEl?.remove(); toastEl = null; }, ms); }

  /* ---------- start ---------- */
  const go = () => {
    if (!window.EPISODE) return setTimeout(go, 200);
    initTL(); load(); loadGen(); flush();
    if (R.uid && !R.toured) setTimeout(() => { tour(0); markToured(); }, 600);   // every new account, once: it never opens on its own again («?» does)
    if (new URLSearchParams(location.search).get('lang') === 'en' && $('lang').textContent.trim() === 'EN') $('lang').click();   // ?lang=en opens with English subtitles
    const m = location.hash.match(/t=([\d.]+)/); if (m) jump(+m[1]);                // links from the log page: /review/<ep>#t=123.4
    setInterval(flush, 15000); window.addEventListener('online', flush);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { load(); loadGen(); } });
  };
  go();
})();
