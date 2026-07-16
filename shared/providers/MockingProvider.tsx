"use client";

import { useEffect } from "react";

/**
 * Starts msw/browser in the background so client-initiated fetches
 * (polling, mutations) are intercepted (SDD §5.3). Renders children
 * immediately — the initial page is server-rendered with real data
 * (app/page.tsx's prefetch), so nothing needs to wait on this; shared/http.ts
 * awaits `workerReady` before any client-side fetch instead.
 */
export function MockingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import("@/shared/mocks/browser").then(({ worker, markWorkerReady }) =>
      worker.start({ onUnhandledRequest: "bypass" }).then(markWorkerReady),
    );
  }, []);

  return <>{children}</>;
}
