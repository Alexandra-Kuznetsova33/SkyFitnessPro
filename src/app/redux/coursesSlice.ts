import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { Course } from '../sharedTypes/types';
import * as coursesService from '../services/courses';
import * as authService from '../services/auth';
import { sortCourses } from '../utils/sortCourses';
import { getApiErrorMessage } from '../utils/handleApiError';

interface CoursesState {
  items: Course[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchAllCourses = createAsyncThunk<Course[], void, { rejectValue: string }>(
  'courses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const courses = await coursesService.getAll();
      return sortCourses(courses);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const addCourse = createAsyncThunk<string[], string, { rejectValue: string }>(
  'courses/add',
  async (courseId, { rejectWithValue }) => {
    try {
      await coursesService.addToMy(courseId);
      const user = await authService.getMe();
      return user.selectedCourses;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const removeCourse = createAsyncThunk<string[], string, { rejectValue: string }>(
  'courses/remove',
  async (courseId, { rejectWithValue }) => {
    try {
      await coursesService.removeFromMy(courseId);
      const user = await authService.getMe();
      return user.selectedCourses;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить курсы';
      });
  },
});

export default coursesSlice.reducer;
