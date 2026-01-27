import { TourFormData } from "@/hooks/generate-tour-with-ai/useTourForm";
import { http } from "@/services/http/http";
import { z } from "zod";

export const generateAiTour = (body: TourFormData) => {
  return http.basic({
    url: "/ai/create-tour",
    method: "POST",
    data: body,
    validator: isGenerateAiTourResponse,
  });
};

export type GenerateAiTourResponse = z.infer<
  typeof GenerateAiTourResponseSchema
>;
const GenerateAiTourResponseSchema = z.object({
  name: z.string(),
  description: z.string(),
  duration_estimate: z.number().nullable().optional(),
  distance_estimate: z.number().nullable().optional(),
  spots: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      search_query: z.string(),
      full_address: z.string(),
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
      positionOrder: z.number(),
    })
  ),
});

export const isGenerateAiTourResponse = (
  input: unknown
): input is GenerateAiTourResponse => {
  return GenerateAiTourResponseSchema.safeParse(input).success;
};
