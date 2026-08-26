/**
 * Mock transport for the RTK Query base query.
 *
 * Handlers are keyed by `METHOD /url` so endpoints can be written against the
 * real REST contract; deleting this file and flipping `VITE_USE_MOCK_API=false`
 * is the only change needed once the API exists.
 */

import type { ApiRequest, ApiResult } from '@/models/api/api-model';
import type { LeaderboardEntry } from '@/models/leaderboard/leaderboard-model';
import type {
  Applicant,
  DecideApplicantBody,
  PlatformUser,
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
import type { AdminUser } from '@/models/auth/auth-model';
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
  ADMIN_ME_URL,
  ADMIN_NOTIFICATIONS_READ_ALL_URL,
  ADMIN_NOTIFICATIONS_URL,
  APPLICANTS_URL,
  AUDIT_LOG_URL,
  AUTH_LOGIN_URL,
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
  PAYOUTS_URL,
  PEOPLE_URL,
  PROFILE_AVATAR_URL_URL,
  PROFILE_NOTIFICATIONS_URL,
  PROFILE_OVERVIEW_URL,
  PROFILE_PASSWORD_URL,
  PROFILE_UPDATE_URL,
  REPORTS_EXPORT_URL,
  REPORTS_OVERVIEW_URL,
  REVIEW_QUEUE_URL,
  REWARDS_LEDGER_ADJUST_URL,
  REWARDS_LEDGER_URL,
  USERS_URL,
} from '@/utils/constants/api-end-points';

const MOCK_LATENCY_MS = 450;

export const MOCK_SESSION_TOKEN = 'mock-admin-session-token';

let applicantsState: Applicant[] = structuredClone(mockApplicants);
let usersState: PlatformUser[] = structuredClone(mockPeopleUsers);
let reviewQueueState: ContentSubmission[] = structuredClone(mockReviewQueue);
let payoutsState: Payout[] = structuredClone(mockPayouts);
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

function toAdminUser(admin: WorkspaceAdmin): AdminUser {
  return {
    id: admin.id,
    name: admin.name,
    role: admin.roleLabel,
    initials: admin.initials,
    email: admin.email,
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
    typeof (body as CreateAdminBody).name === 'string' &&
    typeof (body as CreateAdminBody).email === 'string'
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
  [`GET ${ADMIN_ME_URL}`]: () => toAdminUser(currentWorkspaceAdmin()),
  [`POST ${AUTH_LOGIN_URL}`]: (request) => {
    // Synthesize the role from the email domain. Real backend will return
    // a discriminator field on the response — this is mock-only.
    const body = request.body as { email?: string } | undefined;
    const email =
      typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const isCreator = email.endsWith('@sparkory.demo');

    if (isCreator) {
      return {
        token: MOCK_SESSION_TOKEN,
        user: mockCreatorUser,
        role: 'creator',
      };
    }

    if (removedAdminEmails.has(email)) {
      throw new Error('This admin account has been removed.');
    }

    const admin = findAdminByEmail(email);
    if (admin) {
      return {
        token: `${ADMIN_TOKEN_PREFIX}${admin.email}`,
        user: toAdminUser(admin),
        role: 'admin',
      };
    }

    return {
      token: MOCK_SESSION_TOKEN,
      user: mockAdminUser,
      role: 'admin',
    };
  },
  [`GET ${ADMINS_URL}`]: () => {
    const current = currentWorkspaceAdmin();
    const admins = [...workspaceAdminsState].sort(
      (a, b) =>
        new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(),
    );

    return {
      admins,
      canManage: current.access === 'owner',
    };
  },
  [`POST ${ADMINS_URL}`]: (request) => {
    if (currentWorkspaceAdmin().access !== 'owner') {
      throw new Error('Only the platform owner can add admins.');
    }
    if (!isCreateAdminBody(request.body)) {
      throw new Error('Invalid admin payload');
    }

    const name = request.body.name.trim();
    const email = request.body.email.trim().toLowerCase();

    if (!name) {
      throw new Error('Name is required.');
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
        iconBg: '#f1f3f2',
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
      admin,
      createdAt: now.toISOString(),
    };
  },
  [`DELETE ${ADMINS_URL}`]: (request) => {
    if (currentWorkspaceAdmin().access !== 'owner') {
      throw new Error('Only the platform owner can remove admins.');
    }

    const id = String(request.params?.id ?? '').trim();
    const admin = workspaceAdminsState.find((item) => item.id === id);

    if (!admin) {
      throw new Error('Admin not found.');
    }
    if (admin.access === 'owner') {
      throw new Error('The platform owner cannot be removed.');
    }

    workspaceAdminsState = workspaceAdminsState.filter((item) => item.id !== id);
    removedAdminEmails.add(admin.email.toLowerCase());
    recordAdminAudit('Removed admin', `${admin.name} · ${admin.email}`);

    return {
      id: admin.id,
      removedAt: new Date().toISOString(),
    };
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
    profile: profileState,
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
    const reference = `TX${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const entry = {
      id: `wd-${Date.now()}`,
      description: `${methodLabel} payout · ${reference}`,
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
};

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
  const handler = handlers[`${method} ${request.url}`];

  if (!handler) {
    return {
      error: {
        status: 404,
        message: `No mock handler registered for ${method} ${request.url}`,
      },
    };
  }

  try {
    return { data: structuredClone(handler(request)) };
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
