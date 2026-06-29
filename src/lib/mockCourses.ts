// Featured courses for the Home carousel. Sourced from the same courses.json as
// the Listing and Course Detail, so a tapped featured card's id always resolves
// in the detail screen (single source of truth).

import coursesData from '../data/courses.json';

export type Course = {
  id: string;
  title: string;
  category: string;
  /** 0–5, one decimal. */
  rating: number;
  instructor: string;
  thumbnailUri: string;
};

// First few courses, mapped to the carousel's Course shape.
export const FEATURED_COURSES: Course[] = coursesData.slice(0, 5).map((c) => ({
  id: c.id,
  title: c.title,
  category: c.category,
  rating: c.rating,
  instructor: c.instructor,
  thumbnailUri: c.thumbnailUri,
}));
