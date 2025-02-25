self.addEventListener("install", (event) => {
  console.log("Service Worker terinstall!");
  self.skipWaiting(); // Paksa update langsung berlaku
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker aktif!");
  clients.claim(); // Paksa halaman menggunakan Service Worker terbaru
});

self.addEventListener("fetch", (event) => {
  // Bisa tambahkan cache di sini kalau perlu
});
