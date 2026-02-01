import { useInfiniteQuery } from "@tanstack/react-query";
import { getTours, type Tour } from "@/services/tours/get-tours";

export const useGetTours = () => {
  const result = useInfiniteQuery({
    queryKey: ["tours"],
    queryFn: ({ pageParam }) => getTours({ page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.pagination.hasNext) {
        return lastPage.data.pagination.page + 1;
      }
      return undefined;
    },
  });

  const tours: Tour[] =
    result.data?.pages.flatMap((page) => page.data.walks) ?? [];

  return {
    tours,
    isLoading: result.isLoading,
    isFetchingNextPage: result.isFetchingNextPage,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
  };
};
