import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation, {
  type GeoPosition,
} from 'react-native-geolocation-service';

import type { Coordinates } from '@/utils/locationUtils';

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const authStatus = await Geolocation.requestAuthorization('whenInUse');
    return authStatus === 'granted';
  }

  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return false;
};

export const getCurrentLocation = async (): Promise<Coordinates | null> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    return null;
  }

  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

export const watchLocationUpdates = (
  callback: (coords: Coordinates) => void,
): (() => void) => {
  let cancelled = false;
  let watchId: number | null = null;

  // Avoid native crashes (e.g., Android SecurityException) by ensuring we have
  // permission before starting a watch.
  requestLocationPermission()
    .then((hasPermission) => {
      if (!hasPermission || cancelled) return;

      watchId = Geolocation.watchPosition(
        (position: GeoPosition) => {
          callback({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {},
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
        },
      );
    })
    .catch(() => {});

  return () => {
    cancelled = true;
    if (watchId != null) Geolocation.clearWatch(watchId);
  };
};
