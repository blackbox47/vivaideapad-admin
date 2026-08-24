import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@/store/hooks';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

export default function PrivateRoute() {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();

  if (!token) {
    return (
      <Navigate to={ADMIN_ROUTES.login} replace state={{ from: location }} />
    );
  }

  return <Outlet />;
}
