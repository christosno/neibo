import { login, signUp, User } from "@/services/authentication/auth-api";
import { authData } from "@/services/authentication/auth-data-storage";
import { setSessionExpiredCallback } from "@/services/http/http";
import { create } from "zustand";

type Auth = {
  user: User | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  setIsGuest: (isGuest: boolean) => void;
  isGuest: boolean;
  isAuthenticated: boolean;
};

export const useAuth = create<Auth>((set) => ({
  user: null,
  isInitializing: true,
  isGuest: false,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialize: async () => {
    try {
      // Register callback for session expiration (refresh token invalid)
      setSessionExpiredCallback(() => {
        set({ user: null, isAuthenticated: false, isGuest: false, error: null });
      });

      const { token, user } = await authData.get();

      if (token && user) {
        set({ user, isAuthenticated: true, isGuest: false });
      }
    } catch (error) {
      console.log("Auth initialization error:", error);
    } finally {
      set({ isInitializing: false });
    }
  },
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await login(email, password);
      await authData.set({
        token: response.token,
        refreshToken: response.refreshToken,
        user: response.user,
      });
      set({ user: response.user, isGuest: false, isAuthenticated: true });
    } catch (error) {
      console.log("Login error:", error);
      set({ error: "An unexpected error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
  signUp: async (email: string, password: string, username: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await signUp(email, password, username);
      await authData.set({
        token: response.token,
        refreshToken: response.refreshToken,
        user: response.user,
      });
      set({ user: response.user, isGuest: false, isAuthenticated: true });
    } catch (error) {
      console.log("SignUp error:", error);
      set({ error: "An unexpected error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    await authData.remove();
    set({ user: null, error: null, isAuthenticated: false, isGuest: false });
  },
  continueAsGuest: () => {
    set({ user: null, error: null, isGuest: true, isAuthenticated: false });
  },
  setIsGuest: (isGuest: boolean) => {
    set({ isGuest });
  },
}));
