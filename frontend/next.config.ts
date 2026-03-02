import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Disallow embedding in iframes (clickjacking protection)
          { key: "X-Frame-Options", value: "DENY" },
          // Legacy XSS filter (belt-and-suspenders for older browsers)
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Do not send the full referrer to cross-origin destinations
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restrict browser feature APIs not used by this app
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  turbopack: {
    resolveAlias: {
      "@mockdata": path.resolve(__dirname, "../mockexamData"),
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/choppetonexam_toeic/**",
      },
    ],
  },
};

export default nextConfig;
