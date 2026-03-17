import { Linking, Platform } from 'react-native';

type LatLng = { lat: number; lng: number };

const isValidLatLng = (value: LatLng | undefined): value is LatLng => {
  if (!value) return false;
  return Number.isFinite(value.lat) && Number.isFinite(value.lng);
};

const toLatLngString = (value: LatLng) => `${value.lat},${value.lng}`;

export interface OpenTurnByTurnNavigationParams {
  destination: LatLng;
  origin?: LatLng;
  destinationLabel?: string;
}

export const openTurnByTurnNavigation = async ({
  destination,
  origin,
  destinationLabel,
}: OpenTurnByTurnNavigationParams): Promise<void> => {
  if (!isValidLatLng(destination)) return;

  const destinationStr = toLatLngString(destination);
  const originStr = isValidLatLng(origin) ? toLatLngString(origin) : undefined;
  const labelSuffix = destinationLabel ? ` (${destinationLabel})` : '';

  if (Platform.OS === 'android') {
    const googleNavUrl = `google.navigation:q=${encodeURIComponent(
      destinationStr,
    )}&mode=d`;
    try {
      await Linking.openURL(googleNavUrl);
      return;
    } catch {
      // ignore and fallback
    }

    const geoUrl = `geo:0,0?q=${encodeURIComponent(destinationStr + labelSuffix)}`;
    try {
      await Linking.openURL(geoUrl);
      return;
    } catch {
      // ignore and fallback
    }

    const webUrl = `https://www.google.com/maps/dir/?api=1${
      originStr ? `&origin=${encodeURIComponent(originStr)}` : ''
    }&destination=${encodeURIComponent(destinationStr)}&travelmode=driving&dir_action=navigate`;
    await Linking.openURL(webUrl);
    return;
  }

  const appleMapsUrl = `http://maps.apple.com/?${
    originStr ? `saddr=${encodeURIComponent(originStr)}&` : ''
  }daddr=${encodeURIComponent(destinationStr)}&dirflg=d`;
  try {
    await Linking.openURL(appleMapsUrl);
    return;
  } catch {
    // ignore and fallback
  }

  const webUrl = `https://www.google.com/maps/dir/?api=1${
    originStr ? `&origin=${encodeURIComponent(originStr)}` : ''
  }&destination=${encodeURIComponent(destinationStr)}&travelmode=driving&dir_action=navigate`;
  await Linking.openURL(webUrl);
};

