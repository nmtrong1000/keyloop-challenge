import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const spec = yaml.load(
  fs.readFileSync(path.join(__dirname, "../openapi.yaml"), "utf8"),
) as {
  paths: Record<string, unknown>;
  components: { schemas: Record<string, unknown> };
};

describe("OpenAPI contract shape", () => {
  it("defines GET /vehicles and POST /vehicles/{id}/actions", () => {
    expect(Object.keys(spec.paths)).toEqual(
      expect.arrayContaining(["/vehicles", "/vehicles/{id}/actions"]),
    );
  });

  it("defines Vehicle, AgingVehicleAction, PagedVehicles, Error schemas", () => {
    expect(Object.keys(spec.components.schemas)).toEqual(
      expect.arrayContaining([
        "Vehicle",
        "AgingVehicleAction",
        "PagedVehicles",
        "Error",
      ]),
    );
  });

  it("GET /vehicles accepts page, pageSize, make, model, ageRange query params", () => {
    const params = (
      spec.paths["/vehicles"] as {
        get: { parameters: Array<{ name: string; in: string }> };
      }
    ).get.parameters.filter((p) => p.in === "query");
    const names = params.map((p) => p.name);
    expect(names).toEqual(
      expect.arrayContaining(["page", "pageSize", "make", "model", "ageRange"]),
    );
  });
});
