import { format, isValid, parse } from 'date-fns';

export const DISPLAY_DATE_FORMAT = 'dd.MM.yyyy';

function toDate(value: string | Date): Date | undefined {
  if (value instanceof Date) {
    return isValid(value) ? value : undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) {
    const parsed = parse(trimmed, DISPLAY_DATE_FORMAT, new Date());
    return isValid(parsed) ? parsed : undefined;
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    const parsed = parse(trimmed, 'dd-MM-yyyy', new Date());
    return isValid(parsed) ? parsed : undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const date = new Date(trimmed);
  return isValid(date) ? date : undefined;
}

/** Formats a date or ISO/date string as `02.06.2026`. */
export function formatDisplayDate(
  value: string | Date | null | undefined,
): string {
  if (value == null || value === '') {
    return '';
  }

  const date = toDate(value);
  if (!date) {
    return typeof value === 'string' ? value : '';
  }

  return format(date, DISPLAY_DATE_FORMAT);
}
