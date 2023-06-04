import { ErrorType } from "../constants/errors";
import { ErrorMessages } from "../types/ErrorMessages";

export const handleError = (error: Error | unknown): ErrorMessages => {
  let errorMessages: ErrorMessages;
  if (error instanceof Error) {
    errorMessages = [error.message];
  } else if (typeof error === "string") {
    errorMessages = [error];
  } else {
    errorMessages = [ErrorType.Unknown];
  }
  return errorMessages;
};
