import type {
  ReportsExportResponse,
  ReportsOverview,
} from '@/models/reports/reports-model';
import { baseService } from '@/services/core/base-service';
import {
  REPORTS_EXPORT_URL,
  REPORTS_OVERVIEW_URL,
} from '@/utils/constants/api-end-points';

export const reportsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getReportsOverview: builder.query<ReportsOverview, void>({
      query: () => ({ url: REPORTS_OVERVIEW_URL, method: 'GET' }),
      providesTags: ['reports'],
    }),
    exportReports: builder.mutation<ReportsExportResponse, void>({
      query: () => ({ url: REPORTS_EXPORT_URL, method: 'POST' }),
    }),
  }),
});

export const {
  useGetReportsOverviewQuery,
  useExportReportsMutation,
} = reportsService;