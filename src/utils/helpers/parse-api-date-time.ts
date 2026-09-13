/**
 * Parse API timestamps into a reliable UTC ISO string for relative time labels.
 *
 * Historical notification rows were stored as MySQL DATETIME wall-clock values
 * in Asia/Dhaka (+06:00). Prefer explicit offsets / `Z` when present; otherwise
 * treat timezone-less strings as Asia/Dhaka (not browser-local, not bare UTC).
 */
export function parseApiDateTime(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return new Date(0).toISOString();

    const hasZone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(trimmed);
    if (hasZone) {
      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
    }

    const mysqlLike = trimmed.match(
      /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,6}))?)?/,
    );
    if (mysqlLike) {
      const [, y, mo, d, h, mi, s = '0', frac = '0'] = mysqlLike;
      const ms = Number((frac + '000').slice(0, 3));
      // Interpret wall clock as Asia/Dhaka (UTC+6).
      return new Date(
        Date.UTC(
          Number(y),
          Number(mo) - 1,
          Number(d),
          Number(h) - 6,
          Number(mi),
          Number(s),
          ms,
        ),
      ).toISOString();
    }

    const fallback = new Date(trimmed);
    if (!Number.isNaN(fallback.getTime())) return fallback.toISOString();
  }

  if (value != null && typeof value === 'object' && 'toString' in value) {
    return parseApiDateTime(String(value));
  }

  return new Date(0).toISOString();
}
