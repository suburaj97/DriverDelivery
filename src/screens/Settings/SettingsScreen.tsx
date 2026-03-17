import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { ScreenContainer } from '@/components/ScreenContainer';
import { Icon, ListItem, Section } from '@/components/ui';
import { useTheme, useThemeContext, type ThemePreference } from '@/theme';
import type { MainStackParamList } from '@/types/Navigation';
import { useAuth } from '@/hooks/useAuth';

type Props = NativeStackScreenProps<MainStackParamList, 'Settings'>;

type ThemeOption = {
  key: ThemePreference;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

export const SettingsScreen: React.FC<Props> = () => {
  const theme = useTheme();
  const { preference, setPreference } = useThemeContext();
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const options: ThemeOption[] = React.useMemo(
    () => [
      {
        key: 'system',
        title: t('theme.system'),
        subtitle: t('settings.themeSystemSubtitle'),
        icon: <Icon name="smartphone" color={theme.colors.textSecondary} />,
      },
      {
        key: 'light',
        title: t('theme.light'),
        subtitle: t('settings.themeLightSubtitle'),
        icon: <Icon name="sun" color={theme.colors.textSecondary} />,
      },
      {
        key: 'dark',
        title: t('theme.dark'),
        subtitle: t('settings.themeDarkSubtitle'),
        icon: <Icon name="moon" color={theme.colors.textSecondary} />,
      },
    ],
    [t, theme.colors.textSecondary],
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        list: {
          gap: theme.spacing.md,
        },
        check: {
          width: 36,
          height: 36,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.surfaceAlt,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
      }),
    [theme],
  );

  return (
    <ScreenContainer scrollable>
      <Animated.View entering={FadeIn.duration(160)}>
        <Section title={t('settings.themeTitle')} subtitle={t('settings.themeSubtitle')}>
          <View style={styles.list}>
            {options.map((opt, idx) => (
              <Animated.View
                key={opt.key}
                entering={FadeInDown.duration(200).delay(40 * idx)}
              >
                <ListItem
                  title={opt.title}
                  subtitle={opt.subtitle}
                  left={opt.icon}
                  right={
                    preference === opt.key ? (
                      <View style={styles.check}>
                        <Icon name="check" color={theme.colors.brand.primary} />
                      </View>
                    ) : (
                      <View style={styles.check}>
                        <Icon name="circle" color={theme.colors.muted} />
                      </View>
                    )
                  }
                  onPress={() => setPreference(opt.key)}
                  accessibilityLabel={opt.title}
                />
              </Animated.View>
            ))}
          </View>
        </Section>

        <Section
          title={t('settings.accountTitle')}
          subtitle={t('settings.accountSubtitle')}
        >
          <View style={styles.list}>
            <Animated.View entering={FadeInDown.duration(200).delay(60)}>
              <ListItem
                title={t('settings.logoutTitle')}
                subtitle={t('settings.logoutSubtitle')}
                left={
                  <Icon
                    name="log-out"
                    color={theme.colors.semantic.error}
                  />
                }
                right={<Icon name="chevron-right" color={theme.colors.muted} />}
                onPress={() => {
                  Alert.alert(
                    t('settings.logoutConfirmTitle'),
                    t('settings.logoutConfirmMessage'),
                    [
                      { text: t('common.cancel'), style: 'cancel' },
                      {
                        text: t('common.logout'),
                        style: 'destructive',
                        onPress: () => {
                          void signOut();
                        },
                      },
                    ],
                  );
                }}
                accessibilityLabel={t('settings.logoutA11y')}
              />
            </Animated.View>
          </View>
        </Section>
      </Animated.View>
    </ScreenContainer>
  );
};
