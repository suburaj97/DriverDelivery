import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { Delivery } from '@/types/Delivery';
import { useTheme } from '@/theme';
import { Card } from './ui/Card';
import { Icon } from './ui/Icon';
import { IconButton } from './ui/IconButton';
import { StatusPill } from './StatusPill';

interface DeliveryCardProps {
  delivery: Delivery;
  onPress?: () => void;
  onNavigate?: () => void;
  onMarkDelivered?: () => void;
}

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  onPress,
  onNavigate,
  onMarkDelivered,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.md,
          gap: theme.spacing.md,
        },
        orderId: {
          ...theme.typography.body,
          fontWeight: '800',
          color: theme.colors.text,
        },
        customer: {
          ...theme.typography.body,
          fontWeight: '700',
          color: theme.colors.text,
          marginBottom: theme.spacing.xs,
        },
        address: {
          ...theme.typography.body,
          color: theme.colors.textSecondary,
        },
        footer: {
          marginTop: theme.spacing.lg,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: theme.spacing.sm,
        },
      }),
    [theme],
  );

  const hasActions = Boolean(onNavigate || onMarkDelivered);

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={t('deliveries.cardA11y', {
        orderId: delivery.orderId,
        customerName: delivery.customerName,
      })}
    >
      <View style={styles.header}>
        <Text style={styles.orderId}>
          {t('deliveries.orderNumber', { orderId: delivery.orderId })}
        </Text>
        <StatusPill status={delivery.status} />
      </View>

      <Text style={styles.customer}>{delivery.customerName}</Text>
      <Text style={styles.address}>{delivery.address}</Text>

      {hasActions ? (
        <View style={styles.footer}>
          {onNavigate ? (
            <IconButton
              onPress={onNavigate}
              accessibilityLabel={t('deliveries.navigateA11y', {
                orderId: delivery.orderId,
              })}
              icon={<Icon name="navigation" color={theme.colors.brand.primary} />}
            />
          ) : null}
          {onMarkDelivered ? (
            <IconButton
              onPress={onMarkDelivered}
              accessibilityLabel={t('deliveries.markDeliveredA11y', {
                orderId: delivery.orderId,
              })}
              icon={<Icon name="check" color={theme.colors.semantic.success} />}
            />
          ) : null}
        </View>
      ) : null}
    </Card>
  );
};
