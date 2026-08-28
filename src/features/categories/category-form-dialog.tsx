import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  CATEGORY_ICON_CHOICES,
  type Category,
} from '@/models/categories/categories-model';

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
  const [name, setName] = useState(category?.name ?? '');
  const [icon, setIcon] = useState(category?.icon ?? CATEGORY_ICON_CHOICES[0]);
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError('Name is required.');
      return;
    }
    setError(null);
    onSubmit({ name: trimmed, icon, isActive });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-96 rounded-lg border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold">
          {mode === 'create' ? 'New category' : 'Edit category'}
        </h3>

        <label className="mt-4 block text-xs font-medium text-muted-foreground">
          Name
        </label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Climate Action"
          className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        />

        <label className="mt-3 block text-xs font-medium text-muted-foreground">
          Icon
        </label>
        <div className="mt-1 flex flex-wrap gap-1">
          {CATEGORY_ICON_CHOICES.map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => setIcon(choice)}
              className={
                'flex h-8 w-8 items-center justify-center rounded-md border text-base ' +
                (choice === icon
                  ? 'border-primary bg-primary/10'
                  : 'border-input bg-background hover:bg-muted')
              }
            >
              {choice}
            </button>
          ))}
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          Active (visible to creators)
        </label>

        {error && (
          <p className="mt-2 text-xs text-rose-600">{error}</p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving…'
              : mode === 'create'
                ? 'Create'
                : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}