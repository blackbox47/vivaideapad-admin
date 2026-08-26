import { useEffect, type MouseEvent } from 'react';

import { Button } from '@/components/ui/button';
import type { WorkspaceAdmin } from '@/models/admins/admins-model';

interface RemoveAdminDialogProps {
  admin: WorkspaceAdmin;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function RemoveAdminDialog({
  admin,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}: RemoveAdminDialogProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSubmitting, onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(8,23,18,0.6)] p-5"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-admin-title"
        className="w-full max-w-[480px] rounded-[24px] bg-white p-[30px] shadow-[0_20px_60px_rgba(29,65,54,0.12)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-[#527065] uppercase">
              Remove access
            </p>
            <h2
              id="remove-admin-title"
              className="mt-1.5 font-heading text-[22px] text-foreground"
            >
              Remove {admin.name}?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[22px] leading-none text-[#687773]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="text-[13px] leading-6 text-[#687773]">
          {admin.email} will no longer be able to sign in to the admin
          workspace. This does not affect contributor accounts.
        </p>

        {error ? (
          <p
            className="mt-3 text-[12px] font-semibold text-[#b3401f]"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-auto rounded-full border-[#dfe7e3] bg-white px-5 py-3 font-bold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              void onConfirm();
            }}
            className="h-auto rounded-full bg-[#b3401f] px-5 py-3 font-bold text-white hover:bg-[#8c3118] disabled:opacity-60"
          >
            {isSubmitting ? 'Removing…' : 'Remove admin'}
          </Button>
        </div>
      </div>
    </div>
  );
}
