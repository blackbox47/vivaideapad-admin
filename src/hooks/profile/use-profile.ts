import { useCallback, useState } from 'react';

import type {
  NotificationPreferences,
  ProfileDetails,
  ProfileOverview,
  PublicDisplay,
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unable to read file'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('File error'));
    reader.readAsDataURL(file);
  });
}

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
        // Optimistically build the returned shape; the cache invalidation will
        // refetch authoritative data.
        return {
          id: data?.profile.id ?? '',
          name: body.name,
          initials: data?.profile.initials ?? '',
          email: body.email,
          phone: body.phone,
          bio: body.bio,
          publicDisplay: body.publicDisplay,
          avatarUrl: body.avatarUrl ?? data?.profile.avatarUrl ?? null,
        } satisfies ProfileDetails;
      } catch {
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
        return true;
      } catch {
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
      try {
        const dataUrl = await readFileAsDataUrl(file);
        return await triggerAvatar({ dataUrl }).unwrap();
      } catch {
        return null;
      }
    },
    [triggerAvatar],
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

export type { PublicDisplay };