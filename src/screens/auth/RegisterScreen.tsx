import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Input, ScreenContainer } from '../../components';
import { type AuthStackParamList } from '../../navigation/types';
import { type AuthSession, useAuthStore } from '../../store/authStore';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

// --- Validation (pure helpers, co-located) -------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isNameValid = (v: string) => v.trim().length >= 2;
const isEmailValid = (v: string) => EMAIL_RE.test(v.trim());

// Per-rule booleans powering both the live checklist and overall validity.
const passwordRules = (v: string) => ({
  minLength: v.length >= 8,
  upper: /[A-Z]/.test(v),
  lower: /[a-z]/.test(v),
  number: /[0-9]/.test(v),
  special: /[!@#$%^&*]/.test(v),
});
const isPasswordValid = (v: string) => Object.values(passwordRules(v)).every(Boolean);

const RULE_KEYS = ['minLength', 'upper', 'lower', 'number', 'special'] as const;

type FieldKey = 'name' | 'email' | 'password';

// Simulate a register request: short delay, then accept any valid input.
function mockRegister(values: { name: string; email: string }): Promise<AuthSession> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: `mock-token-${values.email.toLowerCase()}`,
        user: { name: values.name.trim(), email: values.email.trim() },
      });
    }, 800);
  });
}

export default function RegisterScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const signIn = useAuthStore((s) => s.signIn);

  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    email: false,
    password: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const setValue = (key: FieldKey) => (text: string) =>
    setValues((prev) => ({ ...prev, [key]: text }));
  const markTouched = (key: FieldKey) => () =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  // Validity is derived every render from current values.
  const nameValid = isNameValid(values.name);
  const emailValid = isEmailValid(values.email);
  const rules = passwordRules(values.password);
  const passwordValid = isPasswordValid(values.password);
  const isFormValid = nameValid && emailValid && passwordValid;

  // Errors only surface after the field has been blurred (touched).
  const nameError = touched.name
    ? values.name.trim().length === 0
      ? t('auth.register.errors.nameRequired')
      : !nameValid
        ? t('auth.register.errors.nameMin')
        : undefined
    : undefined;

  const emailError = touched.email
    ? values.email.trim().length === 0
      ? t('auth.register.errors.emailRequired')
      : !emailValid
        ? t('auth.register.errors.emailInvalid')
        : undefined
    : undefined;

  // Password uses the live checklist instead of a single message; show the
  // generic "required" only when blurred and empty.
  const passwordError =
    touched.password && values.password.length === 0
      ? t('auth.register.errors.passwordRequired')
      : undefined;

  const onSubmit = async () => {
    if (!isFormValid || submitting) return;
    setSubmitting(true);
    const session = await mockRegister(values);
    // Saving the session flips isAuthenticated → RootNavigator swaps to the
    // app stack. No manual navigation to Home needed.
    signIn(session);
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
            {t('auth.register.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {t('auth.register.subtitle')}
          </Text>
        </View>

        <View style={[styles.form, { gap: theme.spacing.md }]}>
          <Input
            label={t('auth.register.nameLabel')}
            placeholder={t('auth.register.namePlaceholder')}
            value={values.name}
            onChangeText={setValue('name')}
            onBlur={markTouched('name')}
            error={nameError}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
          />

          <Input
            label={t('auth.register.emailLabel')}
            placeholder={t('auth.register.emailPlaceholder')}
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

          <View style={{ gap: theme.spacing.sm }}>
            <Input
              label={t('auth.register.passwordLabel')}
              placeholder={t('auth.register.passwordPlaceholder')}
              value={values.password}
              onChangeText={setValue('password')}
              onBlur={markTouched('password')}
              error={passwordError}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
            />

            {/* Live checklist — updates on every keystroke. */}
            <View style={{ gap: theme.spacing.xs }}>
              {RULE_KEYS.map((key) => {
                const met = rules[key];
                return (
                  <View key={key} style={styles.ruleRow}>
                    <Text
                      style={{
                        color: met ? theme.colors.success : theme.colors.textMuted,
                        fontSize: theme.typography.sizes.md,
                      }}
                    >
                      {met ? '✓' : '○'}
                    </Text>
                    <Text
                      style={{
                        color: met ? theme.colors.success : theme.colors.textMuted,
                        fontSize: theme.typography.sizes.sm,
                      }}
                    >
                      {t(`auth.register.rules.${key}`)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <Button
          title={t('auth.register.submit')}
          onPress={onSubmit}
          disabled={!isFormValid}
          loading={submitting}
          fullWidth
          size="lg"
        />

        <View style={[styles.loginRow, { gap: theme.spacing.xs }]}>
          <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.md }}>
            {t('auth.register.haveAccount')}
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Login')}
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
              {t('auth.register.loginLink')}
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
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loginRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
