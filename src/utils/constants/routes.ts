export const ADMIN_BASE_PATH = '/admin';

export const ADMIN_ROUTES = {
  dashboard: ADMIN_BASE_PATH,
  login: `${ADMIN_BASE_PATH}/login`,
  signIn: `${ADMIN_BASE_PATH}/sign-in`,
  topics: `${ADMIN_BASE_PATH}/topics`,
  applicants: `${ADMIN_BASE_PATH}/applicants`,
  contentReview: `${ADMIN_BASE_PATH}/content-review`,
  rewards: `${ADMIN_BASE_PATH}/rewards`,
  payouts: `${ADMIN_BASE_PATH}/payouts`,
  leaderboard: `${ADMIN_BASE_PATH}/leaderboard`,
  reports: `${ADMIN_BASE_PATH}/reports`,
  auditLog: `${ADMIN_BASE_PATH}/audit-log`,
  admins: `${ADMIN_BASE_PATH}/admins`,
  notifications: `${ADMIN_BASE_PATH}/notifications`,
  profile: `${ADMIN_BASE_PATH}/profile`,
} as const;

/**
 * Contributor workspace lives at the top level (no shared base path) so the
 * URLs read naturally: `/login`, `/dashboard`, `/opportunities`, …
 */
export const CREATOR_ROUTES = {
  dashboard: '/dashboard',
  login: '/login',
  opportunities: '/opportunities',
  submissions: '/submissions',
  rewards: '/rewards',
  leaderboard: '/leaderboard',
  notifications: '/notifications',
  submitIdea: '/ideas/new',
  profile: '/profile',
} as const;
