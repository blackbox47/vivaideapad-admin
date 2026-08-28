import { Outlet } from '@tanstack/react-router';

export default function AuthLayout() {
  return (
    <div className="min-h-svh bg-surface-subtle text-foreground">
      <Outlet />
    </div>
  );
}
