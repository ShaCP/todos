import { Todo } from "../../features/todos/todosSlice";
import { ErrorMessages } from '../ErrorMessages';
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
  isLoading: boolean;
  errors: ErrorMessages;
  user: User | null;
  authToken: string | null;
}

export interface SuccessfulAuthResponse {
  userName: string;
  token: string;
  email: string;
  todos: Todo[];
}

export interface UserAndToken {
  user: User;
  token: string;
}

export interface ResponseResult {
  isError: boolean;
  errorMessages: ErrorMessages
}

export interface AuthResponseResult extends ResponseResult {
  data: SuccessfulAuthResponse | null;
}
