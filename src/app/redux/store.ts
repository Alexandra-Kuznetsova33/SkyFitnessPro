import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import coursesReducer from './coursesSlice';
import progressReducer from './progressSlice';
import uiReducer from './uiSlice';
import workoutsReducer from './workoutsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    progress: progressReducer,
    ui: uiReducer,
    workouts: workoutsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;