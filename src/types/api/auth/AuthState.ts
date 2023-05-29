import { User } from "../../User";


export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    errors: string[];
    authToken: string | null;
}
