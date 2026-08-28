import { Link } from '@tanstack/react-router';

import { cn } from '@/lib/utils';
import type {
  PayoutStatusFilter,
} from '@/models/payouts/payouts-model';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

const STATUS_FILTERS: Array<{ id: PayoutStatusFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'Requested', label: 'Requested' },
  { id: 'Under Review', label: 'Under Review' },
  { id: 'Approved', label: 'Approved' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Rejected', label: 'Rejected' },
];

const STATUS_SLUG: Record<Exclude<PayoutStatusFilter, 'all'>, string> = {
  Requested: 'requested',
  'Under Review': 'under-review',
  Approved: 'approved',
  Paid: 'paid',
  Rejected: 'rejected',
};

const SLUG_TO_STATUS: Record<string, Exclude<PayoutStatusFilter, 'all'>> = {
  requested: 'Requested',
  'under-review': 'Under Review',
  approved: 'Approved',
  paid: 'Paid',
  rejected: 'Rejected',
};

interface PayoutFiltersProps {
  status: PayoutStatusFilter;
  search: string;
  visibleCount: number;
  onSearchChange: (search: string) => void;
}

export function parsePayoutStatus(value: string | null): PayoutStatusFilter {
  if (!value) {
    return 'all';
  }

  if (value === 'all') {
    return 'all';
  }

  return SLUG_TO_STATUS[value] ?? 'all';
}

function payoutHref(status: PayoutStatusFilter, search: string): string {
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
    ? `${ADMIN_ROUTES.payouts}?${query}`
    : ADMIN_ROUTES.payouts;
}

export default function PayoutFilters({
  status,
  search,
  visibleCount,
  onSearchChange,
}: PayoutFiltersProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div
        className="flex flex-wrap gap-2"
        role="navigation"
        aria-label="Filter payouts by status"
      >
        {STATUS_FILTERS.map((filter) => {
          const isActive = status === filter.id;

          return (
            <Link
              key={filter.id}
              to={payoutHref(filter.id, search)}
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
          {visibleCount} {visibleCount === 1 ? 'request' : 'requests'}
        </span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by contributor or method"
          aria-label="Search payouts"
          className="min-w-[260px] rounded-full border border-border bg-card px-[18px] py-2.5 text-[13px] text-foreground outline-none placeholder:text-text-subtle focus-visible:border-brand-sage-light focus-visible:ring-2 focus-visible:ring-success-muted"
        />
      </div>
    </div>
  );
}