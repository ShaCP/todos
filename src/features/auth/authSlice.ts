import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { ErrorMessage } from "../../types/commonTypes";
import { LoginCredentials, RegisterCredentials } from "./authTypes";
import { ErrorResponse } from "../../types/apiTypes";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  errors: string[];
  authToken: string | null;
}
interface SuccessfulLoginResponse {
  userName: string;
  token: string;
  email: string;
}

interface UserAndToken {
  user: User;
  token: string;
}

type AuthFailurePayload = ErrorMessage | ErrorMessage[];

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  errors: [],
  authToken: null
};
type AuthCredentials = LoginCredentials | RegisterCredentials;

const handleAuthSuccess = (
  state: AuthState,
  action: PayloadAction<UserAndToken>
) => {
  state.isAuthenticated = true;
  state.user = action.payload.user;
  state.authToken = action.payload.token;
  state.isLoading = false;
};

// Payload type may be undefined because this action type can't be properly inferred
const handleAuthFailure = (
  state: AuthState,
  action: PayloadAction<AuthFailurePayload | undefined>
) => {
  if (action.payload !== undefined) {
    const errors = Array.isArray(action.payload)
      ? action.payload
      : [action.payload];
    state.errors = errors;
    state.isLoading = false;
  }
};

const handleServerResponse = async (
  response: Response
): Promise<UserAndToken> => {
  const parsedResponse = await response.json();
  if (response.ok) {
    const { userName, email, token } =
      parsedResponse as SuccessfulLoginResponse;
    const user: User = { userName, email };

    // Store the token in localStorage
    localStorage.setItem("authToken", token);
    return { user, token };
  } else {
    if (parsedResponse instanceof Array) {
      const errors = parsedResponse as ErrorResponse[];
      const errorDescriptions = errors.map((e) => e.description);
      return Promise.reject(errorDescriptions);
    } else {
      const error = parsedResponse as ErrorResponse;
      return Promise.reject(error.description);
    }
  }
};

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
  "auth/login"
);

export const register = createAsyncAuthThunk(
  "http://localhost:5289/api/auth/register",
  "auth/register"
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
  }
});

export const { startAuth, logout, clearErrors } = authSlice.actions;

export const authReducer = authSlice.reducer;
