import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button, Input, PasswordChecklist, ScreenContainer } from '../../components';
import { isPasswordValid } from '../../lib/validation';
import { type AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'NewPassword'>;

type FieldKey = 'password' | 'confirm';

// Step 2 of the reset flow: set the new password. A real backend would submit
// { token, newPassword } and invalidate sessions; the mock just delays.
function mockSubmitNewPassword(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

export default function NewPasswordScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { email } = route.params;

  const [values, setValues] = useState({ password: '', confirm: '' });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    password: false,
    confirm: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const setValue = (key: FieldKey) => (text: string) =>
    setValues((prev) => ({ ...prev, [key]: text }));
  const markTouched = (key: FieldKey) => () =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const passwordValid = isPasswordValid(values.password);
  const confirmMatches = values.confirm === values.password;
  const isFormValid = passwordValid && confirmMatches && values.confirm.length > 0;

  const passwordError =
    touched.password && values.password.length === 0
      ? t('auth.newPassword.errors.passwordRequired')
      : undefined;

  const confirmError = touched.confirm
    ? values.confirm.length === 0
      ? t('auth.newPassword.errors.confirmRequired')
      : !confirmMatches
        ? t('auth.newPassword.errors.mismatch')
        : undefined
    : undefined;

  const onSubmit = async () => {
    if (!isFormValid || submitting) return;
    setSubmitting(true);
    await mockSubmitNewPassword();
    setSubmitting(false);
    Alert.alert(t('auth.newPassword.successTitle'), t('auth.newPassword.successMessage'), [
      { text: t('common.ok'), onPress: () => navigation.navigate('Login') },
    ]);
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
            {t('auth.newPassword.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {t('auth.newPassword.subtitle', { email })}
          </Text>
        </View>

        <View style={[styles.form, { gap: theme.spacing.md }]}>
          <View style={{ gap: theme.spacing.sm }}>
            <Input
              label={t('auth.newPassword.passwordLabel')}
              placeholder={t('auth.newPassword.passwordPlaceholder')}
              value={values.password}
              onChangeText={setValue('password')}
              onBlur={markTouched('password')}
              error={passwordError}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
            />
            <PasswordChecklist value={values.password} />
          </View>

          <Input
            label={t('auth.newPassword.confirmLabel')}
            placeholder={t('auth.newPassword.confirmPlaceholder')}
            value={values.confirm}
            onChangeText={setValue('confirm')}
            onBlur={markTouched('confirm')}
            error={confirmError}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            textContentType="newPassword"
          />
        </View>

        <Button
          title={t('auth.newPassword.submit')}
          onPress={onSubmit}
          disabled={!isFormValid}
          loading={submitting}
          fullWidth
          size="lg"
        />
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
});
