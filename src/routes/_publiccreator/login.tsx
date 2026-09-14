import { createFileRoute } from '@tanstack/react-router';

import CreatorLoginPage from '@/pages/auth/creator-login';

type LoginSearch = {
  from?: string;
};

/**
 * `/login` — creator sign-in. Guarded by the parent `_public.creator`
 * pathless layout, so this file only declares the page component.
 */
export const Route = createFileRoute('/_publiccreator/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    from: typeof search.from === 'string' ? search.from : undefined,
  }),
  component: CreatorLoginPage,
});
