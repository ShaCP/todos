import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    email: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  authToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  authToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startAuth: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<{ user: { username: string; email: string }; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.authToken = action.payload.token;
      state.isLoading = false;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.authToken = null;
    },
  },
});

export const { startAuth, authSuccess, authFailure, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;