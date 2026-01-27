import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type TourTheme = (typeof TOUR_THEMES)[number];
export const TOUR_THEMES = [
  "History",
  "Food & drinks",
  "Art & architecture",
  "Hidden gems",
  "Nightlife",
] as const;

export type TourFormData = z.infer<typeof tourFormSchema>;
const tourFormSchema = z.object({
  city: z.string().min(1, "City is required"),
  neighborhood: z.string().optional(),
  duration: z.number().min(5, "Duration is required"),
  tourTheme: z.enum(TOUR_THEMES),
  startLocation: z.string().optional(),
  language: z.string().optional(),
});

const defaultValues: TourFormData = {
  city: "",
  neighborhood: "",
  duration: 60,
  tourTheme: "History",
  startLocation: "",
  language: "",
};

export const useTourForm = () => {
  return useForm<TourFormData>({
    defaultValues,
    resolver: zodResolver(tourFormSchema),
    mode: "onTouched",
  });
};
