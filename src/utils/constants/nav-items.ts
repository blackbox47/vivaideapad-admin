import {
  BarChart3,
  CreditCard,
  FileText,
  Home,
  Layers,
  Lightbulb,
  Shield,
  SquareCheckBig,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react';

import type { NavItem } from '@/models/nav/nav-model';
import { ADMIN_ROUTES, CREATOR_ROUTES } from '@/utils/constants/routes';

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { title: 'Overview', href: ADMIN_ROUTES.dashboard, icon: Home },
  { title: 'Topics & concepts', href: ADMIN_ROUTES.topics, icon: Layers },
  { title: 'Applicants & users', href: ADMIN_ROUTES.applicants, icon: Users },
  {
    title: 'Content review',
    href: ADMIN_ROUTES.contentReview,
    icon: SquareCheckBig,
  },
  { title: 'Rewards ledger', href: ADMIN_ROUTES.rewards, icon: Wallet },
  { title: 'Payouts', href: ADMIN_ROUTES.payouts, icon: CreditCard },
  { title: 'Leaderboard', href: ADMIN_ROUTES.leaderboard, icon: Trophy },
  { title: 'Reports', href: ADMIN_ROUTES.reports, icon: BarChart3 },
  { title: 'Audit log', href: ADMIN_ROUTES.auditLog, icon: Shield },
];

export const CREATOR_NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: CREATOR_ROUTES.dashboard, icon: Home },
  {
    title: 'Opportunities',
    href: CREATOR_ROUTES.opportunities,
    icon: Lightbulb,
  },
  { title: 'My submissions', href: CREATOR_ROUTES.submissions, icon: FileText },
  { title: 'Rewards & payouts', href: CREATOR_ROUTES.rewards, icon: Wallet },
  { title: 'Leaderboard', href: CREATOR_ROUTES.leaderboard, icon: BarChart3 },
];

export const CREATOR_PAGE_TITLES: Record<string, string> = {
  [CREATOR_ROUTES.dashboard]: 'Dashboard',
  [CREATOR_ROUTES.opportunities]: 'Opportunities',
  [CREATOR_ROUTES.submissions]: 'My submissions',
  [CREATOR_ROUTES.rewards]: 'Rewards & payouts',
  [CREATOR_ROUTES.leaderboard]: 'Leaderboard',
  [CREATOR_ROUTES.submitIdea]: 'Submit a new idea',
};

export const PAGE_TITLES: Record<string, string> = {
  [ADMIN_ROUTES.dashboard]: 'Overview',
  [ADMIN_ROUTES.topics]: 'Topics & concepts',
  [ADMIN_ROUTES.applicants]: 'Applicants & contributors',
  [ADMIN_ROUTES.contentReview]: 'Content review',
  [ADMIN_ROUTES.rewards]: 'Rewards ledger',
  [ADMIN_ROUTES.payouts]: 'Payouts',
  [ADMIN_ROUTES.leaderboard]: 'Leaderboard',
  [ADMIN_ROUTES.reports]: 'Reports',
  [ADMIN_ROUTES.auditLog]: 'Audit log',
  ...CREATOR_PAGE_TITLES,
};
