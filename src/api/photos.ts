import { apiClient } from './client';

// Dedicated API/service layer. The data SOURCE is dummyjson's /products (a fast
// mock API), but it's mapped onto our stable internal Course model so screens
// and components never depend on the external API's shape. Swap the source here
// without touching any UI.

// Raw dummyjson product (only the fields we use).
type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  thumbnail: string;
};

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

// Stable internal model — unchanged regardless of the API source.
export type ListingCourse = {
  id: string;
  title: string;
  category: string;
  rating: number;
  thumbnailUri: string;
};

export const PHOTOS_PAGE_SIZE = 10;

// dummyjson provides real category + rating, so those props map straight across.
export function toListingCourse(p: Product): ListingCourse {
  return {
    id: String(p.id),
    title: p.title,
    category: p.category,
    rating: p.rating,
    thumbnailUri: p.thumbnail,
  };
}

/** GET /products?limit=<n>&skip=<n> → enriched listing courses (page is 1-based). */
export async function fetchListingCourses(
  page: number,
  limit = PHOTOS_PAGE_SIZE,
): Promise<ListingCourse[]> {
  const { data } = await apiClient.get<ProductsResponse>('/products', {
    params: { limit, skip: (page - 1) * limit },
  });
  return data.products.map(toListingCourse);
}

// --- Course detail ------------------------------------------------------

// Full detail shape. The API has no instructor/avatar/duration, so those stay
// mocked deterministically from the id (stable per course).
export type CourseDetail = ListingCourse & {
  instructor: string;
  instructorAvatarUri: string;
  description: string;
  duration: string;
};

const INSTRUCTORS = ['Sara Khaled', 'Omar Tarek', 'Lina Hassan', 'Youssef Adel', 'Mona Fathy'];

const mockInstructor = (id: number) => INSTRUCTORS[id % INSTRUCTORS.length];
// pravatar serves 70 sample avatars (1–70).
const mockAvatar = (id: number) => `https://i.pravatar.cc/150?img=${(id % 70) + 1}`;
const mockDuration = (id: number) => `${3 + (id % 8)}h ${(id % 6) * 10}m`;

export function toCourseDetail(p: Product, description: string): CourseDetail {
  return {
    ...toListingCourse(p),
    instructor: mockInstructor(p.id),
    instructorAvatarUri: mockAvatar(p.id),
    description,
    duration: mockDuration(p.id),
  };
}

/** GET /products/:id → enriched course detail. `description` is localized UI copy
 *  supplied by the caller. */
export async function fetchCourseDetail(id: string, description: string): Promise<CourseDetail> {
  const { data } = await apiClient.get<Product>(`/products/${id}`);
  return toCourseDetail(data, description);
}
