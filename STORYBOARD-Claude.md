# Storyboard: "Manuscript into place" (15 s)

Status: APPROVED 2026-10-19, then revised (rev 2) after the independent review. Rev 2 timings live in src/timeline.ts; the table below is the approved rev 1 and is superseded where rev 2 says so. Built only from FACT_SHEET-Claude.md (approved 2026-10-19, typographic, no facsimile).
Spec: 1920x1080, 30 fps, 450 frames, H.264 + AAC, English captions, no people, no maps.

## The idea in one line
On 29 August 1189, Ban Kulin of Bosnia put a promise to Dubrovnik's people in writing. Three copies survive, and which is the original is debated.

## Timeline

| Scene | Time (frames) | Historical purpose | Main action | Supporting motion 1 | Supporting motion 2 |
|---|---|---|---|---|---|
| 1. The date | 0.0 to 4.5 s (0 to 135) | Anchor when, who and to whom | Ink reveals "29 AUGUST 1189" on the sheet, left to right with a soft edge | Raking light drifts across the sheet, so crinkle shadows shift | Slow push-in, scale 1.00 to 1.035 |
| 2. The promise | 4.5 to 10.5 s (135 to 315) | Say what was promised, and who wrote it | Ink writes three lines on the sheet: "I, Kulin, ban of Bosnia," / "promise you, Krvaš," / "and all the citizens of Dubrovnik:" | Faint ruling lines surface in the paper as the light passes | Sheet drifts 24 px left, a slight parallax against the background |
| 3. Three copies | 10.5 to 15.0 s (315 to 450) | Show that the record survives in three copies, and that its origin is debated | The sheet separates into three offset sheets (paper layers sliding apart) | Small ink labels appear under each sheet | The light sweep ends; the third sheet has a torn lower edge |

## Captions (all from the approved fact sheet)

| Time | Position | Text |
|---|---|---|
| 1.8 to 4.2 s | Bottom left | Ban Kulin of Bosnia writes to Dubrovnik. |
| 6.0 to 8.3 s | Bottom left | He promises Dubrovnik's people safe passage and trade in his lands. |
| 8.3 to 10.3 s | Bottom left | Written by the scribe Radoje, in Bosnian Cyrillic. |
| 11.3 to 13.0 s | Bottom left | Three copies survive. Which is the original is debated. |
| 11.5 to 13.0 s | Under each sheet, small mono | Saint Petersburg · Dubrovnik, whole sheet · Dubrovnik, damaged sheet |
| 13.0 to 15.0 s (end card) | Centered, small | Generated surface and ink. English rendering of a published modern translation. / Interpretations of the charter's place in national histories are contested. / Sources: Z. Karavdić (c. 2009); ANUBiH, Osamsto godina Povelje (1989). |

- Type: IBM Plex Sans for captions, Fragment Mono for labels, Source Serif 4 for ink text. Caption size 40 px or larger, end card 24 px or larger.
- Safe margin: 96 px on all sides. Caption contrast at least 4.5:1 against the darkest and lightest background behind it.
- Each caption shows at least 2.0 s (the longest, 12 words, shows for 2.3 s).

## What is generated, and how it is labelled
- **Generated:** parchment-like surface, ink, lighting, grain, the three blank sheets. Labelled on the end card.
- **Documented detail used:** the third sheet's torn lower edge, taken from Karavdić's figure caption for the Dubrovnik copy on a "damaged sheet". Only one edge is torn. No damage shape is claimed to be accurate.
- **Not claimed:** any writing material (the surface is not called parchment or paper), any letterform of a real copy, and any resemblance between the three sheets and the real copies. The three sheets are generic blanks, stated on the end card as "generated surface".
- **Wording on the sheet:** the English lines are a rendering of Karavdić's modern translation of the opening. Abridged: the title of Krvaš is left out because the sources differ on how to translate it.

## Sound (restrained, synthesized in code; no claim of "authentic" or "period" music)

| Time | Sound | Matches |
|---|---|---|
| 0.0 s | Low room tone: soft sub drone near 55 Hz plus filtered air, fading in over 1 s | Open from black |
| 0.5 to 2.2 s | Quill-like scratch (band-passed noise grains, 3 to 6 kHz), one grain per ink stroke | Date reveal |
| 4.5 s | Short paper rustle swell | Scene 2 start |
| 5.0 to 8.0 s | Three scratch passes, one per line | Ink lines |
| 10.5 s | Three staggered paper slides and one soft low thud (48 Hz, 0.35 s decay) | Sheet separation |
| 11.3 to 12.0 s | Three small ink taps | Labels |
| 13.0 to 15.0 s | Room tone decays; fade to silence in the last 0.5 s | End card |

- No melody, no vocals, no stinger. Hits stay soft so the film does not feel like a trailer.
- Target: about -14 LUFS integrated, true peak at or below -1 dBTP, 48 kHz AAC.

## Production plan
- **Toolchain:** Remotion 4.0.531 (SVG filters for surface and lighting), Python for the audio synth, ffmpeg and ffprobe for the mux and checks. Output goes to `out/`.
- **Build order:** (1) scene engine and caption layer, (2) contact-sheet check of 9 frames, (3) audio synth and mux, (4) render, (5) technical and historical checks, (6) independent review, (7) fixes, (8) delivery.
- **Technical checks I will run and report with real output:** duration (15.000 s, within 0.04 s), resolution, frame count (450), codec and pixel format, audio stream presence, silence detection, loudness and true peak, extracted frames at every caption start, middle and end.
- **Historical check:** each caption and label compared line by line with the fact sheet.
- **Independent review:** a separate reviewer agent that sees only the fact sheet and the extracted frames, not my conclusions, and is asked to find misleading implications, unreadable text, and visual errors. If that agent is unavailable, I will say so and do a separate review pass myself.

## Risks and the fallback for each
- **Heavy per-frame filters.** If a frame renders slowly, I render the static surface once and animate only the light and ink on top of it.
- **Caption legibility over bright parchment.** Captions sit on a dark band below the sheet, not on the sheet.
- **The three-sheet split could read as three identical copies.** The labels and the "damaged sheet" edge distinguish them, and the end card states the sheets are generated.

## Rev 2 changes after independent review (2026-10-19)
- **Timing:** scene 2 starts at 4.0 s (was 4.5), scene 3 at 10.0 s (was 10.5). Captions run 1.6 to 3.9, 5.1 to 7.8, 7.8 to 10.0 and 10.2 to 12.5 s. The sheets separate from 10.0 to 11.1 s and the tableau holds until 12.5 s. The end card fades in from 12.8 s and holds about 1.7 s.
- **Ink:** the sheet text dissolves (9.4 to 10.0 s) before the sheets separate, so no copy carries the English lines.
- **Persistent tag:** "GENERATED SURFACE AND INK · ENGLISH RENDERING OF A PUBLISHED TRANSLATION", top left, 24 px, from 0.5 s. It sits 56 px from the top edge (inside 5% title safe). Captions keep the 96 px margin.
- **End card:** one line, "The charter's place in national histories is contested.", and one source line crediting Karavdić only.
- **Third sheet:** one missing lower corner only (was a torn full bottom edge), label "Dubrovnik, corner missing" (was "damaged sheet"). Basis: FACT_SHEET row 11.
- **Sound:** cues retimed to match; scratches trimmed about 3 dB; thud and slides about 4 to 5 dB lower; mix at about -14.9 LUFS, true peak -1.5 dBFS.
