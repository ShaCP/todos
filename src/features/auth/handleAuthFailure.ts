import { PayloadAction } from "@reduxjs/toolkit";
import { AuthFailurePayload } from "../../types/api/auth/AuthFailurePayload";
import { AuthState } from "../../types/api/auth/AuthState";

// Payload type may be undefined because this action type can't be properly inferred
export const handleAuthFailure = (
    state: AuthState,
    action: PayloadAction<AuthFailurePayload | undefined>
) => {
    if (action.payload !== undefined) {
        const errors = Array.isArray(action.payload)
            ? action.payload
            : [action.payload];
        state.errors = errors;
        state.isLoading = false;
    } else {
        state.errors = ["An unknown error occurred."];
        state.isLoading = false;
    }
};
