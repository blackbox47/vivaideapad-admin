import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuth from '@/hooks/auth/use-auth';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

const adminSignInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Admin email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type AdminSignInFormValues = z.infer<typeof adminSignInSchema>;

export default function AdminSignInPanel() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSignInFormValues>({
    resolver: zodResolver(adminSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { login, isLoggingIn, loginError, resetLoginError } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values: AdminSignInFormValues) => {
    resetLoginError();
    try {
      await login(values);
      // Always land on the admin dashboard after sign-in.
      navigate({ to: ADMIN_ROUTES.dashboard, replace: true });
    } catch {
      // Failure surfaced via loginError.
    }
  };

  return (
    <section className="flex min-h-svh items-center justify-center bg-surface-subtle p-11 lg:min-h-0">
      <div className="w-full max-w-95">
        <Link
          to={ADMIN_ROUTES.login}
          className="inline-flex items-center rounded-full border border-border bg-card px-3.5 py-2 text-[13px] font-bold text-foreground no-underline transition-colors hover:bg-surface-subtle"
        >
          ← Back to contributor sign in
        </Link>

        <span className="mt-9 block text-[12px] font-extrabold tracking-[0.12em] text-brand-sage uppercase">
          Admin console
        </span>
        <h2 className="mt-2 mb-2 font-heading text-[38px] tracking-[-0.035em] text-foreground">
          Admin sign in
        </h2>
        <p className="text-muted-foreground">
          Authorized administrators only. Enter your credentials to continue.
        </p>

        <form className="mt-7" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3.5">
            <Input
              id="admin-email"
              label="Admin email"
              type="email"
              required
              autoComplete="username"
              placeholder="admin@ideapad.app"
              errorMessage={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="mb-4.5">
            <Input
              id="admin-password"
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              errorMessage={errors.password?.message}
              {...register('password')}
            />
          </div>

          {loginError ? (
            <p
              className="mb-3 text-[12px] font-semibold text-destructive"
              role="alert"
            >
              {loginError}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="h-auto w-full rounded-full bg-primary px-5 py-3.5nt-bold text-primary-foreground hover:bg-brand-forest disabled:opacity-60"
          >
            {isLoggingIn ? 'Signing in…' : 'Sign in to console'}
          </Button>
        </form>

        <p className="mt-5.5 text-center text-[12px] text-muted-foreground">
          Need contributor access?{' '}
          <Link
            to={ADMIN_ROUTES.login}
            className="font-bold text-foreground underline-offset-2 hover:underline"
          >
            Use the contributor sign in
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
