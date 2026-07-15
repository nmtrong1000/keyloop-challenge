/**
 * Next.js instrumentation hook — starts msw/node before the server handles
 * any request, so Server Component fetches are intercepted (SDD §5.3).
 * Runs in every environment, including production: the mock IS the
 * backend here (SRS constraint), there's no real one to fall back to.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { server } = await import("@/shared/mocks/server");
    server.listen({ onUnhandledRequest: "bypass" });
  }
}
