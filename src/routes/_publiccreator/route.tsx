import { createFileRoute } from '@tanstack/react-router';

import { authGuard } from '@/lib/auth-guard';
import AuthLayout from '@/layouts/auth-layout';

/**
 * Pathless layout for the public creator login (`/login`). The `_public`
 * folder prefix makes this a pathless layout route — TanStack Router
 * strips the leading underscore from the segment so the children resolve
 * at the root, e.g. `/login`. Wraps the children in `AuthLayout` and
 * applies the public creator guard so an already-authed creator lands on
 * their dashboard instead of re-seeing the sign-in form.
 *
 * `AuthLayout` renders the matching child via its internal `<Outlet />`,
 * so this component is a thin wrapper.
 */
export const Route = createFileRoute('/_publiccreator')({
  beforeLoad: ({ context }) => authGuard.public(context.store, 'creator'),
  component: AuthLayout,
});