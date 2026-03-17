const React = require('react');
const { View } = require('react-native');

const initialWindowMetrics = {
  insets: { top: 0, bottom: 0, left: 0, right: 0 },
  frame: { x: 0, y: 0, width: 0, height: 0 },
};

const SafeAreaInsetsContext = React.createContext(null);
const SafeAreaFrameContext = React.createContext(null);

const SafeAreaProvider = ({ children, ...props }) =>
  React.createElement(
    SafeAreaFrameContext.Provider,
    { value: initialWindowMetrics.frame },
    React.createElement(
      SafeAreaInsetsContext.Provider,
      { value: initialWindowMetrics.insets },
      React.createElement(View, props, children),
    ),
  );

const SafeAreaView = ({ children, ...props }) =>
  React.createElement(View, props, children);

const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });

module.exports = {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
  SafeAreaInsetsContext,
  SafeAreaFrameContext,
  initialWindowMetrics,
};
