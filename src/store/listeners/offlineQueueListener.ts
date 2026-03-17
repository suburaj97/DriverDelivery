import NetInfo from '@react-native-community/netinfo';
import {
  createAction,
  type ListenerMiddlewareInstance,
} from '@reduxjs/toolkit';

import type { RootState } from '@/store/store';
import { processOfflineQueue } from '@/store/thunks/deliveryThunks';

export const initOfflineQueue = createAction('offlineQueue/init');

let unsubscribe: (() => void) | null = null;
let initialized = false;

export const registerOfflineQueueListener = (
  listenerMiddleware: ListenerMiddlewareInstance<RootState>,
): void => {
  listenerMiddleware.startListening({
    actionCreator: initOfflineQueue,
    effect: async (_action, api) => {
      if (initialized) return;
      initialized = true;

      unsubscribe = NetInfo.addEventListener((state) => {
        const isOnline =
          !!state.isConnected && state.isInternetReachable !== false;
        if (isOnline) {
          api.dispatch(processOfflineQueue());
        }
      });

      api.dispatch(processOfflineQueue());
    },
  });
};

export const stopOfflineQueueListener = (): void => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  initialized = false;
};
