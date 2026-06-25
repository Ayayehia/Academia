import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchListingCourses, PHOTOS_PAGE_SIZE } from '../api/photos';

// Infinite, paginated listing query. TanStack Query handles request dedup and
// "don't fetch while already fetching" (via isFetchingNextPage), so the screen
// stays simple. getNextPageParam stops once a short page comes back.
export function usePhotosInfinite() {
  return useInfiniteQuery({
    queryKey: ['listing', 'photos'],
    queryFn: ({ pageParam }) => fetchListingCourses(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PHOTOS_PAGE_SIZE ? allPages.length + 1 : undefined,
  });
}
