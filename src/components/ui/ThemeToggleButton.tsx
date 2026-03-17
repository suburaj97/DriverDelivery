import React from 'react';
import { useTranslation } from 'react-i18next';

import { useThemeContext } from '@/theme';
import { Button } from './Button';

export const ThemeToggleButton: React.FC = () => {
  const { t } = useTranslation();
  const { mode, toggleMode } = useThemeContext();

  return (
    <Button
      title={mode === 'dark' ? t('theme.light') : t('theme.dark')}
      variant="ghost"
      size="sm"
      fullWidth={false}
      onPress={toggleMode}
      accessibilityLabel={t('theme.toggle')}
    />
  );
};
