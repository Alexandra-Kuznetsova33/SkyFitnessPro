import type { WorkoutProgress } from '../sharedTypes/types';

export const calcCourseProgress = (
  workoutsProgress: WorkoutProgress[] | undefined,
  totalWorkouts: number,
): number => {
  if (!workoutsProgress || totalWorkouts === 0) {
    return 0;
  }

  const completedCount = workoutsProgress.filter((w) => w.workoutCompleted).length;
  return Math.round((completedCount / totalWorkouts) * 100);
};