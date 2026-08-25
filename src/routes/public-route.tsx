import { Navigate, Outlet } from 'react-router-dom';

import type { UserRole } from '@/models/auth/auth-model';
import { useAppSelector } from '@/store/hooks';
import { ADMIN_ROUTES, CREATOR_ROUTES } from '@/utils/constants/routes';

interface PublicRouteProps {
  requiredRole: UserRole;
}

const HOME_FOR_ROLE: Record<UserRole, string> = {
  admin: ADMIN_ROUTES.dashboard,
  creator: CREATOR_ROUTES.dashboard,
};

export default function PublicRoute({ requiredRole }: PublicRouteProps) {
  const { token, role } = useAppSelector((state) => state.auth);

  if (token && role && role === requiredRole) {
    // Already signed in for *this* workspace → push them to home.
    // If they're signed in for the *other* workspace, leave them alone so they
    // can still authenticate here (e.g. they typed the wrong URL).
    return <Navigate to={HOME_FOR_ROLE[role]} replace />;
  }

  return <Outlet />;
}
