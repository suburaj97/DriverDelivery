import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  prefix?: string;
  title: string;
  onPress: () => void | Promise<void>;
  accessibilityLabel?: string;
};

export const SecondaryTextButton: React.FC<Props> = ({
  prefix,
  title,
  onPress,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: theme.spacing.sm,
        },
        row: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 6,
        },
        prefix: {
          color: theme.colors.textSecondary,
          fontSize: 13,
          fontWeight: '600',
        },
        title: {
          color: theme.colors.brand.primary,
          fontSize: 13,
          fontWeight: '700',
        },
      }),
    [theme],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={styles.wrap}
      hitSlop={10}
    >
      <View style={styles.row}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
  );
};
