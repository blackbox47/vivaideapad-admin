import { Link } from '@tanstack/react-router';

import { cn } from '@/lib/utils';
import type { PeopleTab } from '@/models/people/people-model';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

interface PeopleTabsProps {
  tab: PeopleTab;
  applicantCount: number;
  invitedCount: number;
  contributorCount: number;
}

const TABS: Array<{ id: PeopleTab; label: string }> = [
  { id: 'applicants', label: 'Applicants' },
  { id: 'invited', label: 'Invited' },
  { id: 'contributors', label: 'Contributors' },
];

export default function PeopleTabs({
  tab,
  applicantCount,
  invitedCount,
  contributorCount,
}: PeopleTabsProps) {
  const counts: Record<PeopleTab, number> = {
    applicants: applicantCount,
    invited: invitedCount,
    contributors: contributorCount,
  };

  return (
    <div
      className="mb-[18px] flex w-fit flex-wrap gap-2 rounded-full border border-border bg-card p-[5px]"
      role="navigation"
      aria-label="People lists"
    >
      {TABS.map((item) => {
        const isActive = tab === item.id;
        const href =
          item.id === 'applicants'
            ? ADMIN_ROUTES.applicants
            : `${ADMIN_ROUTES.applicants}?tab=${item.id}`;

        return (
          <Link
            key={item.id}
            to={href}
            replace
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'rounded-full px-[18px] py-[9px] text-[13px] font-bold no-underline transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label} · {counts[item.id]}
          </Link>
        );
      })}
    </div>
  );
}
