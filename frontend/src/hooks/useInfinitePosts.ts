import { useCallback, useEffect, useState } from "react";
import { useGetPostsPaginatedQuery } from "../services/api";

interface UseInfinitePostsOptions {
  limit?: number;
}

export const useInfinitePosts = ({
  limit = 10,
}: UseInfinitePostsOptions = {}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);

  const {
    data: postsData,
    isLoading,
    isFetching,
    error,
  } = useGetPostsPaginatedQuery({
    page: currentPage,
    limit,
  });

  // Update posts when new data arrives
  useEffect(() => {
    if (postsData) {
      if (currentPage === 1) {
        // First page - replace all posts
        setAllPosts(postsData.posts);
      } else {
        // Subsequent pages - append to existing posts
        setAllPosts((prev) => [...prev, ...postsData.posts]);
      }

      // Update hasNextPage based on pagination info
      setHasNextPage(postsData.pagination.hasNext);
    }
  }, [postsData, currentPage]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage, isFetching]);

  const reset = useCallback(() => {
    setCurrentPage(1);
    setAllPosts([]);
    setHasNextPage(true);
  }, []);

  return {
    posts: allPosts,
    isLoading: isLoading && currentPage === 1,
    isFetchingMore: isFetching && currentPage > 1,
    hasNextPage,
    loadMore,
    reset,
    error,
  };
};
