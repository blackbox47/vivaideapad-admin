import type {
  PayoutMethod,
  ProfileOverview,
  PublicDisplay,
} from '@/models/profile/profile-model';
import { deriveInitials } from '@/utils/helpers/initials';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function isPublicDisplay(value: unknown): value is PublicDisplay {
  return value === 'Public name' || value === 'Pseudonymous';
}

function isPayoutMethod(value: unknown): value is PayoutMethod['method'] {
  return (
    value === 'bKash' ||
    value === 'Nagad' ||
    value === 'Rocket' ||
    value === 'Bank'
  );
}

function payoutMethodFromWire(raw: unknown): PayoutMethod {
  if (!isRecord(raw)) {
    return { method: 'bKash', label: 'bKash · 018•••42' };
  }

  const type = asString(raw.type || raw.method, 'bKash');
  const normalized =
    type.toLowerCase() === 'bkash'
      ? 'bKash'
      : type.toLowerCase() === 'nagad'
        ? 'Nagad'
        : type.toLowerCase() === 'rocket'
          ? 'Rocket'
          : type.toLowerCase() === 'bank'
            ? 'Bank'
            : isPayoutMethod(type)
              ? type
              : 'bKash';

  const account = asString(raw.account);
  const label =
    asString(raw.label) ||
    (account ? `${normalized} · ${account}` : normalized);

  return { method: normalized, label };
}

function roleLabelFrom(role: unknown, fallback: string): string {
  if (role === 1) {
    return 'Super Admin';
  }
  if (role === 2) {
    return 'Administrator';
  }
  if (role === 3) {
    return 'Contributor';
  }
  if (typeof role === 'string' && role.trim()) {
    const lower = role.toLowerCase();
    if (lower === 'contributor') return 'Contributor';
    if (lower === 'administrator' || lower === 'admin') return 'Administrator';
    if (lower === 'superadmin' || lower === 'super_admin') return 'Super Admin';
  }
  return fallback;
}

const emptyOverview = (roleLabel: string): ProfileOverview => ({
  profile: {
    id: '',
    name: '',
    initials: '',
    email: '',
    phone: '',
    bio: '',
    publicDisplay: 'Public name',
    avatarUrl: null,
  },
  notifications: { email: true, inApp: true },
  payoutMethod: { method: 'bKash', label: 'bKash · 018•••42' },
  roleLabel,
});

export function toProfileOverview(
  response: unknown,
  fallbackRoleLabel: string,
): ProfileOverview {
  if (!isRecord(response)) {
    return emptyOverview(fallbackRoleLabel);
  }

  if (isRecord(response.profile) && typeof response.profile.name === 'string') {
    return response as unknown as ProfileOverview;
  }

  const prefs = isRecord(response.display_prefs) ? response.display_prefs : {};
  const nestedProfile = isRecord(response.profile) ? response.profile : {};
  const nestedPrefs = isRecord(response.preferences)
    ? response.preferences
    : {};
  const notifications: Record<string, unknown> = isRecord(
    response.notifications,
  )
    ? response.notifications
    : isRecord(prefs.notifications)
      ? prefs.notifications
      : nestedPrefs;

  const displayName =
    asString(response.display_name) ||
    asString(response.name) ||
    asString(nestedProfile.name);
  const email = asString(response.email);
  const phone =
    asString(response.phone) ||
    asString(prefs.phone) ||
    asString(nestedProfile.phone);
  const bio = asString(response.bio) || asString(nestedProfile.bio);
  const publicDisplayRaw =
    response.public_display ??
    response.publicDisplay ??
    prefs.public_display ??
    prefs.publicDisplay;
  const avatarUrl =
    asString(response.avatar_url) ||
    asString(nestedProfile.avatar_url) ||
    asString(response.avatarUrl) ||
    '';

  return {
    profile: {
      id: asString(response.id),
      name: displayName,
      initials: deriveInitials(displayName, email),
      email,
      phone,
      bio,
      publicDisplay: isPublicDisplay(publicDisplayRaw)
        ? publicDisplayRaw
        : 'Public name',
      avatarUrl: avatarUrl || null,
    },
    notifications: {
      email:
        notifications.email === false ||
        notifications.email_notifications === false
          ? false
          : true,
      inApp:
        notifications.inApp === false || notifications.in_app === false
          ? false
          : true,
    },
    payoutMethod: payoutMethodFromWire(
      response.payout_method ?? prefs.payout_method ?? response.payoutMethod,
    ),
    roleLabel: roleLabelFrom(response.role, fallbackRoleLabel),
  };
}
