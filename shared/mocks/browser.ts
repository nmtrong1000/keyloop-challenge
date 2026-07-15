import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/** Browser-side interception — intercepts client-initiated polling and mutations (SDD §5.3). */
export const worker = setupWorker(...handlers);
