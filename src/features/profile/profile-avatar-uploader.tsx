import { Camera, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { resolveAvatarUrl } from '@/utils/helpers/resolve-avatar-url';

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

interface ProfileAvatarUploaderProps {
  name: string;
  initials: string;
  avatarUrl: string | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
}

export default function ProfileAvatarUploader({
  name,
  initials,
  avatarUrl,
  isUploading,
  onUpload,
}: ProfileAvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trigger = () => {
    inputRef.current?.click();
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_AVATAR_SIZE_BYTES) {
        setErrorMessage('File size exceeds 5MB limit');
        window.setTimeout(() => setErrorMessage(null), 3500);
        event.target.value = '';
        return;
      }
      setErrorMessage(null);
      onUpload(file);
      event.target.value = '';
    }
  };

  const resolved = resolveAvatarUrl(avatarUrl);

  return (
    <div className="relative inline-flex flex-col items-center">
      <span
        className="relative block size-16"
        aria-label={`${name} avatar`}
      >
        <Avatar className="size-16 after:border-transparent">
          {resolved && (
            <AvatarImage src={resolved} alt={`${name} avatar`} />
          )}
          <AvatarFallback className="bg-brand-lime text-[22px] font-bold text-brand-lime-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <Input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleChange}
          className="hidden"
          aria-hidden
        />

        <button
          type="button"
          onClick={trigger}
          disabled={isUploading}
          title="Upload profile photo (max 5MB)"
          aria-label="Upload profile photo"
          className="absolute -right-0.5 -bottom-0.5 grid size-6.5 place-items-center rounded-full border-2 border-card bg-primary p-0 text-primary-foreground transition-colors hover:bg-brand-forest disabled:opacity-60 cursor-pointer"
        >
          {isUploading ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Camera className="size-3" />
          )}
        </button>
      </span>

      {errorMessage && (
        <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}