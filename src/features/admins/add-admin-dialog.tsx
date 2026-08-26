import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateAdminBody } from '@/models/admins/admins-model';

const fieldClassName =
  'h-auto w-full rounded-[12px] border border-[#dfe7e3] bg-white px-[13px] py-3 text-sm shadow-none';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AddAdminDialogProps {
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (body: CreateAdminBody) => Promise<void>;
}

export default function AddAdminDialog({
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: AddAdminDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const clearValidation = () => {
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextName = name.trim();
    const nextEmail = email.trim().toLowerCase();

    if (!nextName) {
      setValidationError('Name is required.');
      return;
    }
    if (!EMAIL_PATTERN.test(nextEmail)) {
      setValidationError('Enter a valid email address.');
      return;
    }

    await onSubmit({ name: nextName, email: nextEmail });
  };

  const inlineError = validationError ?? error;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(8,23,18,0.6)] p-5"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-admin-title"
        className="max-h-[88vh] w-full max-w-[560px] overflow-auto rounded-[24px] bg-white p-[30px] shadow-[0_20px_60px_rgba(29,65,54,0.12)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-[#527065] uppercase">
              Workspace access
            </p>
            <h2
              id="add-admin-title"
              className="mt-1.5 font-heading text-[22px] text-foreground"
            >
              Add a new admin.
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

        <p className="mb-4 text-[13px] text-[#687773]">
          They can sign in on the admin login page with this email and start
          using the workspace immediately.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <Label
              htmlFor="admin-name"
              className="mb-1.5 block text-[12px] font-bold"
            >
              Name
            </Label>
            <Input
              id="admin-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearValidation();
              }}
              placeholder="Full name"
              className={fieldClassName}
            />
          </div>

          <div className="mb-3">
            <Label
              htmlFor="admin-email"
              className="mb-1.5 block text-[12px] font-bold"
            >
              Email
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearValidation();
              }}
              placeholder="name@ideapad.app"
              className={fieldClassName}
            />
          </div>

          {inlineError ? (
            <p
              className="mt-3 text-[12px] font-semibold text-[#b3401f]"
              role="alert"
            >
              {inlineError}
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
              type="submit"
              disabled={isSubmitting}
              className="h-auto rounded-full bg-[#12231f] px-5 py-3 font-bold text-white hover:bg-[#254b40] disabled:opacity-60"
            >
              {isSubmitting ? 'Adding…' : 'Add admin'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
