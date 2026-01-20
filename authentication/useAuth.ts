import { login, signUp, User } from "@/services/authentication/auth-api";
import { authData } from "@/services/authentication/auth-data-storage";
import { create } from "zustand";

type Auth = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => void;
  signUp: (email: string, password: string, username: string) => void;
  logout: () => void;
  continueAsGuest: () => void;
  isGuest: boolean;
  isAuthenticated: boolean;
};

export const useAuth = create<Auth>((set) => ({
  user: null,
  initializing: true,
  isGuest: false,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await login(email, password);
      await authData.set({
        token: response.token,
        refreshToken: response.refreshToken,
      });
      set({ user: response.user, isGuest: false, isAuthenticated: true });
    } catch (error) {
      console.log("🚀 ~ error:", error);
      //TODO: Handle the error from backend and set the error message
      set({ error: "An unexpected error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
  signUp: async (email: string, password: string, username: string) => {
    try {
      set({ isLoading: true });
      const response = await signUp(email, password, username);
      await authData.set({
        token: response.token,
        refreshToken: response.refreshToken,
      });
      set({ user: response.user, isGuest: false, isAuthenticated: true });
    } catch (error) {
      console.log("🚀 ~ error:", error);
      //TODO: Handle the error from backend and set the error message
      set({ error: "An unexpected error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    set({ user: null, error: null, isAuthenticated: false });
  },
  continueAsGuest: () => {
    set({ user: null, error: null, isGuest: true, isAuthenticated: false });
  },
}));
