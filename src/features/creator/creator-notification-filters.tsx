import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';
import {
  CREATOR_NOTIFICATION_FILTERS,
  type CreatorNotificationFilter,
} from '@/models/creator/creator-notifications-model';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

interface CreatorNotificationFiltersProps {
  filter: CreatorNotificationFilter;
}

function filterHref(filter: CreatorNotificationFilter): string {
  if (filter === 'All') {
    return CREATOR_ROUTES.notifications;
  }

  return `${CREATOR_ROUTES.notifications}?filter=${encodeURIComponent(filter)}`;
}

export default function CreatorNotificationFilters({
  filter,
}: CreatorNotificationFiltersProps) {
  return (
    <div
      className="mb-5 flex flex-wrap gap-2"
      role="navigation"
      aria-label="Filter notifications"
    >
      {CREATOR_NOTIFICATION_FILTERS.map((item) => {
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
