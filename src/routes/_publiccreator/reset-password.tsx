import { createFileRoute } from '@tanstack/react-router';

import CreatorResetPasswordPage from '@/pages/auth/creator-reset-password';

type ResetPasswordSearch = {
  token: string;
};

/**
 * `/reset-password?token=...` — set a new password from the forgot-password
 * email. Parent `_publiccreator` applies the public creator guard.
 */
export const Route = createFileRoute('/_publiccreator/reset-password')({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: ResetPasswordRoute,
});

function ResetPasswordRoute() {
  const { token } = Route.useSearch();
  return <CreatorResetPasswordPage token={token} />;
}
