import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
  ProfileDetails,
  PublicDisplay,
} from '@/models/profile/profile-model';

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
}: ProfileIdentityCardProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [bio, setBio] = useState(profile.bio);
  const [publicDisplay, setPublicDisplay] = useState<PublicDisplay>(
    profile.publicDisplay,
  );

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
    <section className="rounded-[20px] border border-[#dfe7e3] bg-white p-[26px]">
      <div className="mb-6 flex items-center gap-4">
        {avatar}
        <div>
          <strong className="block text-[18px]">{profile.name}</strong>
          <span className="text-[13px] text-[#687773]">{profile.bio}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <Label htmlFor="profile-name" className="mb-1.5 block text-[12px] font-bold">
            Display name
          </Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-auto w-full rounded-[12px] border-[#dfe7e3] px-[13px] py-[12px] text-sm"
          />
        </div>
        <div>
          <Label htmlFor="profile-email" className="mb-1.5 block text-[12px] font-bold">
            Email address
          </Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-auto w-full rounded-[12px] border-[#dfe7e3] px-[13px] py-[12px] text-sm"
          />
        </div>
        <div>
          <Label htmlFor="profile-phone" className="mb-1.5 block text-[12px] font-bold">
            Phone number
          </Label>
          <Input
            id="profile-phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-auto w-full rounded-[12px] border-[#dfe7e3] px-[13px] py-[12px] text-sm"
          />
        </div>
        <div>
          <Label htmlFor="profile-display" className="mb-1.5 block text-[12px] font-bold">
            Public display
          </Label>
          <select
            id="profile-display"
            value={publicDisplay}
            onChange={(event) =>
              setPublicDisplay(event.target.value as PublicDisplay)
            }
            className="h-auto w-full rounded-[12px] border border-[#dfe7e3] bg-transparent px-[13px] py-[12px] text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="Public name">Public name</option>
            <option value="Pseudonymous">Pseudonymous</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="profile-bio" className="mb-1.5 block text-[12px] font-bold">
            Short bio
          </Label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={3}
            className="w-full min-h-[80px] rounded-[12px] border border-[#dfe7e3] bg-transparent px-[13px] py-[12px] text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>

      <div className="mt-[18px] flex items-center gap-3">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSavingProfile}
          className="h-auto rounded-full bg-[#12231f] px-5 py-3 font-bold text-white hover:bg-[#254b40] disabled:opacity-60"
        >
          {isSavingProfile ? 'Saving…' : 'Save changes'}
        </Button>
        {profileFeedback ? (
          <span className="text-[11px] font-semibold text-[#16805e]">
            {profileFeedback}
          </span>
        ) : null}
        {profileError ? (
          <span className="text-[11px] font-semibold text-[#b3401f]">
            {profileError}
          </span>
        ) : null}
      </div>

      <div className="mt-[26px] border-t border-[#eef1ef] pt-[22px]">
        <h3 className="mb-3.5 font-heading text-base font-semibold">Security</h3>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <Label htmlFor="profile-password" className="mb-1.5 block text-[12px] font-bold">
              New password
            </Label>
            <Input
              id="profile-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="••••••••"
              className="h-auto w-full rounded-[12px] border-[#dfe7e3] px-[13px] py-[12px] text-sm"
            />
          </div>
          <div>
            <Label htmlFor="profile-password-confirm" className="mb-1.5 block text-[12px] font-bold">
              Confirm password
            </Label>
            <Input
              id="profile-password-confirm"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              className="h-auto w-full rounded-[12px] border-[#dfe7e3] px-[13px] py-[12px] text-sm"
            />
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handlePassword}
            disabled={isChangingPassword || newPassword.length === 0}
            className="h-auto rounded-full border-[#dfe7e3] bg-white px-[18px] py-[11px] text-[13px] font-bold text-foreground hover:bg-[#f6f8f5] disabled:opacity-60"
          >
            {isChangingPassword ? 'Updating…' : 'Update password'}
          </Button>
          {passwordFeedback ? (
            <span className="text-[11px] font-semibold text-[#16805e]">
              {passwordFeedback}
            </span>
          ) : null}
          {passwordError || passwordValidation ? (
            <span className="text-[11px] font-semibold text-[#b3401f]">
              {passwordError ?? passwordValidation}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}