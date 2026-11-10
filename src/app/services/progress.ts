import type {
  CourseProgress,
  SingleWorkoutProgress,
  WorkoutProgress,
} from '../sharedTypes/types';

import { API_ENDPOINTS } from './constants';
import { api } from './api';

export const getCourseProgress = async (courseId: string): Promise<CourseProgress> => {
  const response = await api.get<CourseProgress>(API_ENDPOINTS.users.myProgress, {
    params: { courseId },
  });
  return response.data;
};

export const getWorkoutProgress = async (
  courseId: string,
  workoutId: string,
): Promise<SingleWorkoutProgress> => {
  const response = await api.get<SingleWorkoutProgress>(API_ENDPOINTS.users.myProgress, {
    params: { courseId, workoutId },
  });
  return response.data;
};

export const saveWorkoutProgress = async (
  courseId: string,
  workoutId: string,
  progressData: number[],
): Promise<WorkoutProgress> => {
  const response = await api.patch<WorkoutProgress>(
    API_ENDPOINTS.courses.workoutProgress(courseId, workoutId),
    { progressData },
  );
  return response.data;
};

export const resetWorkoutProgress = async (
  courseId: string,
  workoutId: string,
): Promise<WorkoutProgress> => {
  const response = await api.patch<WorkoutProgress>(
    API_ENDPOINTS.courses.workoutReset(courseId, workoutId),
  );
  return response.data;
};