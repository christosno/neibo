import { z } from "zod";
import { http } from "../http/http";

const AuthenticationServiceResponseBaseSchema = z.object({
  message: z.string(),
  token: z.string(),
  refreshToken: z.string(),
});

export type AuthenticationServiceResponseBase = z.infer<
  typeof AuthenticationServiceResponseBaseSchema
>;

export const isAuthenticationServiceResponseBase = (
  input: unknown
): input is AuthenticationServiceResponseBase => {
  return AuthenticationServiceResponseBaseSchema.safeParse(input).success;
};

export type User = z.infer<typeof UserSchema>;
const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.string().optional(),
});

export type AuthenticationServiceResponse = z.infer<
  typeof AuthenticationServiceResponseSchema
>;
export const AuthenticationServiceResponseSchema =
  AuthenticationServiceResponseBaseSchema.extend({
    user: UserSchema,
  });

export const isAuthenticationServiceResponse = (
  input: unknown
): input is AuthenticationServiceResponse => {
  return AuthenticationServiceResponseSchema.safeParse(input).success;
};

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
