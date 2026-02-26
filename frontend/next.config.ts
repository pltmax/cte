import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@mockdata": path.resolve(__dirname, "../mockexamData"),
    },
  },
};

export default nextConfig;
