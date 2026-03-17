import { combineReducers } from '@reduxjs/toolkit';

import auth from '@/store/slices/authSlice';
import delivery from '@/store/slices/deliverySlice';
import offlineQueue from '@/store/slices/offlineQueueSlice';
import { firebaseApi } from '@/store/api/firebaseApi';

export const rootReducer = combineReducers({
  auth,
  delivery,
  offlineQueue,
  [firebaseApi.reducerPath]: firebaseApi.reducer,
});
