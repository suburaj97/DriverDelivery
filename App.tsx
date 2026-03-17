import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import '@/i18n';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '@/navigation/RootNavigator';

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App ErrorBoundary:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{this.state.error.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
import { useNotifications } from '@/hooks/useNotifications';
import type { RootStackParamList } from '@/types/Navigation';
import { store } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { startAuthListener } from '@/store/thunks/authThunks';
import { initNotifications } from '@/store/listeners/notificationListener';
import { initOfflineQueue } from '@/store/listeners/offlineQueueListener';
import { ThemeProvider, useThemeContext } from '@/theme';

const StoreInitializer: React.FC = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(startAuthListener());
    dispatch(initNotifications());
    dispatch(initOfflineQueue());
  }, [dispatch]);

  return null;
};

const NotificationsInitializer: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  useNotifications(navigation);
  return null;
};

const AppShell: React.FC = () => {
  const { theme } = useThemeContext();

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider style={styles.flex}>
        <NavigationContainer theme={theme.navigation}>
          <StoreInitializer />
          <RootNavigator />
          <NotificationsInitializer />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const App: React.FC = () => {
  return (
    <AppErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </Provider>
    </AppErrorBoundary>
  );
};

export default App;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0B1220',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
// import React from 'react';
// import { Text, View } from 'react-native';

// const App = () => {
//   return (
//     <View style={{ flex: 1, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ color: 'white', fontSize: 24 }}>ROOT TEST</Text>
//     </View>
//   );
// };

// export default App;
