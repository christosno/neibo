import { useQuery } from "@tanstack/react-query";
import { getUserTours, UserTour } from "@/services/tours/get-user-tours";

export const useGetUserTours = (isAuthenticated: boolean) => {
  const result = useQuery({
    queryKey: ["user-tours"],
    queryFn: getUserTours,
    enabled: isAuthenticated,
  });

  const tours: UserTour[] = result.data?.data ?? [];

  return {
    tours,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
};
