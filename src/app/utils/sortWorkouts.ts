import type { Workout } from '../sharedTypes/types';

const extractNumber = (name: string): number => {
  const match = name.match(/(?:Урок|День)\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : Infinity;
};

export const sortWorkouts = (workouts: Workout[]): Workout[] => {
  return [...workouts].sort((a, b) => {
    const numA = extractNumber(a.name);
    const numB = extractNumber(b.name);
    if (numA !== numB) return numA - numB;
    return 0;
  });
};