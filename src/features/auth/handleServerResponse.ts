import { User } from "../../types/User";
import { ErrorResponse } from "../../types/api/ErrorResponse";
import { UserAndToken } from "../../types/api/authTypes";
import { SuccessfulLoginResponse } from "../../types/api/authTypes";

export const handleServerResponse = async (
    response: Response
): Promise<UserAndToken> => {
    const parsedResponse = await response.json();
    if (response.ok) {
        const { userName, email, token } = parsedResponse as SuccessfulLoginResponse;
        const user: User = { userName, email };

        // Store the token in localStorage
        localStorage.setItem("authToken", token);
        return { user, token };
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
