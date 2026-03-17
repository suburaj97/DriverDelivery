import type { TextStyle } from 'react-native';
import { hp } from '@/utils/responsive';

export const typography = {
  heading1: {
    fontSize: hp('3.4%'),
    lineHeight: hp('4.2%'),
    fontWeight: '800',
    letterSpacing: -0.2,
  } satisfies TextStyle,
  heading2: {
    fontSize: hp('2.4%'),
    lineHeight: hp('3.2%'),
    fontWeight: '700',
    letterSpacing: -0.1,
  } satisfies TextStyle,
  body: {
    fontSize: hp('1.9%'),
    lineHeight: hp('2.6%'),
    fontWeight: '400',
  } satisfies TextStyle,
  caption: {
    fontSize: hp('1.5%'),
    lineHeight: hp('2.0%'),
    fontWeight: '500',
  } satisfies TextStyle,
  button: {
    fontSize: hp('1.9%'),
    lineHeight: hp('2.2%'),
    fontWeight: '700',
    letterSpacing: 0.2,
  } satisfies TextStyle,
} as const;

export type Typography = typeof typography;
