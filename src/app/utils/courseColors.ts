const COVER_COLORS: Record<string, string> = {
  Йога: '#FFC700',
  Стретчинг: '#5BC5F0',
  Фитнес: '#F7A030',
  'Степ-аэробика': '#F25C5C',
  Бодифлекс: '#9D5CC9',
};

const DEFAULT_COLOR = '#BCEC30';

export const getCourseColor = (nameRU: string): string => {
  return COVER_COLORS[nameRU] ?? DEFAULT_COLOR;
};