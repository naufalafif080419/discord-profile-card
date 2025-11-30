/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed static export to enable dynamic metadata and API routes
  // DO NOT add output: 'export' - this enables server-side rendering
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig

