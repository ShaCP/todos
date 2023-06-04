import { ErrorMessages } from "../../types/ErrorMessages";
import { ErrorResponse } from "../../types/api/ErrorResponse";
import {
  AuthResponseResult,
  SuccessfulAuthResponse
} from "../../types/api/authTypes";

export const handleServerResponse = async (
  response: Response
): Promise<AuthResponseResult> => {
  const result: AuthResponseResult = {
    isError: false,
    data: null,
    errorMessages: []
  };

  const parsedResponse: unknown = await response.json();
  if (response.ok) {
    result.data = parsedResponse as SuccessfulAuthResponse;
  } else {
    result.isError = true;
    result.errorMessages = handleErrorResponse(parsedResponse);
  }

  return result;
};

const handleErrorResponse = (responseWithErrors: unknown): ErrorMessages => {
  if (Array.isArray(responseWithErrors)) {
    const errorDescriptions = responseWithErrors.map((error: ErrorResponse) => {
      if (typeof error.description === "string" && error.description !== "") {
        return error.description;
      } else {
        return JSON.stringify(error);
      }
    });
    return errorDescriptions;
  } else {
    const error = responseWithErrors as ErrorResponse;
    if (typeof error.description === "string" && error.description !== "") {
      return [error.description];
    }

    return [JSON.stringify(responseWithErrors)];
  }
};
