import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchDriverDeliveries,
  markDeliveryDelivered,
} from '@/store/thunks/deliveryThunks';

export const useDeliveries = () => {
  const dispatch = useAppDispatch();
  const { deliveries, loading, error } = useAppSelector(
    (state) => state.delivery,
  );

  const refresh = useCallback(async () => {
    await dispatch(fetchDriverDeliveries()).unwrap();
  }, [dispatch]);

  const markDelivered = useCallback(
    async (deliveryId: string) => {
      await dispatch(markDeliveryDelivered({ deliveryId })).unwrap();
    },
    [dispatch],
  );

  return {
    deliveries,
    loading,
    error,
    refresh,
    markDelivered,
  };
};
