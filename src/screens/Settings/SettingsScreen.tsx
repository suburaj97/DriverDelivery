import React from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ScreenContainer } from '@/components/ScreenContainer';
import { Icon, IconButton, ListItem, Section } from '@/components/ui';
import { useTheme, useThemeContext, type ThemePreference } from '@/theme';
import type { MainStackParamList } from '@/types/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { firebaseAuth } from '@/config/firebaseConfig';

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
  const { signOut, email, driver } = useAuth();
  const [isThemePickerOpen, setIsThemePickerOpen] = React.useState(false);

  const profileName = driver?.name ?? firebaseAuth.currentUser?.displayName ?? '';
  const profileEmail = email ?? '';
  const profilePhone = driver?.phone ?? firebaseAuth.currentUser?.phoneNumber ?? '';
  const notSet = t('settings.profileNotSet');

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

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.key === preference) ?? options[0],
    [options, preference],
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
        modalBackdrop: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
          zIndex: 1000,
        },
        modalSheet: {
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: theme.radius.xl,
          borderTopRightRadius: theme.radius.xl,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
          ...theme.shadows.lg,
          zIndex: 1001,
          elevation: 12,
        },
        modalHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.md,
        },
        modalTitle: {
          ...theme.typography.heading2,
          color: theme.colors.text,
          flex: 1,
        },
        modalClose: {
          marginLeft: theme.spacing.md,
        },
      }),
    [theme],
  );

  return (
    <ScreenContainer scrollable>
      <Animated.View entering={FadeIn.duration(160)}>
        <Section
          title={t('settings.profileTitle')}
          subtitle={t('settings.profileSubtitle')}
        >
          <View style={styles.list}>
            <Animated.View entering={FadeInDown.duration(200).delay(40)}>
              <ListItem
                title={t('settings.profileName')}
                subtitle={profileName || notSet}
                left={<Icon name="user" color={theme.colors.textSecondary} />}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.duration(200).delay(80)}>
              <ListItem
                title={t('settings.profileEmail')}
                subtitle={profileEmail || notSet}
                left={<Icon name="mail" color={theme.colors.textSecondary} />}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.duration(200).delay(120)}>
              <ListItem
                title={t('settings.profilePhone')}
                subtitle={profilePhone || notSet}
                left={<Icon name="phone" color={theme.colors.textSecondary} />}
              />
            </Animated.View>
          </View>
        </Section>

        <Section title={t('settings.themeTitle')} subtitle={t('settings.themeSubtitle')}>
          <View style={styles.list}>
            <Animated.View entering={FadeInDown.duration(200).delay(40)}>
              <ListItem
                title={t('settings.themePickerTitle')}
                subtitle={selectedOption.title}
                left={selectedOption.icon}
                right={<Icon name="chevron-right" color={theme.colors.muted} />}
                onPress={() => setIsThemePickerOpen(true)}
                accessibilityLabel={t('settings.themeTitle')}
              />
            </Animated.View>
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

      <Modal
        visible={isThemePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsThemePickerOpen(false)}
      >
        {/* Modal renders in its own root; RNGH components inside need a GestureHandlerRootView */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setIsThemePickerOpen(false)}
          >
            <Pressable style={styles.modalSheet} onPress={() => {}}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('settings.themeTitle')}</Text>
                <IconButton
                  style={styles.modalClose}
                  onPress={() => setIsThemePickerOpen(false)}
                  accessibilityLabel={t('common.cancel')}
                  icon={<Icon name="x" color={theme.colors.text} />}
                />
              </View>

              <View style={styles.list}>
                {options.map((opt) => (
                  <ListItem
                    key={opt.key}
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
                    onPress={() => {
                      setPreference(opt.key);
                      setIsThemePickerOpen(false);
                    }}
                    accessibilityLabel={opt.title}
                  />
                ))}
              </View>
            </Pressable>
          </Pressable>
        </GestureHandlerRootView>
      </Modal>
    </ScreenContainer>
  );
};
