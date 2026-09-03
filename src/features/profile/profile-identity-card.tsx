import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type {
  ProfileDetails,
  PublicDisplay,
} from '@/models/profile/profile-model';
import {
  passwordChangeSchema,
  profileDetailsSchema,
  type PasswordChangeFormValues,
  type ProfileDetailsFormValues,
} from '@/models/profile/profile-schema';
import type { DropdownOption } from '@/utils/types/dropdown-option';

const PUBLIC_DISPLAY_OPTIONS: DropdownOption[] = [
  { id: 'Public name', label: 'Public name' },
  { id: 'Pseudonymous', label: 'Pseudonymous' },
];

interface ProfileIdentityCardProps {
  profile: ProfileDetails;
  isSavingProfile: boolean;
  profileFeedback: string | null;
  profileError: string | null;
  isChangingPassword: boolean;
  passwordFeedback: string | null;
  passwordError: string | null;
  onSaveProfile: (input: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    publicDisplay: PublicDisplay;
  }) => void;
  onChangePassword: (password: string) => void;
  avatar: React.ReactNode;
  subtitle: string;
}

export default function ProfileIdentityCard({
  profile,
  isSavingProfile,
  profileFeedback,
  profileError,
  isChangingPassword,
  passwordFeedback,
  passwordError,
  onSaveProfile,
  onChangePassword,
  avatar,
  subtitle,
}: ProfileIdentityCardProps) {
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileDetailsFormValues>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      bio: profile.bio,
      publicDisplay: profile.publicDisplay,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    control: passwordControl,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    resetProfile({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      bio: profile.bio,
      publicDisplay: profile.publicDisplay,
    });
  }, [profile, resetProfile]);

  const onSaveDetails = (values: ProfileDetailsFormValues) => {
    onSaveProfile({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      bio: values.bio.trim(),
      publicDisplay: values.publicDisplay,
    });
  };

  const onUpdatePassword = (values: PasswordChangeFormValues) => {
    onChangePassword(values.newPassword);
    resetPassword();
  };

  const newPasswordValue = useWatch({
    control: passwordControl,
    name: 'newPassword',
  });

  return (
    <section className="rounded-[20px] border border-border bg-card p-6.5">
      <div className="mb-6 flex items-center gap-4">
        {avatar}
        <div>
          <strong className="block text-[18px] text-foreground">{profile.name}</strong>
          <span className="text-[13px] text-muted-foreground">{subtitle}</span>
        </div>
      </div>

      <form onSubmit={handleProfileSubmit(onSaveDetails)} noValidate>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <Input
              id="profile-name"
              label="Display name"
              required
              errorMessage={profileErrors.name?.message}
              {...registerProfile('name')}
            />
          </div>
          <div>
            <Input
              id="profile-email"
              label="Email address"
              type="email"
              required
              errorMessage={profileErrors.email?.message}
              {...registerProfile('email')}
            />
          </div>
          <div>
            <Input
              id="profile-phone"
              label="Phone number"
              errorMessage={profileErrors.phone?.message}
              {...registerProfile('phone')}
            />
          </div>
          <div>
            <Select
              id="profile-display"
              label="Public display"
              options={PUBLIC_DISPLAY_OPTIONS}
              errorMessage={profileErrors.publicDisplay?.message}
              {...registerProfile('publicDisplay')}
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              id="profile-bio"
              label="Short bio"
              rows={3}
              errorMessage={profileErrors.bio?.message}
              {...registerProfile('bio')}
            />
          </div>
        </div>

        <div className="mt-4.5 flex items-center gap-3">
          <Button
            type="submit"
            disabled={isSavingProfile}
            loading={isSavingProfile}
            className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest disabled:opacity-60"
          >
            {isSavingProfile ? 'Saving…' : 'Save changes'}
          </Button>
          {profileFeedback ? (
            <span className="text-[11px] font-semibold text-success">
              {profileFeedback}
            </span>
          ) : null}
          {profileError ? (
            <span className="text-[11px] font-semibold text-destructive">
              {profileError}
            </span>
          ) : null}
        </div>
      </form>

      <div className="mt-6.5 border-t border-border-muted pt-5.5">
        <h3 className="mb-3.5 font-heading text-base font-semibold text-foreground">Security</h3>
        <form onSubmit={handlePasswordSubmit(onUpdatePassword)} noValidate>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <Input
                id="profile-password"
                label="New password"
                type="password"
                required
                placeholder="••••••••"
                errorMessage={passwordErrors.newPassword?.message}
                {...registerPassword('newPassword')}
              />
            </div>
            <div>
              <Input
                id="profile-password-confirm"
                label="Confirm password"
                type="password"
                required
                placeholder="••••••••"
                errorMessage={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword')}
              />
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-3">
            <Button
              type="submit"
              variant="outline"
              disabled={isChangingPassword || !newPasswordValue}
              loading={isChangingPassword}
              className="h-auto rounded-full border-border bg-card px-4.5 py-2.75 text-[13px] font-bold text-foreground hover:bg-surface-subtle disabled:opacity-60"
            >
              {isChangingPassword ? 'Updating…' : 'Update password'}
            </Button>
            {passwordFeedback ? (
              <span className="text-[11px] font-semibold text-success">
                {passwordFeedback}
              </span>
            ) : null}
            {passwordError ? (
              <span className="text-[11px] font-semibold text-destructive">
                {passwordError}
              </span>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}