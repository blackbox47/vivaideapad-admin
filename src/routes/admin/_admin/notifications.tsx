import { createFileRoute } from '@tanstack/react-router';

import NotificationsPage from '@/pages/notifications';

/** `/admin/notifications` */
export const Route = createFileRoute('/admin/_admin/notifications')({
  component: NotificationsPage,
});