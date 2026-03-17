import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { DeliveryStatus } from '@/types/Delivery';

export interface OfflineQueueAction {
  id: string;
  type: 'delivery/updateStatus';
  payload: {
    deliveryId: string;
    status: DeliveryStatus;
    previousStatus?: DeliveryStatus;
  };
  createdAt: string;
  attempts: number;
}

export interface OfflineQueueState {
  pendingActions: OfflineQueueAction[];
}

const initialState: OfflineQueueState = {
  pendingActions: [],
};

const offlineQueueSlice = createSlice({
  name: 'offlineQueue',
  initialState,
  reducers: {
    enqueueDeliveryStatusUpdate: (
      state,
      action: PayloadAction<{
        deliveryId: string;
        status: DeliveryStatus;
        previousStatus?: DeliveryStatus;
      }>,
    ) => {
      state.pendingActions.push({
        id: nanoid(),
        type: 'delivery/updateStatus',
        payload: action.payload,
        createdAt: new Date().toISOString(),
        attempts: 0,
      });
    },
    removePendingAction: (state, action: PayloadAction<{ id: string }>) => {
      state.pendingActions = state.pendingActions.filter(
        (a) => a.id !== action.payload.id,
      );
    },
    incrementAttempt: (state, action: PayloadAction<{ id: string }>) => {
      const item = state.pendingActions.find((a) => a.id === action.payload.id);
      if (item) {
        item.attempts += 1;
      }
    },
    clearQueue: (state) => {
      state.pendingActions = [];
    },
  },
});

export const {
  enqueueDeliveryStatusUpdate,
  removePendingAction,
  incrementAttempt,
  clearQueue,
} = offlineQueueSlice.actions;
export default offlineQueueSlice.reducer;
