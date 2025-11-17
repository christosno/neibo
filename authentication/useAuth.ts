import { create } from "zustand";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

type Auth = {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  logout: () => Promise<void>;
};

export const useAuth = create<Auth>((set) => ({
  user: null,
  initializing: true,
  isLoading: false,
  error: null,
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      set({ user: userCredential.user, isLoading: false, initializing: false });
    } catch (error: any) {
      set({
        error: error?.message,
        isLoading: false,
      });
      alert(error?.message);
    }
  },
  signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      set({ user: userCredential.user, isLoading: false, initializing: false });
    } catch (error: any) {
      set({
        error: error?.message,
        isLoading: false,
      });
      console.log("🚀 ~ signUp: ~ error:", error);
      alert(error?.message);
    }
  },
  setUser: (user: FirebaseAuthTypes.User | null) => {
    set({ user, initializing: false });
  },
  logout: async () => {
    try {
      await auth().signOut();
      set({ user: null, isLoading: false, error: null });
    } catch (error: any) {
      set({ user: null, isLoading: false, error: error?.message });
    }
  },
}));
