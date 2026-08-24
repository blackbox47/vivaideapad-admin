export interface ReportsKpiStat {
  id: string;
  label: string;
  value: string;
  helper?: string;
}

export type ReportsTrendDay = 'M' | 'T' | 'W' | 'F' | 'S' | 'U';

export interface ReportsTrendBar {
  day: ReportsTrendDay;
  count: number;
  highlight: boolean;
}

export interface ReportsFunnelStep {
  id: string;
  label: string;
  count: number;
  /** 0–100 percentage of the first step's count. */
  pct: number;
}

export interface ReportsQualityRow {
  id: string;
  status: string;
  count: number;
}

export interface ReportsRiskCounts {
  Low: number;
  Medium: number;
  High: number;
}

export interface ReportsPayoutSummary {
  paidThisMonth: string;
  pendingRequests: number;
  averageProcessingDays: number;
  totalPaidContributors: number;
}

export interface ReportsCategoryPerformance {
  id: string;
  category: string;
  total: number;
  active: number;
  rewardSum: string;
}

export interface ReportsOverview {
  stats: ReportsKpiStat[];
  trend: ReportsTrendBar[];
  trendTotal: number;
  trendDailyAverage: number;
  trendBestDay: string;
  funnel: ReportsFunnelStep[];
  qualityBreakdown: ReportsQualityRow[];
  riskCounts: ReportsRiskCounts;
  payoutSummary: ReportsPayoutSummary;
  categoryPerformance: ReportsCategoryPerformance[];
}

export interface ReportsExportResponse {
  exportedAt: string;
  filename: string;
}