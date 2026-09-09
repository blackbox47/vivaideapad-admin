import { useCallback, useState } from 'react';

import type {
  NotificationPreferences,
  ProfileDetails,
  ProfileOverview,
  UpdateNotificationsBody,
  UpdatePasswordBody,
  UpdateProfileBody,
} from '@/models/profile/profile-model';
import {
  useGetProfileOverviewQuery,
  useUpdateNotificationsMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useUploadAvatarUrlMutation,
} from '@/services/profile/profile-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';
import { toast } from '@/components/ui/sonner';

interface UseProfileResult {
  overview: ProfileOverview | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;

  saveProfile: (body: UpdateProfileBody) => Promise<ProfileDetails | null>;
  isSavingProfile: boolean;
  profileFeedback: string | null;
  profileError: string | null;

  changePassword: (body: UpdatePasswordBody) => Promise<boolean>;
  isChangingPassword: boolean;
  passwordFeedback: string | null;
  passwordError: string | null;

  toggleNotification: (
    key: keyof NotificationPreferences,
    value: boolean,
  ) => Promise<NotificationPreferences | null>;
  isUpdatingNotifications: boolean;

  uploadAvatar: (file: File) => Promise<ProfileDetails | null>;
  isUploadingAvatar: boolean;
}

export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function useProfile(): UseProfileResult {
  const { data, isLoading, isError, error, refetch } =
    useGetProfileOverviewQuery();

  const [triggerProfile, { isLoading: isSavingProfile, error: profileErr }] =
    useUpdateProfileMutation();
  const [
    triggerPassword,
    { isLoading: isChangingPassword, error: passwordErr },
  ] = useUpdatePasswordMutation();
  const [
    triggerNotifications,
    { isLoading: isUpdatingNotifications },
  ] = useUpdateNotificationsMutation();
  const [triggerAvatar, { isLoading: isUploadingAvatar }] =
    useUploadAvatarUrlMutation();

  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  const flash = useCallback(
    (setter: (value: string | null) => void, value: string) => {
      setter(value);
      window.setTimeout(() => setter(null), 2500);
    },
    [],
  );

  const saveProfile = useCallback(
    async (body: UpdateProfileBody) => {
      try {
        await triggerProfile(body).unwrap();
        flash(setProfileFeedback, 'Profile updated');
        toast.success('Profile updated');
        // Optimistically build the returned shape; the cache invalidation will
        // refetch authoritative data.
        return {
          id: data?.profile.id ?? '',
          name: body.name,
          initials: data?.profile.initials ?? '',
          email: body.email,
          phone: body.phone,
          bio: body.bio,
          avatarUrl: body.avatarUrl ?? data?.profile.avatarUrl ?? null,
        } satisfies ProfileDetails;
      } catch (err) {
        toast.error(getApiErrorMessage(err) || 'Could not update profile');
        return null;
      }
    },
    [data, flash, triggerProfile],
  );

  const changePassword = useCallback(
    async (body: UpdatePasswordBody) => {
      try {
        await triggerPassword(body).unwrap();
        flash(setPasswordFeedback, 'Password updated');
        toast.success('Password updated');
        return true;
      } catch (err) {
        toast.error(getApiErrorMessage(err) || 'Could not update password');
        return false;
      }
    },
    [flash, triggerPassword],
  );

  const toggleNotification = useCallback(
    async (key: keyof NotificationPreferences, value: boolean) => {
      const current = data?.notifications ?? { email: true, inApp: true };
      const next: UpdateNotificationsBody = { ...current, [key]: value };
      try {
        return await triggerNotifications(next).unwrap();
      } catch {
        return null;
      }
    },
    [data, triggerNotifications],
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (file.size > MAX_AVATAR_SIZE_BYTES) {
        flash(setProfileFeedback, 'File size exceeds 5MB limit');
        toast.error('File size exceeds 5MB limit');
        return null;
      }
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await triggerAvatar(formData).unwrap();
        flash(setProfileFeedback, 'Profile photo updated');
        toast.success('Profile photo updated');
        return res;
      } catch (err) {
        toast.error(getApiErrorMessage(err) || 'Could not upload profile photo');
        return null;
      }
    },
    [flash, triggerAvatar],
  );

  return {
    overview: data ?? null,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    saveProfile,
    isSavingProfile,
    profileFeedback,
    profileError: getApiErrorMessage(profileErr),
    changePassword,
    isChangingPassword,
    passwordFeedback,
    passwordError: getApiErrorMessage(passwordErr),
    toggleNotification,
    isUpdatingNotifications,
    uploadAvatar,
    isUploadingAvatar,
  };
}