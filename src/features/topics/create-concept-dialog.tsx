import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type {
  ConceptCategory,
  ConceptStatus,
  CreateConceptBody,
} from '@/models/topics/topics-model';
import {
  CATEGORY_ICON_CHOICES,
  CONCEPT_STATUSES,
} from '@/models/topics/topics-model';

const fieldClassName =
  'h-auto w-full rounded-[12px] border border-[#dfe7e3] bg-white px-[13px] py-3 text-sm shadow-none';

const STATUS_LABELS: Record<ConceptStatus, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  active: 'Active',
  archived: 'Archived',
};

interface CreateConceptDialogProps {
  categories: ConceptCategory[];
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (body: CreateConceptBody) => Promise<void>;
}

interface FormValues {
  title: string;
  category: string;
  description: string;
  opensOn: Date | undefined;
  closesOn: Date | undefined;
  reward: string;
  status: ConceptStatus;
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
              'justify-between font-normal hover:bg-white',
              !value && 'text-[#9aa8a3]',
            )}
          />
        }
      >
        <span>{value ? formatConceptDate(value) : placeholder}</span>
        <CalendarIcon className="size-4 text-[#687773]" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
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
  children,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(fieldClassName, 'appearance-none pr-10')}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#687773]"
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
  const [extraCategories, setExtraCategories] = useState<ConceptCategory[]>([]);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState<string>(
    CATEGORY_ICON_CHOICES[0],
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>({
    title: '',
    category: categories[0]?.name ?? '',
    description: '',
    opensOn: undefined,
    closesOn: undefined,
    reward: '',
    status: 'draft',
  });

  const categoryOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const category of [...categories, ...extraCategories]) {
      if (!seen.has(category.name)) {
        seen.set(category.name, category.icon);
      }
    }
    return [...seen.entries()].map(([name, icon]) => ({ name, icon }));
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

  const update = <Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) {
      setValidationError('Enter a category name.');
      return;
    }

    const alreadyExists = categoryOptions.some(
      (option) => option.name.toLowerCase() === name.toLowerCase(),
    );
    if (alreadyExists) {
      update('category', name);
      setIsNewCategoryOpen(false);
      setNewCategoryName('');
      return;
    }

    setExtraCategories((prev) => [...prev, { name, icon: newCategoryIcon }]);
    update('category', name);
    setIsNewCategoryOpen(false);
    setNewCategoryName('');
    setNewCategoryIcon(CATEGORY_ICON_CHOICES[0]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = values.title.trim();
    const category = values.category.trim();
    const description = values.description.trim();

    if (!title) {
      setValidationError('Title is required.');
      return;
    }
    if (!category) {
      setValidationError('Pick a category before saving.');
      return;
    }
    if (!description) {
      setValidationError('Description is required.');
      return;
    }

    const selected =
      categoryOptions.find((option) => option.name === category) ??
      categoryOptions[0];

    await onSubmit({
      title,
      category,
      icon: selected?.icon ?? '✦',
      description,
      opensOn: values.opensOn ? formatConceptDate(values.opensOn) : '',
      closesOn: values.closesOn ? formatConceptDate(values.closesOn) : '',
      reward: values.reward.trim(),
      status: values.status,
    });
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
        aria-labelledby="create-concept-title"
        className="max-h-[88vh] w-full max-w-[560px] overflow-auto rounded-[24px] bg-white p-[30px] shadow-[0_20px_60px_rgba(29,65,54,0.12)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-[#527065] uppercase">
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
            className="text-[22px] leading-none text-[#687773]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label
                htmlFor="concept-title"
                className="mb-1.5 block text-[12px] font-bold"
              >
                Title
              </Label>
              <Input
                id="concept-title"
                value={values.title}
                onChange={(event) => update('title', event.target.value)}
                className={fieldClassName}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <Label
                  htmlFor="concept-category"
                  className="text-[12px] font-bold"
                >
                  Category
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCategoryOpen((open) => !open);
                    setNewCategoryName('');
                    setNewCategoryIcon(CATEGORY_ICON_CHOICES[0]);
                  }}
                  className="text-[12px] font-bold text-[#527065]"
                >
                  + New category
                </button>
              </div>
              <FieldSelect
                id="concept-category"
                value={values.category}
                onChange={(value) => update('category', value)}
              >
                {categoryOptions.length === 0 ? (
                  <option value="">Choose a category</option>
                ) : null}
                {categoryOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.icon} {option.name}
                  </option>
                ))}
              </FieldSelect>
              {isNewCategoryOpen ? (
                <div className="mt-2.5 flex flex-col gap-2 rounded-[12px] bg-[#f6f8f5] p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_ICON_CHOICES.map((icon) => {
                      const isSelected = icon === newCategoryIcon;
                      return (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setNewCategoryIcon(icon)}
                          className={
                            'size-8 rounded-[9px] border text-[15px] ' +
                            (isSelected
                              ? 'border-[#12231f] bg-[#12231f] text-white'
                              : 'border-[#dfe7e3] bg-white text-[#12231f]')
                          }
                        >
                          {icon}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newCategoryName}
                      onChange={(event) =>
                        setNewCategoryName(event.target.value)
                      }
                      placeholder="New category name"
                      className="h-auto flex-1 rounded-[10px] border border-[#dfe7e3] bg-white px-3 py-[9px] text-[13px] shadow-none"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCategory}
                      className="h-auto rounded-[10px] bg-[#12231f] px-4 py-[9px] text-[13px] font-bold text-white hover:bg-[#254b40]"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <Label
                htmlFor="concept-description"
                className="mb-1.5 block text-[12px] font-bold"
              >
                Description
              </Label>
              <textarea
                id="concept-description"
                value={values.description}
                onChange={(event) => update('description', event.target.value)}
                className={cn(fieldClassName, 'min-h-[70px]')}
              />
            </div>

            <div>
              <Label
                htmlFor="concept-opens"
                className="mb-1.5 block text-[12px] font-bold"
              >
                Opening date
              </Label>
              <DateField
                id="concept-opens"
                value={values.opensOn}
                onChange={(date) => {
                  update('opensOn', date);
                  if (date && values.closesOn && values.closesOn < date) {
                    update('closesOn', undefined);
                  }
                }}
                placeholder="20 Jul"
              />
            </div>

            <div>
              <Label
                htmlFor="concept-closes"
                className="mb-1.5 block text-[12px] font-bold"
              >
                Closing date
              </Label>
              <DateField
                id="concept-closes"
                value={values.closesOn}
                onChange={(date) => update('closesOn', date)}
                placeholder="11 May"
                disabledBefore={values.opensOn}
              />
            </div>

            <div>
              <Label
                htmlFor="concept-reward"
                className="mb-1.5 block text-[12px] font-bold"
              >
                Reward guidance
              </Label>
              <Input
                id="concept-reward"
                value={values.reward}
                onChange={(event) => update('reward', event.target.value)}
                placeholder="৳3,000"
                className={fieldClassName}
              />
            </div>

            <div>
              <Label
                htmlFor="concept-status"
                className="mb-1.5 block text-[12px] font-bold"
              >
                Status
              </Label>
              <FieldSelect
                id="concept-status"
                value={values.status}
                onChange={(value) => update('status', value as ConceptStatus)}
              >
                {CONCEPT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </FieldSelect>
            </div>
          </div>

          {inlineError ? (
            <p
              className="mt-3 text-[12px] font-semibold text-[#b3401f]"
              role="alert"
            >
              {inlineError}
            </p>
          ) : null}

          <div className="mt-5 flex justify-end gap-2.5">
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
              {isSubmitting ? 'Saving…' : 'Save concept'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
