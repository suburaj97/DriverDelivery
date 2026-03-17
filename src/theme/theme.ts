import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native';

import { colors, type ThemeColors, type ThemeMode } from './colors';
import { radius, type Radius } from './radius';
import { shadows, type Shadows } from './shadows';
import { spacing, type Spacing } from './spacing';
import { typography, type Typography } from './typography';

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: Spacing;
  radius: Radius;
  typography: Typography;
  shadows: Shadows;
  navigation: NavigationTheme;
}

export const createTheme = (mode: ThemeMode): Theme => {
  const c = colors[mode];
  const baseNav = mode === 'dark' ? DarkTheme : DefaultTheme;

  return {
    mode,
    colors: c,
    spacing,
    radius,
    typography,
    shadows,
    navigation: {
      ...baseNav,
      dark: mode === 'dark',
      colors: {
        ...baseNav.colors,
        primary: c.brand.primary,
        background: c.background,
        card: c.surface,
        text: c.text,
        border: c.border,
        notification: c.semantic.error,
      },
    },
  };
};
