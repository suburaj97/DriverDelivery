import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export interface SectionProps {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  right,
  children,
  style,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: theme.spacing.lg,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
          marginBottom: theme.spacing.md,
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
        left: {
          flex: 1,
        },
      }),
    [theme],
  );

  return (
    <View style={[styles.container, style]}>
      {title ? (
        <View style={styles.header}>
          <View style={styles.left}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      ) : null}
      {children}
    </View>
  );
};
