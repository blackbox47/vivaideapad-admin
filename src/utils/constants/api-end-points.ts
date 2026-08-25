export const AUTH_LOGIN_URL = '/auth/login';
export const ADMIN_ME_URL = '/admin/me';
export const DASHBOARD_OVERVIEW_URL = '/admin/dashboard/overview';
export const CONCEPTS_URL = '/admin/concepts';
export const PEOPLE_URL = '/admin/people';
export const APPLICANTS_URL = '/admin/applicants';
export const USERS_URL = '/admin/users';
export const REVIEW_QUEUE_URL = '/admin/review-queue';
export const REWARDS_LEDGER_URL = '/admin/rewards-ledger';
export const PAYOUTS_URL = '/admin/payouts';
export const LEADERBOARD_URL = '/admin/leaderboard';
export const LEADERBOARD_RECALCULATE_URL = '/admin/leaderboard/recalculate';
export const REPORTS_OVERVIEW_URL = '/admin/reports/overview';
export const REPORTS_EXPORT_URL = '/admin/reports/export';
export const AUDIT_LOG_URL = '/admin/audit-log';
export const PROFILE_OVERVIEW_URL = '/admin/profile';
export const PROFILE_UPDATE_URL = '/admin/profile';
export const PROFILE_PASSWORD_URL = '/admin/profile/password';
export const PROFILE_NOTIFICATIONS_URL = '/admin/profile/notifications';
export const PROFILE_AVATAR_URL_URL = '/admin/profile/avatar';

// Creator workspace endpoints. Login itself shares `/auth/login` with admin —
// the role discriminator comes back in the response body.
export const CREATOR_ME_URL = '/creator/me';
export const CREATOR_DASHBOARD_OVERVIEW_URL = '/creator/dashboard/overview';
export const CREATOR_IDEAS_URL = '/creator/ideas';
export const CREATOR_IDEAS_SUBMIT_URL = '/creator/ideas';
export const CREATOR_TOPICS_URL = '/creator/topics';
export const CREATOR_REWARDS_URL = '/creator/rewards';
export const CREATOR_REWARDS_WITHDRAW_URL = '/creator/rewards/withdraw';
export const CREATOR_LEADERBOARD_URL = '/creator/leaderboard';
