import { useThemeContext } from './ThemeProvider';

export const useTheme = () => useThemeContext().theme;

