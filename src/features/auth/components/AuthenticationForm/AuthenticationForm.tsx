import React, { FC, useState } from "react";
import styles from "./AuthenticationForm.module.css";
import { Login } from "../Login/Login";
import { Register } from "../Register/Register";
import globalStyles from "styles/global.module.css";
import { useAppSelector } from "app/hooks";
import { ErrorDisplay } from "features/errorDisplay/components/ErrorDisplay/ErrorDisplay";

interface AuthenticationFormProps {}

const AuthenticationForm: FC<AuthenticationFormProps> = () => {
  const [showLogin, setShowLogin] = useState(true);
  const errors = useAppSelector((state) => state.auth.errors);

  return (
    <div>
      {showLogin ? <Login /> : <Register />}
      <p>
        {showLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={() => setShowLogin((prev) => !prev)}
          className={globalStyles.buttonLink}
        >
          {showLogin ? "Register" : "Log in"}
        </button>
      </p>
      {!!errors.length && <ErrorDisplay errors={errors} />}
    </div>
  );
};

export default AuthenticationForm;
