import { Link } from '@tanstack/react-router';

import { cn } from '@/lib/utils';
import type { PeopleTab } from '@/models/people/people-model';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

interface PeopleTabsProps {
  tab: PeopleTab;
  applicantCount: number;
  invitedCount: number;
  rejectedCount: number;
  contributorCount: number;
}

const TABS: Array<{ id: PeopleTab; label: string }> = [
  { id: 'applicants', label: 'Applicants' },
  { id: 'invited', label: 'Invited' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'contributors', label: 'Contributors' },
];

export default function PeopleTabs({
  tab,
  applicantCount,
  invitedCount,
  rejectedCount,
  contributorCount,
}: PeopleTabsProps) {
  const counts: Record<PeopleTab, number> = {
    applicants: applicantCount,
    invited: invitedCount,
    rejected: rejectedCount,
    contributors: contributorCount,
  };

  return (
    <nav
      className="mb-5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
      aria-label="Filter tabs"
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
              'inline-flex items-center whitespace-nowrap rounded-full text-xs transition-colors no-underline',
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold px-4 py-2'
                : 'bg-card text-muted-foreground border border-border hover:border-foreground/30 hover:text-foreground font-medium px-3.5 py-2',
            )}
          >
            {item.label} · {counts[item.id]}
          </Link>
        );
      })}
    </nav>
  );
}
