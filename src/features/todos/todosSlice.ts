import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login } from "../auth/authSlice";

export interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
  description: string;
}

const initialState: Todo[] = [];

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.push(action.payload);
    },
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
  }
});

export const { addTodo, removeTodo, updateTodo, setTodos } = todosSlice.actions;

export default todosSlice.reducer;
