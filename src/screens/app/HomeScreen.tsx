import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeaturedCarousel, HomeHeader } from '../../components';
import { FEATURED_COURSES } from '../../lib/mockCourses';
import { type AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

// Filler blocks so the content is tall enough to scroll under the fixed header.
const FILLER = [0, 1, 2, 3];

export default function HomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* Fixed: rendered outside the ScrollView so it stays pinned. */}
      <HomeHeader
        onProfilePress={() => Alert.alert(t('app.home.profilePlaceholder'))}
        onNotificationPress={() => Alert.alert(t('app.home.notificationsPlaceholder'))}
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

      <ScrollView
        contentContainerStyle={{ paddingVertical: theme.spacing.md, gap: theme.spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: theme.spacing.md, gap: theme.spacing.xs }}>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: theme.typography.sizes.xl,
              fontWeight: theme.typography.weights.bold,
            }}
          >
            {t('common.appName')}
          </Text>
          <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.md }}>
            {t('placeholder.home')}
          </Text>
        </View>

        {/* Featured courses section. The carousel is full-bleed (manages its own
            horizontal gutters); only the title gets the screen padding. */}
        <Text
          style={{
            color: theme.colors.text,
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.bold,
            paddingHorizontal: theme.spacing.md,
          }}
        >
          {t('app.home.featuredTitle')}
        </Text>
        <FeaturedCarousel
          courses={FEATURED_COURSES}
          onPressCourse={(course) => navigation.navigate('CourseDetail', { courseId: course.id })}
        />

        {FILLER.map((i) => (
          <View
            key={i}
            style={[
              styles.block,
              {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                marginHorizontal: theme.spacing.md,
              },
            ]}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  block: { height: 120 },
});
