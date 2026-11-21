import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { Workout } from '../sharedTypes/types';
import * as coursesService from '../services/courses';
import * as workoutsService from '../services/workouts';
import { getApiErrorMessage } from '../utils/handleApiError';
import { sortWorkouts } from '../utils/sortWorkouts';

interface WorkoutsState {
  byCourseId: Record<string, Workout[]>;
  currentWorkout: Workout | null;
  isLoading: boolean;
  isCurrentLoading: boolean;
  error: string | null;
  currentError: string | null;
}

const initialState: WorkoutsState = {
  byCourseId: {},
  currentWorkout: null,
  isLoading: false,
  isCurrentLoading: false,
  error: null,
  currentError: null,
};

export const fetchCourseWorkouts = createAsyncThunk<
  { courseId: string; workouts: Workout[] },
  string,
  { rejectValue: string }
>('workouts/fetchByCourse', async (courseId, { rejectWithValue }) => {
  try {
    const workouts = await coursesService.getWorkouts(courseId);
    return { courseId, workouts };
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const fetchWorkoutById = createAsyncThunk<Workout, string, { rejectValue: string }>(
  'workouts/fetchById',
  async (workoutId, { rejectWithValue }) => {
    try {
      return await workoutsService.getById(workoutId);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseWorkouts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseWorkouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.byCourseId[action.payload.courseId] = sortWorkouts(action.payload.workouts);
      })
      .addCase(fetchCourseWorkouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить тренировки';
      })

      .addCase(fetchWorkoutById.pending, (state) => {
        state.currentWorkout = null;
        state.isCurrentLoading = true;
        state.currentError = null;
      })
      .addCase(fetchWorkoutById.fulfilled, (state, action) => {
        state.isCurrentLoading = false;
        state.currentWorkout = action.payload;
      })
      .addCase(fetchWorkoutById.rejected, (state, action) => {
        state.isCurrentLoading = false;
        state.currentError = action.payload ?? 'Не удалось загрузить тренировку';
      });
  },
});

export default workoutsSlice.reducer;
