import coursesData from '../data/courses.json';

// Dedicated data/service layer. The SOURCE is now a local courses.json file,
// but it's served through the same async, paginated functions so the screens,
// hooks, loading/error states, and the internal model are all unchanged. Swap
// this back to a real HTTP API (via apiClient) any time without touching the UI.

// Stable internal model.
export type ListingCourse = {
  id: string;
  title: string;
  category: string;
  rating: number;
  thumbnailUri: string;
};

// Full detail shape (everything in the JSON).
export type CourseDetail = ListingCourse & {
  instructor: string;
  instructorAvatarUri: string;
  description: string;
  duration: string;
};

export const PHOTOS_PAGE_SIZE = 10;

const ALL_COURSES = coursesData as CourseDetail[];

// Small artificial delay so the loading skeletons remain visible (mimics a
// network round-trip).
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Paginated listing (page is 1-based). Returns only the listing-model fields. */
export async function fetchListingCourses(
  page: number,
  limit = PHOTOS_PAGE_SIZE,
): Promise<ListingCourse[]> {
  await delay(500);
  const start = (page - 1) * limit;
  return ALL_COURSES.slice(start, start + limit).map(
    ({ id, title, category, rating, thumbnailUri }) => ({
      id,
      title,
      category,
      rating,
      thumbnailUri,
    }),
  );
}

/** Fetch one course by id. */
export async function fetchCourseDetail(id: string): Promise<CourseDetail> {
  await delay(500);
  const course = ALL_COURSES.find((c) => c.id === id);
  if (!course) {
    throw new Error(`Course ${id} not found`);
  }
  return course;
}
