import { Platform, type ViewStyle } from 'react-native';

export const shadows = {
  xs: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    android: { elevation: 1 },
    default: {},
  }) as ViewStyle,
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    android: { elevation: 2 },
    default: {},
  }) as ViewStyle,
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 4 },
    default: {},
  }) as ViewStyle,
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 10 },
    },
    android: { elevation: 6 },
    default: {},
  }) as ViewStyle,
} as const;

export type Shadows = typeof shadows;
