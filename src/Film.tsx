import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {mono, plex, serif} from './fonts';
import {CAPTIONS, LABELS, TAG, T} from './timeline';
import {InkText, Sheet, SH, SW} from './Sheet';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const prog = (f: number, [a, b]: readonly [number, number] | readonly number[]) =>
  interpolate(f, [a, b], [0, 1], {...clamp, easing: ease});

const CX = SW / 2;
const CY = SH / 2;

const place = (cx: number, cy: number, scale: number): React.CSSProperties => ({
  position: 'absolute',
  left: cx - CX,
  top: cy - CY,
  width: SW,
  height: SH,
  transform: `scale(${scale})`,
  transformOrigin: `${CX}px ${CY}px`,
});

const Captions: React.FC<{f: number}> = ({f}) => (
  <>
    {CAPTIONS.map((c) => {
      const o = interpolate(f, [c.from, c.from + 8, c.to - 8, c.to], [0, 1, 1, 0], clamp);
      if (o <= 0) return null;
      return (
        <div
          key={c.text}
          style={{
            position: 'absolute',
            left: 96,
            right: 96,
            bottom: 104,
            opacity: o,
            transform: `translateY(${(1 - o) * 8}px)`,
            fontFamily: plex,
            fontWeight: 500,
            fontSize: 42,
            lineHeight: 1.25,
            color: '#f1ead9',
            letterSpacing: 0.2,
          }}
        >
          {c.text}
        </div>
      );
    })}
  </>
);

