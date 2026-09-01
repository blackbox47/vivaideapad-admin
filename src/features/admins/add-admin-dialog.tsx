import { useEffect, type MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CreateAdminBody } from '@/models/admins/admins-model';

const addAdminSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type AddAdminFormValues = z.infer<typeof addAdminSchema>;

interface AddAdminDialogProps {
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (body: CreateAdminBody) => Promise<void>;
}

export default function AddAdminDialog({
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: AddAdminDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddAdminFormValues>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
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

  const onFormSubmit = async (values: AddAdminFormValues) => {
    await onSubmit({
      display_name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password.trim(),
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
        aria-labelledby="add-admin-title"
        className="max-h-[88vh] w-full max-w-140 overflow-auto rounded-[24px] border border-(--dialog-border) bg-card p-7.5 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.12em] text-brand-sage uppercase">
              Workspace access
            </p>
            <h2
              id="add-admin-title"
              className="mt-1.5 font-heading text-[22px] text-foreground"
            >
              Add a new admin.
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[22px] leading-none text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="mb-4 text-[13px] text-muted-foreground">
          They can sign in on the admin login page with this email and password
          and start using the workspace immediately.
        </p>

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <div className="mb-3">
            <Input
              id="admin-name"
              label="Name"
              required
              placeholder="Full name"
              errorMessage={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div className="mb-3">
            <Input
              id="admin-email"
              label="Email"
              type="email"
              required
              placeholder="name@ideapad.app"
              errorMessage={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="mb-3">
            <Input
              id="admin-password"
              label="Temporary password"
              type="password"
              required
              placeholder="At least 8 characters"
              autoComplete="new-password"
              errorMessage={errors.password?.message}
              {...register('password')}
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
              {isSubmitting ? 'Adding…' : 'Add admin'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
