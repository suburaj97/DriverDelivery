import { useEffect } from 'react';
import type { NavigationProp } from '@react-navigation/native';

import { useAuth } from './useAuth';
import {
  handleNotificationOpen,
  listenForegroundNotifications,
} from '@/services/notificationService';
import type { NotificationPayload } from '@/types/Notification';
import type { RootStackParamList } from '@/types/Navigation';

export const useNotifications = (
  navigation: NavigationProp<RootStackParamList>,
): void => {
  const { driver } = useAuth();

  useEffect(() => {
    if (!driver) {
      return;
    }

    let unsubscribeForeground: (() => void) | undefined;
    let unsubscribeOpen: (() => void) | undefined;

    const setup = async () => {
      unsubscribeForeground = listenForegroundNotifications(
        (payload: NotificationPayload) => {
          if (payload.screen === 'Deliveries') {
            navigation.navigate('Main', {
              screen: 'Deliveries',
              params: { deliveryId: payload.deliveryId },
            } as never);
          }
        },
      );

      unsubscribeOpen = handleNotificationOpen(navigation);
    };

    setup();

    return () => {
      if (unsubscribeForeground) {
        unsubscribeForeground();
      }
      if (unsubscribeOpen) {
        unsubscribeOpen();
      }
    };
  }, [driver, navigation]);
};
