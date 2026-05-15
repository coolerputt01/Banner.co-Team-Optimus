import { useState, useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollProps {
  loadMore: () => Promise<void>;
  hasMore: boolean;
  threshold?: number; // kept for API compatibility, unused internally
}

export const useInfiniteScroll = ({
  loadMore,
  hasMore,
}: UseInfiniteScrollProps) => {
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    async (direction: "up" | "down") => {
      if (direction === "down") {
        setCurrentIndex((prev) => prev + 1);
        if (hasMore && !loading) {
          setLoading(true);
          await loadMore();
          setLoading(false);
        }
      } else if (direction === "up") {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    },
    [hasMore, loading, loadMore],
  );

  // Touch handling for mobile swipe
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      touchEndY.current = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      const delta = touchStartY.current - touchEndY.current;
      if (Math.abs(delta) > 50) {
        handleScroll(delta > 0 ? "down" : "up");
      }
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleScroll]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); handleScroll("down"); }
      else if (e.key === "ArrowUp") { e.preventDefault(); handleScroll("up"); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleScroll]);

  return { currentIndex, loading, containerRef, handleScroll };
};
