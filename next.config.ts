// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   // Pengaturan lainnya
//   middleware: {
//     '/main': ['middleware'], // Hanya rute /main yang dilindungi middleware
//   },
// };

// export default nextConfig;

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
});



