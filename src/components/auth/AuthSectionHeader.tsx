import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
};

export const AuthSectionHeader: React.FC<Props> = ({ title, subtitle }) => {
  const theme = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          marginBottom: theme.spacing.lg,
        },
        title: {
          color: theme.colors.text,
          fontSize: 18,
          fontWeight: '700',
          letterSpacing: -0.2,
        },
        subtitle: {
          marginTop: theme.spacing.xs,
          color: theme.colors.textSecondary,
          fontSize: 13,
          fontWeight: '500',
        },
      }),
    [theme],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

