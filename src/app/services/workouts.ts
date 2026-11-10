import type { Workout } from '../sharedTypes/types';

import { API_ENDPOINTS } from './constants';
import { api } from './api';

export const getById = async (workoutId: string): Promise<Workout> => {
  const response = await api.get<Workout>(API_ENDPOINTS.workouts.byId(workoutId));
  return response.data;
};