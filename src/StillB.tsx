import React from 'react';
import {AbsoluteFill} from 'remotion';
import {mono, plex, serif} from './fonts';

// Direction B: MANUSCRIPT INTO PLACE.
// Foundation: the Charter of Ban Kulin, 29 August 1189 (trade pledge to Dubrovnik).
// The parchment and ink are generated for this study. The surviving copies are in Bosnian Cyrillic;
// their letterforms are NOT reproduced here. The line shown is a published Latin-letter
// transliteration with scribal abbreviations expanded in parentheses.

const SHEET = '150,232 1112,214 1130,952 162,970';

export const StillB: React.FC = () => {
  const rules = Array.from({length: 10}, (_, i) => 330 + i * 62);
  return (
    <AbsoluteFill style={{background: '#0a0c10'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="bgB" cx="30%" cy="50%" r="85%">
            <stop offset="0" stopColor="#2b241b" />
            <stop offset="0.5" stopColor="#12141a" />
            <stop offset="1" stopColor="#07080b" />
          </radialGradient>
          <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d9c595" />
            <stop offset="0.55" stopColor="#c9b27f" />
            <stop offset="1" stopColor="#b79d68" />
          </linearGradient>
          <filter id="shadowB" x="-10%" y="-10%" width="125%" height="130%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <filter
            id="parch"
            x="0"
            y="0"
            width="1920"
            height="1080"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="5" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="20" xChannelSelector="R" yChannelSelector="G" result="deckle" />
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.006" numOctaves="4" seed="12" result="blot" />
            <feColorMatrix in="blot" type="matrix" values="0.55 0 0 0 0.6  0.5 0 0 0 0.56  0.4 0 0 0 0.46  0 0 0 0 1" result="blotC" />
            <feBlend in="deckle" in2="blotC" mode="multiply" result="stained" />
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.019" numOctaves="4" seed="8" result="crink" />
            <feColorMatrix in="crink" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 1 0 0 -0.9" result="crinkA" />
            <feDiffuseLighting in="crinkA" surfaceScale="1.2" diffuseConstant="1.0" lightingColor="#fff6dc" result="crinkL0">
              <feDistantLight azimuth="196" elevation="34" />
            </feDiffuseLighting>
            <feComponentTransfer in="crinkL0" result="crinkL">
              <feFuncR type="linear" slope="1.55" />
              <feFuncG type="linear" slope="1.55" />
              <feFuncB type="linear" slope="1.55" />
            </feComponentTransfer>
            <feBlend in="stained" in2="crinkL" mode="multiply" result="lit" />
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="2" result="fiber" />
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
          <filter id="ink" x="-5%" y="-10%" width="110%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="31" result="w" />
            <feDisplacementMap in="SourceGraphic" in2="w" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="0.55" result="b" />
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="6" result="speck" />
            <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -5 3.6" result="speckA" />
            <feComposite in="b" in2="speckA" operator="in" />
          </filter>
        </defs>

        <rect width="1920" height="1080" fill="url(#bgB)" />
        <polygon points={SHEET} fill="#000" opacity="0.8" transform="translate(24,34)" filter="url(#shadowB)" />

        <g transform="rotate(-1.2 640 590)">
          <g filter="url(#parch)">
            <polygon points={SHEET} fill="url(#skin)" />
          </g>
          {rules.map((y) => (
            <line key={y} x1="226" x2="1056" y1={y} y2={y + 1.5} stroke="#5a3c1e" strokeOpacity="0.22" strokeWidth="1.4" />
          ))}
          <line x1="226" x2="226" y1="290" y2="900" stroke="#5a3c1e" strokeOpacity="0.2" strokeWidth="1.4" />
          <line x1="1056" x2="1056" y1="290" y2="900" stroke="#5a3c1e" strokeOpacity="0.2" strokeWidth="1.4" />
          <g filter="url(#ink)" fontFamily={serif} fill="#23150b" fontSize="76" fontWeight="600" letterSpacing="1">
            <text x="258" y="480">U ime oca i</text>
            <text x="258" y="572">s(i)na i s(ve)toga</text>
            <text x="258" y="664">d(u)ha.</text>
          </g>
          <g fontFamily={mono} fontSize="17" fill="#4a3219" opacity="0.7" letterSpacing="1">
            <text x="258" y="866">TRANSLITERATION, NOT FACSIMILE</text>
          </g>
        </g>
      </svg>

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 40% 55%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      <div style={{position: 'absolute', left: 96, top: 70, color: '#e9e1d0', fontFamily: plex}}>
        <div style={{fontFamily: mono, fontSize: 20, letterSpacing: 4, color: '#d9a441'}}>
          MEDIEVAL BOSNIA · DIRECTION B
        </div>
        <div style={{fontSize: 66, fontWeight: 600, marginTop: 10, letterSpacing: -1}}>Manuscript into place</div>
      </div>

      <div style={{position: 'absolute', left: 1240, top: 300, width: 600, color: '#d9d2c1', fontFamily: plex}}>
        <div style={{fontFamily: mono, fontSize: 46, color: '#f0c46a', letterSpacing: 2}}>29 AUG 1189</div>
        <div style={{fontSize: 30, marginTop: 18, lineHeight: 1.35, fontWeight: 500}}>
          Ban Kulin of Bosnia pledges free trade to the Republic of Ragusa (Dubrovnik).
        </div>
        <div style={{fontSize: 22, marginTop: 22, lineHeight: 1.5, color: '#b9b1a0'}}>
          Written in Bosnian Cyrillic, alongside a Latin text. No toll, no coercion by the ban's officers, an oath sworn on the Gospels.
        </div>
        <div style={{fontFamily: mono, fontSize: 17, marginTop: 30, lineHeight: 1.6, color: '#a79f8d', letterSpacing: 0.5}}>
          CONTESTED: the Saint Petersburg copy is traditionally called the original. Some scholars dispute that.
        </div>
      </div>

      <div style={{position: 'absolute', left: 96, bottom: 40, right: 96, fontFamily: mono, fontSize: 17, color: '#d9a441', letterSpacing: 1, lineHeight: 1.6}}>
        RECONSTRUCTION: parchment, ink and layout are generated. Surviving copies are in Bosnian Cyrillic, whose letterforms are not reproduced here.
      </div>
    </AbsoluteFill>
  );
};
