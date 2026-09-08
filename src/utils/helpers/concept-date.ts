import { format, isValid, parse, startOfDay } from 'date-fns';

const DISPLAY_FORMAT = 'd MMM';

const TYPED_FORMATS = [
  'd MMM',
  'd MMMM',
  'd MMM yyyy',
  'd MMMM yyyy',
  'd/M/yyyy',
  'dd/MM/yyyy',
  'yyyy-MM-dd',
  'd-M-yyyy',
] as const;

export function formatConceptDate(date: Date): string {
  return format(date, DISPLAY_FORMAT);
}

export function parseTypedConceptDate(raw: string): Date | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  for (const pattern of TYPED_FORMATS) {
    const parsed = parse(trimmed, pattern, new Date());
    if (isValid(parsed)) {
      return startOfDay(parsed);
    }
  }

  return undefined;
}

export function parseInitialDate(raw?: string): Date | undefined {
  if (!raw) return undefined;
  const fromTyped = parseTypedConceptDate(raw);
  if (fromTyped) return fromTyped;
  const direct = new Date(raw);
  return isValid(direct) ? startOfDay(direct) : undefined;
}
