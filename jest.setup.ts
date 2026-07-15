import "@testing-library/jest-dom";

// jsdom's Performance implementation doesn't include mark/measure (used for
// the SRS Time Behaviour NFR instrumentation, SDD §6.2) — polyfill minimally
// so components using them don't crash under test; real browsers have both.
if (typeof performance.mark !== "function") {
  performance.mark = (() => undefined) as unknown as typeof performance.mark;
}
if (typeof performance.measure !== "function") {
  performance.measure = (() => undefined) as unknown as typeof performance.measure;
}
