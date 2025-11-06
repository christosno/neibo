import { create } from "zustand";

type UserStore = {
  hasFinishedOnboarding: boolean;
  toggleOnboarding: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  hasFinishedOnboarding: false,
  toggleOnboarding: () =>
    set((state) => ({ hasFinishedOnboarding: !state.hasFinishedOnboarding })),
}));
