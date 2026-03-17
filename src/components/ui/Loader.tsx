import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme';

export interface LoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ label, fullScreen }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const resolvedLabel = label ?? t('common.loading');
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: fullScreen ? 1 : undefined,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: theme.spacing.xl,
        },
        label: {
          marginTop: theme.spacing.md,
          ...theme.typography.caption,
          color: theme.colors.textSecondary,
        },
      }),
    [fullScreen, theme],
  );

  return (
    <Animated.View entering={FadeIn} style={styles.container} accessible>
      <ActivityIndicator size="large" color={theme.colors.brand.primary} />
      <Text style={styles.label}>{resolvedLabel}</Text>
    </Animated.View>
  );
};
