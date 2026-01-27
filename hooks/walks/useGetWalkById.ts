import { useQuery } from "@tanstack/react-query";
import { getWalkById, WalkDetail } from "@/services/tours/get-walk-by-id";

export const useGetWalkById = (id: string | undefined) => {
  const result = useQuery({
    queryKey: ["walk", id],
    queryFn: () => getWalkById(id!),
    enabled: !!id,
  });

  const walk: WalkDetail | null = result.data?.data ?? null;

  return {
    walk,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
};
