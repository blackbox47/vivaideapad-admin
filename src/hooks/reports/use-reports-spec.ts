import {
  useExportCsvMutation,
  useGetFinancialReconciliationQuery,
  useGetParticipationQuery,
  useGetQualityAndCategoriesQuery,
} from '@/services/reports/reports-service';
import type {
  CsvExportParams,
  CsvExportResponse,
  FinancialReconciliationReport,
  ParticipationReport,
  QualityAndCategoriesReport,
} from '@/models/reports/reports-model';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseReportsSpecParams {
  dateFrom?: string;
  dateTo?: string;
}

interface UseReportsSpecResult {
  participation: ParticipationReport | null;
  qualityAndCategories: QualityAndCategoriesReport | null;
  financial: FinancialReconciliationReport | null;
  isLoadingParticipation: boolean;
  isLoadingQuality: boolean;
  isLoadingFinancial: boolean;
  exportCsv: (params: CsvExportParams) => Promise<CsvExportResponse | null>;
  isExporting: boolean;
  exportError: string | null;
}

export default function useReportsSpec(
  params: UseReportsSpecParams = {},
): UseReportsSpecResult {
  const participation = useGetParticipationQuery({
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  });
  const quality = useGetQualityAndCategoriesQuery();
  const financial = useGetFinancialReconciliationQuery({
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  });
  const [triggerExport, exportState] = useExportCsvMutation();

  const exportCsv = async (exportParams: CsvExportParams) => {
    try {
      return await triggerExport(exportParams).unwrap();
    } catch {
      return null;
    }
  };

  return {
    participation: participation.data ?? null,
    qualityAndCategories: quality.data ?? null,
    financial: financial.data ?? null,
    isLoadingParticipation: participation.isLoading,
    isLoadingQuality: quality.isLoading,
    isLoadingFinancial: financial.isLoading,
    exportCsv,
    isExporting: exportState.isLoading,
    exportError: getApiErrorMessage(exportState.error),
  };
}
