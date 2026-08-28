import { createFileRoute } from '@tanstack/react-router';

import DashboardPage from '@/pages/dashboard';

/**
 * `/admin` — admin dashboard index.
 */
export const Route = createFileRoute('/admin/_admin/')({
  component: DashboardPage,
});