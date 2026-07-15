export const AGING_THRESHOLD_DAYS = 90;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Derived, not stored — avoids staleness (SDD §3.1). */
export function daysInInventory(intakeDate: string, today: Date = new Date()): number {
  const intake = new Date(intakeDate);
  return Math.floor((today.getTime() - intake.getTime()) / MS_PER_DAY);
}

export function isAgingVehicle(intakeDate: string, today: Date = new Date()): boolean {
  return daysInInventory(intakeDate, today) > AGING_THRESHOLD_DAYS;
}
