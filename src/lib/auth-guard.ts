/**
 * Auth guards consumed by TanStack Router routes via `beforeLoad`.
 *
 * Behaviour mirrors the legacy `<PrivateRoute>` / `<PublicRoute>` wrappers but
 * runs *before* the route renders — no flash of an unauthorised UI, and the
 * redirect target lives in one place instead of being duplicated across two
 * wrapper components.
 *
 * Pass the Redux `store` in via the router context (see `src/main.tsx`) and
 * invoke from a route's `beforeLoad`:
 *
 * ```ts
 * export const Route = createFileRoute('/admin/_admin/private')({
 *   beforeLoad: ({ context, location }) =>
 *     authGuard.private(context.store, 'admin', location.href),
 * });
 * ```
 */
import { redirect } from '@tanstack/react-router';

import type { RootState } from '@/store';
import { ADMIN_ROUTES, CREATOR_ROUTES } from '@/utils/constants/routes';

export type GuardRole = 'admin' | 'creator';

const LOGIN_FOR_ROLE: Record<GuardRole, string> = {
  admin: ADMIN_ROUTES.login,
  creator: CREATOR_ROUTES.login,
};

const HOME_FOR_ROLE: Record<GuardRole, string> = {
  admin: ADMIN_ROUTES.dashboard,
  creator: CREATOR_ROUTES.dashboard,
};

type StoreLike = { getState: () => RootState };

function readAuth(store: StoreLike) {
  const { isAuthenticated, role } = store.getState().auth;
  return { isAuthenticated, role: role as GuardRole | null };
}

export const authGuard = {
  /**
   * Use for routes that require an authenticated user matching `role`.
   * - Not signed in → bounce to the role's login (carries `from` for
   *   post-login redirect, replacing the old `state={{ from: location }}`
   *   pattern).
   * - Signed in as the wrong role → bounce to that role's home so the user
   *   isn't trapped in a workspace they don't own.
   */
  private(store: StoreLike, role: GuardRole, from?: string) {
    const { isAuthenticated, role: actualRole } = readAuth(store);

    if (!isAuthenticated) {
      throw redirect({
        to: LOGIN_FOR_ROLE[role],
        search: { from },
      });
    }

    if (actualRole && actualRole !== role) {
      throw redirect({ to: HOME_FOR_ROLE[actualRole] });
    }
  },

  /**
   * Use for routes that should only be reachable when the user is *not*
   * authenticated as `role` (e.g. login pages).
   * - Signed in as the wrong role → send them to their actual home so they
   *   can keep working in their own workspace.
   * - Signed in as this role → send them to this role's home (already done).
   */
  public(store: StoreLike, role: GuardRole) {
    const { isAuthenticated, role: actualRole } = readAuth(store);

    if (isAuthenticated && actualRole && actualRole !== role) {
      throw redirect({ to: HOME_FOR_ROLE[actualRole] });
    }

    if (isAuthenticated && actualRole === role) {
      throw redirect({ to: HOME_FOR_ROLE[role] });
    }
  },
};