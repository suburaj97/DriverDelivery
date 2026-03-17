import * as functions from 'firebase-functions';

import { getDeviceTokenForDriver } from '../services/firestore';
import { sendNewDeliveryNotification } from '../services/messaging';

interface DeliveryDocument {
  driverId: string;
  orderId: string;
  [key: string]: unknown;
}

export const onDeliveryCreated = functions.firestore
  .document('deliveries/{deliveryId}')
  .onCreate(async (snapshot, context) => {
    const deliveryId = context.params.deliveryId as string;

    try {
      const data = snapshot.data() as DeliveryDocument | undefined;

      if (!data) {
        functions.logger.warn('onDeliveryCreated: missing snapshot data', {
          deliveryId,
        });
        return;
      }

      const { driverId, orderId } = data;

      if (!driverId || !orderId) {
        functions.logger.warn('onDeliveryCreated: missing driverId/orderId', {
          deliveryId,
          driverId,
          orderId,
        });
        return;
      }

      const token = await getDeviceTokenForDriver(driverId);
      if (!token) {
        functions.logger.info('onDeliveryCreated: no device token for driver', {
          deliveryId,
          driverId,
        });
        return;
      }

      await sendNewDeliveryNotification({
        token,
        deliveryId,
        orderId: String(orderId),
      });
    } catch (err) {
      functions.logger.error('onDeliveryCreated failed', {
        deliveryId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });
