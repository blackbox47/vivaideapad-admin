import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const METHODS = [
  'bKash · 018•••42',
  'Nagad',
  'Rocket',
  'Bank transfer',
] as const;

const fieldClassName =
  'h-auto w-full rounded-[12px] border-[#dfe7e3] bg-white px-[13px] py-3 text-sm shadow-none';

interface WithdrawRequestDialogProps {
  available: string;
  defaultMethod: string;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (payload: { amount: string; method: string }) => Promise<void>;
}

export default function WithdrawRequestDialog({
  available,
  defaultMethod,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: WithdrawRequestDialogProps) {
  const [amount, setAmount] = useState(available);
  const [method, setMethod] = useState(
    METHODS.includes(defaultMethod as (typeof METHODS)[number])
      ? defaultMethod
      : METHODS[0],
  );

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
    await onSubmit({ amount: amount.trim(), method });
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(8,23,18,0.6)] p-5"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdraw-title"
        className="w-full max-w-[480px] rounded-[24px] bg-white p-7 shadow-[0_20px_60px_rgba(29,65,54,0.12)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-[#527065] uppercase">
              Rewards
            </p>
            <h2
              id="withdraw-title"
              className="mt-1.5 font-heading text-[22px] text-foreground"
            >
              Request withdrawal
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

        <p className="mb-3.5 text-[13px] text-[#687773]">
          Available balance:{' '}
          <strong className="text-foreground">{available}</strong>. Minimum
          withdrawal threshold applies.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Label
              htmlFor="withdraw-amount"
              className="mb-1.5 block text-[12px] font-bold"
            >
              Amount
            </Label>
            <Input
              id="withdraw-amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
              className={fieldClassName}
            />
          </div>

          <div className="mb-3">
            <Label
              htmlFor="withdraw-method"
              className="mb-1.5 block text-[12px] font-bold"
            >
              Payout method
            </Label>
            <select
              id="withdraw-method"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              className={fieldClassName}
            >
              {METHODS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <p
              className="mb-2 text-[12px] font-semibold text-[#b3401f]"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-2 flex justify-end gap-2.5">
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
              {isSubmitting ? 'Submitting…' : 'Submit request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
