import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // msw ships some ESM-only deps; transpiling lets both Next and Jest handle them.
  transpilePackages: [
    "msw",
    "@mswjs",
    "@bundled-es-modules",
    "rettime",
    "@open-draft",
    "strict-event-emitter",
    "outvariant",
    "is-node-process",
    "until-async",
    "headers-polyfill",
    "path-to-regexp",
    "type-fest",
    "picocolors",
    "statuses",
    "cookie",
    "tough-cookie",
  ],
};

export default nextConfig;
