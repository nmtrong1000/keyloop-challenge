export type AgeRange = "0-30" | "31-60" | "61-90" | "90-plus";
export type SortField = "make" | "model" | "intakeDate";
export type SortDir = "asc" | "desc";

export interface VehicleFilters {
  make?: string;
  model?: string;
  ageRange?: AgeRange;
}
