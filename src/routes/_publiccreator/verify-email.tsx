import { createFileRoute } from '@tanstack/react-router';

import CreatorVerifyEmailPage from '@/pages/auth/creator-verify-email';

type VerifyEmailSearch = {
  token: string;
};

/**
 * `/verify-email?token=...` — onboarding application form opened from the
 * sign-up verification email. Parent `_publiccreator` applies the public
 * creator guard + AuthLayout.
 */
export const Route = createFileRoute('/_publiccreator/verify-email')({
  validateSearch: (search: Record<string, unknown>): VerifyEmailSearch => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: VerifyEmailRoute,
});

function VerifyEmailRoute() {
  const { token } = Route.useSearch();
  return <CreatorVerifyEmailPage token={token} />;
}
