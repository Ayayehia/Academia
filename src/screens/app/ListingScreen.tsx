import { type BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { type CompositeScreenProps } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, type ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard, EmptyState, ErrorState, Header, Input, SegmentedControl } from '../../components';
import { type ListingCourse } from '../../api/photos';
import { useFavorites } from '../../hooks/useFavorites';
import { usePhotosInfinite } from '../../hooks/usePhotosInfinite';
import { type AppStackParamList, type MainTabsParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

// Listing is a tab screen that also pushes onto the parent stack (CourseDetail).
type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Listing'>,
  NativeStackScreenProps<AppStackParamList>
>;

const SKELETON_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'];

export default function ListingScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    data,
    status,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePhotosInfinite();

  // Flatten paginated results into a single list for the FlatList.
  const courses = useMemo(() => data?.pages.flat() ?? [], [data]);

  // Favorites (local state) + the All/Favorites filter.
  const favorites = useFavorites();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  // Case-insensitive title search over the loaded courses, then the favorites filter.
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const searching = normalizedQuery.length > 0;
  const visible = useMemo(() => {
    let list = searching
      ? courses.filter((c) => c.title.toLowerCase().includes(normalizedQuery))
      : courses;
    if (filter === 'favorites') {
      list = list.filter((c) => favorites.ids.has(c.id));
    }
    return list;
  }, [courses, searching, normalizedQuery, filter, favorites.ids]);

  const paused = searching || filter === 'favorites';

  const onPressCourse = useCallback(
    (id: string) => navigation.navigate('CourseDetail', { courseId: id }),
    [navigation],
  );

  const onEndReached = useCallback(() => {
    // Guard: only fetch when there's a next page and we're not already fetching.
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const keyExtractor = useCallback((c: ListingCourse) => c.id, []);

  const renderItem: ListRenderItem<ListingCourse> = useCallback(
    ({ item }) => (
      <CourseListItem
        course={item}
        onPress={onPressCourse}
        favorite={favorites.ids.has(item.id)}
        onToggleFavorite={favorites.toggle}
      />
    ),
    [onPressCourse, favorites.ids, favorites.toggle],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Header title={t('app.listing.title')} />

      {status === 'pending' ? (
        <SkeletonList />
      ) : status === 'error' ? (
        <ErrorState
          title={t('app.listing.errorTitle')}
          message={t('app.listing.errorMessage')}
          retryLabel={t('app.listing.retry')}
          onRetry={() => refetch()}
        />
      ) : (
        <View style={styles.container}>
          <View style={{ paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md, gap: theme.spacing.sm }}>
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder={t('app.listing.searchPlaceholder')}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              clearButtonMode="while-editing"
              accessibilityLabel={t('app.listing.searchPlaceholder')}
            />
            <SegmentedControl<'all' | 'favorites'>
              value={filter}
              onChange={setFilter}
              options={[
                { label: t('app.listing.tabAll'), value: 'all' },
                {
                  label:
                    favorites.count > 0
                      ? `${t('app.listing.tabFavorites')} (${favorites.count})`
                      : t('app.listing.tabFavorites'),
                  value: 'favorites',
                },
              ]}
            />
          </View>

          <FlatList
            data={visible}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={{
              padding: theme.spacing.md,
              gap: theme.spacing.md,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            // Pagination only on the unfiltered "All" list (search/favorites filter loaded items).
            onEndReached={paused ? undefined : onEndReached}
            onEndReachedThreshold={0.5}
            initialNumToRender={6}
            removeClippedSubviews
            ListEmptyComponent={
              <EmptyState
                title={
                  filter === 'favorites' && favorites.count === 0
                    ? t('app.listing.noFavorites')
                    : t('app.listing.noResults')
                }
              />
            }
            ListFooterComponent={
              !paused && isFetchingNextPage ? (
                <View style={{ paddingTop: theme.spacing.md }}>
                  {/* title is ignored in loading mode but required by the type. */}
                  <CourseCard title="" loading />
                </View>
              ) : null
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

// Memoized row so unrelated list updates (e.g. appending a page) don't re-render
// every existing card. onPress is a stable callback from the parent.
const CourseListItem = memo(function CourseListItem({
  course,
  onPress,
  favorite,
  onToggleFavorite,
}: {
  course: ListingCourse;
  onPress: (id: string) => void;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <CourseCard
      title={course.title}
      thumbnail={{ uri: course.thumbnailUri }}
      badge={{ label: course.category }}
      footer={<Rating value={course.rating} />}
      onPress={() => onPress(course.id)}
      favorite={favorite}
      onToggleFavorite={() => onToggleFavorite(course.id)}
      favoriteAccessibilityLabel={t(favorite ? 'app.listing.unfavorite' : 'app.listing.favorite')}
    />
  );
});

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

// Initial-load skeletons reuse CourseCard's built-in loading state.
function SkeletonList() {
  const theme = useTheme();
  return (
    <View style={{ padding: theme.spacing.md, gap: theme.spacing.md }}>
      {SKELETON_KEYS.map((k) => (
        <CourseCard key={k} title="" loading />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
