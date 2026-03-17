module.exports = {
  preset: 'react-native',
  watchman: false,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|@react-native-community' +
      '|@react-navigation' +
      '|react-native-gesture-handler' +
      '|react-native-reanimated' +
      '|react-native-worklets' +
      '|react-native-vector-icons' +
      '|react-redux' +
      '|@reduxjs/toolkit' +
      '|immer' +
      '|@os-team/i18next-react-native-language-detector' +
      ')/)',
  ],
  moduleNameMapper: {
    '^react-native-geolocation-service$':
      '<rootDir>/__mocks__/react-native-geolocation-service.js',
    '^react-native-maps$': '<rootDir>/__mocks__/react-native-maps.js',
    '^@react-native-community/netinfo$':
      '<rootDir>/__mocks__/@react-native-community/netinfo.js',
    '^@react-native-firebase/app$':
      '<rootDir>/__mocks__/@react-native-firebase/app.js',
    '^@react-native-firebase/auth$':
      '<rootDir>/__mocks__/@react-native-firebase/auth.js',
    '^@react-native-firebase/firestore$':
      '<rootDir>/__mocks__/@react-native-firebase/firestore.js',
    '^@react-native-firebase/messaging$':
      '<rootDir>/__mocks__/@react-native-firebase/messaging.js',
    '^react-native-localize$': '<rootDir>/__mocks__/react-native-localize.js',
    '^react-native-safe-area-context$':
      '<rootDir>/__mocks__/react-native-safe-area-context.js',
    '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.js',
    '^react-native-worklets$': '<rootDir>/__mocks__/react-native-worklets.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
