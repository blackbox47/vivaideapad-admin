import { createFileRoute } from '@tanstack/react-router';

import PayoutsPage from '@/pages/payouts';

/** `/admin/payouts` */
export const Route = createFileRoute('/admin/_admin/payouts')({
  component: PayoutsPage,
});