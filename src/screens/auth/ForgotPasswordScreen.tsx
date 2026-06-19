import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Input, ScreenContainer } from '../../components';
import { isEmailValid } from '../../lib/validation';
import { type AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

// Step 1 of the reset flow: collect the email. A real backend would email a
// signed reset link/OTP here; the mock just delays and forwards the email.
function mockRequestReset(_email: string): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailValid = isEmailValid(email);

  const emailError = touched
    ? email.trim().length === 0
      ? t('auth.forgot.errors.emailRequired')
      : !emailValid
        ? t('auth.forgot.errors.emailInvalid')
        : undefined
    : undefined;

  const onSubmit = async () => {
    if (!emailValid || submitting) return;
    setSubmitting(true);
    await mockRequestReset(email);
    // Hand the email to step 2 via navigation params.
    navigation.navigate('NewPassword', { email: email.trim() });
    setSubmitting(false);
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizes.xxl,
                fontWeight: theme.typography.weights.bold,
              },
            ]}
          >
            {t('auth.forgot.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {t('auth.forgot.subtitle')}
          </Text>
        </View>

        <Input
          label={t('auth.forgot.emailLabel')}
          placeholder={t('auth.forgot.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          onBlur={() => setTouched(true)}
          error={emailError}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="done"
        />

        <Button
          title={t('auth.forgot.submit')}
          onPress={onSubmit}
          disabled={!emailValid}
          loading={submitting}
          fullWidth
          size="lg"
        />

        <Pressable
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="link"
          hitSlop={8}
          style={styles.backRow}
        >
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: theme.typography.sizes.md,
              fontWeight: theme.typography.weights.medium,
            }}
          >
            {t('auth.forgot.backToLogin')}
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', gap: 24 },
  header: { gap: 4 },
  title: { textAlign: 'left' },
  subtitle: { fontSize: 14 },
  backRow: { alignItems: 'center' },
});
