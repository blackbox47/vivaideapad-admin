export type AdminNotificationType =
  | 'Review'
  | 'Applicants'
  | 'Payouts'
  | 'System';

export type AdminNotificationFilter = 'All' | 'Unread' | AdminNotificationType;

export const ADMIN_NOTIFICATION_TYPES: readonly AdminNotificationType[] = [
  'Review',
  'Applicants',
  'Payouts',
  'System',
] as const;

export const ADMIN_NOTIFICATION_FILTERS: readonly AdminNotificationFilter[] = [
  'All',
  'Unread',
  ...ADMIN_NOTIFICATION_TYPES,
] as const;

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  /** Relative or pre-formatted time shown in the row. */
  time: string;
  type: AdminNotificationType;
  icon: string;
  iconBg: string;
  read: boolean;
  /** ISO timestamp used for sorting. */
  occurredAt: string;
  /**
   * Raw backend notification `type` enum string (e.g. `application_decision`,
   * `submission_decision`, `payout_status_changed`). Kept alongside the
   * friendly UI bucket `type` so routing logic can branch on the original
   * category without losing the existing display type. `null` indicates
   * the field was absent on the wire — the helper treats it as "unknown".
   */
  rawType?: string | null;
  /**
   * Entity bucket attached by the backend
   * (`application`, `submission`, `payout`, `user`, `concept`, …). Consumed
   * by `getAdminNotificationLink` to build a router path.
   */
  linkedRecordType?: string | null;
  /** Entity id used to construct the routed path. */
  linkedRecordId?: string | null;
}

export interface AdminNotificationsResponse {
  notifications: AdminNotification[];
  unreadCount: number;
  total: number;
}

export interface AdminNotificationsParams {
  filter?: AdminNotificationFilter;
}

export interface ToggleNotificationBody {
  id: string;
}

export interface ToggleNotificationResponse {
  notification: AdminNotification;
}

export interface MarkAllNotificationsReadResponse {
  unreadCount: number;
}
