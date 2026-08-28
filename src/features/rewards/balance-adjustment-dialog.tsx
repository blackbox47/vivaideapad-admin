import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { CreateAdjustmentBody } from '@/models/rewards/rewards-model';
import type { DropdownOption } from '@/utils/types/dropdown-option';

const fieldClassName =
  'h-auto w-full rounded-[12px] border border-border bg-card text-foreground px-[13px] py-3 text-sm shadow-none focus-visible:border-brand-sage-light';

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

  // Map the `contributors: string[]` prop to `{ id, label }` for the
  // datalist. The free-text input doesn't enforce the id, but rendering
  // the datalist through the same shape as the other dropdowns keeps
  // the contract uniform across the SPA.
  const contributorOptions = useMemo<DropdownOption[]>(
    () => contributors.map((name) => ({ id: name, label: name })),
    [contributors],
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
      className="fixed inset-0 z-50 grid place-items-center bg-[var(--overlay-scrim)] p-5 backdrop-blur-xs"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="balance-adjustment-title"
        className="max-h-[88vh] w-full max-w-[560px] overflow-auto rounded-[24px] border border-[var(--dialog-border)] bg-card p-[30px] shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-brand-sage uppercase">
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
            className="text-[22px] leading-none text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <Label
              htmlFor="adjustment-contributor"
              className="mb-1.5 block text-[12px] font-bold text-foreground"
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
                {contributorOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </datalist>
            ) : null}
          </div>

          <div className="mb-3">
            <Label
              htmlFor="adjustment-amount"
              className="mb-1.5 block text-[12px] font-bold text-foreground"
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
              className="mb-1.5 block text-[12px] font-bold text-foreground"
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
              className="mt-3 text-[12px] font-semibold text-destructive"
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
              className="h-auto rounded-full border-border bg-card px-5 py-3 font-bold text-foreground hover:bg-surface-subtle"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest disabled:opacity-60"
            >
              {isSubmitting ? 'Recording…' : 'Record adjustment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
