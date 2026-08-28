import { createFileRoute } from '@tanstack/react-router';

import CreatorNotificationsPage from '@/pages/creator/notifications';

/** `/notifications` */
export const Route = createFileRoute('/_privatecreator/notifications')({
  component: CreatorNotificationsPage,
});