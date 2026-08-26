import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { CreateAdjustmentBody } from '@/models/rewards/rewards-model';

const fieldClassName =
  'h-auto w-full rounded-[12px] border border-[#dfe7e3] bg-white px-[13px] py-3 text-sm shadow-none';

interface BalanceAdjustmentDialogProps {
  contributors: string[];
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (body: CreateAdjustmentBody) => Promise<void>;
}

interface FormValues {
  contributor: string;
  amount: string;
  reason: string;
}

function parseAdjustmentAmount(raw: string): number | null {
  const match = raw.trim().replace(/,/g, '').match(/^([+-])?\s*(\d+)$/);
  if (!match) {
    return null;
  }

  const value = Number(match[2]);
  if (!Number.isFinite(value) || value === 0) {
    return null;
  }

  return match[1] === '-' ? -value : value;
}

export default function BalanceAdjustmentDialog({
  contributors,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: BalanceAdjustmentDialogProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>({
    contributor: '',
    amount: '',
    reason: '',
  });

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

  const update = <Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const contributor = values.contributor.trim();
    const amount = values.amount.trim();
    const reason = values.reason.trim();

    if (!contributor) {
      setValidationError('Contributor is required.');
      return;
    }
    if (parseAdjustmentAmount(amount) === null) {
      setValidationError('Enter a non-zero amount such as -20 or +50.');
      return;
    }
    if (!reason) {
      setValidationError('Reason is required.');
      return;
    }

    await onSubmit({ contributor, amount, reason });
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
        aria-labelledby="balance-adjustment-title"
        className="max-h-[88vh] w-full max-w-[560px] overflow-auto rounded-[24px] bg-white p-[30px] shadow-[0_20px_60px_rgba(29,65,54,0.12)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-[#527065] uppercase">
              Balance adjustment
            </p>
            <h2
              id="balance-adjustment-title"
              className="mt-1.5 font-heading text-[22px] text-foreground"
            >
              Add a controlled adjustment.
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <Label
              htmlFor="adjustment-contributor"
              className="mb-1.5 block text-[12px] font-bold"
            >
              Contributor
            </Label>
            <Input
              id="adjustment-contributor"
              list="adjustment-contributors"
              value={values.contributor}
              onChange={(event) => update('contributor', event.target.value)}
              placeholder="Search contributor"
              autoComplete="off"
              className={fieldClassName}
            />
            {contributors.length > 0 ? (
              <datalist id="adjustment-contributors">
                {contributors.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            ) : null}
          </div>

          <div className="mb-3">
            <Label
              htmlFor="adjustment-amount"
              className="mb-1.5 block text-[12px] font-bold"
            >
              Amount
            </Label>
            <Input
              id="adjustment-amount"
              value={values.amount}
              onChange={(event) => update('amount', event.target.value)}
              placeholder="e.g. -20 or +50"
              className={fieldClassName}
            />
          </div>

          <div className="mb-3">
            <Label
              htmlFor="adjustment-reason"
              className="mb-1.5 block text-[12px] font-bold"
            >
              Reason (required, recorded in audit log)
            </Label>
            <textarea
              id="adjustment-reason"
              value={values.reason}
              onChange={(event) => update('reason', event.target.value)}
              className={cn(fieldClassName, 'min-h-[60px]')}
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
              {isSubmitting ? 'Recording…' : 'Record adjustment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
