import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme';
import { wp } from '@/utils/responsive';

export interface AvatarProps {
  name?: string;
  uri?: string;
  size?: number;
  accessibilityLabel?: string;
}

const getInitials = (name?: string) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join('');
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  uri,
  size = wp('10%'),
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const initials = getInitials(name);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.surfaceAlt,
          borderWidth: 1,
          borderColor: theme.colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        image: {
          width: size,
          height: size,
        },
        text: {
          ...theme.typography.caption,
          color: theme.colors.text,
        },
      }),
    [size, theme],
  );

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? name ?? t('common.avatar')}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      ) : (
        <Text style={styles.text}>{initials || '•'}</Text>
      )}
    </View>
  );
};
