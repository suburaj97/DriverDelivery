import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from '@/theme';

export type IconName = React.ComponentProps<typeof Feather>['name'];

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, color }) => {
  const theme = useTheme();
  return <Feather name={name} size={size} color={color ?? theme.colors.text} />;
};

