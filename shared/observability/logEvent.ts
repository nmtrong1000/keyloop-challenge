export interface LogPayload {
  [key: string]: unknown;
}

/**
 * Emitted as structured JSON to console.log; the destination is swappable
 * without touching call sites (SDD §6.1). Fulfills SRS NFR — Logging.
 */
export function logEvent(event: string, payload: LogPayload = {}): void {
  console.log(JSON.stringify({ event, timestamp: new Date().toISOString(), ...payload }));
}
