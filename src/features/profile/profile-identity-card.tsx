import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
  ProfileDetails,
  PublicDisplay,
} from '@/models/profile/profile-model';
import type { DropdownOption } from '@/utils/types/dropdown-option';

/**
 * Public-display options for the profile identity card. `id` is the enum
 * value stored in `ProfileDetails.publicDisplay`; `label` is what the user
 * sees in the dropdown.
 */
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
  'use memo';
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [bio, setBio] = useState(profile.bio);
  const [publicDisplay, setPublicDisplay] = useState<PublicDisplay>(
    profile.publicDisplay,
  );

  // Adjust local form state when the parent passes a new `profile` object
  // (React's "adjust state on prop change" pattern). We track a snapshot
  // string so a render-time comparison can queue the reset without an
  // effect-driven setState — avoids `set-state-in-effect` lint violation.
  const [prevProfile, setPrevProfile] = useState(profile);
  if (profile !== prevProfile) {
    setPrevProfile(profile);
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setBio(profile.bio);
    setPublicDisplay(profile.publicDisplay);
  }

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<string | null>(
    null,
  );

  const handleSave = () => {
    onSaveProfile({ name, email, phone, bio, publicDisplay });
  };

  const handlePassword = () => {
    if (newPassword.length < 8) {
      setPasswordValidation('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordValidation('Passwords do not match');
      return;
    }
    setPasswordValidation(null);
    onChangePassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <section className="rounded-[20px] border border-border bg-card p-[26px]">
      <div className="mb-6 flex items-center gap-4">
        {avatar}
        <div>
          <strong className="block text-[18px] text-foreground">{profile.name}</strong>
          <span className="text-[13px] text-muted-foreground">{subtitle}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <Label htmlFor="profile-name" className="mb-1.5 block text-[12px] font-bold text-foreground">
            Display name
          </Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-auto w-full rounded-[12px] border-border bg-card px-[13px] py-[12px] text-sm text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="profile-email" className="mb-1.5 block text-[12px] font-bold text-foreground">
            Email address
          </Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-auto w-full rounded-[12px] border-border bg-card px-[13px] py-[12px] text-sm text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="profile-phone" className="mb-1.5 block text-[12px] font-bold text-foreground">
            Phone number
          </Label>
          <Input
            id="profile-phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-auto w-full rounded-[12px] border-border bg-card px-[13px] py-[12px] text-sm text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="profile-display" className="mb-1.5 block text-[12px] font-bold text-foreground">
            Public display
          </Label>
          <select
            id="profile-display"
            value={publicDisplay}
            onChange={(event) =>
              setPublicDisplay(event.target.value as PublicDisplay)
            }
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
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={3}
            className="w-full min-h-[80px] rounded-[12px] border border-border bg-card text-foreground px-[13px] py-[12px] text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>

      <div className="mt-[18px] flex items-center gap-3">
        <Button
          type="button"
          onClick={handleSave}
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

      <div className="mt-[26px] border-t border-border-muted pt-[22px]">
        <h3 className="mb-3.5 font-heading text-base font-semibold text-foreground">Security</h3>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <Label htmlFor="profile-password" className="mb-1.5 block text-[12px] font-bold text-foreground">
              New password
            </Label>
            <Input
              id="profile-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="••••••••"
              className="h-auto w-full rounded-[12px] border-border bg-card px-[13px] py-[12px] text-sm text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="profile-password-confirm" className="mb-1.5 block text-[12px] font-bold text-foreground">
              Confirm password
            </Label>
            <Input
              id="profile-password-confirm"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              className="h-auto w-full rounded-[12px] border-border bg-card px-[13px] py-[12px] text-sm text-foreground"
            />
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handlePassword}
            disabled={isChangingPassword || newPassword.length === 0}
            className="h-auto rounded-full border-border bg-card px-[18px] py-[11px] text-[13px] font-bold text-foreground hover:bg-surface-subtle disabled:opacity-60"
          >
            {isChangingPassword ? 'Updating…' : 'Update password'}
          </Button>
          {passwordFeedback ? (
            <span className="text-[11px] font-semibold text-success">
              {passwordFeedback}
            </span>
          ) : null}
          {passwordError || passwordValidation ? (
            <span className="text-[11px] font-semibold text-destructive">
              {passwordError ?? passwordValidation}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}