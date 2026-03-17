import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';
import { Loader } from './ui/Loader';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  loading?: boolean;
  keyboardAware?: boolean;
  keyboardVerticalOffset?: number;
  dismissKeyboardOnPress?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  loading = false,
  keyboardAware = false,
  keyboardVerticalOffset = 0,
  dismissKeyboardOnPress = true,
  style,
}) => {
  const theme = useTheme();
  const themedStyles = React.useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1 },
        safeArea: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        scrollContent: {
          flexGrow: 1,
        },
        content: {
          flex: 1,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.lg,
        },
        loadingOverlay: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [theme],
  );

  const content = (
    <View style={[themedStyles.content, style]}>
      {loading ? (
        <View style={themedStyles.loadingOverlay}>
          <Loader />
        </View>
      ) : (
        children
      )}
    </View>
  );

  const main = scrollable ? (
    <ScrollView
      contentContainerStyle={themedStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  const wrapped = keyboardAware ? (
    <KeyboardAvoidingView
      style={themedStyles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <TouchableWithoutFeedback
        onPress={dismissKeyboardOnPress ? Keyboard.dismiss : undefined}
        accessible={false}
      >
        <View style={themedStyles.flex}>{main}</View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  ) : (
    main
  );

  return (
    <SafeAreaView style={themedStyles.safeArea} edges={['top', 'bottom']}>
      {wrapped}
    </SafeAreaView>
  );
};
