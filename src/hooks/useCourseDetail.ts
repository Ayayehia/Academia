import { useQuery } from '@tanstack/react-query';

import { fetchCourseDetail } from '../api/photos';

// Fetches a single course by id from the local data service.
export function useCourseDetail(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourseDetail(id),
  });
}
