import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useEffect, useState } from "react";
import { AUTH_TOKEN_KEY, loginWithToken } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAuthenticate = (/* redirectPath = "/login" */) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [attemptedAuth, setAttemptedAuth] = useState(false);

  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !attemptedAuth) {
      setAttemptedAuth(true);
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        dispatch(loginWithToken(token))
          .unwrap()
          .catch(() => {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            // navigate(redirectPath);
          });
      } else {
        // navigate(redirectPath);
      }
    }
  }, [
    dispatch,
    isAuthenticated,
    isLoading,
    navigate,
    attemptedAuth /* redirectPath */
  ]);

  return { isLoading, isAuthenticated, attemptedAuth };
};
