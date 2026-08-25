/**
 * Shape of the user object returned by the creator-auth endpoints.
 *
 * Mirrors `AdminUser` for parity but is its own type so the workspaces can
 * evolve independently.
 */
export interface CreatorUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  /** Display-only — not the same as the route-gating `UserRole`. */
  bio?: string;
  joined?: string;
}
