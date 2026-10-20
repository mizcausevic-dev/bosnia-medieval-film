import React from 'react';
import {AbsoluteFill} from 'remotion';
import {mono, plex} from './fonts';

// Direction A: STONE INTO MEMORY.
// A composite study of motifs that are documented on stećci (arcade, crescent, rosette,
// spiral, vine with trefoils, standing figure with raised hand). It is NOT a specific monument.
// Relief and lighting are reconstructed procedurally: a height map lit by a low raking light.

const SLAB = '176,284 520,266 980,274 1420,262 1742,280 1756,590 1740,872 1330,886 900,878 470,890 182,868 166,580';

const vine = (y0: number, phase: number) => {
  const pts: string[] = [];
  const leaves: Array<[number, number]> = [];
  for (let x = 240; x <= 1680; x += 6) {
    const y = y0 + 9 * Math.sin(((x - 240) / 90) * Math.PI * 2 + phase);
    pts.push(`${x === 240 ? 'M' : 'L'}${x},${y.toFixed(1)}`);
  }
  for (let i = 0; i < 16; i++) {
    const x = 285 + i * 90;
    const y = y0 + 9 * Math.sin(((x - 240) / 90) * Math.PI * 2 + phase);
    leaves.push([x, y + (phase === 0 ? -16 : 16)]);
  }
  return {d: pts.join(' '), leaves};
};

const spiral = (cx: number, cy: number) => {
  const pts: string[] = [];
  for (let t = 0; t <= 14; t += 0.2) {
    const r = 6 + 4.4 * t;
    pts.push(`${t === 0 ? 'M' : 'L'}${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`);
  }
  return pts.join(' ');
};

const RED = '#ff0000';
const GREEN = '#00ff00';

