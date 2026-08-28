import { createFileRoute } from '@tanstack/react-router';

import AuditLogPage from '@/pages/audit-log';

/** `/admin/audit-log` */
export const Route = createFileRoute('/admin/_admin/audit-log')({
  component: AuditLogPage,
});