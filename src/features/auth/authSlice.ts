import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginCredentials, RegisterCredentials } from "./authTypes";
import { handleAuthSuccess } from "./handleAuthSuccess";
import { handleAuthFailure } from "./handleAuthFailure";
import { handleServerResponse } from "./handleServerResponse";
import { AuthState } from "../../types/api/auth/AuthState";
import { UserAndToken } from "../../types/api/auth/UserAndToken";
import { AuthFailurePayload } from "../../types/api/auth/AuthFailurePayload";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  errors: [],
  authToken: null
};
enum AuthActionType {
  LOGIN = "auth/login",
  REGISTER = "auth/register"
  // add other action types as needed
}
type AuthCredentials = LoginCredentials | RegisterCredentials;

const createAsyncAuthThunk = (url: string, type: string) =>
  createAsyncThunk<
    UserAndToken,
    AuthCredentials,
    { rejectValue: AuthFailurePayload }
  >(type, async (credentials, { dispatch, rejectWithValue }) => {
    dispatch(startAuth());
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });

      return await handleServerResponse(response);
    } catch (error) {
      let errorMessage: AuthFailurePayload;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (Array.isArray(error)) {
        errorMessage = error;
      } else {
        errorMessage = "An unknown error occurred.";
      }
      return rejectWithValue(errorMessage);
    }
  });

export const login = createAsyncAuthThunk(
  "http://localhost:5289/api/auth/login",
  AuthActionType.LOGIN
);

export const register = createAsyncAuthThunk(
  "http://localhost:5289/api/auth/register",
  AuthActionType.REGISTER
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startAuth: (state) => {
      state.isLoading = true;
      state.errors = [];
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.authToken = null;
      state.errors = [];
    },
    clearErrors: (state) => {
      state.errors = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, handleAuthSuccess);
    builder.addCase(login.rejected, handleAuthFailure);
    builder.addCase(register.fulfilled, handleAuthSuccess);
    builder.addCase(register.rejected, handleAuthFailure);
  }
});

async function postJSON(url: string, body: object): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

export const { startAuth, logout, clearErrors } = authSlice.actions;

export const authReducer = authSlice.reducer;
