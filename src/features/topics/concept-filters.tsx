import { Link } from '@tanstack/react-router';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ConceptStatus } from '@/models/topics/topics-model';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

const STATUS_FILTERS: Array<{ id: 'all' | ConceptStatus; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'draft', label: 'Draft' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'archived', label: 'Archived' },
];

interface ConceptFiltersProps {
  status: 'all' | ConceptStatus;
  search: string;
  visibleCount: number;
  onSearchChange: (search: string) => void;
}

function topicsHref(status: 'all' | ConceptStatus, search: string): string {
  const params = new URLSearchParams();

  if (status !== 'all') {
    params.set('status', status);
  }

  const trimmed = search.trim();
  if (trimmed.length > 0) {
    params.set('q', trimmed);
  }

  const query = params.toString();
  return query ? `${ADMIN_ROUTES.topics}?${query}` : ADMIN_ROUTES.topics;
}

export default function ConceptFilters({
  status,
  search,
  visibleCount,
  onSearchChange,
}: ConceptFiltersProps) {
  return (
    <div className="mb-[22px] flex flex-wrap items-center justify-between gap-4">
      <div
        className="flex flex-wrap gap-2"
        role="navigation"
        aria-label="Filter concepts by status"
      >
        {STATUS_FILTERS.map((filter) => {
          const isActive = status === filter.id;

          return (
            <Link
              key={filter.id}
              to={topicsHref(filter.id, search)}
              replace
              data-status-filter={filter.id}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'rounded-full border border-border px-4 py-2 text-[13px] font-bold no-underline transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground hover:bg-surface-subtle',
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3.5">
        <span className="whitespace-nowrap text-[13px] text-muted-foreground">
          {visibleCount} {visibleCount === 1 ? 'concept' : 'concepts'}
        </span>
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title or category"
          aria-label="Search concepts"
          className="min-w-[240px] rounded-full px-[18px] py-2.5 text-[13px] placeholder:text-text-subtle"
        />
      </div>
    </div>
  );
}
