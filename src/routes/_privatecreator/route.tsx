import { createFileRoute } from '@tanstack/react-router';

import { authGuard } from '@/lib/auth-guard';
import CreatorLayout from '@/layouts/creator-layout';

/**
 * Pathless layout for every authenticated creator page (everything under
 * the root URL except `/login`). Children resolve at `/dashboard`,
 * `/opportunities`, `/ideas/new`, etc., exactly as the legacy nested
 * `<Route>`s did.
 *
 * `beforeLoad` runs before render so the redirect-to-login is invisible to
 * the user; there is no flash of the creator shell for unauthenticated users.
 *
 * `CreatorLayout` renders the matching child route via its internal
 * `<Outlet />`, so this component is a thin wrapper.
 */
export const Route = createFileRoute('/_privatecreator')({
  beforeLoad: ({ context, location }) =>
    authGuard.private(context.store, 'creator', location.href),
  component: CreatorLayout,
});