import { useCallback, useEffect, useRef } from 'react';

interface UseOnScrollLoadMoreOptions {
  enabled: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  /** Start loading this many pixels before the sentinel reaches the fold. */
  rootMarginPx?: number;
}

function getScrollRoot(node: Element): Element | Window {
  let current = node.parentElement;

  while (current) {
    const { overflowY } = window.getComputedStyle(current);
    const canScroll =
      (overflowY === 'auto' || overflowY === 'scroll') &&
      current.scrollHeight > current.clientHeight + 1;

    if (canScroll) {
      return current;
    }

    current = current.parentElement;
  }

  return window;
}

function isNearBottom(root: Element | Window, offsetPx: number): boolean {
  if (root instanceof Window) {
    const scrolling = document.scrollingElement ?? document.documentElement;
    return (
      scrolling.scrollTop + window.innerHeight >=
      scrolling.scrollHeight - offsetPx
    );
  }

  return root.scrollTop + root.clientHeight >= root.scrollHeight - offsetPx;
}

/**
 * Calls `onLoadMore` when the sentinel is near the visible edge of its
 * scroll container. Uses IntersectionObserver plus a scroll fallback so
 * nested or window-scrolled layouts both trigger.
 */
export default function useOnScrollLoadMore({
  enabled,
  isLoading,
  onLoadMore,
  rootMarginPx = 240,
}: UseOnScrollLoadMoreOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    inFlightRef.current = isLoading;
  }, [isLoading]);

  const tryLoad = useCallback(() => {
    if (!enabled || inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    onLoadMore();
  }, [enabled, onLoadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!enabled || !sentinel) {
      return;
    }

    const scrollRoot = getScrollRoot(sentinel);
    const observerRoot = scrollRoot instanceof Window ? null : scrollRoot;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryLoad();
        }
      },
      {
        root: observerRoot,
        rootMargin: `${rootMarginPx}px 0px`,
        threshold: 0,
      },
    );
    observer.observe(sentinel);

    const onScroll = () => {
      if (isNearBottom(scrollRoot, rootMarginPx)) {
        tryLoad();
      }
    };

    scrollRoot.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      scrollRoot.removeEventListener('scroll', onScroll);
    };
  }, [enabled, rootMarginPx, tryLoad]);

  return sentinelRef;
}
