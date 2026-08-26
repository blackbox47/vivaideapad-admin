import type {
  NotificationPreferences,
  ProfileDetails,
  ProfileOverview,
  ProfileUpdateResponse,
  PublicDisplay,
  UpdateNotificationsBody,
  UpdatePasswordBody,
  UpdateProfileBody,
} from '@/models/profile/profile-model';
import { baseService } from '@/services/core/base-service';
import {
  PROFILE_AVATAR_URL_URL,
  PROFILE_NOTIFICATIONS_URL,
  PROFILE_OVERVIEW_URL,
  PROFILE_PASSWORD_URL,
  PROFILE_UPDATE_URL,
} from '@/utils/constants/api-end-points';

export const profileService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getProfileOverview: builder.query<ProfileOverview, void>({
      query: () => ({ url: PROFILE_OVERVIEW_URL, method: 'GET' }),
      providesTags: ['profile'],
    }),
    updateProfile: builder.mutation<ProfileUpdateResponse, UpdateProfileBody>(
      {
        query: (body) => ({
          url: PROFILE_UPDATE_URL,
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['profile', 'admin-user'],
      },
    ),
    updatePassword: builder.mutation<ProfileUpdateResponse, UpdatePasswordBody>(
      {
        query: (body) => ({
          url: PROFILE_PASSWORD_URL,
          method: 'POST',
          body,
        }),
      },
    ),
    updateNotifications: builder.mutation<
      NotificationPreferences,
      UpdateNotificationsBody
    >({
      query: (body) => ({
        url: PROFILE_NOTIFICATIONS_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['profile'],
    }),
    uploadAvatarUrl: builder.mutation<ProfileDetails, { dataUrl: string }>({
      query: (body) => ({
        url: PROFILE_AVATAR_URL_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['profile', 'admin-user'],
    }),
    changePublicDisplay: builder.mutation<
      ProfileDetails,
      { publicDisplay: PublicDisplay }
    >({
      query: (body) => ({
        url: `${PROFILE_UPDATE_URL}/display`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['profile'],
    }),
  }),
});

export const {
  useGetProfileOverviewQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateNotificationsMutation,
  useUploadAvatarUrlMutation,
  useChangePublicDisplayMutation,
} = profileService;