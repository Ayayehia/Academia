import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../../components';
import { type AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'HomePlaceholder'>;

export default function PlaceholderHomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Header
        title={t('common.appName')}
        right={
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            accessibilityRole="button"
            accessibilityLabel={t('app.home.settings')}
            hitSlop={8}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontSize: theme.typography.sizes.md,
                fontWeight: theme.typography.weights.medium,
              }}
            >
              {t('app.home.settings')}
            </Text>
          </Pressable>
        }
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('common.appName')}</Text>
        <Text style={{ color: theme.colors.textMuted }}>{t('placeholder.home')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '700' },
});
