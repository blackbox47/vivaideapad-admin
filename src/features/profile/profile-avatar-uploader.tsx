import { Camera, Loader2 } from 'lucide-react';
import { useRef } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

  const trigger = () => {
    inputRef.current?.click();
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
      event.target.value = '';
    }
  };

  return (
    <span
      className="relative block size-16"
      aria-label={`${name} avatar`}
    >
      <Avatar className="size-16 after:border-transparent">
        <AvatarFallback
          className="text-[22px] font-bold text-[#12231f]"
          style={
            avatarUrl
              ? {
                  backgroundImage: `url(${avatarUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : { backgroundColor: '#c9f36d' }
          }
        >
          {avatarUrl ? '' : initials}
        </AvatarFallback>
      </Avatar>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        aria-hidden
      />

      <button
        type="button"
        onClick={trigger}
        disabled={isUploading}
        title="Upload profile photo"
        aria-label="Upload profile photo"
        className="absolute right-[-2px] bottom-[-2px] grid size-[26px] place-items-center rounded-full border-2 border-white bg-[#12231f] p-0 text-white transition-colors hover:bg-[#0d1a16] disabled:opacity-60"
      >
        {isUploading ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <Camera className="size-3" />
        )}
      </button>
    </span>
  );
}