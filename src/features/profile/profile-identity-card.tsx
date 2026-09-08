import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AccordionSection from '@/components/shared/accordion-section';
import type { ProfileDetails } from '@/models/profile/profile-model';
import {
  passwordChangeSchema,
  profileDetailsSchema,
  type PasswordChangeFormValues,
  type ProfileDetailsFormValues,
} from '@/models/profile/profile-schema';

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
  }) => void;
  onChangePassword: (input: {
    password: string;
    currentPassword: string;
  }) => Promise<boolean> | void;
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
      currentPassword: '',
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
    });
  }, [profile, resetProfile]);

  const onSaveDetails = (values: ProfileDetailsFormValues) => {
    onSaveProfile({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      bio: values.bio.trim(),
    });
  };

  const onUpdatePassword = async (values: PasswordChangeFormValues) => {
    const ok = await onChangePassword({
      password: values.newPassword,
      currentPassword: values.currentPassword,
    });
    if (ok !== false) {
      resetPassword();
    }
  };

  const [currentPasswordValue, newPasswordValue] = useWatch({
    control: passwordControl,
    name: ['currentPassword', 'newPassword'],
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

      <AccordionSection title="Profile details" defaultOpen>
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

        <div className="mt-4.5 flex flex-wrap items-center justify-end gap-3">
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
          <Button
            type="submit"
            disabled={isSavingProfile}
            loading={isSavingProfile}
            className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest disabled:opacity-60"
          >
            {isSavingProfile ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
        </form>
      </AccordionSection>

      <AccordionSection
        title="Security"
        className="mt-6.5 border-t border-border-muted pt-5.5"
      >
        <form onSubmit={handlePasswordSubmit(onUpdatePassword)} noValidate>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                id="profile-password-current"
                label="Current password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                errorMessage={passwordErrors.currentPassword?.message}
                {...registerPassword('currentPassword')}
              />
            </div>
            <div>
              <Input
                id="profile-password"
                label="New password"
                type="password"
                required
                autoComplete="new-password"
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
                autoComplete="new-password"
                placeholder="••••••••"
                errorMessage={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword')}
              />
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center justify-end gap-3">
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
            <Button
              type="submit"
              variant="outline"
              disabled={
                isChangingPassword || !currentPasswordValue || !newPasswordValue
              }
              loading={isChangingPassword}
              className="h-auto rounded-full border-border bg-card px-4.5 py-2.75 text-[13px] font-bold text-foreground hover:bg-surface-subtle disabled:opacity-60"
            >
              {isChangingPassword ? 'Updating…' : 'Update password'}
            </Button>
          </div>
        </form>
      </AccordionSection>
    </section>
  );
}