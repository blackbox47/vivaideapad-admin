import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from '@/layouts/admin-layout';
import AuthLayout from '@/layouts/auth-layout';
import AdminSignInPage from '@/pages/auth/admin-sign-in';
import AuditLogPage from '@/pages/audit-log';
import LoginPage from '@/pages/auth/login';
import ApplicantsPage from '@/pages/applicants';
import ContentReviewPage from '@/pages/content-review';
import DashboardPage from '@/pages/dashboard';
import LeaderboardPage from '@/pages/leaderboard';
import PayoutsPage from '@/pages/payouts';
import ProfilePage from '@/pages/profile';
import ReportsPage from '@/pages/reports';
import RewardsPage from '@/pages/rewards';
import TopicsPage from '@/pages/topics';
import PrivateRoute from '@/routes/private-route';
import PublicRoute from '@/routes/public-route';
import { ADMIN_BASE_PATH, ADMIN_ROUTES } from '@/utils/constants/routes';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ADMIN_BASE_PATH}>
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="sign-in" element={<AdminSignInPage />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="topics" element={<TopicsPage />} />
              <Route path="applicants" element={<ApplicantsPage />} />
              <Route path="content-review" element={<ContentReviewPage />} />
              <Route path="rewards" element={<RewardsPage />} />
              <Route path="payouts" element={<PayoutsPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="audit-log" element={<AuditLogPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to={ADMIN_ROUTES.dashboard} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
