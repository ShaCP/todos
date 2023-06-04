import { PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserAndToken } from "../../types/api/authTypes";

export const handleAuthSuccess = (
    state: AuthState,
    action: PayloadAction<UserAndToken>
) => {
    state.isAuthenticated = true;
    state.authToken = action.payload.token;
    state.isLoading = false;
    state.user = action.payload.user;
    state.errors = [];
};
