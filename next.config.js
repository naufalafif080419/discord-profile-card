/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed static export to enable dynamic metadata and API routes
  // DO NOT add output: 'export' - this enables server-side rendering
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // This '*' is what makes it universal.
            // It tells the browser ANY site can frame this content.
            value: "frame-ancestors *",
          },
          {
            key: "X-Frame-Options",
            // We set this to ALLOWALL so older browsers don't block it either.
            value: "ALLOWALL",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

