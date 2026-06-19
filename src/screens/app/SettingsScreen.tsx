import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Header } from '../../components';
import { type AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Settings'>;

// Placeholder Settings screen. For Story 1.6 it only hosts logout; the full
// Settings screen comes later.
export default function SettingsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const signOut = useAuthStore((s) => s.signOut);

  // Clearing auth flips isAuthenticated → RootNavigator swaps to the auth
  // stack (→ Login). No manual navigation needed, and the whole app stack is
  // unmounted, so there's no back route to Home.
  const onLogout = () => signOut();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Header title={t('app.settings.title')} onBack={() => navigation.goBack()} />

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
