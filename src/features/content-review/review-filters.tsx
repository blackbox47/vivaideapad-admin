import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';
import type { ReviewStatusFilter } from '@/models/content-review/content-review-model';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

const STATUS_FILTERS: Array<{ id: ReviewStatusFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'Under Review', label: 'Under Review' },
  { id: 'Revision Requested', label: 'Revision Requested' },
  { id: 'Approved', label: 'Approved' },
  { id: 'Published', label: 'Published' },
  { id: 'Rejected', label: 'Rejected' },
];

const STATUS_SLUG: Record<Exclude<ReviewStatusFilter, 'all'>, string> = {
  'Under Review': 'under-review',
  'Revision Requested': 'revision-requested',
  Approved: 'approved',
  Published: 'published',
  Rejected: 'rejected',
};

interface ReviewFiltersProps {
  status: ReviewStatusFilter;
  search: string;
  visibleCount: number;
  onSearchChange: (search: string) => void;
}

const SLUG_TO_STATUS: Record<string, Exclude<ReviewStatusFilter, 'all'>> = {
  'under-review': 'Under Review',
  'revision-requested': 'Revision Requested',
  approved: 'Approved',
  published: 'Published',
  rejected: 'Rejected',
};

export function parseReviewStatus(value: string | null): ReviewStatusFilter {
  if (!value) {
    return 'all';
  }

  return SLUG_TO_STATUS[value] ?? 'all';
}

function reviewHref(status: ReviewStatusFilter, search: string): string {
  const params = new URLSearchParams();

  if (status !== 'all') {
    params.set('status', STATUS_SLUG[status]);
  }

  const trimmed = search.trim();
  if (trimmed.length > 0) {
    params.set('q', trimmed);
  }

  const query = params.toString();
  return query
    ? `${ADMIN_ROUTES.contentReview}?${query}`
    : ADMIN_ROUTES.contentReview;
}

export default function ReviewFilters({
  status,
  search,
  visibleCount,
  onSearchChange,
}: ReviewFiltersProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div
        className="flex flex-wrap gap-2"
        role="navigation"
        aria-label="Filter submissions by status"
      >
        {STATUS_FILTERS.map((filter) => {
          const isActive = status === filter.id;

          return (
            <Link
              key={filter.id}
              to={reviewHref(filter.id, search)}
              replace
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
          {visibleCount} {visibleCount === 1 ? 'submission' : 'submissions'}
        </span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title, contributor or topic"
          aria-label="Search submissions"
          className="min-w-[260px] rounded-full border border-border bg-card px-[18px] py-2.5 text-[13px] text-foreground outline-none placeholder:text-text-subtle focus-visible:border-brand-sage-light focus-visible:ring-2 focus-visible:ring-success-muted"
        />
      </div>
    </div>
  );
}
