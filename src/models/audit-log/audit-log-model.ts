export type AuditCategory = 'Content' | 'Applicants' | 'Payouts' | 'System';

export type AuditCategoryFilter = 'All' | AuditCategory;

export const AUDIT_CATEGORIES: readonly AuditCategory[] = [
  'Content',
  'Applicants',
  'Payouts',
  'System',
] as const;

export const AUDIT_CATEGORY_FILTERS: readonly AuditCategoryFilter[] = [
  'All',
  ...AUDIT_CATEGORIES,
] as const;

export interface AuditEvent {
  id: string;
  /** Pre-formatted date string (DD-MM-YYYY) used by the row. */
  time: string;
  /** ISO timestamp used for sorting. */
  occurredAt: string;
  actor: string;
  action: string;
  target: string;
  category: AuditCategory;
  /** Single glyph rendered inside the icon tile. */
  icon: string;
}

export interface AuditLogResponse {
  events: AuditEvent[];
  total: number;
}

export interface AuditLogListParams {
  category?: AuditCategoryFilter;
  search?: string;
}