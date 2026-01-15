import { create } from "zustand";
import { GenerateAiTourResponse } from "./generate-tour-with-ai/generate-ai-tour";

type AiTourStore = {
  tourData: GenerateAiTourResponse | null;
  setTourData: (tourData: GenerateAiTourResponse | null) => void;
};

export const useAiTourStore = create<AiTourStore>((set) => ({
  tourData: null,
  setTourData: (tourData) => set({ tourData }),
}));
