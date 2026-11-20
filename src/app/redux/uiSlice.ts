import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isAuthModalOpen: boolean;
  workoutModalCourseId: string | null;
}

const initialState: UiState = {
  isAuthModalOpen: false,
  workoutModalCourseId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    openWorkoutModal: (state, action: PayloadAction<string>) => {
      state.workoutModalCourseId = action.payload;
    },
    closeWorkoutModal: (state) => {
      state.workoutModalCourseId = null;
    },
  },
});

export const { openAuthModal, closeAuthModal, openWorkoutModal, closeWorkoutModal } =
  uiSlice.actions;
export default uiSlice.reducer;