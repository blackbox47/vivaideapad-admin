/**
 * Listens for `sessionExpired` actions and force-navigates to the appropriate
 * login page. Runs once at app boot, outside the React tree, so it survives
 * across route transitions and component unmounts.
 *
 * `customFetch` dispatches `sessionExpired` whenever the access cookie is
 * rejected AND a follow-up `/auth/refresh` also fails (401 — covers both
 * expired and replay-revoked sessions). We catch that here and bounce the
 * user to the role-appropriate login screen.
 *
 * The route's own `beforeLoad` guard also redirects unauthenticated users,
 * but only when they next navigate. This subscriber makes the redirect
 * immediate, even if the user is idle on the page.
 *
 * Implementation note: we detect the `true → false` transition ourselves
 * because `store.subscribe` does not expose the action that triggered the
 * state change. We track the previous `isAuthenticated` value across calls.
 */
import type { Store } from '@reduxjs/toolkit';

import { ADMIN_ROUTES, CREATOR_ROUTES } from '@/utils/constants/routes';

interface AuthSliceShape {
  isAuthenticated: boolean;
  role: 'admin' | 'creator' | null;
}

/**
 * Minimal router shape we use. Avoids importing the full generic `Router`
 * type from TanStack (which requires several generics to instantiate).
 */
interface RouterLike {
  state: { location: { pathname: string } };
  navigate: (opts: { to: string; replace?: boolean }) => Promise<unknown>;
}

export function startSessionExpiredListener(
  store: Store,
  router: RouterLike,
): () => void {
  // Capture initial state so we don't fire on the first subscribe tick
  // (which fires once at registration, before any action).
  let previousIsAuth = (
    store.getState() as { auth: AuthSliceShape }
  ).auth.isAuthenticated;

  let inFlight = false;

  return store.subscribe(() => {
    const current = (store.getState() as { auth: AuthSliceShape }).auth;
    const wasAuth = previousIsAuth;
    previousIsAuth = current.isAuthenticated;

    // Only react to the true → false transition; ignore everything else
    // (initial mount, false → true on login, repeated false → false from the
    // rootReducer reset cascading multiple subscribers).
    if (wasAuth && !current.isAuthenticated && !inFlight) {
      inFlight = true;
      const onCreatorRoute = router.state.location.pathname.startsWith(
        CREATOR_ROUTES.dashboard,
      );
      const dest = onCreatorRoute ? CREATOR_ROUTES.login : ADMIN_ROUTES.login;
      void router.navigate({ to: dest, replace: true }).finally(() => {
        inFlight = false;
      });
    }
  });
}