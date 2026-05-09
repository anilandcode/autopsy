import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_LLM_MODEL: process.env.LLM_MODEL || "accounts/fireworks/models/kimi-k2p6",
  },
  transpilePackages: ["motion"],
};

export default nextConfig;
