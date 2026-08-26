import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';
import {
  ADMIN_NOTIFICATION_FILTERS,
  type AdminNotificationFilter,
} from '@/models/notifications/admin-notifications-model';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

interface AdminNotificationFiltersProps {
  filter: AdminNotificationFilter;
}

function filterHref(filter: AdminNotificationFilter): string {
  if (filter === 'All') {
    return ADMIN_ROUTES.notifications;
  }

  return `${ADMIN_ROUTES.notifications}?filter=${encodeURIComponent(filter)}`;
}

export default function AdminNotificationFilters({
  filter,
}: AdminNotificationFiltersProps) {
  return (
    <div
      className="mb-5 flex flex-wrap gap-2"
      role="navigation"
      aria-label="Filter notifications"
    >
      {ADMIN_NOTIFICATION_FILTERS.map((item) => {
        const isActive = filter === item;

        return (
          <Link
            key={item}
            to={filterHref(item)}
            replace
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'rounded-full border border-border px-4 py-2 text-[13px] font-bold no-underline transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground hover:bg-surface-subtle',
            )}
          >
            {item}
          </Link>
        );
      })}
    </div>
  );
}
