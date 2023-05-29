import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../app/store";
import { register, clearErrors } from "../../authSlice";
import styles from "./Register.module.css";
import { ErrorDisplay } from "../../../errorDisplay/components/ErrorDisplay/ErrorDisplay";

export const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const dispatch: AppDispatch = useDispatch();
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

  useEffect(() => {
    if (confirmPassword?.length > 0 && confirmPassword !== password) {
      confirmPasswordRef.current?.setCustomValidity("Passwords do not match");
      confirmPasswordRef.current?.reportValidity();
    } else {
      confirmPasswordRef.current?.setCustomValidity("");
    }
  }, [confirmPassword, password]);

  useEffect(
    () => () => {
      dispatch(clearErrors());
    },
    []
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your logic here to connect with the backend
    // If successful, update the state with the user's information and auth token

    dispatch(
      register({
        userName,
        email,
        password,
        confirmPassword
      })
    );
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
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
          placeholder="Confirm password"
          required
          ref={confirmPasswordRef}
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
        {!!errors.length && <ErrorDisplay errors={errors} />}
      </form>
    </div>
  );
};
