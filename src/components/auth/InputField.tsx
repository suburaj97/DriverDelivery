import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  errorText?: string;
  keyboardType?: KeyboardTypeOptions;
};

export const InputField = React.forwardRef<TextInput, Props>(({
  label,
  icon,
  errorText,
  onFocus,
  onBlur,
  secureTextEntry,
  ...props
}, ref) => {
  const theme = useTheme();
  const focus = useSharedValue(0);
  const [isSecure, setIsSecure] = React.useState(Boolean(secureTextEntry));

  const baseBorderColor = theme.colors.border;
  const focusedBorderColor = theme.colors.brand.primary;
  const errorBorderColor = theme.colors.semantic.error;

  const borderStyle = useAnimatedStyle(() => {
    const isError = Boolean(errorText);
    const color = isError
      ? errorBorderColor
      : interpolateColor(
          focus.value,
          [0, 1],
          [baseBorderColor, focusedBorderColor],
        );

    return {
      borderColor: color,
      transform: [{ scale: 1 + focus.value * 0.01 }],
    };
  }, [baseBorderColor, focusedBorderColor, errorBorderColor, errorText]);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          marginBottom: theme.spacing.md,
        },
        label: {
          color: theme.colors.textSecondary,
          fontSize: 12,
          fontWeight: '600',
          marginBottom: theme.spacing.xs,
        },
        inputRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          height: 52,
          borderRadius: 14,
          borderWidth: 1,
          backgroundColor:
            theme.mode === 'dark'
              ? 'rgba(15, 23, 42, 0.65)'
              : theme.colors.surfaceAlt,
        },
        input: {
          flex: 1,
          color: theme.colors.text,
          fontSize: 15,
          fontWeight: '500',
          paddingVertical: 0,
        },
        rightIcon: {
          padding: 6,
          borderRadius: 10,
        },
        error: {
          marginTop: theme.spacing.xs,
          color: theme.colors.semantic.error,
          fontSize: 12,
          fontWeight: '600',
        },
      }),
    [theme],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.inputRow, borderStyle]}>
        <Feather
          name={icon}
          size={18}
          color={errorText ? theme.colors.semantic.error : theme.colors.muted}
        />
        <TextInput
          {...props}
          ref={ref}
          style={styles.input}
          placeholderTextColor={theme.colors.muted}
          secureTextEntry={secureTextEntry ? isSecure : undefined}
          onFocus={(e) => {
            focus.value = withTiming(1, { duration: 140 });
            onFocus?.(e);
          }}
          onBlur={(e) => {
            focus.value = withTiming(0, { duration: 140 });
            onBlur?.(e);
          }}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            onPress={() => setIsSecure((prev) => !prev)}
            hitSlop={10}
            style={styles.rightIcon}
          >
            <Feather
              name={isSecure ? 'eye' : 'eye-off'}
              size={18}
              color={theme.colors.muted}
            />
          </Pressable>
        ) : null}
      </Animated.View>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
});

InputField.displayName = 'InputField';
