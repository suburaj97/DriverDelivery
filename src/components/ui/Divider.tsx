import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

export const Divider: React.FC<{ spacing?: number }> = ({ spacing }) => {
  const theme = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: theme.colors.border,
          marginVertical: spacing ?? theme.spacing.md,
        },
      }),
    [spacing, theme],
  );

  return <View style={styles.divider} accessibilityRole="none" />;
};
