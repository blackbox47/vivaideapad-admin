import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type {
  PayoutMethod,
  UpdatePayoutMethodBody,
} from '@/models/profile/profile-model';

const OPTIONS: UpdatePayoutMethodBody[] = [
  { method: 'bKash', label: 'bKash · 018•••42' },
  { method: 'Nagad', label: 'Nagad' },
  { method: 'Rocket', label: 'Rocket' },
  { method: 'Bank', label: 'Bank transfer' },
];

interface ChangePayoutMethodDialogProps {
  current: PayoutMethod;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (body: UpdatePayoutMethodBody) => Promise<void>;
}

export default function ChangePayoutMethodDialog({
  current,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: ChangePayoutMethodDialogProps) {
  const [method, setMethod] = useState<PayoutMethod['method']>(current.method);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selected =
      OPTIONS.find((option) => option.method === method) ?? OPTIONS[0];
    await onSubmit(selected);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[var(--overlay-scrim)] p-5 backdrop-blur-xs"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payout-method-title"
        className="w-full max-w-[420px] rounded-[24px] border border-[var(--dialog-border)] bg-card p-7 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-brand-sage uppercase">
              Account
            </p>
            <h2
              id="payout-method-title"
              className="mt-1.5 font-heading text-[22px] text-foreground"
            >
              Change payout method
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[22px] leading-none text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <Label
            htmlFor="payout-method"
            className="mb-1.5 block text-[12px] font-bold text-foreground"
          >
            Payout method
          </Label>
          <select
            id="payout-method"
            value={method}
            onChange={(event) =>
              setMethod(event.target.value as PayoutMethod['method'])
            }
            className="h-auto w-full rounded-[12px] border border-border bg-card text-foreground px-[13px] py-3 text-sm focus-visible:border-brand-sage-light"
          >
            {OPTIONS.map((option) => (
              <option key={option.method} value={option.method}>
                {option.label}
              </option>
            ))}
          </select>

          {error ? (
            <p className="mt-2 text-[12px] font-semibold text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-auto rounded-full border-border bg-card px-5 py-3 font-bold text-foreground hover:bg-surface-subtle"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : 'Save method'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
