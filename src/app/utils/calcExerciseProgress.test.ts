import { calcExerciseProgress } from './calcExerciseProgress';

describe('calcExerciseProgress', () => {
  it('возвращает 0, если total = 0', () => {
    expect(calcExerciseProgress(10, 0)).toBe(0);
  });

  it('возвращает 0, если ничего не сделано', () => {
    expect(calcExerciseProgress(0, 20)).toBe(0);
  });

  it('возвращает 40 для 8 из 20', () => {
    expect(calcExerciseProgress(8, 20)).toBe(40);
  });

  it('возвращает 100, если сделано ровно сколько нужно', () => {
    expect(calcExerciseProgress(20, 20)).toBe(100);
  });

  it('не превышает 100, если сделано больше нормы', () => {
    expect(calcExerciseProgress(30, 20)).toBe(100);
  });

  it('округляет дробные значения', () => {
    expect(calcExerciseProgress(1, 3)).toBe(33);
  });
});