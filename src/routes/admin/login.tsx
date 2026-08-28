import { createFileRoute } from '@tanstack/react-router';

import LoginPage from '@/pages/auth/login';
import { authGuard } from '@/lib/auth-guard';

/**
 * `/admin/login` — admin sign-in. Public (so a logged-out user can reach it)
 * but actively bounces already-authed admins to their dashboard, mirroring
 * the legacy `<PublicRoute requiredRole="admin">` wrapper.
 */
export const Route = createFileRoute('/admin/login')({
  beforeLoad: ({ context }) => authGuard.public(context.store, 'admin'),
  component: LoginPage,
});