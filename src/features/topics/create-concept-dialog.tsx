import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type {
  ConceptStatus,
  CreateConceptBody,
} from '@/models/topics/topics-model';
import { CATEGORY_ICON_CHOICES } from '@/models/topics/topics-model';
import type { DropdownOption } from '@/utils/types/dropdown-option';

const fieldClassName =
  'h-auto w-full rounded-[12px] border border-border bg-card text-foreground px-[13px] py-3 text-sm shadow-none focus-visible:border-brand-sage-light';

const STATUS_OPTIONS: DropdownOption[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'active', label: 'Active' },
  { id: 'archived', label: 'Archived' },
];

/** Synthetic id prefix for `+ New category` additions — not a real UUID. */
const LOCAL_CATEGORY_PREFIX = 'local:';

const createConceptSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  categoryId: z
    .string()
    .min(1, 'Pick a category before saving.')
    .refine(
      (id) => !id.startsWith(LOCAL_CATEGORY_PREFIX),
      'Draft category must be saved from the Categories page first.',
    ),
  description: z.string().trim().min(1, 'Description is required.'),
  opensOn: z.date().optional(),
  closesOn: z.date().optional(),
  reward: z.string(),
  status: z.enum(['draft', 'scheduled', 'active', 'archived']),
});

type CreateConceptFormValues = z.infer<typeof createConceptSchema>;

interface CreateConceptDialogProps {
  categories: DropdownOption[];
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (body: CreateConceptBody) => Promise<void>;
}

function formatConceptDate(date: Date): string {
  return format(date, 'd MMM');
}

function DateField({
  id,
  value,
  onChange,
  placeholder,
  disabledBefore,
}: {
  id: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder: string;
  disabledBefore?: Date;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            id={id}
            className={cn(
              fieldClassName,
              'justify-between font-normal hover:bg-card',
              !value && 'text-text-subtle',
            )}
          />
        }
      >
        <span>{value ? formatConceptDate(value) : placeholder}</span>
        <CalendarIcon className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0 border border-border bg-card">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            if (date) {
              setOpen(false);
            }
          }}
          disabled={disabledBefore ? { before: disabledBefore } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}

function FieldSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  ariaLabel?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className={cn(fieldClassName, 'appearance-none pr-10')}
      >
        {options.length === 0 && placeholder ? (
          <option value="">{placeholder}</option>
        ) : null}
        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

