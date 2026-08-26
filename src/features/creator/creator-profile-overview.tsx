import { useState } from 'react';
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
import ChangePayoutMethodDialog from '@/features/creator/change-payout-method-dialog';
import ProfileAvatarUploader from '@/features/profile/profile-avatar-uploader';
import ProfileIdentityCard from '@/features/profile/profile-identity-card';
import ProfileNotificationsCard from '@/features/profile/profile-notifications-card';
import ProfilePayoutMethodCard from '@/features/profile/profile-payout-method-card';
import ProfileSignOutCard from '@/features/profile/profile-sign-out-card';
import useAuth from '@/hooks/auth/use-auth';
import useCreatorProfile from '@/hooks/creator/use-creator-profile';
import type { UpdatePayoutMethodBody } from '@/models/profile/profile-model';

export default function CreatorProfileOverview() {
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
    changePayoutMethod,
    isChangingPayoutMethod,
    payoutError,
  } = useCreatorProfile();
  const { logout } = useAuth();
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);

  if (isError) {
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

  const handlePayout = async (body: UpdatePayoutMethodBody) => {
    const ok = await changePayoutMethod(body);
    if (ok) {
      setIsPayoutOpen(false);
    }
  };

  return (
    <div className="pb-4">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage your identity, contact details and preferences."
      />

      {overview ? (
        <div className="grid gap-[18px] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <ProfileIdentityCard
            profile={overview.profile}
            subtitle={overview.roleLabel}
            isSavingProfile={isSavingProfile || isLoading}
            profileFeedback={profileFeedback}
            profileError={profileError}
            isChangingPassword={isChangingPassword}
            passwordFeedback={passwordFeedback}
            passwordError={passwordError}
            onSaveProfile={saveProfile}
            onChangePassword={(password) => {
              void changePassword({ password });
            }}
            avatar={
              <ProfileAvatarUploader
                name={overview.profile.name}
                initials={overview.profile.initials}
                avatarUrl={overview.profile.avatarUrl}
                isUploading={isUploadingAvatar}
                onUpload={(file) => {
                  void uploadAvatar(file);
                }}
              />
            }
          />

          <div className="flex flex-col gap-[18px]">
            <ProfileNotificationsCard
              preferences={overview.notifications}
              isUpdating={isUpdatingNotifications || isLoading}
              onToggle={(key, value) => {
                void toggleNotification(key, value);
              }}
            />
            <ProfilePayoutMethodCard
              payoutMethod={overview.payoutMethod}
              onChange={() => setIsPayoutOpen(true)}
            />
            <ProfileSignOutCard onSignOut={logout} />
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#687773]">Loading profile…</p>
      )}

      {isPayoutOpen && overview ? (
        <ChangePayoutMethodDialog
          current={overview.payoutMethod}
          isSubmitting={isChangingPayoutMethod}
          error={payoutError}
          onClose={() => setIsPayoutOpen(false)}
          onSubmit={handlePayout}
        />
      ) : null}
    </div>
  );
}
