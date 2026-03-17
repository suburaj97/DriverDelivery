module.exports = {
  getLocales: () => [{ languageTag: 'en-US', languageCode: 'en', isRTL: false }],
  getNumberFormatSettings: () => ({ decimalSeparator: '.', groupingSeparator: ',' }),
  getCalendar: () => 'gregorian',
  getCountry: () => 'US',
  getCurrencies: () => ['USD'],
  getTemperatureUnit: () => 'celsius',
  getTimeZone: () => 'UTC',
  uses24HourClock: () => false,
  usesMetricSystem: () => true,
  addEventListener: () => ({ remove: () => {} }),
  removeEventListener: () => {},
};

