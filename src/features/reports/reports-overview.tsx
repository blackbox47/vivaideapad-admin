import { AlertCircle } from 'lucide-react';

import PageHeader from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ReportsCategoryPerformanceTable from '@/features/reports/reports-category-performance';
import ReportsExportButton from '@/features/reports/reports-export-button';
import ReportsFunnel from '@/features/reports/reports-funnel';
import ReportsKpiCards from '@/features/reports/reports-kpi-cards';
import ReportsPayoutActivity from '@/features/reports/reports-payout-activity';
import ReportsQualityBreakdown from '@/features/reports/reports-quality-breakdown';
import ReportsRiskSummary from '@/features/reports/reports-risk-summary';
import ReportsTrend from '@/features/reports/reports-trend';
import useReports from '@/hooks/reports/use-reports';

export default function ReportsOverview() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    exportReport,
    isExporting,
  } = useReports();

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load reports
          </CardTitle>
          <CardDescription>{error ?? 'Unexpected error'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Reports"
        description="Participation, content quality, categories and rewards across the platform."
        action={
          <ReportsExportButton
            onExport={exportReport}
            isExporting={isExporting}
          />
        }
      />

      <ReportsKpiCards
        isLoading={isLoading}
        items={data?.stats ?? []}
      />

      <div className="mb-5 grid gap-[18px] lg:grid-cols-2">
        <ReportsTrend
          items={data?.trend ?? []}
          total={data?.trendTotal ?? 0}
          dailyAverage={data?.trendDailyAverage ?? 0}
          bestDay={data?.trendBestDay ?? '—'}
          isLoading={isLoading}
        />
        <ReportsFunnel
          steps={data?.funnel ?? []}
          isLoading={isLoading}
        />
      </div>

      <div className="mb-5 grid gap-[18px] lg:grid-cols-2">
        <div className="rounded-[20px] border border-border bg-card p-[22px]">
          <ReportsQualityBreakdown
            rows={data?.qualityBreakdown ?? []}
            isLoading={isLoading}
          />
          <ReportsRiskSummary
            counts={
              data?.riskCounts ?? { Low: 0, Medium: 0, High: 0 }
            }
            isLoading={isLoading}
          />
        </div>
        <ReportsPayoutActivity
          summary={
            data?.payoutSummary ?? {
              paidThisMonth: 'Tk 0',
              pendingRequests: 0,
              averageProcessingDays: 0,
              totalPaidContributors: 0,
            }
          }
          isLoading={isLoading}
        />
      </div>

      <ReportsCategoryPerformanceTable
        rows={data?.categoryPerformance ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}