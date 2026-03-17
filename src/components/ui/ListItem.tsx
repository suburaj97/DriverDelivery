import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';
import { Card } from './Card';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  left,
  right,
  onPress,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
        },
        body: {
          flex: 1,
        },
        title: {
          ...theme.typography.body,
          fontWeight: '700',
          color: theme.colors.text,
        },
        subtitle: {
          marginTop: theme.spacing.xs,
          ...theme.typography.caption,
          color: theme.colors.textSecondary,
        },
      }),
    [theme],
  );

  return (
    <Card onPress={onPress} accessibilityLabel={accessibilityLabel ?? title}>
      <View style={styles.row}>
        {left}
        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
    </Card>
  );
};
