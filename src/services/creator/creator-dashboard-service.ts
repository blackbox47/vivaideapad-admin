import type { CreatorDashboardOverview } from '@/models/creator/creator-dashboard-model';
import { baseService } from '@/services/core/base-service';
import { CREATOR_DASHBOARD_OVERVIEW_URL } from '@/utils/constants/api-end-points';

export const creatorDashboardService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getCreatorDashboardOverview: builder.query<
      CreatorDashboardOverview,
      void
    >({
      query: () => ({
        url: CREATOR_DASHBOARD_OVERVIEW_URL,
        method: 'GET',
      }),
      providesTags: ['creator-dashboard'],
    }),
  }),
});

export const { useGetCreatorDashboardOverviewQuery } = creatorDashboardService;