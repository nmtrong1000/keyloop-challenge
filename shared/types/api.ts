import type { components } from "./api.gen";

export type Vehicle = components["schemas"]["Vehicle"];
export type AgingVehicleAction = components["schemas"]["AgingVehicleAction"];
export type PagedVehicles = components["schemas"]["PagedVehicles"];
export type ApiError = components["schemas"]["Error"];

export type AgeRange = "0-30" | "31-60" | "61-90" | "90-plus";
export type SortField = "make" | "model" | "intakeDate";
export type SortDir = "asc" | "desc";
