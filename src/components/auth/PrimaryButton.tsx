import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';

type Props = {
  title: string;
  onPress: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export const PrimaryButton: React.FC<Props> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value ? 0.98 : 1, { duration: 110 }),
      },
    ],
    opacity: withTiming(disabled ? 0.6 : 1, { duration: 110 }),
  }));

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        button: {
          height: 52,
          borderRadius: 14,
          backgroundColor: theme.colors.brand.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: theme.colors.brand.primary,
          shadowOpacity: theme.mode === 'dark' ? 0.35 : 0.22,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        },
        label: {
          color: '#FFFFFF',
          fontSize: 15,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
      }),
    [theme],
  );

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={() => {
          pressed.value = 1;
        }}
        onPressOut={() => {
          pressed.value = 0;
        }}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.label}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};
