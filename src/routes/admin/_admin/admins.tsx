import { createFileRoute } from '@tanstack/react-router';

import AdminsPage from '@/pages/admins';

/** `/admin/admins` */
export const Route = createFileRoute('/admin/_admin/admins')({
  component: AdminsPage,
});