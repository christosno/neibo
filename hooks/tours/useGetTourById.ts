import { useQuery } from "@tanstack/react-query";
import { getTourById, TourDetail } from "@/services/tours/get-tour-by-id";

export const useGetTourById = (id: string | undefined) => {
  const result = useQuery({
    queryKey: ["tour", id],
    queryFn: () => getTourById(id!),
    enabled: !!id,
  });

  const tour: TourDetail | null = result.data?.data ?? null;

  return {
    tour,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
};
