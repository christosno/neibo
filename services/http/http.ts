import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  Method,
} from "axios";
import { authData } from "../authentication/auth-data-storage";
import {
  AxiosUnauthorizedError,
  isRefreshTokenExpiredError,
  isUnauthorizedError,
} from "./errors";
import { isAuthenticationServiceResponseBase } from "../authentication/auth-schemas";
import Constants from "expo-constants";

// TODO: Add environment variables
const BASE_URL = Constants.expoConfig?.extra?.BASE_URL as string | undefined;

const createAxiosInstance = (baseURL?: string) => {
  const axiosInstance = axios.create({
    ...defaultAxiosConfig,
    baseURL,
  });
  axiosInstance.interceptors.request.use(addAuthorizationHeader);
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (isUnauthorizedError(error)) return handleUnauthorizedError(error);
      throw error;
    }
  );
  return axiosInstance;
};

const addAuthorizationHeader = async (config: InternalAxiosRequestConfig) => {
  const { token } = await authData.get();
  if (token) {
    config.headers.setAuthorization(`Bearer ${token}`);
  }
  return config;
};

/**
 * Handles a 401 error by refreshing the token and retrying the request.
 * Refreshing token logic is taken from here:
 * https://andreyka26.com/handling-refreshing-token-on-multiple-requests-using-react
 *
 * @param error
 */
const handleUnauthorizedError = async (error: AxiosUnauthorizedError) => {
  const config = error.config!;

  const result = await refreshToken();
  config.headers.setAuthorization(`Bearer ${result.token}`);

  // Retry the initial request with the updated token
  return axios(config);
};

const getDefaultHeaders = () => {
  const headers = new AxiosHeaders();
  headers.setContentType("application/json");
  headers.set("Client-Type", "APP");

  return headers;
};

export const defaultAxiosConfig = {
  headers: getDefaultHeaders(),
  withCredentials: false,
};

const plainAxiosInstance = axios.create({
  ...defaultAxiosConfig,
  baseURL: BASE_URL,
});
const authAxiosInstance = createAxiosInstance(BASE_URL);

type Options<T> = {
  url: string;
  method: Method;
  validator: (input: unknown) => input is T;
} & OptionalAxiosConfig;

type OptionalAxiosConfig = Partial<
  Pick<AxiosRequestConfig, "params" | "data" | "headers" | "timeout">
>;

const getRequestFunction =
  (axiosInstance: AxiosInstance) =>
  async <T>(options: Options<T>) => {
    const response = await axiosInstance.request(options);
    return validateResponse(response.data, options);
  };

const validateResponse = <T>(data: T, options: Options<T>): T => {
  const { validator } = options;
  const isValidResponse = validator(data);
  if (isValidResponse) return data;
  throw new Error("Validation Error");
};

export const http: Record<
  "basic" | "auth",
  <T>(config: Options<T>) => Promise<T>
> = {
  basic: getRequestFunction(plainAxiosInstance),
  auth: getRequestFunction(authAxiosInstance),
};

let refreshingTokenPromise: ReturnType<typeof refreshTokenFn> | undefined;
/**
 * Will perform an update token request to the auth service.
 *
 * This function is memoized which means that if it is called multiple times while there is an ongoing request to refresh the token,
 * the same promise will be returned to all callers.
 *
 * This is to prevent multiple calls to the auth service when multiple requests fail with a 401.
 */

export const refreshToken = () => {
  // the trick here, that `refreshingTokenPromise` is global,
  // e.g. 2 expired requests will get and await the same promise, meaning only one call to refresh token will be made
  if (!refreshingTokenPromise) {
    refreshingTokenPromise = refreshTokenFn();
  }
  return refreshingTokenPromise;
};

const refreshTokenFn = async () => {
  try {
    const url = `${BASE_URL}/auth/refresh`;
    const { refreshToken } = await authData.get();
    const responseData = await http.basic({
      url,
      method: "POST",
      data: {
        refreshToken: refreshToken,
      },
      validator: isAuthenticationServiceResponseBase,
    });

    await authData.set({
      token: responseData.token,
      refreshToken: responseData.refreshToken,
    });
    return responseData;
  } catch (error) {
    console.log("🚀 ~ refreshTokenFn ~ error:", error);
    if (isRefreshTokenExpiredError(error) || isUnauthorizedError(error)) {
      // If we fail to refresh the token, trigger a log out through zustand
    }
  } finally {
    // Reset the global promise so that subsequent requests will be able refreshToken again
    refreshingTokenPromise = undefined;
  }

  throw new Error("Refresh Token Error");
};
