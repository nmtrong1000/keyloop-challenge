/** Wraps crypto.randomUUID() (SDD §6.3) — one call site to change if the ID scheme ever does. */
export function generateCorrelationId(): string {
  return crypto.randomUUID();
}
