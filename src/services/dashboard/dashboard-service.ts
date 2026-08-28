import type { DashboardOverview } from '@/models/dashboard/dashboard-model';
import { baseService } from '@/services/core/base-service';
import { DASHBOARD_OVERVIEW_URL } from '@/utils/constants/api-end-points';

export const dashboardService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverview, void>({
      query: () => ({ url: DASHBOARD_OVERVIEW_URL, method: 'GET' }),
      transformResponse: (response: unknown): DashboardOverview => {
        if (!response || typeof response !== 'object') {
          return {
            stats: [],
            reviewQueue: [],
            approvalTrend: [],
            approvalTotal: 0,
            approvalDailyAverage: 0,
            approvalBestDay: '—',
          };
        }

        const res = response as Record<string, unknown>;

        // 1. Mock format with stats array already present
        if (Array.isArray(res.stats)) {
          return {
            stats: res.stats,
            reviewQueue: Array.isArray(res.reviewQueue) ? res.reviewQueue : [],
            approvalTrend: Array.isArray(res.approvalTrend) ? res.approvalTrend : [],
            approvalTotal: typeof res.approvalTotal === 'number' ? res.approvalTotal : 0,
            approvalDailyAverage: typeof res.approvalDailyAverage === 'number' ? res.approvalDailyAverage : 0,
            approvalBestDay: typeof res.approvalBestDay === 'string' ? res.approvalBestDay : '—',
          };
        }

        // 2. Live API backend format ({ users, applications, submissions, payouts, wallet, ... })
        const users = res.users as Record<string, unknown> | undefined;
        const submissions = res.submissions as Record<string, unknown> | undefined;
        const applications = res.applications as Record<string, unknown> | undefined;
        const payouts = res.payouts as Record<string, unknown> | undefined;

        const stats = [
          {
            id: 'users',
            label: 'Total Users',
            value: String(users?.total ?? 0),
            description: `+${users?.new_last_30d ?? 0} in last 30d`,
          },
          {
            id: 'submissions',
            label: 'Submissions Pending',
            value: String(submissions?.pending_review ?? 0),
            description: `${submissions?.total ?? 0} total submissions`,
            tone: (Number(submissions?.pending_review ?? 0) > 0 ? 'danger' : 'default') as 'danger' | 'default',
          },
          {
            id: 'applications',
            label: 'Applications Pending',
            value: String(applications?.pending_review ?? 0),
            description: `${applications?.total ?? 0} total applications`,
          },
          {
            id: 'payouts',
            label: 'Pending Payouts',
            value: String(payouts?.pending_count ?? 0),
            description: `${payouts?.total ?? 0} total requests`,
          },
        ];

        return {
          stats,
          reviewQueue: Array.isArray(res.reviewQueue) ? res.reviewQueue : [],
          approvalTrend: Array.isArray(res.approvalTrend) ? res.approvalTrend : [],
          approvalTotal: typeof res.approvalTotal === 'number' ? res.approvalTotal : 0,
          approvalDailyAverage: typeof res.approvalDailyAverage === 'number' ? res.approvalDailyAverage : 0,
          approvalBestDay: typeof res.approvalBestDay === 'string' ? res.approvalBestDay : '—',
        };
      },
      providesTags: ['dashboard'],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardService;
