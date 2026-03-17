import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import type { AuthStackParamList } from '@/types/Navigation';
import { LoginScreen } from '@/screens/Auth/LoginScreen';
import { SignUpScreen } from '@/screens/Auth/SignUpScreen';
import { PhoneVerificationScreen } from '@/screens/Auth/PhoneVerificationScreen';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/theme';

const Stack = createNativeStackNavigator<AuthStackParamList>();

type AuthNavigatorProps = {
  initialRouteName?: keyof AuthStackParamList;
};

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({
  initialRouteName = 'Login',
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const headerStyles = React.useMemo(
    () =>
      StyleSheet.create({
        headerLeft: {
          padding: theme.spacing.sm,
          marginLeft: -theme.spacing.xs,
        },
        headerLeftPressed: {
          opacity: 0.6,
        },
      }),
    [theme],
  );

  const screenOptions = React.useMemo(
    () => ({
      headerStyle: { backgroundColor: theme.colors.surface },
      headerTintColor: theme.colors.text,
      headerTitleAlign: 'center' as const,
      headerTitleStyle: { color: theme.colors.text },
      headerShadowVisible: false,
      contentStyle: { backgroundColor: theme.colors.background },
    }),
    [theme],
  );

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={screenOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false, title: t('navigation.driverLogin') }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: t('navigation.signUp') }}
      />
      <Stack.Screen
        name="PhoneVerification"
        component={PhoneVerificationScreen}
        options={({ navigation }) => ({
          title: t('navigation.verifyPhone'),
          headerLeft: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
              hitSlop={10}
              onPress={async () => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                  return;
                }
                await signOut();
              }}
              style={({ pressed }) => [
                headerStyles.headerLeft,
                pressed && headerStyles.headerLeftPressed,
              ]}
            >
              <Icon name="arrow-left" size={22} color={theme.colors.text} />
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
};
