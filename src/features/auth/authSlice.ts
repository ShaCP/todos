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
import { handleError } from "../../utilities/errorHandling";
import { ErrorType } from "../../constants/errors";

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  authToken: null,
  errors: []
};
export enum AuthActionType {
  LOGIN = "auth/login",
  REGISTER = "auth/register"
}
type AuthCredentials = LoginCredentials | RegisterCredentials;

const createAsyncAuthThunk = (url: string, type: AuthActionType) =>
  createAsyncThunk<
    UserAndToken,
    AuthCredentials,
    { rejectValue: ErrorMessages }
  >(type, async (credentials, { dispatch, rejectWithValue }) => {
    dispatch(startAuth());
    try {
      const response = await postJSON(url, credentials);

      const result = await handleServerResponse(response);

      if (result.isError) {
        return rejectWithValue(result.errorMessages);
      } else if (!result.data) {
        return rejectWithValue([ErrorType.Unknown]);
      }

      const { userName, token, email, todos } = result.data;

      dispatch(setTodos(todos));

      const user = { userName, email };
      return { user, token };
    } catch (error) {
      const errorMessages = handleError(error);
      return rejectWithValue(errorMessages);
    }
  });

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

async function postJSON(url: string, body: AuthCredentials): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

export const { startAuth, logout, clearErrors } = authSlice.actions;

export default authSlice.reducer;
