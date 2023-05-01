import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../../../app/store";
import { authFailure, authSuccess, startAuth } from "../../authSlice";
import styles from "./Register.module.css";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state: RootState) => state.auth.error);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  if (isAuthenticated) {
    navigate("/");
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(startAuth());

    // Implement your logic here to connect with the backend
    // If successful, update the state with the user's information and auth token
    try {
      const user = {
        username: username,
        email: email
      };
      const token = "exampleAuthToken";

      // Simulate a delay for loading state demonstration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Store the token in localStorage
      localStorage.setItem("authToken", token);

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
      <h2>Register</h2>
      <form onSubmit={handleRegister} className={styles.form}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          placeholder="Username"
          required
        />
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
          {isLoading ? "Loading..." : "Register"}
        </button>
        <p>
          Already have an account?{" "}
          <Link to="/" className={styles.link}>
            Log In
          </Link>
        </p>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};
