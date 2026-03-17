import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import type { MainStackParamList } from '@/types/Navigation';
import { DeliveriesScreen } from '@/screens/Deliveries/DeliveriesScreen';
import { OptimizedRouteScreen } from '@/screens/Route/OptimizedRouteScreen';
import { SettingsScreen } from '@/screens/Settings/SettingsScreen';
import { useTheme } from '@/theme';
import { Icon, IconButton } from '@/components/ui';

const Stack = createNativeStackNavigator<MainStackParamList>();

type SettingsHeaderRightProps = {
  accessibilityLabel: string;
  iconColor: string;
  onPress: () => void;
};

const SettingsHeaderRight: React.FC<SettingsHeaderRightProps> = ({
  accessibilityLabel,
  iconColor,
  onPress,
}) => (
  <IconButton
    accessibilityLabel={accessibilityLabel}
    onPress={onPress}
    icon={<Icon name="settings" color={iconColor} />}
  />
);

const makeSettingsHeaderRight = (
  props: SettingsHeaderRightProps,
): (() => React.ReactNode) => {
  return function HeaderRight() {
    return <SettingsHeaderRight {...props} />;
  };
};

export const MainNavigator: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const baseScreenOptions = React.useMemo(
    () => ({
      headerStyle: { backgroundColor: theme.colors.surface },
      headerTintColor: theme.colors.text,
      headerTitleAlign: 'center' as const,
      headerTitleStyle: { color: theme.colors.text },
      headerShadowVisible: false,
      contentStyle: { backgroundColor: theme.colors.background },
    }),
    [theme.colors.background, theme.colors.surface, theme.colors.text],
  );

  const screenOptions = React.useCallback(
    ({
      navigation,
    }: {
      navigation: { navigate: (name: keyof MainStackParamList) => void };
    }) => ({
      ...baseScreenOptions,
      headerRight: makeSettingsHeaderRight({
        accessibilityLabel: t('navigation.settings'),
        iconColor: theme.colors.text,
        onPress: () => navigation.navigate('Settings'),
      }),
    }),
    [baseScreenOptions, t, theme.colors.text],
  );

  return (
    <Stack.Navigator
      initialRouteName="Deliveries"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="Deliveries"
        component={DeliveriesScreen}
        options={{ title: t('navigation.myDeliveries') }}
      />
      <Stack.Screen
        name="OptimizedRoute"
        component={OptimizedRouteScreen}
        options={{ title: t('navigation.optimizedRoute') }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('navigation.settings'), headerRight: () => null }}
      />
    </Stack.Navigator>
  );
};
