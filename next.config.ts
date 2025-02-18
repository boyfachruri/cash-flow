import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pengaturan lainnya
  middleware: {
    '/main': ['middleware'], // Hanya rute /main yang dilindungi middleware
  },
};

export default nextConfig;
