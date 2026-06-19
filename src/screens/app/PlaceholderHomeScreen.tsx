import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../theme';

export default function PlaceholderHomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const signOut = useAuthStore((s) => s.signOut);
  const setBiometricPromptSeen = useSettingsStore((s) => s.setBiometricPromptSeen);

  // TEMP DEV ONLY — remove when the real Logout story lands. Leaves the app
  // stack so we can view the auth screens, and re-arms the biometric enroll
  // prompt so it can be seen again on the next login.
  const handleDevSignOut = () => {
    setBiometricPromptSeen(false);
    signOut();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('common.appName')}</Text>
        <Text style={{ color: theme.colors.textMuted }}>{t('placeholder.home')}</Text>

        {/* TEMP DEV ONLY — remove when the real Logout story lands. */}
        <View style={{ marginTop: theme.spacing.lg }}>
          <Button title={t('common.devSignOut')} variant="secondary" onPress={handleDevSignOut} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '700' },
});
