import { createFileRoute } from '@tanstack/react-router';

import ReportsPage from '@/pages/reports';

/** `/admin/reports` */
export const Route = createFileRoute('/admin/_admin/reports')({
  component: ReportsPage,
});