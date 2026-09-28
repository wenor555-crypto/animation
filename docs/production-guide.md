# Production guide (from Episode 3 on)

Episodes 1 and 2 stay as rendered. These rules and tools are for everything made from now on.

## The look ("clean")

Set in `episode1/engine.js`, shared by every episode:

- **Resolution.** The canvas renders at 1920×1080 (`RES = 1.5`). Scenes still draw in 1280×720 units.
- **No hand-drawn wobble.** `CLEAN = true` turns off the old 8 fps line boil and the jittered edges. Ovals are true ellipses, and straight edges are straight.
- **Outlines.** Filled shapes get a thinner outline (`OUTLINE = .8`). When the camera pushes in, outlines and limb borders keep roughly the same on-screen weight, so close-ups don't get fat lines.
- **Characters (in `characters.js`).**
  - a soft contact shadow under standing and walking characters (`st.noShadow` turns it off)
  - light shading on the far side of the face
  - short sleeves that run down the upper arm; the old ball on the shoulder read as a second hand
- **Clean canvas.** Every frame starts from a cleared canvas, so nothing can leak in from the previous frame.

## Drawing rules for scene code

1. **Hands come only from the rig.**
   - Never draw a skin-coloured blob next to a character. Put the hand where it should be with `L` and `R`.
   - Hold things with `itemL` and `itemR`. New props are registered in `ITEM_HOOK`.
   - The rig clamps a hand to the arm's reach (190 units from the shoulder), so stretched arms can't happen.
2. **Nothing small and coloured sits on a character unless the story needs it.** Laser dots, marks, sparks and LEDs are aimed with `anchor(x, y, s, 'forehead' | 'face' | 'cheek' | 'chest' | 'belly' | 'hand', st)`, which follows the character. Each one is shown only inside its story beat (`inM(t, M.beat)`), never "whenever".
3. **Small creatures are sprites, not dots.** Mosquitoes and flies need wings and a body that reads at 1080p, and they never park on a face.
4. **Every set fills the whole frame in every shot.** The sky covers far beyond the frame. Floors and walls must reach the edges at the widest zoom used.
5. **Frames are deterministic.** Use `hash()` and `t` only. No `Math.random()` or wall-clock time in drawing code (sound may use them).
6. **Head-room.** In a shot, the top of the tallest head stays inside the frame; check this on the contact sheet.

## Workflow and gates

| Step | Tool | Gate |
|---|---|---|
| 1. Beat sheet + dialogue locked | `docs/episode-N-*.md` | the creator signs off |
| 2. Scenes written | `episodeN/scenes/*.js` | every line matches the dialogue doc (the check in the Ep. 2 log) |
| 3. Contact sheets | `PAGE=file://…/episodeN.html node tools/sheets.js OUT [scenes] [frames]` | Claude reviews every scene; for fast action, 12+ frames of that stretch |
| 4. Frame QA | `node tools/qa.js episodeN/episodeN.html OUT` | exit code 0: no DUP, HAND, DOT, GAP or NONDET findings left, apart from the ones in `episodeN/qa-allow.json`, each with a reason |
| 5. Keyframe sheets to the creator | the contact sheets from step 3 | the creator approves before any voice or render budget is spent |
| 6. Voices | `python3 episode1/tools/gen_voices.py --episode episodeN` | every clip passes speech-to-text, or is listed for the creator to check by ear |
| 7. Build + QA again | `python3 episodeN/build.py`, then `tools/qa.js` on `dist/` | exit code 0 |
| 8. Render | node: `~/sita-render/render_ep.sh episodeN` | uploads to Drive as `episodeN_rNN.mp4` |

### What `tools/qa.js` checks

It wraps the rig while it renders every frame at 8 fps by default:

- **DUP:** the same character, or the same body part, drawn twice in one place.
- **HAND:** a loose skin-coloured blob on a character, drawn outside the rig.
- **DOT:** a small coloured blob drawn on top of a character, outside the rig.
- **GAP:** part of the frame that nothing paints. For this check the canvas is cleared to magenta.
- **NONDET:** a frame that comes out differently when it is rendered after a jump to another time.

Findings are merged into time spans, each with a crop image, in `OUT/qa.json`.

What it found in the old episodes:

- **Ep. 1:** mosquito dots on faces, and laser and slipper marks.
- **Ep. 2:**
  - laser dots and «τσσπ» flashes aimed at fixed coordinates, which landed on chins and necks
  - one unpainted strip that picked up colour from earlier frames

Those are the mistakes rules 2–5 and the gates are there to stop.
