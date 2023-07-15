import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { handleError } from "../../utilities/errorHandling";
import { ErrorMessages } from "../../types/ErrorMessages";
import { showToast } from "../../utils/toast";
export interface Todo extends BaseTodo {
  id: number;
}

export interface BaseTodo {
  title: string;
  isCompleted: boolean;
  description: string;
}

const initialState: Todo[] = [];

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // addTodo: (state, action: PayloadAction<Todo>) => {
    //   state.push(action.payload);
    // },
    removeTodo: (state, action: PayloadAction<number>) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    setTodos: (_, action: PayloadAction<Todo[]>) => {
      return action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addTodosRequest.fulfilled, (state, action) => {
      state.push(action.payload);
      showToast({
        successMessage: "Todo added successfully."
      });
    });
    builder.addCase(addTodosRequest.rejected, (state, action) => {
      showToast({
        errorMessage: action.payload?.join("\n") || "An unknown error occurred."
      });
    });
  }
});

export const addTodosRequest = createAsyncThunk<
  Todo,
  BaseTodo,
  { state: RootState; rejectValue: ErrorMessages }
>("todos/addTodo", async (baseTodo, { getState, rejectWithValue }) => {
  try {
    const authToken = getState().auth.authToken;
    const response = await fetch(`${process.env.REACT_APP_API_URL}/todo`, {
      body: JSON.stringify(baseTodo),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      }
    });

    const todo = await response.json();

    return todo;
  } catch (error) {
    const errorMessages = handleError(error);
    return rejectWithValue(errorMessages);
  }
});

export const { removeTodo, updateTodo, setTodos } = todosSlice.actions;

export default todosSlice.reducer;
