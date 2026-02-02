import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const reviewSchema = z.object({
  stars: z
    .number()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  textReview: z.string().optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export const useReviewForm = () => {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      stars: 0,
      textReview: "",
    },
  });

  return form;
};
