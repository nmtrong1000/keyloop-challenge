import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** Node-side interception — registered via instrumentation.ts for RSC fetches (SDD §5.3). */
export const server = setupServer(...handlers);
