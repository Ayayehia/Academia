import { useQuery } from '@tanstack/react-query';

import { fetchCourseDetail } from '../api/photos';

// Fetches a single course by id (GET /photos/:id). `description` is localized
// UI copy injected into the result (the API has no description field).
export function useCourseDetail(id: string, description: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourseDetail(id, description),
  });
}
