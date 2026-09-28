export function formatCount(target: number, progress: number, prefix = '', suffix = ''): string {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return `${prefix}${Math.round(target * clamped)}${suffix}`;
}
