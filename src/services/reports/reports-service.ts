import type {
  CsvExportParams,
  CsvExportResponse,
  FinancialReconciliationReport,
  ParticipationReport,
  QualityAndCategoriesReport,
  ReportsExportResponse,
  ReportsOverview,
} from '@/models/reports/reports-model';
import { baseService } from '@/services/core/base-service';
import {
  REPORTS_EXPORT_CSV_URL,
  REPORTS_EXPORT_URL,
  REPORTS_FINANCIAL_URL,
  REPORTS_OVERVIEW_URL,
  REPORTS_PARTICIPATION_URL,
  REPORTS_QUALITY_URL,
} from '@/utils/constants/api-end-points';

export interface ReportRangeParams {
  dateFrom?: string;
  dateTo?: string;
}

export const reportsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    /** Spec §5.1 / §5.8 — GET /admin/reports/overview (existing) */
    getReportsOverview: builder.query<ReportsOverview, void>({
      query: () => ({ url: REPORTS_OVERVIEW_URL, method: 'GET' }),
      transformResponse: (response: unknown): ReportsOverview => {
        if (!response || typeof response !== 'object') {
          return {
            stats: [],
            trend: [],
            trendTotal: 0,
            trendDailyAverage: 0,
            trendBestDay: '—',
            funnel: [],
            qualityBreakdown: [],
            riskCounts: { Low: 0, Medium: 0, High: 0 },
            payoutSummary: {
              paidThisMonth: 'Tk 0',
              pendingRequests: 0,
              averageProcessingDays: 0,
              totalPaidContributors: 0,
            },
            categoryPerformance: [],
          };
        }

        const res = response as Record<string, unknown>;
        return {
          stats: Array.isArray(res.stats) ? res.stats : [],
          trend: Array.isArray(res.trend) ? res.trend : [],
          trendTotal: typeof res.trendTotal === 'number' ? res.trendTotal : 0,
          trendDailyAverage: typeof res.trendDailyAverage === 'number' ? res.trendDailyAverage : 0,
          trendBestDay: typeof res.trendBestDay === 'string' ? res.trendBestDay : '—',
          funnel: Array.isArray(res.funnel) ? res.funnel : [],
          qualityBreakdown: Array.isArray(res.qualityBreakdown) ? res.qualityBreakdown : [],
          riskCounts: (res.riskCounts as ReportsOverview['riskCounts']) ?? { Low: 0, Medium: 0, High: 0 },
          payoutSummary: (res.payoutSummary as ReportsOverview['payoutSummary']) ?? {
            paidThisMonth: 'Tk 0',
            pendingRequests: 0,
            averageProcessingDays: 0,
            totalPaidContributors: 0,
          },
          categoryPerformance: Array.isArray(res.categoryPerformance) ? res.categoryPerformance : [],
        };
      },
      providesTags: ['reports'],
    }),
    /** Spec §5.8 — POST /admin/reports/export (legacy) */
    exportReports: builder.mutation<ReportsExportResponse, void>({
      query: () => ({ url: REPORTS_EXPORT_URL, method: 'POST' }),
      transformResponse: (response: unknown): ReportsExportResponse => {
        if (typeof response === 'string') {
          const filename = `ideapad-report-${new Date().toISOString().slice(0, 10)}.csv`;
          return {
            exportedAt: new Date().toISOString(),
            filename,
            csv: response,
          };
        }
        const res = (response ?? {}) as Record<string, unknown>;
        return {
          exportedAt: String(res.exportedAt ?? new Date().toISOString()),
          filename: String(
            res.filename ??
              `ideapad-report-${new Date().toISOString().slice(0, 10)}.csv`,
          ),
          csv: typeof res.csv === 'string' ? res.csv : undefined,
        };
      },
    }),
    /** Spec §5.8 — POST /admin/reports/export-csv */
    exportCsv: builder.mutation<CsvExportResponse, CsvExportParams>({
      query: (params) => ({
        url: REPORTS_EXPORT_CSV_URL,
        method: 'GET',
        params,
      }),
      invalidatesTags: ['reports'],
    }),
    /** Spec §5.8 — GET /admin/reports/participation */
    getParticipation: builder.query<ParticipationReport, ReportRangeParams | void>({
      query: (params) => ({
        url: REPORTS_PARTICIPATION_URL,
        method: 'GET',
        params: { date_from: params?.dateFrom, date_to: params?.dateTo },
      }),
      providesTags: ['reports'],
    }),
    /** Spec §5.8 — GET /admin/reports/quality-and-categories */
    getQualityAndCategories: builder.query<QualityAndCategoriesReport, void>({
      query: () => ({ url: REPORTS_QUALITY_URL, method: 'GET' }),
      providesTags: ['reports'],
    }),
    /** Spec §5.8 — GET /admin/reports/financial-reconciliation */
    getFinancialReconciliation: builder.query<
      FinancialReconciliationReport,
      ReportRangeParams | void
    >({
      query: (params) => ({
        url: REPORTS_FINANCIAL_URL,
        method: 'GET',
        params: { date_from: params?.dateFrom, date_to: params?.dateTo },
      }),
      providesTags: ['reports'],
    }),
  }),
});

export const {
  useGetReportsOverviewQuery,
  useExportReportsMutation,
  useExportCsvMutation,
  useGetParticipationQuery,
  useGetQualityAndCategoriesQuery,
  useGetFinancialReconciliationQuery,
} = reportsService;
