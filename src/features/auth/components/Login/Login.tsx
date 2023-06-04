import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../app/store";
import { login, clearErrors } from "../../authSlice";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { ErrorDisplay } from "../../../errorDisplay/components/ErrorDisplay/ErrorDisplay";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../app/hooks";
import { stat } from "fs";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(
    () => () => {
      dispatch(clearErrors());
    },
    []
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/todos");
      //   resetForm();
    }
  }, [isAuthenticated, navigate]);

  //   useEffect(
  //     () => {
  //       if (localStorage.getItem("authToken")) {
  //         dispatch(
  //       }
  //     },
  //     []
  //   );

  const { isLoading, errors } = useSelector((state: RootState) => state.auth);

  //   if (authToken) {

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Implement your logic here to connect with the backend
    // If successful, update the state with the user's information and auth token
    dispatch(login({ email, password }));
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </p>
        {!!errors.length && <ErrorDisplay errors={errors} />}
      </form>
    </div>
  );
};
