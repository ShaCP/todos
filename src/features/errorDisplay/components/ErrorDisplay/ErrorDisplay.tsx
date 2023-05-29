import React from "react";
import styles from "./ErrorDisplay.module.css";
import { ErrorMessage } from "../../../../types/ErrorMessage";

type ErrorProps = {
  errors: ErrorMessage[];
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
