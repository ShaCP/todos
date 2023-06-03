import { PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types/api/authTypes";
import { ErrorMessages } from "../../types/ErrorMessages";

// Payload type may be undefined because this action type can't be properly inferred
export const handleAuthFailure = (
  state: AuthState,
  action: PayloadAction<ErrorMessages | undefined>
) => {
  if (action.payload !== undefined) {
    const errors = Array.isArray(action.payload)
      ? action.payload
      : [action.payload];
    state.errors = errors;
  } else {
    state.errors = ["An unknown error occurred."];
  }

  state.isLoading = false;
};
