import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/types/Navigation';
import { AuthNavigator } from '@/navigation/AuthNavigator';
import { MainNavigator } from '@/navigation/MainNavigator';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { uid, driver, loading } = useAuth();
  const theme = useTheme();
  const themedStyles = React.useMemo(
    () =>
      StyleSheet.create({
        loadingBg: { backgroundColor: theme.colors.background },
      }),
    [theme.colors.background],
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, themedStyles.loadingBg]}>
        <ActivityIndicator size="large" color={theme.colors.brand.primary} />
      </View>
    );
  }

  const isAuthenticated = !!uid && !!driver;
  const isPhoneVerified = !!driver?.phone && !!driver?.phoneVerifiedAt;
  const authInitialRoute = isAuthenticated ? 'PhoneVerification' : 'Login';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated && isPhoneVerified ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth">
          {() => (
            <AuthNavigator
              key={authInitialRoute}
              initialRouteName={authInitialRoute}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
