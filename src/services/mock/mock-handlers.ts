/**
 * Mock transport for the RTK Query base query.
 *
 * Handlers are keyed by `METHOD /url` so endpoints can be written against the
 * real REST contract; deleting this file and flipping `VITE_USE_MOCK_API=false`
 * is the only change needed once the API exists.
 */

import { format } from 'date-fns';
import type { ApiRequest, ApiResult } from '@/models/api/api-model';
import type { LeaderboardEntry } from '@/models/leaderboard/leaderboard-model';
import type {
  Applicant,
  DecideApplicantBody,
  PlatformUser,
  PlatformUserStatus,
  ToggleUserBody,
} from '@/models/people/people-model';
import type {
  ContentSubmission,
  DecideSubmissionBody,
  SubmissionStatus,
} from '@/models/content-review/content-review-model';
import type {
  Concept,
  ConceptStatus,
  CreateConceptBody,
} from '@/models/topics/topics-model';
import { CONCEPT_STATUSES } from '@/models/topics/topics-model';
import type {
  CreateAdminBody,
  WorkspaceAdmin,
} from '@/models/admins/admins-model';
import type {
  AdminNotification,
  AdminNotificationFilter,
  ToggleNotificationBody,
} from '@/models/notifications/admin-notifications-model';
import { ADMIN_NOTIFICATION_FILTERS } from '@/models/notifications/admin-notifications-model';
import type { AuditEvent } from '@/models/audit-log/audit-log-model';
import type { AuthUser } from '@/models/auth/auth-model';
import {
  formatPlatformRole,
  isPlatformRole,
} from '@/utils/helpers/platform-role';
import type {
  CreateAdjustmentBody,
  LedgerEntry,
  LedgerTypeFilter,
} from '@/models/rewards/rewards-model';
import type {
  DecidePayoutBody,
  Payout,
  PayoutStatusFilter,
} from '@/models/payouts/payouts-model';
import type {
  NotificationPreferences,
  ProfileDetails,
  PublicDisplay,
  UpdateNotificationsBody,
  UpdatePasswordBody,
  UpdatePayoutMethodBody,
  UpdateProfileBody,
} from '@/models/profile/profile-model';
import type { MyIdea, MyIdeasStatusFilter } from '@/models/creator/my-ideas-model';
import type { SubmitIdeaBody } from '@/models/creator/submit-idea-model';
import type {
  CreatorNotification,
  CreatorNotificationFilter,
  ToggleCreatorNotificationBody,
} from '@/models/creator/creator-notifications-model';
import { CREATOR_NOTIFICATION_FILTERS } from '@/models/creator/creator-notifications-model';
import type {
  CreatorRewardsOverview,
  WithdrawRequestBody,
} from '@/models/creator/creator-rewards-model';
import {
  MAYA_ADMIN_ALIASES,
  mockAdminUser,
  mockApplicants,
  mockAuditLog,
  mockConcepts,
  mockCreatorInbox,
  mockCreatorDashboardOverview,
  mockCreatorLeaderboard,
  mockCreatorNotifications,
  mockCreatorProfile,
  mockCreatorRewards,
  mockCreatorTopics,
  mockCreatorUser,
  mockDashboardOverview,
  mockLeaderboard,
  mockLedger,
  mockMyIdeas,
  mockNotifications,
  mockPayouts,
  mockPeopleUsers,
  mockProfile,
  mockProfileOverview,
  mockReportsOverview,
  mockAdminNotifications,
  mockWorkspaceAdmins,
  mockReviewQueue,
} from '@/services/mock/mock-data';
import {
  ADMINS_URL,
  ADMIN_DETAIL_URL,
  ADMIN_NOTIFICATIONS_READ_ALL_URL,
  ADMIN_NOTIFICATIONS_URL,
  APPLICATIONS_URL,
  APPLICANTS_URL,
  AUDIT_EVENTS_URL,
  AUDIT_LOG_URL,
  AUTH_SIGN_IN_URL,
  CATEGORIES_URL,
  CATEGORY_DETAIL_URL,
  CONCEPT_DETAIL_URL,
  CONCEPT_STATUS_URL,
  CONCEPTS_URL,
  CREATOR_DASHBOARD_OVERVIEW_URL,
  CREATOR_IDEAS_SUBMIT_URL,
  CREATOR_IDEAS_URL,
  CREATOR_ME_URL,
  CREATOR_LEADERBOARD_URL,
  CREATOR_NOTIFICATIONS_READ_ALL_URL,
  CREATOR_NOTIFICATIONS_URL,
  CREATOR_PROFILE_AVATAR_URL,
  CREATOR_PROFILE_NOTIFICATIONS_URL,
  CREATOR_PROFILE_PASSWORD_URL,
  CREATOR_PROFILE_PAYOUT_URL,
  CREATOR_PROFILE_URL,
  CREATOR_REWARDS_URL,
  CREATOR_REWARDS_WITHDRAW_URL,
  CREATOR_TOPICS_URL,
  DASHBOARD_OVERVIEW_URL,
  LEADERBOARD_RECALCULATE_URL,
  LEADERBOARD_URL,
  LEDGER_MANUAL_ADJUSTMENT_URL,
  LEDGER_URL,
  PAYOUT_DETAIL_URL,
  PAYOUT_PROCESS_URL,
  PAYOUTS_URL,
  PEOPLE_URL,
  PROFILE_AVATAR_URL_URL,
  PROFILE_DISPLAY_URL,
  PROFILE_NOTIFICATIONS_URL,
  PROFILE_OVERVIEW_URL,
  PROFILE_PASSWORD_URL,
  PROFILE_UPDATE_URL,
  REPORTS_EXPORT_CSV_URL,
  REPORTS_EXPORT_URL,
  REPORTS_FINANCIAL_URL,
  REPORTS_OVERVIEW_URL,
  REPORTS_PARTICIPATION_URL,
  REPORTS_QUALITY_URL,
  REVIEW_QUEUE_URL,
  REWARDS_LEDGER_ADJUST_URL,
  REWARDS_LEDGER_URL,
  SUBMISSION_DECISION_URL,
  SUBMISSION_DETAIL_URL,
  SUBMISSION_PUBLISH_URL,
  SUBMISSION_RISK_SCAN_URL,
  SUBMISSIONS_URL,
  USER_ACCESS_STATUS_URL,
  USER_DETAIL_URL,
  USER_ROLE_URL,
  USERS_URL,
} from '@/utils/constants/api-end-points';

const MOCK_LATENCY_MS = 450;

export const MOCK_SESSION_TOKEN = 'mock-admin-session-token';

const applicantsState: Applicant[] = structuredClone(mockApplicants);
let usersState: PlatformUser[] = structuredClone(mockPeopleUsers);
const reviewQueueState: ContentSubmission[] = structuredClone(mockReviewQueue);
const payoutsState: Payout[] = structuredClone(mockPayouts);
let myIdeasState: MyIdea[] = structuredClone(mockMyIdeas);
let rewardsState: CreatorRewardsOverview = structuredClone(mockCreatorRewards);
const leaderboardState: LeaderboardEntry[] = structuredClone(mockLeaderboard);
const profileState: ProfileDetails = structuredClone(mockProfile);
let notificationsState: NotificationPreferences = structuredClone(mockNotifications);
const creatorProfileState: ProfileDetails = structuredClone(mockCreatorProfile);
let creatorNotificationsState: NotificationPreferences = structuredClone(
  mockCreatorNotifications,
);
let creatorPayoutMethodState = structuredClone(mockProfileOverview.payoutMethod);
let conceptsState: Concept[] = structuredClone(mockConcepts);
let ledgerState: LedgerEntry[] = structuredClone(mockLedger);
let auditLogState: AuditEvent[] = structuredClone(mockAuditLog);
let workspaceAdminsState: WorkspaceAdmin[] = structuredClone(mockWorkspaceAdmins);
let adminNotificationsState: AdminNotification[] = structuredClone(
  mockAdminNotifications,
);
let creatorInboxState: CreatorNotification[] = structuredClone(
  mockCreatorInbox,
);
const removedAdminEmails = new Set<string>();
let activeMockToken: string | null = null;