export default function CreateConceptDialog({
  categories,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: CreateConceptDialogProps) {
  const [extraCategories, setExtraCategories] = useState<DropdownOption[]>([]);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState<string>(
    CATEGORY_ICON_CHOICES[0],
  );
  const [categoryDraftError, setCategoryDraftError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateConceptFormValues>({
    resolver: zodResolver(createConceptSchema),
    defaultValues: {
      title: '',
      categoryId: categories[0]?.id ?? '',
      description: '',
      opensOn: undefined,
      closesOn: undefined,
      reward: '',
      status: 'draft',
    },
  });

  const opensOn = watch('opensOn');
  const closesOn = watch('closesOn');

  const categoryOptions = useMemo<DropdownOption[]>(() => {
    const seen = new Set<string>();
    const out: DropdownOption[] = [];
    for (const c of [...categories, ...extraCategories]) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        out.push(c);
      }
    }
    return out;
  }, [categories, extraCategories]);

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

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) {
      setCategoryDraftError('Enter a category name.');
      return;
    }

    const alreadyExists = categoryOptions.some(
      (option) => option.label.trim() === name,
    );
    if (alreadyExists) {
      const match = categoryOptions.find((option) => option.label.trim() === name);
      if (match) setValue('categoryId', match.id);
      setIsNewCategoryOpen(false);
      setNewCategoryName('');
      setCategoryDraftError(null);
      return;
    }

    const newId = `${LOCAL_CATEGORY_PREFIX}${name}`;
    setExtraCategories((prev) => [
      ...prev,
      { id: newId, label: `${newCategoryIcon} ${name}` },
    ]);
    setValue('categoryId', newId);
    setIsNewCategoryOpen(false);
    setNewCategoryName('');
    setNewCategoryIcon(CATEGORY_ICON_CHOICES[0]);
    setCategoryDraftError(null);
  };

  const onFormSubmit = async (values: CreateConceptFormValues) => {
    const selected = categoryOptions.find((c) => c.id === values.categoryId);
    await onSubmit({
      title: values.title.trim(),
      category: selected?.label ?? '',
      categoryId: values.categoryId,
      icon: '✦',
      description: values.description.trim(),
      opensOn: values.opensOn ? formatConceptDate(values.opensOn) : '',
      closesOn: values.closesOn ? formatConceptDate(values.closesOn) : '',
      reward: values.reward.trim(),
      status: values.status,
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
        aria-labelledby="create-concept-title"
        className="max-h-[88vh] w-full max-w-[560px] overflow-auto rounded-[24px] border border-[var(--dialog-border)] bg-card p-[30px] shadow-2xl"
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
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Input
                id="concept-title"
                label="Title"
                errorMessage={errors.title?.message}
                {...register('title')}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <Label
                  htmlFor="concept-category"
                  className="text-[12px] font-bold text-foreground"
                >
                  Category
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCategoryOpen((open) => !open);
                    setNewCategoryName('');
                    setCategoryDraftError(null);
                    setNewCategoryIcon(CATEGORY_ICON_CHOICES[0]);
                  }}
                  className="text-[12px] font-bold text-brand-sage hover:underline cursor-pointer"
                >
                  + New category
                </button>
              </div>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <FieldSelect
                    id="concept-category"
                    value={field.value}
                    onChange={field.onChange}
                    options={categoryOptions}
                    placeholder="Choose a category"
                    ariaLabel="Concept category"
                  />
                )}
              />
              {errors.categoryId?.message ? (
                <p className="mt-1.5 text-xs font-semibold text-destructive" role="alert">
                  {errors.categoryId.message}
                </p>
              ) : null}
              {isNewCategoryOpen ? (
                <div className="mt-2.5 flex flex-col gap-2 rounded-[12px] bg-surface-subtle p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_ICON_CHOICES.map((icon) => {
                      const isSelected = icon === newCategoryIcon;
                      return (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setNewCategoryIcon(icon)}
                          className={cn(
                            'size-8 rounded-[9px] border text-[15px] cursor-pointer transition-colors',
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-card text-foreground hover:bg-surface-subtle',
                          )}
                        >
                          {icon}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newCategoryName}
                      onChange={(event) => {
                        setNewCategoryName(event.target.value);
                        setCategoryDraftError(null);
                      }}
                      placeholder="New category name"
                      className="h-auto flex-1 rounded-[10px] border border-border bg-card px-3 py-[9px] text-[13px] text-foreground shadow-none"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCategory}
                      className="h-auto rounded-[10px] bg-primary px-4 py-[9px] text-[13px] font-bold text-primary-foreground hover:bg-brand-forest"
                    >
                      Add
                    </Button>
                  </div>
                  {categoryDraftError ? (
                    <p className="text-xs text-destructive">{categoryDraftError}</p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <Label
                htmlFor="concept-description"
                className="mb-1.5 block text-[12px] font-bold text-foreground"
              >
                Description
              </Label>
              <Textarea
                id="concept-description"
                className="min-h-[70px]"
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
                      if (date && closesOn && closesOn < date) {
                        setValue('closesOn', undefined);
                      }
                    }}
                    placeholder="20 Jul"
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
                    placeholder="11 May"
                    disabledBefore={opensOn}
                  />
                )}
              />
            </div>

            <div>
              <Input
                id="concept-reward"
                label="Reward guidance"
                placeholder="৳3,000"
                errorMessage={errors.reward?.message}
                {...register('reward')}
              />
            </div>

            <div>
              <Label
                htmlFor="concept-status"
                className="mb-1.5 block text-[12px] font-bold text-foreground"
              >
                Status
              </Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <FieldSelect
                    id="concept-status"
                    value={field.value}
                    onChange={(value) => field.onChange(value as ConceptStatus)}
                    options={STATUS_OPTIONS}
                    ariaLabel="Concept status"
                  />
                )}
              />
            </div>
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