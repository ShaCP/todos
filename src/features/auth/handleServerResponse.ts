import { ErrorResponse } from "../../types/api/ErrorResponse";
import { SuccessfulAuthResponse } from "../../types/api/authTypes";

export const handleServerResponse = async (
  response: Response
): Promise<SuccessfulAuthResponse> => {
  const parsedResponse = await response.json();
  if (response.ok) {
    return parsedResponse as SuccessfulAuthResponse;
  } else {
    if (parsedResponse instanceof Array) {
      const errors = parsedResponse as ErrorResponse[];
      const errorDescriptions = errors.map((e) => e.description);
      return Promise.reject(errorDescriptions);
    } else {
      const error = parsedResponse as ErrorResponse;
      return Promise.reject(error.description);
    }
  }
};
