/**
 * TanStack Router–compatible re-implementation of react-router-dom's
 * `useSearchParams()` hook. Returns the current URL search string as a
 * `URLSearchParams` instance plus a setter that pushes the next string back
 * through the router, mirroring the call sites that previously read
 * `searchParams.get('…')` and called `setSearchParams(next, { replace })`.
 *
 * Use this only for routes that haven't opted in to TanStack's
 * `validateSearch` schema — those should use `useSearch({ from })` directly.
 */
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';

/**
 * Reads the current location's raw query string and exposes a setter.
 *
 * @example
 *   const [params, setParams] = useTanstackSearchParams();
 *   const search = params.get('q') ?? '';
 *   const setSearch = (next: string) => {
 *     const nextParams = new URLSearchParams(params);
 *     if (next.trim()) nextParams.set('q', next);
 *     else nextParams.delete('q');
 *     setParams(nextParams, { replace: true });
 *   };
 */
export function useTanstackSearchParams(): [
  URLSearchParams,
  (
    next: URLSearchParams | string | ((prev: URLSearchParams) => URLSearchParams),
    options?: { replace?: boolean },
  ) => void,
] {
  const navigate = useNavigate();
  const location = useLocation({ select: (l) => l.searchStr });

  const searchParams = useMemo(
    () => new URLSearchParams(location ?? ''),
    [location],
  );

  const setSearchParams = useCallback<
    (
      next: URLSearchParams | string | ((prev: URLSearchParams) => URLSearchParams),
      options?: { replace?: boolean },
    ) => void
  >(
    (next, options) => {
      const current = new URLSearchParams(location ?? '');
      const computed =
        typeof next === 'function'
          ? next(current)
          : typeof next === 'string'
            ? new URLSearchParams(next)
            : next;

      // Build the next URL from the current pathname plus the new search.
      // We read `pathname` from the global window so this helper doesn't need
      // to subscribe to location changes beyond the query string.
      const pathname =
        typeof window !== 'undefined' ? window.location.pathname : '/';
      const query = computed.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      navigate({ to: href, replace: options?.replace });
    },
    [navigate, location],
  );

  return [searchParams, setSearchParams];
}