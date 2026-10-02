function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

/**
 * Returns `value` when it is one of `allowed`, otherwise `fallback` (D-05).
 * Accepts `unknown` so untyped consumer input degrades to the documented default.
 */
export function resolveOption<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return isOneOf(value, allowed) ? value : fallback;
}
