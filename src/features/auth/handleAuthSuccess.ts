import { PayloadAction } from "@reduxjs/toolkit";
import { UserAndToken } from "../../types/api/authTypes";
import { AuthState } from "../../types/api/authTypes";

export const handleAuthSuccess = (
    state: AuthState,
    action: PayloadAction<UserAndToken>
) => {
    state.isAuthenticated = true;
    state.user = action.payload.user;
    state.authToken = action.payload.token;
    state.isLoading = false;
};
