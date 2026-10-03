/* =========================================================
   «Η Έξυπνη Σίτα» – render pipeline v2 (graphics v2, from Episode 4 on)
   A scene can draw in LAYERS instead of straight onto the canvas. Each layer is an offscreen canvas (the engine's
   `ctx` is pointed at it while the layer draws, so every primitive works unchanged), and the frame is composited with:
     · depth of field: a layer can be blurred (background far away, foreground out of focus)
     · lighting: ambient darkness with light pools punched through it, coloured light added on top
     · rim light: a thin edge of light on the side of the characters that faces a light (from the layer's own alpha)
     · bloom: everything in the emissive layer (lasers, LEDs, fire, sparks) glows
     · post: grade, vignette, film grain, chromatic aberration on hits
   One blur per layer per frame, never per shape (a per-shape filter hung the renderer in Ep. 3).
   Pure function of t: the grain pattern is chosen by the frame number, nothing carries over between frames.
   Load after engine.js and fx.js.
   ========================================================= */
const RV2 = (() => {
  const CW = () => cv.width, CH = () => cv.height;
  const pool = {};
  function canvas(name, scale = 1) {
    const w = Math.round(CW() * scale), h = Math.round(CH() * scale);
    let L = pool[name];
    if (!L || L.c.width !== w || L.c.height !== h) {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      L = pool[name] = { c, x: c.getContext('2d') };
      if (scale === 1) resCtx(L.x); else L.scene = resCtx(c.getContext('2d'), RES * scale);
    }
    return L;
  }
  /* draw fn into the named layer (cleared first); ctx points at the layer meanwhile. scale < 1: a small layer that
     still takes scene coordinates (the bloom source is drawn straight at a quarter size) */
  function into(name, fn, scale = 1) {
    const L = canvas(name, scale), main = ctx, X = scale === 1 ? L.x : L.scene;
    X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none';
    X.clearRect(0, 0, W, H);
    ctx = X;
    try { ctx.save(); fn(); ctx.restore(); } finally { ctx = main; }
    return L.c;
  }
  /* a cheap wide blur without canvas filters (those are very slow in software rendering): halve the image step by
     step with smoothing until one pixel of the small copy covers about the blur radius; scaling it back up when
     painting spreads it smoothly. Cost: a few small drawImage calls. */
  function blurred(src, px, name) {
    if (px <= .3) return src;
    let cur = src, scale = 1, i = 0;
    const target = 1 / Math.max(1.5, px * RES * .9);
    while (scale * .5 >= target * .999 && i < 6) {
      scale *= .5; const S = canvas(`blur_${name}_${i++}`, scale);
      S.x.resetTransform(); S.x.clearRect(0, 0, S.c.width, S.c.height); S.x.imageSmoothingEnabled = true; S.x.imageSmoothingQuality = 'low';
      S.x.drawImage(cur, 0, 0, S.c.width, S.c.height); cur = S.c;
    }
    if (scale > target * 1.01) {   // a last fractional step
      const S = canvas(`blur_${name}_f`, target); S.x.resetTransform(); S.x.clearRect(0, 0, S.c.width, S.c.height); S.x.imageSmoothingQuality = 'low';
      S.x.drawImage(cur, 0, 0, S.c.width, S.c.height); cur = S.c;
    }
    return cur;
  }
  /* paint a canvas onto the current ctx at device resolution */
  function paint(src, o = {}) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (o.alpha != null) ctx.globalAlpha = o.alpha; if (o.op) ctx.globalCompositeOperation = o.op;
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'low';
    ctx.drawImage(src, (o.dx || 0), (o.dy || 0), W, H); ctx.restore();
  }
  /* rim light from a layer's alpha: pixels of the shape whose neighbour towards the light is empty */
  function rimOf(src, rim) {
    const R = canvas('rim', .5), d = (rim.w || 3) * RES * .5, [lx, ly] = norm2(rim.dir);
    R.x.resetTransform(); R.x.globalAlpha = 1; R.x.globalCompositeOperation = 'source-over'; R.x.clearRect(0, 0, R.c.width, R.c.height);
    R.x.drawImage(src, 0, 0, R.c.width, R.c.height);
    R.x.globalCompositeOperation = 'source-in'; R.x.fillStyle = rim.col || '#ffd9a8'; R.x.fillRect(0, 0, R.c.width, R.c.height);
    R.x.globalCompositeOperation = 'destination-out'; R.x.drawImage(src, -lx * d, -ly * d, R.c.width, R.c.height);
    R.x.globalCompositeOperation = 'source-over';
    return R.c;
  }
  const norm2 = v => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
  /* the POST MAP: one half-size canvas multiplied over the frame. It carries, in one pass:
     ambient darkness (or white in daylight), soft light pools punched through it, a vertical tint (the grade),
     the vignette, and the film grain (darkening noise, by frame number). One full-frame multiply instead of five. */
  function postMap(t, o) {
    const L = canvas('post', .5), q = .5, w = L.c.width, h = L.c.height;
    L.x.resetTransform(); L.x.globalCompositeOperation = 'source-over'; L.x.globalAlpha = 1;
    L.x.fillStyle = o.ambient || '#ffffff'; L.x.fillRect(0, 0, w, h);
    if (o.lights && o.ambient) {
      L.x.globalCompositeOperation = 'lighter';
      for (const l of o.lights) {
        if (!(l.k ?? 1)) continue;
        const x = l.x * RES * q, y = l.y * RES * q, r = l.r * RES * q, g = L.x.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, l.col); g.addColorStop(1, 'rgba(0,0,0,0)');
        L.x.globalAlpha = l.k ?? 1; L.x.fillStyle = g; L.x.fillRect(x - r, y - r, r * 2, r * 2);
      }
      L.x.globalAlpha = 1;
    }
    L.x.globalCompositeOperation = 'multiply';
    if (o.tint || o.vignette) L.x.drawImage(cachedGrad('tv' + (o.tint || []).join() + '|' + (o.vignette || 0), g => {   // tint × vignette, baked once
      if (o.tint) { const r = g.createLinearGradient(0, 0, 0, H); r.addColorStop(0, o.tint[0]); r.addColorStop(1, o.tint[1]); g.fillStyle = r; } else g.fillStyle = '#fff';
      g.fillRect(0, 0, W, H);
      if (o.vignette) { g.globalCompositeOperation = 'multiply'; const r = g.createRadialGradient(640, 360, 240, 640, 360, 820); r.addColorStop(0, '#ffffff'); const v = Math.round(255 * (1 - o.vignette)); r.addColorStop(1, `rgb(${v},${Math.max(0, v - 6)},${Math.min(255, v + 8)})`); g.fillStyle = r; g.fillRect(0, 0, W, H); }
    }), 0, 0, w, h);
    if (o.grain) {
      grainInit(); const f = Math.floor(t * 24), ox = Math.floor(hash(f * 1.7) * 256), oy = Math.floor(hash(f * 2.3 + 1) * 256);
      L.x.globalAlpha = Math.min(1, o.grain * 1.6); L.x.save(); L.x.translate(-ox, -oy); L.x.fillStyle = L.x.createPattern(grainTile, 'repeat'); L.x.fillRect(0, 0, w + 256, h + 256); L.x.restore(); L.x.globalAlpha = 1;
    }
    L.x.globalCompositeOperation = 'source-over';
    return L.c;
  }
  /* film grain tile: light noise (multiplied, so it only darkens a little) */
  let grainTile = null;
  function grainInit() {
    if (grainTile) return;
    grainTile = document.createElement('canvas'); grainTile.width = grainTile.height = 256;
    const g = grainTile.getContext('2d'), im = g.createImageData(256, 256);
    for (let i = 0; i < 256 * 256; i++) { const v = 200 + Math.floor(hash(i * .731 + 3.1) * 55); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
    g.putImageData(im, 0, 0);
  }
  /* chromatic aberration: split the finished frame into red and cyan copies, offset sideways */
  function aberration(k) {
    if (k <= .05) return;
    const A = canvas('caA'), B = canvas('caB'), px = k * 4 * RES;
    for (const [L, col] of [[A, '#ff0000'], [B, '#00ffff']]) {
      L.x.resetTransform(); L.x.globalCompositeOperation = 'source-over'; L.x.globalAlpha = 1; L.x.drawImage(cv, 0, 0);
      L.x.globalCompositeOperation = 'multiply'; L.x.fillStyle = col; L.x.fillRect(0, 0, L.c.width, L.c.height);
    }
    const m = ctx; m.save(); m.setTransform(1, 0, 0, 1, 0, 0); m.globalCompositeOperation = 'source-over'; m.fillStyle = '#000'; m.fillRect(0, 0, W, H);
    m.globalCompositeOperation = 'lighter'; m.drawImage(A.c, px / RES, 0, W, H); m.drawImage(B.c, -px / RES, 0, W, H); m.restore();
  }
  /* full-frame gradients are rasterised once into a quarter-size canvas and reused (keyed by their parameters) */
  const cached = {};
  function cachedGrad(key, draw) {
    let c = cached[key];
    if (!c) { c = cached[key] = document.createElement('canvas'); c.width = W / 4; c.height = H / 4; const g = c.getContext('2d'); g.scale(.25, .25); draw(g); }
    return c;
  }
  /* ---------- one frame ----------
     o.layers: [{ name, draw, dof (px blur), lit (true: the light map applies), rim: { dir: [x,y], col, k, w } }] back to front
     o.emit:   draw fn for the emissive pass (lasers, LEDs, fire, sparks): drawn on top AND bloomed
     o.lights: [{ x, y, r, col, k }] screen-space light pools;  o.ambient: 'rgba(...)' darkness (multiply)
     o.bloom (0..2), o.tint: [top colour, bottom colour] (multiplied grade, near white), o.vignette (0..1), o.grain (0..1),
     o.ca (0..1) */
  const PROF = { on: false, acc: {} };
  let _pt = 0;
  function mark(name) { if (!PROF.on) return; cv.getContext('2d').getImageData(0, 0, 1, 1); const n = performance.now(); PROF.acc[name] = (PROF.acc[name] || 0) + n - _pt; _pt = n; }
  /* the bounding box (in the canvas's own pixels, padded) of the pixels that are not black/transparent */
  function litBox(L) {
    const w = L.c.width, h = L.c.height, d = L.x.getImageData(0, 0, w, h).data;
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; if (d[i + 3] > 2 && (d[i] + d[i + 1] + d[i + 2]) > 6) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
    if (x1 < 0) return null;
    x0 = Math.max(0, x0 - 2); y0 = Math.max(0, y0 - 2); x1 = Math.min(w - 1, x1 + 2); y1 = Math.min(h - 1, y1 + 2);
    return [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
  }
  const cache = {};
  function frame(t, o) {
    if (PROF.on) { cv.getContext('2d').getImageData(0, 0, 1, 1); _pt = performance.now(); }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = o.clear || '#000'; ctx.fillRect(0, 0, W, H); ctx.restore();
    for (const Ly of o.layers) {
      if (!Ly.dof && !Ly.rim) { ctx.save(); Ly.draw(); ctx.restore(); mark('direct_' + Ly.name); continue; }   // no layer needed
      let img = null, src = null;
      const C = Ly.cache != null ? cache[Ly.name] : null;
      if (C && C.key === Ly.cache) img = C.img;
      else {
        src = into(Ly.name, Ly.draw); mark('draw_' + Ly.name);
        img = Ly.dof ? blurred(src, Ly.dof, Ly.name) : src;
        if (Ly.cache != null) {   // keep a private copy: the pooled blur canvases are reused by other layers
          const K = canvas('cache_' + Ly.name, img.width / cv.width); K.x.resetTransform(); K.x.clearRect(0, 0, K.c.width, K.c.height); K.x.drawImage(img, 0, 0);
          cache[Ly.name] = { key: Ly.cache, img: K.c }; img = K.c;
        }
      }
      paint(img); mark('paint_' + Ly.name);
      if (Ly.rim && (Ly.rim.k ?? .8) > 0) { if (!src) src = into(Ly.name, Ly.draw); paint(rimOf(src, Ly.rim), { op: 'lighter', alpha: Ly.rim.k ?? .8 }); mark('rim_' + Ly.name); }
    }
    if (o.ambient || o.tint || o.vignette || o.grain) { paint(postMap(t, o), { op: 'multiply' }); mark('postmap'); }
    if (o.lights) {   // coloured spill on top (additive, soft)
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
      for (const l of o.lights) if (l.spill && (l.k ?? 1)) { const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r * .8); g.addColorStop(0, l.spill); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2); }
      ctx.restore(); mark('spill');
    }
    if (o.emit) {
      ctx.save(); o.emit(); ctx.restore(); mark('emit');   // sharp, straight onto the frame
      if (o.bloom) {   // the same emissive pass drawn again at a quarter size, blurred twice, merged, ONE full-frame add
        const E = into('emitS', o.emit, .25);
        const b1 = blurred(E, 2, 'b1'), b2 = blurred(b1, 10, 'b2'), B = canvas('bloomC', b1.width / cv.width);
        B.x.resetTransform(); B.x.globalCompositeOperation = 'source-over'; B.x.globalAlpha = 1; B.x.clearRect(0, 0, B.c.width, B.c.height);
        B.x.globalAlpha = .9 * o.bloom; B.x.drawImage(b1, 0, 0);
        B.x.globalCompositeOperation = 'lighter'; B.x.globalAlpha = .75 * o.bloom; B.x.imageSmoothingQuality = 'low'; B.x.drawImage(b2, 0, 0, B.c.width, B.c.height);
        // add it only where there is light: the bounding box of the small canvas's lit pixels (lasers are thin)
        const bb = litBox(B), sx = W / B.c.width;
        if (bb) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.imageSmoothingQuality = 'low';
          ctx.drawImage(B.c, bb[0], bb[1], bb[2], bb[3], bb[0] * sx, bb[1] * sx, bb[2] * sx, bb[3] * sx); ctx.restore(); }
        mark('bloom');
      }
    }
    if (o.after) o.after();   // anything that must sit above the lighting (UI-like graphics, on-screen text)
    if (o.ca) { aberration(o.ca); mark('ca'); }
  }
  return { frame, into, paint, blurred, canvas, PROF };
})();
