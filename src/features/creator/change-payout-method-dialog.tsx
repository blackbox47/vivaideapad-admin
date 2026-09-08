import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  changePayoutMethodSchema,
  type ChangePayoutMethodFormValues,
} from '@/models/creator/creator-payout-schema';
import type {
  PayoutMethod,
  UpdatePayoutMethodBody,
} from '@/models/profile/profile-model';
import { toBdLocalMobile } from '@/utils/helpers/bd-mobile';
import type { DropdownOption } from '@/utils/types/dropdown-option';

const METHOD_OPTIONS: DropdownOption[] = [
  { id: 'bKash', label: 'bKash' },
  { id: 'Nagad', label: 'Nagad' },
  { id: 'Rocket', label: 'Rocket' },
  { id: 'Bank', label: 'Bank transfer' },
];

function mobileFromCurrent(current: PayoutMethod): string {
  return (
    toBdLocalMobile(current.account) ??
    toBdLocalMobile(current.label?.split('·')[1] ?? '') ??
    ''
  );
}

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
      mobile: mobileFromCurrent(current),
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

  const onFormSubmit = async (values: ChangePayoutMethodFormValues) => {
    const method = values.method as PayoutMethod['method'];
    const account = toBdLocalMobile(values.mobile);
    if (!account) {
      return;
    }
    const methodLabel =
      METHOD_OPTIONS.find((option) => option.id === method)?.label ?? method;
    await onSubmit({
      method,
      account,
      label: `${methodLabel} · ${account}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-(--overlay-scrim) p-5 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payout-method-title"
        className="w-full max-w-105 rounded-[24px] border border-(--dialog-border) bg-card p-7 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2
            id="payout-method-title"
            className="font-heading text-[22px] text-foreground"
          >
            Change payout method
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[22px] leading-none text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <div className="mb-3.5">
            <Select
              id="payout-method"
              label="Payout method"
              required
              options={METHOD_OPTIONS}
              errorMessage={errors.method?.message}
              {...register('method')}
            />
          </div>

          <Input
            id="payout-mobile"
            type="tel"
            inputMode="tel"
            label="Mobile number"
            required
            placeholder="e.g. 018XXXXXXXX"
            autoComplete="tel"
            errorMessage={errors.mobile?.message}
            {...register('mobile')}
          />

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
              loading={isSubmitting}
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
