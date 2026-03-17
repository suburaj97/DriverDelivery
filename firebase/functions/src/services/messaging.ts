import { messaging } from '../config';

interface NewDeliveryNotificationParams {
  token: string;
  deliveryId: string;
  orderId: string;
}

export const sendNewDeliveryNotification = async ({
  token,
  deliveryId,
  orderId,
}: NewDeliveryNotificationParams): Promise<void> => {
  if (!token) {
    return;
  }

  await messaging.send({
    token,
    notification: {
      title: 'New Delivery Assigned',
      body: `Order ${orderId} assigned`,
    },
    data: {
      screen: 'Deliveries',
      deliveryId,
    },
  });
};
