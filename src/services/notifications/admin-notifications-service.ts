import type {
  AdminNotification,
  AdminNotificationType,
  AdminNotificationsParams,
  AdminNotificationsResponse,
  MarkAllNotificationsReadResponse,
  ToggleNotificationBody,
  ToggleNotificationResponse,
} from '@/models/notifications/admin-notifications-model';
import { baseService } from '@/services/core/base-service';
import {
  ADMIN_NOTIFICATIONS_READ_ALL_URL,
  ADMIN_NOTIFICATIONS_URL,
} from '@/utils/constants/api-end-points';

export const adminNotificationsService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<
      AdminNotificationsResponse,
      AdminNotificationsParams | void
    >({
      query: (params) => ({
        url: ADMIN_NOTIFICATIONS_URL,
        method: 'GET',
        params: params && params.filter ? { filter: params.filter } : undefined,
      }),
      transformResponse: (response: unknown): AdminNotificationsResponse => {
        if (!response || typeof response !== 'object') {
          return { notifications: [], unreadCount: 0, total: 0 };
        }

        const res = response as Record<string, unknown>;

        // 1. Mock format: { notifications: [...], unreadCount, total }
        if (Array.isArray(res.notifications)) {
          return {
            notifications: res.notifications as AdminNotification[],
            unreadCount: typeof res.unreadCount === 'number' ? res.unreadCount : 0,
            total: typeof res.total === 'number' ? res.total : res.notifications.length,
          };
        }

        // 2. Live API paginated format: { data: [...], meta: { total, ... } }
        if (Array.isArray(res.data)) {
          const notifications: AdminNotification[] = res.data.map((item: Record<string, unknown>) => {
            const isRead = item.read_state === 'read' || item.read === true;
            return {
              id: String(item.id ?? ''),
              title: String(item.title ?? 'Notification'),
              body: String(item.body ?? ''),
              time: typeof item.created_at === 'string'
                ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '',
              type: (typeof item.type === 'string' ? item.type : 'System') as AdminNotificationType,
              icon: 'bell',
              iconBg: 'bg-primary/10',
              read: isRead,
              occurredAt: typeof item.created_at === 'string' ? item.created_at : new Date().toISOString(),
            };
          });

          const unreadCount = notifications.filter((n) => !n.read).length;
          const meta = res.meta as Record<string, unknown> | undefined;
          const total = typeof meta?.total === 'number' ? meta.total : notifications.length;

          return {
            notifications,
            unreadCount,
            total,
          };
        }

        return { notifications: [], unreadCount: 0, total: 0 };
      },
      providesTags: ['admin-notifications'],
    }),
    toggleAdminNotification: builder.mutation<
      ToggleNotificationResponse,
      ToggleNotificationBody
    >({
      query: (body) => ({
        url: ADMIN_NOTIFICATIONS_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['admin-notifications'],
    }),
    markAllAdminNotificationsRead: builder.mutation<
      MarkAllNotificationsReadResponse,
      void
    >({
      query: () => ({
        url: ADMIN_NOTIFICATIONS_READ_ALL_URL,
        method: 'POST',
      }),
      invalidatesTags: ['admin-notifications'],
    }),
  }),
});

export const {
  useGetAdminNotificationsQuery,
  useToggleAdminNotificationMutation,
  useMarkAllAdminNotificationsReadMutation,
} = adminNotificationsService;
