import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Driver } from '@/types/Driver';
import type { Delivery, DeliveryStatus } from '@/types/Delivery';
import { getDriver } from '@/services/driverService';
import {
  getDeliveryById,
  getDriverDeliveries,
  updateDeliveryStatus,
} from '@/services/deliveryService';

export const firebaseApi = createApi({
  reducerPath: 'firebaseApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Driver', 'Deliveries', 'Delivery'],
  endpoints: (build) => ({
    getDriver: build.query<Driver | null, { driverId: string }>({
      queryFn: async ({ driverId }) => {
        try {
          const driver = await getDriver(driverId);
          return { data: driver };
        } catch (e) {
          return { error: e as unknown };
        }
      },
      providesTags: (_result, _err, arg) => [
        { type: 'Driver', id: arg.driverId },
      ],
    }),

    getDeliveries: build.query<Delivery[], { driverId: string }>({
      queryFn: async ({ driverId }) => {
        try {
          const deliveries = await getDriverDeliveries(driverId);
          return { data: deliveries };
        } catch (e) {
          return { error: e as unknown };
        }
      },
      providesTags: (_result, _err, arg) => [
        { type: 'Deliveries', id: arg.driverId },
      ],
    }),

    getDelivery: build.query<Delivery | null, { deliveryId: string }>({
      queryFn: async ({ deliveryId }) => {
        try {
          const delivery = await getDeliveryById(deliveryId);
          return { data: delivery };
        } catch (e) {
          return { error: e as unknown };
        }
      },
      providesTags: (_result, _err, arg) => [
        { type: 'Delivery', id: arg.deliveryId },
      ],
    }),

    updateDeliveryStatus: build.mutation<
      void,
      { deliveryId: string; status: DeliveryStatus }
    >({
      queryFn: async ({ deliveryId, status }) => {
        try {
          await updateDeliveryStatus(deliveryId, status);
          return { data: undefined };
        } catch (e) {
          return { error: e as unknown };
        }
      },
      invalidatesTags: (_result, _err, arg) => [
        { type: 'Delivery', id: arg.deliveryId },
      ],
    }),
  }),
});
