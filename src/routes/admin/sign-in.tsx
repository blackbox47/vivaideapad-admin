import { createFileRoute } from '@tanstack/react-router';

import AdminSignInPage from '@/pages/auth/admin-sign-in';
import { authGuard } from '@/lib/auth-guard';

/**
 * `/admin/sign-in` — alternate admin sign-in flow. Same guard semantics as
 * `/admin/login`; both share the public-only redirect behaviour.
 */
export const Route = createFileRoute('/admin/sign-in')({
  beforeLoad: ({ context }) => authGuard.public(context.store, 'admin'),
  component: AdminSignInPage,
});