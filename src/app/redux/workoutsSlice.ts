import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { Workout } from '../sharedTypes/types';
import * as coursesService from '../services/courses';
import { getApiErrorMessage } from '../utils/handleApiError';

interface WorkoutsState {
  byCourseId: Record<string, Workout[]>;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkoutsState = {
  byCourseId: {},
  isLoading: false,
  error: null,
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
        state.byCourseId[action.payload.courseId] = action.payload.workouts;
      })
      .addCase(fetchCourseWorkouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить тренировки';
      });
  },
});

export default workoutsSlice.reducer;