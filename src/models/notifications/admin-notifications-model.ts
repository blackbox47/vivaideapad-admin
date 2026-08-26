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
