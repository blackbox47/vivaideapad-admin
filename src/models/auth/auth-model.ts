/**
 * Workspace role discriminator. `AdminUser.role` (below) is a *display* string
 * ("Platform owner") — `UserRole` is the route-gating claim attached to every
 * login response. The two are intentionally independent.
 */
export type UserRole = 'admin' | 'creator';

export interface AdminUser {
  id: string;
  name: string;
  role: string;
  initials: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
  role: UserRole;
}
