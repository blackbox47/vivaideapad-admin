import { useEffect, useMemo, type MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CreateAdjustmentBody } from '@/models/rewards/rewards-model';
import type { DropdownOption } from '@/utils/types/dropdown-option';

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

const balanceAdjustmentSchema = z.object({
  contributor: z.string().trim().min(1, 'Contributor is required.'),
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required.')
    .refine(
      (raw) => parseAdjustmentAmount(raw) !== null,
      'Enter a non-zero amount such as -20 or +50.',
    ),
  reason: z.string().trim().min(1, 'Reason is required.'),
});

type BalanceAdjustmentFormValues = z.infer<typeof balanceAdjustmentSchema>;

interface BalanceAdjustmentDialogProps {
  contributors: string[];
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (body: CreateAdjustmentBody) => Promise<void>;
}

export default function BalanceAdjustmentDialog({
  contributors,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: BalanceAdjustmentDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BalanceAdjustmentFormValues>({
    resolver: zodResolver(balanceAdjustmentSchema),
    defaultValues: {
      contributor: '',
      amount: '',
      reason: '',
    },
  });

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

  const onFormSubmit = async (values: BalanceAdjustmentFormValues) => {
    await onSubmit({
      contributor: values.contributor.trim(),
      amount: values.amount.trim(),
      reason: values.reason.trim(),
    });
  };

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

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <div className="mb-3">
            <Input
              id="adjustment-contributor"
              label="Contributor"
              required
              list="adjustment-contributors"
              placeholder="Search contributor"
              autoComplete="off"
              errorMessage={errors.contributor?.message}
              {...register('contributor')}
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
            <Input
              id="adjustment-amount"
              label="Amount"
              required
              placeholder="e.g. -20 or +50"
              errorMessage={errors.amount?.message}
              {...register('amount')}
            />
          </div>

          <div className="mb-3">
            <Textarea
              id="adjustment-reason"
              label="Reason (recorded in audit log)"
              required
              className="min-h-[60px]"
              errorMessage={errors.reason?.message}
              {...register('reason')}
            />
          </div>

          {error ? (
            <p
              className="mt-3 text-[12px] font-semibold text-destructive"
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
