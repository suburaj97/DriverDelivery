import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, right }) => {
  const theme = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        },
        textBlock: {
          flex: 1,
        },
        title: {
          ...theme.typography.heading2,
          color: theme.colors.text,
        },
        subtitle: {
          marginTop: theme.spacing.xs,
          ...theme.typography.body,
          color: theme.colors.textSecondary,
        },
      }),
    [theme],
  );

  return (
    <View style={styles.container} accessible accessibilityRole="header">
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
};
