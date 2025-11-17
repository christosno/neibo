import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

type UserStore = {
  hasFinishedOnboarding: boolean;
  toggleOnboarding: () => void;
};

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      hasFinishedOnboarding: false,
      toggleOnboarding: () =>
        set((state) => ({
          hasFinishedOnboarding: !state.hasFinishedOnboarding,
        })),
    }),
    {
      name: "neibo-user-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
