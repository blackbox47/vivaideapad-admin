import { createFileRoute } from '@tanstack/react-router';

import CreatorSignUpPage from '@/pages/auth/creator-sign-up';

/**
 * `/sign-up` — contributor registration. Guarded by the parent `_publiccreator`
 * pathless layout, so an already-authenticated creator is bounced to their dashboard.
 */
export const Route = createFileRoute('/_publiccreator/sign-up')({
  component: CreatorSignUpPage,
});
