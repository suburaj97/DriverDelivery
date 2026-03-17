const noopUnsubscribe = () => {};

module.exports = {
  __esModule: true,
  default: {
    addEventListener: () => noopUnsubscribe,
    fetch: async () => ({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
      details: null,
    }),
    configure: () => {},
  },
  addEventListener: () => noopUnsubscribe,
  fetch: async () => ({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
    details: null,
  }),
  configure: () => {},
};

