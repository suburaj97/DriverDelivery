import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

import { useTheme } from '@/theme';

type Props = {
  children: React.ReactNode;
};

export const AuthScreen: React.FC<Props> = ({ children }) => {
  const theme = useTheme();
  const headerHeight = useHeaderHeight();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1 },
        safeArea: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        scrollContent: {
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.xxl,
        },
        content: {
          width: '100%',
          maxWidth: 440,
          alignSelf: 'center',
        },
      }),
    [theme],
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
    >
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
        touchSoundDisabled
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>{children}</View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
