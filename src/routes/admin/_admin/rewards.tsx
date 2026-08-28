import { createFileRoute } from '@tanstack/react-router';

import RewardsPage from '@/pages/rewards';

/** `/admin/rewards` */
export const Route = createFileRoute('/admin/_admin/rewards')({
  component: RewardsPage,
});