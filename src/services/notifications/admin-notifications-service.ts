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
import { parseApiDateTime } from '@/utils/helpers/parse-api-date-time';

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
          const notifications: AdminNotification[] = res.data
            .map((item: Record<string, unknown>) => {
              const isRead = item.read_state === 'read' || item.read === true;
              const occurredAt = parseApiDateTime(item.created_at);
              return {
                id: String(item.id ?? ''),
                title: String(item.title ?? 'Notification'),
                body: String(item.body ?? ''),
                time: new Date(occurredAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                type: (typeof item.type === 'string'
                  ? item.type
                  : 'System') as AdminNotificationType,
                icon: 'bell',
                iconBg: 'bg-primary/10',
                read: isRead,
                occurredAt,
                rawType: typeof item.type === 'string' ? item.type : null,
                linkedRecordType:
                  typeof item.linked_record_type === 'string'
                    ? item.linked_record_type
                    : null,
                linkedRecordId:
                  typeof item.linked_record_id === 'string'
                    ? item.linked_record_id
                    : null,
              };
            })
            .sort(
              (a, b) =>
                new Date(b.occurredAt).getTime() -
                new Date(a.occurredAt).getTime(),
            );

          const unreadCount = notifications.filter((n) => !n.read).length;
          const meta = res.meta as Record<string, unknown> | undefined;
          const total =
            typeof meta?.total === 'number' ? meta.total : notifications.length;

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
      query: ({ id }) => ({
        url: `${ADMIN_NOTIFICATIONS_URL}/${id}/read`,
        method: 'PATCH',
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patches = [
          'All',
          'Unread',
          'Review',
          'Applicants',
          'Payouts',
          'System',
        ].map((filter) =>
          dispatch(
            adminNotificationsService.util.updateQueryData(
              'getAdminNotifications',
              { filter: filter as AdminNotificationsParams['filter'] },
              (draft) => {
                const target = draft.notifications.find((n) => n.id === id);
                if (target && !target.read) {
                  target.read = true;
                  draft.unreadCount = Math.max(0, draft.unreadCount - 1);
                }
              },
            ),
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          for (const patch of patches) patch.undo();
        }
      },
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
