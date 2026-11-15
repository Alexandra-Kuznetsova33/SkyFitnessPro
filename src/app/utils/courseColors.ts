const COVER_COLORS: Record<string, string> = {
  Йога: '#FFC700',
  Стретчинг: '#2491D2',
  Фитнес: '#F7A012',
  'Степ-аэробика': '#FF7E66',
  Бодифлекс: '#7E468D',
};

const DEFAULT_COLOR = '#BCEC30';

export const getCourseColor = (nameRU: string): string => {
  return COVER_COLORS[nameRU] ?? DEFAULT_COLOR;
};