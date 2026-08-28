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
      const filename =
        result?.filename ??
        `ideapad-report-${new Date().toISOString().slice(0, 10)}.csv`;
      const csvContent = result?.csv;

      if (csvContent && typeof window !== 'undefined') {
        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      return filename;
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