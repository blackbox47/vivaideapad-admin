import { AlertCircle } from 'lucide-react';

import PageHeader from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ProfileAvatarUploader from '@/features/profile/profile-avatar-uploader';
import ProfileIdentityCard from '@/features/profile/profile-identity-card';
import ProfileNotificationsCard from '@/features/profile/profile-notifications-card';
import ProfilePayoutMethodCard from '@/features/profile/profile-payout-method-card';
import ProfileSignOutCard from '@/features/profile/profile-sign-out-card';
import useAuth from '@/hooks/auth/use-auth';
import useProfile from '@/hooks/profile/use-profile';

export default function ProfileOverview() {
  const {
    overview,
    isLoading,
    isError,
    error,
    refetch,
    saveProfile,
    isSavingProfile,
    profileFeedback,
    profileError,
    changePassword,
    isChangingPassword,
    passwordFeedback,
    passwordError,
    toggleNotification,
    isUpdatingNotifications,
    uploadAvatar,
    isUploadingAvatar,
  } = useProfile();
  const { logout } = useAuth();

  if (isError || !overview) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load profile
          </CardTitle>
          <CardDescription>{error ?? 'Unexpected error'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  const { profile, notifications, payoutMethod } = overview;

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage your identity, contact details and preferences."
      />

      <div className="grid gap-[18px] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <ProfileIdentityCard
          profile={profile}
          subtitle={overview.roleLabel}
          isSavingProfile={isSavingProfile || isLoading}
          profileFeedback={profileFeedback}
          profileError={profileError}
          isChangingPassword={isChangingPassword}
          passwordFeedback={passwordFeedback}
          passwordError={passwordError}
          onSaveProfile={saveProfile}
          onChangePassword={(password) =>
            void changePassword({ password })
          }
          avatar={
            <ProfileAvatarUploader
              name={profile.name}
              initials={profile.initials}
              avatarUrl={profile.avatarUrl}
              isUploading={isUploadingAvatar}
              onUpload={(file) => {
                void uploadAvatar(file);
              }}
            />
          }
        />

        <div className="flex flex-col gap-[18px]">
          <ProfileNotificationsCard
            preferences={notifications}
            isUpdating={isUpdatingNotifications || isLoading}
            onToggle={(key, value) => {
              void toggleNotification(key, value);
            }}
          />
          <ProfilePayoutMethodCard
            payoutMethod={payoutMethod}
            onChange={() => undefined}
          />
          <ProfileSignOutCard onSignOut={logout} />
        </div>
      </div>
    </div>
  );
}