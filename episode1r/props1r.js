/* Episode 1 remake: props and helpers for the upgrade. Loaded after the shared libraries of Ep. 2–3.

   Undo what those libraries change for their own episodes, so Ep. 1 looks like Ep. 1:
   - props2.js puts Γιώργος in the olive army tee (Ep. 2); in Ep. 1 he wears the white tee.
   - props2r.js gives the yard a gate in the back wall (the Ep. 2 battle); Ep. 1's yard has none. */
CAST.giorgos = { ...CAST.giorgos, topCol: '#f4f3ee' };
(() => { const _yard = yard; yard = function (t, o = {}) { return _yard(t, { gate: 'none', ...o }); }; })();

/* an egg in flight (the hen air force's bombs) */
function egg(x, y, rot = 0, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.ellipse(0, 0, 9, 12, 0, 0, TAU); ctx.fillStyle = '#f6efe0'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(-3, -4, 2.5, 4, -.4, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill();
  ctx.restore();
}
/* where an egg landed: a white splash with the yolk in it; it stays for the rest of the scene */
function eggSplat(x, y, s = 1, seed = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s * .7);
  ctx.beginPath();
  for (let i = 0; i <= 14; i++) { const a = i / 14 * TAU, r = 20 + hash(i + seed * 7) * 12 + (i % 3 ? 0 : 8); i ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  ctx.closePath(); ctx.fillStyle = 'rgba(250,246,234,.95)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.arc(2, 1, 9, 0, TAU); ctx.fillStyle = '#ffb81c'; ctx.fill(); ctx.lineWidth = 1.6; ctx.stroke();
  ctx.beginPath(); ctx.arc(-1, -2, 3, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill();
  ctx.restore();
}
/* a fig leaf: three lobes, a stem and veins (stuck to Κώστας's cheek after his night under the fig) */
function figLeaf(x, y, rot = 0, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.bezierCurveTo(-10, 12, -22, 8, -24, -4); ctx.bezierCurveTo(-18, -6, -14, -4, -12, -8);
  ctx.bezierCurveTo(-16, -18, -10, -26, -4, -22); ctx.bezierCurveTo(-2, -28, 2, -28, 4, -22);
  ctx.bezierCurveTo(10, -26, 16, -18, 12, -8); ctx.bezierCurveTo(14, -4, 18, -6, 24, -4);
  ctx.bezierCurveTo(22, 8, 10, 12, 0, 14); ctx.closePath();
  ctx.fillStyle = '#5c8a34'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
  ctx.strokeStyle = 'rgba(25,45,10,.65)'; ctx.lineWidth = 1.2; ctx.beginPath();
  ctx.moveTo(0, 12); ctx.lineTo(0, -20); ctx.moveTo(0, 2); ctx.lineTo(-16, -4); ctx.moveTo(0, 2); ctx.lineTo(16, -4); ctx.moveTo(0, -6); ctx.lineTo(-8, -16); ctx.moveTo(0, -6); ctx.lineTo(8, -16); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(0, 14); ctx.quadraticCurveTo(2, 20, -2, 24); ctx.stroke();
  ctx.restore();
}
/* the spare-parts bag that came in the σίτα's box (Ep. 2: Γιάννος keeps it and builds the magnet cannon from it) */
function sparePartsBag(x, y, rot = 0, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  poly([[-22, 14], [-20, -22], [20, -22], [22, 14]], 'rgba(235,240,245,.9)', { lw: 2 }); rect(-20, -22, 40, 5, '#d8453a', { lw: 1.2 });
  rect(-16, -12, 32, 12, '#fffaf0', { lw: 1 }); txt('ΑΝΤΑΛΛΑΚΤΙΚΑ', 0, -6, 4.6, INK, { font: TVFONT, weight: 900 }); txt('ΕΞΥΠΝΗ ΣΙΤΑ', 0, 5, 3.6, '#d8453a', { font: TVFONT, weight: 900 });
  for (let i = 0; i < 3; i++) rect(-14 + i * 10, 2, 7, 7, '#c9ccd2', { lw: 1 });
  ctx.restore();
}

/* over-the-shoulder framing: the listener's out-of-focus head and shoulder at the edge of the frame (screen space).
   side: 'left' | 'right'; who: a CAST key (colours come from the rig) */
function otsShoulder(who, side, t, o = {}) {
  const c = CAST[who]; if (!c) return;
  const d = side === 'left' ? 1 : -1, x0 = side === 'left' ? 40 : W - 40, sway = Math.sin(t * 1.1) * 4;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${o.blur ?? 10}px)`;
  ctx.fillStyle = c.topCol || '#333'; ctx.beginPath(); ctx.ellipse(x0 + d * 40 + sway, H + 60, 260, 230, 0, 0, TAU); ctx.fill();
  const head = c.hair === 'bald' ? c.skin : (c.hairCol || c.skin);
  ctx.fillStyle = c.skin; ctx.beginPath(); ctx.ellipse(x0 + d * 30 + sway, H - 250, 120, 150, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = head; ctx.beginPath(); ctx.ellipse(x0 + d * 10 + sway, H - 300, 125, 120, 0, 0, TAU); ctx.fill();
  ctx.filter = 'none'; ctx.restore();
}
/* the summer-day look of the yard: a warm wash and a little sun from the top right */
function dayGrade(t, a = 1) { fxGrade('#ffe2a0', '#f0b070', .2 * a); }
