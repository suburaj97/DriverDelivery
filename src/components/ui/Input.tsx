import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
  type TextInputProps as RNTextInputProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/theme';

export interface InputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  accessibilityLabel?: string;
  testID?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  errorText,
  left,
  right,
  keyboardType,
  returnKeyType,
  accessibilityLabel,
  testID,
  containerStyle,
  inputStyle,
  editable = true,
  secureTextEntry,
  autoCapitalize = 'none',
  autoCorrect = false,
  onFocus,
  onBlur,
  ...rest
}) => {
  const theme = useTheme();
  const [focused, setFocused] = React.useState(false);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: theme.spacing.lg,
        },
        label: {
          ...theme.typography.caption,
          color: theme.colors.textSecondary,
          marginBottom: theme.spacing.xs,
        },
        inputRow: {
          borderWidth: 1,
          borderColor: errorText
            ? theme.colors.semantic.error
            : focused
              ? theme.colors.focus
              : theme.colors.border,
          borderRadius: theme.radius.lg,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          backgroundColor: theme.colors.surface,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
        },
        input: {
          flex: 1,
          paddingVertical: theme.spacing.sm,
          ...theme.typography.body,
          color: theme.colors.text,
        },
        iconWrap: {
          width: 36,
          height: 36,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.surfaceAlt,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        helper: {
          marginTop: theme.spacing.xs,
          ...theme.typography.caption,
          color: theme.colors.textSecondary,
        },
        error: {
          marginTop: theme.spacing.xs,
          ...theme.typography.caption,
          color: theme.colors.semantic.error,
        },
        disabled: {
          opacity: 0.6,
        },
      }),
    [errorText, focused, theme],
  );

  return (
    <View style={[styles.container, !editable && styles.disabled, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputRow}>
        {left ? <View style={styles.iconWrap}>{left}</View> : null}
        <RNTextInput
          testID={testID}
          accessible
          accessibilityLabel={accessibilityLabel ?? label}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          editable={editable}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          selectionColor={theme.colors.brand.primary}
          style={[styles.input, inputStyle]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {right ? <View style={styles.iconWrap}>{right}</View> : null}
      </View>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      {!errorText && helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
};
