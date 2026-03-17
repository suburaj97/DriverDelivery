import {
  createAction,
  type ListenerMiddlewareInstance,
} from '@reduxjs/toolkit';
import {
  getInitialNotification,
  onNotificationOpenedApp,
  onTokenRefresh,
  type FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import { getFirebaseMessaging } from '@/config/firebaseConfig';
import {
  listenForegroundNotifications,
  registerDeviceToken,
  upsertDeviceToken,
  requestNotificationPermission,
} from '@/services/notificationService';
import { getDeliveryById } from '@/services/deliveryService';
import { setDriver } from '@/store/slices/authSlice';
import { addDelivery } from '@/store/slices/deliverySlice';
import type { RootState } from '@/store/store';

export const initNotifications = createAction('notifications/init');

let foregroundUnsubscribe: (() => void) | null = null;
let tokenRefreshUnsubscribe: (() => void) | null = null;
let initialized = false;

const upsertDeliveryFromMessage = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  dispatch: any,
) => {
  if (!remoteMessage) return;
  const data = remoteMessage.data ?? {};
  const deliveryId = (data.deliveryId as string | undefined) ?? '';
  if (!deliveryId) return;

  const delivery = await getDeliveryById(deliveryId);
  if (delivery) {
    dispatch(addDelivery(delivery));
  }
};

export const registerNotificationListener = (
  listenerMiddleware: ListenerMiddlewareInstance<RootState>,
): void => {
  listenerMiddleware.startListening({
    actionCreator: initNotifications,
    effect: async (_action, api) => {
      if (initialized) return;
      initialized = true;

      // Foreground notifications
      foregroundUnsubscribe = listenForegroundNotifications(async (payload) => {
        if (!payload.deliveryId) return;
        const delivery = await getDeliveryById(payload.deliveryId);
        if (delivery) {
          api.dispatch(addDelivery(delivery));
        }
      });

      // Background open + cold start (data update only)
      const messaging = getFirebaseMessaging();
      onNotificationOpenedApp(messaging, (remoteMessage) => {
        upsertDeliveryFromMessage(remoteMessage, api.dispatch).catch(() => {});
      });

      getInitialNotification(messaging)
        .then((remoteMessage) =>
          upsertDeliveryFromMessage(remoteMessage, api.dispatch),
        )
        .catch(() => {});
    },
  });

  // Register/update device token when we have an authenticated driver
  listenerMiddleware.startListening({
    actionCreator: setDriver,
    effect: async (action, _api) => {
      const driver = action.payload;

      if (tokenRefreshUnsubscribe) {
        tokenRefreshUnsubscribe();
        tokenRefreshUnsubscribe = null;
      }

      if (!driver) {
        return;
      }

      const permitted = await requestNotificationPermission();
      if (!permitted) return;

      await registerDeviceToken(driver.id);

      tokenRefreshUnsubscribe = onTokenRefresh(
        getFirebaseMessaging(),
        async (token) => {
          await upsertDeviceToken(driver.id, token);
        },
      );
    },
  });
};

export const stopNotifications = (): void => {
  if (foregroundUnsubscribe) {
    foregroundUnsubscribe();
    foregroundUnsubscribe = null;
  }
  if (tokenRefreshUnsubscribe) {
    tokenRefreshUnsubscribe();
    tokenRefreshUnsubscribe = null;
  }
  initialized = false;
};
