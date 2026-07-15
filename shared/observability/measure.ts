/**
 * Emitted via the native Performance API (DevTools Performance timeline);
 * the collection destination is swappable without touching call sites,
 * same rationale as logEvent.ts. Fulfills SRS NFR — Time Behaviour.
 */
export function markStart(name: string): void {
  performance.mark(`${name}-start`);
}

export function markEnd(name: string): void {
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);
}
