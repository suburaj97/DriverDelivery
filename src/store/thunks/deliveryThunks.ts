import NetInfo from '@react-native-community/netinfo';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '@/store/store';
import type { Delivery } from '@/types/Delivery';
import { DeliveryStatus } from '@/types/Delivery';
import {
  getDriverDeliveries,
  updateDeliveryStatus as updateDeliveryStatusService,
} from '@/services/deliveryService';
import {
  clearDeliveryError,
  setDeliveries,
  setDeliveryError,
  setDeliveryLoading,
  updateDeliveryStatusLocal,
} from '@/store/slices/deliverySlice';
import {
  enqueueDeliveryStatusUpdate,
  incrementAttempt,
  removePendingAction,
} from '@/store/slices/offlineQueueSlice';
import i18n from '@/i18n';

export const subscribeToDriverDeliveries = createAsyncThunk<
  string | null,
  void,
  { state: RootState }
>('delivery/subscribeToDriverDeliveries', async (_arg, thunkApi) => {
  return thunkApi.getState().auth.driver?.id ?? null;
});

export const fetchDriverDeliveries = createAsyncThunk<
  Delivery[],
  void,
  { state: RootState; rejectValue: string }
>('delivery/fetchDriverDeliveries', async (_arg, thunkApi) => {
  const { dispatch, getState, rejectWithValue } = thunkApi;
  const driverId = getState().auth.driver?.id ?? null;
  if (!driverId) {
    return [];
  }

  dispatch(clearDeliveryError());
  dispatch(setDeliveryLoading(true));
  try {
    const results = await getDriverDeliveries(driverId);
    dispatch(setDeliveries(results));
    return results;
  } catch {
    dispatch(setDeliveryError(i18n.t('errors.delivery.refreshFailed')));
    return rejectWithValue(i18n.t('errors.delivery.refreshFailed'));
  } finally {
    dispatch(setDeliveryLoading(false));
  }
});

export const markDeliveryDelivered = createAsyncThunk<
  void,
  { deliveryId: string },
  { state: RootState; rejectValue: string }
>('delivery/markDeliveryDelivered', async ({ deliveryId }, thunkApi) => {
  const { dispatch, getState, rejectWithValue } = thunkApi;
  dispatch(clearDeliveryError());

  const deliveries = getState().delivery.deliveries;
  const current = deliveries.find((d) => d.id === deliveryId);
  const previousStatus = current?.status ?? DeliveryStatus.Pending;

  dispatch(
    updateDeliveryStatusLocal({
      id: deliveryId,
      status: DeliveryStatus.Delivered,
    }),
  );

  const netInfo = await NetInfo.fetch();
  const isOnline =
    !!netInfo.isConnected && netInfo.isInternetReachable !== false;

  if (!isOnline) {
    dispatch(
      enqueueDeliveryStatusUpdate({
        deliveryId,
        status: DeliveryStatus.Delivered,
        previousStatus,
      }),
    );
    return;
  }

  try {
    await updateDeliveryStatusService(deliveryId, DeliveryStatus.Delivered);
  } catch {
    dispatch(
      updateDeliveryStatusLocal({
        id: deliveryId,
        status: previousStatus,
      }),
    );
    dispatch(setDeliveryError(i18n.t('errors.delivery.updateStatusFailed')));
    return rejectWithValue(i18n.t('errors.delivery.updateStatusFailed'));
  }
});

export const processOfflineQueue = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('offlineQueue/process', async (_arg, thunkApi) => {
  const { dispatch, getState } = thunkApi;
  const { pendingActions } = getState().offlineQueue;

  if (pendingActions.length === 0) {
    return;
  }

  const netInfo = await NetInfo.fetch();
  const isOnline =
    !!netInfo.isConnected && netInfo.isInternetReachable !== false;
  if (!isOnline) {
    return;
  }

  for (const action of pendingActions) {
    if (action.type !== 'delivery/updateStatus') continue;

    try {
      await updateDeliveryStatusService(
        action.payload.deliveryId,
        action.payload.status,
      );
      dispatch(removePendingAction({ id: action.id }));
    } catch {
      dispatch(incrementAttempt({ id: action.id }));
    }
  }
});
