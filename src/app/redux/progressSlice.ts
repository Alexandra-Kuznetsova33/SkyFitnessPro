import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { CourseProgress, SingleWorkoutProgress } from '../sharedTypes/types';
import * as progressService from '../services/progress';
import { getApiErrorMessage } from '../utils/handleApiError';

interface ProgressState {
  courseProgressById: Record<string, CourseProgress>;
  workoutProgressById: Record<string, SingleWorkoutProgress>;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  courseProgressById: {},
  workoutProgressById: {},
  isLoading: false,
  error: null,
};

export const fetchCourseProgress = createAsyncThunk<
  { courseId: string; data: CourseProgress },
  string,
  { rejectValue: string }
>('progress/fetchCourse', async (courseId, { rejectWithValue }) => {
  try {
    const data = await progressService.getCourseProgress(courseId);
    return { courseId, data };
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const fetchWorkoutProgressById = createAsyncThunk<
  { workoutId: string; data: SingleWorkoutProgress },
  { courseId: string; workoutId: string },
  { rejectValue: string }
>('progress/fetchWorkout', async ({ courseId, workoutId }, { rejectWithValue }) => {
  try {
    const data = await progressService.getWorkoutProgress(courseId, workoutId);
    return { workoutId, data };
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const saveWorkoutProgressThunk = createAsyncThunk<
  { workoutId: string; data: SingleWorkoutProgress },
  { courseId: string; workoutId: string; progressData: number[] },
  { rejectValue: string }
>(
  'progress/saveWorkout',
  async ({ courseId, workoutId, progressData }, { rejectWithValue }) => {
    try {
      const data = await progressService.saveWorkoutProgress(courseId, workoutId, progressData);
      return { workoutId, data };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const resetWorkoutProgressThunk = createAsyncThunk<
  { workoutId: string },
  { courseId: string; workoutId: string },
  { rejectValue: string }
>('progress/resetWorkout', async ({ courseId, workoutId }, { rejectWithValue }) => {
  try {
    await progressService.resetWorkoutProgress(courseId, workoutId);
    return { workoutId };
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courseProgressById[action.payload.courseId] = action.payload.data;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить прогресс';
      })

      .addCase(fetchWorkoutProgressById.fulfilled, (state, action) => {
        state.workoutProgressById[action.payload.workoutId] = action.payload.data;
      })

      .addCase(saveWorkoutProgressThunk.fulfilled, (state, action) => {
        state.workoutProgressById[action.payload.workoutId] = action.payload.data;
      })

      .addCase(resetWorkoutProgressThunk.fulfilled, (state, action) => {
        state.workoutProgressById[action.payload.workoutId] = {
          workoutId: action.payload.workoutId,
          workoutCompleted: false,
          progressData: [],
        };
      });
  },
});

export default progressSlice.reducer;