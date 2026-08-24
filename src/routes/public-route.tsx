import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '@/store/hooks';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

export default function PublicRoute() {
  const token = useAppSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to={ADMIN_ROUTES.dashboard} replace />;
  }

  return <Outlet />;
}
