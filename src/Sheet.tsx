import React from 'react';

// A generated writing surface. It is NOT a depiction of any surviving copy: no material is claimed.
// The surface is built in its own coordinate system and moved with CSS, so its texture does not shimmer.

export const SW = 1020;
export const SH = 800;

const INTACT = '40,52 980,34 1000,752 52,770';

// Only one corner is missing (Karavdic: the Dubrovnik copy on a damaged sheet lacks its lower corner; the text is complete).
const tornPoints = () =>
  '40,52 980,34 1000,520 975,556 958,590 931,612 912,648 872,668 850,704 806,722 778,752 760,771 52,770';


export const Sheet: React.FC<{
  id: string;
  azimuth: number;
  seed: number;
  torn?: boolean;
  children?: React.ReactNode;
}> = ({id, azimuth, seed, torn, children}) => {
  const pts = torn ? tornPoints() : INTACT;
  return (
    <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{display: 'block', overflow: 'visible'}}>
      <defs>
        <linearGradient id={`skin-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9c595" />
          <stop offset="0.55" stopColor="#c9b27f" />
          <stop offset="1" stopColor="#b79d68" />
        </linearGradient>
        <filter
          id={`parch-${id}`}
          x="0"
          y="0"
          width={SW}
          height={SH}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed={seed} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="20" xChannelSelector="R" yChannelSelector="G" result="deckle" />
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.006" numOctaves="4" seed={seed + 7} result="blot" />
          <feColorMatrix in="blot" type="matrix" values="0.55 0 0 0 0.6  0.5 0 0 0 0.56  0.4 0 0 0 0.46  0 0 0 0 1" result="blotC" />
          <feBlend in="deckle" in2="blotC" mode="multiply" result="stained" />
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.019" numOctaves="4" seed={seed + 3} result="crink" />
          <feColorMatrix in="crink" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 1 0 0 -0.9" result="crinkA" />
          <feDiffuseLighting in="crinkA" surfaceScale="1.6" diffuseConstant="1.0" lightingColor="#fff6dc" result="crinkL0">
            <feDistantLight azimuth={azimuth} elevation="30" />
          </feDiffuseLighting>
          <feComponentTransfer in="crinkL0" result="crinkL">
            <feFuncR type="linear" slope="1.7" />
            <feFuncG type="linear" slope="1.7" />
            <feFuncB type="linear" slope="1.7" />
          </feComponentTransfer>
          <feBlend in="stained" in2="crinkL" mode="multiply" result="lit" />
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed={seed + 1} result="fiber" />
          <feColorMatrix in="fiber" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.12  0.6 0 0 0 -0.22" result="fiberC" />
          <feMorphology in="deckle" operator="erode" radius="22" result="er" />
          <feGaussianBlur in="er" stdDeviation="24" result="erb" />
          <feComposite in="deckle" in2="erb" operator="out" result="edgeBand" />
          <feFlood floodColor="#3b2610" floodOpacity="0.85" result="burnC" />
          <feComposite in="burnC" in2="edgeBand" operator="in" result="burn" />
          <feMerge result="all">
            <feMergeNode in="lit" />
            <feMergeNode in="fiberC" />
            <feMergeNode in="burn" />
          </feMerge>
          <feComposite in="all" in2="deckle" operator="in" />
        </filter>
        <filter id={`ink-${id}`} x="-5%" y="-10%" width="110%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed={31 + seed} result="w" />
          <feDisplacementMap in="SourceGraphic" in2="w" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.5" result="b" />
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed={6 + seed} result="speck" />
          <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -5 3.6" result="speckA" />
          <feComposite in="b" in2="speckA" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#parch-${id})`}>
        <polygon points={pts} fill={`url(#skin-${id})`} />
      </g>
      {children}
    </svg>
  );
};

// Ink that is written left to right with a soft leading edge. `p` is progress 0..1 across [x0, x0 + span].
export const InkText: React.FC<{
  sheetId: string;
  uid: string;
  text: string;
  x: number;
  y: number;
  size: number;
  anchor?: 'start' | 'middle';
  p: number;
  dry: number; // 0 wet .. 1 dry
  span: number;
  fontFamily: string;
  weight?: number;
  letterSpacing?: number;
}> = ({sheetId, uid, text, x, y, size, anchor = 'start', p, dry, span, fontFamily, weight = 600, letterSpacing = 0.5}) => {
  const x0 = anchor === 'middle' ? x - span / 2 : x - 10;
  const feather = 70;
  const edge = x0 + p * (span + feather) - feather;
  return (
    <g filter={`url(#ink-${sheetId})`} opacity={0.62 + 0.36 * dry}>
      <defs>
        <linearGradient id={`fade-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={`mask-${uid}`} maskUnits="userSpaceOnUse" x="-1000" y="-200" width={SW + 2000} height={SH + 400}>
          <rect x="-1000" y="-200" width={Math.max(0, edge + 1000)} height={SH + 400} fill="#fff" />
          <rect x={edge} y="-200" width={feather} height={SH + 400} fill={`url(#fade-${uid})`} />
        </mask>
      </defs>
      <g mask={`url(#mask-${uid})`}>
        <text
          x={x}
          y={y}
          textAnchor={anchor}
          fontFamily={fontFamily}
          fontSize={size}
          fontWeight={weight}
          letterSpacing={letterSpacing}
          fill="#23150b"
        >
          {text}
        </text>
      </g>
    </g>
  );
};
