"use client";

import { useEffect, useState } from "react";

/**
 * Starts msw/browser before rendering children, so client-initiated
 * fetches (polling, mutations) are intercepted (SDD §5.3). Runs in every
 * environment, including production: the mock IS the backend here (SRS
 * constraint), there's no real one to fall back to.
 */
export function MockingProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import("@/shared/mocks/browser").then(({ worker }) =>
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setReady(true)),
    );
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
