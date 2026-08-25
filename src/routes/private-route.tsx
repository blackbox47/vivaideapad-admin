import { Navigate, Outlet, useLocation } from 'react-router-dom';

import type { UserRole } from '@/models/auth/auth-model';
import { useAppSelector } from '@/store/hooks';
import { ADMIN_ROUTES, CREATOR_ROUTES } from '@/utils/constants/routes';

interface PrivateRouteProps {
  requiredRole: UserRole;
}

const LOGIN_FOR_ROLE: Record<UserRole, string> = {
  admin: ADMIN_ROUTES.login,
  creator: CREATOR_ROUTES.login,
};

const HOME_FOR_ROLE: Record<UserRole, string> = {
  admin: ADMIN_ROUTES.dashboard,
  creator: CREATOR_ROUTES.dashboard,
};

export default function PrivateRoute({ requiredRole }: PrivateRouteProps) {
  const { token, role } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token || !role) {
    return (
      <Navigate
        to={LOGIN_FOR_ROLE[requiredRole]}
        replace
        state={{ from: location }}
      />
    );
  }

  // Authenticated as the wrong role — bounce to that role's home.
  if (role !== requiredRole) {
    return <Navigate to={HOME_FOR_ROLE[role]} replace />;
  }

  return <Outlet />;
}
