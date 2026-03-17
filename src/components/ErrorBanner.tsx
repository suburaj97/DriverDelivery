import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

interface ErrorBannerProps {
  message?: string;
  visible: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  visible,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderRadius: theme.radius.md,
          backgroundColor: 'rgba(220, 38, 38, 0.12)',
          borderWidth: 1,
          borderColor: 'rgba(220, 38, 38, 0.22)',
          marginBottom: theme.spacing.md,
        },
        text: {
          ...theme.typography.caption,
          color: theme.colors.semantic.error,
        },
      }),
    [theme],
  );

  if (!visible || !message) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="alert"
      accessibilityLabel={message}
    >
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};
