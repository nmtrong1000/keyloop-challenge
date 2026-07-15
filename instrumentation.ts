/**
 * Next.js instrumentation hook — starts msw/node before the server handles
 * any request, so Server Component fetches are intercepted (SDD §5.3).
 * Gated to Node + non-production: this is a mock, not a real backend.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV !== "production") {
    const { server } = await import("@/shared/mocks/server");
    server.listen({ onUnhandledRequest: "bypass" });
  }
}
