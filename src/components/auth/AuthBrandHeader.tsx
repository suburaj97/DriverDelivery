import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme';

type Props = {
  title?: string;
  subtitle?: string;
};

export const AuthBrandHeader: React.FC<Props> = ({ title, subtitle }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          alignItems: 'center',
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.xl,
        },
        mark: {
          width: 56,
          height: 56,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          shadowColor: '#000',
          shadowOpacity: theme.mode === 'dark' ? 0.35 : 0.12,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        },
        brand: {
          color: theme.colors.text,
          fontSize: 22,
          fontWeight: '800',
          letterSpacing: -0.3,
        },
        tagline: {
          color: theme.colors.textSecondary,
          fontSize: 13,
          fontWeight: '500',
          textAlign: 'center',
        },
      }),
    [theme],
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.mark} accessibilityRole="image">
        <Feather name="truck" size={22} color={theme.colors.brand.primary} />
      </View>
      <Text style={styles.brand}>{title ?? t('auth.brandName')}</Text>
      <Text style={styles.tagline}>{subtitle ?? t('auth.tagline')}</Text>
    </View>
  );
};

