import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { CourseProgress } from '../sharedTypes/types';
import * as progressService from '../services/progress';
import { getApiErrorMessage } from '../utils/handleApiError';

interface ProgressState {
  courseProgressById: Record<string, CourseProgress>;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  courseProgressById: {},
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
      });
  },
});

export default progressSlice.reducer;