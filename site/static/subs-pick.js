/* Subtitle choice for the interactive player (injected by server.py into /play and /review pages): ΕΛ / EN / off.
   The engine only knows two languages (its #lang button toggles them); "off" swaps the engine's drawSubs for a no-op,
   the same hook the MP4 exporter uses for a clean picture. The choice is kept in localStorage 'sita-subs', the key the
   /ep video page uses too, so one choice follows the viewer everywhere; ?lang=en wins for a first visit in English. */
addEventListener('load', () => setTimeout(() => {
  const langBtn = document.getElementById('lang');
  if (!langBtn || typeof window.drawSubs !== 'function') return;
  const draw = window.drawSubs, off = () => {};
  const btn = document.createElement('button');
  btn.id = 'subs'; btn.title = window.REVIEW ? 'Υπότιτλοι / Subtitles' : 'Υπότιτλοι / Subtitles (C)';
  langBtn.after(btn); langBtn.hidden = true;
  const engineLang = () => langBtn.textContent.trim() === 'EN' ? 'el' : 'en';   // the engine's button names the OTHER language
  const NAMES = { el: 'CC ΕΛ', en: 'CC EN', off: 'CC ✕' };
  let cur = 'el';
  function set(l) {
    if (!NAMES[l]) l = 'el';
    if (l !== 'off' && engineLang() !== l) langBtn.click();
    window.drawSubs = l === 'off' ? off : draw;
    cur = l; btn.textContent = NAMES[l]; btn.classList.toggle('on', l !== 'off');
    btn.setAttribute('aria-label', l === 'off' ? 'Subtitles off' : 'Subtitles: ' + (l === 'el' ? 'Ελληνικά' : 'English'));
    try { localStorage.setItem('sita-subs', l); } catch (e) {}
  }
  const ORDER = ['el', 'en', 'off'];
  btn.onclick = e => { e.stopPropagation(); set(ORDER[(ORDER.indexOf(cur) + 1) % 3]); };
  if (!window.REVIEW) addEventListener('keydown', e => {           // C (not in the review, where C is a comment)
    if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey && !e.altKey && !(e.target.matches && e.target.matches('input, textarea, select'))) btn.click();
  });
  let first = new URLSearchParams(location.search).get('lang');
  if (!first) { try { first = localStorage.getItem('sita-subs'); } catch (e) {} }
  set(first || 'el');
  window.__sitaSubs = { set, get: () => cur };                    // for tests
}, 0));
