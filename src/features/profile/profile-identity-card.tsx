import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type {
  ProfileDetails,
  PublicDisplay,
} from '@/models/profile/profile-model';
import type { DropdownOption } from '@/utils/types/dropdown-option';

const PUBLIC_DISPLAY_OPTIONS: DropdownOption[] = [
  { id: 'Public name', label: 'Public name' },
  { id: 'Pseudonymous', label: 'Pseudonymous' },
];

const profileDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Display name is required.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Enter a valid email address.'),
  phone: z.string(),
  bio: z.string(),
  publicDisplay: z.enum(['Public name', 'Pseudonymous']),
});

type ProfileDetailsFormValues = z.infer<typeof profileDetailsSchema>;

const passwordChangeSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

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
    watch: watchPassword,
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

  const newPasswordValue = watchPassword('newPassword');

  return (
    <section className="rounded-[20px] border border-border bg-card p-[26px]">
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
              errorMessage={profileErrors.name?.message}
              {...registerProfile('name')}
            />
          </div>
          <div>
            <Input
              id="profile-email"
              label="Email address"
              type="email"
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
            <Label htmlFor="profile-display" className="mb-1.5 block text-[12px] font-bold text-foreground">
              Public display
            </Label>
            <select
              id="profile-display"
              {...registerProfile('publicDisplay')}
              className="h-auto w-full rounded-[12px] border border-border bg-card text-foreground px-[13px] py-[12px] text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {PUBLIC_DISPLAY_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="profile-bio" className="mb-1.5 block text-[12px] font-bold text-foreground">
              Short bio
            </Label>
            <Textarea
              id="profile-bio"
              rows={3}
              errorMessage={profileErrors.bio?.message}
              {...registerProfile('bio')}
            />
          </div>
        </div>

        <div className="mt-[18px] flex items-center gap-3">
          <Button
            type="submit"
            disabled={isSavingProfile}
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

      <div className="mt-[26px] border-t border-border-muted pt-[22px]">
        <h3 className="mb-3.5 font-heading text-base font-semibold text-foreground">Security</h3>
        <form onSubmit={handlePasswordSubmit(onUpdatePassword)} noValidate>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <Input
                id="profile-password"
                label="New password"
                type="password"
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
              className="h-auto rounded-full border-border bg-card px-[18px] py-[11px] text-[13px] font-bold text-foreground hover:bg-surface-subtle disabled:opacity-60"
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