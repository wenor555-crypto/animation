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

## Props and physical logic (checked on every keyframe)

Before a shot is approved, every prop in a hand is checked in a full-size frame, not only in the contact sheet:
- **Which way it points.** A bow's wood bulges toward the target and its string comes back toward the archer. A gun or cannon's barrel faces the target. A shield faces the attack.
- **How it is held.** The bow is in the front hand and the string in the other. The drawing hand sits on the string, and the arrow is nocked while he draws.
- **Cause and effect.** Whatever flies (arrow, beam, thrown object) starts from the thing that fires it and lands on what it hits, in the direction the character faces.
- **Every scene, not only the one where it was caught.** When a prop error is found, every scene that uses that prop gets checked (`grep` the prop name) before the fix is called done.
- **Hand props follow facing.** When a character is flipped (`dir: -1`) or holds a prop in the "wrong" hand, the prop gets its own direction (e.g. `bowDir`), not the hand's side.

(Added after the previs of the Ep. 2 remake, where Χρήστος's bow was drawn backwards.)

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
| 8. HTML to the creator | put `episodeN/dist/episodeN.html` in `sita-render/dist/` on the node; the creator reviews it at `/review/episodeN` on the site (see below) | the creator watches the whole episode and approves; their notes are read with `python3 tools/review.py pull episodeN`; revisions go back to step 2, 6 or 7, and each fixed note is closed with `review.py done … --rev`. **No MP4 before this approval**: a render costs time on every revision |
| 9. Render | node: `~/sita-render/render_ep.sh episodeN` | only after step 8; uploads to Drive as `episodeN_rNN.mp4` and publishes it on the site as the episode's next revision |

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

## The site and the review tool (`site/`)

A small server on the node (`~/sita-site`, Python standard library, `127.0.0.1:8790`), reached from outside at `https://sita.justachillgame.com` through the node's Cloudflare tunnel (an `ingress` rule in `/etc/cloudflared/config.yml`, plus a proxied DNS CNAME `sita` → `<tunnel id>.cfargotunnel.com` in the Cloudflare dashboard).

- **Public:** `/` lists the episodes; `/ep/<slug>` plays the latest revision; `/dl/<slug>` downloads the MP4; `/play/<slug>` is the interactive HTML of the same revision (EL/EN subtitles). Only rendered revisions appear there, never drafts. `render_ep.sh` calls `publish.py`, which copies the MP4 and HTML to `releases/<slug>/rNN`, keeps every revision, and records which draft (vNN) each one was rendered from. `site.json` holds the titles; its `aliases` publish the remake `episode2r` as `episode2`.
- **Review (login, account `ceo`, set with `reviewctl.py passwd`):** every draft that lands in `sita-render/dist/` is kept as the episode's next revision (`drafts/<ep>/vNN.html`, by content hash, checked every 5 minutes and on every review visit). `/review/<ep>` plays the latest, `/review/<ep>/vN` an older one, with `static/review.js` added. Each note records its revision, and the panel can show the notes of this revision or of all of them. When the creator refers to an old revision, `review.py pull` shows it in the `vN` column.
  - Tapping the frame pauses the player and opens a quick menu at that point: 🎨 visual (one tap), 🔊 audio, ⏱ timing, 💬 line, 👍 like, ✍️ comment. 📍 or **V** flags a visual check without pausing.
  - Every note keeps the time, scene, line, the point on the 1280×720 frame, the build hash and a snapshot.
  - The log is append-only: `review/<ep>.jsonl`. The creator also has `/review/<ep>/log`, plus `notes.md` and `.csv`.
- **Claude's side:**
  - `tools/review.py pull <ep>` prints only the open notes as text.
  - `review.py shot <ep> <id>` fetches one snapshot when the text isn't enough.
  - `review.py done <ep> <id…> --rev rNN` closes notes; the creator sees ✓.
- **The review player:** under the frame, buttons for −5 s, −1 s, one frame back/forward (1/30 s, the MP4's rate), +1 s, +5 s and a timecode `m:ss:ff`. Keys: ← → = 1 s (Shift = 5 s), `,` `.` = one frame, + − = zoom. The plain slider is replaced by a precision timeline (Premiere-style):
  - a ruler, the scene bands with their titles, the note lanes and the playhead
  - zoom with the wheel, + −, or the slider, from the whole episode down to 4 s
  - drag at the zoom's scale; Shift+drag is 10× finer; every position snaps to a frame
- **The owner's revision check:** in a new revision, every earlier note (this episode's older revisions, and the alias's: `episode1r` shows `episode1`'s) is a pin on the timeline, where its moment is NOW: each revision's structure (scenes, lines, actions with times) is read once from the draft (`/review/<ep>/vN/raw`, owner only, in a hidden frame) and cached by build hash; a note moves with its line (same text or same slot), else its action, else proportionally in its scene. Green ✓ fixed, orange open, grey if the scene is gone. Click a pin (or N / Shift+N) → it jumps there and shows the old note, its snapshot and the fix note, with «✓ Εντάξει» (next) and «Ξανα-άνοιγμα» (back to open: work for Claude). The diff with the previous loadable revision tints the timeline: yellow = new scene/action/line, orange = changed line or a new voice take.
- **Full screen** (⛶, `static/player-fs.js`, injected into `/play` and `/review`): the whole player goes full screen; the play bar (and the precision timeline) float over the picture, appear on mouse move or touch, hide after 2.5 s while playing.
- **On phones** (narrow screens or touch): tapping the frame opens the six choices as a bottom sheet, and the note form sits at the bottom of the screen; the timeline zooms with two fingers (pinch) or + −; hints and the tour speak touch instead of keys; inputs are 16 px so iOS doesn't zoom.
- **Collaborators ("Γίνε μέρος της παραγωγής!"):** the public pages show that button (or «Studio» when signed in). Anyone can sign up with Google (`google_client_id` in `site.json`; the token is checked with Google's `tokeninfo`, no client secret is used or stored) or with email + password (pbkdf2; a honeypot and per-IP limits; no email confirmation).
  - **The owner's Gmail:** `owner_emails` in `site.json` maps `wenor555@gmail.com` → `ceo`: signing in with that Google account is the `ceo` account itself (same name, notes, rights). Sign-up with that email is refused.
  - Accounts live in `~/sita-site/users.json`. The owner sees them at `/review/users` and can block or unblock anyone.
  - Collaborators see every draft and revision, with the same player and quick menu. A 6-step tour opens once for every new account; «Παράλειψη» closes it for good, and «?» opens it again.
  - Their notes go to `review/<ep>.community.jsonl`, with their name. They see the notes of all collaborators, never the owner's. They can delete only their own notes and cannot set a status. The owner's log pages and exports are owner-only.
  - The owner sees them as a second, hollow-dot lane on the timeline (toggle «Σχόλια κοινότητας»), and in the list with the author's name.
  - **General discussion:** under the notes, «Γενικά σχόλια για το επεισόδιο» (💡 idea, 💬 comment, ❓ question), not tied to a moment, in `review/<ep>.general.jsonl`. Everyone (collaborators and owner) reads and writes there; each deletes their own, the owner any.
  - **Votes:** ▲ ▼ on every general post and every collaborator's frame note; one vote per person (clicking again takes it back). Lists can sort by top or newest.
  - **Claude never acts on a collaborator's note.** `review.py pull` (the work list) reads only the owner's log. `review.py community <ep>` prints the collaborators' notes by person and the general discussion by score, for a briefing only. A note becomes work when the creator says so, or presses «Υιοθέτηση»: that copies it into the owner's log, credited («από: <name>»).
- **Deploy:** `bash site/deploy.sh` copies the files, installs `render_ep.sh`, adds the crontab lines (`@reboot` and a check every 5 minutes through `run.sh`), and restarts the server. The passphrase lives only in `~/sita-site/secret.json` (mode 600) on the node.

## Voice levels (every build)

- **Rule:** all voices play at the same loudness, unless a line is shouted or spoken softly on purpose. ElevenLabs gives very different levels (Γιάννος about -23 LUFS, Γιώργος about -11), so this is never left to the raw clips.
- **How:** `tools/level_voices.py` measures each clip once (EBU R128, cached by hash in `<ep>/audio/levels.json`). `build.py` runs it on every build and embeds the gains as `window.CLIP_GAIN`. The engine plays each clip through its gain into a dialogue bus with a fast peak limiter (-3 dBFS), in the player and in the MP4 export alike. The mp3 files are never re-encoded.
- **Targets:**
  - normal -16 LUFS
  - loud -13: `!` or a word in CAPS, or `level: 'loud'`
  - soft -21: a whisper `tag:`, or `level: 'soft'`
  - `level: 'normal'` on a line overrides the automatic choice.
- **Check:** `python3 tools/level_voices.py <ep>` prints each character's median before and after, and lists any clip that needs more than ±12 dB or more than 6 dB of limiting. Regenerate those clips rather than squash them. Measured in the exported Ep. 1 mix: every character's normal lines sit between -14.8 and -15.5 LUFS.

## Graphics v2 (from Episode 4 on)
- **The bar:** battles at a Final Space / Rick and Morty level:
  - many units and weapons
  - clear reading
  - rich effects
  - light that reacts to the action
- **Determinism stays:** everything is a function of `t` (the QA's NONDET check).
- **The parts** (plan in `docs/episode-4-beat-sheet.md`):
  - a layered render pipeline with post-processing (bloom, depth of field, grade, grain, chromatic aberration on hits, sub-frame motion blur), one blur per layer, never per shape
  - 2D lighting from explosions, lasers and LEDs, with rim light on characters
  - rig v2: two-bone IK, a pose library, 3/4 and profile heads, squash and stretch, smears, on-twos timing on impacts
  - deterministic armies and swarms: hundreds of units, faction colours, LOD
  - FX v2
  - choreography and camera beats
  - an SFX library generated with ElevenLabs sound effects (cached like the voices)
- **Robots and mechas are built, not piled:**
  - a hierarchical skeleton first, with heroic proportions and the centre of mass over the feet
  - visible mechanical joints
  - the devices are armour bound to bones
  - metal material: base, shadow, highlight, rim
  - a **model sheet** (front, 3/4, profile, back, and the assembly sequence) is approved in the review before any animation
- **Automated robot tests:**
  - silhouette per pose
  - a joint sweep: no gaps, no wrong overlaps
  - the model sheet rendered by the same code as the animation
  - foot contact on walks and hits
- **Gate:** a test reel (~45–60 s of the Ep. 4 fight), side by side with Ep. 2's yard battle, approved by the creator before production.
- **Render pipeline v2 (`episode1/render2.js`, `RV2.frame`):**
  - **Layers:** scenes draw into named layers. A layer draws straight onto the frame unless it needs a depth-of-field blur (`dof`) or a 2D rim light (`rim`). A layer with a fixed look gets `cache: key` and is drawn and blurred once while the key stays the same.
  - **One "post map" multiply per frame (half size)** carries:
    - ambient darkness with the light pools
    - the tint (grade)
    - the vignette
    - the grain
  - **The emissive pass:** drawn sharp on the frame, and again at a quarter size for bloom, which is added only inside the bounding box of the lit pixels.
  - **Blur:** a downsample chain, never canvas `filter: blur()`, which is ~10× slower in software rendering.
- **Render cost budget: ≤ 2× the old frame time.** Measured in `lab/` with the night street, the T-800, a laser and the full stack:
  - 66 ms against 37 ms (1.8×)
  - the 2D rim light costs ~+45 ms, so it is used only on chosen shots (robots get rim light from `robot3d.js` for free)

## Music in episodes
- **The file:** a track supplied by the creator lives in `<ep>/music/*_full.*`, which is ignored by git.
- **The cues:** `tools/music_cue.py` finds them by word timestamps (scribe), cuts the excerpts with fades and normalises them. Builds embed only the excerpts.
- **Playback:** the engine's music bus plays the cues per scene, the same in the player and the export:
  - «speaker» EQ for music playing inside the scene, opening to full range for dramatic moments
  - ducking under the voices
  - −20 LUFS when featured, −28 under dialogue
- **The opening (from Ep. 4 on, the creator's note):** an episode opens on the show's logo over the cold open's music, featured and full range, with no voices. Then the cut into the scene, where the music narrows to the room («speaker») and dips under the lines (duck .2, about −14 dB).
  - No line plays over a song's vocals: dialogue goes over instrumental passages (Ep. 4's cue repeats the intro for that), and the vocals come back when nobody speaks.
  - Measured in Ep. 4's export, voices muted: logo ≈ −21 dB, under the recipe lines ≈ −35 dB, chorus ≈ −18 dB.
- **Ducking:** `SND2.music` merges lines less than 0.7 s apart into one dip. Separate dips used to overlap, and the release of one cancelled the next: the second line of a pair played over undipped music.
- **Colour changes:** `eqAt: [[t, 'full' | 'speaker'], …]` for several changes in one cue (full under the logo, speaker in the room, full again at the transformation).

## Pending
- **Μαρία's voice (Ep. 1–3):** the creator finds it odd in places, with nothing specific to fix. Rework it across all three episodes later: audition voices, regenerate her lines, check every line again by ear. Until then only single lines are fixed (Ep. 2 s06: «…της οικογένειας», with a pause, so it doesn't run into «τησικογένειας»).

## Subtitles (Greek and English)

- **Source:** every line has `el` (spoken, the subtitle in Greek) and `en` (English subtitle).
  - The English is written by Claude in context, not machine-translated.
  - Terms:
    - σίτα → «the screen door» (object) / «Sita» (name)
    - ΣίταAI → «SitaAI», Σίταdel → «Sitadel»
    - παράσιτα → «parasites»
    - ταψί → «baking tray»
    - «air fryer» stays
  - Swearing keeps the Greek intensity («μαλάκα» → «you moron» / «prick», never «dude»).
  - Jokes are adapted, not translated word for word.
- **Changing English lines:** `python3 tools/set_en.py episodeN table.json` (`{"<el>": "<new en>"}`). It finds each line by its Greek text and touches only `en`.
- **Checking the English:** before a draft goes to review, no Greek letters may remain in the English lines.
- **Render:** `export_mp4.js` now renders a **clean picture** by default (`SUBS=soft`).
  - It writes `out/<ep>.el.vtt` and `out/<ep>.en.vtt` with the same timings as the player.
  - It muxes both tracks into the MP4 (Greek default), so a downloaded file switches language in any player.
  - `SUBS=burn` renders the old way, with Greek drawn in.
- **Site:**
  - `publish.py` copies the two `.vtt` next to the release.
  - `/ep/<slug>` shows a ΕΛ | EN | Off picker.
  - `?lang=en` opens in English, also for `/`, `/play/<slug>` and `/review/<ep>`.
  - The interactive player (`/play/<slug>`, and `/review/<ep>`) gets `static/subs-pick.js`, injected by `server.py`. It shows one **CC** button that cycles ΕΛ → EN → ✕ (off); on the public page the key **C** does the same. "Off" swaps the engine's `drawSubs` for a no-op, the same hook the exporter uses. The choice is kept in `localStorage['sita-subs']`, shared with `/ep`. This needs no rebuild of the episodes.
  - Every render is soft by default, so the subtitles come with every new episode automatically. Never pass `SUBS=burn` for a release.
  - Releases rendered before this have Greek burned in; their page says so and points to the interactive version. Re-rendered with soft subtitles: Ep. 2 r02, Ep. 3 r02, Ep. 1 (the remake, r02). Episode 1 r01 is the last burned one and stays only as history.

