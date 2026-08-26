export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  description: string;
  tone?: 'default' | 'danger';
}

export interface ReviewQueueItem {
  id: string;
  title: string;
  author: string;
  risk: 'Low' | 'Medium' | 'High';
}

export interface ApprovalTrendItem {
  day: string;
  value: number;
  total: number;
  highlight?: boolean;
}

export interface DashboardOverview {
  stats: DashboardStat[];
  reviewQueue: ReviewQueueItem[];
  approvalTrend: ApprovalTrendItem[];
  approvalTotal: number;
  approvalDailyAverage: number;
  approvalBestDay: string;
}
