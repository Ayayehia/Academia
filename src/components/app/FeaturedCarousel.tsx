import { useTranslation } from 'react-i18next';
import { FlatList, type ListRenderItem, StyleSheet, Text, View } from 'react-native';

import { type Course } from '../../lib/mockCourses';
import { useTheme } from '../../theme';
import { CourseCard } from '../ui/CourseCard';

interface FeaturedCarouselProps {
  courses: Course[];
  onPressCourse: (course: Course) => void;
}

// Fixed card width keeps the horizontal carousel consistent and mobile-friendly.
const CARD_WIDTH = 260;

// Horizontal, swipeable list of featured course cards. Reuses CourseCard,
// mapping each field onto an existing prop (category → badge, instructor →
// subtitle, rating → footer). Renders inside the Home ScrollView.
export function FeaturedCarousel({ courses, onPressCourse }: FeaturedCarouselProps) {
  const theme = useTheme();

  const renderItem: ListRenderItem<Course> = ({ item }) => (
    <View style={{ width: CARD_WIDTH }}>
      <CourseCard
        title={item.title}
        subtitle={item.instructor}
        thumbnail={{ uri: item.thumbnailUri }}
        badge={{ label: item.category }}
        footer={<Rating value={item.rating} />}
        onPress={() => onPressCourse(item)}
      />
    </View>
  );

  return (
    <FlatList
      data={courses}
      keyExtractor={(c) => c.id}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: theme.spacing.md, gap: theme.spacing.md }}
    />
  );
}

function Rating({ value }: { value: number }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <View style={styles.ratingRow}>
      <Text style={{ color: theme.colors.warning, fontSize: theme.typography.sizes.md }}>★</Text>
      <Text
        accessibilityLabel={t('app.home.ratingA11y', { value })}
        style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm }}
      >
        {value.toFixed(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
