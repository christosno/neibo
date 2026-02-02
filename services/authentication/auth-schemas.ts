import { z } from "zod";

export const AuthenticationServiceResponseBaseSchema = z.object({
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

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const AuthenticationServiceResponseSchema =
  AuthenticationServiceResponseBaseSchema.extend({
    user: UserSchema,
  });

export type AuthenticationServiceResponse = z.infer<
  typeof AuthenticationServiceResponseSchema
>;

export const isAuthenticationServiceResponse = (
  input: unknown
): input is AuthenticationServiceResponse => {
  return AuthenticationServiceResponseSchema.safeParse(input).success;
};
