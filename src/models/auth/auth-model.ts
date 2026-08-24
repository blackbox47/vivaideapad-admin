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
}
