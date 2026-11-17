import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { Course } from '../sharedTypes/types';
import * as authService from '../services/auth';
import * as coursesService from '../services/courses';
import { getApiErrorMessage } from '../utils/handleApiError';
import { sortCourses } from '../utils/sortCourses';

interface CoursesState {
  items: Course[];
  currentCourse: Course | null;
  myCourses: Course[];
  isLoading: boolean;
  isCurrentLoading: boolean;
  isMyCoursesLoading: boolean;
  error: string | null;
  currentError: string | null;
  myCoursesError: string | null;
}

const initialState: CoursesState = {
  items: [],
  currentCourse: null,
  myCourses: [],
  isLoading: false,
  isCurrentLoading: false,
  isMyCoursesLoading: false,
  error: null,
  currentError: null,
  myCoursesError: null,
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

export const fetchCourseById = createAsyncThunk<Course, string, { rejectValue: string }>(
  'courses/fetchById',
  async (courseId, { rejectWithValue }) => {
    try {
      return await coursesService.getById(courseId);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const fetchMyCourses = createAsyncThunk<Course[], string[], { rejectValue: string }>(
  'courses/fetchMy',
  async (courseIds, { rejectWithValue }) => {
    try {
      if (courseIds.length === 0) {
        return [];
      }

      const courses = await Promise.all(courseIds.map((id) => coursesService.getById(id)));
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
      })

      .addCase(fetchCourseById.pending, (state) => {
        state.currentCourse = null;
        state.isCurrentLoading = true;
        state.currentError = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.isCurrentLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.isCurrentLoading = false;
        state.currentError = action.payload ?? 'Не удалось загрузить курс';
      })
      .addCase(fetchMyCourses.pending, (state) => {
        state.isMyCoursesLoading = true;
        state.myCoursesError = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.isMyCoursesLoading = false;
        state.myCourses = action.payload;
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.isMyCoursesLoading = false;
        state.myCoursesError = action.payload ?? 'Не удалось загрузить ваши курсы';
      });
  },
});

export default coursesSlice.reducer;