const ADMIN_TOKEN_PREFIX = 'mock-admin:';
const MAYA_ALIAS_SET = new Set<string>(MAYA_ADMIN_ALIASES);

function peopleSnapshot() {
  return {
    applicants: applicantsState,
    users: usersState,
  };
}

function toAdminUser(admin: WorkspaceAdmin): AuthUser {
  return {
    id: admin.id,
    display_name: admin.name,
    role: admin.access === 'owner' ? 1 : 2,
    email: admin.email,
    access_status: 'active',
  };
}

function ownerAdmin(): WorkspaceAdmin {
  const owner = workspaceAdminsState.find((admin) => admin.access === 'owner');
  if (!owner) {
    throw new Error('Platform owner is missing');
  }
  return owner;
}

function emailFromToken(token: string | null): string {
  if (token && token.startsWith(ADMIN_TOKEN_PREFIX)) {
    return token.slice(ADMIN_TOKEN_PREFIX.length).toLowerCase();
  }
  return mockAdminUser.email;
}

function findAdminByEmail(email: string): WorkspaceAdmin | undefined {
  const normalized = email.toLowerCase();
  if (MAYA_ALIAS_SET.has(normalized)) {
    return ownerAdmin();
  }
  return workspaceAdminsState.find(
    (admin) => admin.email.toLowerCase() === normalized,
  );
}

function currentWorkspaceAdmin(): WorkspaceAdmin {
  return findAdminByEmail(emailFromToken(activeMockToken)) ?? ownerAdmin();
}

function isToggleNotificationBody(body: unknown): body is ToggleNotificationBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as ToggleNotificationBody).id === 'string'
  );
}

function parseNotificationFilterParam(
  value: unknown,
): AdminNotificationFilter {
  const raw = String(value ?? '').trim();
  if ((ADMIN_NOTIFICATION_FILTERS as readonly string[]).includes(raw)) {
    return raw as AdminNotificationFilter;
  }
  return 'All';
}

function notificationsSnapshot(filterRaw?: unknown) {
  const filter = parseNotificationFilterParam(filterRaw);
  const sorted = [...adminNotificationsState].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
  const filtered = sorted.filter((item) => {
    if (filter === 'All') {
      return true;
    }
    if (filter === 'Unread') {
      return !item.read;
    }
    return item.type === filter;
  });

  return {
    notifications: filtered,
    unreadCount: adminNotificationsState.filter((item) => !item.read).length,
    total: adminNotificationsState.length,
  };
}

function isToggleCreatorNotificationBody(
  body: unknown,
): body is ToggleCreatorNotificationBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as ToggleCreatorNotificationBody).id === 'string'
  );
}

function parseCreatorNotificationFilterParam(
  value: unknown,
): CreatorNotificationFilter {
  const raw = String(value ?? '').trim();
  if ((CREATOR_NOTIFICATION_FILTERS as readonly string[]).includes(raw)) {
    return raw as CreatorNotificationFilter;
  }
  return 'All';
}

function creatorInboxSnapshot(filterRaw?: unknown) {
  const filter = parseCreatorNotificationFilterParam(filterRaw);
  const sorted = [...creatorInboxState].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
  const filtered = sorted.filter((item) => {
    if (filter === 'All') {
      return true;
    }
    if (filter === 'Unread') {
      return !item.read;
    }
    return item.type === filter;
  });

  return {
    notifications: filtered,
    unreadCount: creatorInboxState.filter((item) => !item.read).length,
    total: creatorInboxState.length,
  };
}

function isCreateAdminBody(body: unknown): body is CreateAdminBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as CreateAdminBody).email === 'string' &&
    typeof (body as CreateAdminBody).password === 'string'
  );
}

function recordAdminAudit(action: string, target: string) {
  const actor = currentWorkspaceAdmin();
  const now = new Date();
  auditLogState = [
    {
      id: `g-${Date.now()}`,
      time: formatLedgerDate(now),
      occurredAt: now.toISOString(),
      actor: actor.name,
      action,
      target,
      category: 'System',
      icon: '♔',
    },
    ...auditLogState,
  ];
}

function isCreateConceptBody(body: unknown): body is CreateConceptBody {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  const candidate = body as CreateConceptBody;
  return (
    typeof candidate.title === 'string' &&
    typeof candidate.category === 'string' &&
    typeof candidate.icon === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.opensOn === 'string' &&
    typeof candidate.closesOn === 'string' &&
    typeof candidate.reward === 'string' &&
    CONCEPT_STATUSES.includes(candidate.status)
  );
}

function isCreateAdjustmentBody(body: unknown): body is CreateAdjustmentBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as CreateAdjustmentBody).contributor === 'string' &&
    typeof (body as CreateAdjustmentBody).amount === 'string' &&
    typeof (body as CreateAdjustmentBody).reason === 'string'
  );
}

function parseAdjustmentAmount(raw: string): number | null {
  const match = raw.trim().replace(/,/g, '').match(/^([+-])?\s*(\d+)$/);
  if (!match) {
    return null;
  }

  const value = Number(match[2]);
  if (!Number.isFinite(value) || value === 0) {
    return null;
  }

  return match[1] === '-' ? -value : value;
}

function formatLedgerDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}-${date.getFullYear()}`;
}

function isWithdrawRequestBody(body: unknown): body is WithdrawRequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as WithdrawRequestBody).amount === 'string' &&
    typeof (body as WithdrawRequestBody).method === 'string'
  );
}

function parseTakaAmount(value: string): number {
  return Number(value.replace(/[^\d]/g, ''));
}

function formatTaka(value: number): string {
  return `৳${value.toLocaleString('en-US')}`;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function isUpdatePayoutMethodBody(body: unknown): body is UpdatePayoutMethodBody {
  if (typeof body !== 'object' || body === null) {
    return false;
  }
  const candidate = body as UpdatePayoutMethodBody;
  return (
    typeof candidate.label === 'string' &&
    (candidate.method === 'bKash' ||
      candidate.method === 'Nagad' ||
      candidate.method === 'Rocket' ||
      candidate.method === 'Bank')
  );
}

function creatorMeSnapshot() {
  return {
    id: creatorProfileState.id,
    name: creatorProfileState.name,
    initials: creatorProfileState.initials,
    email: creatorProfileState.email,
    bio: creatorProfileState.bio,
    joined: mockCreatorUser.joined,
  };
}

function creatorProfileSnapshot() {
  return {
    profile: creatorProfileState,
    notifications: creatorNotificationsState,
    payoutMethod: creatorPayoutMethodState,
    roleLabel: 'Contributor',
  };
}

function isDecideApplicantBody(body: unknown): body is DecideApplicantBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'id' in body &&
    'status' in body &&
    typeof (body as DecideApplicantBody).id === 'string' &&
    typeof (body as DecideApplicantBody).status === 'string'
  );
}

function isToggleUserBody(body: unknown): body is ToggleUserBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'id' in body &&
    'status' in body &&
    typeof (body as ToggleUserBody).id === 'string' &&
    typeof (body as ToggleUserBody).status === 'string'
  );
}

const DECIDABLE_STATUSES: SubmissionStatus[] = [
  'Under Review',
  'Revision Requested',
  'Approved',
  'Published',
  'Rejected',
];

function isDecideSubmissionBody(body: unknown): body is DecideSubmissionBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'id' in body &&
    'status' in body &&
    typeof (body as DecideSubmissionBody).id === 'string' &&
    DECIDABLE_STATUSES.includes((body as DecideSubmissionBody).status)
  );
}

const DECIDABLE_PAYOUT_STATUSES: Array<DecidePayoutBody['status']> = [
  'Paid',
  'Rejected',
];

function isDecidePayoutBody(body: unknown): body is DecidePayoutBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'id' in body &&
    'status' in body &&
    typeof (body as DecidePayoutBody).id === 'string' &&
    DECIDABLE_PAYOUT_STATUSES.includes(
      (body as DecidePayoutBody).status,
    )
  );
}

const PUBLIC_DISPLAYS: PublicDisplay[] = ['Public name', 'Pseudonymous'];

function isUpdateProfileBody(body: unknown): body is UpdateProfileBody {
  if (typeof body !== 'object' || body === null) {
    return false;
  }
  const candidate = body as UpdateProfileBody;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.phone === 'string' &&
    typeof candidate.bio === 'string' &&
    PUBLIC_DISPLAYS.includes(candidate.publicDisplay)
  );
}

function isUpdatePasswordBody(body: unknown): body is UpdatePasswordBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'password' in body &&
    typeof (body as UpdatePasswordBody).password === 'string' &&
    (body as UpdatePasswordBody).password.length >= 8
  );
}

function isUpdateNotificationsBody(
  body: unknown,
): body is UpdateNotificationsBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'email' in body &&
    'inApp' in body &&
    typeof (body as UpdateNotificationsBody).email === 'boolean' &&
    typeof (body as UpdateNotificationsBody).inApp === 'boolean'
  );
}

type MockHandler = (request: ApiRequest) => unknown;

const handlers: Record<string, MockHandler> = {
  [`GET ${DASHBOARD_OVERVIEW_URL}`]: () => mockDashboardOverview,
  [`POST ${AUTH_SIGN_IN_URL}`]: (request) => {
    // Mock mode mirrors the live wire format: only `user` in the body.
    // Tokens are HttpOnly cookies that the real backend sets — the mock
    // short-circuits before `fetch`, so cookies are never set here.
    const body = request.body as { email?: string } | undefined;
    const email =
      typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const isCreator = email.endsWith('@sparkory.demo');

    if (isCreator) {
      return {
        user: {
          id: mockCreatorUser.id,
          email: mockCreatorUser.email,
          display_name: mockCreatorUser.name,
          role: 3,
          access_status: 'active',
        },
      };
    }

    if (removedAdminEmails.has(email)) {
      throw new Error('This admin account has been removed.');
    }

    const admin = findAdminByEmail(email);
    const user = admin ? toAdminUser(admin) : mockAdminUser;
    void MOCK_SESSION_TOKEN;
    return { user };
  },
  [`GET ${ADMINS_URL}`]: () => {
    const admins = [...workspaceAdminsState].sort(
      (a, b) =>
        new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(),
    );

    return {
      data: admins.map((admin) => ({
        id: admin.id,
        email: admin.email,
        display_name: admin.name,
        role: admin.access === 'owner' ? 1 : 2,
        access_status: 'active',
        created_at: admin.addedAt,
        updated_at: admin.addedAt,
      })),
      meta: {
        page: 1,
        limit: 100,
        total: admins.length,
        total_pages: 1,
      },
    };
  },
  [`POST ${ADMINS_URL}`]: (request) => {
    if (currentWorkspaceAdmin().access !== 'owner') {
      throw new Error('Only a Super Admin can add admins.');
    }
    if (!isCreateAdminBody(request.body)) {
      throw new Error('Invalid admin payload');
    }

    const name = (request.body.display_name ?? '').trim();
    const email = request.body.email.trim().toLowerCase();
    const password = request.body.password;

    if (!name) {
      throw new Error('Name is required.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Enter a valid email address.');
    }
    if (email.endsWith('@sparkory.demo')) {
      throw new Error('Contributor emails cannot be granted admin access.');
    }
    if (
      MAYA_ALIAS_SET.has(email) ||
      workspaceAdminsState.some((admin) => admin.email.toLowerCase() === email)
    ) {
      throw new Error('An admin with this email already exists.');
    }

    removedAdminEmails.delete(email);

    const now = new Date();
    const admin: WorkspaceAdmin = {
      id: `usr-${Date.now()}`,
      name,
      email,
      access: 'admin',
      roleLabel: 'Admin',
      initials: initialsFromName(name),
      addedOn: formatLedgerDate(now),
      addedAt: now.toISOString(),
    };

    workspaceAdminsState = [...workspaceAdminsState, admin];
    adminNotificationsState = [
      {
        id: `n-${Date.now()}`,
        icon: '♔',
        iconBg: 'var(--surface-subtle)',
        title: 'New admin added',
        body: `${name} can now sign in to the admin workspace.`,
        time: 'Just now',
        type: 'System',
        read: false,
        occurredAt: now.toISOString(),
      },
      ...adminNotificationsState,
    ];
    recordAdminAudit('Added admin', `${name} · ${email}`);

    return {
      id: admin.id,
      email: admin.email,
      display_name: admin.name,
      role: 2,
      access_status: 'active',
      created_at: admin.addedAt,
      updated_at: admin.addedAt,
    };
  },
  [`DELETE ${ADMIN_DETAIL_URL(':id')}`]: (request) => {
    if (currentWorkspaceAdmin().access !== 'owner') {
      throw new Error('Only a Super Admin can remove admins.');
    }

    const id = String(request.params?.id ?? '').trim();
    const admin = workspaceAdminsState.find((item) => item.id === id);

    if (!admin) {
      throw new Error('Admin not found.');
    }
    if (admin.access === 'owner') {
      throw new Error('The Super Admin cannot be removed.');
    }

    workspaceAdminsState = workspaceAdminsState.filter((item) => item.id !== id);
    removedAdminEmails.add(admin.email.toLowerCase());
    recordAdminAudit('Removed admin', `${admin.name} · ${admin.email}`);

    return { deleted: true };
  },
  [`GET ${ADMIN_NOTIFICATIONS_URL}`]: (request) =>
    notificationsSnapshot(request.params?.filter),
  [`PATCH ${ADMIN_NOTIFICATIONS_URL}`]: (request) => {
    const body = request.body;
    if (!isToggleNotificationBody(body)) {
      throw new Error('Invalid notification payload');
    }

    const notification = adminNotificationsState.find(
      (item) => item.id === body.id,
    );
    if (!notification) {
      throw new Error('Notification not found.');
    }

    notification.read = !notification.read;
    return { notification };
  },
  [`POST ${ADMIN_NOTIFICATIONS_READ_ALL_URL}`]: () => {
    adminNotificationsState = adminNotificationsState.map((item) => ({
      ...item,
      read: true,
    }));

    return { unreadCount: 0 };
  },
  [`GET ${CONCEPTS_URL}`]: (request) => {
    const status = request.params?.status;
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();

    const filtered = conceptsState.filter((concept) => {
      const matchesStatus =
        !status ||
        status === 'all' ||
        concept.status === (status as ConceptStatus);
      const matchesSearch =
        search.length === 0 ||
        concept.title.toLowerCase().includes(search) ||
        concept.category.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });

    return {
      concepts: filtered,
      total: conceptsState.length,
    };
  },
  [`POST ${CONCEPTS_URL}`]: (request) => {
    if (!isCreateConceptBody(request.body)) {
      throw new Error('Invalid concept payload');
    }

    const title = request.body.title.trim();
    const category = request.body.category.trim();
    const description = request.body.description.trim();

    if (!title) {
      throw new Error('Title is required.');
    }
    if (!category) {
      throw new Error('Pick a category before saving.');
    }
    if (!description) {
      throw new Error('Description is required.');
    }

    const concept: Concept = {
      id: `c-${Date.now()}`,
      title,
      category,
      description,
      status: request.body.status,
      icon: request.body.icon.trim() || '✦',
      opensOn: request.body.opensOn.trim() || '—',
      closesOn: request.body.closesOn.trim() || '—',
      reward: request.body.reward.trim() || '—',
    };

    conceptsState = [concept, ...conceptsState];

    return {
      concept,
      createdAt: new Date().toISOString(),
    };
  },
  [`GET ${PEOPLE_URL}`]: () => peopleSnapshot(),
  [`PATCH ${APPLICANTS_URL}`]: (request) => {
    if (!isDecideApplicantBody(request.body)) {
      throw new Error('Invalid applicant decision payload');
    }

    const { id, status } = request.body;
    const applicant = applicantsState.find((item) => item.id === id);

    if (!applicant) {
      throw new Error('Applicant not found');
    }

    applicant.status = status;

    if (status === 'Approved') {
      const alreadyInvited = usersState.some((user) => user.invitedFrom === id);

      if (!alreadyInvited) {
        usersState = [
          ...usersState,
          {
            id: `u-${id}`,
            name: applicant.name,
            email: applicant.email,
            status: 'Invited',
            approved: 0,
            balance: 'Tk 0',
            joined: '07-08-2026',
            hasLiveSubmission: false,
            invitedFrom: id,
          },
        ];
      }
    }

    return peopleSnapshot();
  },
  [`PATCH ${USERS_URL}`]: (request) => {
    if (!isToggleUserBody(request.body)) {
      throw new Error('Invalid user status payload');
    }

    const { id, status } = request.body;
    const user = usersState.find((item) => item.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    user.status = status;
    return peopleSnapshot();
  },
  [`GET ${REVIEW_QUEUE_URL}`]: () => ({
    submissions: reviewQueueState,
  }),
  [`GET ${REWARDS_LEDGER_URL}`]: (request) => {
    const type = request.params?.type as LedgerTypeFilter | undefined;
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();

    const filtered = ledgerState
      .filter((entry: LedgerEntry) => {
        const matchesType = !type || type === 'all' || entry.type === type;
        const matchesSearch =
          search.length === 0 ||
          entry.contributor.toLowerCase().includes(search) ||
          entry.description.toLowerCase().includes(search);

        return matchesType && matchesSearch;
      })
      .sort(
        (a: LedgerEntry, b: LedgerEntry) =>
          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      );

    return {
      entries: filtered,
      total: ledgerState.length,
    };
  },
  [`POST ${REWARDS_LEDGER_ADJUST_URL}`]: (request) => {
    if (!isCreateAdjustmentBody(request.body)) {
      throw new Error('Invalid adjustment payload');
    }

    const contributor = request.body.contributor.trim();
    const reason = request.body.reason.trim();
    const signed = parseAdjustmentAmount(request.body.amount);

    if (!contributor) {
      throw new Error('Contributor is required.');
    }
    if (signed === null) {
      throw new Error('Enter a non-zero amount such as -20 or +50.');
    }
    if (!reason) {
      throw new Error('Reason is required.');
    }

    const now = new Date();
    const abs = Math.abs(signed);
    const signedLabel = signed < 0 ? `−Tk ${abs}` : `+Tk ${abs}`;
    const entry: LedgerEntry = {
      id: `l-${Date.now()}`,
      contributor,
      description: `Manual adjustment · ${reason}`,
      date: formatLedgerDate(now),
      occurredAt: now.toISOString(),
      type: 'Adjustment',
      amount: signedLabel,
      amountValue: abs,
      status: 'Recorded',
    };

    ledgerState = [entry, ...ledgerState];
    auditLogState = [
      {
        id: `g-${Date.now()}`,
        time: formatLedgerDate(now),
        occurredAt: now.toISOString(),
        actor: 'Maya Admin',
        action: 'Balance adjustment',
        target: `${signed < 0 ? '-' : '+'}Tk ${abs} · ${contributor} · ${reason}`,
        category: 'Payouts',
        icon: '৳',
      },
      ...auditLogState,
    ];

    return {
      entry,
      createdAt: now.toISOString(),
    };
  },
  [`PATCH ${REVIEW_QUEUE_URL}`]: (request) => {
    if (!isDecideSubmissionBody(request.body)) {
      throw new Error('Invalid submission decision payload');
    }

    const { id, status } = request.body;
    const submission = reviewQueueState.find((item) => item.id === id);

    if (!submission) {
      throw new Error('Submission not found');
    }

    submission.status = status;
    return { submissions: reviewQueueState };
  },
  [`GET ${PAYOUTS_URL}`]: (request) => {
    const status = request.params?.status as PayoutStatusFilter | undefined;
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();

    const filtered = payoutsState
      .filter((payout: Payout) => {
        const matchesStatus =
          !status || status === 'all' || payout.status === status;
        const matchesSearch =
          search.length === 0 ||
          payout.contributor.toLowerCase().includes(search) ||
          payout.methodDetail.toLowerCase().includes(search);

        return matchesStatus && matchesSearch;
      })
      .sort(
        (a: Payout, b: Payout) =>
          new Date(b.requestedAt).getTime() -
          new Date(a.requestedAt).getTime(),
      );

    return {
      payouts: filtered,
      total: payoutsState.length,
    };
  },
  [`PATCH ${PAYOUTS_URL}`]: (request) => {
    if (!isDecidePayoutBody(request.body)) {
      throw new Error('Invalid payout decision payload');
    }

    const { id, status } = request.body;
    const payout = payoutsState.find((item) => item.id === id);

    if (!payout) {
      throw new Error('Payout not found');
    }

    payout.status = status;
    return { payouts: payoutsState, total: payoutsState.length };
  },
  [`GET ${LEADERBOARD_URL}`]: (request) => {
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();

    const filtered = leaderboardState.filter((entry) => {
      if (search.length === 0) {
        return true;
      }
      return entry.name.toLowerCase().includes(search);
    });

    const rankedCount = leaderboardState.length;
    const totalPoints = leaderboardState.reduce(
      (sum, entry) => sum + entry.points,
      0,
    );
    const topScore = leaderboardState[0]?.points ?? 0;
    const averagePoints = rankedCount === 0 ? 0 : totalPoints / rankedCount;

    return {
      entries: filtered,
      topScore,
      rankedCount,
      averagePoints,
    };
  },
  [`POST ${LEADERBOARD_RECALCULATE_URL}`]: () => ({
    recalculatedAt: new Date().toISOString(),
  }),
  [`GET ${REPORTS_OVERVIEW_URL}`]: () => mockReportsOverview,
  [`POST ${REPORTS_EXPORT_URL}`]: () => {
    const stamp = new Date().toISOString();
    const day = stamp.slice(0, 10);

    return {
      exportedAt: stamp,
      filename: `ideapad-report-${day}.csv`,
    };
  },
  [`GET ${AUDIT_LOG_URL}`]: (request) => {
    const category = String(request.params?.category ?? '').trim();
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();

    const filtered = auditLogState
      .filter((event) => {
        const matchesCategory =
          !category || category === 'all' || category === 'All'
            ? true
            : event.category === category;

        const matchesSearch =
          search.length === 0 ||
          event.actor.toLowerCase().includes(search) ||
          event.action.toLowerCase().includes(search) ||
          event.target.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() -
          new Date(a.occurredAt).getTime(),
      );

    return {
      events: filtered,
      total: auditLogState.length,
    };
  },
  [`GET ${PROFILE_OVERVIEW_URL}`]: () => ({
    profile: {
      ...profileState,
      role: currentWorkspaceAdmin().access === 'owner' ? 1 : 2,
    },
    notifications: notificationsState,
    payoutMethod: mockProfileOverview.payoutMethod,
    roleLabel: mockProfileOverview.roleLabel,
  }),
  [`PATCH ${PROFILE_UPDATE_URL}`]: (request) => {
    if (!isUpdateProfileBody(request.body)) {
      throw new Error('Invalid profile update payload');
    }
    const { name, email, phone, bio, publicDisplay, avatarUrl } = request.body;
    profileState.name = name;
    profileState.email = email;
    profileState.phone = phone;
    profileState.bio = bio;
    profileState.publicDisplay = publicDisplay;
    if (avatarUrl !== undefined) {
      profileState.avatarUrl = avatarUrl;
    }
    return { updatedAt: new Date().toISOString() };
  },
  [`POST ${PROFILE_PASSWORD_URL}`]: (request) => {
    if (!isUpdatePasswordBody(request.body)) {
      throw new Error('Password must be at least 8 characters');
    }
    return { updatedAt: new Date().toISOString() };
  },
  [`PATCH ${PROFILE_NOTIFICATIONS_URL}`]: (request) => {
    if (!isUpdateNotificationsBody(request.body)) {
      throw new Error('Invalid notifications payload');
    }
    notificationsState = {
      email: request.body.email,
      inApp: request.body.inApp,
    };
    return notificationsState;
  },
  [`POST ${PROFILE_AVATAR_URL_URL}`]: (request) => {
    if (
      !request.body ||
      typeof request.body !== 'object' ||
      typeof (request.body as { dataUrl?: unknown }).dataUrl !== 'string'
    ) {
      throw new Error('Invalid avatar payload');
    }
    const { dataUrl } = request.body as { dataUrl: string };
    profileState.avatarUrl = dataUrl;
    return profileState;
  },
  // ── Creator workspace ────────────────────────────────────────────────────
  [`GET ${CREATOR_ME_URL}`]: () => creatorMeSnapshot(),
  [`GET ${CREATOR_PROFILE_URL}`]: () => creatorProfileSnapshot(),
  [`PATCH ${CREATOR_PROFILE_URL}`]: (request) => {
    if (!isUpdateProfileBody(request.body)) {
      throw new Error('Invalid profile update payload');
    }
    const { name, email, phone, bio, publicDisplay, avatarUrl } = request.body;
    creatorProfileState.name = name;
    creatorProfileState.initials = initialsFromName(name) || creatorProfileState.initials;
    creatorProfileState.email = email;
    creatorProfileState.phone = phone;
    creatorProfileState.bio = bio;
    creatorProfileState.publicDisplay = publicDisplay;
    if (avatarUrl !== undefined) {
      creatorProfileState.avatarUrl = avatarUrl;
    }
    return { updatedAt: new Date().toISOString() };
  },
  [`POST ${CREATOR_PROFILE_PASSWORD_URL}`]: (request) => {
    if (!isUpdatePasswordBody(request.body)) {
      throw new Error('Password must be at least 8 characters');
    }
    return { updatedAt: new Date().toISOString() };
  },
  [`PATCH ${CREATOR_PROFILE_NOTIFICATIONS_URL}`]: (request) => {
    if (!isUpdateNotificationsBody(request.body)) {
      throw new Error('Invalid notifications payload');
    }
    creatorNotificationsState = {
      email: request.body.email,
      inApp: request.body.inApp,
    };
    return creatorNotificationsState;
  },
  [`POST ${CREATOR_PROFILE_AVATAR_URL}`]: (request) => {
    if (
      !request.body ||
      typeof request.body !== 'object' ||
      typeof (request.body as { dataUrl?: unknown }).dataUrl !== 'string'
    ) {
      throw new Error('Invalid avatar payload');
    }
    creatorProfileState.avatarUrl = (request.body as { dataUrl: string }).dataUrl;
    return creatorProfileState;
  },
  [`PATCH ${CREATOR_PROFILE_PAYOUT_URL}`]: (request) => {
    if (!isUpdatePayoutMethodBody(request.body)) {
      throw new Error('Invalid payout method payload');
    }
    creatorPayoutMethodState = {
      method: request.body.method,
      label: request.body.label,
    };
    rewardsState = {
      ...rewardsState,
      payoutMethod: request.body.label,
    };
    return creatorPayoutMethodState;
  },
  [`GET ${CREATOR_DASHBOARD_OVERVIEW_URL}`]: () => mockCreatorDashboardOverview,
  [`GET ${CREATOR_TOPICS_URL}`]: () => ({ topics: mockCreatorTopics }),
  [`GET ${CREATOR_REWARDS_URL}`]: () => rewardsState,
  [`GET ${CREATOR_NOTIFICATIONS_URL}`]: (request) =>
    creatorInboxSnapshot(request.params?.filter),
  [`PATCH ${CREATOR_NOTIFICATIONS_URL}`]: (request) => {
    const body = request.body;
    if (!isToggleCreatorNotificationBody(body)) {
      throw new Error('Invalid notification payload');
    }

    const notification = creatorInboxState.find((item) => item.id === body.id);
    if (!notification) {
      throw new Error('Notification not found.');
    }

    notification.read = !notification.read;
    return { notification };
  },
  [`POST ${CREATOR_NOTIFICATIONS_READ_ALL_URL}`]: () => {
    creatorInboxState = creatorInboxState.map((item) => ({
      ...item,
      read: true,
    }));

    return { unreadCount: 0 };
  },
  [`GET ${CREATOR_LEADERBOARD_URL}`]: () => mockCreatorLeaderboard,
  [`POST ${CREATOR_REWARDS_WITHDRAW_URL}`]: (request) => {
    if (!isWithdrawRequestBody(request.body)) {
      throw new Error('Invalid withdrawal payload');
    }

    const amount = parseTakaAmount(request.body.amount);
    const available = parseTakaAmount(rewardsState.available);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Enter a valid amount');
    }

    if (amount > available) {
      throw new Error('Amount exceeds available balance');
    }

    const methodLabel = request.body.method.split(' · ')[0] || 'bKash';
    const mobileDetail =
      (request.body as { mobile?: string; details?: { mobile?: string } })
        .mobile ??
      (request.body as { details?: { mobile?: string } }).details?.mobile;
    const descMethod = mobileDetail
      ? `${methodLabel} (${mobileDetail})`
      : methodLabel;
    const reference = `TX${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const entry = {
      id: `wd-${Date.now()}`,
      description: `${descMethod} payout · ${reference}`,
      date: formatShortDate(new Date()),
      type: 'Withdrawal' as const,
      amount: `−${formatTaka(amount)}`,
      status: 'Pending' as const,
    };

    rewardsState = {
      ...rewardsState,
      available: formatTaka(available - amount),
      entries: [entry, ...rewardsState.entries],
    };

    return {
      requestedAt: new Date().toISOString(),
      entry,
    };
  },
  [`GET ${CREATOR_IDEAS_URL}`]: (request) => {
    const status = request.params?.status as MyIdeasStatusFilter | undefined;
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();

    const filtered = myIdeasState
      .filter((idea) => {
        const matchesStatus =
          !status || status === 'all' || idea.status === status;
        const matchesSearch =
          search.length === 0 ||
          idea.title.toLowerCase().includes(search) ||
          idea.topic.toLowerCase().includes(search);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        // Newest-first using dd-mm-yyyy parsing.
        const [da, ma, ya] = a.submitted.split('-').map(Number);
        const [db, mb, yb] = b.submitted.split('-').map(Number);
        return (
          new Date(yb, (mb ?? 1) - 1, db ?? 1).getTime() -
          new Date(ya, (ma ?? 1) - 1, da ?? 1).getTime()
        );
      });

    return { ideas: filtered, total: myIdeasState.length };
  },
  [`POST ${CREATOR_IDEAS_SUBMIT_URL}`]: (request) => {
    const body = request.body as Partial<SubmitIdeaBody> | undefined;
    if (
      !body ||
      typeof body.title !== 'string' ||
      typeof body.topicId !== 'string' ||
      typeof body.summary !== 'string' ||
      typeof body.body !== 'string'
    ) {
      throw new Error('Invalid idea submission payload');
    }
    if (body.title.length === 0 || body.title.length > 80) {
      throw new Error('Title must be 1-80 characters');
    }
    if (body.summary.length === 0 || body.summary.length > 240) {
      throw new Error('Summary must be 1-240 characters');
    }
    if (body.body.length === 0 || body.body.length > 4000) {
      throw new Error('Body must be 1-4000 characters');
    }

    const topic = mockCreatorTopics.find((t) => t.id === body.topicId);
    if (!topic) {
      throw new Error('Unknown topic');
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    const newIdea: MyIdea = {
      id: `idea_${Date.now()}`,
      title: body.title,
      topic: topic.title,
      submitted: `${dd}-${mm}-${yyyy}`,
      status: 'Submitted',
      reward: '—',
      comments: 0,
      body: body.summary,
    };
    myIdeasState = [newIdea, ...myIdeasState];

    return { idea: newIdea, createdAt: today.toISOString() };
  },

  // ── REST spec §5 — Categories (mock) ─────────────────────────────────
  [`GET ${CATEGORIES_URL}`]: (request) => {
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();
    const filtered = categoriesState.filter(
      (cat) =>
        search.length === 0 || cat.name.toLowerCase().includes(search),
    );
    return {
      data: filtered,
      meta: {
        page: Number(request.params?.page ?? 1),
        limit: Number(request.params?.limit ?? 50),
        totalItems: filtered.length,
        totalPages: 1,
      },
    };
  },
  [`POST ${CATEGORIES_URL}`]: (request) => {
    const body = request.body as { name?: string; icon?: string } | undefined;
    const incomingName = body?.name?.trim();
    if (!incomingName) {
      throw new Error('Name is required.');
    }
    if (
      categoriesState.some(
        (c) => c.name.toLowerCase() === incomingName.toLowerCase(),
      )
    ) {
      throw new Error('A category with this name already exists.');
    }
    const cat: MockCategory = {
      id: `cat-${Date.now()}`,
      name: incomingName,
      icon: body?.icon?.trim() || '✦',
      isActive: true,
    };
    categoriesState = [...categoriesState, cat];
    pushAuditEvent('Category created', cat.name, 'System');
    pushAdminNotification({
      icon: '✦',
      iconBg: 'var(--surface-subtle)',
      title: 'New category created',
      body: `${cat.name} is now available for new concepts.`,
      type: 'System',
    });
    return {
      category: cat,
      createdAt: new Date().toISOString(),
    };
  },
  [`PATCH ${CATEGORY_DETAIL_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const cat = categoriesState.find((c) => c.id === id);
    if (!cat) {
      throw new Error('Category not found.');
    }
    const body = request.body as Partial<MockCategory> | undefined;
    if (body?.name) cat.name = body.name.trim();
    if (body?.icon) cat.icon = body.icon.trim();
    if (typeof body?.isActive === 'boolean') cat.isActive = body.isActive;
    categoriesState = categoriesState.map((c) => (c.id === id ? { ...cat } : c));
    pushAuditEvent('Category updated', cat.name, 'System');
    return {
      category: { ...cat },
      updatedAt: new Date().toISOString(),
    };
  },
  [`DELETE ${CATEGORY_DETAIL_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const cat = categoriesState.find((c) => c.id === id);
    if (!cat) {
      throw new Error('Category not found.');
    }
    categoriesState = categoriesState.filter((c) => c.id !== id);
    pushAuditEvent('Category deleted', cat.name, 'System');
    return { id, deletedAt: new Date().toISOString() };
  },

  // ── REST spec §5.3 — Concepts (mock) ─────────────────────────────────
  [`GET ${CONCEPT_DETAIL_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const concept = conceptsState.find((c) => c.id === id);
    if (!concept) {
      throw new Error('Concept not found.');
    }
    return {
      concept: {
        ...concept,
        openDate: concept.opensOn,
        closeDate: concept.closesOn,
        rewardGuidance: concept.reward,
      },
    };
  },
  [`PATCH ${CONCEPT_DETAIL_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const concept = conceptsState.find((c) => c.id === id);
    if (!concept) {
      throw new Error('Concept not found.');
    }
    const body = request.body as Record<string, unknown> | undefined;
    if (body) {
      if (typeof body.title === 'string') concept.title = body.title;
      if (typeof body.brief === 'string') concept.description = body.brief;
      else if (typeof body.description === 'string') concept.description = body.description;

      const meta = body.metadata as Record<string, unknown> | undefined;
      if (meta && typeof meta.icon === 'string') concept.icon = meta.icon;
      else if (typeof body.icon === 'string') concept.icon = body.icon;

      if (typeof body.category_id === 'string') {
        concept.categoryId = body.category_id;
        const matchedCat = categoriesState.find((c) => c.id === body.category_id);
        if (matchedCat) {
          concept.category = matchedCat.name;
          concept.icon = matchedCat.icon || concept.icon;
        }
      } else if (typeof body.category === 'string') {
        concept.category = body.category;
      }

      if (typeof body.reward_budget === 'number') {
        concept.reward = `৳${body.reward_budget.toLocaleString('en-US')}`;
      } else if (typeof body.reward === 'string') {
        concept.reward = body.reward;
      }

      if (typeof body.status === 'string' && CONCEPT_STATUSES.includes(body.status as ConceptStatus)) {
        concept.status = body.status as ConceptStatus;
      }

      if (typeof body.open_date === 'string') {
        const d = new Date(body.open_date);
        concept.opensOn = !Number.isNaN(d.getTime()) ? format(d, 'd MMM') : body.open_date;
      } else if (typeof body.opensOn === 'string') {
        concept.opensOn = body.opensOn;
      }

      if (typeof body.close_date === 'string') {
        const d = new Date(body.close_date);
        concept.closesOn = !Number.isNaN(d.getTime()) ? format(d, 'd MMM') : body.close_date;
      } else if (typeof body.closesOn === 'string') {
        concept.closesOn = body.closesOn;
      }
    }
    pushAuditEvent('Concept updated', concept.title, 'Content');
    return {
      concept: { ...concept },
      updatedAt: new Date().toISOString(),
    };
  },
  [`PATCH ${CONCEPT_STATUS_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const concept = conceptsState.find((c) => c.id === id);
    if (!concept) {
      throw new Error('Concept not found.');
    }
    const body = request.body as { status?: string } | undefined;
    if (!body || !['draft', 'scheduled', 'active', 'archived'].includes(String(body.status))) {
      throw new Error('Invalid status transition.');
    }
    const previousStatus = concept.status;
    concept.status = body.status as ConceptStatus;
    pushAuditEvent(
      'Concept transitioned',
      `${concept.title}: ${previousStatus} → ${concept.status}`,
      'Content',
    );
    return {
      id: concept.id,
      status: concept.status,
      transitionedAt: new Date().toISOString(),
    };
  },
  [`DELETE ${CONCEPT_DETAIL_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const concept = conceptsState.find((c) => c.id === id);
    if (!concept) {
      throw new Error('Concept not found.');
    }
    conceptsState = conceptsState.filter((c) => c.id !== id);
    pushAuditEvent('Concept deleted', concept.title, 'Content');
    return { id, deletedAt: new Date().toISOString() };
  },

  // ── REST spec §5.4 — Applications (mock) ─────────────────────────────
  [`GET ${APPLICATIONS_URL}`]: (request) => {
    const status = String(request.params?.status ?? '').trim();
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();
    const filtered = applicationsState.filter((app) => {
      const matchesStatus = !status || status === 'all' || app.status === status;
      const matchesSearch =
        search.length === 0 ||
        (app.applicantName ?? '').toLowerCase().includes(search) ||
        app.ideaTitle.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
    return {
      data: filtered,
      total: filtered.length,
    };
  },
  [`POST ${APPLICATIONS_URL}`]: () => {
    // Spec defines this for completeness; mock just acknowledges.
    return { data: [], total: 0 };
  },
  [`GET ${CATEGORY_DETAIL_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const cat = categoriesState.find((c) => c.id === id);
    if (!cat) {
      throw new Error('Category not found.');
    }
    return cat;
  },

  // ── REST spec §5.5 — Submissions (mock) ──────────────────────────────
  [`GET ${SUBMISSIONS_URL}`]: (request) => {
    const status = String(request.params?.status ?? '').trim();
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();
    const filtered = reviewQueueState.filter((sub) => {
      const matchesStatus = !status || status === 'all' || sub.status === status;
      const matchesSearch =
        search.length === 0 ||
        sub.title.toLowerCase().includes(search) ||
        sub.contributor.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
    return { data: filtered, total: filtered.length };
  },
  [`GET ${SUBMISSION_DETAIL_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const submission = reviewQueueState.find((s) => s.id === id);
    if (!submission) {
      throw new Error('Submission not found.');
    }
    return {
      submission: {
        ...submission,
        version: 1,
        risk_signal: {
          originalityScore: 78,
          aiLikelihoodScore: submission.risk === 'High' ? 88 : submission.risk === 'Medium' ? 45 : 12,
          risk: submission.risk,
          scannedAt: new Date().toISOString(),
        },
      },
    };
  },
  [`POST ${SUBMISSION_DECISION_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const submission = reviewQueueState.find((s) => s.id === id);
    if (!submission) {
      throw new Error('Submission not found.');
    }
    const body = request.body as MockSubmissionDecision | undefined;
    if (!body || !['approve', 'request_revision', 'reject'].includes(body.decision)) {
      throw new Error('Invalid decision payload.');
    }

    const previousStatus = submission.status;
    if (body.decision === 'approve') {
      submission.status = 'Approved';
      if (typeof body.reward_amount === 'number' && body.reward_amount > 0) {
        pushLedgerEntry({
          contributor: submission.contributor,
          type: 'Reward',
          amountValue: body.reward_amount,
          status: 'Recorded',
          description: `Reward for ${submission.title}`,
        });
      }
      pushAdminNotification({
        icon: '✓',
        iconBg: 'var(--success-subtle)',
        title: 'Submission approved',
        body: `${submission.title} by ${submission.contributor} was approved.`,
        type: 'Review',
      });
    } else if (body.decision === 'request_revision') {
      submission.status = 'Revision Requested';
      pushAdminNotification({
        icon: '⚑',
        iconBg: 'var(--warning-subtle)',
        title: 'Revision requested',
        body: `${submission.title} needs revisions from ${submission.contributor}.`,
        type: 'Review',
      });
    } else {
      submission.status = 'Rejected';
      pushAdminNotification({
        icon: '✕',
        iconBg: 'var(--danger-subtle)',
        title: 'Submission rejected',
        body: `${submission.title} was rejected.`,
        type: 'Review',
      });
    }

    pushAuditEvent(
      `submission.${body.decision}`,
      `${submission.title}: ${previousStatus} → ${submission.status}`,
      'Content',
    );

    return {
      id: submission.id,
      status: submission.status,
      feedback: body.feedback,
      reward_amount: body.reward_amount,
      decidedAt: new Date().toISOString(),
    };
  },
  [`POST ${SUBMISSION_PUBLISH_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const submission = reviewQueueState.find((s) => s.id === id);
    if (!submission) {
      throw new Error('Submission not found.');
    }
    submission.status = 'Published';
    pushAuditEvent('submission.publish', submission.title, 'Content');
    return {
      id: submission.id,
      status: submission.status,
      publishedAt: new Date().toISOString(),
    };
  },
  [`POST ${SUBMISSION_RISK_SCAN_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const submission = reviewQueueState.find((s) => s.id === id);
    if (!submission) {
      throw new Error('Submission not found.');
    }
    return {
      id,
      risk_signal: {
        originalityScore: 60 + Math.floor(Math.random() * 35),
        aiLikelihoodScore: 5 + Math.floor(Math.random() * 30),
        risk: submission.risk,
        notes: 'Re-scan complete.',
        scannedAt: new Date().toISOString(),
      },
    };
  },

  // ── REST spec §5.6 — Payouts (mock) ──────────────────────────────────
  [`GET ${PAYOUT_DETAIL_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const payout = payoutsState.find((p) => p.id === id);
    if (!payout) {
      throw new Error('Payout not found.');
    }
    return {
      payout: {
        ...payout,
        userId: payout.contributor,
        processingReference: '',
      },
    };
  },
  [`POST ${PAYOUT_PROCESS_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const payout = payoutsState.find((p) => p.id === id);
    if (!payout) {
      throw new Error('Payout not found.');
    }
    const body = request.body as MockProcessPayout | undefined;
    if (!body || !['mark_paid', 'reject'].includes(body.action)) {
      throw new Error('Invalid process action.');
    }

    const now = new Date();
    if (body.action === 'mark_paid') {
      payout.status = 'Paid';
      pushLedgerEntry({
        contributor: payout.contributor,
        type: 'Withdrawal',
        amountValue: -payout.amountValue,
        status: 'Recorded',
        description: `Payout · ${payout.methodDetail}`,
      });
      pushAdminNotification({
        icon: '৳',
        iconBg: 'var(--surface-subtle)',
        title: 'Payout paid',
        body: `${payout.amount} sent to ${payout.contributor} via ${payout.methodDetail}.`,
        type: 'Payouts',
      });
      pushAuditEvent(
        'payout.mark_paid',
        `${payout.contributor} · ${payout.amount}`,
        'Payouts',
      );
      return {
        id: payout.id,
        status: payout.status,
        processingReference: body.processing_reference,
        decidedAt: now.toISOString(),
      };
    }

    payout.status = 'Rejected';
    pushAdminNotification({
      icon: '✕',
      iconBg: 'var(--danger-subtle)',
      title: 'Payout rejected',
      body: `Withdrawal for ${payout.contributor} was rejected.`,
      type: 'Payouts',
    });
    pushAuditEvent(
      'payout.reject',
      `${payout.contributor} · ${payout.amount}`,
      'Payouts',
    );
    return {
      id: payout.id,
      status: payout.status,
      rejectionReason: body.rejection_reason,
      decidedAt: now.toISOString(),
    };
  },

  // ── REST spec §5.6 — Ledger (mock) ───────────────────────────────────
  [`GET ${LEDGER_URL}`]: (request) => {
    const type = String(request.params?.type ?? '');
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();
    const filtered = ledgerState
      .filter((entry) => {
        const matchesType =
          !type || type === 'all' || entry.type === type;
        const matchesSearch =
          search.length === 0 ||
          entry.contributor.toLowerCase().includes(search) ||
          entry.description.toLowerCase().includes(search);
        return matchesType && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() -
          new Date(a.occurredAt).getTime(),
      );
    return {
      entries: filtered,
      total: filtered.length,
    };
  },
  [`POST ${LEDGER_MANUAL_ADJUSTMENT_URL}`]: (request) => {
    const body = request.body as MockManualAdjustment | undefined;
    if (!body) {
      throw new Error('Invalid adjustment payload.');
    }
    if (!body.user_id) throw new Error('User is required.');
    if (!Number.isFinite(body.amount) || body.amount === 0) {
      throw new Error('Amount must be a non-zero number.');
    }
    if (!body.reason) throw new Error('Reason is required.');

    const entry = pushLedgerEntry({
      contributor: body.user_id,
      type: 'Adjustment',
      amountValue: body.amount,
      status: 'Recorded',
      description: body.description || `Manual adjustment · ${body.reason}`,
    });
    pushAuditEvent(
      'ledger.manual_adjustment',
      `${body.amount > 0 ? '+' : ''}Tk ${Math.abs(body.amount)} · ${body.reason}`,
      'Payouts',
    );
    return {
      entry,
      createdAt: new Date().toISOString(),
    };
  },

  // ── REST spec §5.7 — Users (mock) ────────────────────────────────────
  [`GET ${USERS_URL}`]: (request) => {
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();
    const filtered = usersState.filter(
      (u) =>
        search.length === 0 ||
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search),
    );
    return {
      data: filtered,
      total: filtered.length,
    };
  },
  [`GET ${USER_DETAIL_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const user = usersState.find((u) => u.id === id);
    if (!user) {
      throw new Error('User not found.');
    }
    return {
      user: {
        ...user,
        recentActivity: [
          {
            id: 'a-1',
            type: 'submission',
            description: 'Most recent submission',
            at: new Date().toISOString(),
          },
        ],
      },
    };
  },
  [`PATCH ${USER_ACCESS_STATUS_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const user = usersState.find((u) => u.id === id);
    if (!user) {
      throw new Error('User not found.');
    }
    const body = request.body as { accessStatus?: string; reason?: string } | undefined;
    if (!body || !['Active', 'Invited', 'Suspended'].includes(String(body.accessStatus))) {
      throw new Error('Invalid access status.');
    }
    user.status = body.accessStatus as PlatformUserStatus;
    pushAuditEvent(
      'user.access_status_changed',
      `${user.name} → ${user.status}${body.reason ? ' · ' + body.reason : ''}`,
      'System',
    );
    return {
      id: user.id,
      status: user.status,
      updatedAt: new Date().toISOString(),
    };
  },
  [`PATCH ${USER_ROLE_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const user = usersState.find((u) => u.id === id);
    if (!user) {
      throw new Error('User not found.');
    }
    const body = request.body as { role?: unknown } | undefined;
    const role = Number(body?.role);
    if (!isPlatformRole(role)) {
      throw new Error('Invalid role.');
    }
    pushAuditEvent(
      'user.role_changed',
      `${user.name} → ${formatPlatformRole(role)}`,
      'System',
    );
    return {
      id: user.id,
      status: user.status,
      updatedAt: new Date().toISOString(),
    };
  },
  [`DELETE ${USER_DETAIL_URL(':id')}`]: (request) => {
    const id = String(request.params?.id ?? '');
    const user = usersState.find((u) => u.id === id);
    if (!user) {
      throw new Error('User not found.');
    }
    usersState = usersState.filter((u) => u.id !== id);
    pushAuditEvent('user.deleted', `${user.name} · ${user.email}`, 'System');
    return { id, deletedAt: new Date().toISOString() };
  },

  // ── REST spec §5.8 — Reports (mock) ──────────────────────────────────
  [`GET ${REPORTS_PARTICIPATION_URL}`]: () => ({
    applicationsSubmitted: 14,
    applicationsApproved: 9,
    submissionsCreated: 38,
    submissionsApproved: 27,
    participationRate: 0.71,
    periodLabel: 'Last 30 days',
  }),
  [`GET ${REPORTS_QUALITY_URL}`]: () => ({
    byCategory: [
      { id: 'q1', category: 'Urban Innovation', total: 18, active: 12, rewardSum: 'Tk 36,000' },
      { id: 'q2', category: 'Climate Action', total: 11, active: 8, rewardSum: 'Tk 22,500' },
    ],
    byStatus: [
      { id: 's1', status: 'Approved', count: 27 },
      { id: 's2', status: 'Revision Requested', count: 4 },
      { id: 's3', status: 'Rejected', count: 7 },
    ],
    riskCounts: { Low: 22, Medium: 11, High: 5 },
  }),
  [`GET ${REPORTS_FINANCIAL_URL}`]: () => ({
    totalRewardsIssued: 'Tk 124,800',
    totalWithdrawalsPaid: 'Tk 86,200',
    outstandingBalance: 'Tk 38,600',
    pendingPayoutAmount: 'Tk 9,400',
    reconciledAt: new Date().toISOString(),
  }),
  [`GET ${REPORTS_EXPORT_CSV_URL}`]: (request) => {
    const type = String(request.params?.type ?? 'submissions');
    const stamp = new Date().toISOString();
    const day = stamp.slice(0, 10);
    return {
      exportedAt: stamp,
      filename: `ideapad-${type}-${day}.csv`,
      rowCount: ledgerState.length,
    };
  },

  // ── REST spec §5.9 — Audit Events (mock) ─────────────────────────────
  [`GET ${AUDIT_EVENTS_URL}`]: (request) => {
    const category = String(request.params?.category ?? '');
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();
    const filtered = auditLogState
      .filter((event) => {
        const matchesCategory =
          !category || category === 'all' || event.category === category;
        const matchesSearch =
          search.length === 0 ||
          event.actor.toLowerCase().includes(search) ||
          event.action.toLowerCase().includes(search) ||
          event.target.toLowerCase().includes(search);
        return matchesCategory && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() -
          new Date(a.occurredAt).getTime(),
      );
    return { data: filtered, total: filtered.length };
  },
  [`GET /admin/audit-events/:id`]: (request) => {
    const id = String(request.params?.id ?? '');
    const event = auditLogState.find((e) => e.id === id);
    if (!event) {
      throw new Error('Audit event not found.');
    }
    return {
      event: {
        ...event,
        context: {
          reason: 'Recorded by mock handler',
        },
      },
    };
  },
  [`GET ${PROFILE_DISPLAY_URL}`]: () => ({
    language: 'en',
    density: 'comfortable',
    theme: 'system',
  }),
};

// ── Spec-aligned mock state (REST spec §5) ──────────────────────────────

interface MockCategory {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

let categoriesState: MockCategory[] = [
  { id: 'cat-1', name: 'Artificial Intelligence', icon: '✦', isActive: true },
  { id: 'cat-2', name: 'Urban Innovation', icon: '⚐', isActive: true },
  { id: 'cat-3', name: 'Climate Action', icon: '☾', isActive: true },
  { id: 'cat-4', name: 'Health Tech', icon: '✿', isActive: false },
];

interface MockApplication {
  id: string;
  applicantId: string;
  conceptId: string;
  ideaTitle: string;
  ideaDescription: string;
  status: 'Submitted' | 'Under Review' | 'Revision Requested' | 'Approved' | 'Rejected';
  reviewerComment?: string;
  submittedDate: string;
  applicantName?: string;
  applicantEmail?: string;
}

const applicationsState: MockApplication[] = applicantsState.map((a) => ({
  id: a.id,
  applicantId: a.id,
  conceptId: 'concept-unknown',
  ideaTitle: a.title,
  ideaDescription: a.body,
  status:
    a.status === 'Submitted'
      ? 'Submitted'
      : a.status === 'Under Review'
        ? 'Under Review'
        : a.status === 'Revision Requested'
          ? 'Revision Requested'
          : a.status === 'Approved'
            ? 'Approved'
            : 'Rejected',
  submittedDate: a.submitted,
  applicantName: a.name,
  applicantEmail: a.email,
}));

interface MockSubmissionDecision {
  decision: 'approve' | 'request_revision' | 'reject';
  feedback?: string;
  reward_amount?: number;
}

interface MockProcessPayout {
  action: 'mark_paid' | 'reject';
  processing_reference?: string;
  rejection_reason?: string;
}

interface MockManualAdjustment {
  user_id: string;
  amount: number;
  description: string;
  reason: string;
}

function pushAuditEvent(action: string, target: string, category: AuditEvent['category']) {
  const actor = currentWorkspaceAdmin();
  const now = new Date();
  auditLogState = [
    {
      id: `g-${Date.now()}`,
      time: formatLedgerDate(now),
      occurredAt: now.toISOString(),
      actor: actor.name,
      action,
      target,
      category,
      icon:
        category === 'Applicants'
          ? '♙'
          : category === 'Content'
            ? '✓'
            : category === 'Payouts'
              ? '৳'
              : '♔',
    },
    ...auditLogState,
  ];
}

function pushAdminNotification(input: {
  icon: string;
  iconBg: string;
  title: string;
  body: string;
  type: AdminNotification['type'];
}) {
  const now = new Date();
  adminNotificationsState = [
    {
      id: `n-${Date.now()}`,
      icon: input.icon,
      iconBg: input.iconBg,
      title: input.title,
      body: input.body,
      time: 'Just now',
      type: input.type,
      read: false,
      occurredAt: now.toISOString(),
    },
    ...adminNotificationsState,
  ];
}

function pushLedgerEntry(input: {
  contributor: string;
  type: LedgerEntry['type'];
  amountValue: number;
  status: LedgerEntry['status'];
  description: string;
}) {
  const now = new Date();
  const signedLabel =
    input.type === 'Withdrawal'
      ? `−Tk ${input.amountValue.toLocaleString('en-US')}`
      : input.type === 'Reward'
        ? `+Tk ${input.amountValue.toLocaleString('en-US')}`
        : input.amountValue < 0
          ? `−Tk ${Math.abs(input.amountValue).toLocaleString('en-US')}`
          : `+Tk ${input.amountValue.toLocaleString('en-US')}`;
  const entry: LedgerEntry = {
    id: `l-${Date.now()}`,
    contributor: input.contributor,
    description: input.description,
    date: formatLedgerDate(now),
    occurredAt: now.toISOString(),
    type: input.type,
    amount: signedLabel,
    amountValue: Math.abs(input.amountValue),
    status: input.status,
  };
  ledgerState = [entry, ...ledgerState];
  return entry;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function resolveMockRequest(
  request: ApiRequest,
  token?: string | null,
): Promise<ApiResult> {
  activeMockToken = token ?? null;
  await delay(MOCK_LATENCY_MS);

  const method = request.method ?? 'GET';
  const key = `${method} ${request.url}`;
  let handler = handlers[key];
  let resolvedRequest = request;

  // Match `/resource/:id` handlers when the service substituted a real id.
  if (!handler) {
    const templated = `${method} ${request.url.replace(/\/[^/]+$/, '/:id')}`;
    if (templated in handlers) {
      handler = handlers[templated];
      const id = request.url.split('/').pop() ?? '';
      resolvedRequest = {
        ...request,
        params: { ...request.params, id },
      };
    }
  }

  if (!handler) {
    return {
      error: {
        status: 404,
        message: `No mock handler registered for ${method} ${request.url}`,
      },
    };
  }

  try {
    return { data: structuredClone(handler(resolvedRequest)) };
  } catch (error) {
    return {
      error: {
        status: 400,
        message:
          error instanceof Error ? error.message : 'Mock request failed',
      },
    };
  }
}
