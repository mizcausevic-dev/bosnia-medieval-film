import React from 'react';
import {AbsoluteFill} from 'remotion';
import {mono, plex} from './fonts';

// Direction C: LAYERS OF A BOSNIAN CITY (site: Jajce).
// The three sheets are time slices of political control, not architecture. The topography is a
// schematic invented for this diagram (not surveyed). The Pliva joining the Vrbas at Jajce is the
// one geographic fact it encodes. No buildings are drawn until documented views are chosen.

const blob = (cx: number, cy: number, r: number, seed: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const rr = r * (1 + 0.14 * Math.sin(3 * a + seed) + 0.07 * Math.sin(5 * a + seed * 2.1) + 0.04 * Math.sin(8 * a + seed * 0.7));
    pts.push(`${i === 0 ? 'M' : 'L'}${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a) * 0.82).toFixed(1)}`);
  }
  return pts.join(' ') + ' Z';
};

type Layer = {x: number; y: number; fill: string; line: string; year: string};

const LAYERS: Layer[] = [
  {x: 150, y: 330, fill: '#243a3c', line: '#8fb6b0', year: '1396'},
  {x: 214, y: 290, fill: '#3a3128', line: '#c9a574', year: '1463'},
  {x: 278, y: 250, fill: '#2d2f3d', line: '#9aa3d4', year: '1527'},
];

const LW = 860;
const LH = 560;

const Sheet: React.FC<{layer: Layer; idx: number}> = ({layer, idx}) => {
  const {x, y, fill, line, year} = layer;
  const hx = 560 + idx * 6;
  const hy = 270;
  return (
    <g transform={`translate(${x} ${y})`} filter="url(#lift)">
      <rect width={LW} height={LH} rx="6" fill={fill} />
      <rect width={LW} height={LH} rx="6" fill="url(#paperGrain)" opacity="0.5" />
      <clipPath id={`clip${idx}`}>
        <rect width={LW} height={LH} rx="6" />
      </clipPath>
      <g clipPath={`url(#clip${idx})`} fill="none" stroke={line} strokeOpacity="0.55" strokeWidth="1.6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => (
          <path key={k} d={blob(hx, hy, 34 * k, 1.3 + idx * 0.15)} />
        ))}
        {/* Vrbas (main river) and Pliva (joining) are schematic */}
        <path d="M-10,150 C190,230 330,330 470,372 C560,398 660,440 910,500" strokeWidth="9" strokeOpacity="0.5" />
        <path d="M600,-10 C560,110 500,250 470,372" strokeWidth="6" strokeOpacity="0.5" />
      </g>
      {/* confluence mark: waterfall site, 22 m high per the cited source */}
      <g stroke={line} strokeWidth="2" strokeOpacity="0.9">
        <path d="M452,374 l-16,-6 m16,6 l-14,10 m14,-10 l-4,-16" />
      </g>
      {/* citadel point: location marker only, not a drawing of the fortress */}
      <circle cx={hx} cy={hy - 10} r="9" fill={line} fillOpacity={idx === 0 ? 0.95 : 0.45} />
      <circle cx={hx} cy={hy - 10} r="19" fill="none" stroke={line} strokeOpacity="0.6" strokeWidth="2" />
      <text x="-14" y={LH - 24} fill={line} fontFamily={mono} fontSize="40" transform={`rotate(-90 -14 ${LH - 24})`} letterSpacing="4" opacity="0.95">
        {year}
      </text>
    </g>
  );
};

export const StillC: React.FC = () => (
  <AbsoluteFill style={{background: '#0a0c10'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="bgC" cx="30%" cy="55%" r="90%">
          <stop offset="0" stopColor="#1d2730" />
          <stop offset="0.55" stopColor="#10141a" />
          <stop offset="1" stopColor="#07080b" />
        </radialGradient>
        <filter id="lift" x="-10%" y="-10%" width="125%" height="130%">
          <feDropShadow dx="-12" dy="16" stdDeviation="14" floodColor="#000" floodOpacity="0.6" />
        </filter>
        <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="1920" height="1080" fill="url(#bgC)" />
      {LAYERS.map((l, i) => (
        <Sheet key={l.year} layer={l} idx={i} />
      ))}
    </svg>

    <AbsoluteFill
      style={{background: 'radial-gradient(ellipse at 35% 55%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)'}}
    />

    <div style={{position: 'absolute', left: 96, top: 70, color: '#e9e1d0', fontFamily: plex}}>
      <div style={{fontFamily: mono, fontSize: 20, letterSpacing: 4, color: '#d9a441'}}>
        MEDIEVAL BOSNIA · DIRECTION C
      </div>
      <div style={{fontSize: 66, fontWeight: 600, marginTop: 10, letterSpacing: -1}}>Layers of a Bosnian city</div>
    </div>

    <div style={{position: 'absolute', left: 1240, top: 290, width: 590, color: '#d9d2c1', fontFamily: plex}}>
      <div style={{fontFamily: mono, fontSize: 40, color: '#f0c46a', letterSpacing: 2}}>JAJCE · 1396 – 1527</div>
      <div style={{fontSize: 24, marginTop: 24, lineHeight: 1.5}}>
        <div><span style={{fontFamily: mono, color: '#8fb6b0'}}>1396</span> First known written reference to Jajce. The fortress already stood.</div>
        <div style={{marginTop: 14}}><span style={{fontFamily: mono, color: '#c9a574'}}>1463</span> Ottoman forces take Jajce and execute King Stjepan Tomašević.</div>
        <div style={{marginTop: 14}}><span style={{fontFamily: mono, color: '#9aa3d4'}}>1527</span> Ottoman rule after the Hungarian-held Banate of Jajce.</div>
      </div>
      <div style={{fontFamily: mono, fontSize: 17, marginTop: 28, lineHeight: 1.6, color: '#a79f8d', letterSpacing: 0.5}}>
        UNCERTAIN: the fortress founding date, and the Catacombs as a tomb of Hrvoje Vukčić Hrvatinić, are attributed, not proven. Sources differ on when the Banate began (1463 or 1464).
      </div>
    </div>

    <div style={{position: 'absolute', left: 96, bottom: 40, right: 96, fontFamily: mono, fontSize: 17, color: '#d9a441', letterSpacing: 1, lineHeight: 1.6}}>
      SCHEMATIC: topography invented for the diagram, not surveyed. Sheets mark who held the town, not buildings. No architecture is drawn until documented views are chosen.
    </div>
  </AbsoluteFill>
);
