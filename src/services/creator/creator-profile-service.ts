import type {
  NotificationPreferences,
  ProfileDetails,
  ProfileOverview,
  ProfileUpdateResponse,
  UpdateNotificationsBody,
  UpdatePasswordBody,
  UpdatePayoutMethodBody,
  UpdateProfileBody,
} from '@/models/profile/profile-model';
import { baseService } from '@/services/core/base-service';
import { toProfileOverview } from '@/services/profile/map-profile-overview';
import {
  CREATOR_PROFILE_AVATAR_URL,
  CREATOR_PROFILE_NOTIFICATIONS_URL,
  CREATOR_PROFILE_PASSWORD_URL,
  CREATOR_PROFILE_PAYOUT_URL,
  CREATOR_PROFILE_URL,
} from '@/utils/constants/api-end-points';

export const creatorProfileService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getCreatorProfile: builder.query<ProfileOverview, void>({
      query: () => ({ url: CREATOR_PROFILE_URL, method: 'GET' }),
      transformResponse: (response: unknown) =>
        toProfileOverview(response, 'Contributor'),
      providesTags: ['creator-profile'],
    }),
    updateCreatorProfile: builder.mutation<
      ProfileUpdateResponse,
      UpdateProfileBody
    >({
      query: (body) => ({
        url: CREATOR_PROFILE_URL,
        method: 'PATCH',
        body: {
          display_name: body.name,
          name: body.name,
          email: body.email,
          phone: body.phone,
          bio: body.bio,
          public_display: body.publicDisplay,
          publicDisplay: body.publicDisplay,
          avatar_url: body.avatarUrl ?? undefined,
        },
      }),
      invalidatesTags: ['creator-profile', 'creator-user'],
    }),
    updateCreatorPassword: builder.mutation<
      ProfileUpdateResponse,
      UpdatePasswordBody
    >({
      query: (body) => ({
        url: CREATOR_PROFILE_PASSWORD_URL,
        method: 'POST',
        body,
      }),
    }),
    updateCreatorNotifications: builder.mutation<
      NotificationPreferences,
      UpdateNotificationsBody
    >({
      query: (body) => ({
        url: CREATOR_PROFILE_NOTIFICATIONS_URL,
        method: 'PATCH',
        body: {
          email: body.email,
          in_app: body.inApp,
          inApp: body.inApp,
        },
      }),
      transformResponse: (response: unknown): NotificationPreferences => {
        if (response && typeof response === 'object') {
          const record = response as Record<string, unknown>;
          const nested =
            record.notifications && typeof record.notifications === 'object'
              ? (record.notifications as Record<string, unknown>)
              : record;
          return {
            email: nested.email !== false && nested.email_notifications !== false,
            inApp: nested.inApp !== false && nested.in_app !== false,
          };
        }
        return { email: true, inApp: true };
      },
      invalidatesTags: ['creator-profile'],
    }),
    uploadCreatorAvatar: builder.mutation<ProfileDetails, { dataUrl: string }>({
      query: (body) => ({
        url: CREATOR_PROFILE_AVATAR_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['creator-profile', 'creator-user'],
    }),
    updateCreatorPayoutMethod: builder.mutation<
      ProfileOverview['payoutMethod'],
      UpdatePayoutMethodBody
    >({
      query: (body) => ({
        url: CREATOR_PROFILE_PAYOUT_URL,
        method: 'PATCH',
        body,
      }),
      transformResponse: (
        response: unknown,
        _meta,
        arg,
      ): ProfileOverview['payoutMethod'] => {
        if (response && typeof response === 'object') {
          const record = response as Record<string, unknown>;
          const method = record.payout_method ?? record;
          if (method && typeof method === 'object') {
            const row = method as Record<string, unknown>;
            if (typeof row.label === 'string' && typeof row.method === 'string') {
              return {
                method: row.method as ProfileOverview['payoutMethod']['method'],
                label: row.label,
              };
            }
          }
        }
        return arg;
      },
      invalidatesTags: ['creator-profile', 'creator-rewards'],
    }),
  }),
});

export const {
  useGetCreatorProfileQuery,
  useUpdateCreatorProfileMutation,
  useUpdateCreatorPasswordMutation,
  useUpdateCreatorNotificationsMutation,
  useUploadCreatorAvatarMutation,
  useUpdateCreatorPayoutMethodMutation,
} = creatorProfileService;
