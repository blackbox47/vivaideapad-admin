import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuth from '@/hooks/auth/use-auth';
import type { UserRole } from '@/models/auth/auth-model';
import { ADMIN_ROUTES, CREATOR_ROUTES } from '@/utils/constants/routes';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginPanelProps {
  role: UserRole;
}

function homeForRole(role: UserRole): string {
  return role === 'admin' ? ADMIN_ROUTES.dashboard : CREATOR_ROUTES.dashboard;
}

function loginForRole(role: UserRole): string {
  return role === 'admin' ? ADMIN_ROUTES.login : CREATOR_ROUTES.login;
}

function titleForRole(role: UserRole): string {
  return role === 'admin' ? 'Sign in' : 'Sign in to your creator workspace';
}

function descriptionForRole(role: UserRole): string {
  return role === 'admin'
    ? 'Enter your account details to continue.'
    : 'Pick a topic, share your idea, and track it from draft to payout.';
}

export default function LoginPanel({ role }: LoginPanelProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { login, isLoggingIn, loginError, resetLoginError } = useAuth();
  const navigate = useNavigate();

  const loginPath = loginForRole(role);

  const onSubmit = async (values: LoginFormValues) => {
    resetLoginError();
    try {
      await login(values, { asRole: role });
      navigate({ to: homeForRole(role), replace: true });
    } catch {
      // Failure surfaced via loginError.
    }
  };

  return (
    <section className="flex min-h-svh items-center justify-center bg-surface-subtle p-11 lg:min-h-0">
      <div className="w-full max-w-95">
        <Link
          to={loginPath}
          className="inline-flex items-center rounded-full border border-border bg-card px-3.5 py-2 text-[13px] font-bold text-foreground no-underline transition-colors hover:bg-surface-subtle"
        >
          ← Back to home
        </Link>

        <span className="mt-8.75 block text-[12px] font-extrabold tracking-[0.12em] text-brand-sage uppercase">
          Secure access
        </span>
        <h2 className="mt-2 mb-2 font-heading text-[38px] tracking-[-0.035em] text-foreground">
          {titleForRole(role)}
        </h2>
        <p className="text-muted-foreground">{descriptionForRole(role)}</p>

        <form className="mt-7" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3.5">
            <Input
              id="email"
              label="Email address"
              type="email"
              required
              autoComplete="username"
              errorMessage={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="mb-4.5">
            <Input
              id="password"
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
            className="h-auto w-full rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground hover:bg-brand-forest disabled:opacity-60"
          >
            {isLoggingIn ? 'Signing in…' : 'Continue'}
          </Button>
        </form>

        <p className="mt-5.5 text-center text-[12px] text-muted-foreground">
          Approved contributors receive a secure activation link by email.
        </p>
      </div>
    </section>
  );
}