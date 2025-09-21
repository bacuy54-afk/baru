/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // ← matikan ini
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true }, // boleh tetap
};

module.exports = nextConfig;
