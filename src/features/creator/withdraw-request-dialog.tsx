import { useEffect, type MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { DropdownOption } from '@/utils/types/dropdown-option';

const METHOD_OPTIONS: DropdownOption[] = [
  { id: 'bKash · 018•••42', label: 'bKash · 018•••42' },
  { id: 'Nagad', label: 'Nagad' },
  { id: 'Rocket', label: 'Rocket' },
  { id: 'Bank transfer', label: 'Bank transfer' },
];

const withdrawRequestSchema = z.object({
  amount: z.string().trim().min(1, 'Amount is required.'),
  method: z.string().min(1, 'Payout method is required.'),
});

type WithdrawRequestFormValues = z.infer<typeof withdrawRequestSchema>;

const fieldClassName =
  'h-auto w-full rounded-[12px] border border-border bg-card text-foreground px-[13px] py-3 text-sm shadow-none focus-visible:border-brand-sage-light';

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
  const initialMethod =
    METHOD_OPTIONS.find((option) => option.id === defaultMethod)?.id ??
    METHOD_OPTIONS[0].id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WithdrawRequestFormValues>({
    resolver: zodResolver(withdrawRequestSchema),
    defaultValues: {
      amount: available,
      method: initialMethod,
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

  const onFormSubmit = async (values: WithdrawRequestFormValues) => {
    await onSubmit({
      amount: values.amount.trim(),
      method: values.method,
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
        aria-labelledby="withdraw-title"
        className="w-full max-w-[480px] rounded-[24px] border border-[var(--dialog-border)] bg-card p-7 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-brand-sage uppercase">
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
            className="text-[22px] leading-none text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="mb-3.5 text-[13px] text-muted-foreground">
          Available balance:{' '}
          <strong className="text-foreground">{available}</strong>. Minimum
          withdrawal threshold applies.
        </p>

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <div className="mb-3">
            <Input
              id="withdraw-amount"
              label="Amount"
              errorMessage={errors.amount?.message}
              {...register('amount')}
            />
          </div>

          <div className="mb-3">
            <Label
              htmlFor="withdraw-method"
              className="mb-1.5 block text-[12px] font-bold text-foreground"
            >
              Payout method
            </Label>
            <div className="relative">
              <select
                id="withdraw-method"
                className={cn(fieldClassName, 'appearance-none pr-10')}
                {...register('method')}
              >
                {METHOD_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
            </div>
            {errors.method?.message ? (
              <p className="mt-1.5 text-xs font-semibold text-destructive" role="alert">
                {errors.method.message}
              </p>
            ) : null}
          </div>

          {error ? (
            <p
              className="mb-2 text-[12px] font-semibold text-destructive"
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
              {isSubmitting ? 'Submitting…' : 'Submit request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
