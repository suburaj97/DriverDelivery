import type { ListenerMiddlewareInstance } from '@reduxjs/toolkit';

import { subscribeToDriverDeliveries } from '@/services/deliveryService';
import { setDriver, logout as logoutAction } from '@/store/slices/authSlice';
import {
  clearDeliveryError,
  setDeliveries,
  setDeliveryError,
  setDeliveryLoading,
} from '@/store/slices/deliverySlice';
import { subscribeToDriverDeliveries as subscribeThunk } from '@/store/thunks/deliveryThunks';
import type { RootState } from '@/store/store';
import i18n from '@/i18n';

let deliveriesUnsubscribe: (() => void) | null = null;
let subscribedDriverId: string | null = null;

const cleanup = (dispatch: any) => {
  if (deliveriesUnsubscribe) {
    deliveriesUnsubscribe();
    deliveriesUnsubscribe = null;
    subscribedDriverId = null;
  }

  dispatch(setDeliveries([]));
  dispatch(setDeliveryLoading(false));
  dispatch(clearDeliveryError());
};

const startSubscription = (driverId: string, dispatch: any) => {
  if (subscribedDriverId === driverId && deliveriesUnsubscribe) {
    return;
  }

  cleanup(dispatch);

  dispatch(clearDeliveryError());
  dispatch(setDeliveryLoading(true));

  let firstSnapshot = true;
  deliveriesUnsubscribe = subscribeToDriverDeliveries(
    driverId,
    (deliveries) => {
      dispatch(setDeliveries(deliveries));
      if (firstSnapshot) {
        firstSnapshot = false;
        dispatch(setDeliveryLoading(false));
      }
    },
    () => {
      dispatch(setDeliveryError(i18n.t('errors.delivery.syncFailed')));
      dispatch(setDeliveryLoading(false));
    },
  );

  subscribedDriverId = driverId;
};

export const registerDeliveryListener = (
  listenerMiddleware: ListenerMiddlewareInstance<RootState>,
): void => {
  listenerMiddleware.startListening({
    actionCreator: setDriver,
    effect: async (action, api) => {
      const driver = action.payload;
      if (!driver) {
        cleanup(api.dispatch);
        return;
      }

      startSubscription(driver.id, api.dispatch);
    },
  });

  listenerMiddleware.startListening({
    actionCreator: subscribeThunk.fulfilled,
    effect: async (action, api) => {
      const driverId = action.payload;
      if (!driverId) {
        cleanup(api.dispatch);
        return;
      }
      startSubscription(driverId, api.dispatch);
    },
  });

  listenerMiddleware.startListening({
    actionCreator: logoutAction,
    effect: async (_action, api) => {
      cleanup(api.dispatch);
    },
  });
};
