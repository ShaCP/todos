import React from "react";
import styles from "./ErrorDisplay.module.css";
import { ErrorMessages } from "../../../../types/ErrorMessages";

type ErrorProps = {
  errors: ErrorMessages;
};

const ErrorDisplay: React.FC<ErrorProps> = ({ errors }) => {
  return (
    <div className={styles.errorContainer}>
      {errors.map((error) => (
        <p className={styles.error} key={error}>
          {error}
        </p>
      ))}
    </div>
  );
};

export { ErrorDisplay };
