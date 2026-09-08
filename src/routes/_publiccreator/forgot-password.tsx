import { createFileRoute } from '@tanstack/react-router';

import CreatorForgotPasswordPage from '@/pages/auth/creator-forgot-password';

/**
 * `/forgot-password` — creator password recovery. Guarded by the parent
 * `_public.creator` pathless layout.
 */
export const Route = createFileRoute('/_publiccreator/forgot-password')({
  component: CreatorForgotPasswordPage,
});
