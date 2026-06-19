import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { useSignInFlow } from '../../hooks/useSignInFlow';
import { mockSocialSignIn, type SocialProvider } from '../../services/mockSocialAuth';
import { useTheme } from '../../theme';
import { Button } from '../ui/Button';

interface SocialAuthButtonsProps {
  /** Disable while a parent form (e.g. email/password) is submitting. */
  disabled?: boolean;
}

// Reusable "Or continue with" divider + Google/Apple buttons, shared by the
// Login and Register screens. Runs the mock social sign-in and hands the
// resulting session to the shared completeSignIn flow.
export function SocialAuthButtons({ disabled = false }: SocialAuthButtonsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { completeSignIn } = useSignInFlow();
  // Track which provider is mid-request so only its button shows a spinner.
  const [pending, setPending] = useState<SocialProvider | null>(null);

  const handlePress = async (provider: SocialProvider) => {
    if (pending || disabled) return;
    setPending(provider);
    try {
      const session = await mockSocialSignIn(provider);
      await completeSignIn(session);
    } catch {
      Alert.alert(t('auth.social.error'));
    } finally {
      setPending(null);
    }
  };

  const busy = pending !== null || disabled;

  return (
    <View style={{ gap: theme.spacing.md }}>
      <View style={styles.dividerRow}>
        <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.sizes.sm,
          }}
        >
          {t('auth.social.divider')}
        </Text>
        <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
      </View>

      <View style={{ gap: theme.spacing.sm }}>
        <Button
          title={t('auth.social.google')}
          variant="secondary"
          size="lg"
          fullWidth
          leftIcon={<SocialGlyph label="G" color={theme.colors.text} />}
          loading={pending === 'google'}
          disabled={busy && pending !== 'google'}
          onPress={() => handlePress('google')}
        />
        <Button
          title={t('auth.social.apple')}
          variant="secondary"
          size="lg"
          fullWidth
          leftIcon={<SocialGlyph label="" color={theme.colors.text} />}
          loading={pending === 'apple'}
          disabled={busy && pending !== 'apple'}
          onPress={() => handlePress('apple')}
        />
      </View>
    </View>
  );
}

// Simple text glyph stand-in for a provider logo (no icon library installed —
// keeps the mock self-contained).
function SocialGlyph({ label, color }: { label: string; color: string }) {
  return <Text style={[styles.glyph, { color }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
  glyph: { fontSize: 16, fontWeight: '700' },
});
