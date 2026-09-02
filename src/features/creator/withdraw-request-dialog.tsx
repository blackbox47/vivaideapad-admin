import { useEffect, type MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  withdrawRequestSchema,
  type WithdrawRequestFormValues,
} from '@/models/creator/creator-payout-schema';
import type { DropdownOption } from '@/utils/types/dropdown-option';

const METHOD_OPTIONS: DropdownOption[] = [
  { id: 'bKash', label: 'bKash' },
  { id: 'Nagad', label: 'Nagad' },
  { id: 'Rocket', label: 'Rocket' },
  { id: 'Bank transfer', label: 'Bank transfer' },
];

interface WithdrawRequestDialogProps {
  available: string;
  defaultMethod: string;
  defaultMobile?: string;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (payload: {
    amount: string;
    method: string;
    mobile: string;
  }) => Promise<void>;
}

export default function WithdrawRequestDialog({
  available,
  defaultMethod,
  defaultMobile,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: WithdrawRequestDialogProps) {
  const initialMethod =
    METHOD_OPTIONS.find((option) => option.id === defaultMethod)?.id ??
    METHOD_OPTIONS[0].id;
  const initialAmount = available ? available.replace(/[^0-9.]/g, '') : '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WithdrawRequestFormValues>({
    resolver: zodResolver(withdrawRequestSchema),
    defaultValues: {
      amount: initialAmount,
      method: initialMethod,
      mobile: defaultMobile ?? '',
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
      mobile: values.mobile.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-(--overlay-scrim) p-5 backdrop-blur-xs"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdraw-title"
        className="w-full max-w-120 rounded-[24px] border border-(--dialog-border) bg-card p-7 shadow-2xl"
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
            <X />
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
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              label="Amount"
              required
              errorMessage={errors.amount?.message}
              {...register('amount')}
            />
          </div>

          <div className="mb-3">
            <Select
              id="withdraw-method"
              label="Payout method"
              required
              options={METHOD_OPTIONS}
              errorMessage={errors.method?.message}
              {...register('method')}
            />
          </div>

          <div className="mb-3">
            <Input
              id="withdraw-mobile"
              type="tel"
              label="Mobile number"
              placeholder="e.g. 018XXXXXXXX"
              required
              errorMessage={errors.mobile?.message}
              {...register('mobile')}
            />
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
