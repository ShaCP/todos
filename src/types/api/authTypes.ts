import { ErrorMessages } from "../ErrorMessages";
import { User } from "../User";

export interface RegisterCredentials {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  errors: ErrorMessages;
  authToken: string | null;
}

export interface SuccessfulLoginResponse {
  userName: string;
  token: string;
  email: string;
}

export interface UserAndToken {
  user: User;
  token: string;
}
