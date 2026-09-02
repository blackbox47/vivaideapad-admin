export const AUTH_SIGN_IN_URL = '/auth/sign-in';
export const AUTH_SIGN_OUT_URL = '/auth/sign-out';
export const AUTH_REFRESH_URL = '/auth/refresh';
export const DASHBOARD_OVERVIEW_URL = '/admin/dashboard/overview';
export const CONCEPTS_URL = '/admin/concepts';
export const PEOPLE_URL = '/admin/people';
export const APPLICANTS_URL = '/admin/applicants';
export const USERS_URL = '/admin/users';
export const REVIEW_QUEUE_URL = '/admin/review-queue';
export const REWARDS_LEDGER_URL = '/admin/rewards-ledger';
export const REWARDS_LEDGER_ADJUST_URL = '/admin/rewards-ledger/adjustments';
export const PAYOUTS_URL = '/admin/payouts';
export const LEADERBOARD_URL = '/admin/leaderboard';
export const LEADERBOARD_RECALCULATE_URL = '/admin/leaderboard/recalculate';
export const REPORTS_OVERVIEW_URL = '/admin/reports/overview';
export const REPORTS_EXPORT_URL = '/admin/reports/export';
export const AUDIT_LOG_URL = '/admin/audit-log';
export const ADMINS_URL = '/admin/admins';
export const ADMIN_DETAIL_URL = (id: string) => `/admin/admins/${id}`;
export const ADMIN_NOTIFICATIONS_URL = '/admin/notifications';
export const ADMIN_NOTIFICATIONS_READ_ALL_URL = '/admin/notifications/read-all';
export const ADMIN_NOTIFICATIONS_STREAM_URL = '/admin/notifications/stream';
export const PROFILE_OVERVIEW_URL = '/admin/profile';
export const PROFILE_UPDATE_URL = '/admin/profile';
export const PROFILE_PASSWORD_URL = '/admin/profile/password';
export const PROFILE_NOTIFICATIONS_URL = '/admin/profile/notifications';
export const PROFILE_AVATAR_URL_URL = '/admin/profile/avatar';

// Spec Module 5 — Categories (REST spec §5.2)
export const CATEGORIES_URL = '/admin/categories';
export const CATEGORY_DETAIL_URL = (id: string) => `/admin/categories/${id}`;

// Spec Module 5 — Concepts (Topics) detail + status transition (REST spec §5.3)
export const CONCEPT_DETAIL_URL = (id: string) => `/admin/concepts/${id}`;
export const CONCEPT_STATUS_URL = (id: string) =>
  `/admin/concepts/${id}/status`;

// Spec Module 5 — Applications (Applicants) list + detail + decision (REST spec §5.4)
export const APPLICATIONS_URL = '/admin/applications';
export const APPLICATION_DETAIL_URL = (id: string) =>
  `/admin/applications/${id}`;
export const APPLICATION_DECISION_URL = (id: string) =>
  `/admin/applications/${id}/decision`;

// Spec Module 5 — Submissions (Content Review) detail + decision + publish + scan (REST spec §5.5)
export const SUBMISSIONS_URL = '/admin/submissions';
export const SUBMISSION_DETAIL_URL = (id: string) =>
  `/admin/submissions/${id}`;
export const SUBMISSION_DECISION_URL = (id: string) =>
  `/admin/submissions/${id}/decision`;
export const SUBMISSION_PUBLISH_URL = (id: string) =>
  `/admin/submissions/${id}/publish`;
export const SUBMISSION_RISK_SCAN_URL = (id: string) =>
  `/admin/submissions/${id}/risk-scan`;

// Spec Module 5 — Payouts detail + process (REST spec §5.6)
export const PAYOUT_DETAIL_URL = (id: string) => `/admin/payouts/${id}`;
export const PAYOUT_PROCESS_URL = (id: string) =>
  `/admin/payouts/${id}/process`;

// Spec Module 5 — Ledger (Rewards) global search + manual adjustment (REST spec §5.6)
export const LEDGER_URL = '/admin/ledger';
export const LEDGER_MANUAL_ADJUSTMENT_URL = '/admin/ledger/manual-adjustment';

// Spec Module 5 — Users 360 view + role + access-status + soft-delete (REST spec §5.7)
export const USER_DETAIL_URL = (id: string) => `/admin/users/${id}`;
export const USER_ACCESS_STATUS_URL = (id: string) =>
  `/admin/users/${id}/access-status`;
export const USER_ROLE_URL = (id: string) => `/admin/users/${id}/role`;

// Spec Module 5 — Reports (REST spec §5.8)
export const REPORTS_PARTICIPATION_URL = '/admin/reports/participation';
export const REPORTS_QUALITY_URL = '/admin/reports/quality-and-categories';
export const REPORTS_FINANCIAL_URL = '/admin/reports/financial-reconciliation';
export const REPORTS_EXPORT_CSV_URL = '/admin/reports/export-csv';

// Spec Module 5 — Audit Events (REST spec §5.9)
export const AUDIT_EVENTS_URL = '/admin/audit-events';
export const AUDIT_EVENT_DETAIL_URL = (id: string) =>
  `/admin/audit-events/${id}`;

// Spec Module 5 — Profile display preferences (REST spec §1.5–1.7)
export const PROFILE_DISPLAY_URL = '/admin/profile/display';

// Contributor workspace endpoints. Login itself shares `/auth/sign-in` with admin —
// the role discriminator comes back in the response body.
export const CREATOR_ME_URL = '/contributor/me';
export const CREATOR_DASHBOARD_OVERVIEW_URL = '/contributor/dashboard';
export const CREATOR_IDEAS_URL = '/contributor/submissions';
export const CREATOR_IDEAS_SUBMIT_URL = '/contributor/submissions';
export const CREATOR_IDEA_DETAIL_URL = (id: string) =>
  `/contributor/submissions/${id}`;
export const CREATOR_IDEA_SUBMIT_FOR_REVIEW_URL = (id: string) =>
  `/contributor/submissions/${id}/submit`;
export const CREATOR_TOPICS_URL = '/contributor/concepts';
export const CREATOR_REWARDS_URL = '/contributor/wallet';
export const CREATOR_REWARDS_WITHDRAW_URL = '/contributor/payouts';
export const CREATOR_LEADERBOARD_URL = '/contributor/leaderboard';
export const CREATOR_NOTIFICATIONS_URL = '/contributor/notifications';
export const CREATOR_NOTIFICATIONS_READ_ALL_URL =
  '/contributor/notifications/read-all';
export const CREATOR_NOTIFICATIONS_STREAM_URL =
  '/contributor/notifications/stream';
export const CREATOR_PROFILE_URL = '/contributor/profile';
export const CREATOR_PROFILE_PASSWORD_URL = '/contributor/profile/password';
export const CREATOR_PROFILE_NOTIFICATIONS_URL =
  '/contributor/profile/notifications';
export const CREATOR_PROFILE_AVATAR_URL = '/contributor/profile/avatar';
export const CREATOR_PROFILE_PAYOUT_URL = '/contributor/profile/payout-method';
export const CREATOR_PAYMENT_METHODS_URL = '/contributor/payment-methods';

// Payment methods API
export const PAYMENT_METHODS_URL = '/admin/payment-methods';
export const PAYMENT_METHOD_DETAIL_URL = (id: string) =>
  `/admin/payment-methods/${id}`;
export const PAYMENT_METHOD_OPTIONS_URL = '/payment-methods/options';

