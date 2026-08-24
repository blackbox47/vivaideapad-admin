import type { DashboardOverview } from '@/models/dashboard/dashboard-model';
import { baseService } from '@/services/core/base-service';
import { DASHBOARD_OVERVIEW_URL } from '@/utils/constants/api-end-points';

export const dashboardService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverview, void>({
      query: () => ({ url: DASHBOARD_OVERVIEW_URL, method: 'GET' }),
      providesTags: ['dashboard'],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardService;
