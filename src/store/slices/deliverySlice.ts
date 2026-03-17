import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

import type { Delivery, DeliveryStatus } from '@/types/Delivery';

export interface DeliveryState {
  deliveries: Delivery[];
  loading: boolean;
  error: string | null;
}

const initialState: DeliveryState = {
  deliveries: [],
  loading: false,
  error: null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setDeliveries: (state, action: PayloadAction<Delivery[]>) => {
      state.deliveries = action.payload;
    },
    addDelivery: (state, action: PayloadAction<Delivery>) => {
      const existingIdx = state.deliveries.findIndex(
        (d) => d.id === action.payload.id,
      );
      if (existingIdx === -1) {
        state.deliveries.unshift(action.payload);
        return;
      }

      state.deliveries[existingIdx] = {
        ...state.deliveries[existingIdx],
        ...action.payload,
      };
    },
    updateDeliveryStatusLocal: (
      state,
      action: PayloadAction<{ id: string; status: DeliveryStatus }>,
    ) => {
      const { id, status } = action.payload;
      const idx = state.deliveries.findIndex((d) => d.id === id);
      if (idx !== -1) {
        state.deliveries[idx] = { ...state.deliveries[idx], status };
      }
    },
    setDeliveryLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDeliveryError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearDeliveryError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setDeliveries,
  addDelivery,
  updateDeliveryStatusLocal,
  setDeliveryLoading,
  setDeliveryError,
  clearDeliveryError,
} = deliverySlice.actions;
export default deliverySlice.reducer;

export const selectDeliveriesState = (state: { delivery: DeliveryState }) =>
  state.delivery;
export const selectDriverDeliveries = createSelector(
  selectDeliveriesState,
  (delivery) => delivery.deliveries,
);
export const selectPendingDeliveries = createSelector(
  selectDriverDeliveries,
  (deliveries) => deliveries.filter((d) => d.status !== 'delivered'),
);
export const selectDeliveredDeliveries = createSelector(
  selectDriverDeliveries,
  (deliveries) => deliveries.filter((d) => d.status === 'delivered'),
);
