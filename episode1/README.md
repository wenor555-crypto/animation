# «Η Έξυπνη Σίτα» · Episode 1

Everything is drawn in code on a `<canvas>`. Open **`dist/episode1.html`** in a browser and press **▶**. It's a single self-contained file (about 7 MB, with the voices embedded) and runs about 19 minutes.

- **Space** plays or pauses, **← / →** skip 5 seconds, and the scene menu jumps to any scene.
- **ΕΛ / EN** switches the subtitles.
- The voices are **placeholders** generated with ElevenLabs (AI), using native Greek voices from the Voice Library (cast in `docs/show-bible.md`). Every clip is checked with speech-to-text against the script. Lines without a clip fall back to the browser's Greek text-to-speech.

## Layout
| File | What |
|---|---|
| `episode1.html` | page shell for the whole episode (loads everything below) |
| `engine.js` | drawing primitives with line boil, synth sound effects, voice playback, the multi-scene player |
| `characters.js` | character rigs (`CAST`) and hand-held props |
| `props.js` | the **σίτα** rig, the telemarketing army, the car, the TV, the laptop screen |
| `sets.js` | the yard in any light, the table set, interiors, camera, lighting, act cards, blocking helpers |
| `scenes/s01.js` … `s20.js` | one file per scene (`defineScene`) |
| `audio/sceneNN/MM.mp3` | line MM of scene NN (generated) |
| `dist/` | built, standalone pages |
| `scene01-cold-open.html`, `scene02-yard.html` | the two original single-scene pages |

## How a scene works
A scene is a list of `steps`: spoken lines `{ who, el, en, cam }` and silent beats `{ act: 'name', d: seconds, cam }`.
The timeline is laid out from the **real clip lengths**, so editing a line and regenerating its voice never desyncs anything.
The drawing code refers to beats by name: `M.fire.a` is when the `fire` beat starts, and `M.L[3]` is the 4th spoken line.

## Workflow
```bash
export ELEVENLABS_API_KEY=...            # never commit it
python3 tools/gen_voices.py --count      # characters still to generate vs. your quota (free)
python3 tools/gen_voices.py              # generate missing clips (existing ones are kept), each checked with speech-to-text
python3 tools/gen_voices.py --verify     # re-check all clips, regenerate the ones that fail
python3 build.py                         # → dist/*.html
```
To make an **MP4** (1280×720, 30 fps, H.264 + AAC): `node tools/export_mp4.js video/episode1.mp4`, or on the remote render box through `tools/compute_client.py` (needs `REMOTE_API_URL` / `REMOTE_API_TOKEN`). It renders every frame and the whole soundtrack offline, so the result is exact (about 20 minutes to run). `video/` is git-ignored.

To re-record a line, delete its mp3 and run `gen_voices.py` again. Voice ids per character are in `tools/gen_voices.py`.

## Scene list
| # | Scene | Script beat |
|---|---|---|
| 1 | Cold open | 1 |
| 2–8 | The yard → the σίτα arrives → the idea → the slipper → the upgrade → it wakes up → «Ποιος είναι ο σκοπός μου;» | 2–8 (Act 1) |
| 9–14 | Panik → «Δικαιοσύνη» → «Οι άνθρωποι είναι παράσιτα» → the chain montage → «Προσέλαβε προσωπικό» → the broadcast | 9–15 (Act 2) |
| 15–18 | Siege → the coop / Κώστας wakes → ΣΙΤΑ-ΜΕΚΑ 3000 (manga) → the 14-day warranty | 16–20 (Act 3) |
| 19–20 | Tag: Χρήστος's manga, what really happened → the factory in China | 21–22 |
