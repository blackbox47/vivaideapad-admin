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
