import { create } from "domain";
import { ErrorMessages } from "../../types/ErrorMessages";
import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";

interface AppError {
  readonly id: string;
  readonly message: string;
  readonly source: string;
}

function createError(message: string, source: string): AppError {
    return {
      id: nanoid(),
      message,
      source,
    };
  }
  

const initialState: AppError[] = [];

const errorsSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    addError: (state, action: PayloadAction<AppError | AppError[]>) => {
      state.concat(action.payload);
    },
    removeError: (state, action: PayloadAction<AppError>) => {
      return state.filter((error) => error !== action.payload);
    },
    clearErrors: () => {
      return [];
    }
  }
});


export const { addError, removeError, clearErrors } = errorsSlice.actions;
