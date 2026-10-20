# bosnia-medieval-film

**Preview page (film, key frames, evidence table): https://mizcausevic-dev.github.io/bosnia-medieval-film/**

A 15-second Remotion film, "Manuscript into place", on the Charter of Ban Kulin (29 August 1189). Built from an evidence-graded fact sheet: every caption traces to a row in `FACT_SHEET-Claude.md`.

Status: public for reading and review (the film itself is not yet published anywhere else). The film's surface, ink and sound are generated, and the film says so on screen.

## Read first
- `FACT_SHEET-Claude.md`: the only historical authority for what the film may say, with evidence grades.
- `STORYBOARD-Claude.md`: scenes, captions, sound plan, and the rev 2 changes after independent review.
- `HISTORICAL_NOTE-Claude.md`: the short historical note with sources and labels.
- `ARTICLE_DRAFT-Claude.md`: draft Medium article (not published; one placeholder for the author's own words).

## Layout
- `src/` Remotion project (`Film.tsx` main film, `timeline.ts` timings and captions, `Sheet.tsx` generated surface and ink).
- `src/StillA.tsx`, `StillB.tsx`, `StillC.tsx` and `stills/`: the three direction proposals (stone, manuscript, Jajce layers). Only B was built. The stills are proposal-stage artwork: B's still uses wording the fact sheet later rejected ("Republic of Ragusa", "no toll", "parchment"), and A and C are unverified studies.
- `audio/synth.py`: deterministic ambient sound, picture-locked to `timeline.ts`.
- `qa/check_frames.py`: measures caption margins and contrast on the delivered MP4. `qa/contact-*.png`: contact sheets.
- `docs/`: the preview page served by GitHub Pages (`index.html`, key-frame JPEGs, the share MP4). Only this folder is published.
- `out/bosnia-1189-charter-15s-share-Claude.mp4`: 6 MB share copy. The 31 MB master is not committed.

## Rebuild
```bash
npm install
npx remotion render src/index.ts Kulin out/kulin-silent-Claude.mp4
python audio/synth.py audio/ambient-raw-Claude.wav
ffmpeg -i out/kulin-silent-Claude.mp4 -i audio/ambient-raw-Claude.wav \
  -filter_complex "[1:a]volume=3.0dB,alimiter=limit=0.84:level=disabled[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -t 15 \
  out/bosnia-1189-charter-15s-Claude.mp4
python qa/check_frames.py out/bosnia-1189-charter-15s-Claude.mp4
```
Needs Node 24, Python 3 with numpy, scipy and Pillow, and ffmpeg. Fonts load from Google Fonts at render time.

## Limits
No critical edition or facsimile was consulted. The audio was measured but not listened to by the author of the build or the reviewer. See the fact sheet and historical note for details.

## Third-party material
- The fact sheet and note quote short phrases from Z. Karavdić, "O Povelji Kulina bana" (c. 2009), and cite it. Her article and the page scans are not included here.
- No image or facsimile of any surviving copy of the charter is used. Everything on screen is generated.
- Fonts (IBM Plex Sans, Fragment Mono, Source Serif 4) are loaded from Google Fonts under their open licenses.

## License
No license is granted. The repository is public so the work can be read and checked; all rights are reserved.
