import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTheme } from '@/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessible?: boolean;
};

export const AuthCard: React.FC<Props> = ({
  children,
  style,
  accessibilityLabel,
  accessible = true,
}) => {
  const theme = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: theme.colors.surface,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.xl,
          shadowColor: '#000',
          shadowOpacity: theme.mode === 'dark' ? 0.4 : 0.1,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
        },
      }),
    [theme],
  );

  return (
    <Animated.View
      entering={FadeInDown.duration(240).springify().damping(18)}
      style={[styles.card, style]}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Animated.View>
  );
};
