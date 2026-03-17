import React, { useState } from 'react';
import { StyleSheet, View, type TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTranslation } from 'react-i18next';
import { ErrorBanner } from '@/components/ErrorBanner';
import type { AuthStackParamList } from '@/types/Navigation';
import { requestOtp, verifyOtp } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { updateDriverPhone } from '@/services/driverService';
import { firebaseAuth } from '@/config/firebaseConfig';
import { useAppDispatch } from '@/store/hooks';
import { loadDriverProfile } from '@/store/thunks/authThunks';
import {
  AuthBrandHeader,
  AuthCard,
  AuthScreen,
  AuthSectionHeader,
  InputField,
  PrimaryButton,
  SecondaryTextButton,
} from '@/components/auth';
import { useTheme } from '@/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneVerification'>;

export const PhoneVerificationScreen: React.FC<Props> = () => {
  const { driver, uid, email } = useAuth();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { t } = useTranslation();
  const phoneRef = React.useRef<TextInput>(null);
  const codeRef = React.useRef<TextInput>(null);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [otpSent, setOtpSent] = useState(false);
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [codeError, setCodeError] = useState<string | undefined>();

  React.useEffect(() => {
    if (otpSent) {
      codeRef.current?.focus();
    }
  }, [otpSent]);

  const handleSendOtp = async () => {
    setError(undefined);
    setPhoneError(undefined);
    setCodeError(undefined);

    // Phone verification requires an authenticated user because we attach
    // the verified phone number to the signed-in Firebase user.
    if (!firebaseAuth.currentUser || !uid) {
      setError(t('errors.auth.signInRequiredForOtp'));
      return;
    }

    if (!phone) {
      setPhoneError(t('common.required'));
      return;
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone.startsWith('+')) {
      setPhoneError(t('errors.invalidPhone'));
      return;
    }

    const digits = trimmedPhone.replace(/[^\d]/g, '');
    if (digits.length < 8) {
      setPhoneError(t('errors.invalidPhone'));
      return;
    }

    setLoading(true);
    try {
      const result = await requestOtp(trimmedPhone);
      setVerificationId(result.verificationId);
      setOtpSent(true);
      if (result.autoVerifiedCode) {
        setCode(result.autoVerifiedCode);
      }
    } catch (err) {
      const msg =
        err instanceof Error && err.message ? err.message : t('errors.sendOtpFailed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError(undefined);
    setCodeError(undefined);

    if (!firebaseAuth.currentUser || !uid) {
      setError(t('errors.auth.signInRequiredForOtp'));
      return;
    }

    if (!code) {
      setCodeError(t('common.required'));
      return;
    }

    setLoading(true);
    try {
      const ok = await verifyOtp(verificationId, code);
      if (!ok) {
        setCodeError(t('errors.invalidVerificationCode'));
        return;
      }

      if (driver) {
        const verifiedPhone = firebaseAuth.currentUser?.phoneNumber ?? phone;
        await updateDriverPhone(driver.id, verifiedPhone);
      }

      if (uid) {
        await dispatch(loadDriverProfile({ uid, email })).unwrap();
      }
    } catch {
      setError(t('errors.verificationFailed'));
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
        blockGap: {
          marginTop: theme.spacing.lg,
        },
      }),
    [theme],
  );

  return (
    <AuthScreen>
      <AuthBrandHeader />
      <AuthCard accessibilityLabel={t('phoneVerification.cardA11y')}>
        <AuthSectionHeader
          title={t('phoneVerification.title')}
          subtitle={t('phoneVerification.subtitle')}
        />
        <ErrorBanner message={error} visible={!!error} />

        <InputField
          ref={phoneRef}
          label={t('phoneVerification.phoneNumber')}
          icon="phone"
          value={phone}
          onChangeText={(v) => {
            setPhone(v);
            if (phoneError) setPhoneError(undefined);
          }}
          errorText={phoneError}
          placeholder={t('phoneVerification.phonePlaceholder')}
          keyboardType="phone-pad"
          returnKeyType={otpSent ? 'next' : 'done'}
          onSubmitEditing={handleSendOtp}
          accessibilityLabel={t('phoneVerification.phoneNumber')}
        />

        {!otpSent ? (
          <View style={styles.actions}>
            <PrimaryButton
              title={t('phoneVerification.sendOtp')}
              onPress={handleSendOtp}
              loading={loading}
              accessibilityLabel={t('phoneVerification.sendOtp')}
            />
          </View>
        ) : (
          <View style={styles.blockGap}>
            <InputField
              ref={codeRef}
              label={t('phoneVerification.verificationCode')}
              icon="key"
              value={code}
              onChangeText={(v) => {
                setCode(v);
                if (codeError) setCodeError(undefined);
              }}
              errorText={codeError}
              placeholder={t('phoneVerification.codePlaceholder')}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={handleVerify}
              accessibilityLabel={t('phoneVerification.verificationCode')}
            />

            <View style={styles.actions}>
              <PrimaryButton
                title={t('phoneVerification.verify')}
                onPress={handleVerify}
                loading={loading}
                accessibilityLabel={t('phoneVerification.verifyA11y')}
              />
              <SecondaryTextButton
                title={t('phoneVerification.resendOtp')}
                onPress={handleSendOtp}
                accessibilityLabel={t('phoneVerification.resendOtp')}
              />
            </View>
          </View>
        )}
      </AuthCard>
    </AuthScreen>
  );
};
