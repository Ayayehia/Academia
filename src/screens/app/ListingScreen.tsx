import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../../components';
import { useTheme } from '../../theme';

// Minimum placeholder for the Listing tab. The real listing is a later story.
export default function ListingScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Header title={t('app.listing.title')} />
      <View style={styles.content}>
        <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.md }}>
          {t('app.listing.placeholder')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
});
