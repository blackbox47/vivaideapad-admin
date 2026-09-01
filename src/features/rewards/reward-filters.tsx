import { Link } from '@tanstack/react-router';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type {
  LedgerTypeFilter,
  LedgerEntryType,
} from '@/models/rewards/rewards-model';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

const TYPE_FILTERS: Array<{ id: LedgerTypeFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'Reward', label: 'Reward' },
  { id: 'Withdrawal', label: 'Withdrawal' },
  { id: 'Adjustment', label: 'Adjustment' },
];

const TYPE_SLUG: Record<Exclude<LedgerTypeFilter, 'all'>, string> = {
  Reward: 'reward',
  Withdrawal: 'withdrawal',
  Adjustment: 'adjustment',
};

const SLUG_TO_TYPE: Record<string, Exclude<LedgerTypeFilter, 'all'>> = {
  reward: 'Reward',
  withdrawal: 'Withdrawal',
  adjustment: 'Adjustment',
};

interface RewardFiltersProps {
  type: LedgerTypeFilter;
  search: string;
  visibleCount: number;
  onSearchChange: (search: string) => void;
}

export function parseRewardType(value: string | null): LedgerTypeFilter {
  if (!value) {
    return 'all';
  }

  if (value === 'all') {
    return 'all';
  }

  return SLUG_TO_TYPE[value] ?? 'all';
}

function rewardHref(type: LedgerTypeFilter, search: string): string {
  const params = new URLSearchParams();

  if (type !== 'all') {
    params.set('type', TYPE_SLUG[type as Exclude<LedgerEntryType, 'Adjustment'>]);
  }

  const trimmed = search.trim();
  if (trimmed.length > 0) {
    params.set('q', trimmed);
  }

  const query = params.toString();
  return query
    ? `${ADMIN_ROUTES.rewards}?${query}`
    : ADMIN_ROUTES.rewards;
}

export default function RewardFilters({
  type,
  search,
  visibleCount,
  onSearchChange,
}: RewardFiltersProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div
        className="flex flex-wrap gap-2"
        role="navigation"
        aria-label="Filter ledger entries by type"
      >
        {TYPE_FILTERS.map((filter) => {
          const isActive = type === filter.id;

          return (
            <Link
              key={filter.id}
              to={rewardHref(filter.id, search)}
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
          {visibleCount} {visibleCount === 1 ? 'entry' : 'entries'}
        </span>
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by contributor or description"
          aria-label="Search ledger entries"
          className="min-w-[260px] rounded-full px-[18px] py-2.5 text-[13px] placeholder:text-text-subtle"
        />
      </div>
    </div>
  );
}