import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-svh bg-[#f6f8f5] text-foreground">
      <Outlet />
    </div>
  );
}
