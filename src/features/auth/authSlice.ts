import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  LoginCredentials,
  RegisterCredentials
} from "../../types/api/authTypes";
import { handleAuthSuccess } from "./handleAuthSuccess";
import { handleAuthFailure } from "./handleAuthFailure";
import { handleServerResponse } from "./handleServerResponse";
import { AuthState } from "../../types/api/authTypes";
import { UserAndToken } from "../../types/api/authTypes";
import { ErrorMessages } from "../../types/ErrorMessages";
import { setTodos } from "../todos/todosSlice";

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  errors: [],
  user: null,
  authToken: null
};
export enum AuthActionType {
  LOGIN = "auth/login",
  REGISTER = "auth/register"
}
type AuthCredentials = LoginCredentials | RegisterCredentials;

const handleError = (error: any): ErrorMessages => {
  let errorMessages: ErrorMessages;
  if (error instanceof Error) {
    errorMessages = [error.message];
  } else if (Array.isArray(error)) {
    errorMessages = error;
  } else if (typeof error === "string") {
    errorMessages = [error];
  } else {
    errorMessages = ["An unknown error occurred."];
  }
  return errorMessages;
};

const createAsyncAuthThunk = (url: string, type: AuthActionType) =>
  createAsyncThunk<
    UserAndToken,
    AuthCredentials,
    { rejectValue: ErrorMessages }
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

      const { userName, email, token, todos } = await handleServerResponse(
        response
      );

      dispatch(setTodos(todos));

      const user = { userName, email };
      return { user, token };
    } catch (error) {
      const errorMessages = handleError(error);
      return rejectWithValue(errorMessages);
    }
  });

//   const createAsyncAuthFromTokenThunk = (url: string, type: string) =>
//   createAsyncThunk<
//     UserAndToken,
//     AuthCredentials,
//     { rejectValue: ErrorMessages }
//   >(type, async (credentials, { dispatch, rejectWithValue }) => {
//     dispatch(startAuth());
//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(credentials)
//       });

//       return await handleServerResponse(response);
//     } catch (error) {
//       let errorMessages: ErrorMessages;
//       if (error instanceof Error) {
//         errorMessages = [error.message];
//       } else if (Array.isArray(error)) {
//         errorMessages = error;
//       } else if (typeof error === "string") {
//         errorMessages = [error];
//       } else {
//         errorMessages = ["An unknown error occurred."];
//       }

//       return rejectWithValue(errorMessages);
//     }
//   });

export const login = createAsyncAuthThunk(
  `${process.env.REACT_APP_API_URL}/${AuthActionType.LOGIN}`,
  AuthActionType.LOGIN
);

export const register = createAsyncAuthThunk(
  `${process.env.REACT_APP_API_URL}/${AuthActionType.REGISTER}`,
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
      state.authToken = null;
      state.errors = [];
      state.user = null;
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

// async function postJSON(url: string, body: object): Promise<Response> {
//   return fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body)
//   });
// }

export const { startAuth, logout, clearErrors } = authSlice.actions;

export const authReducer = authSlice.reducer;
