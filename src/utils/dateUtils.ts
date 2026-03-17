/**
 * Converts a Firestore timestamp-like value (Date, number, string, or object
 * with `toDate`) into a JavaScript Date instance.
 */
export const toDate = (value: unknown): Date | null => {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'number') {
    return new Date(value);
  }

  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (value as any).toDate();
    } catch {
      return null;
    }
  }

  return null;
};

/**
 * Formats a date as a short, human-readable string.
 */
export const formatShortDateTime = (date: Date | null | undefined): string => {
  if (!date) return '';

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

