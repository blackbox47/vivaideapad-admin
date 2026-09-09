import { createFileRoute } from '@tanstack/react-router';

import LandingPage from '@/pages/landing';

/**
 * Root `/` route hosting the public Sparkory landing page.
 */
export const Route = createFileRoute('/')({
  component: LandingPage,
});
