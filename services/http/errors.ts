import { AxiosError, isAxiosError } from "axios";

export type AxiosUnauthorizedError = AxiosError & { response: { status: 401 } };
export const isUnauthorizedError = (
  error: unknown
): error is AxiosUnauthorizedError => {
  return isAxiosError(error) && error?.response?.status === 401;
};

type AxiosForbiddenError = AxiosError & { response: { status: 403 } };
export const isRefreshTokenExpiredError = (
  error: unknown
): error is AxiosForbiddenError =>
  isAxiosError(error) && error.response?.status === 403;
