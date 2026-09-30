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
  function closeMenu() { menu?.remove(); menu = null; form?.remove(); form = null; }
  function openMenu(ev) {
    closeMenu();
    const r = cv.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    const pos = { x: (ev.clientX - r.left) / r.width * 1280, y: (ev.clientY - r.top) / r.height * 720 };
    const was = playing(); pause();
    const shot = snapshot(pos.x, pos.y);
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
  function ask(cat, pos, shot, was) {                // one line of text (optional except for ✍️), then save
    form = el('form', 'rv-form', `<span class="rv-cat" style="--c:${CATS[cat].col}">${CATS[cat].icon} ${CATS[cat].el} · ${fmt(+scrub.value)}</span>
      <input name="t" maxlength="2000" autocomplete="off" placeholder="${cat === 'comment' ? 'Γράψε το σχόλιο…' : 'Προαιρετικό σχόλιο…'}"><button class="rv-ok">Αποθήκευση</button><button type="button" class="rv-cancel">✕</button>`);
    const inp = form.querySelector('input');
    inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Escape') { closeMenu(); if (was) resume(); } });   // keep Space/arrows away from the player
    form.onsubmit = e => { e.preventDefault(); const text = inp.value.trim(); if (cat === 'comment' && !text) return inp.focus(); closeMenu(); note(cat, pos, text, shot); if (was) resume(); };
    form.querySelector('.rv-cancel').onclick = () => { closeMenu(); if (was) resume(); };
    stage.append(form); setTimeout(() => inp.focus(), 30);
  }
  cv.addEventListener('click', e => { if (!$('big').hidden) return; if (menu || form) return closeMenu(); openMenu(e); });

  /* ---------- the notes bar + list under the player ---------- */
  const panel = el('section', 'rv-panel');
  const vurl = n => `/review/${R.ep}${n === R.latest ? '' : '/v' + n}`;
  const vopts = [...R.versions].reverse().map(v => `<option value="${v.n}"${v.n === R.ver ? ' selected' : ''}>v${v.n} · ${esc(v.ts)}${v.n === R.latest ? ' (τελευταίο)' : ''}</option>`).join('');
  panel.innerHTML = `${R.ver !== R.latest ? `<div class="rv-oldver">Βλέπεις το παλιό revision <b>v${R.ver}</b> · <a href="${vurl(R.latest)}">πήγαινε στο τελευταίο (v${R.latest})</a></div>` : ''}
    <div class="rv-head"><b>REVIEW</b> <span>${esc(R.ep)}</span> <select class="rv-ver" title="Revision">${vopts}</select> <span class="rv-q"></span>
    <span class="rv-sp"></span><button class="rv-pin" title="Οπτικός έλεγχος εδώ (V)">📍 Σημάδι</button><button class="rv-com" title="Σχόλιο (C)">✍️ Σχόλιο</button>
    <a href="/review/${R.ep}/log" target="_blank">log</a></div>
    <label class="rv-allv"><input type="checkbox" class="rv-all"> Σχόλια από όλα τα revision</label>
    <div class="rv-track" title="Σχόλια στον χρόνο"></div><div class="rv-help">Πάτα πάνω στο καρέ για γρήγορο μενού · V = σημάδι χωρίς παύση · C = σχόλιο</div><ol class="rv-list"></ol>`;
  document.querySelector('.bar').after(panel);
  const track = panel.querySelector('.rv-track'), list = panel.querySelector('.rv-list'), allv = panel.querySelector('.rv-all');
  panel.querySelector('.rv-ver').onchange = e => { location.href = vurl(+e.target.value); };
  allv.checked = !!store.get('rv-allv'); allv.onchange = () => { store.set('rv-allv', allv.checked); draw(); };
  const shown = () => allv.checked ? NOTES : NOTES.filter(n => n.ver === R.ver);
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
    const dur = EPISODE.dur, S = shown();
    allv.parentElement.lastChild.textContent = ` Σχόλια από όλα τα revision (${NOTES.length})`;
    track.innerHTML = S.map(n => `<button class="rv-mk ${n.status}" data-id="${n.id}" style="left:${(n.t / dur * 100).toFixed(3)}%;--c:${CATS[n.cat]?.col || '#888'}" title="${fmt(n.t)} ${esc(CATS[n.cat]?.el)} ${esc(n.text)}"></button>`).join('');
    list.innerHTML = S.map(n => {
      const c = CATS[n.cat] || CATS.comment, old = n.ver !== R.ver;
      return `<li id="rv-${n.id}" class="${n.status}"><button class="rv-t" data-t="${n.t}" data-v="${n.ver || ''}">${fmt(n.t)}</button><span class="rv-ic" style="--c:${c.col}">${c.icon}</span>
        <div class="rv-body"><div>${n.text ? esc(n.text) : `<i>${esc(c.el)}</i>`}</div><div class="rv-meta">${esc(n.sceneTitle || n.scene)}${n.line?.el ? ` · ${esc(n.line.who)}: «${esc(n.line.el.slice(0, 80))}»` : ''} · ${esc(n.by)} · <span class="${old ? 'rv-old' : 'rv-cur'}">v${n.ver || '?'}</span></div>
        ${n.status !== 'open' ? `<div class="rv-fix">${n.status === 'fixed' ? '✓ Διορθώθηκε' : '– Μένει ως έχει'}${n.rev ? ' · ' + esc(n.rev) : ''}${n.fixnote ? ' · ' + esc(n.fixnote) : ''}</div>` : ''}</div>
        ${n.shot ? `<a class="rv-shot" href="/review/shot/${R.ep}/${n.id}.jpg" target="_blank"><img src="/review/shot/${R.ep}/${n.id}.jpg" alt="" loading="lazy"></a>` : ''}
        <button class="rv-del" data-id="${n.id}" title="Διαγραφή">🗑</button></li>`;
    }).join('') || `<li class="rv-empty">${NOTES.length ? 'Κανένα σχόλιο σε αυτό το revision.' : 'Κανένα σχόλιο ακόμα.'} Πάτα πάνω στο καρέ όπου δεις κάτι.</li>`;
    status();
  }
  track.onclick = e => { const b = e.target.closest('.rv-mk'); if (!b) return; const n = NOTES.find(n => n.id === b.dataset.id); jump(n.t); const li = $('rv-' + n.id); li?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); li?.classList.add('rv-hl'); setTimeout(() => li?.classList.remove('rv-hl'), 1500); };
  list.onclick = async e => {
    const t = e.target.closest('.rv-t');
    if (t && t.dataset.v && +t.dataset.v !== R.ver) { location.href = vurl(+t.dataset.v) + '#t=' + t.dataset.t; return; }   // a note on another revision: open that one
    if (t) { jump(+t.dataset.t); stage.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    const d = e.target.closest('.rv-del'); if (d && confirm('Διαγραφή αυτού του σχολίου;')) { try { await post('delete', { id: d.dataset.id }); } catch (err) { } load(); }
  };

  /* ---------- toast ---------- */
  let toastEl = null, toastT = 0;
  function toast(html, ms) { toastEl?.remove(); clearTimeout(toastT); toastEl = el('div', 'rv-toast', html); stage.append(toastEl); if (ms) toastT = setTimeout(() => { toastEl?.remove(); toastEl = null; }, ms); }

  /* ---------- start ---------- */
  const go = () => {
    if (!window.EPISODE) return setTimeout(go, 200);
    load(); flush();
    const m = location.hash.match(/t=([\d.]+)/); if (m) jump(+m[1]);                // links from the log page: /review/<ep>#t=123.4
    setInterval(flush, 15000); window.addEventListener('online', flush);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) load(); });
  };
  go();
})();
