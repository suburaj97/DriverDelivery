import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
  useWindowDimensions,
} from 'react-native';
import MapView, { Marker, Polyline, type Region } from 'react-native-maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/ScreenContainer';
import { DeliveryCard } from '@/components/DeliveryCard';
import { EmptyState, Icon, IconButton, Section } from '@/components/ui';
import { useDeliveries } from '@/hooks/useDeliveries';
import { useLocation } from '@/hooks/useLocation';
import type { MainStackParamList } from '@/types/Navigation';
import type { Delivery } from '@/types/Delivery';
import { optimizeRoute } from '@/services/routeService';
import type { Coordinates } from '@/utils/locationUtils';
import { useTheme } from '@/theme';
import Config from 'react-native-config';
import { openTurnByTurnNavigation } from '@/utils/openTurnByTurnNavigation';

type Props = NativeStackScreenProps<MainStackParamList, 'OptimizedRoute'>;

export const OptimizedRouteScreen: React.FC<Props> = () => {
  const { deliveries, markDelivered } = useDeliveries();
  const { currentLocation, startWatching, stopWatching } = useLocation();
  const [routeOrder, setRouteOrder] = useState<Delivery[]>([]);
  const [routeMode, setRouteMode] = useState<'google' | 'local'>('local');
  const [mapStatus, setMapStatus] = useState<
    'skipped' | 'loading' | 'ready' | 'failed'
  >('loading');
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const { t } = useTranslation();
  const hasMapsApiKey = Boolean(Config.GOOGLE_MAPS_API_KEY);
  const mapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inlineMapRef = useRef<MapView | null>(null);
  const fullMapRef = useRef<MapView | null>(null);
  const lastGoogleOptimizeAtRef = useRef<number>(0);
  const lastStopsSignatureRef = useRef<string>('');
  const lastKnownRegionRef = useRef<Region | null>(null);
  const hasUserMovedMapRef = useRef(false);
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);

  useEffect(() => {
    startWatching();
    return () => {
      stopWatching();
    };
  }, [startWatching, stopWatching]);

  useEffect(() => {
    if (!currentLocation) return;

    const activeDeliveries = deliveries.filter(
      (d) => d.status !== 'delivered',
    ) as Delivery[];

    const stopsSignature = activeDeliveries.map((d) => d.id).join('|');
    const deliveriesChanged = stopsSignature !== lastStopsSignatureRef.current;
    if (deliveriesChanged) {
      lastStopsSignatureRef.current = stopsSignature;
    }

    const now = Date.now();
    const googleCooldownMs = 60_000;
    const canCallGoogle = now - lastGoogleOptimizeAtRef.current > googleCooldownMs;
    const preferGoogle =
      hasMapsApiKey && mapStatus === 'ready' && (deliveriesChanged || canCallGoogle);

    console.log(
      `[route] optimize preferGoogle=${preferGoogle} hasKey=${hasMapsApiKey} mapStatus=${mapStatus} stops=${activeDeliveries.length}`,
    );

    let cancelled = false;
    const runOptimization = async () => {
      const result = await optimizeRoute(currentLocation, activeDeliveries, {
        googleMapsApiKey: Config.GOOGLE_MAPS_API_KEY,
        preferGoogle,
      });

      if (cancelled) return;
      setRouteOrder(result.orderedDeliveries);
      setRouteMode(result.mode);

      if (result.mode === 'google') {
        lastGoogleOptimizeAtRef.current = Date.now();
      } else if (preferGoogle) {
        const keyFailureStatuses = new Set([
          'REQUEST_DENIED',
          'INVALID_REQUEST',
          'OVER_DAILY_LIMIT',
          'OVER_QUERY_LIMIT',
        ]);
        if (result.googleErrorStatus && keyFailureStatuses.has(result.googleErrorStatus)) {
          console.log(
            `[route] Google key/config issue (${result.googleErrorStatus}); hiding map UI`,
          );
          setMapStatus('failed');
        }
      }
    };
    runOptimization().catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [currentLocation, deliveries, hasMapsApiKey, mapStatus]);

  const polylineCoords = useMemo(() => {
    const coords: Coordinates[] = [];
    if (currentLocation) {
      coords.push(currentLocation);
    }
    routeOrder.forEach((d) => {
      coords.push({ lat: d.lat, lng: d.lng });
    });
    return coords
      .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng))
      .map((c) => ({ latitude: c.lat, longitude: c.lng }));
  }, [currentLocation, routeOrder]);

  const firstPoint = polylineCoords[0];

  useEffect(() => {
    if (mapTimeoutRef.current) {
      clearTimeout(mapTimeoutRef.current);
      mapTimeoutRef.current = null;
    }

    if (!hasMapsApiKey) {
      setMapStatus('skipped');
      return;
    }

    if (!firstPoint) {
      setMapStatus('loading');
      return;
    }

    setMapStatus('loading');
    mapTimeoutRef.current = setTimeout(() => {
      console.log('[route] Map did not become ready in time; using fallback UI');
      setMapStatus('failed');
    }, 4000);

    return () => {
      if (mapTimeoutRef.current) {
        clearTimeout(mapTimeoutRef.current);
        mapTimeoutRef.current = null;
      }
    };
  }, [hasMapsApiKey, firstPoint]);

  const mapHeight = React.useMemo(() => {
    return height * (height >= 1024 ? 0.35 : 0.42);
  }, [height]);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        mapContainer: {
          height: mapHeight,
          borderRadius: theme.radius.lg,
          overflow: 'hidden',
          marginBottom: theme.spacing.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        mapContainerFull: {
          flex: 1,
          borderRadius: 0,
          marginBottom: 0,
          borderWidth: 0,
        },
        mapOverlay: {
          position: 'absolute',
          top: theme.spacing.md,
          right: theme.spacing.md,
          gap: theme.spacing.sm,
        },
        listSection: {
          flex: 1,
        },
        stopsHeader: {
          marginBottom: theme.spacing.md,
        },
        stopsTitle: {
          ...theme.typography.heading2,
          color: theme.colors.text,
        },
        stopsSubtitle: {
          marginTop: theme.spacing.xs,
          ...theme.typography.body,
          color: theme.colors.textSecondary,
        },
        listContent: {
          paddingBottom: theme.spacing.xl,
          gap: theme.spacing.md,
        },
      }),
    [mapHeight, theme],
  );

  const recenterToDriver = (activeMap: MapView | null) => {
    if (!currentLocation) return;

    const latitudeDelta = lastKnownRegionRef.current?.latitudeDelta ?? 0.05;
    const longitudeDelta = lastKnownRegionRef.current?.longitudeDelta ?? 0.05;
    const nextRegion: Region = {
      latitude: currentLocation.lat,
      longitude: currentLocation.lng,
      latitudeDelta,
      longitudeDelta,
    };

    lastKnownRegionRef.current = nextRegion;
    activeMap?.animateToRegion(nextRegion, 350);
  };

  const renderMap = ({
    fullScreen,
    mapRef,
    active,
  }: {
    fullScreen: boolean;
    mapRef: React.RefObject<MapView | null>;
    active: boolean;
  }): React.ReactNode => {
    if (!hasMapsApiKey) {
      return (
        <EmptyState
          title={t('route.missingMapsKeyTitle')}
          description={t('route.missingMapsKeyDescription')}
          icon={
            <Icon
              name={Platform.OS === 'android' ? 'alert-triangle' : 'alert-circle'}
              size={28}
              color={theme.colors.textSecondary}
            />
          }
        />
      );
    }

    if (mapStatus === 'failed') {
      return (
        <EmptyState
          title={t('route.mapUnavailableTitle')}
          description={t('route.mapUnavailableDescription')}
          icon={<Icon name="map" size={28} color={theme.colors.textSecondary} />}
        />
      );
    }

    if (!firstPoint) {
      return (
        <EmptyState
          title={t('route.mapLoadingTitle')}
          description={t('route.mapLoadingDescription')}
          icon={<Icon name="map" size={28} color={theme.colors.textSecondary} />}
        />
      );
    }

    if (!active) {
      return <View style={StyleSheet.absoluteFill} />;
    }

    const initialRegion: Region =
      lastKnownRegionRef.current ?? {
        latitude: firstPoint.latitude,
        longitude: firstPoint.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

    return (
      <>
        <MapView
          ref={(next) => {
            mapRef.current = next;
          }}
          style={StyleSheet.absoluteFill}
          onMapReady={() => {
            if (mapTimeoutRef.current) {
              clearTimeout(mapTimeoutRef.current);
              mapTimeoutRef.current = null;
            }
            setMapStatus('ready');
          }}
          initialRegion={initialRegion}
          onPanDrag={() => {
            hasUserMovedMapRef.current = true;
          }}
          onRegionChangeComplete={(region) => {
            lastKnownRegionRef.current = region;
          }}
        >
          {currentLocation ? (
            <Marker
              coordinate={{
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
              }}
              title={t('route.driverMarkerTitle')}
              pinColor={theme.colors.brand.secondary}
            />
          ) : null}

          {routeOrder
            .filter((d) => Number.isFinite(d.lat) && Number.isFinite(d.lng))
            .map((delivery) => (
              <Marker
                key={delivery.id}
                coordinate={{
                  latitude: delivery.lat,
                  longitude: delivery.lng,
                }}
                title={delivery.customerName}
                description={delivery.address}
              />
            ))}

          {polylineCoords.length > 1 ? (
            <Polyline
              coordinates={polylineCoords}
              strokeColor={theme.colors.brand.primary}
              strokeWidth={4}
            />
          ) : null}
        </MapView>

        <View style={styles.mapOverlay}>
          <IconButton
            onPress={() => recenterToDriver(mapRef.current)}
            disabled={!currentLocation}
            accessibilityLabel={t('route.recenterA11y')}
            icon={<Icon name="crosshair" color={theme.colors.text} />}
          />
          <IconButton
            onPress={() => setIsMapFullScreen(!fullScreen)}
            accessibilityLabel={
              fullScreen ? t('route.exitFullScreenA11y') : t('route.fullScreenA11y')
            }
            icon={
              <Icon
                name={fullScreen ? 'minimize-2' : 'maximize-2'}
                color={theme.colors.text}
              />
            }
          />
        </View>
      </>
    );
  };

  useEffect(() => {
    if (!hasMapsApiKey) return;
    if (mapStatus !== 'ready') return;
    if (polylineCoords.length < 2) return;
    if (hasUserMovedMapRef.current) return;

    const activeMap = (isMapFullScreen ? fullMapRef : inlineMapRef).current;
    if (!activeMap) return;

    // Fit once for a good "preview" (driver + all stops). After the user touches
    // the map, stop auto-fitting to avoid surprise zoom changes.
    const edgePadding = isMapFullScreen
      ? { top: 64, right: 48, bottom: 64, left: 48 }
      : { top: 48, right: 32, bottom: 48, left: 32 };

    activeMap.fitToCoordinates(polylineCoords, {
      edgePadding,
      animated: true,
    });
  }, [hasMapsApiKey, isMapFullScreen, mapStatus, polylineCoords]);

  const renderItem: ListRenderItem<Delivery> = ({ item }) => (
    <Animated.View entering={FadeInDown.duration(220)}>
      <DeliveryCard
        delivery={item}
        onNavigate={() => {
          openTurnByTurnNavigation({
            origin: currentLocation,
            destination: { lat: item.lat, lng: item.lng },
            destinationLabel: item.customerName,
          }).catch(() => {});
        }}
        onMarkDelivered={async () => {
          await markDelivered(item.id);
        }}
      />
    </Animated.View>
  );

  return (
    <ScreenContainer>
      <Animated.View entering={FadeIn.duration(160)} style={styles.listSection}>
        <Modal
          visible={isMapFullScreen}
          animationType="slide"
          onRequestClose={() => setIsMapFullScreen(false)}
        >
          <SafeAreaView
            style={[
              styles.listSection,
              { backgroundColor: theme.colors.background },
            ]}
            edges={['top', 'bottom']}
          >
            <View style={styles.mapContainerFull}>
              {renderMap({
                fullScreen: true,
                mapRef: fullMapRef,
                active: isMapFullScreen,
              })}
            </View>
          </SafeAreaView>
        </Modal>

        <FlatList
          data={routeOrder}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          // Keeping MapView mounted prevents scroll-induced remounts that reset camera position.
          removeClippedSubviews={false}
          initialNumToRender={10}
          windowSize={8}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          ListHeaderComponent={
            <>
              <View style={styles.mapContainer}>
                {renderMap({
                  fullScreen: false,
                  mapRef: inlineMapRef,
                  active: !isMapFullScreen,
                })}
              </View>

              <View style={styles.stopsHeader}>
                <Text style={styles.stopsTitle}>{t('route.stopsTitle')}</Text>
                <Text style={styles.stopsSubtitle}>
                  {`${t('route.stopsSubtitle')} • ${
                    routeMode === 'google'
                      ? t('route.optimizedLiveTraffic')
                      : t('route.optimizedDistanceOnly')
                  }`}
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <Section>
              <EmptyState
                title={t('route.emptyTitle')}
                description={t('route.emptyDescription')}
                icon={
                  <Icon
                    name="map-pin"
                    size={28}
                    color={theme.colors.textSecondary}
                  />
                }
              />
            </Section>
          }
        />
      </Animated.View>
    </ScreenContainer>
  );
};
