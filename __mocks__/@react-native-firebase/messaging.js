const noopUnsubscribe = () => {};

module.exports = {
  AuthorizationStatus: {
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  },
  getMessaging: () => ({}),
  requestPermission: async () => 1,
  getToken: async () => 'test-token',
  onMessage: () => noopUnsubscribe,
  onNotificationOpenedApp: () => noopUnsubscribe,
  onTokenRefresh: () => noopUnsubscribe,
  getInitialNotification: async () => null,
};

