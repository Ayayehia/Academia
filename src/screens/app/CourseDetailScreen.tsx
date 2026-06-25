import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, ErrorState, Header, SkeletonLoader } from '../../components';
import { type CourseDetail } from '../../api/photos';
import { useCourseDetail } from '../../hooks/useCourseDetail';
import { type AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'CourseDetail'>;

export default function CourseDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { courseId } = route.params;

  const { data, status, refetch } = useCourseDetail(courseId, t('app.courseDetail.description'));

  const onEnroll = () => Alert.alert(t('app.courseDetail.enrollAlert'));

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Header title={t('app.courseDetail.title')} onBack={() => navigation.goBack()} />

      {status === 'pending' ? (
        <DetailSkeleton />
      ) : status === 'error' ? (
        <ErrorState
          title={t('app.courseDetail.errorTitle')}
          message={t('app.courseDetail.errorMessage')}
          retryLabel={t('app.courseDetail.retry')}
          onRetry={() => refetch()}
        />
      ) : (
        <DetailContent course={data} onEnroll={onEnroll} />
      )}
    </SafeAreaView>
  );
}

function DetailContent({ course, onEnroll }: { course: CourseDetail; onEnroll: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{ padding: theme.spacing.md, gap: theme.spacing.md }}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: course.thumbnailUri }}
        style={[styles.thumbnail, { borderRadius: theme.radius.lg }]}
        resizeMode="cover"
      />

      <View style={{ gap: theme.spacing.sm }}>
        <View style={styles.metaRow}>
          <Badge label={course.category} />
          <View style={styles.ratingRow}>
            <Text style={{ color: theme.colors.warning, fontSize: theme.typography.sizes.md }}>
              ★
            </Text>
            <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm }}>
              {course.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: theme.colors.text,
            fontSize: theme.typography.sizes.xxl,
            fontWeight: theme.typography.weights.bold,
          }}
        >
          {course.title}
        </Text>
      </View>

      {/* Instructor */}
      <View style={styles.instructorRow}>
        <Image
          source={{ uri: course.instructorAvatarUri }}
          style={[styles.avatar, { borderRadius: theme.radius.full }]}
        />
        <View>
          <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm }}>
            {t('app.courseDetail.instructorLabel')}
          </Text>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: theme.typography.sizes.md,
              fontWeight: theme.typography.weights.medium,
            }}
          >
            {course.instructor}
          </Text>
        </View>
      </View>

      {/* Duration */}
      <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.md }}>
        {t('app.courseDetail.durationLabel')}: {course.duration}
      </Text>

      {/* Description */}
      <Text
        style={{
          color: theme.colors.text,
          fontSize: theme.typography.sizes.md,
          lineHeight: 22,
        }}
      >
        {course.description}
      </Text>

      <Button title={t('app.courseDetail.enroll')} onPress={onEnroll} fullWidth size="lg" />
    </ScrollView>
  );
}

function DetailSkeleton() {
  const theme = useTheme();
  return (
    <View style={{ padding: theme.spacing.md, gap: theme.spacing.md }}>
      <SkeletonLoader height={200} radius={theme.radius.lg} />
      <SkeletonLoader width="40%" height={20} />
      <SkeletonLoader width="80%" height={26} />
      <View style={styles.instructorRow}>
        <SkeletonLoader width={44} height={44} radius={theme.radius.full} />
        <SkeletonLoader width="50%" height={16} />
      </View>
      <SkeletonLoader width="100%" height={14} />
      <SkeletonLoader width="95%" height={14} />
      <SkeletonLoader width="90%" height={14} />
      <SkeletonLoader height={52} radius={theme.radius.md} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  thumbnail: { width: '100%', height: 220 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  instructorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44 },
});
