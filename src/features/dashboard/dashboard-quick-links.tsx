import { Link } from '@tanstack/react-router';

import { ADMIN_NAV_ITEMS } from '@/utils/constants/nav-items';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

const QUICK_LINK_PATHS: readonly string[] = [
  ADMIN_ROUTES.topics,
  ADMIN_ROUTES.applicants,
  ADMIN_ROUTES.contentReview,
  ADMIN_ROUTES.rewards,
  ADMIN_ROUTES.payouts,
  ADMIN_ROUTES.leaderboard,
  ADMIN_ROUTES.reports,
];

export default function DashboardQuickLinks() {
  return (
    <nav className="my-[18px] flex flex-wrap gap-2" aria-label="Dashboard shortcuts">
      {ADMIN_NAV_ITEMS.filter((item) =>
        QUICK_LINK_PATHS.includes(item.href),
      ).map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="rounded-full border border-border bg-card px-4 py-2 text-[13px] font-bold text-foreground no-underline hover:bg-surface-subtle transition-colors"
        >
          {item.title === 'Applicants & users'
            ? 'Applicants & contributors'
            : item.title}
        </Link>
      ))}
    </nav>
  );
}
