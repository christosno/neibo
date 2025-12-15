import * as SecureStore from "expo-secure-store";

export const ID_TOKEN_KEY = "token";
export const ID_REFRESH_TOKEN_KEY = "refreshToken";

export const authData = {
  get: async () => {
    const token = await SecureStore.getItemAsync(ID_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(ID_REFRESH_TOKEN_KEY);
    return { token, refreshToken };
  },
  set: async ({
    token,
    refreshToken,
  }: {
    token: string;
    refreshToken: string;
  }) => {
    await SecureStore.setItemAsync(ID_TOKEN_KEY, token);
    await SecureStore.setItemAsync(ID_REFRESH_TOKEN_KEY, refreshToken);
  },
  remove: async () => {
    await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
    await SecureStore.deleteItemAsync(ID_REFRESH_TOKEN_KEY);
  },
};
