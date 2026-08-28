import { createFileRoute } from '@tanstack/react-router';

import { authGuard } from '@/lib/auth-guard';
import AdminLayout from '@/layouts/admin-layout';

/**
 * Pathless layout for every authenticated admin page (everything under
 * `/admin/*` *except* the public login/sign-in routes). The leading underscore
 * on the filename makes this a "pathless layout route" — TanStack Router
 * strips the `_admin` segment from the URL, so children resolve at
 * `/admin`, `/admin/topics`, `/admin/applicants`, etc., exactly as the
 * legacy nested `<Route>`s did.
 *
 * `beforeLoad` runs before render so the redirect-to-login is invisible to
 * the user; there is no flash of the admin shell for unauthenticated users.
 *
 * `AdminLayout` renders the matching child via its internal `<Outlet />`,
 * so this component is a thin wrapper.
 */
export const Route = createFileRoute('/admin/_admin')({
  beforeLoad: ({ context, location }) =>
    authGuard.private(context.store, 'admin', location.href),
  component: AdminLayout,
});