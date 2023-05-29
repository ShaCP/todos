import { PayloadAction } from "@reduxjs/toolkit";
import { UserAndToken } from "../../types/api/auth/UserAndToken";
import { AuthState } from "../../types/api/auth/AuthState";

export const handleAuthSuccess = (
    state: AuthState,
    action: PayloadAction<UserAndToken>
) => {
    state.isAuthenticated = true;
    state.user = action.payload.user;
    state.authToken = action.payload.token;
    state.isLoading = false;
};
