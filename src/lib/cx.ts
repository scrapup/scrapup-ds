export type ClassPart = string | false | null | undefined;

/** Joins truthy class names with a single space. */
export function cx(...parts: ClassPart[]): string {
  return parts.filter(Boolean).join(' ');
}
