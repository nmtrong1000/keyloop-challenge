"use client";

import { useEffect, useState } from "react";

/**
 * Starts msw/browser before rendering children, so client-initiated
 * fetches (polling, mutations) are intercepted (SDD §5.3). Dev-only —
 * this is a mock, not a real backend.
 */
export function MockingProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(process.env.NODE_ENV === "production");

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    import("@/shared/mocks/browser").then(({ worker }) =>
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setReady(true)),
    );
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
