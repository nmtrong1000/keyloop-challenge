import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } });
}

let browserQueryClient: QueryClient | undefined;

/** Fresh QueryClient per request on the server; one singleton reused across renders in the browser. */
export function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
