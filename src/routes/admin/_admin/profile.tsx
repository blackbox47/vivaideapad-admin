import { createFileRoute } from '@tanstack/react-router';

import ProfilePage from '@/pages/profile';

/** `/admin/profile` */
export const Route = createFileRoute('/admin/_admin/profile')({
  component: ProfilePage,
});