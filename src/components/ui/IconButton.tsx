import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  accessibilityLabel,
  disabled = false,
  size = 40,
  style,
}) => {
  const theme = useTheme();
  const isDisabled = disabled || !onPress;
  const scale = useSharedValue(1);

  const tap = React.useMemo(() => {
    return Gesture.Tap()
      .enabled(!isDisabled)
      .onBegin(() => {
        scale.value = withTiming(0.96, { duration: 90 });
      })
      .onFinalize(() => {
        scale.value = withTiming(1, { duration: 130 });
      })
      .onEnd((_e, success) => {
        if (success && onPress) {
          runOnJS(onPress)();
        }
      });
  }, [isDisabled, onPress, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.surfaceAlt,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.xs,
        },
        disabled: {
          opacity: 0.55,
        },
      }),
    [size, theme],
  );

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={animatedStyle}>
        <View
          accessible
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ disabled: isDisabled }}
          style={[styles.container, isDisabled && styles.disabled, style]}
        >
          {icon}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

