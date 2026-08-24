import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/auth/use-auth';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

interface LocationState {
  from?: { pathname: string };
}

export default function AdminSignInPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { login, isLoggingIn, loginError, resetLoginError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    (location.state as LocationState | null)?.from?.pathname ??
    ADMIN_ROUTES.dashboard;

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
      navigate(redirectTo, { replace: true });
    } catch {
      // Failure surfaced via loginError.
    }
  };

  const inlineError = validationError ?? loginError;

  return (
    <section className="flex min-h-svh items-center justify-center bg-[#f6f8f5] p-11 lg:min-h-0">
      <div className="w-full max-w-[380px]">
        <Link
          to={ADMIN_ROUTES.login}
          className="inline-flex items-center rounded-full border border-[#dfe7e3] bg-white px-3.5 py-2 text-[13px] font-bold text-foreground no-underline transition-colors hover:bg-[#f6f8f5]"
        >
          ← Back to contributor sign in
        </Link>

        <span className="mt-9 block text-[12px] font-extrabold tracking-[0.12em] text-[#527065] uppercase">
          Admin console
        </span>
        <h2 className="mt-2 mb-2 font-heading text-[38px] tracking-[-0.035em]">
          Admin sign in
        </h2>
        <p className="text-[#687773]">
          Authorized administrators only. Enter your credentials to continue.
        </p>

        <form className="mt-7" onSubmit={handleSubmit} noValidate>
          <div className="mb-3.5">
            <Label
              htmlFor="admin-email"
              className="mb-1.5 block text-[12px] font-bold"
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
              className="h-auto w-full rounded-[12px] border-[#dfe7e3] px-[14px] py-[13px] text-sm"
            />
          </div>

          <div className="mb-[18px]">
            <Label
              htmlFor="admin-password"
              className="mb-1.5 block text-[12px] font-bold"
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
              className="h-auto w-full rounded-[12px] border-[#dfe7e3] px-[14px] py-[13px] text-sm"
            />
          </div>

          {inlineError ? (
            <p
              className="mb-3 text-[12px] font-semibold text-[#b3401f]"
              role="alert"
            >
              {inlineError}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="h-auto w-full rounded-full bg-[#12231f] px-5 py-[14px] font-bold text-white hover:bg-[#254b40] disabled:opacity-60"
          >
            {isLoggingIn ? 'Signing in…' : 'Sign in to console'}
          </Button>
        </form>

        <p className="mt-[22px] text-center text-[12px] text-[#687773]">
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
