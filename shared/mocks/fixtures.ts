import type { AgingVehicleAction, Vehicle } from "@/shared/types/api";

/**
 * Representative sample (thousands, not millions) exercising pagination
 * and filtering meaningfully, per the Mock Data Fidelity assumption (SRS)
 * and SDD §7's note that fixtures don't literally simulate millions of rows.
 */
const MAKE_MODELS: Array<{ make: string; model: string }> = [
  { make: "Honda", model: "Accord" },
  { make: "Honda", model: "Civic" },
  { make: "Toyota", model: "Camry" },
  { make: "Toyota", model: "Corolla" },
  { make: "Ford", model: "F-150" },
  { make: "Ford", model: "Escape" },
  { make: "Chevrolet", model: "Silverado" },
  { make: "Chevrolet", model: "Malibu" },
  { make: "Nissan", model: "Altima" },
  { make: "Nissan", model: "Rogue" },
  { make: "BMW", model: "3 Series" },
  { make: "Mercedes-Benz", model: "C-Class" },
  { make: "Hyundai", model: "Elantra" },
  { make: "Kia", model: "Sportage" },
  { make: "Volkswagen", model: "Jetta" },
];

const VEHICLE_COUNT = 2000;
const REFERENCE_DATE = new Date("2026-07-15T00:00:00.000Z");

function buildVehicles(): Vehicle[] {
  return Array.from({ length: VEHICLE_COUNT }, (_, i) => {
    const { make, model } = MAKE_MODELS[i % MAKE_MODELS.length];
    // Deterministic spread from 0 to 399 days ago, crossing all age buckets.
    const daysAgo = (i * 37) % 400;
    const intake = new Date(REFERENCE_DATE);
    intake.setUTCDate(intake.getUTCDate() - daysAgo);
    return {
      vin: `VIN${String(i).padStart(8, "0")}`,
      make,
      model,
      intakeDate: intake.toISOString().slice(0, 10),
    };
  });
}

export const vehicles: Vehicle[] = buildVehicles();

function seedActions(): AgingVehicleAction[] {
  const seeded: AgingVehicleAction[] = [];
  for (let i = 0; i < vehicles.length; i += 1) {
    // Seed one action on every 90th vehicle so a few aging vehicles already
    // have a current status to exercise that display without needing
    // a manual submission first.
    if (i % 90 === 0) {
      seeded.push({
        vehicleId: vehicles[i].vin,
        action: "Price Reduction Planned",
        timestamp: new Date(REFERENCE_DATE.getTime() - i * 1000).toISOString(),
      });
    }
  }
  return seeded;
}

/** Mutable, in-memory, session-scoped — append-only via the POST handler. No persistence beyond the session (SRS constraint). */
export const actions: AgingVehicleAction[] = seedActions();
