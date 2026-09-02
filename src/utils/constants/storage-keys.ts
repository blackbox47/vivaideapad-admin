export const AUTH_TOKEN_STORAGE_KEY = 'ideapad.admin.token';

/**
 * Set when the admin signs out so a mock session is not re-seeded on reload.
 */
export const SIGNED_OUT_STORAGE_KEY = 'ideapad.admin.signed-out';

/**
 * Creator workspace token. The token *value* may be the same JWT as the admin
 * key — the role is determined by *which* key holds it, not by parsing it.
 */
export const CREATOR_AUTH_TOKEN_STORAGE_KEY = 'ideapad.creator.token';

/**
 * Set when a creator signs out so a mock session is not re-seeded on reload.
 */
export const CREATOR_SIGNED_OUT_STORAGE_KEY = 'ideapad.creator.signed-out';

/**
 * Local storage key for dark/light theme preference.
 */
export const THEME_STORAGE_KEY = 'ideapad_theme_preference';

