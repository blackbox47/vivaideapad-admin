import { createFileRoute } from '@tanstack/react-router';

import CreatorLoginPage from '@/pages/auth/creator-login';

/**
 * `/login` — creator sign-in. Guarded by the parent `_public.creator`
 * pathless layout, so this file only declares the page component.
 */
export const Route = createFileRoute('/_publiccreator/login')({
  component: CreatorLoginPage,
});