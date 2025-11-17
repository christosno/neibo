import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Paths, File } from "expo-file-system";

export type PlantType = {
  id: string;
  name: string;
  wateringFrequencyDays: number;
  lastWateredAtTimestamp?: number;
  imageUri?: string;
};

type PlantsState = {
  nextId: number;
  plants: PlantType[];
  addPlant: ({
    name,
    wateringFrequencyDays,
    imageUri,
  }: {
    name: string;
    wateringFrequencyDays: number;
    imageUri?: string;
  }) => void;
  removePlant: (plantId: string) => void;
  waterPlant: (plantId: string) => void;
};

export const usePlantStore = create(
  persist<PlantsState>(
    (set) => ({
      plants: [],
      nextId: 1,
      addPlant: async ({
        name,
        wateringFrequencyDays,
        imageUri,
      }: {
        name: string;
        wateringFrequencyDays: number;
        imageUri?: string;
      }) => {
        const documentUri = Paths.document?.uri ?? null;
        const savedImageUri = documentUri
          ? `${documentUri}${new Date().getTime()}-${
              imageUri?.split("/").slice(-1)[0] ?? ""
            }`
          : imageUri;

        if (imageUri && savedImageUri) {
          try {
            new File(imageUri).copy(new File(savedImageUri));
          } catch (error) {
            console.warn(
              "Failed to copy plant image into documents directory",
              error
            );
          }
        }

        return set((state) => {
          return {
            ...state,
            nextId: state.nextId + 1,
            plants: [
              {
                id: String(state.nextId),
                name,
                wateringFrequencyDays,
                imageUri: imageUri ? savedImageUri : undefined,
              },
              ...state.plants,
            ],
          };
        });
      },
      removePlant: (plantId: string) => {
        return set((state) => {
          return {
            ...state,
            plants: state.plants.filter((plant) => plant.id !== plantId),
          };
        });
      },
      waterPlant: (plantId: string) => {
        return set((state) => {
          return {
            ...state,
            plants: state.plants.map((plant) => {
              if (plant.id === plantId) {
                return {
                  ...plant,
                  lastWateredAtTimestamp: Date.now(),
                };
              }
              return plant;
            }),
          };
        });
      },
    }),
    {
      name: "neibo-plants-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const selectPlantById = (plantId: string) => (state: PlantsState) => {
  return state.plants.find((plant) => plant.id === plantId);
};
