import { useEffect } from 'react';

import { startAdminNotificationsStream } from '@/services/notifications/admin-notifications-stream';
import { startCreatorNotificationsStream } from '@/services/creator/creator-notifications-stream';
import { store } from '@/store';

interface Props {
  role: 'admin' | 'creator';
}

/**
 * Mounts the notification SSE stream for the lifetime of a protected layout.
 *
 * Why a component:
 *   - Lives inside the protected layout's render tree, so it auto-tears-down
 *     when the user leaves that layout (route transition away from the
 *     protected area).
 *   - Mirrors the lifecycle pattern of `session-expired-listener.ts`, but
 *     scoped to the React tree instead of the global `main.tsx`.
 *
 * Why `useEffect` with the role/store deps:
 *   - `role` is stable for the lifetime of the layout (admin vs creator is
 *     fixed by which layout mounted this component).
 *   - `store` is a singleton from `@/store`, but it's listed so the effect
 *     re-runs if hot-reload ever swaps the reference (defensive).
 *
 * Mock-mode short-circuit:
 *   - `env.useMockApi` makes `customFetch` mock every request, but the
 *     `EventSource` constructor would still try to hit the network. Skip
 *     entirely in mock mode so dev work continues without a backend.
 *
 * Session-expiry teardown:
 *   - When the root reducer resets the store on `sessionExpired`, the auth
 *     slice flips `isAuthenticated` to `false`. The store subscription below
 *     closes the `EventSource` so we don't keep retrying against stale
 *     cookies after logout.
 */
export function NotificationsStreamBootstrap({ role }: Props) {
  useEffect(() => {
    if (!store.getState().auth.isAuthenticated) {
      return undefined;
    }

    const teardown =
      role === 'admin'
        ? startAdminNotificationsStream(store)
        : startCreatorNotificationsStream(store);

    let torn = false;
    const unsubscribe = store.subscribe(() => {
      if (torn) return;
      if (!store.getState().auth.isAuthenticated) {
        torn = true;
        teardown();
        unsubscribe();
      }
    });

    return () => {
      torn = true;
      teardown();
      unsubscribe();
    };
  }, [role]);

  return null;
}