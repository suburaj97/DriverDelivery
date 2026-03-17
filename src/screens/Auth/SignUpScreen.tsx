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

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  const passwordRef = React.useRef<TextInput>(null);
  const confirmPasswordRef = React.useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >();

  const handleSignUp = async () => {
    setError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmPasswordError(undefined);

    const trimmedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    const nextEmailError = trimmedEmail
      ? isValidEmail
        ? undefined
        : t('errors.invalidEmail')
      : t('common.required');
    const nextPasswordError = password ? undefined : t('common.required');
    const nextConfirmPasswordError = confirmPassword
      ? undefined
      : t('common.required');

    if (nextEmailError || nextPasswordError || nextConfirmPasswordError) {
      setEmailError(nextEmailError);
      setPasswordError(nextPasswordError);
      setConfirmPasswordError(nextConfirmPasswordError);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(t('errors.signUp.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    try {
      await signUp(trimmedEmail, password);
      navigation.goBack();
    } catch (e) {
      const msg =
        typeof e === 'string'
          ? e
          : e instanceof Error
            ? e.message
            : t('errors.signUpFailed');
      setError(msg);
    } finally {
      setLoading(false);
    }
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
      <AuthCard accessibilityLabel={t('signUp.cardA11y')}>
        <AuthSectionHeader title={t('signUp.title')} subtitle={t('signUp.subtitle')} />
        <ErrorBanner message={error} visible={!!error} />

        <InputField
          label={t('signUp.email')}
          icon="mail"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            if (emailError) setEmailError(undefined);
          }}
          errorText={emailError}
          placeholder={t('signUp.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          accessibilityLabel={t('signUp.email')}
        />
        <InputField
          ref={passwordRef}
          label={t('signUp.password')}
          icon="lock"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            if (passwordError) setPasswordError(undefined);
          }}
          errorText={passwordError}
          placeholder={t('signUp.passwordPlaceholder')}
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          accessibilityLabel={t('signUp.password')}
        />
        <InputField
          ref={confirmPasswordRef}
          label={t('signUp.confirmPassword')}
          icon="lock"
          value={confirmPassword}
          onChangeText={(v) => {
            setConfirmPassword(v);
            if (confirmPasswordError) setConfirmPasswordError(undefined);
          }}
          errorText={confirmPasswordError}
          placeholder={t('signUp.confirmPasswordPlaceholder')}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
          accessibilityLabel={t('signUp.confirmPassword')}
        />

        <View style={styles.actions}>
          <PrimaryButton
            title={t('signUp.submit')}
            onPress={handleSignUp}
            loading={loading}
            accessibilityLabel={t('signUp.submit')}
          />
          <View style={styles.secondaryActions}>
            <SecondaryTextButton
              prefix={t('signUp.haveAccountPrefix')}
              title={t('common.signIn')}
              onPress={() => navigation.goBack()}
              accessibilityLabel={t('signUp.backToLogin')}
            />
          </View>
        </View>
      </AuthCard>
    </AuthScreen>
  );
};
