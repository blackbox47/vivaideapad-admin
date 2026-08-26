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
      providesTags: ['creator-profile'],
    }),
    updateCreatorProfile: builder.mutation<
      ProfileUpdateResponse,
      UpdateProfileBody
    >({
      query: (body) => ({
        url: CREATOR_PROFILE_URL,
        method: 'PATCH',
        body,
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
        body,
      }),
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
