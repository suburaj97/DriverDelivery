import React from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createTheme, type Theme } from './theme';
import type { ThemeMode } from './colors';

export type ThemePreference = 'system' | ThemeMode;

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = '@theme.preference';

const isThemePreference = (value: unknown): value is ThemePreference =>
  value === 'system' || value === 'light' || value === 'dark';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme();
  const systemMode: ThemeMode = systemScheme === 'dark' ? 'dark' : 'light';

  const [preference, setPreferenceState] =
    React.useState<ThemePreference>('system');

  React.useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!isMounted) return;
        if (isThemePreference(stored)) {
          setPreferenceState(stored);
        }
      })
      .catch(() => {
        // ignore storage failures; fall back to system
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const resolvedMode: ThemeMode =
    preference === 'system' ? systemMode : preference;

  React.useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, preference).catch(() => {
      // ignore storage failures
    });
  }, [preference]);

  const theme = React.useMemo(() => createTheme(resolvedMode), [resolvedMode]);

  const toggleMode = React.useCallback(() => {
    setPreferenceState((prev) => {
      const mode = prev === 'system' ? systemMode : prev;
      return mode === 'dark' ? 'light' : 'dark';
    });
  }, [systemMode]);

  const setPreference = React.useCallback((next: ThemePreference) => {
    setPreferenceState(next);
  }, []);

  const setMode = React.useCallback((mode: ThemeMode) => {
    setPreferenceState(mode);
  }, []);

  const value = React.useMemo(
    () => ({
      theme,
      mode: resolvedMode,
      isDark: resolvedMode === 'dark',
      preference,
      setPreference,
      setMode,
      toggleMode,
    }),
    [preference, resolvedMode, setMode, setPreference, theme, toggleMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = (): ThemeContextValue => {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return ctx;
};
