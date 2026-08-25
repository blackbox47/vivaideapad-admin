import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';
import {
  OPPORTUNITY_CATEGORIES,
  type OpportunityCategoryFilter,
} from '@/models/creator/submit-idea-model';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

interface OpportunityFiltersProps {
  category: OpportunityCategoryFilter;
  search: string;
  onSearchChange: (search: string) => void;
}

function opportunitiesHref(
  category: OpportunityCategoryFilter,
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
    ? `${CREATOR_ROUTES.opportunities}?${query}`
    : CREATOR_ROUTES.opportunities;
}

export default function OpportunityFilters({
  category,
  search,
  onSearchChange,
}: OpportunityFiltersProps) {
  return (
    <div className="mb-5.5 flex items-center justify-between flex-wrap gap-4">
      <div
        className="flex flex-wrap gap-2"
        role="navigation"
        aria-label="Filter briefs by category"
      >
        {OPPORTUNITY_CATEGORIES.map((filter) => {
          const isActive = category === filter;

          return (
            <Link
              key={filter}
              to={opportunitiesHref(filter, search)}
              replace
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'rounded-full border border-[#dfe7e3] px-4 py-2 text-[13px] font-bold no-underline transition-colors',
                isActive
                  ? 'bg-[#12231f] text-white'
                  : 'bg-white text-[#12231f] hover:bg-[#f6f8f5]',
              )}
            >
              {filter}
            </Link>
          );
        })}
      </div>

      <label className="relative block">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#9aa8a3]"
          strokeWidth={2}
          aria-hidden
        />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search briefs by title, category or keyword"
          aria-label="Search briefs"
          className="max-w-md w-md rounded-full border border-[#dfe7e3] bg-white py-2.5 pr-4.5 pl-11 text-[13px] text-foreground outline-none placeholder:text-[#9aa8a3] focus-visible:border-[#70a28d] focus-visible:shadow-[0_0_0_3px_#e2f1ea]"
        />
      </label>
    </div>
  );
}
