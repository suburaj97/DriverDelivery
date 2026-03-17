import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { ScreenContainer } from '@/components/ScreenContainer';
import { DeliveryCard } from '@/components/DeliveryCard';
import { Button, EmptyState, Icon } from '@/components/ui';
import { useDeliveries } from '@/hooks/useDeliveries';
import type { MainStackParamList } from '@/types/Navigation';
import type { Delivery } from '@/types/Delivery';
import { useTheme } from '@/theme';
import { openTurnByTurnNavigation } from '@/utils/openTurnByTurnNavigation';

type Props = NativeStackScreenProps<MainStackParamList, 'Deliveries'>;

export const DeliveriesScreen: React.FC<Props> = ({ navigation }) => {
  const { deliveries, loading, refresh, markDelivered } = useDeliveries();
  const theme = useTheme();
  const { t } = useTranslation();

  const renderItem: ListRenderItem<Delivery> = ({ item }) => (
    <Animated.View entering={FadeInDown.duration(220)}>
      <DeliveryCard
        delivery={item}
        onNavigate={() => {
          openTurnByTurnNavigation({
            destination: { lat: item.lat, lng: item.lng },
            destinationLabel: item.customerName,
          }).catch(() => {});
        }}
        onMarkDelivered={() => markDelivered(item.id)}
      />
    </Animated.View>
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1 },
        listContent: {
          paddingBottom: theme.spacing.xxl + 96,
          gap: theme.spacing.md,
        },
        footer: {
          position: 'absolute',
          left: theme.spacing.lg,
          right: theme.spacing.lg,
          bottom: theme.spacing.lg,
        },
        emptyWrap: {
          paddingTop: theme.spacing.xl,
        },
      }),
    [theme],
  );

  return (
    <ScreenContainer>
      <Animated.View entering={FadeIn.duration(160)} style={styles.flex}>
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
          removeClippedSubviews
          initialNumToRender={10}
          windowSize={8}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyWrap}>
                <EmptyState
                  title={t('deliveries.emptyTitle')}
                  description={t('deliveries.emptyDescription')}
                  icon={
                    <Icon
                      name="truck"
                      size={28}
                      color={theme.colors.textSecondary}
                    />
                  }
                  actionTitle={t('common.refresh')}
                  onActionPress={refresh}
                />
              </View>
            ) : null
          }
        />
        <View style={styles.footer}>
          <Button
            title={t('deliveries.viewOptimizedRoute')}
            onPress={() => navigation.navigate('OptimizedRoute')}
            left={<Icon name="map" color={theme.colors.neutral.white} />}
          />
        </View>
      </Animated.View>
    </ScreenContainer>
  );
};
