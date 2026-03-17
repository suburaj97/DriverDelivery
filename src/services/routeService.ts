import type { Delivery } from '@/types/Delivery';
import type { Coordinates } from '@/utils/locationUtils';
import { optimizeRouteLocal } from '@/utils/routeFallback';

export type RouteOptimizationMode = 'google' | 'local';

export interface OptimizedRouteResult {
  orderedDeliveries: Delivery[];
  totalDistanceKm: number;
  mode: RouteOptimizationMode;
  totalDurationSec?: number;
  googleErrorStatus?: string;
  googleErrorMessage?: string;
}

type GoogleDistanceMatrixResponse = {
  status: string;
  error_message?: string;
  rows?: Array<{
    elements: Array<{
      status: string;
      distance?: { value: number };
      duration?: { value: number };
      duration_in_traffic?: { value: number };
    }>;
  }>;
};

const buildDistanceMatrixUrl = (
  apiKey: string,
  points: Coordinates[],
): string => {
  const format = (c: Coordinates) => `${c.lat},${c.lng}`;
  const locations = points.map(format).join('|');
  const params = new URLSearchParams();
  params.set('origins', locations);
  params.set('destinations', locations);
  params.set('mode', 'driving');
  params.set('departure_time', 'now');
  params.set('key', apiKey);
  return `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`;
};

const optimizeRouteWithDistanceMatrix = (
  driverLocation: Coordinates,
  deliveries: Delivery[],
  matrix: { distanceM: number; durationS: number }[][],
): OptimizedRouteResult => {
  const remaining = deliveries.map((d, idx) => ({ delivery: d, index: idx + 1 }));
  const ordered: Delivery[] = [];

  let currentIndex = 0;
  let totalDistanceKm = 0;
  let totalDurationSec = 0;

  while (remaining.length > 0) {
    let best = remaining[0];
    let bestDuration = Number.POSITIVE_INFINITY;

    remaining.forEach((candidate) => {
      const edge = matrix[currentIndex]?.[candidate.index];
      if (!edge) return;
      if (edge.durationS < bestDuration) {
        bestDuration = edge.durationS;
        best = candidate;
      }
    });

    const chosenEdge = matrix[currentIndex]?.[best.index];
    if (!chosenEdge) {
      const local = optimizeRouteLocal(driverLocation, deliveries);
      return { ...local, mode: 'local' };
    }

    ordered.push(best.delivery);
    totalDistanceKm += chosenEdge.distanceM / 1000;
    totalDurationSec += chosenEdge.durationS;
    currentIndex = best.index;
    const i = remaining.findIndex((r) => r.index === best.index);
    remaining.splice(i, 1);
  }

  return {
    orderedDeliveries: ordered,
    totalDistanceKm,
    totalDurationSec,
    mode: 'google',
  };
};

export interface OptimizeRouteOptions {
  googleMapsApiKey?: string;
  preferGoogle?: boolean;
  maxStopsForGoogle?: number;
}

export const optimizeRoute = async (
  driverLocation: Coordinates,
  deliveries: Delivery[],
  options: OptimizeRouteOptions = {},
): Promise<OptimizedRouteResult> => {
  const validDeliveries = deliveries.filter(
    (d) => Number.isFinite(d.lat) && Number.isFinite(d.lng),
  );
  const invalidDeliveries = deliveries.filter(
    (d) => !Number.isFinite(d.lat) || !Number.isFinite(d.lng),
  );

  if (invalidDeliveries.length > 0) {
    console.log(
      `[route] Skipping ${invalidDeliveries.length} deliveries with invalid coordinates`,
    );
  }

  const local = optimizeRouteLocal(driverLocation, validDeliveries);
  const googleMapsApiKey = options.googleMapsApiKey?.trim();
  const preferGoogle = options.preferGoogle === true;
  const maxStopsForGoogle = options.maxStopsForGoogle ?? 20;

  if (!preferGoogle || !googleMapsApiKey) {
    return {
      ...local,
      orderedDeliveries: [...local.orderedDeliveries, ...invalidDeliveries],
      mode: 'local',
    };
  }

  if (validDeliveries.length === 0) {
    return {
      ...local,
      orderedDeliveries: invalidDeliveries,
      mode: 'local',
    };
  }

  // Distance Matrix has practical limits; keep it safe and cheap.
  if (validDeliveries.length > maxStopsForGoogle) {
    console.log(
      `[route] Too many stops for Google mode (${validDeliveries.length}); using local fallback`,
    );
    return {
      ...local,
      orderedDeliveries: [...local.orderedDeliveries, ...invalidDeliveries],
      mode: 'local',
    };
  }

  const points: Coordinates[] = [
    driverLocation,
    ...validDeliveries.map((d) => ({ lat: d.lat, lng: d.lng })),
  ];
  const url = buildDistanceMatrixUrl(googleMapsApiKey, points);

  try {
    const res = await fetch(url);
    const json = (await res.json()) as GoogleDistanceMatrixResponse;

    if (!res.ok) {
      throw new Error(
        `GOOGLE_DISTANCE_MATRIX_HTTP_${res.status}:${json.error_message ?? 'request failed'}`,
      );
    }

    if (json.status !== 'OK' || !json.rows) {
      throw new Error(
        `GOOGLE_DISTANCE_MATRIX_${json.status}:${json.error_message ?? 'request denied'}`,
      );
    }

    const matrix = json.rows.map((row) =>
      row.elements.map((el) => {
        if (el.status !== 'OK') {
          throw new Error(`GOOGLE_DISTANCE_MATRIX_ELEMENT_${el.status}`);
        }
        const distanceM = el.distance?.value ?? 0;
        const durationS = el.duration_in_traffic?.value ?? el.duration?.value ?? 0;
        return { distanceM, durationS };
      }),
    );

    const apiResult = optimizeRouteWithDistanceMatrix(
      driverLocation,
      validDeliveries,
      matrix,
    );
    return {
      ...apiResult,
      orderedDeliveries: [...apiResult.orderedDeliveries, ...invalidDeliveries],
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`[route] Google optimization failed; using local fallback: ${msg}`);

    const m =
      /^GOOGLE_DISTANCE_MATRIX_(?:HTTP_\\d+|ELEMENT_)?([A-Z_]+)(?::(.*))?$/.exec(
        msg,
      );
    const googleErrorStatus = m?.[1];
    const googleErrorMessage = m?.[2]?.trim() || undefined;

    return {
      ...local,
      orderedDeliveries: [...local.orderedDeliveries, ...invalidDeliveries],
      mode: 'local',
      googleErrorStatus,
      googleErrorMessage,
    };
  }
};
