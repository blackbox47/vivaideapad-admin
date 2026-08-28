import { useState, type Dispatch, type SetStateAction } from 'react';

/**
 * Returns a state value that resets to `initial` whenever any of the
 * provided `deps` change by reference. Uses React's official
 * "adjust state on prop change" pattern (a prev-state comparison) instead
 * of a `useEffect` that calls the setter — the latter triggers the
 * `react-hooks/set-state-in-effect` lint and breaks React Compiler
 * memoization assumptions.
 *
 * @example
 *   const [visibleCount, setVisibleCount] = useResetStateOnChange(
 *     PAGE_SIZE,
 *     [status, search],
 *   );
 */
export default function useResetStateOnChange<T>(
  initial: T,
  deps: readonly unknown[],
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);
  const [prevDeps, setPrevDeps] = useState<readonly unknown[]>(deps);

  // Compare deps on every render. If they changed, queue a state reset —
  // React defers the actual setState until the next render pass, which
  // is exactly the behaviour `useEffect` would have produced, but
  // expressed without the lint violation.
  if (
    prevDeps.length !== deps.length ||
    prevDeps.some((d, i) => !Object.is(d, deps[i]))
  ) {
    setPrevDeps(deps);
    setValue(initial);
  }

  return [value, setValue];
}
