export interface ProfileDetails {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  bio: string;
  /** Optional uploaded avatar (data URL or hosted URL). */
  avatarUrl: string | null;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
}

export interface PayoutMethod {
  /** Display label e.g. "bKash · 018XXXXXXXX". */
  label: string;
  /** Identifier used when routing to the change-method flow. */
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
  /** Wallet / mobile account number, when set. */
  account: string;
}

export interface ProfileOverview {
  profile: ProfileDetails;
  notifications: NotificationPreferences;
  payoutMethod: PayoutMethod;
  /** Shown under the name in the identity header, e.g. "Contributor". */
  roleLabel: string;
}

export interface UpdatePayoutMethodBody {
  method: PayoutMethod['method'];
  label: string;
  account: string;
}

export interface UpdateProfileBody {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl?: string | null;
}

export interface UpdatePasswordBody {
  password: string;
  currentPassword: string;
}

export interface UpdateNotificationsBody {
  email: boolean;
  inApp: boolean;
}

export interface ProfileUpdateResponse {
  updatedAt: string;
}

// ── Spec-aligned additions (REST spec §1.5–1.7) ───────────────────────────

export interface DisplayPreferences {
  language: 'en' | 'bn';
  density: 'comfortable' | 'compact';
  theme: 'light' | 'dark' | 'system';
}

export interface DisplayPreferencesBody {
  language?: DisplayPreferences['language'];
  density?: DisplayPreferences['density'];
  theme?: DisplayPreferences['theme'];
}