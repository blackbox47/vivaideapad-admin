import type {
  CreatorNotification,
  CreatorNotificationType,
  CreatorNotificationsParams,
  CreatorNotificationsResponse,
  MarkAllCreatorNotificationsReadResponse,
  ToggleCreatorNotificationBody,
  ToggleCreatorNotificationResponse,
} from '@/models/creator/creator-notifications-model';
import { baseService } from '@/services/core/base-service';
import {
  CREATOR_NOTIFICATIONS_READ_ALL_URL,
  CREATOR_NOTIFICATIONS_URL,
} from '@/utils/constants/api-end-points';

export const creatorNotificationsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getCreatorNotifications: builder.query<
      CreatorNotificationsResponse,
      CreatorNotificationsParams | void
    >({
      query: (params) => ({
        url: CREATOR_NOTIFICATIONS_URL,
        method: 'GET',
        params: {
          filter: params?.filter,
        },
      }),
      transformResponse: (response: unknown): CreatorNotificationsResponse => {
        if (!response || typeof response !== 'object') {
          return { notifications: [], unreadCount: 0, total: 0 };
        }

        const res = response as Record<string, unknown>;

        // 1. Mock format: { notifications: [...], unreadCount, total }
        if (Array.isArray(res.notifications)) {
          return {
            notifications: res.notifications as CreatorNotification[],
            unreadCount:
              typeof res.unreadCount === 'number' ? res.unreadCount : 0,
            total:
              typeof res.total === 'number'
                ? res.total
                : res.notifications.length,
          };
        }

        // 2. Live API paginated format: { data: [...], meta: { total, ... } }
        if (Array.isArray(res.data)) {
          const notifications: CreatorNotification[] = (
            res.data as Array<Record<string, unknown>>
          ).map((item) => {
            const isRead = item.read_state === 'read' || item.read === true;
            return {
              id: String(item.id ?? ''),
              title: String(item.title ?? 'Notification'),
              body: String(item.body ?? ''),
              time:
                typeof item.created_at === 'string'
                  ? new Date(item.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '',
              type: (typeof item.type === 'string'
                ? item.type
                : 'Decisions') as CreatorNotificationType,
              icon: 'bell',
              iconBg: 'bg-primary/10',
              read: isRead,
              occurredAt:
                typeof item.created_at === 'string'
                  ? item.created_at
                  : new Date().toISOString(),
            };
          });

          const unreadCount = notifications.filter((n) => !n.read).length;
          const meta = res.meta as Record<string, unknown> | undefined;
          const total =
            typeof meta?.total === 'number'
              ? meta.total
              : notifications.length;

          return {
            notifications,
            unreadCount,
            total,
          };
        }

        return { notifications: [], unreadCount: 0, total: 0 };
      },
      providesTags: ['creator-notifications'],
    }),
    toggleCreatorNotification: builder.mutation<
      ToggleCreatorNotificationResponse,
      ToggleCreatorNotificationBody
    >({
      query: (body) => ({
        url: CREATOR_NOTIFICATIONS_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['creator-notifications'],
    }),
    markAllCreatorNotificationsRead: builder.mutation<
      MarkAllCreatorNotificationsReadResponse,
      void
    >({
      query: () => ({
        url: CREATOR_NOTIFICATIONS_READ_ALL_URL,
        method: 'POST',
      }),
      invalidatesTags: ['creator-notifications'],
    }),
  }),
});

export const {
  useGetCreatorNotificationsQuery,
  useToggleCreatorNotificationMutation,
  useMarkAllCreatorNotificationsReadMutation,
} = creatorNotificationsService;
