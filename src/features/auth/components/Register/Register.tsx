import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../../../app/store";
import { authFailure, authSuccess, startAuth } from "../../authSlice";
import styles from "./Register.module.css";
import { RegisterCredentials } from "../../authTypes";

export const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errors = useSelector((state: RootState) => state.auth.errors);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleConfirmPasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value !== password) {
      e.target.setCustomValidity("Passwords do not match");
    } else {
     // likely not needed but doesn't hurt
      e.target.setCustomValidity("");
    }

    // e.target.reportValidity();
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Clear custom validity whenever user types in the field
    e.target.setCustomValidity("");
    setConfirmPassword(e.target.value);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(startAuth());

    // Implement your logic here to connect with the backend
    // If successful, update the state with the user's information and auth token
    try {
      const user = { userName, email };

      const registrationCredentials: RegisterCredentials = {
        userName,
        email,
        password,
        confirmPassword
      };

      const response = await fetch("http://localhost:5289/api/auth/register", {
        method: "POST",
        body: JSON.stringify(registrationCredentials),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 400) {
        const errors = (await response.json()) as {
          code: string;
          description: string;
        }[];

        const errorDescriptions = errors.map((e) => e.description);

        dispatch(authFailure(errorDescriptions));
      } else if (response.status === 200) {
        const parsedResponse = await response.json();
        const token = parsedResponse.token;

        // Store the token in localStorage
        localStorage.setItem("authToken", token);
        dispatch(authSuccess({ user, token }));
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(authFailure([err.message]));
      } else {
        dispatch(authFailure(["An unexpected error occurred."]));
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleRegister} className={styles.form}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
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
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          placeholder="Password"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onBlur={handleConfirmPasswordBlur}
          className={styles.input}
          placeholder="Confirm password"
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
        {errors?.length &&
          errors.map((error) => (
            <p
              className={styles.error}
              key={error}
              style={{ margin: "0.2rem 0" }}
            >
              {error}
            </p>
          ))}
      </form>
    </div>
  );
};
