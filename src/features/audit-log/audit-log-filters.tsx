import { Link } from '@tanstack/react-router';

import { cn } from '@/lib/utils';
import {
  AUDIT_CATEGORY_FILTERS,
  type AuditCategoryFilter,
} from '@/models/audit-log/audit-log-model';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

interface AuditLogFiltersProps {
  category: AuditCategoryFilter;
  search: string;
  categoryCounts: Record<AuditCategoryFilter, number>;
  onSearchChange: (search: string) => void;
}

function filterHref(
  category: AuditCategoryFilter,
  search: string,
): string {
  const params = new URLSearchParams();

  if (category !== 'All') {
    params.set('category', category);
  }

  const trimmed = search.trim();
  if (trimmed.length > 0) {
    params.set('q', trimmed);
  }

  const query = params.toString();
  return query
    ? `${ADMIN_ROUTES.auditLog}?${query}`
    : ADMIN_ROUTES.auditLog;
}

export default function AuditLogFilters({
  category,
  search,
  categoryCounts,
  onSearchChange,
}: AuditLogFiltersProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div
        className="flex flex-wrap gap-2"
        role="navigation"
        aria-label="Filter audit log by category"
      >
        {AUDIT_CATEGORY_FILTERS.map((filter) => {
          const isActive = category === filter;
          const count = categoryCounts[filter];

          return (
            <Link
              key={filter}
              to={filterHref(filter, search)}
              replace
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[13px] font-bold no-underline transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground hover:bg-surface-subtle',
              )}
            >
              {filter}
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold',
                  isActive
                    ? 'bg-primary-foreground/15 text-primary-foreground'
                    : 'bg-surface-subdued text-muted-foreground',
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3.5">
        <span className="whitespace-nowrap text-[13px] text-muted-foreground">
          {categoryCounts[category]}{' '}
          {categoryCounts[category] === 1 ? 'event' : 'events'}
        </span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search actor, action or target"
          aria-label="Search audit events"
          className="min-w-[260px] rounded-full border border-border bg-card px-[18px] py-2.5 text-[13px] text-foreground outline-none placeholder:text-text-subtle focus-visible:border-brand-sage-light focus-visible:ring-2 focus-visible:ring-success-muted"
        />
      </div>
    </div>
  );
}