import { http } from "../http/http";
import {
  isAuthenticationServiceResponse,
  type AuthenticationServiceResponseBase,
  type AuthenticationServiceResponse,
  type User,
} from "./auth-schemas";

export type { AuthenticationServiceResponseBase, AuthenticationServiceResponse, User };
export { isAuthenticationServiceResponse };

export const login = async (email: string, password: string) => {
  return http.basic({
    url: "/auth/login",
    method: "POST",
    data: { email, password },
    validator: isAuthenticationServiceResponse,
  });
};

export const signUp = async (
  email: string,
  password: string,
  username: string
) => {
  return http.basic({
    url: "/auth/register",
    method: "POST",
    data: { email, password, username },
    validator: isAuthenticationServiceResponse,
  });
};
