import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@the-early-kickoff/auth", "@the-early-kickoff/db"],
};

export default nextConfig;
