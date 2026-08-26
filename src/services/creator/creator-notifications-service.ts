import type {
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
