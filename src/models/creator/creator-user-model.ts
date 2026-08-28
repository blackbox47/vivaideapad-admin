/**
 * Shape of the user object returned by the creator-auth endpoints.
 *
 * Mirrors `AuthUser` for parity but is its own type so the workspaces can
 * evolve independently. `name` and `initials` are kept here because the
 * creator backend (`/creator/me`) returns them; the admin backend only
 * returns `display_name`, which the SPA turns into initials at render time.
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
