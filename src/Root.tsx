import React from 'react';
import {Composition, Still} from 'remotion';
import {Film} from './Film';
import {StillA} from './StillA';
import {StillB} from './StillB';
import {StillC} from './StillC';
import {FPS, H, TOTAL, W} from './timeline';

export const Root: React.FC = () => (
  <>
    <Composition id="Kulin" component={Film} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
    <Still id="DirectionA" component={StillA} width={W} height={H} />
    <Still id="DirectionB" component={StillB} width={W} height={H} />
    <Still id="DirectionC" component={StillC} width={W} height={H} />
  </>
);
