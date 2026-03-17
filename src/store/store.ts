import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import { rootReducer } from '@/store/rootReducer';
import { firebaseApi } from '@/store/api/firebaseApi';
import { registerDeliveryListener } from '@/store/listeners/deliveryListener';
import { registerNotificationListener } from '@/store/listeners/notificationListener';
import { registerOfflineQueueListener } from '@/store/listeners/offlineQueueListener';

export type RootState = ReturnType<typeof rootReducer>;

const listenerMiddleware = createListenerMiddleware<RootState>();
registerDeliveryListener(listenerMiddleware);
registerNotificationListener(listenerMiddleware);
registerOfflineQueueListener(listenerMiddleware);

export const store = configureStore({
  reducer: rootReducer,
  devTools: typeof __DEV__ !== 'undefined' ? __DEV__ : true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(firebaseApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
