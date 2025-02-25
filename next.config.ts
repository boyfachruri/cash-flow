// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   // Pengaturan lainnya
//   middleware: {
//     '/main': ['middleware'], // Hanya rute /main yang dilindungi middleware
//   },
// };

// export default nextConfig;

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Nonaktifkan PWA di development
});

module.exports = withPWA({
  // Konfigurasi Next.js lainnya
});



