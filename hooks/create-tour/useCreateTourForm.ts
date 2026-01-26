import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const TOUR_TAGS = [
  // Theme-based
  "History",
  "Art",
  "Food",
  "Nature",
  "Architecture",
  "Nightlife",
  "Shopping",
  // Activity-based
  "Walking",
  "Cycling",
  "Photography",
  "Family-friendly",
  "Romantic",
] as const;

export type TourTag = (typeof TOUR_TAGS)[number];

const spotSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  reach_radius: z.number().optional(),
  positionOrder: z.number(),
  imageUrls: z.array(z.string()).optional(),
});

export type SpotFormData = z.infer<typeof spotSchema>;

const createTourSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  coverImageUrl: z.string().optional(),
  duration_estimate: z.number().optional(),
  distance_estimate: z.number().optional(),
  isPublic: z.boolean().optional(),
  tagIds: z.array(z.string()).optional(),
  spots: z.array(spotSchema),
});

export type CreateTourFormData = z.infer<typeof createTourSchema>;

const defaultValues: CreateTourFormData = {
  name: "",
  description: "",
  coverImageUrl: "",
  duration_estimate: undefined,
  distance_estimate: undefined,
  isPublic: true,
  tagIds: [],
  spots: [],
};

export const useCreateTourForm = () => {
  return useForm<CreateTourFormData>({
    defaultValues,
    resolver: zodResolver(createTourSchema),
    mode: "onTouched",
  });
};
