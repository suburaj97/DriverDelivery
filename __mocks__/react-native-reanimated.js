const ReactNative = require('react-native');

const Animation = {
  duration: () => Animation,
  delay: () => Animation,
  springify: () => Animation,
  damping: () => Animation,
};

const Animated = {
  View: ReactNative.View,
  Text: ReactNative.Text,
  ScrollView: ReactNative.ScrollView,
  Image: ReactNative.Image,
  createAnimatedComponent: (Component) => Component,
};

module.exports = {
  __esModule: true,
  default: Animated,
  ...Animated,
  FadeIn: Animation,
  FadeInDown: Animation,
  useSharedValue: (value) => ({ value }),
  useAnimatedStyle: (fn) => fn(),
  withTiming: (toValue) => toValue,
  runOnJS: (fn) => fn,
  interpolateColor: (_value, _inputRange, outputRange) => outputRange[0],
};
