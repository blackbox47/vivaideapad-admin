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
import type { ConceptStatus } from '@/models/topics/topics-model';
import type { LedgerEntry, LedgerTypeFilter } from '@/models/rewards/rewards-model';
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
  UpdateProfileBody,
} from '@/models/profile/profile-model';
import type { MyIdea, MyIdeasStatusFilter } from '@/models/creator/my-ideas-model';
import type { SubmitIdeaBody } from '@/models/creator/submit-idea-model';
import type {
  CreatorRewardsOverview,
  WithdrawRequestBody,
} from '@/models/creator/creator-rewards-model';
import {
  mockAdminUser,
  mockApplicants,
  mockAuditLog,
  mockConcepts,
  mockCreatorDashboardOverview,
  mockCreatorLeaderboard,
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
  mockReviewQueue,
} from '@/services/mock/mock-data';
import {
  ADMIN_ME_URL,
  APPLICANTS_URL,
  AUDIT_LOG_URL,
  AUTH_LOGIN_URL,
  CONCEPTS_URL,
  CREATOR_DASHBOARD_OVERVIEW_URL,
  CREATOR_IDEAS_SUBMIT_URL,
  CREATOR_IDEAS_URL,
  CREATOR_ME_URL,
  CREATOR_LEADERBOARD_URL,
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

function peopleSnapshot() {
  return {
    applicants: applicantsState,
    users: usersState,
  };
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
  [`GET ${ADMIN_ME_URL}`]: () => mockAdminUser,
  [`POST ${AUTH_LOGIN_URL}`]: (request) => {
    // Synthesize the role from the email domain. Real backend will return
    // a discriminator field on the response — this is mock-only.
    const body = request.body as { email?: string } | undefined;
    const email = typeof body?.email === 'string' ? body.email.toLowerCase() : '';
    const isCreator = email.endsWith('@sparkory.demo');
    return {
      token: MOCK_SESSION_TOKEN,
      user: isCreator ? mockCreatorUser : mockAdminUser,
      role: isCreator ? 'creator' : 'admin',
    };
  },
  [`GET ${CONCEPTS_URL}`]: (request) => {
    const status = request.params?.status;
    const search = String(request.params?.search ?? '')
      .trim()
      .toLowerCase();

    const filtered = mockConcepts.filter((concept) => {
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
      total: mockConcepts.length,
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

    const filtered = mockLedger
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
      total: mockLedger.length,
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

    const filtered = mockAuditLog
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
      total: mockAuditLog.length,
    };
  },
  [`GET ${PROFILE_OVERVIEW_URL}`]: () => ({
    profile: profileState,
    notifications: notificationsState,
    payoutMethod: mockProfileOverview.payoutMethod,
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
  [`GET ${CREATOR_ME_URL}`]: () => mockCreatorUser,
  [`GET ${CREATOR_DASHBOARD_OVERVIEW_URL}`]: () => mockCreatorDashboardOverview,
  [`GET ${CREATOR_TOPICS_URL}`]: () => ({ topics: mockCreatorTopics }),
  [`GET ${CREATOR_REWARDS_URL}`]: () => rewardsState,
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
): Promise<ApiResult> {
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
