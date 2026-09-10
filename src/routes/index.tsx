import { createFileRoute } from '@tanstack/react-router';

import LandingPage from '@/pages/landing';

/**
 * Root `/` route hosting the public Viva IdeaPad landing page.
 */
export const Route = createFileRoute('/')({
  component: LandingPage,
});