export const Film: React.FC = () => {
  const f = useCurrentFrame();

  const azimuth = 208 - 38 * Easing.out(Easing.quad)(Math.min(f / 390, 1));
  const push = interpolate(f, [0, T.scene3], [1, 1.06], clamp);
  const drift = interpolate(f, [T.scene2, T.scene3], [0, -24], {...clamp, easing: ease});
  const sp = prog(f, T.split);

  // main sheet: centre of frame -> centre of the three-sheet row
  const mainScale = lerp(push, 0.54, sp);
  const mainX = lerp(960 + drift, 960, sp);
  const mainY = lerp(490, 490, sp);
  // the other two start exactly behind the main sheet and slide out from under it
  const sideScale = lerp(push, 0.54, sp);
  const leftX = lerp(960 + drift, 360, sp);
  const rightX = lerp(960 + drift, 1560, sp);

  const sheetsOpacity = interpolate(f, [T.sheetsOut[0], T.sheetsOut[1]], [1, 0], clamp);

  // ink
  const dateP = prog(f, [T.dateStart, T.dateEnd]);
  const dateDry = interpolate(f, [T.dateEnd, T.dateEnd + 40], [0, 1], clamp);
  const dateMove = prog(f, [T.scene2 - 14, T.scene2 + 16]);
  const dateY = lerp(404, 226, dateMove);
  const dateK = lerp(1, 0.68, dateMove);
  const inkOut = 1 - prog(f, T.inkFade);
  const rules = prog(f, T.rulesIn) * 0.2 * inkOut;

  const lineProps = (range: readonly number[]) => ({
    p: prog(f, range),
    dry: interpolate(f, [range[1], range[1] + 36], [0, 1], clamp),
  });

  const labelsO = prog(f, T.labelsIn);
  const endO = interpolate(f, [T.endIn[0], T.endIn[1]], [0, 1], clamp);
  const tagO = interpolate(f, [T.tagIn, T.tagIn + 12], [0, 0.88], clamp);
  const fadeIn = interpolate(f, [0, 14], [1, 0], clamp);
  const fadeOut = interpolate(f, [445, 449], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: '#0a0c10'}}>
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at 38% 48%, #2b241b 0%, #12141a 52%, #07080b 100%)'}}
      />

      <AbsoluteFill style={{opacity: sheetsOpacity}}>
        {/* shadows of the sheets */}
        {sp > 0 && (
          <>
            <div style={{...place(leftX, mainY, sideScale), opacity: Math.min(1, sp * 4)}}>
              <Sheet id="left" azimuth={azimuth} seed={9} />
            </div>
            <div style={{...place(rightX, mainY, sideScale), opacity: Math.min(1, sp * 4)}}>
              <Sheet id="right" azimuth={azimuth} seed={14} torn />
            </div>
          </>
        )}
        <div style={{...place(mainX, mainY, mainScale), filter: 'drop-shadow(-12px 18px 22px rgba(0,0,0,0.55))'}}>
          <Sheet id="main" azimuth={azimuth} seed={5}>
            {/* faint ruling, generated detail only */}
            {rules > 0.002 &&
              [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <line
                  key={i}
                  x1="120"
                  x2="940"
                  y1={150 + i * 78}
                  y2={151.5 + i * 78}
                  stroke="#5a3c1e"
                  strokeOpacity={rules}
                  strokeWidth="1.5"
                />
              ))}
            {inkOut > 0.002 && (
              <g opacity={inkOut}>
                <g transform={`translate(${CX} ${dateY}) scale(${dateK})`}>
                  <InkText
                    sheetId="main"
                    uid="date"
                    text="29 AUGUST 1189"
                    x={0}
                    y={0}
                    size={92}
                    anchor="middle"
                    span={820}
                    p={dateP}
                    dry={dateDry}
                    fontFamily={serif}
                    letterSpacing={2}
                  />
                </g>
                <InkText sheetId="main" uid="l1" text="I, Kulin, ban of Bosnia," x={130} y={410} size={47} span={600} fontFamily={serif} {...lineProps(T.line1)} />
                <InkText sheetId="main" uid="l2" text="promise you, Krvaš," x={130} y={506} size={47} span={480} fontFamily={serif} {...lineProps(T.line2)} />
                <InkText sheetId="main" uid="l3" text="and all the citizens of Dubrovnik:" x={130} y={602} size={47} span={780} fontFamily={serif} {...lineProps(T.line3)} />
              </g>
            )}
          </Sheet>
        </div>

        {labelsO > 0.01 &&
          [360, 960, 1560].map((x, i) => (
            <div
              key={x}
              style={{
                position: 'absolute',
                left: x - 300,
                width: 600,
                top: 762,
                textAlign: 'center',
                fontFamily: mono,
                fontSize: 30,
                letterSpacing: 1,
                color: '#e4dcc8',
                opacity: labelsO,
              }}
            >
              {LABELS[i]}
            </div>
          ))}
      </AbsoluteFill>

      {/* vignette and grain sit under the text so captions stay at full brightness */}
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}}
      />
      <AbsoluteFill style={{mixBlendMode: 'soft-light', opacity: 0.3}}>
        <svg width="1920" height="1080">
          <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 3} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="1920" height="1080" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 56,
          opacity: tagO,
          fontFamily: mono,
          fontSize: 24,
          letterSpacing: 1,
          color: '#d9cfba',
        }}
      >
        {TAG}
      </div>

      {/* caption band */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(5,6,9,0) 72%, rgba(5,6,9,0.92) 100%)',
        }}
      />
      <Captions f={f} />

      {/* end card */}
      {endO > 0.01 && (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: endO,
            fontFamily: plex,
            color: '#e7dfcc',
            textAlign: 'center',
          }}
        >
          <div style={{width: 1500}}>
            <div style={{fontFamily: mono, fontSize: 24, letterSpacing: 4, color: '#d9a441'}}>
              MANUSCRIPT INTO PLACE · CHARTER OF BAN KULIN, 1189
            </div>
            <div style={{fontSize: 48, marginTop: 40, lineHeight: 1.3, fontWeight: 500}}>
              The charter&rsquo;s place in national histories is contested.
            </div>
            <div style={{fontFamily: mono, fontSize: 24, marginTop: 40, lineHeight: 1.6, color: '#b9b1a0'}}>
              Source: Z. Karavdi&#263;, &ldquo;O Povelji Kulina bana&rdquo; (c. 2009)
            </div>
          </div>
        </AbsoluteFill>
      )}

      <AbsoluteFill style={{background: '#000', opacity: Math.max(fadeIn, fadeOut)}} />
    </AbsoluteFill>
  );
};
