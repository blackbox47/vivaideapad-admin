import { useEffect, type MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type {
  PayoutMethod,
  UpdatePayoutMethodBody,
} from '@/models/profile/profile-model';
import type { DropdownOption } from '@/utils/types/dropdown-option';

const METHOD_OPTIONS: DropdownOption[] = [
  { id: 'bKash', label: 'bKash · 018•••42' },
  { id: 'Nagad', label: 'Nagad' },
  { id: 'Rocket', label: 'Rocket' },
  { id: 'Bank', label: 'Bank transfer' },
];

const changePayoutMethodSchema = z.object({
  method: z.enum(['bKash', 'Nagad', 'Rocket', 'Bank']),
});

type ChangePayoutMethodFormValues = z.infer<typeof changePayoutMethodSchema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePayoutMethodFormValues>({
    resolver: zodResolver(changePayoutMethodSchema),
    defaultValues: {
      method: current.method,
    },
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

  const onFormSubmit = async (values: ChangePayoutMethodFormValues) => {
    const selected: UpdatePayoutMethodBody = {
      method: values.method,
      label:
        METHOD_OPTIONS.find((option) => option.id === values.method)?.label ??
        METHOD_OPTIONS[0].label,
    };
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

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <Label
            htmlFor="payout-method"
            className="mb-1.5 block text-[12px] font-bold text-foreground"
          >
            Payout method
          </Label>
          <select
            id="payout-method"
            {...register('method')}
            className="h-auto w-full rounded-[12px] border border-border bg-card text-foreground px-[13px] py-3 text-sm focus-visible:border-brand-sage-light"
          >
            {METHOD_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.method?.message ? (
            <p className="mt-1.5 text-xs font-semibold text-destructive" role="alert">
              {errors.method.message}
            </p>
          ) : null}

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
