import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Header } from '../../components';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../theme';

// Placeholder Settings tab. For now it only hosts logout; the full Settings
// screen comes later. As a tab root it has no back button.
export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const signOut = useAuthStore((s) => s.signOut);

  // Clearing auth flips isAuthenticated → RootNavigator swaps to the auth
  // stack (→ Login). No manual navigation needed.
  const onLogout = () => signOut();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Header title={t('app.settings.title')} />

      <View style={[styles.content, { padding: theme.spacing.md }]}>
        <Button title={t('app.settings.logout')} variant="danger" fullWidth onPress={onLogout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'flex-start' },
});
