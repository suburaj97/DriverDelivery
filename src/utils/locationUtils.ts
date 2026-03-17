export interface Coordinates {
  lat: number;
  lng: number;
}

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/**
 * Calculates the great-circle distance between two coordinates in kilometers
 * using the Haversine formula.
 */
export const haversineDistanceKm = (
  from: Coordinates,
  to: Coordinates,
): number => {
  const R = 6371; // Earth radius in kilometers

  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);

  const fromLatRad = toRadians(from.lat);
  const toLatRad = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) *
      Math.sin(dLng / 2) *
      Math.cos(fromLatRad) *
      Math.cos(toLatRad);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

