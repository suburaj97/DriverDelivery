import { Platform } from 'react-native';
import {
  AuthorizationStatus,
  getInitialNotification,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  requestPermission,
  type FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { serverTimestamp } from '@react-native-firebase/firestore';

import { firebaseFirestore, getFirebaseMessaging } from '@/config/firebaseConfig';
import type { NotificationPayload } from '@/types/Notification';

const DEVICE_TOKENS_COLLECTION = 'device_tokens';

export const upsertDeviceToken = async (
  driverId: string,
  token: string,
): Promise<void> => {
  await firebaseFirestore.collection(DEVICE_TOKENS_COLLECTION).doc(driverId).set(
    {
      token,
      platform: Platform.OS,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const requestNotificationPermission =
  async (): Promise<boolean> => {
    const authStatus = await requestPermission(getFirebaseMessaging());
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;
    return enabled;
  };

export const registerDeviceToken = async (
  driverId: string,
): Promise<string | null> => {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    return null;
  }

  const token = await getToken(getFirebaseMessaging());
  await upsertDeviceToken(driverId, token);

  return token;
};

export const listenForegroundNotifications = (
  handler: (payload: NotificationPayload) => void,
): (() => void) => {
  const unsubscribe = onMessage(
    getFirebaseMessaging(),
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      if (!remoteMessage.notification) return;

      const { title, body } = remoteMessage.notification;
      const data = (remoteMessage.data ?? {}) as Record<string, string>;

      const payload: NotificationPayload = {
        title: title ?? '',
        body: body ?? '',
        screen: (data.screen as NotificationPayload['screen']) || 'Deliveries',
        deliveryId: data.deliveryId ?? '',
      };

      handler(payload);
    },
  );

  return unsubscribe;
};

export const handleNotificationOpen = (navigation: any): (() => void) => {
  const messaging = getFirebaseMessaging();
  const unsubscribe = onNotificationOpenedApp(
    messaging,
    (remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
      if (!remoteMessage) return;
      const data = (remoteMessage.data ?? {}) as Record<string, string>;
      if (data.screen === 'Deliveries') {
        navigation.navigate('Main', {
          screen: 'Deliveries',
          params: { deliveryId: data.deliveryId },
        });
      }
    },
  );

  getInitialNotification(messaging)
    .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
      if (!remoteMessage) return;
      const data = (remoteMessage.data ?? {}) as Record<string, string>;
      if (data.screen === 'Deliveries') {
        navigation.navigate('Main', {
          screen: 'Deliveries',
          params: { deliveryId: data.deliveryId },
        });
      }
    })
    .catch(() => {
      // ignore errors during cold start notification handling
    });

  return unsubscribe;
};
