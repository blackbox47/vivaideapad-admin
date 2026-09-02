import { useEffect, type MouseEvent } from 'react';
import { X } from 'lucide-react';
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
      className="fixed inset-0 z-50 grid place-items-center bg-(--overlay-scrim) p-5 backdrop-blur-xs"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-admin-title"
        className="w-full max-w-120 rounded-[24px] border border-(--dialog-border) bg-card p-7.5 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-brand-sage uppercase">
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
            className="text-[22px] leading-none text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X />
          </button>
        </div>

        <p className="text-[13px] leading-6 text-muted-foreground">
          {admin.email} will no longer be able to sign in to the admin
          workspace. This does not affect contributor accounts.
        </p>

        {error ? (
          <p
            className="mt-3 text-[12px] font-semibold text-destructive"
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
            className="h-auto rounded-full border-border bg-card px-5 py-3 font-bold text-foreground hover:bg-surface-subtle"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              void onConfirm();
            }}
            className="h-auto rounded-full bg-danger px-5 py-3 font-bold text-danger-foreground hover:bg-danger-hover disabled:opacity-60"
          >
            {isSubmitting ? 'Removing…' : 'Remove admin'}
          </Button>
        </div>
      </div>
    </div>
  );
}
