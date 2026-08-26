/**
 * Status values for an Idea across the creator workspace lifecycle.
 *
 * `StatusBadge`'s lookup table in `components/shared/status-badge.tsx`
 * already maps every value below to the right colour swatch.
 */
export type IdeaStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Revision Requested'
  | 'Approved'
  | 'Published'
  | 'Rejected';

export type CreatorStatTone = 'default' | 'positive' | 'danger' | 'muted';

export interface CreatorStat {
  id: string;
  label: string;
  value: string;
  description?: string;
  tone?: CreatorStatTone;
  valueSize?: 'lg' | 'md';
}

export type CreatorInProgressAction = 'continue' | 'review';

export type CreatorInProgressIconTone = 'mint' | 'lavender';

export interface CreatorInProgressItem {
  id: string;
  title: string;
  detail: string;
  icon: string;
  iconTone: CreatorInProgressIconTone;
  action: CreatorInProgressAction;
  /** 0–100; omit when the row has no progress bar. */
  progress?: number;
}

export interface CreatorActivityItem {
  id: string;
  title: string;
  detail: string;
  icon: string;
}

export interface CreatorDashboardOverview {
  eyebrow: string;
  description: string;
  stats: CreatorStat[];
  inProgress: CreatorInProgressItem[];
  activity: CreatorActivityItem[];
}
