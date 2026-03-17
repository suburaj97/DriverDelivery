import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  accessibilityLabel?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  accessibilityLabel,
}) => {
  const theme = useTheme();

  const styles = React.useMemo(() => {
    const bg =
      variant === 'success'
        ? 'rgba(22, 163, 74, 0.14)'
        : variant === 'warning'
          ? 'rgba(245, 158, 11, 0.16)'
          : variant === 'error'
            ? 'rgba(220, 38, 38, 0.14)'
            : variant === 'info'
              ? 'rgba(37, 99, 235, 0.14)'
              : theme.colors.surfaceAlt;

    const fg =
      variant === 'success'
        ? theme.colors.semantic.success
        : variant === 'warning'
          ? theme.colors.semantic.warning
          : variant === 'error'
            ? theme.colors.semantic.error
            : variant === 'info'
              ? theme.colors.brand.primary
              : theme.colors.textSecondary;

    return StyleSheet.create({
      container: {
        alignSelf: 'flex-start',
        borderRadius: theme.radius.pill,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      text: {
        ...theme.typography.caption,
        color: fg,
        fontWeight: '700',
      },
    });
  }, [theme, variant]);

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};
