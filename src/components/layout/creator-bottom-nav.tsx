import { Link, useRouterState } from '@tanstack/react-router';
import { BarChart3, FileText, Home, Lightbulb, Wallet, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

interface NavTab {
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
}

const NAV_TABS: NavTab[] = [
  { label: 'Dashboard', to: CREATOR_ROUTES.dashboard, icon: Home, exact: true },
  { label: 'Opportunities', to: CREATOR_ROUTES.opportunities, icon: Lightbulb },
  { label: 'Submissions', to: CREATOR_ROUTES.submissions, icon: FileText },
  { label: 'Rewards', to: CREATOR_ROUTES.rewards, icon: Wallet },
  { label: 'Ranks', to: CREATOR_ROUTES.leaderboard, icon: BarChart3 },
];

export default function CreatorBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-lg md:hidden dark:border-border dark:bg-card/95"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.exact
            ? pathname === tab.to
            : pathname === tab.to || pathname.startsWith(`${tab.to}/`);

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-1 transition-colors no-underline',
                isActive
                  ? 'font-semibold text-[#0a1d17] dark:text-brand-lime'
                  : 'text-slate-400 hover:text-slate-700 dark:text-muted-foreground dark:hover:text-foreground',
              )}
            >
              <Icon
                className={cn(
                  'size-5',
                  isActive
                    ? 'text-[#0a1d17] dark:text-brand-lime'
                    : 'text-slate-400 dark:text-muted-foreground',
                )}
                strokeWidth={isActive ? 2.3 : 1.8}
                aria-hidden
              />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
