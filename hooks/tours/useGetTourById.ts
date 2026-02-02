import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTourById, TourDetail } from "@/services/tours/get-tour-by-id";
import { GetToursResponse } from "@/services/tours/get-tours";

export const useGetTourById = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["tour", id],
    queryFn: () => getTourById(id!),
    enabled: !!id,
    initialData: () => {
      // Try to find the tour in the cached list data
      const toursCache = queryClient.getQueryData<{
        pages: { data: GetToursResponse["data"] }[];
      }>(["tours"]);

      if (!toursCache) return undefined;

      const cachedTour = toursCache.pages
        .flatMap((page) => page.data.walks)
        .find((tour) => tour.id === id);

      if (!cachedTour) return undefined;

      // Return partial data structure matching the response shape
      return {
        data: cachedTour as unknown as TourDetail,
      };
    },
    initialDataUpdatedAt: 0, // Forces background refetch for full data
  });

  const tour: TourDetail | null = result.data?.data ?? null;

  return {
    tour,
    isLoading: result.isLoading && !result.data, // Not loading if we have initial data
    isFetching: result.isFetching, // True when refetching in background
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
};
