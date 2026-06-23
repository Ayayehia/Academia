// Mock featured-course data. No API yet (Story 2.2) — a static list the Home
// carousel renders. The shape is the minimum needed by CourseCard.

export type Course = {
  id: string;
  title: string;
  category: string;
  /** 0–5, one decimal. */
  rating: number;
  instructor: string;
  thumbnailUri: string;
};

const thumb = (seed: string) => `https://picsum.photos/seed/${seed}/400/240`;

export const FEATURED_COURSES: Course[] = [
  {
    id: 'rn-essentials',
    title: 'React Native Essentials',
    category: 'Mobile',
    rating: 4.8,
    instructor: 'Sara Khaled',
    thumbnailUri: thumb('rn-essentials'),
  },
  {
    id: 'ts-deep-dive',
    title: 'TypeScript Deep Dive',
    category: 'Programming',
    rating: 4.7,
    instructor: 'Omar Tarek',
    thumbnailUri: thumb('ts-deep-dive'),
  },
  {
    id: 'ui-design-basics',
    title: 'UI Design Basics',
    category: 'Design',
    rating: 4.6,
    instructor: 'Lina Hassan',
    thumbnailUri: thumb('ui-design-basics'),
  },
  {
    id: 'node-apis',
    title: 'Building APIs with Node',
    category: 'Backend',
    rating: 4.5,
    instructor: 'Youssef Adel',
    thumbnailUri: thumb('node-apis'),
  },
  {
    id: 'data-structures',
    title: 'Data Structures in Practice',
    category: 'Computer Science',
    rating: 4.9,
    instructor: 'Mona Fathy',
    thumbnailUri: thumb('data-structures'),
  },
];
