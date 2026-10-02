export function uncovered(value: number): number {
  if (value > 1) return value * 2;
  if (value < -1) return value * 3;
  return value;
}
