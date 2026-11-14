import type { Course } from '../sharedTypes/types';
import { sortCourses } from './sortCourses';

const createCourse = (nameRU: string): Course => ({
  _id: `id-${nameRU}`,
  nameRU,
  nameEN: 'name',
  description: 'description',
  directions: [],
  fitting: [],
  workouts: [],
  difficulty: 'начальный',
  durationInDays: 20,
  dailyDurationInMinutes: { from: 20, to: 40 },
});

describe('sortCourses', () => {
  it('расставляет курсы в порядке дизайна', () => {
    const input = [
      createCourse('Степ-аэробика'),
      createCourse('Йога'),
      createCourse('Стретчинг'),
      createCourse('Бодифлекс'),
      createCourse('Фитнес'),
    ];

    const result = sortCourses(input).map((course) => course.nameRU);

    expect(result).toEqual(['Йога', 'Стретчинг', 'Фитнес', 'Степ-аэробика', 'Бодифлекс']);
  });

  it('не мутирует исходный массив', () => {
    const input = [createCourse('Фитнес'), createCourse('Йога')];
    const original = [...input];

    sortCourses(input);

    expect(input).toEqual(original);
  });

  it('возвращает пустой массив для пустого входа', () => {
    expect(sortCourses([])).toEqual([]);
  });

  it('ставит неизвестные курсы в конец', () => {
    const input = [
      createCourse('Пилатес'),
      createCourse('Йога'),
      createCourse('Стретчинг'),
    ];

    const result = sortCourses(input).map((course) => course.nameRU);

    expect(result).toEqual(['Йога', 'Стретчинг', 'Пилатес']);
  });

  it('сохраняет относительный порядок неизвестных курсов', () => {
    const input = [
      createCourse('Новый-1'),
      createCourse('Йога'),
      createCourse('Новый-2'),
    ];

    const result = sortCourses(input).map((course) => course.nameRU);

    expect(result).toEqual(['Йога', 'Новый-1', 'Новый-2']);
  });
});