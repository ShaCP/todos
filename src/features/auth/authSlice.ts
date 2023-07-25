import {
  createAsyncThunk,
  createSelector,
  createSlice,
  isAnyOf
} from "@reduxjs/toolkit";
import {
  AuthToken,
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
import { RootState } from "app/store";

export const AUTH_TOKEN_KEY = "authToken";

const initialState: AuthState = {
  showLogin: true,
  isAuthenticated: false,
  isLoading: false,
  user: null,
  [AUTH_TOKEN_KEY]: null,
  errors: []
};
export enum AuthActionType {
  LOGIN = "auth/login",
  REGISTER = "auth/register",
  LOGIN_WITH_TOKEN = "auth/token-login"
}
type AuthCredentials = LoginCredentials | RegisterCredentials | AuthToken;

const createAsyncAuthThunk = (url: string, type: AuthActionType) =>
  createAsyncThunk<
    UserAndToken,
    AuthCredentials,
    { rejectValue: ErrorMessages }
  >(type, async (credentials, { dispatch, rejectWithValue }) => {
    dispatch(startAuth());
    try {
      const response = await authRequest(url, credentials);

      const result = await handleServerResponse(response);

      if (result.isError) {
        return rejectWithValue(result.errorMessages);
      } else if (!result.data) {
        return rejectWithValue([ErrorType.Unknown]);
      }

      const { userName, token, email, todos } = result.data;

      dispatch(setTodos(todos));

      const user = { userName, email };
      localStorage.setItem(AUTH_TOKEN_KEY, token);
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

export const loginWithToken = createAsyncAuthThunk(
  `${process.env.REACT_APP_API_URL}/${AuthActionType.LOGIN_WITH_TOKEN}`,
  AuthActionType.LOGIN_WITH_TOKEN
);

const fulfilledActions = [
  login.fulfilled,
  register.fulfilled,
  loginWithToken.fulfilled
];
const rejectedActions = [login.rejected, register.rejected];

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
    },
    showLogin(state, action) {
      state.showLogin = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithToken.rejected, (state) => {
        state.isLoading = false;
      })
      .addMatcher(isAnyOf(...fulfilledActions), handleAuthSuccess)
      .addMatcher(isAnyOf(...rejectedActions), handleAuthFailure);
  }
});

async function authRequest(
  url: string,
  credentials: AuthCredentials
): Promise<Response> {
  const isTokenRequest = typeof credentials === "string";
  return fetch(url, {
    method: isTokenRequest ? "GET" : "POST",
    headers: isTokenRequest
      ? { Authorization: `Bearer ${credentials}` }
      : { "Content-Type": "application/json" },
    body: isTokenRequest ? undefined : JSON.stringify(credentials)
  });
}

export const selectUser = createSelector(
  (state: RootState) => state.auth,
  (auth) => auth.user
);

export const { startAuth, logout, clearErrors, showLogin } = authSlice.actions;

export default authSlice.reducer;
