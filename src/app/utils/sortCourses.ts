import type { Course } from '../sharedTypes/types';

const COURSE_ORDER = ['Йога', 'Стретчинг', 'Фитнес', 'Степ-аэробика', 'Бодифлекс'];

export const sortCourses = (courses: Course[]): Course[] => {
  return [...courses].sort((a, b) => {
    const indexA = COURSE_ORDER.indexOf(a.nameRU);
    const indexB = COURSE_ORDER.indexOf(b.nameRU);

    if (indexA === -1 && indexB === -1) {
      return 0;
    }
    if (indexA === -1) {
      return 1;
    }
    if (indexB === -1) {
      return -1;
    }
    return indexA - indexB;
  });
};