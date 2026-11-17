import type { WorkoutProgress } from '../sharedTypes/types';
import { calcCourseProgress } from './calcCourseProgress';

const createProgress = (completed: boolean): WorkoutProgress => ({
  workoutId: `id-${Math.random()}`,
  workoutCompleted: completed,
  progressData: [0, 0, 0],
});

describe('calcCourseProgress', () => {
  it('возвращает 0, если тренировок нет', () => {
    expect(calcCourseProgress([], 0)).toBe(0);
  });

  it('возвращает 0, если нет завершённых тренировок', () => {
    expect(calcCourseProgress([createProgress(false)], 5)).toBe(0);
  });

  it('возвращает 0, если workoutsProgress пуст, но тренировки есть', () => {
    expect(calcCourseProgress([], 5)).toBe(0);
  });

  it('возвращает 40 для 2 из 5 завершённых', () => {
    const progress = [
      createProgress(true),
      createProgress(true),
      createProgress(false),
      createProgress(false),
    ];
    expect(calcCourseProgress(progress, 5)).toBe(40);
  });

  it('возвращает 100, если все тренировки завершены', () => {
    const progress = [
      createProgress(true),
      createProgress(true),
      createProgress(true),
    ];
    expect(calcCourseProgress(progress, 3)).toBe(100);
  });

  it('округляет дробные значения', () => {
    expect(calcCourseProgress([createProgress(true)], 3)).toBe(33);
  });

    it('возвращает 0, если workoutsProgress undefined', () => {
    expect(calcCourseProgress(undefined, 5)).toBe(0);
  });
});