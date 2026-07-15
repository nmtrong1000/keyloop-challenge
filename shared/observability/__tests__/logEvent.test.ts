import { logEvent } from "../logEvent";

describe("logEvent", () => {
  it("emits structured JSON with event name, timestamp, and payload to console.log", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    logEvent("inventory.viewed", { count: 42 });

    expect(spy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.event).toBe("inventory.viewed");
    expect(logged.count).toBe(42);
    expect(typeof logged.timestamp).toBe("string");
    expect(new Date(logged.timestamp).toString()).not.toBe("Invalid Date");

    spy.mockRestore();
  });

  it("defaults to an empty payload", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    logEvent("inventory.viewed");
    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.event).toBe("inventory.viewed");
    spy.mockRestore();
  });
});
