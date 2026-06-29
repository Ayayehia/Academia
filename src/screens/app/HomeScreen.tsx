import { type BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { type CompositeScreenProps } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeaturedCarousel, HomeHeader, LanguageToggle, SubscriptionBanner } from '../../components';
import { FEATURED_COURSES } from '../../lib/mockCourses';
import { MOCK_IS_SUBSCRIBED } from '../../lib/subscription';
import { type AppStackParamList, type MainTabsParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

// Home is a tab screen that also pushes onto the parent stack (CourseDetail,
// Subscription) — composite props keep both navigations type-safe.
type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Home'>,
  NativeStackScreenProps<AppStackParamList>
>;

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
        right={<LanguageToggle />}
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

        {/* Subscription banner — hidden for already-subscribed users. */}
        {!MOCK_IS_SUBSCRIBED && (
          <View style={{ paddingHorizontal: theme.spacing.md }}>
            <SubscriptionBanner onSubscribe={() => navigation.navigate('Subscription')} />
          </View>
        )}

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
