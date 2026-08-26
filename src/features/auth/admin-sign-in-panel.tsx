import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/auth/use-auth';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

export default function AdminSignInPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { login, isLoggingIn, loginError, resetLoginError } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (loginError || validationError) {
      resetLoginError();
      setValidationError(null);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (loginError || validationError) {
      resetLoginError();
      setValidationError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }
    if (!password.trim()) {
      setValidationError('Password is required');
      return;
    }

    try {
      await login({ email, password });
      // Always land on the admin dashboard after sign-in.
      navigate(ADMIN_ROUTES.dashboard, { replace: true });
    } catch {
      // Failure surfaced via loginError.
    }
  };

  const inlineError = validationError ?? loginError;

  return (
    <section className="flex min-h-svh items-center justify-center bg-surface-subtle p-11 lg:min-h-0">
      <div className="w-full max-w-[380px]">
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

        <form className="mt-7" onSubmit={handleSubmit} noValidate>
          <div className="mb-3.5">
            <Label
              htmlFor="admin-email"
              className="mb-1.5 block text-[12px] font-bold text-foreground"
            >
              Admin email
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => handleEmailChange(event.target.value)}
              autoComplete="username"
              placeholder="admin@ideapad.app"
              aria-invalid={Boolean(inlineError)}
              className="h-auto w-full rounded-[12px] border-border bg-card px-[14px] py-[13px] text-sm text-foreground shadow-none focus-visible:border-brand-sage-light"
            />
          </div>

          <div className="mb-[18px]">
            <Label
              htmlFor="admin-password"
              className="mb-1.5 block text-[12px] font-bold text-foreground"
            >
              Password
            </Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => handlePasswordChange(event.target.value)}
              autoComplete="current-password"
              aria-invalid={Boolean(inlineError)}
              className="h-auto w-full rounded-[12px] border-border bg-card px-[14px] py-[13px] text-sm text-foreground shadow-none focus-visible:border-brand-sage-light"
            />
          </div>

          {inlineError ? (
            <p
              className="mb-3 text-[12px] font-semibold text-destructive"
              role="alert"
            >
              {inlineError}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="h-auto w-full rounded-full bg-primary px-5 py-[14px] font-bold text-primary-foreground hover:bg-brand-forest disabled:opacity-60"
          >
            {isLoggingIn ? 'Signing in…' : 'Sign in to console'}
          </Button>
        </form>

        <p className="mt-[22px] text-center text-[12px] text-muted-foreground">
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
