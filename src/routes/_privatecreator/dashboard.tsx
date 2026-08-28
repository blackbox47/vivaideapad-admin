import { createFileRoute } from '@tanstack/react-router';

import CreatorDashboardPage from '@/pages/creator/dashboard';

/** `/dashboard` */
export const Route = createFileRoute('/_privatecreator/dashboard')({
  component: CreatorDashboardPage,
});