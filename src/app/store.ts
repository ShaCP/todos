import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import todosReducer from "../features/todos/todosSlice";
import authReducer from "../features/auth/authSlice";
import toastReducer from "../features/toast/toastSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    auth: authReducer,
    toasts: toastReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
