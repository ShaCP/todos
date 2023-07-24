import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { handleError } from "../../utilities/errorHandling";
import { ErrorMessages } from "../../types/ErrorMessages";
import { addToast } from "../toast/toastSlice";
export interface ITodo extends BaseTodo {
  id: number;
}

export interface BaseTodo {
  title: string;
  isCompleted: boolean;
  description: string;
}

const initialState: ITodo[] = [];

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    updateTodo: (state, action: PayloadAction<ITodo>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    setTodos: (_, action: PayloadAction<ITodo[]>) => {
      return action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodo.fulfilled, (state, { payload: todo }) => {
        state.push(todo);
      })
      .addCase(removeTodo.fulfilled, (state, { payload: todoId }) => {
        return state.filter((todo) => todo.id !== todoId);
      })
      .addCase(updateTodo.fulfilled, (state, { payload: todo }) => {
        const index = state.findIndex((t) => t.id === todo.id);
        if (index !== -1) {
          state[index] = todo;
        }
      });
  }
});

export const addTodo = createAsyncThunk<
  ITodo,
  BaseTodo,
  { state: RootState; rejectValue: ErrorMessages }
>("todos/addTodo", async (baseTodo, { getState, dispatch }) => {
  try {
    const authToken = getState().auth.authToken;

    if (!authToken) throw new Error("No auth token");

    const response = await apiAddRequest(
      `${process.env.REACT_APP_API_URL}/todo`,
      authToken,
      baseTodo
    );

    if (!response.ok) {
      throw new Error("Failed to add todo");
    }

    const todo = await response.json();

    dispatch(addToast({ type: "success", message: "Todo added" }));

    return todo;
  } catch (error) {
    const errorMessages = handleError(error);
    dispatch(addToast({ type: "error", message: errorMessages.join("/n") }));
    throw error;
  }
});

export const updateTodo = createAsyncThunk<
  ITodo,
  ITodo,
  { state: RootState; rejectValue: ErrorMessages }
>("todos/updateTodo", async (todo, { getState, dispatch }) => {
  try {
    const authToken = getState().auth.authToken;

    if (!authToken) throw new Error("No auth token");

    const response = await apiUpdateRequest(
      `${process.env.REACT_APP_API_URL}/todo/${todo.id}`,
      authToken,
      todo
    );

    if (!response.ok) {
      throw new Error("Failed to update todo");
    }

    dispatch(addToast({ type: "success", message: "Todo updated" }));

    return todo;
  } catch (error) {
    const errorMessages = handleError(error);
    dispatch(addToast({ type: "error", message: errorMessages.join("/n") }));
    throw error;
  }
});

export const removeTodo = createAsyncThunk<
  number,
  number,
  { state: RootState; rejectValue: ErrorMessages }
>("todos/removeTodo", async (todoId, { getState, dispatch }) => {
  try {
    const authToken = getState().auth.authToken;

    if (!authToken) throw new Error("No auth token");

    const response = await apiDeleteRequest(
      `${process.env.REACT_APP_API_URL}/todo/${todoId}`,
      authToken
    );

    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }

    dispatch(addToast({ type: "success", message: "Todo removed" }));

    return todoId;
  } catch (error) {
    const errorMessages = handleError(error);
    dispatch(addToast({ type: "error", message: errorMessages.join("/n") }));
    throw error;
  }
});

function apiAddRequest(url: string, authToken: string, body: BaseTodo) {
  return fetch(url, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    }
  });
}

function apiUpdateRequest(url: string, authToken: string, body: BaseTodo) {
  return fetch(url, {
    body: JSON.stringify(body),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    }
  });
}

function apiDeleteRequest(url: string, authToken: string) {
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    }
  });
}

export const { setTodos } = todosSlice.actions;

export default todosSlice.reducer;
