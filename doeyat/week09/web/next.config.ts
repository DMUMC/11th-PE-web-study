import type { NextConfig } from 'next';
const backend = process.env.BACKEND_URL || 'http://127.0.0.1:8089';
const config: NextConfig = {
  async rewrites() { return [{ source: '/api/:path*', destination: `${backend}/:path*` }]; },
};
export default config;
