import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { startAuth, authSuccess, authFailure } from "../../authSlice";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { LoginCredentials } from "../../authTypes";
import { ErrorDisplay } from "../../../errorDisplay/components/ErrorDisplay/ErrorDisplay";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { isLoading, errors } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(startAuth());

    // Implement your logic here to connect with the backend
    // If successful, update the state with the user's information and auth token
    try {
      const loginCredentials: LoginCredentials = {
        email,
        password
      };

      const response = await fetch("http://localhost:5289/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginCredentials),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const parsedResponse = await response.json();
      const { token, userName, _email } = parsedResponse;
      const user = { userName, email: _email };

      dispatch(authSuccess({ user, token }));
    } catch (err) {
      if (err instanceof Error) {
        dispatch(authFailure(err.message));
      } else {
        dispatch(authFailure("An unexpected error occurred."));
      }
    }
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
