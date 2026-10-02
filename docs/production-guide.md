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
- **Collaborators ("Γίνε μέρος της παραγωγής!"):** the public pages show that button (or «Studio» when signed in). Anyone can sign up with Google (`google_client_id` in `site.json`; the token is checked with Google's `tokeninfo`, no client secret is used or stored) or with email + password (pbkdf2; a honeypot and per-IP limits; no email confirmation).
  - **Admins:** `owner_emails` in `site.json` (now `wenor555@gmail.com`): signing in with that Google account or email gives the same rights as `ceo` (owner log, adopt, users page); it can't be blocked.
  - Accounts live in `~/sita-site/users.json`. The owner sees them at `/review/users` and can block or unblock anyone.
  - Collaborators see every draft and revision, with the same player and quick menu. A 6-step tour opens for every new account (collaborators and admins) until they finish it; skipping is possible but asks first and is marked «δεν προτείνεται»; «?» opens it again.
  - Their notes go to `review/<ep>.community.jsonl`, with their name. They see the notes of all collaborators, never the owner's. They can delete only their own notes and cannot set a status. The owner's log pages and exports are owner-only.
  - The owner sees them as a second, hollow-dot lane on the timeline (toggle «Σχόλια κοινότητας»), and in the list with the author's name.
  - **General discussion:** under the notes, «Γενικά σχόλια για το επεισόδιο» (💡 idea, 💬 comment, ❓ question), not tied to a moment, in `review/<ep>.general.jsonl`. Everyone (collaborators and owner) reads and writes there; each deletes their own, the owner any.
  - **Votes:** ▲ ▼ on every general post and every collaborator's frame note; one vote per person (clicking again takes it back). Lists can sort by top or newest.
  - **Claude never acts on a collaborator's note.** `review.py pull` (the work list) reads only the owner's log. `review.py community <ep>` prints the collaborators' notes by person and the general discussion by score, for a briefing only. A note becomes work when the creator says so, or presses «Υιοθέτηση»: that copies it into the owner's log, credited («από: <name>»).
- **Deploy:** `bash site/deploy.sh` copies the files, installs `render_ep.sh`, adds the crontab lines (`@reboot` and a check every 5 minutes through `run.sh`), and restarts the server. The passphrase lives only in `~/sita-site/secret.json` (mode 600) on the node.

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
  - Releases rendered before this have Greek burned in; their page says so and points to the interactive version.

