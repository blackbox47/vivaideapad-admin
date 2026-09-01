import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CATEGORY_ICON_CHOICES,
  type Category,
} from '@/models/categories/categories-model';
import {
  categoryFormSchema,
  type CategoryFormValues,
} from '@/models/categories/categories-schema';

interface CategoryFormDialogProps {
  mode: 'create' | 'edit';
  category?: Category;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    body: { name: string; icon: string; isActive: boolean },
    id?: string,
  ) => void;
}

export default function CategoryFormDialog({
  mode,
  category,
  isSubmitting,
  onClose,
  onSubmit,
}: CategoryFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? '',
      icon: category?.icon ?? CATEGORY_ICON_CHOICES[0],
      isActive: category?.isActive ?? true,
    },
  });

  const selectedIcon = useWatch({ control, name: 'icon' });

  const onFormSubmit = (values: CategoryFormValues) => {
    onSubmit(
      {
        name: values.name.trim(),
        icon: values.icon,
        isActive: values.isActive,
      },
      category?.id,
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-96 rounded-lg border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold">
          {mode === 'create' ? 'New category' : 'Edit category'}
        </h3>

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <Input
            label="Name"
            required
            placeholder="e.g. Climate Action"
            containerClassName="mt-4"
            errorMessage={errors.name?.message}
            {...register('name')}
          />

          <label className="mt-3 block text-xs font-medium text-muted-foreground">
            Icon
          </label>
          <div className="mt-1 flex flex-wrap gap-1">
            {CATEGORY_ICON_CHOICES.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setValue('icon', choice)}
                className={
                  'flex h-8 w-8 items-center justify-center rounded-md border text-base ' +
                  (choice === selectedIcon
                    ? 'border-primary bg-primary/10'
                    : 'border-input bg-background hover:bg-muted')
                }
              >
                {choice}
              </button>
            ))}
          </div>

          <label className="mt-3 flex items-center gap-2 text-sm">
            <Input
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              {...register('isActive')}
            />
            Active (visible to creators)
          </label>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving…'
                : mode === 'create'
                  ? 'Create'
                  : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}