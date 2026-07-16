import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/** Browser-side interception — intercepts client-initiated polling and mutations (SDD §5.3). */
export const worker = setupWorker(...handlers);

let resolveWorkerReady: () => void;
/** Resolves once the worker is intercepting; shared/http.ts awaits this so client fetches don't race startup. */
export const workerReady = new Promise<void>((resolve) => {
  resolveWorkerReady = resolve;
});
export function markWorkerReady() {
  resolveWorkerReady();
}
