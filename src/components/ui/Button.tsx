import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme';
import { hp } from '@/utils/responsive';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  accessibilityLabel,
  testID,
  left,
  right,
  style,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDisabled = disabled || loading || !onPress;
  const scale = useSharedValue(1);

  const tap = React.useMemo(() => {
    return Gesture.Tap()
      .enabled(!isDisabled)
      .onBegin(() => {
        scale.value = withTiming(0.98, { duration: 90 });
      })
      .onFinalize(() => {
        scale.value = withTiming(1, { duration: 120 });
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

  const styles = React.useMemo(() => {
    const baseBg =
      variant === 'primary'
        ? theme.colors.brand.primary
        : variant === 'secondary'
          ? theme.colors.brand.secondary
          : 'transparent';

    const baseBorder =
      variant === 'ghost' ? theme.colors.border : 'transparent';

    const baseText =
      variant === 'ghost' ? theme.colors.text : theme.colors.neutral.white;

    return StyleSheet.create({
      container: {
        width: fullWidth ? '100%' : undefined,
      },
      button: {
        borderRadius: theme.radius.md,
        paddingHorizontal: size === 'sm' ? theme.spacing.md : theme.spacing.lg,
        paddingVertical: size === 'sm' ? theme.spacing.sm : theme.spacing.md,
        minHeight: size === 'sm' ? hp('5.6%') : hp('6.4%'),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm,
        backgroundColor: baseBg,
        borderWidth: 1,
        borderColor: baseBorder,
      },
      disabled: {
        opacity: 0.55,
      },
      title: {
        ...theme.typography.button,
        color: baseText,
      },
      spinner: {
        marginRight: theme.spacing.xs,
      },
    });
  }, [fullWidth, size, theme, variant]);

  const spinnerColor =
    variant === 'ghost' ? theme.colors.text : theme.colors.neutral.white;

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View
          testID={testID}
          accessible
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? title}
          accessibilityState={{ disabled: isDisabled, busy: loading }}
          style={[styles.button, isDisabled && styles.disabled, style]}
        >
          {loading ? (
            <ActivityIndicator
              color={spinnerColor}
              style={styles.spinner}
              accessibilityLabel={t('common.loading')}
            />
          ) : null}
          {left}
          <Text style={styles.title}>{title}</Text>
          {right}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};
