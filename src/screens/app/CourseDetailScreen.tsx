import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../../components';
import { type AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'CourseDetail'>;

// Minimum placeholder so the carousel has a tappable destination. The real
// Course Detail page is built in a later story (2.3).
export default function CourseDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { courseId } = route.params;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Header title={t('app.courseDetail.title')} onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.md }}>
          {t('app.courseDetail.placeholder')}
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes.md }}>
          {courseId}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 },
});
