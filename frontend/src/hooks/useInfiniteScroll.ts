import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetching: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetching,
  onLoadMore,
  threshold = 100,
}: UseInfiniteScrollOptions) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
  }, [threshold]);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetching) {
      onLoadMore();
    }
  }, [isIntersecting, hasNextPage, isFetching, onLoadMore]);

  return { sentinelRef };
};
