/* Full screen with the controls (injected by server.py into /play and /review pages).
   ⛶ puts the whole player in full screen (the frame and its bars), not only the canvas. The play bar (and in the review
   the precision timeline) float over the bottom of the picture; they show when the mouse moves or the screen is touched,
   and hide after a moment of stillness while the episode plays. Paused, they stay. */
(() => {
  const main = document.querySelector('main'), stage = document.getElementById('stage'), fsBtn = document.getElementById('fs');
  if (!main || !stage || !fsBtn) return;
  const css = document.createElement('style');
  css.textContent = `
main.fsmode { position:fixed; inset:0; width:100vw; height:100vh; max-width:none; margin:0; padding:0; background:#000; display:flex; align-items:center; justify-content:center; }
main.fsmode > :not(.stage):not(.fsdock) { display:none !important; }
main.fsmode .stage { width:min(100vw, calc(100vh * 16 / 9)); height:auto; max-height:100vh; border-radius:0; box-shadow:none; margin:0; }
main.fsmode .fsdock { position:absolute; left:50%; bottom:max(12px, env(safe-area-inset-bottom)); transform:translateX(-50%); width:min(1180px, calc(100vw - 24px));
  display:flex; flex-direction:column; gap:8px; z-index:60; transition:opacity .35s; }
main.fsmode .fsdock > * { margin:0 !important; background:rgba(18,14,24,.84) !important; color:#fff; backdrop-filter:blur(6px); box-shadow:0 6px 24px rgba(0,0,0,.4); }
main.fsmode .fsdock .rv-tc { color:#fff; }
main.fsmode .fsdock .rv-zhint { display:none; }
main.fsmode.idle .fsdock { opacity:0; pointer-events:none; }
main.fsmode.idle, main.fsmode.idle * { cursor:none !important; }
.fsdock { display:none; }
main.fsmode .fsdock { display:flex; }`;
  document.head.append(css);
  const dock = document.createElement('div'); dock.className = 'fsdock'; main.append(dock);
  const moved = [];                                       // [element, placeholder] so they go back where they were
  const playing = () => /❚❚/.test(document.getElementById('play')?.textContent || '');
  let timer = 0;
  const wake = () => {
    main.classList.remove('idle'); clearTimeout(timer);
    timer = setTimeout(() => { if (main.classList.contains('fsmode') && playing() && !dock.matches(':hover') && !(dock.contains(document.activeElement) && document.activeElement.matches('input, select, textarea'))) main.classList.add('idle'); }, 2500);
  };
  function enter() {
    for (const sel of ['.bar', '.rv-tp']) {
      const el = main.querySelector(sel) || document.querySelector(sel); if (!el || dock.contains(el)) continue;
      const ph = document.createComment('fs'); el.before(ph); moved.push([el, ph]); dock.append(el);
    }
    main.classList.add('fsmode'); wake();
  }
  function leave() {
    for (const [el, ph] of moved.splice(0)) ph.replaceWith(el);
    main.classList.remove('fsmode', 'idle'); clearTimeout(timer);
  }
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  fsBtn.onclick = e => {
    e.stopPropagation();
    if (fsEl()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else {
      const req = main.requestFullscreen || main.webkitRequestFullscreen;
      if (req) req.call(main); else { main.classList.contains('fsmode') ? leave() : enter(); }   // iPhone: no Fullscreen API on elements, use the full-window layout
    }
  };
  const onChange = () => { fsEl() === main ? enter() : leave(); };
  document.addEventListener('fullscreenchange', onChange); document.addEventListener('webkitfullscreenchange', onChange);
  for (const ev of ['mousemove', 'pointerdown', 'touchstart', 'keydown']) main.addEventListener(ev, () => { if (main.classList.contains('fsmode')) wake(); }, { passive: true });
  document.getElementById('play')?.addEventListener('click', () => setTimeout(wake, 0));
  window.__sitaFs = { enter, leave };                   // for tests
})();