export const StillA: React.FC = () => {
  const top = vine(352, 0);
  const bottom = vine(802, Math.PI);
  return (
    <AbsoluteFill style={{background: '#0a0c10'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="bgA" cx="12%" cy="48%" r="85%">
            <stop offset="0" stopColor="#3a2f22" />
            <stop offset="0.45" stopColor="#14161b" />
            <stop offset="1" stopColor="#07080b" />
          </radialGradient>
          <filter id="shadowA" x="-10%" y="-10%" width="120%" height="130%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter
            id="stone"
            x="0"
            y="0"
            width="1920"
            height="1080"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.014" numOctaves="5" seed="7" result="big" />
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="3" result="grain" />
            <feColorMatrix in="big" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0.9 0 0 -0.5" result="bigA" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.4 0.4 0 0 -0.2" result="grainA" />
            <feComposite in="bigA" in2="grainA" operator="arithmetic" k1="0" k2="1" k3="0.22" k4="0" result="noiseH" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="relRaw" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 1 0 0 0" result="incRaw" />
            <feGaussianBlur in="relRaw" stdDeviation="1.6" result="rel" />
            <feGaussianBlur in="incRaw" stdDeviation="1.2" result="inc" />
            <feComposite in="noiseH" in2="rel" operator="arithmetic" k1="0" k2="1" k3="0.75" k4="0" result="h1" />
            <feComposite in="h1" in2="inc" operator="arithmetic" k1="0" k2="1" k3="-0.5" k4="0" result="h2" />
            <feDiffuseLighting in="h2" surfaceScale="11" diffuseConstant="1.35" lightingColor="#f1e4c6" result="lit">
              <feDistantLight azimuth="188" elevation="17" />
            </feDiffuseLighting>
            <feTurbulence type="fractalNoise" baseFrequency="0.005 0.008" numOctaves="4" seed="21" result="stain" />
            <feColorMatrix in="stain" type="matrix" values="0.34 0 0 0 0.66  0.3 0 0 0 0.64  0.24 0 0 0 0.6  0 0 0 0 1" result="tint" />
            <feBlend in="lit" in2="tint" mode="multiply" result="tinted" />
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="44" result="lich" />
            <feColorMatrix in="lich" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.47  0 0 0 0 0.38  9 0 0 0 -5.3" result="lichen" />
            <feComponentTransfer in="lichen" result="lichenSoft">
              <feFuncA type="linear" slope="0.22" />
            </feComponentTransfer>
            <feMerge result="surf">
              <feMergeNode in="tinted" />
              <feMergeNode in="lichenSoft" />
            </feMerge>
            <feComposite in="surf" in2="SourceAlpha" operator="in" />
          </filter>
        </defs>

        <rect width="1920" height="1080" fill="url(#bgA)" />
        <polygon points={SLAB} fill="#000" opacity="0.8" transform="translate(26,34)" filter="url(#shadowA)" />

        <g filter="url(#stone)">
          <polygon points={SLAB} fill="#000" />
          {/* incised frame */}
          <rect x="206" y="304" width="1508" height="544" fill="none" stroke={GREEN} strokeWidth="6" />
          <rect x="224" y="322" width="1472" height="508" fill="none" stroke={GREEN} strokeWidth="3" />

          {/* running vines with trefoils (raised) */}
          <path d={top.d} fill="none" stroke={RED} strokeWidth="9" strokeLinecap="round" />
          <path d={bottom.d} fill="none" stroke={RED} strokeWidth="9" strokeLinecap="round" />
          {[...top.leaves, ...bottom.leaves].map(([x, y], i) => (
            <g key={i} fill={RED}>
              <circle cx={x - 9} cy={y} r="8" />
              <circle cx={x + 9} cy={y} r="8" />
              <circle cx={x} cy={y - 10} r="8" />
            </g>
          ))}

          {/* crescent */}
          <circle cx="340" cy="478" r="66" fill={RED} />
          <circle cx="368" cy="462" r="55" fill="#000" />
          <circle cx="345" cy="478" r="66" fill="none" stroke={GREEN} strokeWidth="3" opacity="0" />

          {/* arcade */}
          {[0, 1, 2, 3, 4].map((i) => {
            const x = 250 + i * 92;
            return (
              <path
                key={i}
                d={`M${x},742 V704 A42,42 0 0 1 ${x + 84},704 V742`}
                fill="none"
                stroke={RED}
                strokeWidth="10"
                strokeLinejoin="round"
              />
            );
          })}
          <path d="M240,744 H710" stroke={RED} strokeWidth="10" />

          {/* standing figure, raised hand (stylised) */}
          <g transform="translate(96 88) scale(0.9)">
          <g fill={RED}>
            <circle cx="960" cy="412" r="31" />
            <polygon points="918,452 1002,452 1018,626 902,626" />
            <rect x="922" y="620" width="34" height="150" rx="6" />
            <rect x="964" y="620" width="34" height="150" rx="6" />
            <polygon points="920,462 944,478 892,404 868,420" />
            <ellipse cx="866" cy="378" rx="32" ry="42" />
            <polygon points="1000,462 1036,470 1046,610 1020,610" />
          </g>
          <g fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round">
            <path d="M846,350 L842,324 M862,342 L862,314 M878,342 L884,316 M892,356 L904,334" />
            <path d="M908,552 H1012" />
            <path d="M960,626 V770" />
          </g>
          </g>

          {/* rosette */}
          <circle cx="1500" cy="470" r="54" fill="none" stroke={RED} strokeWidth="9" />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <ellipse
              key={k}
              cx={1500}
              cy={470 - 28}
              rx="12"
              ry="26"
              fill={RED}
              transform={`rotate(${k * 60} 1500 470)`}
            />
          ))}
          <circle cx="1500" cy="470" r="11" fill={RED} />

          {/* spiral */}
          <path d={spiral(1500, 700)} fill="none" stroke={RED} strokeWidth="9" strokeLinecap="round" />
        </g>

        {/* low-light falloff across the stone */}
        <rect width="1920" height="1080" fill="url(#bgA)" opacity="0" />
      </svg>

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.62) 100%), linear-gradient(90deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.22) 100%)',
        }}
      />
      <AbsoluteFill style={{mixBlendMode: 'soft-light', opacity: 0.35}}>
        <svg width="1920" height="1080">
          <filter id="gr" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="1920" height="1080" filter="url(#gr)" />
        </svg>
      </AbsoluteFill>

      <div style={{position: 'absolute', left: 96, top: 70, color: '#e9e1d0', fontFamily: plex}}>
        <div style={{fontFamily: mono, fontSize: 20, letterSpacing: 4, color: '#d9a441'}}>
          MEDIEVAL BOSNIA · DIRECTION A
        </div>
        <div style={{fontSize: 66, fontWeight: 600, marginTop: 10, letterSpacing: -1}}>Stone into memory</div>
      </div>
      <div style={{position: 'absolute', left: 96, bottom: 52, right: 96, fontFamily: mono, fontSize: 17, color: '#a79f8d', letterSpacing: 1, lineHeight: 1.6}}>
        <div>Stećci · 12th to 16th century · UNESCO World Heritage 2016</div>
        <div style={{color: '#d9a441'}}>RECONSTRUCTION: composite of documented motifs, not a specific monument. Relief and lighting are generated.</div>
      </div>
    </AbsoluteFill>
  );
};
