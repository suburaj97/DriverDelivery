import React from 'react';
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

import { Button as UIButton } from './ui/Button';

interface ButtonProps {
  title: string;
  onPress?: (event?: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
  testID,
}) => {
  return (
    <UIButton
      title={title}
      onPress={onPress ? () => onPress() : undefined}
      loading={loading}
      disabled={disabled}
      style={style}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
};

