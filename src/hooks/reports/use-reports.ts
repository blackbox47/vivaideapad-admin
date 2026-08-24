import { useCallback } from 'react';

import type { ReportsOverview } from '@/models/reports/reports-model';
import {
  useExportReportsMutation,
  useGetReportsOverviewQuery,
} from '@/services/reports/reports-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseReportsResult {
  data: ReportsOverview | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  exportReport: () => Promise<string | null>;
  isExporting: boolean;
  exportFeedback: string | null;
  exportError: string | null;
}

export default function useReports(): UseReportsResult {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetReportsOverviewQuery();

  const [triggerExport, { isLoading: isExporting, error: exportErrorRaw }] =
    useExportReportsMutation();

  const exportReport = useCallback(async () => {
    try {
      const result = await triggerExport().unwrap();
      return result.filename;
    } catch {
      return null;
    }
  }, [triggerExport]);

  return {
    data: data ?? null,
    isLoading: isLoading || isFetching,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    exportReport,
    isExporting,
    exportFeedback: null,
    exportError: getApiErrorMessage(exportErrorRaw),
  };
}