import { create } from "zustand";

type Auth = {
  user: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => void;
  signUp: (email: string, password: string, username: string) => void;
  logout: () => void;
};

export const useAuth = create<Auth>((set) => ({
  user: null,
  initializing: true,
  isLoading: false,
  error: null,
  login: (email: string, password: string) => {
    set({ user: email });
  },
  signUp: (email: string, password: string, username: string) => {
    set({ user: email });
  },
  logout: () => {
    set({ user: null });
  },
}));
