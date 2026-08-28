import type {
  DisplayPreferences,
  DisplayPreferencesBody,
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
  PROFILE_DISPLAY_URL,
  PROFILE_NOTIFICATIONS_URL,
  PROFILE_OVERVIEW_URL,
  PROFILE_PASSWORD_URL,
  PROFILE_UPDATE_URL,
} from '@/utils/constants/api-end-points';

export const profileService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getProfileOverview: builder.query<ProfileOverview, void>({
      query: () => ({ url: PROFILE_OVERVIEW_URL, method: 'GET' }),
      transformResponse: (response: unknown): ProfileOverview => {
        if (!response || typeof response !== 'object') {
          return {
            profile: {
              id: '',
              name: '',
              initials: '',
              email: '',
              phone: '',
              bio: '',
              publicDisplay: 'Public name',
              avatarUrl: null,
            },
            notifications: { email: true, inApp: true },
            payoutMethod: { label: 'Bank Account', method: 'Bank' },
            roleLabel: 'Administrator',
          };
        }

        const res = response as Record<string, unknown>;

        // 1. Mock format: already has .profile
        if (res.profile && typeof res.profile === 'object') {
          return response as ProfileOverview;
        }

        // 2. Live API format: SerializedProfile
        const displayName =
          typeof res.display_name === 'string'
            ? res.display_name
            : typeof res.name === 'string'
              ? res.name
              : 'Admin';

        return {
          profile: {
            id: String(res.id ?? ''),
            name: displayName,
            initials: displayName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2),
            email: String(res.email ?? ''),
            phone: String(res.phone ?? ''),
            bio: String(res.bio ?? ''),
            publicDisplay: (res.publicDisplay ?? 'Public name') as PublicDisplay,
            avatarUrl: (res.avatar_url as string | null) ?? null,
          },
          notifications: {
            email: true,
            inApp: true,
          },
          payoutMethod: {
            label: 'Bank Account',
            method: 'Bank',
          },
          roleLabel: 'Administrator',
        };
      },
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
    /** Spec §1.6 — PATCH /admin/profile/display (alias of legacy mutation). */
    changePublicDisplay: builder.mutation<
      ProfileDetails,
      { publicDisplay: PublicDisplay }
    >({
      query: (body) => ({
        url: PROFILE_DISPLAY_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['profile'],
    }),
    /** Spec §1.6 — PATCH /admin/profile/display (preferences variant). */
    updateDisplay: builder.mutation<
      DisplayPreferences,
      DisplayPreferencesBody
    >({
      query: (body) => ({
        url: PROFILE_DISPLAY_URL,
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
  useUpdateDisplayMutation,
} = profileService;
