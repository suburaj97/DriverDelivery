import type { Delivery } from '@/types/Delivery';
import type { Coordinates } from '@/utils/locationUtils';
import { haversineDistanceKm } from '@/utils/locationUtils';

export interface LocalOptimizedRouteResult {
  orderedDeliveries: Delivery[];
  totalDistanceKm: number;
}

export const optimizeRouteLocal = (
  driverLocation: Coordinates,
  deliveries: Delivery[],
): LocalOptimizedRouteResult => {
  if (deliveries.length === 0) {
    return { orderedDeliveries: [], totalDistanceKm: 0 };
  }

  const remaining = [...deliveries];
  const ordered: Delivery[] = [];

  let currentLocation: Coordinates = { ...driverLocation };
  let totalDistanceKm = 0;

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    remaining.forEach((delivery, index) => {
      const distance = haversineDistanceKm(currentLocation, {
        lat: delivery.lat,
        lng: delivery.lng,
      });

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    const [nearest] = remaining.splice(nearestIndex, 1);
    ordered.push(nearest);
    totalDistanceKm += nearestDistance;
    currentLocation = { lat: nearest.lat, lng: nearest.lng };
  }

  return {
    orderedDeliveries: ordered,
    totalDistanceKm,
  };
};

