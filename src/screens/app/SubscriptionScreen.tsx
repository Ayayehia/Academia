import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../../components';
import { type AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Subscription'>;

// Minimum placeholder destination for the subscription banner CTA. Real
// subscription/payment flow is out of scope for Story 2.3.
export default function SubscriptionScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Header title={t('app.subscription.title')} onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.md }}>
          {t('app.subscription.placeholder')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
});
