export type CreatorNotificationType =
  | 'Decisions'
  | 'Feedback'
  | 'Opportunities'
  | 'Payouts';

export type CreatorNotificationFilter =
  | 'All'
  | 'Unread'
  | CreatorNotificationType;

export const CREATOR_NOTIFICATION_TYPES: readonly CreatorNotificationType[] = [
  'Decisions',
  'Feedback',
  'Opportunities',
  'Payouts',
] as const;

export const CREATOR_NOTIFICATION_FILTERS: readonly CreatorNotificationFilter[] =
  ['All', 'Unread', ...CREATOR_NOTIFICATION_TYPES] as const;

export interface CreatorNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: CreatorNotificationType;
  icon: string;
  iconBg: string;
  read: boolean;
  occurredAt: string;
  /**
   * Raw backend notification `type` enum string (e.g. `submission_decision`,
   * `payout_status_changed`). Kept alongside the friendly UI bucket `type`
   * so routing logic can branch on the original category without losing
   * the existing display type. `null` indicates the field was absent on
   * the wire — the helper treats it as "unknown".
   */
  rawType?: string | null;
  /**
   * Entity bucket attached by the backend
   * (`submission`, `payout`, `concept`, …). Consumed by
   * `getCreatorNotificationLink` to build a router path.
   */
  linkedRecordType?: string | null;
  /** Entity id used to construct the routed path. */
  linkedRecordId?: string | null;
}

export interface CreatorNotificationsResponse {
  notifications: CreatorNotification[];
  unreadCount: number;
  total: number;
}

export interface CreatorNotificationsParams {
  filter?: CreatorNotificationFilter;
}

export interface ToggleCreatorNotificationBody {
  id: string;
}

export interface ToggleCreatorNotificationResponse {
  notification: CreatorNotification;
}

export interface MarkAllCreatorNotificationsReadResponse {
  unreadCount: number;
}
