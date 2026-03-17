import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useTheme } from '@/theme';
import { hp, wp } from '@/utils/responsive';
import { Button } from './Button';
import { Card } from './Card';
import { Icon } from './Icon';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionTitle?: string;
  onActionPress?: () => void;
  accessibilityLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionTitle,
  onActionPress,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const iconSize = React.useMemo(() => Math.min(wp('14%'), hp('9%')), []);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: '100%',
        },
        center: {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: theme.spacing.xl,
        },
        iconWrap: {
          width: iconSize,
          height: iconSize,
          borderRadius: iconSize / 2,
          backgroundColor: theme.colors.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: theme.spacing.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        title: {
          ...theme.typography.heading2,
          color: theme.colors.text,
          textAlign: 'center',
        },
        description: {
          marginTop: theme.spacing.sm,
          ...theme.typography.body,
          color: theme.colors.textSecondary,
          textAlign: 'center',
        },
        action: {
          marginTop: theme.spacing.lg,
          alignSelf: 'stretch',
        },
      }),
    [iconSize, theme],
  );

  return (
    <Animated.View entering={FadeIn} style={styles.center}>
      <Card
        accessibilityLabel={accessibilityLabel ?? title}
        style={styles.card}
      >
        <View style={styles.center}>
          <View style={styles.iconWrap}>
            {icon ?? (
              <Icon
                name="inbox"
                size={Math.max(18, Math.round(iconSize * 0.38))}
                color={theme.colors.textSecondary}
              />
            )}
          </View>
          <Text style={styles.title}>{title}</Text>
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
          {actionTitle && onActionPress ? (
            <View style={styles.action}>
              <Button title={actionTitle} onPress={onActionPress} />
            </View>
          ) : null}
        </View>
      </Card>
    </Animated.View>
  );
};
