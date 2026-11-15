const COURSE_IMAGES: Record<string, string> = {
  Йога: '/courses/yoga-2.png',
  Стретчинг: '/courses/stretching-2.png',
  Фитнес: '/courses/fitness-2.png',
  'Степ-аэробика': '/courses/step-2.png',
  Бодифлекс: '/courses/bodyflex-2.png',
};

export const getCourseImage = (nameRU: string): string | null => {
  return COURSE_IMAGES[nameRU] ?? null;
};