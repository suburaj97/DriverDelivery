import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  accessibilityLabel,
  style,
}) => {
  const theme = useTheme();
  const isPressable = !!onPress;
  const pressed = useSharedValue(0);

  const tap = React.useMemo(() => {
    return Gesture.Tap()
      .enabled(isPressable)
      .onBegin(() => {
        pressed.value = withTiming(1, { duration: 90 });
      })
      .onFinalize(() => {
        pressed.value = withTiming(0, { duration: 140 });
      })
      .onEnd((_e, success) => {
        if (success && onPress) {
          runOnJS(onPress)();
        }
      });
  }, [isPressable, onPress, pressed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.01 }],
  }));

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.lg,
          ...theme.shadows.sm,
        },
        pressable: {
          overflow: 'hidden',
        },
      }),
    [theme],
  );

  const content = (
    <Animated.View
      style={[
        styles.card,
        isPressable && styles.pressable,
        animatedStyle,
        style,
      ]}
      accessible={isPressable}
      accessibilityRole={isPressable ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Animated.View>
  );

  if (!isPressable) return content;

  return <GestureDetector gesture={tap}>{content}</GestureDetector>;
};
