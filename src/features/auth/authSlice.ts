import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { ErrorMessage } from '../../types/commonTypes';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  errors: string[];
  authToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  errors: [],
  authToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startAuth: (state) => {
      state.isLoading = true;
      state.errors = [];
    },
    authSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.authToken = action.payload.token;
      state.isLoading = false;
    },
    authFailure: (state, action: PayloadAction<ErrorMessage[] | ErrorMessage>) => {
      const errors = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.errors = errors;
      state.isLoading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.authToken = null;
      state.errors = [];
    },
  },
});

export const { startAuth, authSuccess, logout, authFailure } = authSlice.actions;

export const authReducer = authSlice.reducer;