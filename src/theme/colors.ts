export type ThemeMode = 'light' | 'dark';

const shared = {
  brand: {
    primary: '#4F46E5',
    secondary: '#A855F7',
  },
  semantic: {
    success: '#16A34A',
    warning: '#F59E0B',
    error: '#DC2626',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#0B1220',
  },
};

export const colors = {
  light: {
    ...shared,
    background: '#F6F7FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',
    text: '#0F172A',
    textSecondary: '#475569',
    border: '#E2E8F0',
    muted: '#94A3B8',
    overlay: 'rgba(15, 23, 42, 0.28)',
    focus: '#1D4ED8',
  },
  dark: {
    ...shared,
    background: '#0B0F1A',
    surface: '#0F172A',
    surfaceAlt: '#111C33',
    text: '#E2E8F0',
    textSecondary: '#94A3B8',
    border: '#1E293B',
    muted: '#64748B',
    overlay: 'rgba(226, 232, 240, 0.16)',
    focus: '#60A5FA',
  },
} as const;

export type ThemeColors = (typeof colors)[ThemeMode];
