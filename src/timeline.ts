// Frame timeline for the 15 s film (30 fps, 450 frames). Mirrors STORYBOARD-Claude.md (rev 2, after review).
export const FPS = 30;
export const TOTAL = 450;
export const W = 1920;
export const H = 1080;

export const s = (sec: number) => Math.round(sec * FPS);

export const T = {
  // scene 1: the date
  dateStart: s(0.5),
  dateEnd: s(2.2),
  // scene 2: the promise
  scene2: s(4.0),
  line1: [s(4.5), s(5.7)],
  line2: [s(5.7), s(6.7)],
  line3: [s(6.7), s(8.2)],
  rulesIn: [s(4.0), s(7.2)],
  // scene 3: three copies
  scene3: s(10.0),
  inkFade: [s(9.4), s(10.0)],
  split: [s(10.0), s(11.1)],
  labelsIn: [s(10.6), s(11.1)],
  sheetsOut: [s(12.5), s(13.1)],
  endIn: [s(12.8), s(13.15)],
  tagIn: s(0.5),
} as const;

export type Caption = {from: number; to: number; text: string};

// Every caption is taken from the approved fact sheet.
export const CAPTIONS: Caption[] = [
  {from: s(1.6), to: s(3.9), text: 'Ban Kulin of Bosnia writes to Dubrovnik.'},
  {from: s(5.1), to: s(7.8), text: 'He promises Dubrovnik’s people safe passage and trade in his lands.'},
  {from: s(7.8), to: s(10.0), text: 'Written by the scribe Radoje, in Bosnian Cyrillic.'},
  {from: s(10.2), to: s(12.5), text: 'Three copies survive. Which is the original is debated.'},
];

// Labels follow Karavdic's figure captions: B "on a whole sheet", C "on a damaged sheet" (one corner missing).
export const LABELS = ['Saint Petersburg', 'Dubrovnik, whole sheet', 'Dubrovnik, corner missing'];

export const TAG = 'GENERATED SURFACE AND INK · ENGLISH RENDERING OF A PUBLISHED TRANSLATION';
