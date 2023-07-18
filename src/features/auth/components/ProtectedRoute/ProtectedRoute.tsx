import { useEffect, useState } from "react";
import { RouteProps, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../../app/store";
import { useDispatch } from "react-redux";
import { AUTH_TOKEN_KEY, loginWithToken } from "../../authSlice";
import { useAppSelector } from "../../../../app/hooks";

export const ProtectedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const [authAttempted, setAuthAttempted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !authAttempted) {
      setAuthAttempted(true);
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        dispatch(loginWithToken(token))
          .unwrap()
          .catch(() => {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            // navigate("/login");
          });
      } else {
        // navigate("/login");
      }
    }
  }, [authAttempted, dispatch, isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated) {
    return null; // or render a loading spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;
