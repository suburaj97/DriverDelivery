/* eslint-env jest */
require('react-native-gesture-handler/jestSetup');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {
    GOOGLE_MAPS_API_KEY: 'test',
  },
}));
