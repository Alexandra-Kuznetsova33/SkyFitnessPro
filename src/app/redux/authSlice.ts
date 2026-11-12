import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { LoginRequest, RegisterRequest, User } from '../sharedTypes/types';
import * as authService from '../services/auth';
import { getApiErrorMessage } from '../utils/handleApiError';

interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthSuccess {
  token: string;
  user: User;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isInitialized: false,
  isLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk<AuthSuccess, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const { token } = await authService.login(data);
      localStorage.setItem('token', token);
      const user = await authService.getMe();
      return { token, user };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const registerThunk = createAsyncThunk<AuthSuccess, RegisterRequest, { rejectValue: string }>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      await authService.register(data);
      const { token } = await authService.login({ email: data.email, password: data.password });
      localStorage.setItem('token', token);
      const user = await authService.getMe();
      return { token, user };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const initializeAuthThunk = createAsyncThunk<
  AuthSuccess | null,
  void,
  { rejectValue: string }
>('auth/initialize', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const user = await authService.getMe();
    return { token, user };
  } catch (error) {
    localStorage.removeItem('token');
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<AuthSuccess>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось войти';
      })

      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<AuthSuccess>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось зарегистрироваться';
      })

      .addCase(initializeAuthThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuthThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;

        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      })
      .addCase(initializeAuthThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload ?? null;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;