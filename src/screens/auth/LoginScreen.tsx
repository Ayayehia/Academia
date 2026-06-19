import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Input, ScreenContainer, SocialAuthButtons } from '../../components';
import { useSignInFlow } from '../../hooks/useSignInFlow';
import { type AuthStackParamList } from '../../navigation/types';
import { type AuthSession } from '../../store/authStore';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

// --- Validation (pure helpers, mirrors RegisterScreen) -------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmailValid = (v: string) => EMAIL_RE.test(v.trim());

type FieldKey = 'email' | 'password';

// Simulate a login request: short delay, then accept any valid credentials.
// Derives a display name from the email local-part for the mock session.
function mockLogin(values: { email: string; password: string }): Promise<AuthSession> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const email = values.email.trim();
      const name = email.split('@')[0] || 'User';
      resolve({ token: `mock-token-${email.toLowerCase()}`, user: { name, email } });
    }, 800);
  });
}

export default function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { completeSignIn } = useSignInFlow();

  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    email: false,
    password: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const setValue = (key: FieldKey) => (text: string) =>
    setValues((prev) => ({ ...prev, [key]: text }));
  const markTouched = (key: FieldKey) => () =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const emailValid = isEmailValid(values.email);
  const passwordValid = values.password.length > 0;
  const isFormValid = emailValid && passwordValid;

  const emailError = touched.email
    ? values.email.trim().length === 0
      ? t('auth.login.errors.emailRequired')
      : !emailValid
        ? t('auth.login.errors.emailInvalid')
        : undefined
    : undefined;

  const passwordError =
    touched.password && values.password.length === 0
      ? t('auth.login.errors.passwordRequired')
      : undefined;

  const onSubmit = async () => {
    if (!isFormValid || submitting) return;
    setSubmitting(true);
    const session = await mockLogin(values);
    // completeSignIn saves the session (→ navigates to Home) and offers
    // biometric enrollment after the first successful auth.
    await completeSignIn(session);
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
            {t('auth.login.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {t('auth.login.subtitle')}
          </Text>
        </View>

        <View style={[styles.form, { gap: theme.spacing.md }]}>
          <Input
            label={t('auth.login.emailLabel')}
            placeholder={t('auth.login.emailPlaceholder')}
            value={values.email}
            onChangeText={setValue('email')}
            onBlur={markTouched('email')}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
          />

          <Input
            label={t('auth.login.passwordLabel')}
            placeholder={t('auth.login.passwordPlaceholder')}
            value={values.password}
            onChangeText={setValue('password')}
            onBlur={markTouched('password')}
            error={passwordError}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
          />
        </View>

        <Button
          title={t('auth.login.submit')}
          onPress={onSubmit}
          disabled={!isFormValid}
          loading={submitting}
          fullWidth
          size="lg"
        />

        <SocialAuthButtons disabled={submitting} />

        <View style={[styles.registerRow, { gap: theme.spacing.xs }]}>
          <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.md }}>
            {t('auth.login.noAccount')}
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Register')}
            accessibilityRole="link"
            hitSlop={8}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontSize: theme.typography.sizes.md,
                fontWeight: theme.typography.weights.medium,
              }}
            >
              {t('auth.login.registerLink')}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', gap: 24 },
  header: { gap: 4 },
  title: { textAlign: 'left' },
  subtitle: { fontSize: 14 },
  form: {},
  registerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
