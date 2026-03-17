import React, { useState } from 'react';
import { StyleSheet, View, type TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTranslation } from 'react-i18next';
import { ErrorBanner } from '@/components/ErrorBanner';
import {
  AuthBrandHeader,
  AuthCard,
  AuthScreen,
  AuthSectionHeader,
  InputField,
  PrimaryButton,
  SecondaryTextButton,
} from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';
import type { AuthStackParamList } from '@/types/Navigation';
import { useTheme } from '@/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  const passwordRef = React.useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const handleLogin = async () => {
    setError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);

    const trimmedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    const nextEmailError = trimmedEmail
      ? isValidEmail
        ? undefined
        : t('errors.invalidEmail')
      : t('common.required');
    const nextPasswordError = password ? undefined : t('common.required');

    if (nextEmailError || nextPasswordError) {
      setEmailError(nextEmailError);
      setPasswordError(nextPasswordError);
      return;
    }

    setLoading(true);
    try {
      await signIn(trimmedEmail, password);
      // Phone verification routing is handled by RootNavigator/Auth flow
    } catch (e) {
      const msg =
        typeof e === 'string'
          ? e
          : e instanceof Error
            ? e.message
            : t('errors.signInFailed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        actions: {
          marginTop: theme.spacing.md,
          gap: theme.spacing.sm,
        },
        secondaryActions: {
          marginTop: theme.spacing.xs,
        },
      }),
    [theme],
  );

  return (
    <AuthScreen>
      <AuthBrandHeader />
      <AuthCard accessibilityLabel={t('login.cardA11y')}>
        <AuthSectionHeader title={t('login.title')} subtitle={t('login.subtitle')} />
        <ErrorBanner message={error} visible={!!error} />

        <InputField
          label={t('login.email')}
          icon="mail"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            if (emailError) setEmailError(undefined);
          }}
          errorText={emailError}
          placeholder={t('login.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
          accessibilityLabel={t('login.email')}
        />
        <InputField
          ref={passwordRef}
          label={t('login.password')}
          icon="lock"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            if (passwordError) setPasswordError(undefined);
          }}
          errorText={passwordError}
          placeholder={t('login.passwordPlaceholder')}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          accessibilityLabel={t('login.password')}
        />

        <View style={styles.actions}>
          <PrimaryButton
            title={t('login.submit')}
            onPress={handleLogin}
            loading={loading}
            accessibilityLabel={t('login.submit')}
          />
          <View style={styles.secondaryActions}>
            <SecondaryTextButton
              prefix={t('login.noAccountPrefix')}
              title={t('login.createAccount')}
              onPress={goToSignUp}
              accessibilityLabel={t('login.createAccount')}
            />
          </View>
        </View>
      </AuthCard>
    </AuthScreen>
  );
};
