import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from '@/layouts/admin-layout';
import AuthLayout from '@/layouts/auth-layout';
import CreatorLayout from '@/layouts/creator-layout';
import AdminSignInPage from '@/pages/auth/admin-sign-in';
import CreatorLoginPage from '@/pages/auth/creator-login';
import LoginPage from '@/pages/auth/login';
import AdminsPage from '@/pages/admins';
import AuditLogPage from '@/pages/audit-log';
import ApplicantsPage from '@/pages/applicants';
import ContentReviewPage from '@/pages/content-review';
import CreatorDashboardPage from '@/pages/creator/dashboard';
import CreatorLeaderboardPage from '@/pages/creator/leaderboard';
import CreatorNotificationsPage from '@/pages/creator/notifications';
import CreatorProfilePage from '@/pages/creator/profile';
import CreatorRewardsPage from '@/pages/creator/rewards';
import MyIdeasPage from '@/pages/creator/my-ideas';
import OpportunitiesPage from '@/pages/creator/opportunities';
import SubmitIdeaPage from '@/pages/creator/submit-idea';
import DashboardPage from '@/pages/dashboard';
import LeaderboardPage from '@/pages/leaderboard';
import NotificationsPage from '@/pages/notifications';
import PayoutsPage from '@/pages/payouts';
import ProfilePage from '@/pages/profile';
import ReportsPage from '@/pages/reports';
import RewardsPage from '@/pages/rewards';
import TopicsPage from '@/pages/topics';
import PrivateRoute from '@/routes/private-route';
import PublicRoute from '@/routes/public-route';
import {
  ADMIN_BASE_PATH,
  ADMIN_ROUTES,
  CREATOR_ROUTES,
} from '@/utils/constants/routes';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin workspace */}
        <Route path={ADMIN_BASE_PATH}>
          <Route element={<PublicRoute requiredRole="admin" />}>
            <Route element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="sign-in" element={<AdminSignInPage />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute requiredRole="admin" />}>
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
              <Route path="admins" element={<AdminsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        {/* Creator workspace (top-level routes, no /creator prefix) */}
        <Route element={<PublicRoute requiredRole="creator" />}>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<CreatorLoginPage />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute requiredRole="creator" />}>
          <Route element={<CreatorLayout />}>
            <Route path="dashboard" element={<CreatorDashboardPage />} />
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="submissions" element={<MyIdeasPage />} />
            <Route path="rewards" element={<CreatorRewardsPage />} />
            <Route path="leaderboard" element={<CreatorLeaderboardPage />} />
            <Route
              path="notifications"
              element={<CreatorNotificationsPage />}
            />
            <Route path="profile" element={<CreatorProfilePage />} />
            <Route path="ideas/new" element={<SubmitIdeaPage />} />
            <Route
              path="ideas"
              element={<Navigate to={CREATOR_ROUTES.submissions} replace />}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to={ADMIN_ROUTES.login} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}