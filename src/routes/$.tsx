import { createFileRoute, redirect } from '@tanstack/react-router';

/**
 * Catch-all for any path the route tree doesn't explicitly handle.
 * Mirrors the legacy `<Route path="*" element={<Navigate to="/admin/login">}/>`
 * so unknown URLs land on the admin sign-in screen.
 */
export const Route = createFileRoute('/$')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/login' });
  },
});