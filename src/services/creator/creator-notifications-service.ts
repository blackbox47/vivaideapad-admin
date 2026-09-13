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
import { parseApiDateTime } from '@/utils/helpers/parse-api-date-time';

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

        if (Array.isArray(res.data)) {
          const notifications: CreatorNotification[] = (
            res.data as Array<Record<string, unknown>>
          )
            .map((item) => {
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
                  : 'Decisions') as CreatorNotificationType,
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
      query: ({ id }) => ({
        url: `${CREATOR_NOTIFICATIONS_URL}/${id}/read`,
        method: 'PATCH',
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patches = [
          'All',
          'Unread',
          'Decisions',
          'Feedback',
          'Opportunities',
          'Payouts',
        ].map((filter) =>
          dispatch(
            creatorNotificationsService.util.updateQueryData(
              'getCreatorNotifications',
              { filter: filter as CreatorNotificationsParams['filter'] },
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
