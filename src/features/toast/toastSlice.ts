import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";
export type ToastType = "error" | "success" | "info";
export type ToastMessage = Readonly<{
  type: ToastType;
  message: string;
}>;
export type IToast = Readonly<{
  id: string;
}> &
  ToastMessage;

function createToast(message: ToastMessage): IToast {
  return {
    id: nanoid(),
    ...message
  };
}

const initialState: IToast[] = [];

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<ToastMessage>) => {
      const toast = createToast(action.payload);
      state.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      return state.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: () => {
      return [];
    }
  }
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
