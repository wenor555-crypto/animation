/* Episode 1 remake: props and helpers for the upgrade. Loaded after the shared libraries of Ep. 2–3.

   Undo what those libraries change for their own episodes, so Ep. 1 looks like Ep. 1:
   - props2.js puts Γιώργος in the olive army tee (Ep. 2); in Ep. 1 he wears the white tee.
   - props2r.js gives the yard a gate in the back wall (the Ep. 2 battle); Ep. 1's yard has none. */
CAST.giorgos = { ...CAST.giorgos, topCol: '#f4f3ee' };
(() => { const _yard = yard; yard = function (t, o = {}) { return _yard(t, { gate: 'none', ...o }); }; })();
