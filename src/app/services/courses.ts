import type { Course, MessageResponse, Workout } from '../sharedTypes/types';

import { API_ENDPOINTS } from './constants';
import { api } from './api';

export const getAll = async (): Promise<Course[]> => {
  const response = await api.get<Course[]>(API_ENDPOINTS.courses.all);
  return response.data;
};

export const getById = async (courseId: string): Promise<Course> => {
  const response = await api.get<Course>(API_ENDPOINTS.courses.byId(courseId));
  return response.data;
};

export const getWorkouts = async (courseId: string): Promise<Workout[]> => {
  const response = await api.get<Workout[]>(API_ENDPOINTS.courses.workouts(courseId));
  return response.data;
};

export const addToMy = async (courseId: string): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(
    API_ENDPOINTS.users.myCourses,
    JSON.stringify({ courseId }),
    { headers: { 'Content-Type': 'text/plain' } },
  );
  return response.data;
};

export const removeFromMy = async (courseId: string): Promise<MessageResponse> => {
  const response = await api.delete<MessageResponse>(API_ENDPOINTS.users.myCourseById(courseId));
  return response.data;
};

export const resetProgress = async (courseId: string): Promise<MessageResponse> => {
  const response = await api.patch<MessageResponse>(API_ENDPOINTS.courses.reset(courseId));
  return response.data;
};
