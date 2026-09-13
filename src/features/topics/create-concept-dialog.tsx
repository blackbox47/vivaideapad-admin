import {
  useEffect,
  useMemo,
} from 'react';
import { startOfDay } from 'date-fns';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';

import DateField from '@/components/shared/date-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatConceptDate } from '@/utils/helpers/concept-date';
import type {
  ConceptStatus,
  CreateConceptBody,
} from '@/models/topics/topics-model';
import {
  createConceptSchema,
  type CreateConceptFormValues,
} from '@/models/topics/topics-schema';
import type { DropdownOption } from '@/utils/types/dropdown-option';

const STATUS_OPTIONS: DropdownOption[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'active', label: 'Active' },
  { id: 'archived', label: 'Archived' },
];

interface CreateConceptDialogProps {
  categories: DropdownOption[];
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (body: CreateConceptBody) => Promise<void>;
}

export default function CreateConceptDialog({
  categories,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: CreateConceptDialogProps) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateConceptFormValues>({
    resolver: zodResolver(createConceptSchema),
    defaultValues: {
      title: '',
      categoryId: categories[0]?.id ?? '',
      description: '',
      opensOn: today,
      closesOn: undefined,
      reward: '',
      isOnboarding: false,
      status: 'draft',
    },
  });

  const opensOn = useWatch({ control, name: 'opensOn' });
  const closesOn = useWatch({ control, name: 'closesOn' });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || isSubmitting) {
        return;
      }
      if (document.querySelector('[data-slot="popover-content"]')) {
        return;
      }
      onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSubmitting, onClose]);

  const onFormSubmit = async (values: CreateConceptFormValues) => {
    const selected = categories.find((c) => c.id === values.categoryId);
    await onSubmit({
      title: values.title.trim(),
      category: selected?.label ?? '',
      categoryId: values.categoryId,
      icon: '✦',
      description: values.description.trim(),
      opensOn: values.opensOn ? formatConceptDate(values.opensOn) : '',
      closesOn: values.closesOn ? formatConceptDate(values.closesOn) : '',
      reward: values.reward.trim(),
      isOnboarding: Boolean(values.isOnboarding),
      status: values.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-(--overlay-scrim) p-5 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-concept-title"
        className="max-h-[88vh] w-full max-w-140 overflow-auto rounded-[24px] border border-(--dialog-border) bg-card p-7.5 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-brand-sage uppercase">
              Concept editor
            </p>
            <h2
              id="create-concept-title"
              className="mt-1.5 font-heading text-[22px] text-foreground"
            >
              Create a new concept
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

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Input
                id="concept-title"
                label="Title"
                required
                placeholder="Enter title"
                errorMessage={errors.title?.message}
                {...register('title')}
              />
            </div>

            <div>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    id="concept-category"
                    label="Category"
                    required
                    value={field.value}
                    onChange={field.onChange}
                    options={categories}
                    placeholder="Choose a category"
                    aria-label="Concept category"
                    errorMessage={errors.categoryId?.message}
                  />
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                id="concept-description"
                label="Description"
                required
                placeholder="Enter description"
                className="min-h-17.5"
                errorMessage={errors.description?.message}
                {...register('description')}
              />
            </div>

            <div>
              <Label
                htmlFor="concept-opens"
                className="mb-1.5 block text-[12px] font-bold text-foreground"
              >
                Opening date
              </Label>
              <Controller
                control={control}
                name="opensOn"
                render={({ field }) => (
                  <DateField
                    id="concept-opens"
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      if (date && closesOn && startOfDay(closesOn) < startOfDay(date)) {
                        setValue('closesOn', undefined);
                      }
                    }}
                    placeholder="02.06.2026"
                    disabledBefore={today}
                  />
                )}
              />
            </div>

            <div>
              <Label
                htmlFor="concept-closes"
                className="mb-1.5 block text-[12px] font-bold text-foreground"
              >
                Closing date
              </Label>
              <Controller
                control={control}
                name="closesOn"
                render={({ field }) => (
                  <DateField
                    id="concept-closes"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="30.06.2026"
                    disabledBefore={opensOn ?? today}
                  />
                )}
              />
              {errors.closesOn?.message ? (
                <p className="mt-1 text-[11px] font-medium text-destructive">
                  {errors.closesOn.message}
                </p>
              ) : null}
            </div>

            <div>
              <Input
                id="concept-reward"
                label="Reward guidance"
                placeholder="Enter reward guidance"
                errorMessage={errors.reward?.message}
                {...register('reward')}
              />
            </div>

            <div>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    id="concept-status"
                    label="Status"
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value as ConceptStatus)}
                    options={STATUS_OPTIONS}
                    aria-label="Concept status"
                    errorMessage={errors.status?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="create-is-onboarding"
              {...register('isOnboarding')}
              className="size-4 rounded border-border accent-primary cursor-pointer"
            />
            <label
              htmlFor="create-is-onboarding"
              className="text-[13px] font-medium text-foreground cursor-pointer select-none"
            >
              Mark as Onboarding challenge (displays NEW chip)
            </label>
          </div>

          {error ? (
            <p
              className="mt-3 text-[12px] font-semibold text-destructive"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex justify-end gap-2.5">
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
              {isSubmitting ? 'Saving…' : 'Save concept'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}