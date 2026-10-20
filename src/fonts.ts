import {loadFont as loadPlex} from '@remotion/google-fonts/IBMPlexSans';
import {loadFont as loadMono} from '@remotion/google-fonts/FragmentMono';
import {loadFont as loadSerif} from '@remotion/google-fonts/SourceSerif4';

export const plex = loadPlex('normal', {
  weights: ['400', '500', '600'],
  subsets: ['latin', 'latin-ext'],
}).fontFamily;

export const mono = loadMono('normal', {
  weights: ['400'],
  subsets: ['latin', 'latin-ext'],
}).fontFamily;

export const serif = loadSerif('normal', {
  weights: ['400', '600'],
  subsets: ['latin', 'latin-ext'],
}).fontFamily;
