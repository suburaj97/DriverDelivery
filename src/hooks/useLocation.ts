import { useCallback, useEffect, useRef, useState } from 'react';

import { getCurrentLocation, watchLocationUpdates } from '@/services/locationService';
import type { Coordinates } from '@/utils/locationUtils';

export const useLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const watchStopperRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInitialLocation = async () => {
      const location = await getCurrentLocation();
      if (isMounted) {
        setCurrentLocation(location);
      }
    };

    loadInitialLocation();

    return () => {
      isMounted = false;
      if (watchStopperRef.current) {
        watchStopperRef.current();
        watchStopperRef.current = null;
      }
    };
  }, []);

  const startWatching = useCallback(() => {
    if (watchStopperRef.current) {
      return;
    }

    watchStopperRef.current = watchLocationUpdates((coords) => {
      setCurrentLocation(coords);
    });
  }, []);

  const stopWatching = useCallback(() => {
    if (watchStopperRef.current) {
      watchStopperRef.current();
      watchStopperRef.current = null;
    }
  }, []);

  return {
    currentLocation,
    startWatching,
    stopWatching,
  };
};
