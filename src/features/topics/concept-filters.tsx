import { Link } from '@tanstack/react-router';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ConceptStatus } from '@/models/topics/topics-model';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

const STATUS_FILTERS: Array<{ id: 'all' | ConceptStatus; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'draft', label: 'Draft' },
  { id: 'archived', label: 'Archived' },
];

interface ConceptFiltersProps {
  status: 'all' | ConceptStatus;
  search: string;
  visibleCount: number;
  selectedCount?: number;
  allSelected?: boolean;
  onToggleSelectAll?: () => void;
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
  selectedCount = 0,
  allSelected = false,
  onToggleSelectAll,
  onSearchChange,
}: ConceptFiltersProps) {
  return (
    <div className="mb-5.5 flex flex-wrap items-center justify-between gap-4">
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

      <div className="flex items-center gap-3.5 flex-wrap">
        {visibleCount > 0 && onToggleSelectAll ? (
          <button
            type="button"
            onClick={onToggleSelectAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition"
          >
            <input
              type="checkbox"
              readOnly
              checked={allSelected}
              className="size-3.5 rounded border-border accent-primary cursor-pointer"
              aria-label={allSelected ? 'Deselect all concepts' : 'Select all visible concepts'}
            />
            <span>{allSelected ? 'Deselect all' : 'Select all'}</span>
          </button>
        ) : null}

        <span className="whitespace-nowrap text-[13px] text-muted-foreground font-medium">
          {selectedCount > 0 ? `${selectedCount} selected · ` : ''}
          {visibleCount} {visibleCount === 1 ? 'concept' : 'concepts'}
        </span>
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title or category"
          aria-label="Search concepts"
          className="min-w-60 rounded-full px-4.5 py-2.5 text-[13px] placeholder:text-text-subtle"
        />
      </div>
    </div>
  );
}
