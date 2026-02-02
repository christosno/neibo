import * as SecureStore from "expo-secure-store";
import { User } from "./auth-api";

export const ID_TOKEN_KEY = "token";
export const ID_REFRESH_TOKEN_KEY = "refreshToken";
export const USER_DATA_KEY = "userData";

type StoredAuthData = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
};

export const authData = {
  get: async (): Promise<StoredAuthData> => {
    const [token, refreshToken, userJson] = await Promise.all([
      SecureStore.getItemAsync(ID_TOKEN_KEY),
      SecureStore.getItemAsync(ID_REFRESH_TOKEN_KEY),
      SecureStore.getItemAsync(USER_DATA_KEY),
    ]);

    let user: User | null = null;
    if (userJson) {
      try {
        user = JSON.parse(userJson);
      } catch {
        user = null;
      }
    }

    return { token, refreshToken, user };
  },
  set: async ({
    token,
    refreshToken,
    user,
  }: {
    token: string;
    refreshToken: string;
    user?: User;
  }) => {
    const promises: Promise<void>[] = [
      SecureStore.setItemAsync(ID_TOKEN_KEY, token),
      SecureStore.setItemAsync(ID_REFRESH_TOKEN_KEY, refreshToken),
    ];

    if (user) {
      promises.push(SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user)));
    }

    await Promise.all(promises);
  },
  remove: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(ID_TOKEN_KEY),
      SecureStore.deleteItemAsync(ID_REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_DATA_KEY),
    ]);
  },
};
