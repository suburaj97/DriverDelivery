const Geolocation = {
  requestAuthorization: async () => 'granted',
  getCurrentPosition: (success) => {
    success({ coords: { latitude: 0, longitude: 0 } });
  },
  watchPosition: (success) => {
    success({ coords: { latitude: 0, longitude: 0 } });
    return 1;
  },
  clearWatch: () => {},
  stopObserving: () => {},
};

module.exports = {
  __esModule: true,
  default: Geolocation,
  ...Geolocation,
};

