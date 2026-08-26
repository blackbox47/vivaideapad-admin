import type {
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
        params: {
          filter: params?.filter,
        },
      }),
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
